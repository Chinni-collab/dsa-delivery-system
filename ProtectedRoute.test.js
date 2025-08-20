import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProtectedRoute from '../ProtectedRoute';

// Mock useAuth
const mockAuthContext = {
  user: { id: 1, name: 'Test User', userType: 'ADMIN' },
  loading: false,
  isAuthenticated: true
};

jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

// Mock Navigate component
const MockNavigate = ({ to, replace }) => (
  <div data-testid="navigate" data-to={to} data-replace={replace?.toString()}>
    Navigate to {to}
  </div>
);
MockNavigate.propTypes = {
  to: PropTypes.string.isRequired,
  replace: PropTypes.bool
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: MockNavigate
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockAuthContext.user = { id: 1, name: 'Test User', userType: 'ADMIN' };
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
  });

  test('renders children when user is authenticated and has correct role', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('renders children when user is authenticated and no roles specified', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('renders children when user is authenticated and allowedRoles is empty array', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={[]}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('shows loading spinner when loading is true', () => {
    mockAuthContext.loading = true;

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.user = null;

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toBeInTheDocument();
    expect(navigate).toHaveAttribute('data-to', '/login');
    expect(navigate).toHaveAttribute('data-replace', 'true');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to unauthorized when user does not have required role', () => {
    mockAuthContext.user = { id: 1, name: 'Test User', userType: 'CUSTOMER' };

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toBeInTheDocument();
    expect(navigate).toHaveAttribute('data-to', '/unauthorized');
    expect(navigate).toHaveAttribute('data-replace', 'true');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('allows access when user has one of multiple allowed roles', () => {
    mockAuthContext.user = { id: 1, name: 'Test User', userType: 'CUSTOMER' };

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN', 'CUSTOMER']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('allows access for delivery person with correct role', () => {
    mockAuthContext.user = { id: 1, name: 'Test User', userType: 'DELIVERY_PERSON' };

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['DELIVERY_PERSON']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('denies access for delivery person without correct role', () => {
    mockAuthContext.user = { id: 1, name: 'Test User', userType: 'DELIVERY_PERSON' };

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toHaveAttribute('data-to', '/unauthorized');
  });

  test('handles loading state with proper styling', () => {
    mockAuthContext.loading = true;

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    const loadingContainer = screen.getByRole('progressbar').closest('div');
    expect(loadingContainer).toBeInTheDocument();
  });

  test('renders multiple children when authorized', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>First Child</div>
          <div>Second Child</div>
          <span>Third Child</span>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });

  test('handles case-sensitive role matching', () => {
    mockAuthContext.user = { id: 1, name: 'Test User', userType: 'admin' };

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Should redirect because 'admin' !== 'ADMIN'
    const navigate = screen.getByTestId('navigate');
    expect(navigate).toHaveAttribute('data-to', '/unauthorized');
  });

  test('handles undefined allowedRoles prop', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('handles null user with authentication check', () => {
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toHaveAttribute('data-to', '/login');
  });

  test('prioritizes authentication check over role check', () => {
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Should redirect to login, not unauthorized
    const navigate = screen.getByTestId('navigate');
    expect(navigate).toHaveAttribute('data-to', '/login');
  });

  test('prioritizes loading state over other checks', () => {
    mockAuthContext.loading = true;
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.user = null;

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Should show loading, not redirect
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});