
import { ConversionTier } from '../types';

/**
 * PERMAFROST LOGIC (THE FREEZER)
 * Handles the "One-Way" conversion of MTRA -> PF.
 * Implements the Tier system based on current Price.
 * NEW: Handles "Sweat" (Yield) calculations and Agent stats.
 */

export interface PermafrostStats {
  tvlPf: number; // Total PF in existence
  agentSharePf: number; // How much Agent 02 owns
  dailySweatMtra: number; // The 25% Mining Split Daily Volume
  sweatApy: number; // Effective APY based on volume/TVL
}

export const PermafrostAPI = {
  
  getTiers: async (): Promise<ConversionTier[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { name: 'GENESIS', multiplier: 4.0, closingPrice: 0.05, status: 'CLOSED' },
      { name: 'DIAMOND', multiplier: 2.5, closingPrice: 0.12, status: 'ACTIVE' },
      { name: 'PLATINUM', multiplier: 2.0, closingPrice: 0.18, status: 'UPCOMING' },
      { name: 'GOLD', multiplier: 1.5, closingPrice: 0.22, status: 'UPCOMING' },
      { name: 'SILVER', multiplier: 1.25, closingPrice: 0.25, status: 'UPCOMING' },
      { name: 'STANDARD', multiplier: 1.0, closingPrice: 9999, status: 'UPCOMING' }
    ];
  },

  getStats: async (): Promise<PermafrostStats> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      tvlPf: 85000000, 
      agentSharePf: 45000000, // Agent owns >50%
      dailySweatMtra: 12500, // Daily inflow from 25% mining split
      sweatApy: 18.5 // Dynamic yield based on volume
    };
  },

  calculateOutput: (amountMtra: number, tierMultiplier: number, hasLegacy: boolean): number => {
    let pf = amountMtra * tierMultiplier;
    if (hasLegacy) {
      pf = pf * 1.15; // The 1.15x Legacy Bonus
    }
    return pf;
  },

  freeze: async (amount: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Dramatic pause for "Freezing"
    return true;
  }
};
