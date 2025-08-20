import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import { Typography, Container } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/customer/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/delivery/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['DELIVERY_PERSON']}>
                    <DeliveryDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/unauthorized" 
                element={
                  <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                      Unauthorized Access
                    </Typography>
                    <Typography variant="body1">
                      You don't have permission to access this page.
                    </Typography>
                  </Container>
                } 
              />
              
              <Route 
                path="*" 
                element={
                  <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                      Page Not Found
                    </Typography>
                    <Typography variant="body1">
                      The page you're looking for doesn't exist.
                    </Typography>
                  </Container>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
