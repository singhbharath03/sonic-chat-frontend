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
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800">{heading}</h2>
        {holdingsData?.total_usd_value && (
          <div className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
            {holdingsData.total_usd_value.display_value}
          </div>
        )}
      </div>
      
      <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdingsData?.holdings.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img src={row.logo_url} alt={row.name} className="w-6 h-6 mr-2 rounded-full" />
                    <div>
                      <div className="font-medium text-gray-900">{row.symbol}</div>
                      <div className="text-xs text-gray-500">{row.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{row.balance.display_value}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{row.usd_value?.display_value || '-'}</td>
              </tr>
            ))}
            {!holdingsData?.holdings.length && (
              <tr>
                <td colSpan={3} className="py-4 px-4 text-center text-sm text-gray-500">
                  No assets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
