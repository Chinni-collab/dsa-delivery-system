import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';

// Mock useNavigate
const mockNavigate = jest.fn();
const MockBrowserRouter = ({ children }) => <div>{children}</div>;
MockBrowserRouter.propTypes = { children: PropTypes.node };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  BrowserRouter: MockBrowserRouter
}));

describe('HomePage Minimal Coverage', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  });
});