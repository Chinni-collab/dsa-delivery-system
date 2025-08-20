/* eslint-disable react/prop-types */
import React from 'react';
import { Paper, Box, Typography, Alert, Button, FormControl, Select, MenuItem } from '@mui/material';
import { Notifications as NotificationIcon } from '@mui/icons-material';

const NotificationPanel = ({ 
  notifications, 
  sortOrder, 
  setSortOrder, 
  onMarkAllRead, 
  onMarkAsRead, 
  onLoadNotifications,
  showTestButton = false,
  onTest,
  userName 
}) => (
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
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total: {notifications.length} | Unread: {notifications.filter(n => !n.isRead).length}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); onLoadNotifications(); }}
            sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }, '& .MuiSvgIcon-root': { color: 'white' } }}
          >
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          size="small"
          onClick={onMarkAllRead}
          disabled={notifications.filter(n => !n.isRead).length === 0}
          sx={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            '&:hover': { background: 'rgba(255, 255, 255, 0.3)' },
            '&:disabled': { background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.5)' }
          }}
        >
          Mark All Read
        </Button>
        {showTestButton && (
          <Button
            variant="contained"
            size="small"
            onClick={onTest}
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            Test
          </Button>
        )}
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
        {notifications.slice(0, 10).map((notification) => (
          <Alert 
            key={notification.id}
            severity={notification.isRead ? 'info' : 'success'}
            sx={{ mb: 1, borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateX(5px)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' } }}
            action={!notification.isRead && (
              <Button color="inherit" size="small" onClick={() => onMarkAsRead(notification.id)}>
                Read
              </Button>
            )}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {userName ? `Hi ${userName}, ` : ''}{notification.message}
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
);

export default NotificationPanel;