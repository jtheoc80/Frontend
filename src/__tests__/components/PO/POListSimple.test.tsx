import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { POList } from '../../../components/PO/POListSimple';
import { POStage, DistributionToManufacturerPO } from '../../../types/po';

// Mock data
const mockPOs: DistributionToManufacturerPO[] = [
  {
    stage: POStage.DISTRIBUTION_TO_MANUFACTURER,
    orderId: 'DM-2024-001',
    timestamp: Date.now() - 86400000, // 1 day ago
    metadataHash: '0x1234567890abcdef',
    vendorAddress: '0x1234567890123456789012345678901234567890',
    buyerAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    totalAmount: 50000,
    currency: 'USD',
    status: 'pending',
    manufacturerDetails: {
      name: 'Test Manufacturer',
      contactInfo: 'test@manufacturer.com',
      certifications: ['ISO 9001'],
    },
    valveOrders: [],
    shippingAddress: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TX',
      zipCode: '12345',
      country: 'USA',
    },
    terms: {
      paymentTerms: 'Net 30',
      warrantyMonths: 12,
      deliveryTerms: 'FOB',
    },
  },
  {
    stage: POStage.DISTRIBUTION_TO_MANUFACTURER,
    orderId: 'DM-2024-002',
    timestamp: Date.now() - 172800000, // 2 days ago
    metadataHash: '0xabcdef1234567890',
    vendorAddress: '0x9876543210987654321098765432109876543210',
    buyerAddress: '0x1111222233334444555566667777888899990000',
    totalAmount: 75000,
    currency: 'EUR',
    status: 'approved',
    manufacturerDetails: {
      name: 'Another Manufacturer',
      contactInfo: 'contact@another.com',
      certifications: ['API 6D'],
    },
    valveOrders: [],
    shippingAddress: {
      street: '456 Other St',
      city: 'Other City',
      state: 'CA',
      zipCode: '54321',
      country: 'USA',
    },
    terms: {
      paymentTerms: 'Net 15',
      warrantyMonths: 24,
      deliveryTerms: 'FOB Origin',
    },
  },
];

describe('POList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders component with title', () => {
      render(<POList />);
      
      expect(screen.getByText('Purchase Orders')).toBeInTheDocument();
      expect(screen.getByTestId('po-list')).toBeInTheDocument();
    });

    test('renders refresh button when onLoadPOs prop is provided', () => {
      const mockLoadPOs = jest.fn();
      render(<POList onLoadPOs={mockLoadPOs} />);
      
      expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
    });

    test('does not render refresh button when onLoadPOs prop is not provided', () => {
      render(<POList />);
      
      expect(screen.queryByTestId('refresh-button')).not.toBeInTheDocument();
    });

    test('renders filter controls', () => {
      render(<POList />);
      
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('status-filter')).toBeInTheDocument();
      expect(screen.getByTestId('stage-filter')).toBeInTheDocument();
    });

    test('renders results count', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      expect(screen.getByTestId('results-count')).toBeInTheDocument();
      expect(screen.getByText('Showing 2 of 2 purchase orders')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    test('shows empty state when no purchase orders', () => {
      render(<POList purchaseOrders={[]} />);
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No purchase orders found')).toBeInTheDocument();
    });

    test('shows filtered empty state when search returns no results', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No purchase orders match your search criteria')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    test('displays purchase order data in table', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      expect(screen.getByTestId('po-table')).toBeInTheDocument();
      expect(screen.getByTestId('po-row-DM-2024-001')).toBeInTheDocument();
      expect(screen.getByTestId('po-row-DM-2024-002')).toBeInTheDocument();
      
      // Check order IDs
      expect(screen.getByText('DM-2024-001')).toBeInTheDocument();
      expect(screen.getByText('DM-2024-002')).toBeInTheDocument();
      
      // Check status badges
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByText('approved')).toBeInTheDocument();
      
      // Check formatted amounts
      expect(screen.getByText('$50,000.00')).toBeInTheDocument();
      expect(screen.getByText('€75,000.00')).toBeInTheDocument();
    });

    test('displays truncated vendor addresses', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      // Check that addresses are truncated (first 8 chars + ... + last 6 chars)
      expect(screen.getByText('0x123456...567890')).toBeInTheDocument();
      expect(screen.getByText('0x987654...543210')).toBeInTheDocument();
    });

    test('displays formatted dates', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      const today = new Date();
      const oneDayAgo = new Date(today.getTime() - 86400000);
      const twoDaysAgo = new Date(today.getTime() - 172800000);
      
      expect(screen.getByText(oneDayAgo.toLocaleDateString())).toBeInTheDocument();
      expect(screen.getByText(twoDaysAgo.toLocaleDateString())).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    test('filters by search term (order ID)', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'DM-2024-001' } });
      
      expect(screen.getByTestId('po-row-DM-2024-001')).toBeInTheDocument();
      expect(screen.queryByTestId('po-row-DM-2024-002')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 purchase orders')).toBeInTheDocument();
    });

    test('filters by search term (vendor address)', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: '0x1234567890123456' } });
      
      expect(screen.getByTestId('po-row-DM-2024-001')).toBeInTheDocument();
      expect(screen.queryByTestId('po-row-DM-2024-002')).not.toBeInTheDocument();
    });

    test('filters by status', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      const statusFilter = screen.getByTestId('status-filter');
      fireEvent.change(statusFilter, { target: { value: 'pending' } });
      
      expect(screen.getByTestId('po-row-DM-2024-001')).toBeInTheDocument();
      expect(screen.queryByTestId('po-row-DM-2024-002')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 purchase orders')).toBeInTheDocument();
    });

    test('filters by stage', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      const stageFilter = screen.getByTestId('stage-filter');
      fireEvent.change(stageFilter, { target: { value: POStage.DISTRIBUTION_TO_MANUFACTURER } });
      
      // Both mock POs have the same stage, so both should be visible
      expect(screen.getByTestId('po-row-DM-2024-001')).toBeInTheDocument();
      expect(screen.getByTestId('po-row-DM-2024-002')).toBeInTheDocument();
      expect(screen.getByText('Showing 2 of 2 purchase orders')).toBeInTheDocument();
    });

    test('combines multiple filters', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      const searchInput = screen.getByTestId('search-input');
      const statusFilter = screen.getByTestId('status-filter');
      
      fireEvent.change(searchInput, { target: { value: 'DM-2024' } });
      fireEvent.change(statusFilter, { target: { value: 'pending' } });
      
      expect(screen.getByTestId('po-row-DM-2024-001')).toBeInTheDocument();
      expect(screen.queryByTestId('po-row-DM-2024-002')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 purchase orders')).toBeInTheDocument();
    });

    test('shows no results when filters match nothing', () => {
      render(<POList purchaseOrders={mockPOs} />);
      
      const statusFilter = screen.getByTestId('status-filter');
      fireEvent.change(statusFilter, { target: { value: 'cancelled' } });
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No purchase orders match your search criteria')).toBeInTheDocument();
      expect(screen.getByText('Showing 0 of 2 purchase orders')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    test('renders view buttons when onViewDetails prop is provided', () => {
      const mockViewDetails = jest.fn();
      render(<POList purchaseOrders={mockPOs} onViewDetails={mockViewDetails} />);
      
      expect(screen.getByTestId('view-button-DM-2024-001')).toBeInTheDocument();
      expect(screen.getByTestId('view-button-DM-2024-002')).toBeInTheDocument();
    });

    test('renders delete buttons when onDeletePO prop is provided', () => {
      const mockDeletePO = jest.fn();
      render(<POList purchaseOrders={mockPOs} onDeletePO={mockDeletePO} />);
      
      expect(screen.getByTestId('delete-button-DM-2024-001')).toBeInTheDocument();
      expect(screen.getByTestId('delete-button-DM-2024-002')).toBeInTheDocument();
    });

    test('calls onViewDetails when view button is clicked', () => {
      const mockViewDetails = jest.fn();
      render(<POList purchaseOrders={mockPOs} onViewDetails={mockViewDetails} />);
      
      const viewButton = screen.getByTestId('view-button-DM-2024-001');
      fireEvent.click(viewButton);
      
      expect(mockViewDetails).toHaveBeenCalledWith(mockPOs[0]);
    });

    test('calls onDeletePO when delete button is clicked', async () => {
      const mockDeletePO = jest.fn().mockResolvedValue(undefined);
      render(<POList purchaseOrders={mockPOs} onDeletePO={mockDeletePO} />);
      
      const deleteButton = screen.getByTestId('delete-button-DM-2024-001');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(mockDeletePO).toHaveBeenCalledWith('DM-2024-001');
      });
    });

    test('removes PO from list after successful deletion', async () => {
      const mockDeletePO = jest.fn().mockResolvedValue(undefined);
      render(<POList purchaseOrders={mockPOs} onDeletePO={mockDeletePO} />);
      
      const deleteButton = screen.getByTestId('delete-button-DM-2024-001');
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('po-row-DM-2024-001')).not.toBeInTheDocument();
        expect(screen.getByTestId('po-row-DM-2024-002')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    test('shows loading message when isLoading is true', () => {
      render(<POList isLoading={true} />);
      
      expect(screen.getByText('Loading purchase orders...')).toBeInTheDocument();
      expect(screen.queryByTestId('po-table')).not.toBeInTheDocument();
    });

    test('shows loading state on refresh button when isLoading is true', () => {
      const mockLoadPOs = jest.fn();
      render(<POList onLoadPOs={mockLoadPOs} isLoading={true} />);
      
      const refreshButton = screen.getByTestId('refresh-button');
      expect(refreshButton).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    test('calls onLoadPOs when refresh button is clicked', async () => {
      const mockLoadPOs = jest.fn().mockResolvedValue(mockPOs);
      render(<POList onLoadPOs={mockLoadPOs} />);
      
      const refreshButton = screen.getByTestId('refresh-button');
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(mockLoadPOs).toHaveBeenCalled();
      });
    });

    test('updates PO list when onLoadPOs returns new data', async () => {
      const newPO: DistributionToManufacturerPO = {
        ...mockPOs[0],
        orderId: 'DM-2024-003',
      };
      const mockLoadPOs = jest.fn().mockResolvedValue([newPO]);
      
      render(<POList onLoadPOs={mockLoadPOs} />);
      
      const refreshButton = screen.getByTestId('refresh-button');
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(screen.getByText('DM-2024-003')).toBeInTheDocument();
      });
    });

    test('shows error when onLoadPOs fails', async () => {
      const mockLoadPOs = jest.fn().mockRejectedValue(new Error('Failed to load'));
      render(<POList onLoadPOs={mockLoadPOs} />);
      
      const refreshButton = screen.getByTestId('refresh-button');
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
      });
    });
  });

  describe('Currency Formatting', () => {
    test('formats different currencies correctly', () => {
      const posWithDifferentCurrencies = [
        { ...mockPOs[0], orderId: 'PO-USD', currency: 'USD', totalAmount: 1000 },
        { ...mockPOs[0], orderId: 'PO-EUR', currency: 'EUR', totalAmount: 2000 },
        { ...mockPOs[0], orderId: 'PO-ETH', currency: 'ETH', totalAmount: 0.5 },
      ];
      
      render(<POList purchaseOrders={posWithDifferentCurrencies} />);
      
      expect(screen.getByText('$1,000.00')).toBeInTheDocument();
      expect(screen.getByText('€2,000.00')).toBeInTheDocument();
      expect(screen.getByText('ETH 0.50')).toBeInTheDocument();
    });
  });
});