
import React from 'react';
import { TreasuryData } from '../types';
import { TreasuryCharts } from './TreasuryCharts';
import { 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Lock, 
  Snowflake, 
  ArrowRightLeft, 
  Server,
  Zap,
  List,
  Hash,
  Crown,
  FileText,
  Users,
  Briefcase,
  Flame,
  BarChart3,
  Database,
  ShoppingCart,
  Repeat,
  RefreshCw
} from 'lucide-react';

interface TreasuryInterfaceProps {
  data: TreasuryData;
}

const MOCK_LEDGER = [
  { time: '10:42:05', action: 'WAR CHEST BUYBACK', detail: '500 MTRA Burned ($125)', source: 'Defense Bot' },
  { time: '10:41:55', action: 'STAKE DEPOSIT', detail: 'User 0x8a...2f locked 5,000 MTRA', source: '1Y Vault' },
  { time: '10:41:12', action: 'CAPITAL MINING', detail: 'User Bought $500 MTRA', source: 'Agent 04' },
  { time: '10:40:45', action: 'PF CONVERSION', detail: '1,200 MTRA -> 3,000 PF', source: 'Freezer' },
  { time: '10:40:01', action: 'DISCOVERY HASH', detail: 'Rate Adjusted: 0.0121', source: 'Agent 03' },
  { time: '10:39:22', action: 'LEGACY VERIFY', detail: 'New Legacy Member Added', source: 'Oracle' },
];

export const TreasuryInterface: React.FC<TreasuryInterfaceProps> = ({ data }) => {
  
  const isHealthy = data.backingRatio >= 0.7;
  const healthColor = isHealthy ? 'text-mint-500' : 'text-red-500';

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      
      {/* 1. THE SENTINEL (WAR CHEST) */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
               <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <ShieldCheck size={20} className={healthColor} />
                  <span className={`font-display font-bold tracking-widest text-xs ${healthColor}`}>SENTINEL STATUS: SECURE</span>
               </div>
               <h1 className="text-4xl font-display font-bold text-white tabular-nums tracking-tight">
                 ${(data.warChestBalance).toLocaleString()}
               </h1>
               <p className="text-slate-500 font-mono text-[10px] mt-1 uppercase tracking-wide">
                  Total Protocol Reserves (USD)
               </p>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
               <div className="bg-slate-950 border border-slate-800 p-3 rounded text-center">
                  <p className="text-[9px] text-slate-500 font-mono mb-1">BACKING RATIO</p>
                  <p className="text-lg font-bold text-white">${data.backingRatio.toFixed(2)}</p>
               </div>
               <div className="bg-slate-950 border border-slate-800 p-3 rounded text-center">
                  <p className="text-[9px] text-slate-500 font-mono mb-1">DEFENSE FUND</p>
                  <p className="text-lg font-bold text-phoenix-500">{(data.warChestBalance * 0.5).toLocaleString()}</p>
               </div>
            </div>
         </div>
      </div>

      {/* 2. NETWORK HASH RATES (AGENTS 03 & 04) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <Activity className="text-mint-500" size={14} />
                  <span className="text-[10px] font-bold font-display text-white tracking-wider">DISCOVERY HASH</span>
               </div>
               <p className="text-[9px] text-slate-500 font-mono">MTRA PER AD VIEW</p>
            </div>
            <div className="text-right">
               <p className="text-2xl font-display font-bold text-mint-400">0.0120</p>
            </div>
         </div>

         <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <Zap className="text-phoenix-500" size={14} />
                  <span className="text-[10px] font-bold font-display text-white tracking-wider">CAPITAL HASH</span>
               </div>
               <p className="text-[9px] text-slate-500 font-mono">BUYER BONUS RATE</p>
            </div>
            <div className="text-right">
               <p className="text-2xl font-display font-bold text-phoenix-400">+8.5%</p>
            </div>
         </div>
      </div>

      {/* 3. SUPPLY LIFECYCLE (THE FLOW) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
         <h3 className="text-xs font-display font-bold text-white mb-4 flex items-center gap-2">
            <RefreshCw size={14} className="text-blue-400"/> TOKEN LIFECYCLE
         </h3>
         <div className="grid grid-cols-4 gap-2">
            
            {/* MINTED */}
            <div className="text-center border-r border-slate-800 last:border-0">
               <p className="text-[9px] text-slate-500 font-mono mb-1">MINTED</p>
               <p className="text-sm font-bold text-white">85.2M</p>
            </div>

            {/* BOUGHT */}
            <div className="text-center border-r border-slate-800 last:border-0">
               <p className="text-[9px] text-slate-500 font-mono mb-1">BOUGHT</p>
               <p className="text-sm font-bold text-phoenix-400">12.5M</p>
            </div>

            {/* CONVERTED */}
            <div className="text-center border-r border-slate-800 last:border-0">
               <p className="text-[9px] text-slate-500 font-mono mb-1">CONVERTED</p>
               <p className="text-sm font-bold text-blue-400">145.0M</p>
            </div>

            {/* BURNED */}
            <div className="text-center">
               <p className="text-[9px] text-slate-500 font-mono mb-1">BURNED</p>
               <p className="text-sm font-bold text-red-500">5.2M</p>
            </div>
         </div>
      </div>

      {/* 4. MARKET INDICES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         
         {/* PEG STABILITY */}
         <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <TrendingUp className="text-mint-500" size={20} />
               <span className="text-[9px] font-mono text-slate-500">ICO TARGET</span>
            </div>
            <div>
               <h3 className="text-2xl font-display font-bold text-white mt-2">$0.25</h3>
               <p className="text-[9px] text-slate-400 font-mono mt-1">FLOOR PRICE</p>
            </div>
            <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-mint-500 h-full w-[72%]"></div>
            </div>
         </div>

         {/* LEGACY STATUS */}
         <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <Crown className="text-gold-500" size={20} />
               <span className="text-[9px] font-mono text-slate-500">QUALIFIED</span>
            </div>
            <div>
               <h3 className="text-2xl font-display font-bold text-white mt-2">1,242</h3>
               <p className="text-[9px] text-slate-400 font-mono mt-1">MINERS EARNED</p>
            </div>
         </div>

         {/* PF DOW COMPOSITE */}
         <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <BarChart3 className="text-blue-500" size={20} />
               <span className="text-[9px] font-mono text-slate-500">PF DOW</span>
            </div>
            <div>
               <h3 className="text-2xl font-display font-bold text-white mt-2">1,240.55</h3>
               <p className="text-[9px] text-green-400 font-mono mt-1">▲ +12.4%</p>
            </div>
         </div>
      </div>

      {/* 5. THE ARCHITECT'S LEDGER (FOUNDER TRANSPARENCY) */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
         <h2 className="text-sm font-display font-bold text-white mb-4 flex items-center gap-2">
            <Crown size={16} className="text-yellow-500" /> 
            THE ARCHITECT'S POSITION (FOUNDER)
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
               <p className="text-[9px] text-slate-500 font-mono mb-1">TOTAL PF BALANCE</p>
               <p className="text-lg font-bold text-white">100.0M <span className="text-xs text-blue-500">PF</span></p>
               <p className="text-[9px] text-blue-400 font-bold mt-1">POOLED WITH USERS</p>
            </div>
            <div>
               <p className="text-[9px] text-slate-500 font-mono mb-1">CONVERSION INPUT</p>
               <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-mint-500">25.0M <span className="text-xs">MTRA</span></p>
               </div>
               <p className="text-[9px] text-slate-600 mt-1">100% CONVERTED</p>
            </div>
            <div>
               <p className="text-[9px] text-slate-500 font-mono mb-1">VOLUNTARY BURN</p>
               <p className="text-lg font-bold text-phoenix-500">250K <span className="text-xs">MTRA</span></p>
            </div>
            <div className="flex items-center">
               <p className="text-[10px] text-slate-400 italic border-l-2 border-slate-800 pl-2">
                  "I do not sell. I build the floor."
               </p>
            </div>
         </div>
      </div>

      {/* 6. PROTOCOL TRANSPARENCY (EXPENSES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
         {/* EXPENSE REPORT */}
         <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
            <h3 className="text-xs font-display font-bold text-white mb-4 flex items-center gap-2">
               <FileText size={14} className="text-slate-400"/> PROTOCOL OUTFLOWS
            </h3>
            <div className="space-y-3">
               <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-[10px] text-slate-400 flex items-center gap-2">
                     <Briefcase size={10} /> COMMUNITY FREELANCERS
                  </span>
                  <span className="text-xs font-bold text-blue-400">450,000 PF</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-[10px] text-slate-400 flex items-center gap-2">
                     <Server size={10} /> INFRASTRUCTURE (AWS/GOOGLE)
                  </span>
                  <span className="text-xs font-bold text-white">$4,200 / mo</span>
               </div>
               <div className="pt-1">
                  <p className="text-[9px] text-slate-500 font-mono text-center">
                     WORK IS PAID IN ASSETS (PF). INFRASTRUCTURE IS PAID IN USD.
                  </p>
               </div>
            </div>
         </div>

         {/* POOL LIQUIDITY AGGREGATE */}
         <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
            <h3 className="text-xs font-display font-bold text-white mb-4 flex items-center gap-2">
               <Database size={14} className="text-slate-400"/> LIQUIDITY DEPTH
            </h3>
            <div className="space-y-3">
               <div className="bg-slate-950 p-2 rounded flex justify-between items-center">
                  <div>
                     <p className="text-[9px] text-yellow-500 font-bold mb-1">STAKING VAULTS (TVL)</p>
                     <p className="text-lg font-bold text-white">24.5M MTRA</p>
                  </div>
                  <Lock size={16} className="text-yellow-500/50" />
               </div>
               <div className="bg-slate-950 p-2 rounded flex justify-between items-center">
                  <div>
                     <p className="text-[9px] text-blue-500 font-bold mb-1">PERMAFROST (FROZEN)</p>
                     <p className="text-lg font-bold text-white">145.2M PF</p>
                  </div>
                  <Snowflake size={16} className="text-blue-500/50" />
               </div>
            </div>
         </div>
      </div>

      {/* 7. LIVE LEDGER (RSS FEED) */}
      <div className="rounded-xl border border-slate-700 overflow-hidden">
         <div className="bg-slate-900 p-3 border-b border-slate-800">
            <h2 className="text-xs font-display font-bold text-white flex items-center gap-2">
               <List size={14} className="text-slate-400"/> LIVE PROTOCOL LEDGER
            </h2>
         </div>
         <div className="max-h-48 overflow-y-auto bg-slate-950">
            <table className="w-full text-left text-[10px] font-mono">
               <thead className="bg-slate-900 text-slate-500 sticky top-0">
                  <tr>
                     <th className="p-2 font-normal">TIME</th>
                     <th className="p-2 font-normal">EVENT</th>
                     <th className="p-2 font-normal">DETAIL</th>
                     <th className="p-2 font-normal text-right">SOURCE</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                  {MOCK_LEDGER.map((item, i) => (
                     <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-2 text-slate-400">{item.time}</td>
                        <td className="p-2 font-bold text-white flex items-center gap-1">
                           {item.action.includes('BURN') && <Hash size={10} className="text-red-500"/>}
                           {item.action.includes('STAKE') && <Lock size={10} className="text-yellow-500"/>}
                           {item.action.includes('BONUS') && <Zap size={10} className="text-phoenix-500"/>}
                           {item.action.includes('CONVERSION') && <Snowflake size={10} className="text-blue-500"/>}
                           {item.action.includes('HASH') && <Activity size={10} className="text-mint-500"/>}
                           {item.action.includes('CAPITAL') && <ShoppingCart size={10} className="text-green-500"/>}
                           {item.action}
                        </td>
                        <td className="p-2 text-slate-300">{item.detail}</td>
                        <td className="p-2 text-right text-slate-500">{item.source}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* 8. CHARTS (OZYMANDIAS) */}
      <div className="pt-4">
         <TreasuryCharts />
      </div>

    </div>
  );
};
