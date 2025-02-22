"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { ApiResponse } from '@/types/chat';

interface HoldingsContextProps {
  holdingsData: ApiResponse | undefined;
  setHoldingsData: (data: ApiResponse) => void;
}

const HoldingsContext = createContext<HoldingsContextProps | undefined>(undefined);

export const HoldingsProvider = ({ children }: { children: ReactNode }) => {
  const [holdingsData, setHoldingsData] = useState<ApiResponse>();

  return (
    <HoldingsContext.Provider value={{ holdingsData, setHoldingsData }}>
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
