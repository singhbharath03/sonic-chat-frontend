"use client";

import { useEffect } from 'react';
import { makeRequest } from '@/services/chatService';
import { usePrivy } from '@privy-io/react-auth';
import { useHoldings } from '@/context/HoldingsContext';

interface SidebarProps {
  heading: string;
}

interface DisplayValue {
  value: number;
  display_value: string;
}

interface TokenData {
  token_address: string;
  balance: DisplayValue;
  name: string;
  symbol: string;
  decimals: number;
  logo_url: string;
  price?: DisplayValue;
  usd_value?: DisplayValue;
}

interface ApiResponse {
  holdings: TokenData[];
  total_usd_value?: DisplayValue;
}

export function Sidebar({ heading }: SidebarProps) {
  const { holdingsData, setHoldingsData } = useHoldings();
  const { user } = usePrivy();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      const userId = user.id;
      const response = await makeRequest<ApiResponse>('/chat/sonic_holdings', userId);
      setHoldingsData(response);
    };

    fetchData();
  }, [user?.id, setHoldingsData]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{heading}</h2>
        <div className="text-sm font-semibold">
          {holdingsData?.total_usd_value?.display_value}
        </div>
      </div>
      <div className="overflow-y-auto max-h-80">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-2 text-left">Token</th>
              <th className="py-2 px-2 text-left">Balance</th>
              <th className="py-2 px-2 text-left">USD</th>
            </tr>
          </thead>
          <tbody>
            {holdingsData?.holdings.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-2 flex items-center">
                  <img src={row.logo_url} alt={row.name} className="w-5 h-5 mr-1" />
                  {row.symbol}
                </td>
                <td className="py-2 px-2 text-sm">{row.balance.display_value}</td>
                <td className="py-2 px-2 text-sm">{row.usd_value?.display_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
