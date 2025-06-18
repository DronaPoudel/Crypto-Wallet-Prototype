import React, { useState, useEffect } from 'react';
import { WalletSetup } from './components/WalletSetup';
import { WalletHeader } from './components/WalletHeader';
import { BalanceCard } from './components/BalanceCard';
import { TransactionHistory } from './components/TransactionHistory';
import { SendTransaction } from './components/SendTransaction';
import { DAppConnections } from './components/DAppConnections';
import { CryptoUtils } from './utils/crypto';
import { NETWORKS, DEFAULT_NETWORK } from './config/networks';
import { WalletAccount, Network, Balance, Transaction, DAppConnection } from './types/wallet';

function App() {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<Network>(DEFAULT_NETWORK);
  const [balances, setBalances] = useState<Record<string, Balance>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dappConnections, setDappConnections] = useState<DAppConnection[]>([
    {
      origin: 'https://uniswap.org',
      name: 'Uniswap',
      permissions: ['eth_accounts', 'eth_sendTransaction'],
      connected: true
    },
    {
      origin: 'https://opensea.io',
      name: 'OpenSea',
      permissions: ['eth_accounts'],
      connected: false
    }
  ]);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  // Load balances for all networks when account changes
  useEffect(() => {
    if (account) {
      Object.values(NETWORKS).forEach(async (network) => {
        setIsLoading(prev => ({ ...prev, [network.id]: true }));
        
        try {
          const balance = await CryptoUtils.getBalance(account.address, network);
          setBalances(prev => ({ ...prev, [network.id]: balance }));
        } catch (error) {
          console.error(`Failed to fetch balance for ${network.name}:`, error);
        } finally {
          setIsLoading(prev => ({ ...prev, [network.id]: false }));
        }
      });

      // Load transaction history
      loadTransactionHistory();
    }
  }, [account]);

  const loadTransactionHistory = async () => {
    if (!account) return;
    
    try {
      const txHistory = await CryptoUtils.getTransactionHistory(account.address, currentNetwork);
      setTransactions(txHistory);
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    }
  };

  const handleNetworkChange = (network: Network) => {
    setCurrentNetwork(network);
    loadTransactionHistory();
  };

  const handleTransactionSent = (txHash: string) => {
    // Add the new transaction to the list
    const newTransaction: Transaction = {
      hash: txHash,
      from: account!.address,
      to: '', // This would be filled from the transaction details
      value: '0',
      gasPrice: '0',
      gasUsed: '0',
      timestamp: Date.now(),
      status: 'pending',
      network: currentNetwork.id
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Refresh balance after transaction
    if (account) {
      CryptoUtils.getBalance(account.address, currentNetwork).then(balance => {
        setBalances(prev => ({ ...prev, [currentNetwork.id]: balance }));
      });
    }
  };

  const handleDAppDisconnect = (origin: string) => {
    setDappConnections(prev => 
      prev.map(conn => 
        conn.origin === origin 
          ? { ...conn, connected: false }
          : conn
      )
    );
  };

  if (!account) {
    return <WalletSetup onWalletCreated={setAccount} />;
  }

  const isConnected = Object.keys(balances).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <WalletHeader
        account={account}
        currentNetwork={currentNetwork}
        isConnected={isConnected}
        onNetworkChange={handleNetworkChange}
        networks={NETWORKS}
      />

      <div className="max-w-6xl mx-auto p-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.values(NETWORKS).map((network) => (
            <BalanceCard
              key={network.id}
              network={network}
              balance={balances[network.id] || { formatted: '0.0000', wei: '0' }}
              isLoading={isLoading[network.id] || false}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <SendTransaction
              network={currentNetwork}
              privateKey={account.privateKey}
              onTransactionSent={handleTransactionSent}
            />
            
            <DAppConnections
              connections={dappConnections}
              onDisconnect={handleDAppDisconnect}
            />
          </div>

          {/* Right Column */}
          <div>
            <TransactionHistory
              transactions={transactions}
              currentAddress={account.address}
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Security Notice:</strong> This is a prototype wallet for demonstration purposes. 
              In a production environment, private keys should be encrypted and stored securely, 
              never in plain text. Consider using hardware wallets or secure key management services 
              for real cryptocurrency operations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;