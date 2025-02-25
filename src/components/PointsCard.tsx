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
      <div className="bg-white rounded-lg p-4 shadow-md w-full border border-gray-200">
        <p className="text-center text-sm text-gray-600">Loading points data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md w-full border border-gray-200">
        <p className="text-center text-sm text-red-500">Error loading points data</p>
      </div>
    );
  }

  if (!pointsData) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md w-full border border-gray-200">
        <p className="text-center text-sm text-gray-600">No points data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div className="text-gray-500 text-xs font-bold">
          Rank <span className="text-gray-800">{pointsData.rank}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-1">
            <img 
              src="https://sonicscan.org/assets/sonic/images/svg/logos/token-light.svg?v=25.2.3.0" 
              alt="Sonic Token" 
              className="w-full h-full"
            />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Your Sonic Points</h2>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <p className="text-blue-600 text-4xl font-bold">{formattedPoints}</p>
      </div>
      
      <div className="mt-2 text-center">
        <a 
          href="https://blog.soniclabs.com/sonic-points-simplified-how-to-qualify-for-200-million-s-airdrop/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 text-xs flex items-center justify-center hover:text-blue-600"
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