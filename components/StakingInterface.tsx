
import React, { useState, useEffect } from 'react';
import { UserStake } from '../types';
import { StakingAPI, ExtendedPool } from '../lib/staking-api';
import { 
  Lock, 
  Users, 
  ShieldCheck,
  Wallet,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Crown,
  ArrowRightLeft,
  Coins,
  TrendingUp,
  Info,
  Zap,
  RefreshCw
} from 'lucide-react';

interface StakingInterfaceProps {
  userBalance: number;
  onUpdateBalance: (amount: number) => void;
}

export const StakingInterface: React.FC<StakingInterfaceProps> = ({ userBalance, onUpdateBalance }) => {
  const [activeTab, setActiveTab] = useState<'VAULTS' | 'MY_ASSETS'>('VAULTS');
  
  const [pools, setPools] = useState<ExtendedPool[]>([]);
  const [myStakes, setMyStakes] = useState<UserStake[]>([]);
  
  // Interaction State
  const [selectedPool, setSelectedPool] = useState<ExtendedPool | null>(null);
  const [selectedStake, setSelectedStake] = useState<UserStake | null>(null);
  
  const [stakeAmount, setStakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Data
  const refreshData = async () => {
    setIsLoading(true);
    const [poolData, stakeData] = await Promise.all([
      StakingAPI.getPools(),
      StakingAPI.getUserStakes()
    ]);
    setPools(poolData);
    setMyStakes(stakeData);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- ACTIONS ---

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) return;
    const amount = parseFloat(stakeAmount);
    if (amount > userBalance) {
      alert("Insufficient Balance");
      return;
    }

    setIsProcessing(true);
    await StakingAPI.stake(selectedPool.id, amount);
    onUpdateBalance(-amount); // Deduct from wallet
    await refreshData();
    setIsProcessing(false);
    setStakeAmount('');
    setSelectedPool(null);
    setActiveTab('MY_ASSETS'); // Auto switch to portfolio
  };

  const handleUnstake = async () => {
    if (!selectedStake) return;
    const pool = pools.find(p => p.id === selectedStake.poolId);
    if (!pool) return;

    const penalty = StakingAPI.calculatePenalty(selectedStake, pool);
    
    // REVISED LOGIC: User KEEPS rewards even if early unstake
    const rewardsToReturn = selectedStake.rewardsAccrued;
    const principalToReturn = selectedStake.amount - penalty.amount;
    const totalReturned = principalToReturn + rewardsToReturn;
    
    setIsProcessing(true);
    
    await StakingAPI.unstake(selectedStake.id);
    onUpdateBalance(totalReturned);
    await refreshData();
    setIsProcessing(false);
    setSelectedStake(null);
  };

  const totalAgentShare = pools.reduce((acc, curr) => acc + curr.agentShare, 0);
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gold-400">
        <div className="animate-spin mr-2"><Lock /></div>
        <span className="font-mono text-sm">ACCESSING VAULT...</span>
      </div>
    );
  }

  const getPoolForStake = (stake: UserStake) => pools.find(p => p.id === stake.poolId) || pools[0];

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* 1. STAKER 01 (THE ENDOWMENT) */}
      <div className="glass-panel p-6 rounded-xl border border-gold-500/30 bg-gradient-to-br from-yellow-900/10 to-transparent relative overflow-hidden">
         {/* Background Effect */}
         <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 blur-3xl rounded-full pointer-events-none"></div>
         
         <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-yellow-500 rounded-lg text-black">
                  <Crown size={24} fill="currentColor" />
               </div>
               <div>
                  <h2 className="text-xl font-display font-bold text-white tracking-wide">STAKER 01 (THE ENDOWMENT)</h2>
                  <p className="text-xs text-yellow-500/80 font-mono uppercase">Permanent Tenant • Benevolent Whale</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-xs text-slate-400 font-mono mb-1">TOTAL HOLDINGS</p>
               <p className="text-2xl font-display font-bold text-white tabular-nums">{(totalAgentShare / 1000000).toFixed(2)}M PF</p>
            </div>
         </div>

         {/* THE YIELD REACTOR (15% SPLIT + 7.5% PROPS) */}
         <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 relative">
            <div className="flex items-center justify-between text-xs font-mono mb-3">
               <span className="text-slate-400">INFLOW STREAMS:</span>
               <div className="flex items-center gap-1 text-mint-400 font-bold">
                  <Zap size={12} />
                  <span>15% YIELD SPLIT</span>
               </div>
            </div>
            
            <div className="flex gap-2">
               {/* 15% Mining Split */}
               <div className="flex-1 bg-yellow-900/20 border border-yellow-500/30 p-2 rounded flex flex-col items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
                   <div className="flex items-center gap-1 mb-1">
                      <Zap size={12} className="text-yellow-400"/>
                      <span className="text-[10px] text-yellow-400 font-bold">15% MINING</span>
                   </div>
                   <span className="text-xs font-mono text-white">REWARD POOL</span>
               </div>

               {/* RECYCLE SYMBOL */}
               <div className="flex items-center justify-center">
                  <RefreshCw size={16} className="text-slate-600 animate-spin-slow" />
               </div>
               
               {/* Prop Injection Pipeline */}
               <div className="flex-1 bg-mint-900/20 border border-mint-500/30 p-2 rounded flex flex-col items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-mint-500/5 group-hover:bg-mint-500/10 transition-colors"></div>
                   <div className="flex items-center gap-1 mb-1">
                      <Coins size={12} className="text-mint-400"/>
                      <span className="text-[10px] text-mint-400 font-bold">7.5% PROPS</span>
                   </div>
                   <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                      <span>USD</span> <ArrowRightLeft size={8}/> <span>MINT</span> <ArrowRightLeft size={8}/> <span>STAKE</span>
                   </div>
               </div>
            </div>
            
            {/* Recycle Explanation */}
            <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">AGENT ACTION:</span>
                <span className="flex items-center gap-2">
                    <span className="text-yellow-500">50% COMPOUND</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-mint-500">50% USER BOOST</span>
                </span>
            </div>
         </div>
      </div>

      {/* 2. TABS */}
      <div className="flex gap-4 border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('VAULTS')}
          className={`pb-2 px-2 text-sm font-display font-bold tracking-wider transition-colors ${activeTab === 'VAULTS' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          EXPLORE VAULTS
        </button>
        <button 
          onClick={() => setActiveTab('MY_ASSETS')}
          className={`pb-2 px-2 text-sm font-display font-bold tracking-wider transition-colors flex items-center gap-2 ${activeTab === 'MY_ASSETS' ? 'text-mint-500 border-b-2 border-mint-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          MY ASSETS <span className="px-1.5 py-0.5 bg-slate-800 rounded-full text-[9px] text-white">{myStakes.length}</span>
        </button>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        
        {/* VIEW: VAULTS */}
        {activeTab === 'VAULTS' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 font-mono">LOCK ASSETS TO EARN ENDOWMENT YIELD.</p>

            {pools.map(pool => {
              const isSelected = selectedPool?.id === pool.id;
              const isLegacy = pool.id === 'pool_5y';

              return (
                <div 
                  key={pool.id}
                  className={`
                    rounded-xl border transition-all duration-300 overflow-hidden relative
                    ${isSelected 
                      ? 'bg-slate-800 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
                      : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                    }
                  `}
                >
                  <button 
                    onClick={() => setSelectedPool(isSelected ? null : pool)}
                    className="w-full p-4 flex items-center justify-between text-left relative z-10"
                  >
                    <div className="flex items-center gap-4">
                       <div className={`
                          w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xs text-center leading-tight p-1
                          ${isLegacy ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-yellow-500 border border-slate-700'}
                       `}>
                          {pool.lockDurationDays < 365 
                            ? `${pool.lockDurationDays} D` 
                            : `${pool.lockDurationDays / 365} YR`
                          }
                       </div>
                       <div>
                          <h3 className="text-white font-bold font-display tracking-wide flex items-center gap-2">
                             {pool.name}
                             {isLegacy && <Info size={12} className="text-slate-500" />}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                             <span className="flex items-center gap-1"><Users size={10} /> {pool.minersCount}</span>
                             <span>•</span>
                             <span>TVL: {(pool.tvl / 1000000).toFixed(1)}M</span>
                          </div>
                       </div>
                    </div>

                    <div className="text-right">
                       <p className="text-[10px] font-mono text-slate-500 uppercase">Total Yield</p>
                       <div className="flex flex-col items-end">
                          <p className="text-2xl font-display font-bold text-mint-400">{pool.apy}%</p>
                          {pool.endowmentBonusApy > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                               <span className="text-[9px] text-slate-500 line-through decoration-slate-500">{pool.baseApy}%</span>
                               <span className="text-[9px] text-mint-400 font-bold bg-mint-900/30 px-1 rounded flex items-center gap-0.5">
                                 <TrendingUp size={8}/> +{pool.endowmentBonusApy}% BOOST
                               </span>
                            </div>
                          )}
                       </div>
                    </div>
                  </button>

                  {/* LEGACY TOOLTIP/BANNER */}
                  {isLegacy && isSelected && (
                     <div className="bg-yellow-900/20 px-4 py-2 border-y border-yellow-500/10 flex items-start gap-2">
                        <Info size={14} className="text-yellow-500 shrink-0 mt-0.5"/>
                        <p className="text-[10px] text-yellow-200/80 font-mono">
                           <strong>HIGH YIELD ALERT:</strong> This APY is artificially high due to early adoption and the Endowment Recycle effect. As more users enter this vault, the APY will dilute. Lock now to secure your share of the reward pool.
                        </p>
                     </div>
                  )}

                  {/* STAKE FORM */}
                  {isSelected && (
                     <div className="p-4 bg-black/40 border-t border-white/10 space-y-4 animate-in slide-in-from-top-2">
                        <div className="space-y-3">
                           <div className="flex justify-between text-xs text-slate-400 font-mono">
                              <span>AVAILABLE BALANCE</span>
                              <span className="text-white">{userBalance.toFixed(2)} MTRA</span>
                           </div>
                           <div className="flex gap-2">
                              <input 
                                type="number" 
                                placeholder="Amount to Stake"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-yellow-500 font-mono"
                              />
                              <button 
                                onClick={handleStake}
                                disabled={isProcessing}
                                className="px-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-display rounded transition-colors disabled:opacity-50"
                              >
                                {isProcessing ? 'LOCKING...' : 'DEPOSIT'}
                              </button>
                           </div>
                           <p className="text-[10px] text-slate-500 text-center">
                             EARLY WITHDRAWAL PENALTY: {pool.penaltyRate}% GRADUATING TO 0%.
                           </p>
                        </div>
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW: MY ASSETS */}
        {activeTab === 'MY_ASSETS' && (
           <div className="space-y-4">
              {myStakes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                   <Wallet size={48} className="mb-4 opacity-50"/>
                   <p className="font-mono text-sm">NO ACTIVE STAKES FOUND</p>
                </div>
              ) : (
                myStakes.map(stake => {
                   const pool = getPoolForStake(stake);
                   const isSelected = selectedStake?.id === stake.id;
                   const penalty = StakingAPI.calculatePenalty(stake, pool);
                   const isMature = penalty.percentage === 0;

                   return (
                     <div key={stake.id} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                        <button 
                          onClick={() => setSelectedStake(isSelected ? null : stake)}
                          className="w-full p-4 flex items-center justify-between hover:bg-slate-800 transition-colors"
                        >
                           <div className="text-left">
                              <p className="text-xs text-slate-500 font-mono mb-1">{pool.name}</p>
                              <h3 className="text-xl font-display font-bold text-white">{stake.amount.toLocaleString()} MTRA</h3>
                           </div>
                           <div className="text-right">
                              <p className="text-xs text-slate-500 font-mono mb-1">REWARDS</p>
                              <h3 className="text-xl font-display font-bold text-mint-400">+{stake.rewardsAccrued.toFixed(2)}</h3>
                           </div>
                        </button>

                        {/* DETAIL / UNSTAKE */}
                        {isSelected && (
                           <div className="p-4 bg-black/40 border-t border-white/10 space-y-4">
                              
                              {/* PROGRESS BAR */}
                              <div className="space-y-2">
                                 <div className="flex justify-between text-[10px] font-mono text-slate-400">
                                    <span>LOCKED: {new Date(stake.startTime).toLocaleDateString()}</span>
                                    <span>{isMature ? 'MATURED' : `${penalty.daysRemaining} DAYS LEFT`}</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${isMature ? 'bg-mint-500' : 'bg-yellow-500'}`} 
                                      style={{ width: `${isMature ? 100 : Math.max(5, 100 - (penalty.percentage / pool.penaltyRate * 100))}%` }}
                                    ></div>
                                 </div>
                              </div>

                              {/* ACTIONS */}
                              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                 {!isMature ? (
                                    <div className="space-y-4">
                                       <div className="flex items-start gap-3 text-red-400">
                                          <AlertTriangle size={20} className="shrink-0" />
                                          <div>
                                             <p className="font-bold text-sm">EMERGENCY WITHDRAWAL</p>
                                             <p className="text-xs opacity-80 mt-1">
                                                Graduated Penalty: <span className="text-white font-bold">{penalty.percentage.toFixed(1)}%</span> of Principal.
                                                <br/>
                                                <span className="text-mint-400 font-bold">ACCRUED YIELD IS SAFE.</span>
                                             </p>
                                          </div>
                                       </div>
                                       
                                       <div className="space-y-2 border-t border-slate-800 pt-3">
                                          <div className="flex justify-between items-center text-sm font-mono">
                                             <span className="text-slate-500">PRINCIPAL BURN:</span>
                                             <span className="text-red-500 font-bold flex items-center gap-1">
                                                <Flame size={12}/> -{penalty.amount.toFixed(2)} MTRA
                                             </span>
                                          </div>
                                          <div className="flex justify-between items-center text-sm font-mono">
                                             <span className="text-slate-500">YIELD CLAIMED:</span>
                                             <span className="text-mint-500 font-bold flex items-center gap-1">
                                                <CheckCircle2 size={12}/> +{stake.rewardsAccrued.toFixed(2)} MTRA
                                             </span>
                                          </div>
                                       </div>
                                       
                                       <button 
                                          onClick={handleUnstake}
                                          disabled={isProcessing}
                                          className="w-full py-3 bg-red-900/50 hover:bg-red-900 border border-red-500 text-red-100 rounded font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2"
                                       >
                                          {isProcessing ? 'BURNING...' : 'CONFIRM EARLY EXIT'}
                                       </button>
                                    </div>
                                 ) : (
                                    <div className="space-y-4">
                                       <div className="flex items-center gap-3 text-mint-400">
                                          <ShieldCheck size={20} />
                                          <p className="font-bold text-sm">STAKE MATURED. FULL REWARDS UNLOCKED.</p>
                                       </div>
                                       <button 
                                          onClick={handleUnstake}
                                          disabled={isProcessing}
                                          className="w-full py-3 bg-mint-600 hover:bg-mint-500 text-black rounded font-bold text-sm tracking-wider transition-colors"
                                       >
                                          CLAIM PRINCIPAL + {stake.rewardsAccrued.toFixed(2)} REWARDS
                                       </button>
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}
                     </div>
                   );
                })
              )}
           </div>
        )}
      </div>
    </div>
  );
};
