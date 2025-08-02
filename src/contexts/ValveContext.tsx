import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Valve, ManufacturerInterval, ValveContextType } from '../types/valve';
import ValveService from '../services/valveService.ts';

// Create the context
const ValveContext = createContext<ValveContextType | undefined>(undefined);

// Provider component props
interface ValveProviderProps {
  children: ReactNode;
}

// Provider component
export const ValveProvider: React.FC<ValveProviderProps> = ({ children }) => {
  const [valves, setValves] = useState<Valve[]>([]);
  const [manufacturerIntervals, setManufacturerIntervals] = useState<ManufacturerInterval>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch valves data
  const fetchValves = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const [valvesData, intervalsData] = await Promise.all([
        ValveService.getValves(),
        ValveService.getManufacturerIntervals(),
      ]);
      
      setValves(valvesData);
      setManufacturerIntervals(intervalsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch valve data');
      console.error('Error fetching valve data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data - same as fetchValves but can be extended later
  const refreshData = async (): Promise<void> => {
    await fetchValves();
  };

  // Load data on component mount
  useEffect(() => {
    fetchValves();
  }, []);

  const contextValue: ValveContextType = {
    valves,
    manufacturerIntervals,
    loading,
    error,
    fetchValves,
    refreshData,
  };

  return (
    <ValveContext.Provider value={contextValue}>
      {children}
    </ValveContext.Provider>
  );
};

// Custom hook to use the valve context
export const useValves = (): ValveContextType => {
  const context = useContext(ValveContext);
  if (context === undefined) {
    throw new Error('useValves must be used within a ValveProvider');
  }
  return context;
};

export default ValveContext;