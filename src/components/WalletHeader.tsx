import React from 'react';
import { Wallet, Wifi, WifiOff } from 'lucide-react';
import { WalletAccount, Network } from '../types/wallet';

interface WalletHeaderProps {
  account: WalletAccount | null;
  currentNetwork: Network;
  isConnected: boolean;
  onNetworkChange: (network: Network) => void;
  networks: Record<string, Network>;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({
  account,
  currentNetwork,
  isConnected,
  onNetworkChange,
  networks
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Multi-Chain Wallet</h1>
            {account && (
              <p className="text-sm text-gray-500">
                {`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <select
            value={currentNetwork.id}
            onChange={(e) => onNetworkChange(networks[e.target.value])}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(networks).map((network) => (
              <option key={network.id} value={network.id}>
                {network.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};