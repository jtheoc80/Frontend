import React, { useState } from 'react';
import { POStage, DistributionToManufacturerPO, PlantToDistributionPO, RepairToPlantPO, CreatePORequest } from '../../types/po';
import { useCurrencyUnit } from '../../contexts/CurrencyUnitContext.tsx';
import { CurrencySelector } from '../../components/CurrencyUnit/CurrencySelector.tsx';
import { CombinedIndicator } from '../../components/CurrencyUnit/CurrencyUnitIndicators.tsx';

interface CreatePOFormProps {
  onSubmit?: (poData: CreatePORequest<any>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const CreatePOForm: React.FC<CreatePOFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [selectedStage, setSelectedStage] = useState<POStage>(POStage.DISTRIBUTION_TO_MANUFACTURER);
  const [orderId, setOrderId] = useState('');
  const [vendorAddress, setVendorAddress] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { selectedCurrency, formatCurrency } = useCurrencyUnit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!orderId || !vendorAddress || !buyerAddress) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const basePO = {
        orderId,
        timestamp: Date.now(),
        metadataHash: `0x${Math.random().toString(16).substring(2)}`,
        vendorAddress,
        buyerAddress,
        totalAmount,
        currency: selectedCurrency,
        status: 'pending' as const,
      };

      let purchaseOrder: any;

      switch (selectedStage) {
        case POStage.DISTRIBUTION_TO_MANUFACTURER:
          purchaseOrder = {
            ...basePO,
            stage: POStage.DISTRIBUTION_TO_MANUFACTURER,
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
          } satisfies DistributionToManufacturerPO;
          break;

        case POStage.PLANT_TO_DISTRIBUTION:
          purchaseOrder = {
            ...basePO,
            stage: POStage.PLANT_TO_DISTRIBUTION,
            plantDetails: {
              plantId: 'PLANT-001',
              name: 'Test Plant',
              location: 'Test Location',
              contactPerson: 'Test Contact',
            },
            distributionCenter: {
              centerId: 'DC-001',
              name: 'Test DC',
              location: 'Test DC Location',
            },
            requisitionItems: [],
            requestedDeliveryDate: new Date().toISOString().split('T')[0],
            projectInfo: {
              projectId: 'PROJ-001',
              description: 'Test Project',
              budgetCode: 'BUD-001',
            },
          } satisfies PlantToDistributionPO;
          break;

        case POStage.REPAIR_TO_PLANT:
          purchaseOrder = {
            ...basePO,
            stage: POStage.REPAIR_TO_PLANT,
            repairServiceDetails: {
              serviceProviderId: 'RS-001',
              name: 'Test Repair Service',
              certifications: ['ASME'],
              contactInfo: 'test@repair.com',
            },
            plantDetails: {
              plantId: 'PLANT-001',
              name: 'Test Plant',
              contactPerson: 'Test Contact',
            },
            repairServices: [],
            invoiceDetails: {
              invoiceNumber: 'INV-001',
              issueDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              taxRate: 0.08,
              taxAmount: totalAmount * 0.08,
              subtotal: totalAmount,
            },
          } satisfies RepairToPlantPO;
          break;
      }

      const request: CreatePORequest<any> = {
        purchaseOrder,
        nonce: Math.floor(Math.random() * 1000000),
      };

      if (onSubmit) {
        await onSubmit(request);
        setSuccess('Purchase Order created successfully!');
        // Reset form
        setOrderId('');
        setVendorAddress('');
        setBuyerAddress('');
        setTotalAmount(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create Purchase Order');
    }
  };

  const formStyle: React.CSSProperties = {
    padding: '24px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    maxWidth: '600px',
    margin: '0 auto',
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '16px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '12px',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: isLoading ? '#a0aec0' : '#3182ce',
    color: 'white',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    color: '#4a5568',
  };

  const alertStyle: React.CSSProperties = {
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
  };

  const errorAlertStyle: React.CSSProperties = {
    ...alertStyle,
    backgroundColor: '#fed7d7',
    color: '#c53030',
    border: '1px solid #feb2b2',
  };

  const successAlertStyle: React.CSSProperties = {
    ...alertStyle,
    backgroundColor: '#c6f6d5',
    color: '#2f855a',
    border: '1px solid #9ae6b4',
  };

  return (
    <div data-testid="create-po-form" style={formStyle}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
        Create Purchase Order
      </h2>

      {error && (
        <div data-testid="error-alert" style={errorAlertStyle}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div data-testid="success-alert" style={successAlertStyle}>
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>PO Stage *</label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as POStage)}
            data-testid="stage-select"
            style={inputStyle}
          >
            <option value={POStage.DISTRIBUTION_TO_MANUFACTURER}>
              Distribution to Manufacturer
            </option>
            <option value={POStage.PLANT_TO_DISTRIBUTION}>
              Plant to Distribution
            </option>
            <option value={POStage.REPAIR_TO_PLANT}>
              Repair to Plant
            </option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Order ID *</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter order ID"
            data-testid="order-id-input"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Vendor Address *</label>
          <input
            type="text"
            value={vendorAddress}
            onChange={(e) => setVendorAddress(e.target.value)}
            placeholder="0x..."
            data-testid="vendor-address-input"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Buyer Address *</label>
          <input
            type="text"
            value={buyerAddress}
            onChange={(e) => setBuyerAddress(e.target.value)}
            placeholder="0x..."
            data-testid="buyer-address-input"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Total Amount *</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
            min={0}
            data-testid="total-amount-input"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            data-testid="currency-select"
            style={inputStyle}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ETH">ETH</option>
          </select>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            type="submit"
            disabled={isLoading}
            data-testid="submit-button"
            style={primaryButtonStyle}
          >
            {isLoading ? 'Creating...' : 'Create Purchase Order'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              data-testid="cancel-button"
              style={secondaryButtonStyle}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatePOForm;