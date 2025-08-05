// Tests for globalization React hooks and logic

import { renderHook } from '@testing-library/react';
import React from 'react';
import { GlobalizationProvider } from '../../contexts/GlobalizationContext.tsx';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Test wrapper
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GlobalizationProvider>
    {children}
  </GlobalizationProvider>
);

describe('GlobalizationProvider', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('provides globalization context', () => {
    // Import the hook dynamically to avoid module loading issues
    const { useGlobalization } = require('../contexts/GlobalizationContext');
    
    const { result } = renderHook(() => useGlobalization(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.preferences).toBeDefined();
    expect(result.current.formatCurrency).toBeDefined();
    expect(result.current.formatNumber).toBeDefined();
  });

  test('has default preferences', () => {
    const { useGlobalization } = require('../contexts/GlobalizationContext');
    
    const { result } = renderHook(() => useGlobalization(), { wrapper });

    expect(result.current.preferences.currency).toBeDefined();
    expect(result.current.preferences.locale).toBeDefined();
    expect(result.current.preferences.unitSystem).toBeDefined();
    expect(typeof result.current.preferences.autoDetectLocale).toBe('boolean');
  });
});