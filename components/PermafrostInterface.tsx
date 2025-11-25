
import React, { useState, useEffect } from 'react';
import { ConversionTier } from '../types';
import { PermafrostAPI, PermafrostStats } from '../lib/permafrost-api';
import { 
  Snowflake, 
  ArrowDown, 
  ShieldCheck, 
  AlertOctagon, 
  ThermometerSnowflake,
  TrendingUp,
  Crown,
  Droplets,
  ArrowRightLeft,
  Coins,
  RefreshCw,
  Wallet,
  Zap
} from 'lucide-react';

interface PermafrostInterfaceProps {
  userBalance: number;
  userLegacy: boolean;
  onConvert: (amountMtra: number, amountPf: number) => void;
}

export const PermafrostInterface: React.FC<PermafrostInterfaceProps> = ({ 
  userBalance, 
  userLegacy, 
  onConvert 
}) => {
  const [activeTab, setActiveTab] = useState<'CONVERT' | 'MY_PF'>('CONVERT');
  
  const [tiers, setTiers] = useState<ConversionTier[]>([]);
  const [stats, setStats] = useState<PermafrostStats | null>(null);
  
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFreezing, setIsFreezing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [tiersData, statsData] = await Promise.all([
        PermafrostAPI.getTiers(),
        PermafrostAPI.getStats()
      ]);
      setTiers(tiersData);
      setStats(statsData);
      setIsLoading(false);
    };
    load();
  }, []);

  // --- CALCS ---
  const activeTier = tiers.find(t => t.status === 'ACTIVE') || tiers[tiers.length - 1];
  const inputAmount = parseFloat(amount) || 0;
  const outputAmount = PermafrostAPI.calculateOutput(inputAmount, activeTier?.multiplier || 1, userLegacy);

  const handleFreeze = async () => {
    if (inputAmount <= 0) return;
    if (inputAmount > userBalance) {
      alert("Insufficient MTRA Balance");
      return;
    }
    if (!confirm("WARNING: THIS ACTION IS PERMANENT.\n\nYou are converting Liquid MTRA into Locked PF.\nYou cannot reverse this.\n\nProceed?")) {
      return;
    }

    setIsFreezing(true);
    await PermafrostAPI.freeze(inputAmount);
    onConvert(inputAmount, outputAmount);
    setAmount('');
    setIsFreezing(false);
  };

  if (isLoading || !stats) {
    return (
      <div className="h-full flex items-center justify-center text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
        <Snowflake className="animate-spin mr-2" />
        <span className="font-display font-bold text-lg tracking-widest">ENTERING COCYTUS...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden rounded-xl bg-black">
      
      {/* GLOBAL FROST OVERLAY - INTENSE */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.2)_0%,_rgba(8,145,178,0.1)_40%,_rgba(0,0,0,1)_100%)]"></div>
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      
      <div className="space-y-6 pb-20 relative z-10 p-2">
        
        {/* 1. AGENT 02 (THE PF PROP AGENT) - ICE BLOCK */}
        <div className="bg-cyan-950/30 backdrop-blur-md p-6 rounded-xl border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden group">
           {/* Scanning Line Effect */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent translate-y-[-100%] group-hover:animate-[scan_2s_ease-in-out_infinite] pointer-events-none"></div>
           
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-cyan-500 text-black rounded shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                    <Crown size={20} fill="currentColor" />
                 </div>
                 <div>
                    <h2 className="text-lg font-display font-bold text-white tracking-wide drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">AGENT 02 (PF PROP)</h2>
                    <p className="text-xs text-cyan-300 font-mono uppercase tracking-widest">The Frozen Throne</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-xs text-cyan-400/70 font-mono mb-1">PERMANENT HOLDINGS</p>
                 <p className="text-2xl font-display font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                    {(stats.agentSharePf / 1000000).toFixed(2)}M PF
                 </p>
              </div>
           </div>

           {/* THE YIELD REACTOR */}
           <div className="bg-black/60 rounded p-3 border border-cyan-500/30">
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                 <span className="text-cyan-600">INFLOW STREAMS:</span>
                 <div className="flex items-center gap-1 text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                    <TrendingUp size={12} className="text-cyan-400" />
                    <span>{stats.sweatApy}% SWEAT APY</span>
                 </div>
              </div>
              
              <div className="flex gap-2">
                 {/* 25% Mining Split */}
                 <div className="flex-1 bg-blue-900/20 border border-blue-500/30 p-2 rounded flex flex-col items-center justify-center shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]">
                     <div className="flex items-center gap-1 mb-1">
                        <Droplets size={10} className="text-blue-400"/>
                        <span className="text-[9px] text-blue-300 font-bold tracking-wider">25% MINING</span>
                     </div>
                     <span className="text-[9px] font-mono text-blue-500/70">SWEAT POOL</span>
                 </div>

                 {/* RECYCLE SYMBOL */}
                 <div className="flex items-center justify-center">
                    <RefreshCw size={16} className="text-cyan-500 animate-spin-slow drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                 </div>
                 
                 {/* Prop Injection Pipeline */}
                 <div className="flex-1 bg-cyan-900/20 border border-cyan-500/30 p-2 rounded flex flex-col items-center justify-center shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]">
                     <div className="flex items-center gap-1 mb-1">
                        <Coins size={10} className="text-yellow-400"/>
                        <span className="text-[9px] text-yellow-200 font-bold tracking-wider">7.5% PROPS</span>
                     </div>
                     <div className="flex items-center gap-1 text-[8px] text-cyan-500 font-mono">
                        <span>USD</span> <ArrowRightLeft size={8}/> <span>MINT</span> <ArrowRightLeft size={8}/> <span className="text-white font-bold">PF</span>
                     </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. TABS */}
        <div className="flex gap-4 border-b border-cyan-900/50">
          <button 
            onClick={() => setActiveTab('CONVERT')}
            className={`pb-2 px-4 text-sm font-display font-bold tracking-wider transition-all ${
               activeTab === 'CONVERT' 
               ? 'text-cyan-400 border-b-2 border-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' 
               : 'text-slate-600 hover:text-cyan-600'
            }`}
          >
            FREEZER
          </button>
          <button 
            onClick={() => setActiveTab('MY_PF')}
            className={`pb-2 px-4 text-sm font-display font-bold tracking-wider transition-all flex items-center gap-2 ${
               activeTab === 'MY_PF' 
               ? 'text-white border-b-2 border-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' 
               : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            MY SWEAT
          </button>
        </div>

        {/* 3. CONTENT AREA */}
        <div className="flex-1 overflow-y-auto pr-2">
           
           {activeTab === 'CONVERT' && (
              <div className="space-y-6 animate-in fade-in">
                 {/* Tier Status */}
                 <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-cyan-900/50 shadow-inner">
                    <div className="flex justify-between text-xs font-mono text-cyan-600/80">
                       <span>ACTIVE TIER: <span className="text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{activeTier.name} ({activeTier.multiplier}x)</span></span>
                       <span>CLOSES @ ${activeTier.closingPrice.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800 relative">
                       {tiers.map((t, idx) => (
                          <div 
                            key={idx}
                            className={`h-full flex-1 border-r border-slate-900/50 ${
                               t.status === 'CLOSED' ? 'bg-slate-900' :
                               t.status === 'ACTIVE' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] relative z-10' :
                               'bg-slate-950'
                            }`}
                          ></div>
                       ))}
                    </div>
                 </div>

                 {/* Input Area */}
                 <div className="flex flex-col justify-center space-y-4">
                    
                    {/* FROM */}
                    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 relative">
                       <div className="flex justify-between text-xs text-slate-500 font-mono mb-2">
                          <span>FROM (LIQUID)</span>
                          <span>BAL: {userBalance.toFixed(2)} MTRA</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="flex-1 bg-transparent text-3xl font-display font-bold text-white placeholder-slate-700 focus:outline-none tracking-tight"
                          />
                          <span className="text-mint-500 font-bold text-sm tracking-widest">MTRA</span>
                       </div>
                    </div>

                    {/* ARROW */}
                    <div className="flex justify-center -my-3 relative z-20">
                       <div className="bg-cyan-500 rounded-full p-2 shadow-[0_0_15px_rgba(6,182,212,0.6)] border-2 border-black">
                          <ArrowDown size={20} className="text-black" />
                       </div>
                    </div>

                    {/* TO */}
                    <div className="bg-cyan-950/30 border border-cyan-500/50 rounded-xl p-4 relative shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                       <div className="flex justify-between text-xs text-cyan-400 font-mono mb-2">
                          <span>TO (FROZEN)</span>
                          <div className="flex items-center gap-1">
                             {userLegacy && <Crown size={10} className="text-gold-500" />}
                             <span className="text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{activeTier.multiplier}x {userLegacy ? '+ 1.15x LEGACY' : ''}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="flex-1 text-3xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                             {inputAmount > 0 ? outputAmount.toFixed(2) : '0.00'}
                          </div>
                          <span className="text-cyan-400 font-bold text-sm tracking-widest">PF</span>
                       </div>
                    </div>

                    {/* BUTTON */}
                    <button 
                      onClick={handleFreeze}
                      disabled={isFreezing || inputAmount <= 0}
                      className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-display font-bold text-xl tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:shadow-none border border-cyan-400/50 flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                      {/* Ice Shine Effect */}
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite] skew-x-12"></div>
                      
                      {isFreezing ? (
                         <>
                            <Snowflake className="animate-spin" size={24} /> FREEZING...
                         </>
                      ) : (
                         <>
                            <Snowflake size={24} className="group-hover:rotate-180 transition-transform duration-500" /> 
                            PERMANENTLY FREEZE
                         </>
                      )}
                    </button>
                    
                    <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-500/30 rounded text-red-300 text-xs mt-2 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]">
                       <AlertOctagon size={20} className="shrink-0 mt-0.5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                       <p className="leading-relaxed">
                          <span className="font-bold text-red-400 tracking-wider block mb-1">IRREVERSIBLE ACTION</span>
                          Permafrost (PF) is Soulbound. It can never be converted back to Liquid MTRA. It generates yield forever.
                       </p>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'MY_PF' && (
              <div className="space-y-4 animate-in fade-in">
                 {/* My Holdings Card */}
                 <div className="bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-900/50 rounded-xl p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full"></div>
                    
                    <div className="flex items-center justify-between mb-6 relative z-10">
                       <div className="flex items-center gap-3">
                          <div className="p-3 bg-black/50 rounded-full text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                             <Snowflake size={24} />
                          </div>
                          <div>
                             <h3 className="font-display font-bold text-lg text-white tracking-wide">MY PERMAFROST</h3>
                             <p className="text-xs text-cyan-500/70 font-mono">Permanent Locked Position</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-cyan-900/30 pt-4 relative z-10">
                       <div>
                          <p className="text-[9px] text-slate-400 font-mono uppercase mb-1">PF Balance</p>
                          <p className="text-2xl font-display font-bold text-white drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">5,000</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] text-slate-400 font-mono uppercase mb-1">Entry Tier</p>
                          <p className="text-xl font-display font-bold text-cyan-400 flex items-center justify-end gap-2">
                             <ShieldCheck size={16}/> DIAMOND
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* Sweat Yield Card */}
                 <div className="bg-black/40 border border-mint-500/30 rounded-xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <div className="relative z-10 text-center">
                       <h3 className="font-display font-bold text-sm text-mint-400 tracking-[0.2em] mb-2">ACCUMULATED SWEAT</h3>
                       
                       <div className="flex items-center justify-center gap-2 py-4">
                          <span className="text-4xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">245.50</span>
                          <span className="text-xs font-bold text-mint-500 mt-4">MTRA</span>
                       </div>
                       
                       <button className="w-full py-3 bg-mint-600/20 hover:bg-mint-600/40 border border-mint-500 text-mint-400 font-bold rounded transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                          CLAIM YIELD TO WALLET
                       </button>
                    </div>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
};
