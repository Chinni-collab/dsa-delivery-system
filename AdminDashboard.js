import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  Tooltip,

  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrderIcon,
  People as UsersIcon,
  LocalShipping as DeliveryIcon,
  Notifications as NotificationIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Assignment as AssignIcon,
  Delete as DeleteIcon,

  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from './shared/DashboardHeader';

function AdminDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [realTimeUpdates] = useState(true);

  useEffect(() => {
    loadData();
    loadNotifications();
    
    const interval = setInterval(() => {
      loadData();
      loadNotifications();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Try direct API calls first
    let ordersResponse, usersResponse;
    ordersResponse = await api.orders.debugAll().catch(() => api.orders.getAll());
    setOrders(ordersResponse.data?.orders || ordersResponse.data || []);
    
    usersResponse = await axios.get('http://localhost:8082/api/users').catch(() => api.users.getAll());
    setUsers(usersResponse.data || []);
    
    setLoading(false);
  };
  
  const loadNotifications = async () => {
    // Get all notifications for admin
    const response = await axios.get('http://localhost:8085/api/notifications/debug/all')
      .catch(() => api.notifications.getByUserDirect(user.id))
      .catch(() => ({ data: [] }));
    const sortedNotifications = (response.data?.notifications || response.data || []).sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
    setNotifications(sortedNotifications);
  };
  
  const markNotificationAsRead = async (notificationId) => {
    await axios.put(`http://localhost:8085/api/notifications/${notificationId}/read`)
      .then(() => loadNotifications())
      .catch(() => showToast('Failed to mark notification as read', 'error'));
  };
  
  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    Promise.all(unreadNotifications.map(n => 
      axios.put(`http://localhost:8085/api/notifications/${n.id}/read`)
    ))
    .then(() => loadNotifications())
    .catch(() => showToast('Failed to mark all notifications as read', 'error'));
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Try direct API first, fallback to gateway
    await axios.put(`http://localhost:8083/api/orders/${orderId}/status?status=${newStatus}`)
      .then(() => {
        showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
        loadData();
      })
      .catch(() => showToast('Failed to update order status', 'error'));
  };

  const handleAssignDelivery = async (orderId, deliveryPersonId) => {
    // Find the order to get pickup and delivery addresses
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      showToast('Order not found', 'error');
      return;
    }
    
    // Create delivery record
    const deliveryData = {
      orderId: orderId,
      deliveryPersonId: parseInt(deliveryPersonId),
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress,
      currentLocation: 'Warehouse'
    };
    
    // Try direct API first
    await axios.post('http://localhost:8084/api/deliveries', deliveryData)
      .catch(() => api.deliveries.create(deliveryData))
      .then(() => loadData())
      .catch(() => showToast('Failed to assign delivery. Please try again.', 'error'));
  };

  const deleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      // Try direct API first
      await axios.delete(`http://localhost:8082/api/users/${userId}`)
        .then(() => {
          showToast(`User "${userName}" deleted successfully`, 'success');
          loadData();
        })
        .catch(() => showToast('Failed to delete user. Please try again.', 'error'));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      case 'ASSIGNED': return 'info';
      case 'TRANSIT': return 'primary';
      default: return 'default';
    }
  };

  const getProgressGradient = (orders) => {
    const pendingCount = orders.filter(o => o.status === 'PENDING').length;
    const totalCount = Math.max(orders.length, 1);
    const percentage = (pendingCount / totalCount) * 100;
    return `conic-gradient(from 0deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`;
  };

  const getUserTypeColor = (userType) => {
    if (userType === 'ADMIN') return 'error';
    if (userType === 'DELIVERY_PERSON') return 'info';
    return 'default';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
      '@keyframes fadeInUp': {
        '0%': {
          opacity: 0,
          transform: 'translateY(30px)'
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)'
        }
      },
      '@keyframes pulse': {
        '0%, 100%': {
          opacity: 1
        },
        '50%': {
          opacity: 0.5
        }
      },
      '@keyframes slideInLeft': {
        '0%': {
          transform: 'translateX(-100px)',
          opacity: 0
        },
        '100%': {
          transform: 'translateX(0)',
          opacity: 1
        }
      }
    }}>
      <Container maxWidth="lg">
        <DashboardHeader
          title="Admin Dashboard"
          subtitle={`Welcome back, ${user.name}! 👋`}
          icon={DashboardIcon}
          onRefresh={() => { loadData(); loadNotifications(); }}
        />

        {/* Business Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s'
              },
              '&:hover': {
                transform: 'translateY(-8px) rotateX(5deg) rotateY(5deg)',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.5)',
                '&::before': {
                  left: '100%'
                }
              },
              '&:active': {
                transform: 'translateY(-2px) scale(0.98)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <OrderIcon sx={{ fontSize: 32, opacity: 0.9 }} />
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {orders.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Total Orders
                </Typography>
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '0 0 12px 12px',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    height: '100%',
                    width: '100%',
                    background: 'rgba(255,255,255,0.4)',
                    animation: 'pulse 2s infinite'
                  }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s'
              },
              '&:hover': {
                transform: 'translateY(-8px) rotateX(5deg) rotateY(-5deg)',
                boxShadow: '0 20px 60px rgba(240, 147, 251, 0.5)',
                '&::before': {
                  left: '100%'
                }
              },
              '&:active': {
                transform: 'translateY(-2px) scale(0.98)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: getProgressGradient(orders),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingIcon sx={{ fontSize: 32, opacity: 0.9 }} />
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {orders.filter(o => o.status === 'PENDING').length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Pending Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s'
              },
              '&:hover': {
                transform: 'translateY(-8px) rotateX(-5deg) rotateY(5deg)',
                boxShadow: '0 20px 60px rgba(79, 172, 254, 0.5)',
                '&::before': {
                  left: '100%'
                }
              },
              '&:active': {
                transform: 'translateY(-2px) scale(0.98)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <UsersIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {users.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s'
              },
              '&:hover': {
                transform: 'translateY(-8px) rotateX(5deg) rotateY(-5deg)',
                boxShadow: '0 20px 60px rgba(67, 233, 123, 0.5)',
                '&::before': {
                  left: '100%'
                }
              },
              '&:active': {
                transform: 'translateY(-2px) scale(0.98)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <DeliveryIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {users.filter(u => u.userType === 'DELIVERY_PERSON').length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Delivery Staff
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(250, 112, 154, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s'
              },
              '&:hover': {
                transform: 'translateY(-8px) rotateX(-5deg) rotateY(5deg)',
                boxShadow: '0 20px 60px rgba(250, 112, 154, 0.5)',
                '&::before': {
                  left: '100%'
                }
              },
              '&:active': {
                transform: 'translateY(-2px) scale(0.98)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <NotificationIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {notifications.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Notifications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Orders Table */}
        <Paper sx={{
          width: '100%',
          overflow: 'hidden',
          mb: 4,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'slideInLeft 0.8s ease-out 0.6s both'
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <OrderIcon sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Order Management
            </Typography>
          </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer ID</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customerId}</TableCell>
                  <TableCell>{order.itemDescription}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      if (order.status === 'PENDING') {
                        return (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Confirm Order">
                              <Button 
                                size="small" 
                                variant="contained"
                                startIcon={<CheckIcon />}
                                sx={{
                                  background: 'linear-gradient(45deg, #43e97b, #38f9d7)',
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #38f9d7, #43e97b)'
                                  }
                                }}
                                onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                              >
                                Confirm
                              </Button>
                            </Tooltip>
                            <Tooltip title="Cancel Order">
                              <Button 
                                size="small" 
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                color="error"
                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                              >
                                Cancel
                              </Button>
                            </Tooltip>
                          </Box>
                        );
                      }
                      if (order.status === 'CONFIRMED') {
                        return (
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel sx={{ color: '#667eea' }}>Assign Delivery</InputLabel>
                            <Select
                              value=""
                              onChange={(e) => handleAssignDelivery(order.id, e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#667eea'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#764ba2'
                                }
                              }}
                            >
                              {users.filter(u => u.userType === 'DELIVERY_PERSON').map(person => (
                                <MenuItem key={person.id} value={person.id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AssignIcon sx={{ fontSize: 16, color: '#667eea' }} />
                                    {person.name}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      }
                      return (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#667eea'
                              }
                            }}
                          >
                            <MenuItem value="ASSIGNED">ASSIGNED</MenuItem>
                            <MenuItem value="PICKUP">PICKUP</MenuItem>
                            <MenuItem value="TRANSIT">TRANSIT</MenuItem>
                            <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                          </Select>
                        </FormControl>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

        {/* Users Table */}
        <Paper sx={{
          width: '100%',
          overflow: 'hidden',
          mb: 4,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <UsersIcon sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              User Management
            </Typography>
          </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((userItem) => (
                <TableRow key={userItem.id}>
                  <TableCell>{userItem.id}</TableCell>
                  <TableCell>{userItem.name}</TableCell>
                  <TableCell>{userItem.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={userItem.userType} 
                      color={getUserTypeColor(userItem.userType)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{userItem.phone}</TableCell>
                  <TableCell>
                    {userItem.userType !== 'ADMIN' && (
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteUser(userItem.id, userItem.name)}
                          sx={{
                            '&:hover': {
                              background: 'rgba(244, 67, 54, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
        
        {/* Notifications Section */}
        <Paper sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NotificationIcon sx={{ fontSize: 28 }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    System Notifications
                  </Typography>
                  <Badge 
                    badgeContent={notifications.filter(n => !n.isRead).length} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        background: 'rgba(255,255,255,0.9)',
                        color: '#fa709a',
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    <Box />
                  </Badge>
                  {realTimeUpdates && (
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#4caf50',
                      animation: 'pulse 2s infinite'
                    }} />
                  )}
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total: {notifications.length} | Unread: {notifications.filter(n => !n.isRead).length}
                </Typography>
                {loading && (
                  <LinearProgress 
                    sx={{ 
                      mt: 1, 
                      borderRadius: 1,
                      '& .MuiLinearProgress-bar': {
                        background: 'rgba(255,255,255,0.7)'
                      }
                    }} 
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    loadNotifications();
                  }}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '& .MuiSvgIcon-root': { color: 'white' }
                  }}
                >
                  <MenuItem value="latest">Latest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                size="small"
                onClick={markAllAsRead}
                disabled={notifications.filter(n => !n.isRead).length === 0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                Mark All Read
              </Button>
            </Box>
          </Box>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="textSecondary" variant="h6">
                No notifications yet.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
              {notifications.map((notification) => (
                <Alert 
                  key={notification.id}
                  severity={notification.isRead ? 'info' : 'success'}
                  sx={{
                    mb: 1,
                    cursor: 'pointer',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(5px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onClick={() => !notification.isRead && markNotificationAsRead(notification.id)}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      <strong>User {notification.userId}:</strong> {notification.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(notification.createdAt).toLocaleString()} | Type: {notification.type}
                    </Typography>
                  </Box>
                </Alert>
              ))}
            </Box>
          )}
        </Paper>
        
        {/* Floating Speed Dial */}
        <SpeedDial
          ariaLabel="Admin Actions"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            '& .MuiFab-primary': {
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2, #667eea)'
              }
            }
          }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<RefreshIcon />}
            title="Refresh All Data"
            onClick={() => {
              loadData();
              loadNotifications();
            }}
            sx={{
              '& .MuiFab-primary': {
                background: 'linear-gradient(45deg, #43e97b, #38f9d7)'
              }
            }}
          />
          <SpeedDialAction
            icon={<AnalyticsIcon />}
            title="View Analytics"
            onClick={() => showToast('Analytics feature coming soon!', 'info')}
            sx={{
              '& .MuiFab-primary': {
                background: 'linear-gradient(45deg, #4facfe, #00f2fe)'
              }
            }}
          />
          <SpeedDialAction
            icon={<DownloadIcon />}
            title="Export Data"
            onClick={() => showToast('Export feature coming soon!', 'info')}
            sx={{
              '& .MuiFab-primary': {
                background: 'linear-gradient(45deg, #fa709a, #fee140)'
              }
            }}
          />
          <SpeedDialAction
            icon={<SettingsIcon />}
            title="Settings"
            onClick={() => showToast('Settings feature coming soon!', 'info')}
            sx={{
              '& .MuiFab-primary': {
                background: 'linear-gradient(45deg, #f093fb, #f5576c)'
              }
            }}
          />
        </SpeedDial>
        
        {/* Toast Notifications */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setToast({ ...toast, open: false })} 
            severity={toast.severity}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default AdminDashboard;