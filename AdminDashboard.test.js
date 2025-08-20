import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard';

const mockUser = { id: 1, name: 'Admin User', userType: 'ADMIN' };

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser })
}));

jest.mock('../services/api', () => ({
  orders: { debugAll: jest.fn(), getAll: jest.fn() },
  users: { getAll: jest.fn() },
  notifications: { getByUserDirect: jest.fn() },
  deliveries: { create: jest.fn() }
}));

jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn()
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <AdminDashboard />
    </BrowserRouter>
  );
};

test('renders AdminDashboard component', () => {
  renderComponent();
  expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
});

test('displays user welcome message', () => {
  renderComponent();
  expect(screen.getByText(`Welcome back, ${mockUser.name}! 👋`)).toBeInTheDocument();
});

test('renders order management section', () => {
  renderComponent();
  expect(screen.getByText('Order Management')).toBeInTheDocument();
});

test('renders user management section', () => {
  renderComponent();
  expect(screen.getByText('User Management')).toBeInTheDocument();
});

test('renders system notifications section', () => {
  renderComponent();
  expect(screen.getByText('System Notifications')).toBeInTheDocument();
});