
import React, { useState } from 'react';
import { UserStats } from '../types';
import { 
  UserCircle, 
  Crown, 
  ShieldCheck, 
  CreditCard, 
  Settings,
  LogOut,
  Mail,
  Hash,
  FileText,
  Check,
  Lock,
  BookOpen,
  Scale,
  HelpCircle,
  School,
  ExternalLink,
  X,
  Scroll,
  Pickaxe,
  ArrowRightLeft,
  Snowflake,
  Target,
  Zap,
  Volume2,
  Vibrate,
  Battery,
  Trash2
} from 'lucide-react';

interface ProfileInterfaceProps {
  user: UserStats;
  onLogout: () => void;
}

const KYC_TIERS = [
  { id: 0, label: 'TIER 0 (GHOST)', cost: 0, limit: 0, req: 'None' },
  { id: 1, label: 'TIER 1 (BASIC)', cost: 1, limit: 1000, req: 'SMS' },
  { id: 2, label: 'TIER 2 (PRO)', cost: 3, limit: 10000, req: 'ID Scan' },
  { id: 3, label: 'TIER 3 (UNLIMITED)', cost: 10, limit: -1, req: 'Video' },
];

type DocType = 'TOS' | 'PRIVACY' | 'WHITE' | 'TUT_MINING' | 'TUT_SWAP' | 'TUT_STAKING' | null;

export const ProfileInterface: React.FC<ProfileInterfaceProps> = ({ user, onLogout }) => {
  
  const [kycLevel, setKycLevel] = useState(3); // Mocking user is Tier 3
  const [upgradingTo, setUpgradingTo] = useState<number | null>(null);
  const [activeDoc, setActiveDoc] = useState<DocType>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    audio: true,
    haptics: true,
    lowPower: false,
    notifications: true
  });

  // Mock Data for Legacy Calc
  const TOTAL_BUY_USD = 1250; // Example
  const TARGET_SESSIONS = 600;
  const TARGET_BUY = 1000;

  const sessionProgress = Math.min(user.sessionCount / TARGET_SESSIONS, 1);
  const buyProgress = Math.min(TOTAL_BUY_USD / TARGET_BUY, 1);
  const legacyScore = sessionProgress + buyProgress;
  const isLegacyUnlocked = legacyScore >= 1.0 || user.legacyStatus;

  const activeTier = KYC_TIERS[kycLevel];

  const handleUpgrade = (tierId: number) => {
     setUpgradingTo(tierId);
     // Simulate API call
     setTimeout(() => {
        setKycLevel(tierId);
        setUpgradingTo(null);
     }, 1500);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearCache = () => {
    if(confirm("Clear local app cache? You will be logged out.")) {
      alert("Cache cleared. App will restart.");
      window.location.reload();
    }
  };

  const handleContactSecurity = () => {
    window.location.href = "mailto:security@mintara.com?subject=SECURE%20CHANNEL%20REQUEST%20(UID:882)";
  };

  return (
    <div className="space-y-6 h-full pb-20">
      
      {/* HEADER: IDENTITY */}
      <div className="glass-panel p-6 rounded-xl border border-slate-700 flex items-center gap-6">
         <div className="relative">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border-2 border-slate-600">
               <UserCircle size={48} />
            </div>
            {isLegacyUnlocked && (
               <div className="absolute -bottom-1 -right-1 bg-gold-500 text-black p-1.5 rounded-full border-2 border-slate-900">
                  <Crown size={14} fill="currentColor" />
               </div>
            )}
         </div>
         
         <div className="flex-1">
            <h2 className="text-2xl font-display font-bold text-white">{user.username || 'MINER_882'}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-slate-400 border border-slate-700">
                  0x71...8a9c
               </span>
               <span className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 ${kycLevel === 3 ? 'bg-green-900/30 text-green-400 border-green-500/30' : 'bg-slate-800 text-slate-400 border-slate-600'}`}>
                  <ShieldCheck size={10} /> {activeTier.label}
               </span>
            </div>
         </div>
      </div>

      {/* LEGACY STATUS TRACKER */}
      <div className="glass-panel p-6 rounded-xl border border-gold-500/30 relative overflow-hidden">
         {isLegacyUnlocked && (
            <div className="absolute -right-12 top-6 bg-gold-500 text-black font-bold text-[10px] py-1 px-12 rotate-45 shadow-lg">
               UNLOCKED
            </div>
         )}
         
         <div className="mb-6">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
               <Crown size={20} className={isLegacyUnlocked ? "text-gold-500" : "text-slate-600"} fill={isLegacyUnlocked ? "currentColor" : "none"} />
               LEGACY STATUS
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
               EARN PERMANENT 1.15x CONVERSION BONUS
            </p>
         </div>

         <div className="space-y-4">
            {/* Metric 1: Sessions */}
            <div>
               <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">MINING SESSIONS ({user.sessionCount}/600)</span>
                  <span className="text-mint-500">{(sessionProgress * 100).toFixed(0)}%</span>
               </div>
               <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-mint-500 transition-all duration-1000" style={{ width: `${sessionProgress * 100}%` }}></div>
               </div>
            </div>

            {/* Metric 2: Capital */}
            <div>
               <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">CAPITAL MINING (${TOTAL_BUY_USD}/$1000)</span>
                  <span className="text-phoenix-500">{(buyProgress * 100).toFixed(0)}%</span>
               </div>
               <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-phoenix-500 transition-all duration-1000" style={{ width: `${buyProgress * 100}%` }}></div>
               </div>
            </div>

            {/* Total Score */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
               <span className="text-xs font-bold text-white">TOTAL LEGACY SCORE</span>
               <div className="text-right">
                  <span className={`text-2xl font-display font-bold ${isLegacyUnlocked ? 'text-gold-400' : 'text-slate-500'}`}>
                     {legacyScore.toFixed(2)} <span className="text-sm text-slate-600">/ 1.0</span>
                  </span>
               </div>
            </div>
         </div>
      </div>

      {/* KYC COMPLIANCE CENTER */}
      <div className="space-y-4">
         <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
            <FileText size={16} className="text-slate-400"/> KYC COMPLIANCE LEVEL
         </h3>
         
         <div className="grid grid-cols-1 gap-3">
            {KYC_TIERS.map((tier) => {
               const isActive = kycLevel === tier.id;
               const isLocked = kycLevel < tier.id;
               
               return (
                  <div 
                     key={tier.id} 
                     className={`
                        p-4 rounded-xl border flex items-center justify-between transition-all
                        ${isActive 
                           ? 'bg-green-900/10 border-green-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                           : 'bg-slate-900 border-slate-800 opacity-80'
                        }
                     `}
                  >
                     <div className="flex items-center gap-4">
                        <div className={`
                           w-10 h-10 rounded-lg flex items-center justify-center font-bold
                           ${isActive ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-500'}
                        `}>
                           {tier.id}
                        </div>
                        <div>
                           <h4 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-400'}`}>
                              {tier.label}
                           </h4>
                           <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                              LIMIT: {tier.limit === -1 ? 'UNLIMITED' : `$${tier.limit.toLocaleString()}/mo`} • REQ: {tier.req.toUpperCase()}
                           </p>
                        </div>
                     </div>

                     <div>
                        {isActive ? (
                           <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-900/20 px-3 py-1.5 rounded border border-green-500/20">
                              <Check size={12} /> ACTIVE
                           </div>
                        ) : isLocked ? (
                           <button 
                              onClick={() => handleUpgrade(tier.id)}
                              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                           >
                              {upgradingTo === tier.id ? 'VERIFYING...' : `UPGRADE ($${tier.cost})`}
                           </button>
                        ) : (
                           <div className="text-slate-600 text-xs font-mono">PASSED</div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      {/* MINTARA ACADEMY (TUTORIALS) */}
      <div className="space-y-4">
         <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
            <School size={16} className="text-slate-400"/> MINTARA ACADEMY
         </h3>
         <div className="grid grid-cols-1 gap-2">
            <button 
               onClick={() => setActiveDoc('TUT_MINING')}
               className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between hover:border-mint-500/50 transition-colors group"
            >
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded group-hover:bg-mint-900/20 text-slate-400 group-hover:text-mint-500 transition-colors">
                     <Pickaxe size={16} />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-bold text-white">CLOUD MINER 101</p>
                     <p className="text-[10px] text-slate-500">Mining Logic, Sessions, and Yield</p>
                  </div>
               </div>
               <ExternalLink size={14} className="text-slate-600" />
            </button>
            
            <button 
               onClick={() => setActiveDoc('TUT_SWAP')}
               className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between hover:border-phoenix-500/50 transition-colors group"
            >
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded group-hover:bg-phoenix-900/20 text-slate-400 group-hover:text-phoenix-500 transition-colors">
                     <ArrowRightLeft size={16} />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-bold text-white">PF SWAP GUIDE</p>
                     <p className="text-[10px] text-slate-500">Listing, Buying, and Escrow</p>
                  </div>
               </div>
               <ExternalLink size={14} className="text-slate-600" />
            </button>

            <button 
               onClick={() => setActiveDoc('TUT_STAKING')}
               className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between hover:border-blue-500/50 transition-colors group"
            >
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded group-hover:bg-blue-900/20 text-slate-400 group-hover:text-blue-500 transition-colors">
                     <Snowflake size={16} />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-bold text-white">PERPETUAL STAKING</p>
                     <p className="text-[10px] text-slate-500">Permafrost Mechanics & Endowment</p>
                  </div>
               </div>
               <ExternalLink size={14} className="text-slate-600" />
            </button>
         </div>
      </div>

      {/* LEGAL & SUPPORT */}
      <div className="grid grid-cols-1 gap-2">
         <h3 className="font-display font-bold text-white text-sm flex items-center gap-2 mt-2">
            <Scale size={16} className="text-slate-400"/> PROTOCOL DOCUMENTATION
         </h3>
         
         <div className="grid grid-cols-2 gap-2">
            <button 
               onClick={() => setActiveDoc('WHITE')}
               className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg text-left hover:bg-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-colors font-bold"
            >
               MINTARA WHITEPAPER
            </button>
            <button 
               onClick={() => setActiveDoc('TOS')}
               className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg text-left hover:bg-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
               TERMS OF SERVICE
            </button>
            <button 
               onClick={() => setActiveDoc('PRIVACY')}
               className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg text-left hover:bg-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
               PRIVACY NOTICE
            </button>
            <button 
               onClick={handleContactSecurity}
               className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg text-left hover:bg-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center justify-between"
            >
               <span>CONTACT SUPERCLAUDE</span>
               <Mail size={12} />
            </button>
         </div>
      </div>

      {/* SYSTEM ACTIONS */}
      <div className="grid grid-cols-2 gap-4 pt-4">
         <button 
            onClick={() => setShowSettings(true)}
            className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-left hover:bg-slate-800 transition-colors group"
         >
            <Settings size={24} className="text-slate-400 group-hover:text-white mb-2" />
            <p className="font-bold text-white text-sm">APP SETTINGS</p>
            <p className="text-[10px] text-slate-500">Audio, Haptics, Cache</p>
         </button>

         <button 
            onClick={onLogout}
            className="p-4 bg-red-900/10 border border-red-900/30 rounded-xl text-left hover:bg-red-900/20 transition-colors group"
         >
            <LogOut size={24} className="text-red-400 mb-2" />
            <p className="font-bold text-red-400 text-sm">DISCONNECT</p>
            <p className="text-[10px] text-red-300/50">Close Session</p>
         </button>
      </div>

      <div className="text-center pt-8">
         <p className="text-xs text-slate-600 font-mono">
            UID: 882-ALPHA • VERSION 1.0.0
         </p>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
         <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95">
               <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h2 className="font-display font-bold text-white flex items-center gap-2">
                     <Settings size={20} /> CONFIGURATION
                  </h2>
                  <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-6 space-y-4">
                  {/* Audio */}
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                     <div className="flex items-center gap-3">
                        <Volume2 size={20} className="text-mint-500" />
                        <div>
                           <p className="text-sm font-bold text-white">AUDIO ENGINE</p>
                           <p className="text-[10px] text-slate-500">Zenner tones & UI sounds</p>
                        </div>
                     </div>
                     <button onClick={() => toggleSetting('audio')} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.audio ? 'bg-mint-500' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.audio ? 'translate-x-5' : 'translate-x-0'}`} />
                     </button>
                  </div>

                  {/* Haptics */}
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                     <div className="flex items-center gap-3">
                        <Vibrate size={20} className="text-blue-500" />
                        <div>
                           <p className="text-sm font-bold text-white">HAPTIC FEEDBACK</p>
                           <p className="text-[10px] text-slate-500">Vibrate on interaction</p>
                        </div>
                     </div>
                     <button onClick={() => toggleSetting('haptics')} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.haptics ? 'bg-blue-500' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.haptics ? 'translate-x-5' : 'translate-x-0'}`} />
                     </button>
                  </div>

                  {/* Low Power */}
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                     <div className="flex items-center gap-3">
                        <Battery size={20} className="text-yellow-500" />
                        <div>
                           <p className="text-sm font-bold text-white">LOW POWER MODE</p>
                           <p className="text-[10px] text-slate-500">Reduce animations</p>
                        </div>
                     </div>
                     <button onClick={() => toggleSetting('lowPower')} className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.lowPower ? 'bg-yellow-500' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.lowPower ? 'translate-x-5' : 'translate-x-0'}`} />
                     </button>
                  </div>

                  {/* Clear Cache */}
                  <button 
                     onClick={handleClearCache}
                     className="w-full p-3 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 rounded-lg flex items-center justify-center gap-2 text-red-400 font-bold text-xs transition-colors mt-4"
                  >
                     <Trash2 size={16} /> CLEAR LOCAL STORAGE
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* DOCUMENT VIEWER MODAL */}
      {activeDoc && (
         <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
               
               {/* Header */}
               <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     {(activeDoc === 'TOS' || activeDoc === 'PRIVACY' || activeDoc === 'WHITE') ? (
                        <Scroll className="text-mint-500" size={20} />
                     ) : (
                        <School className="text-phoenix-500" size={20} />
                     )}
                     <h2 className="font-display font-bold text-white text-lg">
                        {activeDoc === 'TOS' && 'TERMS OF SERVICE'}
                        {activeDoc === 'PRIVACY' && 'PRIVACY POLICY'}
                        {activeDoc === 'WHITE' && 'MINTARA WHITEPAPER'}
                        {activeDoc === 'TUT_MINING' && 'CLOUD MINER 101'}
                        {activeDoc === 'TUT_SWAP' && 'PF SWAP MECHANICS'}
                        {activeDoc === 'TUT_STAKING' && 'PERPETUAL STAKING'}
                     </h2>
                  </div>
                  <button onClick={() => setActiveDoc(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                     <X size={20} />
                  </button>
               </div>

               {/* Scrollable Content */}
               <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-300 space-y-6 font-serif leading-relaxed">
                  
                  {/* --- TUTORIALS --- */}
                  {activeDoc === 'TUT_MINING' && (
                     <>
                        <div className="bg-slate-950 p-4 rounded border border-slate-800 mb-4">
                           <p className="text-xs font-sans font-bold text-mint-500 mb-1">CORE CONCEPT</p>
                           <p>Mintara uses <strong>"Proof of Attention"</strong>. You trade your time/attention for revenue-backed assets.</p>
                        </div>
                        <section>
                           <h3 className="text-white font-bold font-sans mb-2">1. THE CHURN TAX (ENTRY)</h3>
                           <p>Every mining session starts with <strong>2 Mandatory House Ads</strong>. This is the "Entry Toll" that pays for the server infrastructure and security (SuperClaude). You cannot skip these.</p>
                        </section>
                        <section>
                           <h3 className="text-white font-bold font-sans mb-2">2. THE MINING LOOP</h3>
                           <p>Once inside, the cycle begins:</p>
                           <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                              <li><strong>Play/Engage:</strong> 3 Minutes of activity (Game or Content).</li>
                              <li><strong>Mining Ad:</strong> A 30-second ad plays. This generates revenue.</li>
                              <li><strong>Anti-AFK Check:</strong> You must press "CONTINUE MINING" to prove you are human. If you miss this, the session ends.</li>
                           </ul>
                        </section>
                        <section>
                           <h3 className="text-white font-bold font-sans mb-2">3. REVENUE DISTRIBUTION</h3>
                           <p>The revenue from that Mining Ad is split instantly:</p>
                           <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                              <li><span className="text-mint-400 font-bold">60% TO YOU:</span> Paid in MTRA immediately.</li>
                              <li><span className="text-blue-400 font-bold">25% TO PERMAFROST:</span> Feeds the Sweat Pool.</li>
                              <li><span className="text-yellow-400 font-bold">15% TO STAKING:</span> Feeds the Staking Yield.</li>
                           </ul>
                        </section>
                     </>
                  )}

                  {activeDoc === 'TUT_SWAP' && (
                     <>
                        <section>
                           <h3 className="text-white font-bold font-sans mb-2">1. THE WALLED GARDEN</h3>
                           <p>The PF Swap is the <strong>only</strong> place to trade Permafrost (PF). Because PF is "Soulbound" (non-transferable), it cannot be sent to external wallets like MetaMask.</p>
                        </section>
                        <section>
                           <h3 className="text-white font-bold font-sans mb-2">2. PROTOCOL SUBSIDIES (GAS FREE)</h3>
                           <p>Mintara covers the gas fees for trades involving its own assets:</p>
                           <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                              <li><span className="text-green-400">PF & MTRA TRADES:</span> <strong>Gas Sponsored (Free).</strong></li>
                              <li><span className="text-yellow-400">EXTERNAL TRADES:</span> User Pays Gas.</li>
                           </ul>
                        </section>
                        <section>
                           <h3 className="text-white font-bold font-sans mb-2">3. ESCROW & TIMELOCKS</h3>
                           <p>Trades are not instant swaps; they are Escrow Contracts. Buyers and Sellers lock their assets for a set time. The trade executes when matched.</p>
                        </section>
                     </>
                  )}

                  {activeDoc === 'TUT_STAKING' && (
                     <>
                        <div className="bg-slate-950 p-4 rounded border border-slate-800 mb-4">
                           <p className="text-xs font-sans font-bold text-blue-400 mb-1">PERMAFROST VS. STAKING</p>
                           <p><strong>Permafrost (PF):</strong> Locked FOREVER. Cannot be unstaked. Earns 25% Split.</p>
                           <p><strong>Staking:</strong> Locked for TIME. Can be unstaked. Earns 15% Split.</p>
                        </div>
                        <section>
                           <h3 className="text-white font-bold font-sans mb-2">1. THE ENDOWMENT (BENEVOLENT WHALE)</h3>
                           <p>The Protocol itself is the largest staker (Agent 01). It takes 7.5% of House Ads (Props) and locks them.</p>
                           <p className="mt-2">Crucially, the Agent <strong>RECYCLES</strong> its yield. Instead of taking profit, it throws 50% of its earnings back into the pot for YOU. This boosts your APY significantly.</p>
                        </section>
                        <section>
                           <h3 className="text-white font-bold font-sans mb-2">2. EMERGENCY UNSTAKE</h3>
                           <p>If you lock for 1 Year but need money in Month 2, you can "Emergency Unstake."</p>
                           <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                              <li>You pay a <strong>Graduated Penalty</strong> (10% - 30%) on your Principal.</li>
                              <li>You <strong>KEEP</strong> all rewards earned so far.</li>
                              <li>The Penalty is burned to the War Chest.</li>
                           </ul>
                        </section>
                     </>
                  )}

                  {/* --- WHITEPAPER V3.0 (PHOENIX EDITION) --- */}
                  {activeDoc === 'WHITE' && (
                     <>
                        <div className="text-center mb-8 border-b border-slate-700 pb-4">
                           <h1 className="text-2xl font-display font-bold text-white tracking-wider">MINTARA PROTOCOL</h1>
                           <p className="text-xs font-mono text-phoenix-500 tracking-[0.3em] mt-1">OFFICIAL WHITEPAPER</p>
                        </div>

                        <section className="space-y-3">
                           <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2"><BookOpen size={18} className="text-slate-400"/> ABSTRACT</h3>
                           <p>Mintara is not a game, and it is not a meme coin. It is the <strong>"Harvard Endowment of Crypto"</strong>—a protocol designed to monetize the world's most renewable resource (Human Attention) and invest it into a forever-locked Treasury.</p>
                           <p>The core thesis is simple: Ad revenue is typically stolen by platforms. Mintara tokenizes this revenue (Proof of Attention) and returns 100% of it to the ecosystem via direct payouts, staking yields, and the War Chest.</p>
                        </section>

                        <section className="space-y-3 pt-4">
                           <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2"><Target size={18} className="text-slate-400"/> THE TWO-ENGINE SYSTEM</h3>
                           <p>The protocol avoids the "Death Spiral" of traditional play-to-earn games by separating Growth from Defense.</p>
                           
                           <div className="pl-4 border-l-2 border-mint-500/50 space-y-2">
                              <h4 className="font-bold text-mint-400 text-sm">ENGINE 1: THE ENDOWMENT (GROWTH)</h4>
                              <p>Treasury Agents use 30% of House Ad revenue ("Props") to MINT & LOCK MTRA. These Agents never sell. They constantly raise the price floor by removing supply and recycling 50% of their yield back to users.</p>
                           </div>

                           <div className="pl-4 border-l-2 border-red-500/50 space-y-2 mt-4">
                              <h4 className="font-bold text-red-400 text-sm">ENGINE 2: THE WAR CHEST (DEFENSE)</h4>
                              <p>50% of House Ad revenue is stockpiled in USD. If the MTRA price drops below the backing peg ($0.25), the War Chest activates to BUY & BURN tokens from the open market.</p>
                           </div>
                        </section>

                        <section className="space-y-3 pt-4">
                           <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2"><Snowflake size={18} className="text-slate-400"/> TOKENOMICS & ASSETS</h3>
                           <ul className="list-disc pl-5 space-y-2 text-slate-400">
                              <li><strong>MTRA (Liquid):</strong> The currency. Minted via attention or capital. Burnable.</li>
                              <li><strong>PF (Permafrost):</strong> The asset. Created by permanently locking MTRA. Non-transferable (Soulbound) outside the internal marketplace.</li>
                              <li><strong>The One-Way Door:</strong> You can convert MTRA to PF, but you can never convert PF back to MTRA. This ensures the asset base only grows.</li>
                           </ul>
                        </section>

                        <section className="space-y-3 pt-4">
                           <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2"><Zap size={18} className="text-slate-400"/> THE YIELD RECYCLER</h3>
                           <p>Staking APY in Mintara is high (up to 165%) because of the <strong>Benevolent Whale</strong> mechanic.</p>
                           <p>The Protocol Agents hold massive positions. They earn the majority of the yield. However, instead of keeping it, they <strong>RECYCLE 50%</strong> of that yield back into the user pool. The larger the Endowment grows, the higher the APY for individual stakers.</p>
                        </section>

                        <section className="space-y-3 pt-4">
                           <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2"><ArrowRightLeft size={18} className="text-slate-400"/> THE MARKETPLACE (PF SWAP)</h3>
                           <p>To maintain value within the ecosystem, Mintara operates a "Walled Garden" exchange.</p>
                           <p>Trading PF or MTRA within the app is <strong>GAS FREE</strong> (Sponsored by Protocol). Trading external assets (ETH/BTC) incurs standard fees. This incentivizes liquidity to remain in Mintara assets.</p>
                        </section>

                        <div className="mt-8 p-4 bg-slate-950 border border-slate-800 rounded text-center">
                           <p className="text-xs font-mono text-slate-500">MISSION STATEMENT</p>
                           <p className="font-display font-bold text-white mt-1">"WE PROFIT FROM ADVERTISERS, NOT OFF USERS."</p>
                        </div>
                     </>
                  )}

                  {/* --- EXISTING LEGAL DOCS (TOS/PRIVACY) --- */}
                  {activeDoc === 'TOS' && (
                     <>
                        <p className="text-xs text-slate-500 font-sans uppercase tracking-widest mb-4">Last Updated: November 24, 2025</p>
                        <section>
                           <h3 className="text-white font-bold mb-2">1. ACCEPTANCE OF TERMS</h3>
                           <p>By accessing or using the Mintara Protocol ("The Protocol"), including the Cloud Miner, PF Swap, and Staking interfaces, you agree to be bound by these Terms. If you do not agree, do not use the Protocol.</p>
                        </section>
                        <section>
                           <h3 className="text-white font-bold mb-2">2. NATURE OF ASSETS</h3>
                           <p><strong>MTRA (Mintara Token)</strong> and <strong>PF (Permafrost)</strong> are cryptographic utility tokens designed for use within the Mintara ecosystem. They are NOT securities, shares, or financial instruments. They represent a unit of attention (Proof of Attention) or a unit of staked commitment.</p>
                        </section>
                        <section>
                           <h3 className="text-white font-bold mb-2">3. MINING & ANTI-CHEAT</h3>
                           <p>The Cloud Miner is designed for human interaction. The use of emulators, autoclickers, ad-blockers, or scripts to simulate mining activity is strictly prohibited. Our security system ("SUPERCLAUDE") actively monitors behavioral patterns.</p>
                        </section>
                     </>
                  )}

                  {activeDoc === 'PRIVACY' && (
                     <>
                        <p className="text-xs text-slate-500 font-sans uppercase tracking-widest mb-4">Last Updated: November 24, 2025</p>
                        <section>
                           <h3 className="text-white font-bold mb-2">1. DATA COLLECTION</h3>
                           <p>We prioritize user anonymity. However, to facilitate the Protocol functions, we collect Wallet Address and Device IDs for AdMob verification.</p>
                        </section>
                        <section>
                           <h3 className="text-white font-bold mb-2">2. ADVERTISING PARTNERS</h3>
                           <p>We use Google AdMob to generate revenue for the Treasury. Google may collect data about your device and interests to provide relevant ads.</p>
                        </section>
                     </>
                  )}

               </div>

               {/* Footer */}
               <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                  <button 
                     onClick={() => setActiveDoc(null)}
                     className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-slate-200 transition-colors"
                  >
                     ACKNOWLEDGE & CLOSE
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
