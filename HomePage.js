import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoVideo from './DemoVideo';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  LocalShipping,
  Speed,

  PlayCircleOutline,
  Star,

  Shield,
  AccessTime
} from '@mui/icons-material';

function HomePage() {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: <Speed sx={{ fontSize: 50, color: '#fff' }} />,
      title: 'Lightning Fast',
      description: 'Same-day delivery with 2-hour express options available',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <Shield sx={{ fontSize: 50, color: '#fff' }} />,
      title: 'Secure & Insured',
      description: 'Full insurance coverage and secure handling protocols',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <LocalShipping sx={{ fontSize: 50, color: '#fff' }} />,
      title: 'Live Tracking',
      description: 'GPS tracking with real-time updates and notifications',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <AccessTime sx={{ fontSize: 50, color: '#fff' }} />,
      title: 'Always Available',
      description: '24/7 customer support and flexible delivery windows',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '99.9%', label: 'On-Time Delivery' },
    { number: '24/7', label: 'Customer Support' },
    { number: '100+', label: 'Cities Covered' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <LocalShipping sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              QuickDeliver
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Chip 
            label="Trusted by 50K+ customers" 
            size="small" 
            sx={{ 
              mr: 2, 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white',
              '& .MuiChip-label': { fontSize: '0.75rem' }
            }} 
          />
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.1)',
              '&:hover': {
                background: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ mb: 4 }}>
            <Chip 
              label="🚀 New: Same-day delivery now available!" 
              sx={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white',
                mb: 3,
                fontSize: '0.9rem'
              }} 
            />
          </Box>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Delivery Made Simple
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4, 
              opacity: 0.95,
              fontWeight: 300,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Professional courier services with real-time tracking and guaranteed delivery
          </Typography>
          
          {/* Stats Row */}
          <Grid container spacing={4} sx={{ mb: 6, justifyContent: 'center' }}>
            {stats.map((stat) => (
              <Grid item xs={6} sm={3} key={stat.label}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.9)',
                color: '#1976d2',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: 'rgba(255,255,255,1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Delivering Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setShowDemo(true)}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                borderRadius: 3,
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Watch Demo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#2c3e50' }}
          >
            How It Works
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Simple, fast, and reliable - get your packages delivered in just a few clicks
          </Typography>
        </Box>
        
        {/* Interactive Demo Card */}
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            mb: 6,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 300,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }
            }}
            onClick={() => setShowDemo(true)}
          >
            <PlayCircleOutline sx={{ fontSize: 80, color: 'white', mr: 2 }} />
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Interactive Demo
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                See the complete workflow in action
              </Typography>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ mt: 3, color: '#2c3e50' }}>
            🎯 Step-by-step walkthrough of our delivery process
          </Typography>
        </Paper>

        {/* Process Steps */}
        <Grid container spacing={4}>
          {[
            { step: '01', title: 'Create Account', desc: 'Quick registration with email verification', icon: '👤' },
            { step: '02', title: 'Place Order', desc: 'Enter pickup and delivery details with pricing', icon: '📦' },
            { step: '03', title: 'Live Tracking', desc: 'Real-time GPS tracking with status updates', icon: '📍' },
            { step: '04', title: 'Safe Delivery', desc: 'Secure handover with delivery confirmation', icon: '✅' }
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.step}>
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography variant="h2" sx={{ mb: 2 }}>{item.icon}</Typography>
                <Typography 
                  variant="h5" 
                  color="primary" 
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  {item.step}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#2c3e50' }}
            >
              Why Choose QuickDeliver?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              We're not just another delivery service - we're your trusted logistics partner
            </Typography>
          </Box>
          
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title} sx={{ display: 'flex' }}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 0,
                    width: '100%',
                    maxWidth: 280,
                    mx: 'auto',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {/* Gradient Header */}
                  <Box 
                    sx={{
                      background: feature.gradient,
                      p: 3,
                      color: 'white',
                      minHeight: 140,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {feature.icon}
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                  
                  {/* Content */}
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.5 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Trust Indicators */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
              Trusted by Leading Companies
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
              {['Enterprise Solutions', 'Small Business', 'E-commerce', 'Healthcare', 'Retail'].map((industry) => (
                <Grid item key={industry}>
                  <Chip 
                    label={industry}
                    sx={{ 
                      background: 'rgba(25, 118, 210, 0.1)',
                      color: '#1976d2',
                      fontWeight: 'bold'
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Star sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            Ready to Experience Excellence?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              opacity: 0.95,
              maxWidth: 500,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Join over 50,000 satisfied customers who trust QuickDeliver for their most important deliveries
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                background: 'rgba(255,255,255,0.9)',
                color: '#1976d2',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: 'rgba(255,255,255,1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Today
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
            ✓ No setup fees  ✓ 24/7 support  ✓ Money-back guarantee
          </Typography>
        </Container>
        
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            opacity: 0.5
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            opacity: 0.3
          }}
        />
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ background: '#263238', color: 'white', py: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Track Your Order
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Pricing
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Support
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Terms of Service
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  support@quickdeliver.com
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +1 (555) 123-4567
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  123 Delivery St, City, State
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <LocalShipping sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  QuickDeliver
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6, mb: 2 }}>
                Your trusted partner for fast and reliable delivery services across the globe.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Chip label="Trusted" size="small" sx={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                <Chip label="Reliable" size="small" sx={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                <Chip label="Fast" size="small" sx={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} />
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.6 }}>
            © 2024 QuickDeliver. All rights reserved.
          </Typography>
        </Container>
      </Box>
      
      {/* Demo Video Dialog */}
      <DemoVideo open={showDemo} onClose={() => setShowDemo(false)} />
    </Box>
  );
}

export default HomePage;