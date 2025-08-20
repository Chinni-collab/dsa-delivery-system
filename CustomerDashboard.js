import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar,
  Badge,
  LinearProgress,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add,
  Refresh,
  ShoppingCart as OrderIcon,

  CheckCircle as CompletedIcon,
  Notifications as NotificationIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  BugReport as DebugIcon,
  Timeline as ActiveIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,

  History as HistoryIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    itemDescription: '',
    weight: '',
    preferredDeliveryTime: ''
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [realTimeUpdates] = useState(true);

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  useEffect(() => {
    loadOrders();
    loadNotifications();
    
    const interval = setInterval(() => {
      loadOrders();
      loadNotifications();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    // Try direct API first
    const response = await api.orders.getByCustomerDirect(user.id)
      .catch(() => api.orders.getByCustomer(user.id))
      .catch(() => ({ data: [] }));
    setOrders(response.data || []);
  };

  const loadNotifications = async () => {
    // Try direct API first
    const response = await api.notifications.getByUserDirect(user.id)
      .catch(() => api.notifications.getByUser(user.id))
      .catch(() => ({ data: [] }));
    
    const sortedNotifications = (response.data || []).sort((a, b) => {
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
  
  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8083/api/orders/${orderId}`);
      setMessage('Order deleted successfully!');
      loadOrders();
    } catch (error) {
      setMessage('Failed to delete order');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const orderData = {
      customerId: parseInt(user.id),
      pickupAddress: formData.pickupAddress,
      deliveryAddress: formData.deliveryAddress,
      itemDescription: formData.itemDescription,
      weight: parseFloat(formData.weight),
      preferredDeliveryTime: formData.preferredDeliveryTime
    };

    // Try direct API first
    await api.orders.createDirect(orderData)
      .catch(() => api.orders.create(orderData))
      .then(() => {
        setMessage('Order placed successfully!');
        setShowOrderForm(false);
        setFormData({
          pickupAddress: '',
          deliveryAddress: '',
          itemDescription: '',
          weight: '',
          preferredDeliveryTime: ''
        });
        setTimeout(() => loadOrders(), 1000);
      })
      .catch((error) => {
        setMessage('Failed to place order: ' + (error.response?.data?.message || error.message));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'ASSIGNED': return 'primary';
      case 'PICKUP': return 'primary';
      case 'TRANSIT': return 'primary';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
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
      }
    }}>
      <Container maxWidth="lg">
        {/* Sticky Header Section */}
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          p: 3,
          mb: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'sticky',
          top: 20,
          zIndex: 100,
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                width: 56,
                height: 56
              }}>
                <PersonIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}>
                  Welcome back, {user.name}! 👋
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Manage your orders and track deliveries
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={loadOrders}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #764ba2, #667eea)'
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Debug API">
                <IconButton
                  color="secondary"
                  onClick={() => showToast('Debug feature disabled in production', 'info')}
                >
                  <DebugIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Floating Speed Dial */}
        <SpeedDial
          ariaLabel="Customer Actions"
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
            icon={<Add />}
            title="Place New Order"
            onClick={() => setShowOrderForm(true)}
            sx={{
              '& .MuiFab-primary': {
                background: 'linear-gradient(45deg, #43e97b, #38f9d7)'
              }
            }}
          />
          <SpeedDialAction
            icon={<HistoryIcon />}
            title="Order History"
            onClick={() => showToast('Order history feature coming soon!', 'info')}
            sx={{
              '& .MuiFab-primary': {
                background: 'linear-gradient(45deg, #4facfe, #00f2fe)'
              }
            }}
          />
          <SpeedDialAction
            icon={<AnalyticsIcon />}
            title="My Analytics"
            onClick={() => showToast('Analytics feature coming soon!', 'info')}
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

        {message && (
          <Alert 
            severity={message.includes('success') ? 'success' : 'error'} 
            sx={{
              mb: 3,
              borderRadius: 3,
              background: message.includes('success') 
                ? 'rgba(76, 175, 80, 0.1)' 
                : 'rgba(244, 67, 54, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {message}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3} sx={{ animation: 'fadeInUp 0.8s ease-out 0.1s both' }}>
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
          <Grid item xs={12} sm={6} md={3} sx={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
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
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <ActiveIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Active Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ animation: 'fadeInUp 0.8s ease-out 0.3s both' }}>
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
                transform: 'translateY(-8px) rotateX(-5deg) rotateY(5deg)',
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
                <CompletedIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Delivered
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
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
                transform: 'translateY(-8px) rotateX(5deg) rotateY(-5deg)',
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
                  {notifications.filter(n => !n.isRead).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  New Alerts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog 
          open={showOrderForm} 
          onClose={() => setShowOrderForm(false)} 
          maxWidth="sm" 
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }
            }
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Add />
            Place New Order
          </DialogTitle>
        <form onSubmit={(e) => handleSubmit(e)}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Pickup Address"
              fullWidth
              variant="outlined"
              value={formData.pickupAddress}
              onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Delivery Address"
              fullWidth
              variant="outlined"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Item Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.itemDescription}
              onChange={(e) => setFormData({...formData, itemDescription: e.target.value})}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Weight (kg)"
              type="number"
              slotProps={{ htmlInput: { step: 0.1, min: 0.1 } }}
              fullWidth
              variant="outlined"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Preferred Delivery Time"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={formData.preferredDeliveryTime}
              onChange={(e) => setFormData({...formData, preferredDeliveryTime: e.target.value})}
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowOrderForm(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Place Order'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
          animation: 'fadeInUp 0.8s ease-out 0.5s both'
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
              My Orders ({orders.length})
            </Typography>
          </Box>
          {orders.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <OrderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="textSecondary" variant="h6">
                No orders found. Place your first order!
              </Typography>
            </Box>
          ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Delivery Address</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.itemDescription}</TableCell>
                    <TableCell>{order.weight} kg</TableCell>
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
                    <TableCell>{order.deliveryAddress}</TableCell>
                    <TableCell>
                      {order.status === 'PENDING' && (
                        <Tooltip title="Delete Order">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this order?')) {
                                deleteOrder(order.id);
                              }
                            }}
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
        )}
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
                    Notifications
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
              <Button
                variant="contained"
                size="small"
                onClick={async () => {
                  await axios.post(`http://localhost:8085/api/notifications/test/${user.id}`)
                    .then(() => loadNotifications())
                    .catch(() => showToast('Failed to create test notification', 'error'));
                }}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                Test
              </Button>
            </Box>
          </Box>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="textSecondary" variant="h6">
                No notifications yet. Click "Test" to create one.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
              {notifications.slice(0, 10).map((notification) => (
                <Alert 
                  key={notification.id}
                  severity={notification.isRead ? 'info' : 'success'}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(5px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  action={
                    !notification.isRead && (
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => markNotificationAsRead(notification.id)}
                        sx={{
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)'
                          }
                        }}
                      >
                        Read
                      </Button>
                    )
                  }
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Hi {user.name}, {notification.message}
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

export default CustomerDashboard;