import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DeliveryDashboard from '../DeliveryDashboard';

const mockUser = { id: 1, name: 'Delivery User', userType: 'DELIVERY_PERSON' };

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser })
}));

jest.mock('../services/api', () => ({
  deliveries: { getByPerson: jest.fn(), updateStatus: jest.fn() },
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
      <DeliveryDashboard />
    </BrowserRouter>
  );
};

test('renders DeliveryDashboard component', () => {
  renderComponent();
  expect(screen.getByText('Delivery Dashboard')).toBeInTheDocument();
});

test('displays user welcome message', () => {
  renderComponent();
  expect(screen.getByText(`Welcome back, ${mockUser.name}! 🚚`)).toBeInTheDocument();
});

test('renders my assigned deliveries section', () => {
  renderComponent();
  expect(screen.getByText('My Assigned Deliveries')).toBeInTheDocument();
});

test('renders notifications section', () => {
  renderComponent();
  expect(screen.getByText('Notifications')).toBeInTheDocument();
});