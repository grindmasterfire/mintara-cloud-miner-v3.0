
export enum AppLifecycle {
  SPLASH = 'SPLASH',
  LOGIN = 'LOGIN',
  ENTRY_ADS = 'ENTRY_ADS',
  MAIN_MENU = 'MAIN_MENU',
  IN_VIEW = 'IN_VIEW'
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD', // This is now the Main Menu Grid
  MINING = 'MINING',
  GAMEROOM = 'GAMEROOM',
  STAKING = 'STAKING',
  PERMAFROST = 'PERMAFROST',
  MARKETPLACE = 'MARKETPLACE',
  TREASURY = 'TREASURY',
  WALLET = 'WALLET',
  PROFILE = 'PROFILE'
}

export enum SessionType {
  MINING = 'MINING', // High intensity
  ZENNER = 'ZENNER', // Meditative
  EXTENSION = 'EXTENSION' // Portal
}

export enum SessionStatus {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING', // New state for "Bot Filter" button
  VERIFYING = 'VERIFYING',
  HOUSE_ADS = 'HOUSE_ADS',
  ACTIVE_LOOP = 'ACTIVE_LOOP',
  MINING_AD = 'MINING_AD',
  ANTI_AFK = 'ANTI_AFK', // The "Continue" button state
  RESUMING = 'RESUMING', // The 3s buffer state
  CLAIMING = 'CLAIMING', 
  COMPLETED = 'COMPLETED'
}

export interface GlobalSessionState {
  isActive: boolean;
  houseAdsWatched: number;
  miningAdsWatched: number;
  currentEarnings: number;
  sessionId: string | null;
  // Persistence
  activeGameId: string;
  loopElapsed: number; // Seconds
  loopStatus: SessionStatus;
}

export interface Game {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  url: string;
  color: string;
  hash: string; // Simulated SHA-256 hash
  description: string;
}

export interface UserStats {
  username?: string;
  mtraBalance: number;
  pfBalance: number;
  stakedMtra: number;
  legacyStatus: boolean;
  tier: 'Genesis' | 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Standard';
  sessionCount: number;
}

export interface TreasuryData {
  warChestBalance: number; // in USD
  discoveryHashRate: number; // Current mining rate
  circulatingSupply: number;
  lockedSupply: number;
  burnedSupply: number;
  backingRatio: number;
}

export type ListingType = 'BUY' | 'SELL';
export type AssetClass = 'PF' | 'CRYPTO' | 'NFT';

export interface PFListing {
  id: string;
  seller: string; // Wallet Address or "YOU"
  type: ListingType;
  
  // Asset A (What is being sold/offered)
  assetSymbol: string; 
  assetClass: AssetClass;
  amount: number;
  
  // Asset B (What is wanted in return)
  priceSymbol: string; // USDC, ETH, etc.
  priceAmount: number;

  timelock: 'Instant' | '1h' | '24h' | '5d' | '30d';
  isWash: boolean;
  acceptsBots: boolean; 
  status: 'ACTIVE' | 'FILLED' | 'CANCELLED';
}

// Backend Response Types
export interface MiningResponse {
  success: boolean;
  earnedMtra: number;
  txHash?: string;
  error?: string;
}

// Staking Types
export interface StakingPool {
  id: string;
  name: string;
  lockDurationDays: number;
  apy: number; // Percentage
  penaltyRate: number; // Percentage
  tvl: number; // Total Value Locked
  minersCount: number;
  agentShare: number; // How much the Agent owns
}

export interface UserStake {
  id: string;
  poolId: string;
  amount: number;
  startTime: number;
  rewardsAccrued: number;
}

// Permafrost Types
export interface ConversionTier {
  name: string;
  multiplier: number;
  closingPrice: number; // The price at which this tier ends
  status: 'CLOSED' | 'ACTIVE' | 'UPCOMING';
}
