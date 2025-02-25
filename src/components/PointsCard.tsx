"use client";

import { usePoints } from '@/context/PointsContext';
import { useEffect, useState } from 'react';

export function PointsCard() {
  const { pointsData, isLoading, error } = usePoints();
  const [formattedPoints, setFormattedPoints] = useState<string>('0');

  useEffect(() => {
    if (pointsData) {
      // Format the points with commas for thousands
      setFormattedPoints(Math.round(pointsData.sonic_points).toLocaleString());
    }
  }, [pointsData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 w-full border border-gray-200">
        <div className="flex justify-center items-center h-20">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-5 w-full border border-gray-200">
        <div className="text-center text-sm text-red-500 py-4">
          Error loading points data
        </div>
      </div>
    );
  }

  if (!pointsData) {
    return (
      <div className="bg-white rounded-xl p-5 w-full border border-gray-200">
        <div className="text-center text-sm text-gray-500 py-4">
          No points data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 w-full border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div className="text-gray-500 text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
          Rank <span className="text-gray-800 font-semibold">{pointsData.rank}</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 mr-1.5">
            <img 
              src="https://sonicscan.org/assets/sonic/images/svg/logos/token-light.svg?v=25.2.3.0" 
              alt="Sonic Token" 
              className="w-full h-full"
            />
          </div>
          <h2 className="text-sm font-medium text-gray-700">Your Sonic Points</h2>
        </div>
      </div>
      
      <div className="text-center my-4">
        <p className="text-blue-600 text-4xl font-bold">{formattedPoints}</p>
      </div>
      
      <div className="mt-3 text-center">
        <a 
          href="https://blog.soniclabs.com/sonic-points-simplified-how-to-qualify-for-200-million-s-airdrop/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 text-xs flex items-center justify-center hover:text-blue-600 transition-colors"
        >
          Learn More
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1">
            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
} 