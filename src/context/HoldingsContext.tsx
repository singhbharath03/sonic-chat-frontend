"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ApiResponse } from '@/types/chat';

interface HoldingsContextProps {
  holdingsData: ApiResponse | undefined;
  setHoldingsData: (data: ApiResponse) => void;
  refreshKey: number;
}

const HoldingsContext = createContext<HoldingsContextProps | undefined>(undefined);

export const HoldingsProvider = ({ children }: { children: ReactNode }) => {
  const [holdingsData, setHoldingsDataState] = useState<ApiResponse>();
  const [refreshKey, setRefreshKey] = useState(0);

  // Create a stable callback function that logs when holdings data is updated
  const setHoldingsData = useCallback((data: ApiResponse) => {
    setHoldingsDataState(data);
    // Increment the refresh key to force re-renders of components that use this context
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <HoldingsContext.Provider value={{ holdingsData, setHoldingsData, refreshKey }}>
      {children}
    </HoldingsContext.Provider>
  );
};

export const useHoldings = () => {
  const context = useContext(HoldingsContext);
  if (!context) {
    throw new Error('useHoldings must be used within a HoldingsProvider');
  }
  return context;
};
