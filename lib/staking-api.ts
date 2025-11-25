
import { StakingPool, UserStake } from '../types';

/**
 * STAKING SMART CONTRACT SIMULATOR
 * Aligned with Dev Bible V3.0 + SuperClaude Update
 * Logic: Dynamic Penalty Rates (10% - 30%).
 * Rule: Early unstake forfeits ALL yield + pays penalty on principal.
 * Update: Added Endowment Bonus APY calculation.
 */

// We separate Base APY (Fixed) from Bonus APY (Variable from Agent)
export interface ExtendedPool extends StakingPool {
  baseApy: number;
  endowmentBonusApy: number;
}

export const STAKING_POOLS: ExtendedPool[] = [
  {
    id: 'pool_3m',
    name: '3 MONTH VAULT',
    lockDurationDays: 90,
    apy: 5.5, // Total
    baseApy: 5.0,
    endowmentBonusApy: 0.5,
    penaltyRate: 10,
    tvl: 450000,
    minersCount: 1240,
    agentShare: 0
  },
  {
    id: 'pool_6m',
    name: '6 MONTH VAULT',
    lockDurationDays: 180,
    apy: 13.2,
    baseApy: 12.0,
    endowmentBonusApy: 1.2,
    penaltyRate: 15,
    tvl: 1250000,
    minersCount: 3500,
    agentShare: 0
  },
  {
    id: 'pool_1y',
    name: '1 YEAR VAULT',
    lockDurationDays: 365,
    apy: 27.5,
    baseApy: 25.0,
    endowmentBonusApy: 2.5,
    penaltyRate: 20,
    tvl: 3500000,
    minersCount: 5200,
    agentShare: 0
  },
  {
    id: 'pool_2y',
    name: '2 YEAR VAULT',
    lockDurationDays: 730,
    apy: 66.0,
    baseApy: 60.0,
    endowmentBonusApy: 6.0,
    penaltyRate: 25,
    tvl: 8900000,
    minersCount: 2100,
    agentShare: 0
  },
  {
    id: 'pool_5y',
    name: '5 YEAR (LEGACY)',
    lockDurationDays: 1825,
    apy: 165.0,
    baseApy: 150.0,
    endowmentBonusApy: 15.0,
    penaltyRate: 30,
    tvl: 25000000, 
    minersCount: 450,
    agentShare: 24500000 // Staker 01
  }
];

// Mock Stake Database
let MOCK_STAKES: UserStake[] = [
  {
    id: 'stk_1',
    poolId: 'pool_1y',
    amount: 2500,
    startTime: Date.now() - (45 * 24 * 60 * 60 * 1000), // 45 days ago
    rewardsAccrued: 0 // Will be calculated dynamically
  }
];

const MS_PER_YEAR = 365 * 24 * 60 * 60 * 1000;

export const StakingAPI = {
  
  getPools: async (): Promise<ExtendedPool[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return STAKING_POOLS;
  },

  getUserStakes: async (): Promise<UserStake[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Calculate rewards dynamically for every fetch
    return MOCK_STAKES.map(stake => {
      const pool = STAKING_POOLS.find(p => p.id === stake.poolId);
      if (!pool) return stake;
      
      const rewards = StakingAPI.calculateRewards(stake.amount, stake.startTime, pool.apy);
      return { ...stake, rewardsAccrued: rewards };
    });
  },

  calculateRewards: (amount: number, startTime: number, apy: number): number => {
    const now = Date.now();
    const elapsed = now - startTime;
    // Simple Interest Formula: Principal * Rate * Time
    const rate = apy / 100;
    const timeFraction = elapsed / MS_PER_YEAR;
    return amount * rate * timeFraction;
  },

  stake: async (poolId: string, amount: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    MOCK_STAKES.push({
      id: `stk_${Date.now()}`,
      poolId,
      amount,
      startTime: Date.now(),
      rewardsAccrued: 0
    });
    return true;
  },

  calculatePenalty: (stake: UserStake, pool: StakingPool) => {
    const now = Date.now();
    const durationMs = pool.lockDurationDays * 24 * 60 * 60 * 1000;
    const endTime = stake.startTime + durationMs;
    const timeLeft = Math.max(0, endTime - now);
    
    if (timeLeft <= 0) {
      return { percentage: 0, amount: 0, burnToWarChest: false, daysRemaining: 0 };
    }

    const timeFraction = timeLeft / durationMs;
    const currentPenaltyPct = pool.penaltyRate * timeFraction;
    const penaltyAmount = stake.amount * (currentPenaltyPct / 100);

    return { 
      percentage: currentPenaltyPct, 
      amount: penaltyAmount, 
      burnToWarChest: true,
      daysRemaining: Math.ceil(timeLeft / (1000 * 60 * 60 * 24))
    };
  },

  unstake: async (stakeId: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const stake = MOCK_STAKES.find(s => s.id === stakeId);
    MOCK_STAKES = MOCK_STAKES.filter(s => s.id !== stakeId);
    return stake ? stake.amount : 0; 
  }
};
