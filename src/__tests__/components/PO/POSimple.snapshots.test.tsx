import React from 'react';
import { render } from '@testing-library/react';
import { CreatePOForm } from '../../../components/PO/CreatePOFormSimple';
import { POList } from '../../../components/PO/POListSimple';
import { POStage, DistributionToManufacturerPO } from '../../../types/po';

// Mock data for snapshots
const mockPOs: DistributionToManufacturerPO[] = [
  {
    stage: POStage.DISTRIBUTION_TO_MANUFACTURER,
    orderId: 'DM-2024-001',
    timestamp: 1704067200000, // Fixed timestamp for consistent snapshots
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
    valveOrders: [
      {
        valveType: 'ball',
        model: 'A100',
        specifications: {
          diameter: 6,
          pressure: 150,
          temperature: 200,
          material: 'Stainless Steel 316',
          connectionType: 'Flanged'
        },
        quantity: 10,
        unitPrice: 5000,
        deliveryDate: '2024-06-01'
      }
    ],
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
    timestamp: 1704067200000, // Fixed timestamp for consistent snapshots
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

describe('PO Components Snapshots', () => {
  // Mock Math.random to ensure consistent snapshot results
  beforeAll(() => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;
  });

  afterAll(() => {
    global.Math = Math;
  });

  describe('CreatePOForm Snapshots', () => {
    test('should match snapshot - default state', () => {
      const { container } = render(<CreatePOForm />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot - with onCancel prop', () => {
      const mockCancel = jest.fn();
      const { container } = render(<CreatePOForm onCancel={mockCancel} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot - loading state', () => {
      const mockSubmit = jest.fn();
      const mockCancel = jest.fn();
      const { container } = render(
        <CreatePOForm 
          onSubmit={mockSubmit} 
          onCancel={mockCancel} 
          isLoading={true} 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot - with all props', () => {
      const mockSubmit = jest.fn();
      const mockCancel = jest.fn();
      const { container } = render(
        <CreatePOForm 
          onSubmit={mockSubmit} 
          onCancel={mockCancel} 
          isLoading={false} 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('POList Snapshots', () => {
    test('should match snapshot - empty state', () => {
      const { container } = render(<POList />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot - with purchase orders', () => {
      const { container } = render(<POList purchaseOrders={mockPOs} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot - with all action props', () => {
      const mockLoadPOs = jest.fn();
      const mockViewDetails = jest.fn();
      const mockDeletePO = jest.fn();
      
      const { container } = render(
        <POList 
          purchaseOrders={mockPOs}
          onLoadPOs={mockLoadPOs}
          onViewDetails={mockViewDetails}
          onDeletePO={mockDeletePO}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot - loading state', () => {
      const mockLoadPOs = jest.fn();
      const { container } = render(
        <POList 
          purchaseOrders={mockPOs}
          onLoadPOs={mockLoadPOs}
          isLoading={true}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot - empty purchase orders array', () => {
      const mockLoadPOs = jest.fn();
      const mockViewDetails = jest.fn();
      const mockDeletePO = jest.fn();
      
      const { container } = render(
        <POList 
          purchaseOrders={[]}
          onLoadPOs={mockLoadPOs}
          onViewDetails={mockViewDetails}
          onDeletePO={mockDeletePO}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot - single purchase order', () => {
      const { container } = render(
        <POList purchaseOrders={[mockPOs[0]]} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});