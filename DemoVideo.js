import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import {
  Login,
  Add,
  Visibility,
  LocalShipping,
  CheckCircle,
  PlayArrow,
  Close
} from '@mui/icons-material';

function DemoVideo({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: 'Create Your Account',
      icon: <Login sx={{ color: '#1976d2' }} />,
      description: 'Quick and secure registration process',
      details: 'Sign up with your email and create a secure password. Choose your account type: Customer, Admin, or Delivery Person.',
      features: ['Email verification', 'Secure authentication', 'Role-based access']
    },
    {
      label: 'Place Your Order',
      icon: <Add sx={{ color: '#1976d2' }} />,
      description: 'Simple order creation with smart forms',
      details: 'Enter pickup and delivery addresses, item details, weight, and preferred delivery time. Our system calculates pricing automatically.',
      features: ['Address validation', 'Instant pricing', 'Flexible scheduling']
    },
    {
      label: 'Order Processing',
      icon: <Visibility sx={{ color: '#1976d2' }} />,
      description: 'Professional review and confirmation',
      details: 'Our team reviews your order for accuracy and confirms all details. You\'ll receive instant notifications about status changes.',
      features: ['Quality assurance', 'Instant notifications', 'Order validation']
    },
    {
      label: 'Smart Assignment',
      icon: <LocalShipping sx={{ color: '#1976d2' }} />,
      description: 'Optimal delivery person matching',
      details: 'Our system assigns the best available delivery person based on location, capacity, and expertise for your specific delivery needs.',
      features: ['Location optimization', 'Capacity matching', 'Expert handling']
    },
    {
      label: 'Live Tracking',
      icon: <CheckCircle sx={{ color: '#1976d2' }} />,
      description: 'Real-time delivery monitoring',
      details: 'Track your package through every stage: Assigned → Pickup → In Transit → Delivered. Get updates via notifications and live map.',
      features: ['GPS tracking', 'Status updates', 'Delivery confirmation']
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }
        }
      }}
    >
      <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PlayArrow sx={{ mr: 2, fontSize: 30 }} />
            <Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                Interactive Demo
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Complete walkthrough of our delivery system
              </Typography>
            </Box>
          </Box>
          <Button 
            onClick={onClose}
            sx={{ color: 'white', minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, stepIndex) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    step.label === steps[steps.length - 1].label ? (
                      <Chip label="Final Step" size="small" color="primary" />
                    ) : (
                      <Chip label={`Step ${stepIndex + 1} of ${steps.length}`} size="small" variant="outlined" />
                    )
                  }
                  icon={step.icon}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }
                  }}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      mb: 2, 
                      borderRadius: 2,
                      background: 'white'
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      {step.description}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {step.details}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        Key Features:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {step.features.map((feature) => (
                          <Chip 
                            key={feature}
                            label={feature}
                            size="small"
                            sx={{ 
                              background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
                              color: '#1976d2',
                              fontWeight: 'bold'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={stepIndex === steps.length - 1}
                        sx={{
                          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          px: 3
                        }}
                      >
                        {stepIndex === steps.length - 1 ? 'Complete' : 'Next Step'}
                      </Button>
                      <Button
                        variant="outlined"
                        disabled={stepIndex === 0}
                        onClick={handleBack}
                      >
                        Previous
                      </Button>
                    </Box>
                  </Paper>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === steps.length && (
            <Paper 
              elevation={4} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3
              }}
            >
              <CheckCircle sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Demo Complete!
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                You're now ready to experience our professional delivery service
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="contained"
                  onClick={handleReset}
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    '&:hover': { background: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Watch Again
                </Button>
                <Button 
                  variant="outlined"
                  onClick={onClose}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Start Using QuickDeliver
                </Button>
              </Box>
            </Paper>
          )}
        </Box>


      </DialogContent>
      <DialogActions sx={{ p: 3, background: 'white' }}>
        <Button 
          onClick={onClose}
          sx={{ px: 3 }}
        >
          Close Demo
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{
            px: 4,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            fontWeight: 'bold'
          }}
        >
          Start Your Journey
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DemoVideo.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default DemoVideo;