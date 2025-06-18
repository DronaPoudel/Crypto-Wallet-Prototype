import React from 'react';
import { Balance, Network } from '../types/wallet';

interface BalanceCardProps {
  network: Network;
  balance: Balance;
  isLoading: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  network,
  balance,
  isLoading
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: network.color }}
          >
            {network.symbol.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{network.name}</h3>
            <p className="text-sm text-gray-500">{network.symbol}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          {isLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              {balance.formatted}
            </span>
          )}
          <span className="text-sm text-gray-500">{network.symbol}</span>
        </div>
        
        {balance.usd && (
          <p className="text-sm text-gray-600">
            ≈ ${balance.usd.toFixed(2)} USD
          </p>
        )}
      </div>
    </div>
  );
};