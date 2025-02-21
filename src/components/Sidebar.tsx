"use client";
import { useEffect, useState } from 'react';
import { makeRequest } from '@/services/chatService';

interface SidebarProps {
  heading: string;
}

interface TokenData {
  token_address: string;
  balance: number;
  name: string;
  symbol: string;
  decimals: number;
  logo_url: string;
  price: number;
  usd_value: number;
}

interface ApiResponse {
  holdings: TokenData[];
  total_usd_value: number;
}

export function Sidebar({ heading }: SidebarProps) {
  const [data, setData] = useState<TokenData[]>([]);
  const [totalUsdValue, setTotalUsdValue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'did:privy:cm7c8ev7t04cl4ecd9qdsoga9'; // Replace with actual user ID
        const response = await makeRequest<ApiResponse>('/chat/sonic_holdings', userId);
        setData(response.holdings);
        setTotalUsdValue(response.total_usd_value);
        console.log(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{heading}</h2>
        <div className="text-lg font-semibold">
          <strong>Total USD Value: </strong>{totalUsdValue}
        </div>
      </div>
      <div className="overflow-y-auto max-h-96">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left w-1/2">Token</th>
              <th className="py-2 px-4 text-left w-1/4">Balance</th>
              <th className="py-2 px-4 text-left w-1/4">USD Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 flex items-center w-full">
                  <img src={row.logo_url} alt={row.name} className="w-6 h-6 mr-2" />
                  {row.symbol}
                </td>
                <td className="py-2 px-4">{row.balance}</td>
                <td className="py-2 px-4">{row.usd_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
