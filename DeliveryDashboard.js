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
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  Assignment as AssignedIcon,
  CheckCircle as CompletedIcon,
  Notifications as NotificationIcon,
  Timeline as PendingIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import StatsCard from './shared/StatsCard';
import DashboardHeader from './shared/DashboardHeader';
import NotificationPanel from './shared/NotificationPanel';

function DeliveryDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [sortOrder, setSortOrder] = useState('latest');



  useEffect(() => {
    loadDeliveries();
    loadNotifications();
    
    const interval = setInterval(() => {
      loadDeliveries();
      loadNotifications();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDeliveries = async () => {
    try {
      console.log('=== DELIVERY: Loading deliveries ===');
      console.log('Delivery person ID:', user.id);
      
      // Try direct API first
      let response;
      try {
        response = await axios.get(`http://localhost:8084/api/deliveries/person/${user.id}`);
        console.log('Direct deliveries response:', response.data);
      } catch (error) {
        console.log('Direct API failed, trying gateway:', error.message);
        response = await api.deliveries.getByPerson(user.id);
      }
      
      setDeliveries(response.data || []);
    } catch (error) {
      console.error('Error loading deliveries:', error.message);
      setDeliveries([]);
    }
  };

  const loadNotifications = async () => {
    try {
      console.log('=== DELIVERY: Loading notifications ===');
      console.log('User ID for notifications:', user.id);
      
      // Try direct API first
      let response;
      try {
        response = await axios.get(`http://localhost:8085/api/notifications/user/${user.id}`);
        console.log('Direct notifications response:', response.data);
      } catch (error) {
        console.log('Direct API failed, trying gateway:', error.message);
        response = await api.notifications.getByUser(user.id);
      }
      
      const sortedNotifications = (response.data || []).sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
      });
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error.message);
      setNotifications([]);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8085/api/notifications/${notificationId}/read`);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      for (const notification of unreadNotifications) {
        await axios.put(`http://localhost:8085/api/notifications/${notification.id}/read`);
      }
      loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error.message);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      console.log('=== DELIVERY: Updating status ===');
      console.log('Delivery ID:', deliveryId, 'New Status:', newStatus);
      
      // Try direct API first
      try {
        await axios.put(`http://localhost:8084/api/deliveries/${deliveryId}/status?status=${newStatus}`);
        console.log('Direct status update successful');
      } catch (error) {
        console.log('Direct API failed, trying gateway:', error.message);
        await api.deliveries.updateStatus(deliveryId, newStatus);
      }
      
      loadDeliveries();
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'TRANSIT': return 'primary';
      case 'PICKUP': return 'warning';
      case 'ASSIGNED': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <DashboardHeader
          title="Delivery Dashboard"
          subtitle={`Welcome back, ${user.name}! 🚚`}
          icon={DeliveryIcon}
          onRefresh={() => { loadDeliveries(); loadNotifications(); }}
        />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatsCard
            icon={DeliveryIcon}
            value={deliveries.length}
            label="Total Deliveries"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            delay={0.1}
            showProgress={true}
          />
          <StatsCard
            icon={PendingIcon}
            value={deliveries.filter(d => d.status !== 'DELIVERED').length}
            label="Pending Deliveries"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            delay={0.2}
          />
          <StatsCard
            icon={CompletedIcon}
            value={deliveries.filter(d => d.status === 'DELIVERED').length}
            label="Completed Deliveries"
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            delay={0.3}
          />
          <StatsCard
            icon={NotificationIcon}
            value={notifications.filter(n => !n.isRead).length}
            label="New Notifications"
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            delay={0.4}
          />
        </Grid>

        {/* Deliveries Table */}
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <AssignedIcon sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              My Assigned Deliveries
            </Typography>
          </Box>
          {deliveries.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <DeliveryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="textSecondary" variant="h6">
                No deliveries assigned yet.
              </Typography>
            </Box>
          ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Delivery ID</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Pickup Address</TableCell>
                  <TableCell>Delivery Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>#{delivery.id}</TableCell>
                    <TableCell>#{delivery.orderId}</TableCell>
                    <TableCell>{delivery.pickupAddress}</TableCell>
                    <TableCell>{delivery.deliveryAddress}</TableCell>
                    <TableCell>
                      <Chip 
                        label={delivery.status} 
                        color={getStatusColor(delivery.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={delivery.status}
                          onChange={(e) => handleStatusUpdate(delivery.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#667eea'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#764ba2'
                            }
                          }}
                        >
                          <MenuItem value="ASSIGNED">ASSIGNED</MenuItem>
                          <MenuItem value="PICKUP">PICKUP</MenuItem>
                          <MenuItem value="TRANSIT">TRANSIT</MenuItem>
                          <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

        <NotificationPanel
          notifications={notifications}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onMarkAllRead={markAllAsRead}
          onMarkAsRead={markNotificationAsRead}
          onLoadNotifications={loadNotifications}
          showTestButton={true}
          onTest={async () => {
            await axios.post(`http://localhost:8085/api/notifications/test/${user.id}`)
              .then(() => loadNotifications())
              .catch(() => {});
          }}
          userName={user.name}
        />
      </Container>
    </Box>
  );
}

export default DeliveryDashboard;