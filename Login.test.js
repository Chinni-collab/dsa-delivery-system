import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    user: null
  })
}));

test('renders Login component', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
});