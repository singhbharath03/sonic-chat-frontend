"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PointsData } from '@/types/points';
import { fetchUserPoints } from '@/services/pointsService';
import { useWallets } from '@privy-io/react-auth';

interface PointsContextProps {
  pointsData: PointsData | null;
  isLoading: boolean;
  error: Error | null;
}

const PointsContext = createContext<PointsContextProps | undefined>(undefined);

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { wallets } = useWallets();

  useEffect(() => {
    const fetchData = async () => {
      if (!wallets || wallets.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // Use the first wallet's address
        const walletAddress = wallets[0].address;
        
        // For testing, you can use the sample wallet address
        // const walletAddress = "0x1C2305184dc407207783b8983a45fE5A65E244E7";
        
        const data = await fetchUserPoints(walletAddress);
        setPointsData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching points data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [wallets]);

  return (
    <PointsContext.Provider value={{ pointsData, isLoading, error }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}; 