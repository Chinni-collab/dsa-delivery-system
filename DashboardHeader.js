/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const DashboardHeader = ({ title, subtitle, icon: Icon, onRefresh }) => (
  <Box sx={{
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: 3,
    p: 3,
    mb: 3,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', width: 56, height: 56 }}>
          <Icon sx={{ fontSize: 28 }} />
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
            {title}
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Tooltip title="Refresh Data">
        <IconButton onClick={onRefresh} sx={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          color: 'white',
          '&:hover': { background: 'linear-gradient(45deg, #764ba2, #667eea)' }
        }}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
);

export default DashboardHeader;