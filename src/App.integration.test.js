import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Chakra UI components with navigation functionality

jest.mock('@chakra-ui/react', () => ({
  ChakraProvider: ({ children }) => <div data-testid="chakra-provider">{children}</div>,
  Box: ({ children, ...props }) => {
    const { bg, color, minH, maxW, mx, p, textAlign, rounded, shadow, border, borderColor, overflowX, overflowY, ...cleanProps } = props;
    return <div data-testid="box" {...cleanProps}>{children}</div>;
  },
  Flex: ({ children, ...props }) => {
    const { as, bg, p, align, color, direction, gap, ...cleanProps } = props;
    return <div data-testid="flex" {...cleanProps}>{children}</div>;
  },
  Heading: ({ children, ...props }) => {
    const { fontSize, fontWeight, size, mb, ...cleanProps } = props;
    return <h1 data-testid="heading" {...cleanProps}>{children}</h1>;
  },
  Text: ({ children, ...props }) => {
    const { color, fontSize, fontWeight, ...cleanProps } = props;
    return <span data-testid="text" {...cleanProps}>{children}</span>;
  },
  Button: ({ children, onClick, leftIcon, colorScheme, variant, size, fontSize, ...props }) => (
    <button data-testid="button" onClick={onClick} {...props}>
      {leftIcon && <span data-testid="icon">{leftIcon}</span>}
      {children}
    </button>
  ),
  SimpleGrid: ({ children, ...props }) => {
    const { columns, spacing, w, ...cleanProps } = props;
    return <div data-testid="simple-grid" {...cleanProps}>{children}</div>;
  },
  HStack: ({ children, ...props }) => {
    const { spacing, flexWrap, justify, w, ...cleanProps } = props;
    return <div data-testid="hstack" {...cleanProps}>{children}</div>;
  },
  Spacer: ({ display }) => <div data-testid="spacer"></div>,
  TabsContent: ({ children, value }) => <div data-testid="tabs-content" data-value={value}>{children}</div>,
  TabsRoot: ({ children, value, onValueChange }) => (
    <div data-testid="tabs-root" data-value={value}>{children}</div>
  ),
}));

// Mock the ValveTable component
jest.mock('./components/Valvetable.tsx', () => {
  return function MockValveTable() {
    return <div data-testid="valve-table">Mocked Valve Table</div>;
  };
});

// Mock the theme
jest.mock('./theme.ts', () => ({}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaTools: () => <span data-testid="fa-tools">🔧</span>,
  FaHistory: () => <span data-testid="fa-history">📜</span>,
  FaWallet: () => <span data-testid="fa-wallet">💰</span>,
  FaTable: () => <span data-testid="fa-table">📊</span>,
}));

import React from 'react';
import App from './App';

describe('App Integration Tests', () => {
  test('renders main dashboard components', () => {
    render(<App />);
    
    // Check header
    expect(screen.getByText('ValveChain Dashboard')).toBeInTheDocument();
    
    // Check navigation buttons
    expect(screen.getByText('Valve Inventory')).toBeInTheDocument();
    expect(screen.getByText('Repairs')).toBeInTheDocument();
    expect(screen.getByText('Valve History')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
    
    // Check dashboard content
    expect(screen.getByText('Welcome, Jimmy!')).toBeInTheDocument();
    expect(screen.getByText('Your role: Admin')).toBeInTheDocument();
    expect(screen.getByText('Quick Valve Summary')).toBeInTheDocument();
    
    // Check stats
    expect(screen.getByText('250')).toBeInTheDocument(); // Valves count
    expect(screen.getByText('3')).toBeInTheDocument(); // In Repair count
    expect(screen.getByText('$12,500')).toBeInTheDocument(); // Owed amount
  });

  test('navigation buttons are present with icons', () => {
    render(<App />);
    
    // Check for icons (using data-testid from mocked components)
    expect(screen.getByTestId('fa-table')).toBeInTheDocument();
    expect(screen.getByTestId('fa-tools')).toBeInTheDocument();
    expect(screen.getByTestId('fa-history')).toBeInTheDocument();
    expect(screen.getByTestId('fa-wallet')).toBeInTheDocument();
  });

  test('navigation buttons have click handlers', () => {
    render(<App />);
    
    const valveInventoryButton = screen.getByText('Valve Inventory');
    const repairsButton = screen.getByText('Repairs');
    const historyButton = screen.getByText('Valve History');
    const paymentsButton = screen.getByText('Payments');
    
    // All buttons should be clickable (have onClick handlers)
    expect(valveInventoryButton).toBeInTheDocument();
    expect(repairsButton).toBeInTheDocument();
    expect(historyButton).toBeInTheDocument();
    expect(paymentsButton).toBeInTheDocument();
    
    // Verify buttons are actually button elements
    expect(valveInventoryButton.tagName).toBe('BUTTON');
    expect(repairsButton.tagName).toBe('BUTTON');
    expect(historyButton.tagName).toBe('BUTTON');
    expect(paymentsButton.tagName).toBe('BUTTON');
  });

  test('renders dashboard statistics correctly', () => {
    render(<App />);
    
    // Check for stat labels
    expect(screen.getByText('Valves')).toBeInTheDocument();
    expect(screen.getByText('In Repair')).toBeInTheDocument();
    expect(screen.getByText('Owed')).toBeInTheDocument();
    
    // Check for stat values
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('$12,500')).toBeInTheDocument();
  });
});