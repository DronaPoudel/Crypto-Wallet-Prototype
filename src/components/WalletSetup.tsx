import React, { useState } from 'react';
import { Key, Download, Upload } from 'lucide-react';
import { CryptoUtils } from '../utils/crypto';
import { WalletAccount } from '../types/wallet';

interface WalletSetupProps {
  onWalletCreated: (account: WalletAccount) => void;
}

export const WalletSetup: React.FC<WalletSetupProps> = ({ onWalletCreated }) => {
  const [mnemonic, setMnemonic] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const createNewWallet = async () => {
    setIsCreating(true);
    try {
      const newMnemonic = CryptoUtils.generateMnemonic();
      const account = CryptoUtils.createWalletFromMnemonic(newMnemonic);
      setMnemonic(newMnemonic);
      
      // Auto-proceed after showing mnemonic for 3 seconds
      setTimeout(() => {
        onWalletCreated(account);
      }, 3000);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const importWallet = () => {
    try {
      const account = CryptoUtils.createWalletFromMnemonic(mnemonic);
      onWalletCreated(account);
    } catch (error) {
      alert('Invalid mnemonic phrase');
    }
  };

  if (mnemonic && !showImport) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Wallet Created!</h2>
            <p className="text-gray-600 mt-2">
              Save your recovery phrase securely. You'll need it to restore your wallet.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-mono text-gray-800 leading-relaxed">
              {mnemonic}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> Store this phrase safely. Anyone with access to it can control your wallet.
            </p>
          </div>

          <p className="text-center text-sm text-gray-500">
            Proceeding automatically in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Chain Wallet</h1>
          <p className="text-gray-600 mt-2">
            Create a new wallet or import an existing one
          </p>
        </div>

        {!showImport ? (
          <div className="space-y-4">
            <button
              onClick={createNewWallet}
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              {isCreating ? 'Creating Wallet...' : 'Create New Wallet'}
            </button>

            <button
              onClick={() => setShowImport(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Import Existing Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recovery Phrase (12 words)
              </label>
              <textarea
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="Enter your 12-word recovery phrase..."
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowImport(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={importWallet}
                disabled={!mnemonic.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Import Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};