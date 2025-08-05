// Blockchain service for interacting with ValveChain smart contract
import { ethers } from 'ethers';
import ValveChainABI from '../abi/ValveChainABI.json';

// Default configuration - can be overridden via environment variables
const DEFAULT_CONFIG = {
  // For demo purposes, use a mock RPC URL or local development chain
  rpcUrl: process.env.REACT_APP_RPC_URL || 'http://localhost:8545',
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
  pollInterval: parseInt(process.env.REACT_APP_POLL_INTERVAL || '30000'), // 30 seconds
};

export interface TokenCountData {
  totalTokens: number;
  activeTokens: number;
  lastUpdated: Date;
}

export interface BlockchainServiceError {
  code: string;
  message: string;
  details?: any;
}

class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;
  private isConnected: boolean = false;
  private mockMode: boolean = true; // Use mock data when blockchain is not available

  // Mock data for demonstration
  private mockTokenCount: number = 1247;

  constructor() {
    this.initializeProvider();
  }

  /**
   * Initialize the blockchain provider and contract
   */
  private async initializeProvider(): Promise<void> {
    try {
      // Try to connect to the blockchain
      this.provider = new ethers.JsonRpcProvider(DEFAULT_CONFIG.rpcUrl);
      
      // Test the connection
      await this.provider.getNetwork();
      
      // Initialize the contract
      this.contract = new ethers.Contract(
        DEFAULT_CONFIG.contractAddress,
        ValveChainABI,
        this.provider
      );

      this.isConnected = true;
      this.mockMode = false;
      console.log('✅ Blockchain service connected successfully');
      
    } catch (error) {
      console.warn('⚠️ Blockchain connection failed, using mock data:', error);
      this.isConnected = false;
      this.mockMode = true;
    }
  }

  /**
   * Get the current token count from blockchain or mock data
   */
  async getTokenCount(): Promise<TokenCountData> {
    if (this.mockMode) {
      return this.getMockTokenCount();
    }

    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      // For real blockchain implementation, we would call contract methods
      // Since the current ABI doesn't have a getTotalTokens function,
      // we would need to either:
      // 1. Add this function to the smart contract
      // 2. Query events to count tokens
      // 3. Use a subgraph or indexer
      
      // For now, simulate the blockchain call with mock data
      return this.getMockTokenCount();
      
    } catch (error) {
      console.error('Error fetching token count from blockchain:', error);
      
      // Fallback to mock data on error
      return this.getMockTokenCount();
    }
  }

  /**
   * Get mock token count data for demonstration
   */
  private getMockTokenCount(): TokenCountData {
    // Simulate some variation in the token count
    const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    const totalTokens = Math.max(0, this.mockTokenCount + variation);
    
    return {
      totalTokens,
      activeTokens: totalTokens, // Assume all tokens are active for demo
      lastUpdated: new Date()
    };
  }

  /**
   * Simulate tokenizing a valve to increment mock count
   */
  simulateTokenizeValve(): void {
    if (this.mockMode) {
      this.mockTokenCount += 1;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    isConnected: boolean;
    isMockMode: boolean;
    provider: string | null;
  } {
    return {
      isConnected: this.isConnected,
      isMockMode: this.mockMode,
      provider: this.mockMode ? 'Mock Provider' : DEFAULT_CONFIG.rpcUrl,
    };
  }

  /**
   * Attempt to reconnect to the blockchain
   */
  async reconnect(): Promise<boolean> {
    console.log('🔄 Attempting to reconnect to blockchain...');
    await this.initializeProvider();
    return this.isConnected;
  }

  /**
   * Get poll interval for real-time updates
   */
  getPollInterval(): number {
    return DEFAULT_CONFIG.pollInterval;
  }

  /**
   * Clean up resources
   */
  disconnect(): void {
    this.provider = null;
    this.contract = null;
    this.isConnected = false;
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;