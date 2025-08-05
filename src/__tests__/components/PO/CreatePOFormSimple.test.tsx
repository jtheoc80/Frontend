import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreatePOForm } from '../../../components/PO/CreatePOFormSimple';
import { POStage } from '../../../types/po';

describe('CreatePOForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders form with all required fields', () => {
      render(<CreatePOForm />);
      
      expect(screen.getByRole('heading', { name: 'Create Purchase Order' })).toBeInTheDocument();
      expect(screen.getByTestId('stage-select')).toBeInTheDocument();
      expect(screen.getByTestId('order-id-input')).toBeInTheDocument();
      expect(screen.getByTestId('vendor-address-input')).toBeInTheDocument();
      expect(screen.getByTestId('buyer-address-input')).toBeInTheDocument();
      expect(screen.getByTestId('total-amount-input')).toBeInTheDocument();
      expect(screen.getByTestId('currency-select')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('renders with default stage selected', () => {
      render(<CreatePOForm />);
      
      const stageSelect = screen.getByTestId('stage-select') as HTMLSelectElement;
      expect(stageSelect.value).toBe(POStage.DISTRIBUTION_TO_MANUFACTURER);
    });

    test('renders cancel button when onCancel prop is provided', () => {
      const mockCancel = jest.fn();
      render(<CreatePOForm onCancel={mockCancel} />);
      
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });

    test('does not render cancel button when onCancel prop is not provided', () => {
      render(<CreatePOForm />);
      
      expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    test('updates stage selection', () => {
      render(<CreatePOForm />);
      
      const stageSelect = screen.getByTestId('stage-select') as HTMLSelectElement;
      fireEvent.change(stageSelect, { target: { value: POStage.PLANT_TO_DISTRIBUTION } });
      
      expect(stageSelect.value).toBe(POStage.PLANT_TO_DISTRIBUTION);
    });

    test('updates form fields', () => {
      render(<CreatePOForm />);
      
      const orderIdInput = screen.getByTestId('order-id-input') as HTMLInputElement;
      const vendorAddressInput = screen.getByTestId('vendor-address-input') as HTMLInputElement;
      const buyerAddressInput = screen.getByTestId('buyer-address-input') as HTMLInputElement;
      
      fireEvent.change(orderIdInput, { target: { value: 'PO-2024-001' } });
      fireEvent.change(vendorAddressInput, { target: { value: '0xvendor123' } });
      fireEvent.change(buyerAddressInput, { target: { value: '0xbuyer456' } });
      
      expect(orderIdInput.value).toBe('PO-2024-001');
      expect(vendorAddressInput.value).toBe('0xvendor123');
      expect(buyerAddressInput.value).toBe('0xbuyer456');
    });

    test('updates currency selection', () => {
      render(<CreatePOForm />);
      
      const currencySelect = screen.getByTestId('currency-select') as HTMLSelectElement;
      fireEvent.change(currencySelect, { target: { value: 'EUR' } });
      
      expect(currencySelect.value).toBe('EUR');
    });
  });

  describe('Form Validation', () => {
    test('shows error for empty required fields', async () => {
      render(<CreatePOForm />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
        expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
      });
    });

    test('does not show error when all required fields are filled', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined);
      render(<CreatePOForm onSubmit={mockSubmit} />);
      
      // Fill in required fields
      fireEvent.change(screen.getByTestId('order-id-input'), { target: { value: 'PO-2024-001' } });
      fireEvent.change(screen.getByTestId('vendor-address-input'), { target: { value: '0xvendor123' } });
      fireEvent.change(screen.getByTestId('buyer-address-input'), { target: { value: '0xbuyer456' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
      
      expect(screen.queryByTestId('error-alert')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('calls onSubmit with correct data structure', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined);
      render(<CreatePOForm onSubmit={mockSubmit} />);
      
      // Fill in form
      fireEvent.change(screen.getByTestId('order-id-input'), { target: { value: 'PO-2024-001' } });
      fireEvent.change(screen.getByTestId('vendor-address-input'), { target: { value: '0xvendor123' } });
      fireEvent.change(screen.getByTestId('buyer-address-input'), { target: { value: '0xbuyer456' } });
      fireEvent.change(screen.getByTestId('total-amount-input'), { target: { value: '5000' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            purchaseOrder: expect.objectContaining({
              orderId: 'PO-2024-001',
              vendorAddress: '0xvendor123',
              buyerAddress: '0xbuyer456',
              totalAmount: 5000,
              stage: POStage.DISTRIBUTION_TO_MANUFACTURER,
              status: 'pending',
            }),
            nonce: expect.any(Number),
          })
        );
      });
    });

    test('shows success message after successful submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined);
      render(<CreatePOForm onSubmit={mockSubmit} />);
      
      // Fill in required fields
      fireEvent.change(screen.getByTestId('order-id-input'), { target: { value: 'PO-2024-001' } });
      fireEvent.change(screen.getByTestId('vendor-address-input'), { target: { value: '0xvendor123' } });
      fireEvent.change(screen.getByTestId('buyer-address-input'), { target: { value: '0xbuyer456' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('success-alert')).toBeInTheDocument();
        expect(screen.getByText('Purchase Order created successfully!')).toBeInTheDocument();
      });
    });

    test('shows error message when submission fails', async () => {
      const mockSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
      render(<CreatePOForm onSubmit={mockSubmit} />);
      
      // Fill in required fields
      fireEvent.change(screen.getByTestId('order-id-input'), { target: { value: 'PO-2024-001' } });
      fireEvent.change(screen.getByTestId('vendor-address-input'), { target: { value: '0xvendor123' } });
      fireEvent.change(screen.getByTestId('buyer-address-input'), { target: { value: '0xbuyer456' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    test('resets form after successful submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined);
      render(<CreatePOForm onSubmit={mockSubmit} />);
      
      // Fill in form
      const orderIdInput = screen.getByTestId('order-id-input') as HTMLInputElement;
      const vendorAddressInput = screen.getByTestId('vendor-address-input') as HTMLInputElement;
      const buyerAddressInput = screen.getByTestId('buyer-address-input') as HTMLInputElement;
      
      fireEvent.change(orderIdInput, { target: { value: 'PO-2024-001' } });
      fireEvent.change(vendorAddressInput, { target: { value: '0xvendor123' } });
      fireEvent.change(buyerAddressInput, { target: { value: '0xbuyer456' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('success-alert')).toBeInTheDocument();
      });
      
      // Check that form fields are reset
      expect(orderIdInput.value).toBe('');
      expect(vendorAddressInput.value).toBe('');
      expect(buyerAddressInput.value).toBe('');
    });
  });

  describe('Loading State', () => {
    test('shows loading state when isLoading prop is true', () => {
      render(<CreatePOForm isLoading={true} />);
      
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });

    test('disables cancel button when loading', () => {
      const mockCancel = jest.fn();
      render(<CreatePOForm onCancel={mockCancel} isLoading={true} />);
      
      const cancelButton = screen.getByTestId('cancel-button');
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Cancel Functionality', () => {
    test('calls onCancel when cancel button is clicked', () => {
      const mockCancel = jest.fn();
      render(<CreatePOForm onCancel={mockCancel} />);
      
      const cancelButton = screen.getByTestId('cancel-button');
      fireEvent.click(cancelButton);
      
      expect(mockCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Different PO Stages', () => {
    test('creates DistributionToManufacturerPO when stage is DISTRIBUTION_TO_MANUFACTURER', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined);
      render(<CreatePOForm onSubmit={mockSubmit} />);
      
      // Select stage and fill form
      fireEvent.change(screen.getByTestId('stage-select'), { 
        target: { value: POStage.DISTRIBUTION_TO_MANUFACTURER } 
      });
      fireEvent.change(screen.getByTestId('order-id-input'), { target: { value: 'DM-2024-001' } });
      fireEvent.change(screen.getByTestId('vendor-address-input'), { target: { value: '0xvendor123' } });
      fireEvent.change(screen.getByTestId('buyer-address-input'), { target: { value: '0xbuyer456' } });
      
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            purchaseOrder: expect.objectContaining({
              stage: POStage.DISTRIBUTION_TO_MANUFACTURER,
              manufacturerDetails: expect.any(Object),
              valveOrders: expect.any(Array),
              shippingAddress: expect.any(Object),
              terms: expect.any(Object),
            }),
          })
        );
      });
    });

    test('creates PlantToDistributionPO when stage is PLANT_TO_DISTRIBUTION', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined);
      render(<CreatePOForm onSubmit={mockSubmit} />);
      
      // Select stage and fill form
      fireEvent.change(screen.getByTestId('stage-select'), { 
        target: { value: POStage.PLANT_TO_DISTRIBUTION } 
      });
      fireEvent.change(screen.getByTestId('order-id-input'), { target: { value: 'PD-2024-001' } });
      fireEvent.change(screen.getByTestId('vendor-address-input'), { target: { value: '0xvendor123' } });
      fireEvent.change(screen.getByTestId('buyer-address-input'), { target: { value: '0xbuyer456' } });
      
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            purchaseOrder: expect.objectContaining({
              stage: POStage.PLANT_TO_DISTRIBUTION,
              plantDetails: expect.any(Object),
              distributionCenter: expect.any(Object),
              requisitionItems: expect.any(Array),
              projectInfo: expect.any(Object),
            }),
          })
        );
      });
    });

    test('creates RepairToPlantPO when stage is REPAIR_TO_PLANT', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined);
      render(<CreatePOForm onSubmit={mockSubmit} />);
      
      // Select stage and fill form
      fireEvent.change(screen.getByTestId('stage-select'), { 
        target: { value: POStage.REPAIR_TO_PLANT } 
      });
      fireEvent.change(screen.getByTestId('order-id-input'), { target: { value: 'RP-2024-001' } });
      fireEvent.change(screen.getByTestId('vendor-address-input'), { target: { value: '0xvendor123' } });
      fireEvent.change(screen.getByTestId('buyer-address-input'), { target: { value: '0xbuyer456' } });
      
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            purchaseOrder: expect.objectContaining({
              stage: POStage.REPAIR_TO_PLANT,
              repairServiceDetails: expect.any(Object),
              plantDetails: expect.any(Object),
              repairServices: expect.any(Array),
              invoiceDetails: expect.any(Object),
            }),
          })
        );
      });
    });
  });
});