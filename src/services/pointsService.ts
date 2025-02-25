import { PointsData } from '@/types/points';

export async function fetchUserPoints(walletAddress: string): Promise<PointsData> {
  const url = `https://www.data-openblocklabs.com/sonic/user-points-stats?wallet_address=${walletAddress}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch points data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching points data:', error);
    throw error;
  }
} 