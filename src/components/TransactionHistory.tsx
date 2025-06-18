import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Transaction } from '../types/wallet';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currentAddress: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  currentAddress
}) => {
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const formatAmount = (value: string) => {
    const eth = parseFloat(value) / 1e18;
    return eth.toFixed(4);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          transactions.map((tx) => {
            const isOutgoing = tx.from.toLowerCase() === currentAddress.toLowerCase();
            const otherAddress = isOutgoing ? tx.to : tx.from;
            
            return (
              <div key={tx.hash} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      isOutgoing ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {isOutgoing ? (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {isOutgoing ? 'Sent' : 'Received'}
                        </span>
                        {getStatusIcon(tx.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {isOutgoing ? 'To: ' : 'From: '}
                        {`${otherAddress.slice(0, 6)}...${otherAddress.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-medium ${
                      isOutgoing ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {isOutgoing ? '-' : '+'}
                      {formatAmount(tx.value)} ETH
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};