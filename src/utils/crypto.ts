import { ethers } from 'ethers';
import { Network, WalletAccount, Balance } from '../types/wallet';

export class CryptoUtils {
  static generateMnemonic(): string {
    return ethers.Wallet.createRandom().mnemonic?.phrase || '';
  }

  static createWalletFromMnemonic(mnemonic: string): WalletAccount {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic
    };
  }

  static createRandomWallet(): WalletAccount {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase
    };
  }

  static validateAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  static async getBalance(address: string, network: Network): Promise<Balance> {
    try {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const balance = await provider.getBalance(address);
      const formatted = ethers.formatEther(balance);
      
      return {
        formatted: parseFloat(formatted).toFixed(4),
        wei: balance.toString()
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return {
        formatted: '0.0000',
        wei: '0'
      };
    }
  }

  static async getTransactionHistory(address: string, network: Network) {
    // In a real implementation, you would fetch from a blockchain explorer API
    // For demo purposes, we'll return mock data
    return [
      {
        hash: '0x1234567890abcdef1234567890abcdef12345678',
        from: '0x742d35Cc6634C0532925a3b8D478F8e8A9d76100',
        to: address,
        value: ethers.parseEther('0.5').toString(),
        gasPrice: '20000000000',
        gasUsed: '21000',
        timestamp: Date.now() - 86400000,
        status: 'confirmed' as const,
        network: network.id
      }
    ];
  }

  static async sendTransaction(
    privateKey: string,
    to: string,
    amount: string,
    network: Network
  ) {
    try {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const wallet = new ethers.Wallet(privateKey, provider);
      
      const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
        gasLimit: 21000,
      });

      return tx;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }
}