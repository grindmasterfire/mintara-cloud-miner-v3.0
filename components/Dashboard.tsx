
import React, { useState } from 'react';
import { ViewState, UserStats, TreasuryData } from '../types';
import { 
  Pickaxe, 
  Gamepad2, 
  Lock, 
  Snowflake, 
  ArrowRightLeft, 
  Landmark, 
  Wallet, 
  UserCircle,
  TrendingUp,
  Zap,
  Flame,
  Activity,
  Users,
  Rss,
  Copy
} from 'lucide-react';

interface MainMenuProps {
  userStats: UserStats;
  treasuryData: TreasuryData;
  onNavigate: (view: ViewState) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ userStats, treasuryData, onNavigate }) => {
  const [rssCopied, setRssCopied] = useState(false);

  const handleRssClick = () => {
    setRssCopied(true);
    setTimeout(() => setRssCopied(false), 2000);
  };

  // STRICT PALETTE ENFORCEMENT
  // MINT: Mining, Wallet (Liquid)
  // PHOENIX: Staking, Swap (Wealth)
  // BLUE: Game Room, Permafrost (Data/Ice)
  // SLATE: Treasury, Profile (Admin)
  const menuItems = [
    { id: ViewState.MINING, label: 'CLOUD MINER', icon: Pickaxe, color: 'text-mint-400', border: 'border-mint-500/20', bg: 'bg-mint-500/5' },
    { id: ViewState.GAMEROOM, label: 'GAME ROOM', icon: Gamepad2, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
    { id: ViewState.STAKING, label: 'STAKING', icon: Lock, color: 'text-phoenix-400', border: 'border-phoenix-500/20', bg: 'bg-phoenix-500/5' },
    { id: ViewState.PERMAFROST, label: 'PERMAFROST', icon: Snowflake, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
    { id: ViewState.MARKETPLACE, label: 'PF SWAP', icon: ArrowRightLeft, color: 'text-phoenix-400', border: 'border-phoenix-500/20', bg: 'bg-phoenix-500/5' },
    { id: ViewState.TREASURY, label: 'TREASURY', icon: Landmark, color: 'text-slate-300', border: 'border-slate-500/20', bg: 'bg-slate-500/5' },
    { id: ViewState.WALLET, label: 'WALLET', icon: Wallet, color: 'text-mint-400', border: 'border-mint-500/20', bg: 'bg-mint-500/5' },
    { id: ViewState.PROFILE, label: 'PROFILE', icon: UserCircle, color: 'text-slate-300', border: 'border-slate-500/20', bg: 'bg-slate-500/5' },
  ];

  return (
    <div className="space-y-6">
      
      {/* SCROLLING TICKER (RSS FEED) */}
      <div className="w-full bg-slate-900 border-y border-slate-800 overflow-hidden relative flex items-center h-10">
        
        {/* RSS Export Button (Absolute Left) */}
        <button 
          onClick={handleRssClick}
          className="absolute left-0 top-0 bottom-0 z-20 px-3 bg-slate-800 border-r border-slate-700 text-phoenix-500 hover:text-white flex items-center justify-center transition-colors shadow-[4px_0_10px_rgba(0,0,0,0.5)]"
          title="Copy RSS Feed Link"
        >
          {rssCopied ? <Copy size={14} /> : <Rss size={14} />}
        </button>

        {/* Ticker Content */}
        {/* ADDED w-max to force full width calculation so -100% moves the WHOLE text */}
        <div className="whitespace-nowrap animate-marquee flex items-center gap-6 text-xs font-mono tracking-wider absolute left-12 w-max will-change-transform">
          
          {/* HEADLINE: RUSH TO ICO */}
          <div className="flex items-center gap-3 bg-mint-500/10 border border-mint-500/50 px-3 py-1 rounded text-mint-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)] shrink-0">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>RUSH TO ICO: $0.1456</span>
            <span className="text-white/70 font-normal text-[10px]">(24H: +1.2%)</span>
          </div>

          {/* THE CHASE (DATA STREAM) */}
          <span className="flex items-center gap-2 text-phoenix-400 opacity-90 shrink-0">
            <Zap size={12}/> BUY: $1,200 (4,800 MTRA)
          </span>
          
          <span className="text-slate-700 shrink-0">/</span>

          <span className="flex items-center gap-2 text-blue-400 opacity-90 shrink-0">
            <Snowflake size={12}/> CONVERT: 5K PF FROZEN
          </span>

          <span className="text-slate-700 shrink-0">/</span>

          <span className="flex items-center gap-2 text-red-400 opacity-90 shrink-0">
            <Flame size={12}/> BURN: 250 MTRA
          </span>

          <span className="text-slate-700 shrink-0">/</span>

          <span className="flex items-center gap-2 text-slate-300 opacity-90 shrink-0">
            <ArrowRightLeft size={12}/> SWAP: 1K PF ($450)
          </span>

          <span className="text-slate-700 shrink-0">/</span>

          <span className="flex items-center gap-2 text-mint-400 opacity-90 shrink-0">
            <UserCircle size={12}/> JOIN: USER_992 (BR)
          </span>

          <span className="text-slate-700 shrink-0">/</span>

          <span className="flex items-center gap-2 text-gold-500 font-bold shrink-0">
            <Activity size={12}/> DISCOVERY HASH: 0.0120
          </span>
        </div>
        
        {/* Toast for RSS */}
        {rssCopied && (
          <div className="absolute top-10 left-2 bg-phoenix-500 text-black text-[10px] font-bold px-2 py-1 rounded z-50 animate-in fade-in slide-in-from-top-2">
            RSS FEED COPIED
          </div>
        )}

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite; /* 20s for high speed */
            display: inline-flex;
          }
        `}</style>
      </div>

      {/* WELCOME HEADER */}
      <div className="px-2">
        <h1 className="text-2xl font-display font-bold text-white uppercase">MINTARA CLOUD MINER</h1>
        <p className="text-slate-400 font-mono text-xs">
           USER: {userStats.username || 'GUEST'} • TIER: <span className="text-phoenix-500">{userStats.tier.toUpperCase()}</span>
        </p>
      </div>

      {/* 8-BUTTON GRID - UNIFORM PALETTE */}
      <div className="grid grid-cols-2 gap-4 pb-20">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              relative group flex flex-col items-center justify-center p-6 h-40 rounded-2xl 
              border ${item.border} ${item.bg} backdrop-blur-sm
              hover:bg-opacity-20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
            `}
          >
            <div className={`
              mb-4 p-4 rounded-full bg-dark-900/50 border border-slate-700 
              group-hover:border-white/20 group-hover:bg-dark-900/80 transition-colors
            `}>
              <item.icon size={32} className={item.color} />
            </div>
            <span className="font-display font-bold text-sm tracking-widest text-white group-hover:text-mint-400 transition-colors">
              {item.label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
};
