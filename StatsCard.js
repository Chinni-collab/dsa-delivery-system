/* eslint-disable react/prop-types */
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

const StatsCard = ({ icon: Icon, value, label, gradient, delay = 0, showProgress = false }) => (
  <Grid item xs={12} sm={6} md={3} sx={{ animation: `fadeInUp 0.8s ease-out ${delay}s both` }}>
    <Card sx={{
      background: gradient,
      color: 'white',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 60px rgba(102, 126, 234, 0.5)' }
    }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        {showProgress ? (
          <Box sx={{ display: 'inline-flex', mb: 2 }}>
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'conic-gradient(from 0deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon sx={{ fontSize: 32, opacity: 0.9 }} />
            </Box>
          </Box>
        ) : (
          <Icon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
        )}
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>{value}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>{label}</Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default StatsCard;