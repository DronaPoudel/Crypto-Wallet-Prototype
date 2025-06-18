export interface Network {
  id: string;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
  chainId: number;
  color: string;
}

export interface WalletAccount {
  address: string;
  privateKey: string;
  mnemonic?: string;
}

export interface Balance {
  formatted: string;
  wei: string;
  usd?: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  network: string;
}

export interface DAppConnection {
  origin: string;
  name: string;
  icon?: string;
  permissions: string[];
  connected: boolean;
}

export interface WalletState {
  account: WalletAccount | null;
  currentNetwork: Network;
  balances: Record<string, Balance>;
  transactions: Transaction[];
  dappConnections: DAppConnection[];
  isConnecting: boolean;
  error: string | null;
}