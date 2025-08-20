import React from 'react';
import { render, screen } from '@testing-library/react';
import DemoVideo from '../DemoVideo';

describe('DemoVideo', () => {
  test('renders without crashing', () => {
    render(<DemoVideo />);
    expect(screen.getByText(/Demo Video/)).toBeInTheDocument();
  });

  test('displays video content', () => {
    render(<DemoVideo />);
    // Add more specific tests based on the actual DemoVideo component content
    expect(screen.getByText(/Demo Video/)).toBeInTheDocument();
  });
});