import React, { useState, useEffect } from 'react';
import { POStage, BasePurchaseOrder } from '../../types/po';
import { CurrencyDisplay } from '../Globalization/index.ts';
import { SupportedCurrency } from '../../types/globalization';

interface POListProps {
  purchaseOrders?: BasePurchaseOrder[];
  onLoadPOs?: () => Promise<BasePurchaseOrder[]>;
  onViewDetails?: (po: BasePurchaseOrder) => void;
  onDeletePO?: (orderId: string) => Promise<void>;
  isLoading?: boolean;
}

export const POList: React.FC<POListProps> = ({
  purchaseOrders = [],
  onLoadPOs,
  onViewDetails,
  onDeletePO,
  isLoading = false
}) => {
  const [loadedPOs, setLoadedPOs] = useState<BasePurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Use either loaded POs or prop POs
  const allPOs = loadedPOs.length > 0 ? loadedPOs : purchaseOrders;

  // Calculate filtered POs directly instead of using state
  let filteredPOs = allPOs;

  // Filter by search term
  if (searchTerm) {
    filteredPOs = filteredPOs.filter(po =>
      po.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.buyerAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter by status
  if (statusFilter !== 'all') {
    filteredPOs = filteredPOs.filter(po => po.status === statusFilter);
  }

  // Filter by stage (if stage property exists)
  if (stageFilter !== 'all') {
    filteredPOs = filteredPOs.filter(po => 
      'stage' in po && (po as any).stage === stageFilter
    );
  }

  const loadPOs = async () => {
    if (onLoadPOs) {
      try {
        setError(null);
        const loadedPOs = await onLoadPOs();
        setLoadedPOs(loadedPOs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Purchase Orders');
      }
    }
  };

  const handleDeletePO = async (orderId: string) => {
    if (onDeletePO) {
      try {
        await onDeletePO(orderId);
        if (loadedPOs.length > 0) {
          setLoadedPOs(prev => prev.filter(po => po.orderId !== orderId));
        }
        console.log('Purchase Order deleted successfully');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete Purchase Order');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#fed7d7';
      case 'approved':
        return '#bee3f8';
      case 'fulfilled':
        return '#c6f6d5';
      case 'cancelled':
        return '#fed7d7';
      default:
        return '#f7fafc';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    margin: '20px 0',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '14px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
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

  const dangerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #fc8181',
    color: '#e53e3e',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
  };

  const thStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '2px solid #e2e8f0',
    textAlign: 'left',
    fontWeight: 'bold',
    backgroundColor: '#f7fafc',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
  };

  const badgeStyle = (status: string): React.CSSProperties => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: getStatusColor(status),
    color: '#1a202c',
    textTransform: 'uppercase',
  });

  const alertStyle: React.CSSProperties = {
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    border: '1px solid #feb2b2',
  };

  return (
    <div data-testid="po-list" style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Purchase Orders
        </h2>
        {onLoadPOs && (
          <button
            onClick={loadPOs}
            disabled={isLoading}
            data-testid="refresh-button"
            style={primaryButtonStyle}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        )}
      </div>

      {error && (
        <div data-testid="error-alert" style={alertStyle}>
          ⚠️ {error}
        </div>
      )}

      {/* Filters */}
      <div style={filtersStyle}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by Order ID, Vendor, or Buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-input"
            style={{ ...inputStyle, width: '300px', paddingLeft: '32px' }}
          />
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
            🔍
          </span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="status-filter"
          style={{ ...inputStyle, width: '150px' }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          data-testid="stage-filter"
          style={{ ...inputStyle, width: '200px' }}
        >
          <option value="all">All Stages</option>
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

      {/* Results count */}
      <p style={{ fontSize: '14px', color: '#718096', margin: '16px 0' }} data-testid="results-count">
        Showing {filteredPOs.length} of {allPOs.length} purchase orders
      </p>

      {/* Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p>Loading purchase orders...</p>
        </div>
      ) : filteredPOs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px' }} data-testid="empty-state">
          <p style={{ fontSize: '18px', color: '#a0aec0' }}>
            {allPOs.length === 0 ? 'No purchase orders found' : 'No purchase orders match your search criteria'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle} data-testid="po-table">
            <thead>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Total Amount</th>
                <th style={thStyle}>Vendor</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOs.map((po) => (
                <tr key={po.orderId} data-testid={`po-row-${po.orderId}`}>
                  <td style={tdStyle}>
                    <strong>{po.orderId}</strong>
                  </td>
                  <td style={tdStyle}>{formatDate(po.timestamp)}</td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(po.status)}>
                      {po.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <CurrencyDisplay
                      amount={po.totalAmount}
                      currency={po.currency as SupportedCurrency}
                      size="sm"
                      showOriginal={true}
                    />
                  </td>
                  <td style={tdStyle}>
                    <code style={{ fontSize: '12px' }}>
                      {po.vendorAddress.substring(0, 8)}...
                      {po.vendorAddress.substring(po.vendorAddress.length - 6)}
                    </code>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(po)}
                          data-testid={`view-button-${po.orderId}`}
                          style={secondaryButtonStyle}
                        >
                          View
                        </button>
                      )}
                      {onDeletePO && (
                        <button
                          onClick={() => handleDeletePO(po.orderId)}
                          data-testid={`delete-button-${po.orderId}`}
                          style={dangerButtonStyle}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default POList;