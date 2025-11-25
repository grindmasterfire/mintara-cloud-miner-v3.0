
import React, { useState } from 'react';
import { UserStats } from '../types';
import { 
  Wallet, 
  Send, 
  ArrowDownLeft, 
  ExternalLink,
  CreditCard,
  X,
  Zap,
  ShieldCheck,
  Crown,
  TrendingUp,
  RefreshCw,
  Coins,
  ArrowRightLeft,
  Lock,
  Snowflake,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface WalletInterfaceProps {
  user: UserStats;
}

const MOCK_HISTORY = [
  { id: 1, type: 'MINT', amount: 0.12, token: 'MTRA', date: '2 mins ago', status: 'COMPLETED' },
  { id: 2, type: 'STAKE', amount: 2500, token: 'MTRA', date: '1 day ago', status: 'LOCKED' },
  { id: 3, type: 'FREEZE', amount: 500, token: 'PF', date: '3 days ago', status: 'CONVERTED' },
  { id: 4, type: 'MINT', amount: 12.5, token: 'MTRA', date: '1 week ago', status: 'COMPLETED' },
];

export const WalletInterface: React.FC<WalletInterfaceProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'HISTORY'>('ASSETS');
  
  // Modal States
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  
  // Buy State
  const [buyAmount, setBuyAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'USDC' | 'ETH' | 'CARD'>('USDC');

  // Send State
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  const MTRA_PRICE = 0.25;
  const PF_FLOOR = 0.48; // Estimated floor price
  
  // Capital Agent Stats
  const AGENT_04_PF_HOLDINGS = 1250000;
  const BONUS_POOL_MTRA = 45000;
  const CURRENT_BONUS_RATE = 8.5; // 8.5% Bonus on purchases

  // Wealth Calc
  const liquidValue = user.mtraBalance * MTRA_PRICE;
  const stakedValue = user.stakedMtra * MTRA_PRICE;
  const frozenValue = user.pfBalance * PF_FLOOR;
  const totalNetWorth = liquidValue + stakedValue + frozenValue;

  // Buy Calc
  const inputUsd = parseFloat(buyAmount || '0');
  const baseMtra = inputUsd / MTRA_PRICE;
  const bonusMtra = baseMtra * (CURRENT_BONUS_RATE / 100);
  const totalMtra = baseMtra + bonusMtra;

  const handleSend = () => {
    if (!sendAddress || !sendAmount) return;
    setIsSending(true);
    // Simulate Blockchain Transaction
    setTimeout(() => {
      setIsSending(false);
      setShowSendModal(false);
      setSendAddress('');
      setSendAmount('');
      alert(`TRANSACTION BROADCASTED\n\nSent ${sendAmount} MTRA to ${sendAddress}\n\nView on PolygonScan.`);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* 1. NET WORTH CARD */}
      <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative z-10 text-center space-y-2">
           <p className="text-xs font-mono text-slate-400 tracking-widest">ESTIMATED NET WORTH</p>
           <h1 className="text-4xl md:text-5xl font-display font-bold text-white tabular-nums">
             ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
           </h1>
           <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-mint-900/30 border border-mint-500/30 text-mint-400 text-xs font-bold">
              <TrendingUp size={12} />
              <span>+12.4% THIS MONTH</span>
           </div>
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-3 gap-3 mt-8">
           <button 
             onClick={() => setShowBuyModal(true)}
             className="flex items-center justify-center gap-2 bg-phoenix-600 hover:bg-phoenix-500 text-black py-3 rounded-lg font-bold font-display text-sm transition-transform hover:scale-[1.02] shadow-[0_0_15px_rgba(249,115,22,0.3)]"
           >
              <Zap size={16} fill="currentColor" /> BUY
           </button>
           <button 
             onClick={() => setShowSendModal(true)}
             className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold font-display text-sm transition-transform hover:scale-[1.02] border border-slate-600"
           >
              <Send size={16} /> SEND
           </button>
           <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold font-display text-sm transition-transform hover:scale-[1.02] border border-slate-600">
              <ArrowDownLeft size={16} /> RECEIVE
           </button>
        </div>
      </div>

      {/* 2. AGENT 04 (CAPITAL MINING) VISUALIZATION */}
      <div className="glass-panel p-4 rounded-xl border border-phoenix-500/30 bg-gradient-to-br from-orange-900/10 to-transparent relative overflow-hidden">
         <div className="flex justify-between items-start mb-3 relative z-10">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-phoenix-500 rounded-lg text-black">
                  <Crown size={20} fill="currentColor" />
               </div>
               <div>
                  <h2 className="text-lg font-display font-bold text-white tracking-wide">AGENT 04 (CAPITAL)</h2>
                  <p className="text-[10px] text-phoenix-300/80 font-mono uppercase">Buyer Bonus Generator</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-slate-400 font-mono mb-1">PF POSITION</p>
               <p className="text-xl font-display font-bold text-white tabular-nums">{(AGENT_04_PF_HOLDINGS / 1000000).toFixed(2)}M PF</p>
            </div>
         </div>

         {/* The 50/50 Reactor */}
         <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 relative">
            <div className="flex items-center justify-between text-[10px] font-mono mb-2">
               <span className="text-slate-400">YIELD STRATEGY:</span>
               <div className="flex items-center gap-1 text-phoenix-400 font-bold">
                  <RefreshCw size={10} className="animate-spin-slow" />
                  <span>RECYCLING SWEAT</span>
               </div>
            </div>
            
            <div className="flex gap-2">
               {/* 50% Reinvest */}
               <div className="flex-1 bg-slate-800/50 border border-slate-700 p-2 rounded flex flex-col items-center justify-center">
                   <div className="flex items-center gap-1 mb-1">
                      <TrendingUp size={12} className="text-blue-400"/>
                      <span className="text-[9px] text-blue-400 font-bold">50% REINVEST</span>
                   </div>
                   <span className="text-[9px] font-mono text-slate-500">BUYS MORE PF</span>
               </div>

               {/* 50% Buyer Bonus */}
               <div className="flex-1 bg-phoenix-900/20 border border-phoenix-500/30 p-2 rounded flex flex-col items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-phoenix-500/5 group-hover:bg-phoenix-500/10 transition-colors"></div>
                   <div className="flex items-center gap-1 mb-1">
                      <Zap size={12} className="text-phoenix-400"/>
                      <span className="text-[9px] text-phoenix-400 font-bold">50% BONUS</span>
                   </div>
                   <span className="text-[9px] font-mono text-white">PAID TO BUYERS</span>
               </div>
            </div>
         </div>
      </div>

      {/* 3. TABS */}
      <div className="flex border-b border-slate-800">
         <button 
           onClick={() => setActiveTab('ASSETS')}
           className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors ${activeTab === 'ASSETS' ? 'text-white border-b-2 border-mint-500' : 'text-slate-500 hover:text-slate-300'}`}
         >
           ASSET ALLOCATION
         </button>
         <button 
           onClick={() => setActiveTab('HISTORY')}
           className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors ${activeTab === 'HISTORY' ? 'text-white border-b-2 border-mint-500' : 'text-slate-500 hover:text-slate-300'}`}
         >
           LEDGER
         </button>
      </div>

      {/* 4. CONTENT */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20">
         
         {activeTab === 'ASSETS' && (
            <div className="space-y-4">
               
               {/* LIQUID MTRA */}
               <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-mint-500/20 flex items-center justify-center text-mint-500">
                        <Wallet size={20} />
                     </div>
                     <div>
                        <h3 className="font-bold text-white">Liquid MTRA</h3>
                        <p className="text-xs text-slate-500 font-mono">Available to Trade</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-display font-bold text-lg text-white">{user.mtraBalance.toLocaleString()}</p>
                     <p className="text-xs text-slate-500 font-mono">${liquidValue.toLocaleString()}</p>
                  </div>
               </div>

               {/* WITHDRAWAL LIMIT INDICATOR */}
               <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={16} className="text-green-500" />
                     <span className="text-xs font-mono text-slate-400">WITHDRAWAL LIMIT (TIER 3)</span>
                  </div>
                  <span className="text-xs font-bold text-white">UNLIMITED</span>
               </div>

               {/* STAKED */}
               <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                        <Lock size={20} />
                     </div>
                     <div>
                        <h3 className="font-bold text-white">Staked Vaults</h3>
                        <p className="text-xs text-slate-500 font-mono">Earning Yield</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-display font-bold text-lg text-white">{user.stakedMtra.toLocaleString()}</p>
                     <p className="text-xs text-slate-500 font-mono">${stakedValue.toLocaleString()}</p>
                  </div>
               </div>

               {/* PERMAFROST */}
               <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                        <Snowflake size={20} />
                     </div>
                     <div>
                        <h3 className="font-bold text-white">Permafrost (PF)</h3>
                        <p className="text-xs text-slate-500 font-mono">Locked Forever</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-display font-bold text-lg text-white">{user.pfBalance.toLocaleString()}</p>
                     <p className="text-xs text-slate-500 font-mono">~${frozenValue.toLocaleString()}</p>
                  </div>
               </div>

            </div>
         )}

         {activeTab === 'HISTORY' && (
            <div className="space-y-2">
               {MOCK_HISTORY.map((tx) => (
                  <div key={tx.id} className="p-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded bg-slate-800 text-xs font-bold ${
                           tx.type === 'MINT' ? 'text-mint-500' : 
                           tx.type === 'FREEZE' ? 'text-blue-500' : 'text-yellow-500'
                        }`}>
                           {tx.type}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-200">{tx.amount} {tx.token}</p>
                           <p className="text-xs text-slate-500 font-mono">{tx.date}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-900/50">
                           {tx.status}
                        </span>
                        <ExternalLink size={12} className="text-slate-600" />
                     </div>
                  </div>
               ))}
               <div className="pt-4 text-center">
                  <button className="text-xs text-mint-500 hover:text-mint-400 flex items-center justify-center gap-1 w-full">
                     VIEW ON POLYGONSCAN <ExternalLink size={10} />
                  </button>
               </div>
            </div>
         )}
      </div>

      {/* CAPITAL MINING (BUY) MODAL */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="w-full max-w-md bg-slate-950 rounded-2xl border border-phoenix-500/50 shadow-[0_0_50px_rgba(249,115,22,0.2)] animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0">
                 <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <Zap className="text-phoenix-500" size={20} fill="currentColor" /> CAPITAL MINING
                 </h2>
                 <button onClick={() => setShowBuyModal(false)} className="text-slate-500 hover:text-white">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-6 space-y-6">
                 
                 {/* Payment Method */}
                 <div className="grid grid-cols-3 gap-2">
                    {['USDC', 'ETH', 'CARD'].map(m => (
                       <button
                         key={m}
                         onClick={() => setPaymentMethod(m as any)}
                         className={`py-3 rounded-lg text-xs font-bold font-mono transition-colors border ${
                            paymentMethod === m 
                            ? 'bg-phoenix-500 text-black border-phoenix-500' 
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                         }`}
                       >
                          {m}
                       </button>
                    ))}
                 </div>

                 {/* Input */}
                 <div className="space-y-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                       <label className="text-xs text-slate-500 font-mono">SPEND AMOUNT ({paymentMethod})</label>
                       <div className="flex items-center gap-2">
                          <span className="text-slate-500">$</span>
                          <input 
                            type="number" 
                            autoFocus
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                            className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none placeholder-slate-700"
                            placeholder="0.00"
                          />
                       </div>
                    </div>

                    <div className="bg-mint-900/10 p-4 rounded-xl border border-mint-500/30 space-y-3">
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-mint-500 font-mono">BASE RECEIVE</span>
                          <span className="text-white font-bold">{baseMtra.toLocaleString(undefined, { maximumFractionDigits: 2 })} MTRA</span>
                       </div>
                       
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-phoenix-400 font-mono flex items-center gap-1">
                             <Zap size={10} fill="currentColor" /> AGENT 04 BONUS (+{CURRENT_BONUS_RATE}%)
                          </span>
                          <span className="text-phoenix-400 font-bold">+{bonusMtra.toLocaleString(undefined, { maximumFractionDigits: 2 })} MTRA</span>
                       </div>
                       
                       <div className="border-t border-mint-500/20 pt-2 flex justify-between items-center">
                          <span className="text-sm font-bold text-white">TOTAL</span>
                          <div className="text-right">
                             <span className="text-2xl font-bold text-mint-400 font-display block">
                                {totalMtra.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                             </span>
                             <span className="text-[10px] text-mint-600 font-mono uppercase">MTRA TO WALLET</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Fee Label */}
                 <div className="flex justify-between items-center text-xs bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400">PROTOCOL FEE:</span>
                    <span className="text-mint-500 font-bold flex items-center gap-1">
                       <ShieldCheck size={12} /> SPONSORED (0%)
                    </span>
                 </div>

                 <button className="w-full py-4 bg-phoenix-600 hover:bg-phoenix-500 text-black font-display font-bold text-xl rounded-xl shadow-lg transition-colors">
                    MINT & DEPOSIT
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* SEND (WITHDRAW) MODAL */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="w-full max-w-md bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                 <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <Send size={20} className="text-white" /> SEND MTRA
                 </h2>
                 <button onClick={() => setShowSendModal(false)} className="text-slate-500 hover:text-white">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-6 space-y-6">
                 
                 <div className="bg-yellow-900/10 border border-yellow-500/20 p-3 rounded-lg text-xs text-yellow-200/80 font-mono">
                    <p className="flex items-center gap-2 mb-1 font-bold"><AlertTriangle size={12}/> ON-CHAIN TRANSACTION</p>
                    <p>You are withdrawing MTRA to an external Polygon Wallet. Ensure the address is correct.</p>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <label className="text-xs text-slate-500 font-mono">RECIPIENT ADDRESS (POLYGON)</label>
                       <input 
                         type="text" 
                         value={sendAddress}
                         onChange={(e) => setSendAddress(e.target.value)}
                         className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-mint-500 focus:outline-none font-mono text-sm"
                         placeholder="0x..."
                       />
                    </div>

                    <div>
                       <label className="text-xs text-slate-500 font-mono">AMOUNT (MAX: {user.mtraBalance})</label>
                       <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-mint-500 focus:outline-none font-bold"
                            placeholder="0.00"
                          />
                          <span className="text-mint-500 font-bold">MTRA</span>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={handleSend}
                   disabled={isSending || !sendAddress || !sendAmount}
                   className="w-full py-4 bg-white hover:bg-slate-200 text-black font-display font-bold text-xl rounded-xl shadow-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                    {isSending ? 'BROADCASTING...' : 'CONFIRM WITHDRAWAL'}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
