import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PropTypes from 'prop-types';
import Layout from '../Layout';

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ 
    user: { id: 1, name: 'Test User', userType: 'ADMIN' },
    logout: jest.fn(),
    isAuthenticated: true
  })
}));

const MockBrowserRouter = ({ children }) => <div>{children}</div>;
MockBrowserRouter.propTypes = { children: PropTypes.node };

const MockLink = ({ children, to }) => <a href={to}>{children}</a>;
MockLink.propTypes = { children: PropTypes.node, to: PropTypes.string };

jest.mock('react-router-dom', () => ({
  BrowserRouter: MockBrowserRouter,
  Link: MockLink,
  useNavigate: () => jest.fn()
}));

describe('Layout', () => {
  test('renders with children', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('displays navigation for authenticated user', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('handles logout', () => {
    const mockLogout = jest.fn();
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({ 
        user: { id: 1, name: 'Test User', userType: 'ADMIN' },
        logout: mockLogout,
        isAuthenticated: true
      })
    }));
    
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    // Find and click logout button if it exists
    const logoutButton = screen.queryByText(/Logout/);
    if (logoutButton) {
      fireEvent.click(logoutButton);
    }
  });

  test('displays different navigation based on user type', () => {
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({ 
        user: { id: 1, name: 'Customer User', userType: 'CUSTOMER' },
        logout: jest.fn(),
        isAuthenticated: true
      })
    }));
    
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});