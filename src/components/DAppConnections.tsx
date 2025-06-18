import React from 'react';
import { Globe, Check, X } from 'lucide-react';
import { DAppConnection } from '../types/wallet';

interface DAppConnectionsProps {
  connections: DAppConnection[];
  onDisconnect: (origin: string) => void;
}

export const DAppConnections: React.FC<DAppConnectionsProps> = ({
  connections,
  onDisconnect
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">DApp Connections</h3>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {connections.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No DApp connections
          </div>
        ) : (
          connections.map((connection) => (
            <div key={connection.origin} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {connection.icon ? (
                    <img src={connection.icon} alt="" className="w-6 h-6" />
                  ) : (
                    <Globe className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{connection.name}</h4>
                  <p className="text-sm text-gray-500">{connection.origin}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {connection.connected ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    connection.connected ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {connection.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                <button
                  onClick={() => onDisconnect(connection.origin)}
                  className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};