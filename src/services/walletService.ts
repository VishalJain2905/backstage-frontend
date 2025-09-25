import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  provider: any;
  signer: any;
}

export interface WalletSignature {
  address: string;
  signature: string;
  message: string;
}

class WalletService {
  private provider: any = null;
  private signer: any = null;

  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
  }

  // Connect to MetaMask
  async connectMetaMask(): Promise<WalletInfo> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
      }

      // Create provider and signer
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();

      return {
        address,
        provider: this.provider,
        signer: this.signer,
      };
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      } else if (error.code === -32002) {
        throw new Error('Connection request is already pending. Please check MetaMask.');
      }
      
      throw new Error(`Failed to connect to MetaMask: ${error.message}`);
    }
  }

  // Sign a message with the connected wallet
  async signMessage(message: string): Promise<WalletSignature> {
    if (!this.signer) {
      throw new Error('No wallet connected. Please connect your wallet first.');
    }

    try {
      const address = await this.signer.getAddress();
      const signature = await this.signer.signMessage(message);

      return {
        address,
        signature,
        message,
      };
    } catch (error: any) {
      console.error('Message signing error:', error);
      
      if (error.code === 4001) {
        throw new Error('Signature rejected by user');
      }
      
      throw new Error(`Failed to sign message: ${error.message}`);
    }
  }

  // Generate a login message with nonce
  generateLoginMessage(address: string, nonce: string): string {
    const domain = window.location.host;
    const timestamp = new Date().toISOString();
    
    return `Welcome to ${domain}!

Please sign this message to authenticate your wallet.

Wallet Address: ${address}
Nonce: ${nonce}
Timestamp: ${timestamp}

This request will not trigger a blockchain transaction or cost any gas fees.`;
  }

  // Connect to Phantom wallet (for Solana)
  async connectPhantom(): Promise<WalletInfo> {
    if (typeof window === 'undefined' || !(window as any).solana?.isPhantom) {
      throw new Error('Phantom wallet is not installed. Please install Phantom to continue.');
    }

    try {
      const response = await (window as any).solana.connect();
      const address = response.publicKey.toString();

      return {
        address,
        provider: (window as any).solana,
        signer: (window as any).solana,
      };
    } catch (error: any) {
      console.error('Phantom connection error:', error);
      throw new Error(`Failed to connect to Phantom: ${error.message}`);
    }
  }

  // Sign message with Phantom
  async signMessagePhantom(message: string): Promise<WalletSignature> {
    if (typeof window === 'undefined' || !(window as any).solana?.isPhantom) {
      throw new Error('Phantom wallet is not connected');
    }

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await (window as any).solana.signMessage(encodedMessage);
      const address = (window as any).solana.publicKey.toString();

      return {
        address,
        signature: Array.from(signedMessage.signature).join(','),
        message,
      };
    } catch (error: any) {
      console.error('Phantom signing error:', error);
      throw new Error(`Failed to sign message with Phantom: ${error.message}`);
    }
  }

  // Generic wallet connection based on wallet type
  async connectWallet(walletType: string): Promise<WalletInfo> {
    switch (walletType) {
      case 'metamask':
        return this.connectMetaMask();
      case 'phantom':
        return this.connectPhantom();
      case 'walletconnect':
        throw new Error('WalletConnect integration coming soon');
      case 'coinbase':
        throw new Error('Coinbase Wallet integration coming soon');
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  // Generic message signing based on wallet type
  async signWalletMessage(walletType: string, message: string): Promise<WalletSignature> {
    switch (walletType) {
      case 'metamask':
        return this.signMessage(message);
      case 'phantom':
        return this.signMessagePhantom(message);
      default:
        throw new Error(`Message signing not implemented for wallet type: ${walletType}`);
    }
  }

  // Disconnect wallet
  disconnect(): void {
    this.provider = null;
    this.signer = null;
  }

  // Get current wallet address
  async getCurrentAddress(): Promise<string | null> {
    if (!this.signer) return null;
    
    try {
      return await this.signer.getAddress();
    } catch {
      return null;
    }
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return !!this.signer;
  }
}

export const walletService = new WalletService();
