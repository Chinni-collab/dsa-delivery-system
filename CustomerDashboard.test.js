import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomerDashboard from '../CustomerDashboard';

const mockUser = { id: 1, name: 'Customer User', userType: 'CUSTOMER' };

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser })
}));

jest.mock('../services/api', () => ({
  orders: { getByCustomerDirect: jest.fn(), getByCustomer: jest.fn(), createDirect: jest.fn(), create: jest.fn() },
  notifications: { getByUserDirect: jest.fn(), getByUser: jest.fn() }
}));

jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn()
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <CustomerDashboard />
    </BrowserRouter>
  );
};

test('renders CustomerDashboard component', () => {
  renderComponent();
  expect(screen.getByText('Customer Dashboard')).toBeInTheDocument();
});

test('displays user welcome message', () => {
  renderComponent();
  expect(screen.getByText(`Welcome back, ${mockUser.name}! 📦`)).toBeInTheDocument();
});

test('renders my orders section', () => {
  renderComponent();
  expect(screen.getByText('My Orders')).toBeInTheDocument();
});

test('renders place new order button', () => {
  renderComponent();
  expect(screen.getByText('Place New Order')).toBeInTheDocument();
});

test('opens order form when place new order is clicked', () => {
  renderComponent();
  fireEvent.click(screen.getByText('Place New Order'));
  expect(screen.getByText('Pickup Address')).toBeInTheDocument();
});