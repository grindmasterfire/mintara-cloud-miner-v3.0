
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PFListing, ListingType } from '../types';
import { StartupAds } from './EntryFlow';
import { 
  ShieldCheck, 
  Clock, 
  AlertOctagon, 
  RefreshCw, 
  Power, 
  Plus, 
  X, 
  Bot, 
  Server,
  Trash2,
  Coins,
  Image as ImageIcon,
  Fuel,
  ArrowRight
} from 'lucide-react';

const MOCK_LISTINGS: PFListing[] = [
  { id: '1', seller: '0x3a...9f2', type: 'SELL', assetSymbol: 'PF', assetClass: 'PF', amount: 5000, priceSymbol: 'USDC', priceAmount: 2500, timelock: '1h', isWash: false, acceptsBots: true, status: 'ACTIVE' },
  { id: '2', seller: '0x7b...11c', type: 'SELL', assetSymbol: 'PF', assetClass: 'PF', amount: 10000, priceSymbol: 'ETH', priceAmount: 1.5, timelock: '24h', isWash: false, acceptsBots: false, status: 'ACTIVE' },
  { id: '3', seller: '0x88...aaf', type: 'BUY', assetSymbol: 'USDC', assetClass: 'CRYPTO', amount: 600, priceSymbol: 'PF', priceAmount: 1000, timelock: '5d', isWash: false, acceptsBots: true, status: 'ACTIVE' },
  { id: '4', seller: 'YOU', type: 'SELL', assetSymbol: 'PF', assetClass: 'PF', amount: 2500, priceSymbol: 'USDC', priceAmount: 1200, timelock: '30d', isWash: false, acceptsBots: true, status: 'ACTIVE' },
  { id: '5', seller: '0x99...bad', type: 'SELL', assetSymbol: 'BAYC #8812', assetClass: 'NFT', amount: 1, priceSymbol: 'PF', priceAmount: 50000, timelock: 'Instant', isWash: true, acceptsBots: true, status: 'ACTIVE' },
];

type SwapStatus = 'ENTRY_TOLL' | 'SWAP' | 'LOITERING_AD' | 'AFK_TIMEOUT';

export const PFSwap: React.FC = () => {
  // State Machine
  const [status, setStatus] = useState<SwapStatus>('ENTRY_TOLL');
  const [activeTab, setActiveTab] = useState<'MARKET' | 'MY_ORDERS'>('MARKET');
  
  // Timers
  const [timeSinceLastAd, setTimeSinceLastAd] = useState(0);
  const [timeSinceInteraction, setTimeSinceInteraction] = useState(0);

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [listings, setListings] = useState<PFListing[]>(MOCK_LISTINGS);

  // Form State
  const [orderType, setOrderType] = useState<ListingType>('SELL');
  const [assetType, setAssetType] = useState<'PF' | 'CRYPTO' | 'NFT'>('PF');
  const [formAmount, setFormAmount] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formSymbol, setFormSymbol] = useState('PF');
  const [formTargetSymbol, setFormTargetSymbol] = useState('USDC');
  const [formTimelock, setFormTimelock] = useState<'Instant'|'1h'|'24h'|'5d'|'30d'>('24h');
  const [acceptsBots, setAcceptsBots] = useState(true);

  // Fee Logic Check: Sponsered if PF or MTRA is involved
  const isMintaraTrade = useMemo(() => {
    const s1 = formSymbol?.toUpperCase() || '';
    const s2 = formTargetSymbol?.toUpperCase() || '';
    const type = assetType;
    return type === 'PF' || s1 === 'PF' || s2 === 'PF' || s1 === 'MTRA' || s2 === 'MTRA';
  }, [assetType, formSymbol, formTargetSymbol]);

  // --- INTERACTION HANDLERS (AFK RESET) ---
  const resetAfkTimer = useCallback(() => {
    setTimeSinceInteraction(0);
  }, []);

  useEffect(() => {
    if (status !== 'SWAP') return; // Only track while active

    // Loitering Timer (Runs every second)
    const loiterInterval = setInterval(() => {
      setTimeSinceLastAd(prev => {
        // 180 Seconds = 3 Minutes
        if (prev >= 180) {
          setStatus('LOITERING_AD');
          return 0;
        }
        return prev + 1;
      });

      setTimeSinceInteraction(prev => {
        // 1800 Seconds = 30 Minutes (Swap Specific AFK)
        if (prev >= 1800) {
          setStatus('AFK_TIMEOUT');
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    // Event Listeners for AFK Reset
    window.addEventListener('mousemove', resetAfkTimer);
    window.addEventListener('click', resetAfkTimer);
    window.addEventListener('keypress', resetAfkTimer);

    return () => {
      clearInterval(loiterInterval);
      window.removeEventListener('mousemove', resetAfkTimer);
      window.removeEventListener('click', resetAfkTimer);
      window.removeEventListener('keypress', resetAfkTimer);
    };
  }, [status, resetAfkTimer]);


  // --- HANDLERS ---
  const handleEntryComplete = () => {
    setStatus('SWAP');
    setTimeSinceLastAd(0);
    setTimeSinceInteraction(0);
  };

  const handleLoiterAdComplete = () => {
    setStatus('SWAP');
    setTimeSinceLastAd(0); // Reset loiter timer
  };

  const handleWakeUp = () => {
    setStatus('SWAP');
    setTimeSinceInteraction(0);
  };

  const handleCreateListing = () => {
     const newListing: PFListing = {
        id: Math.random().toString(36).substr(2, 9),
        seller: 'YOU',
        type: orderType,
        assetSymbol: formSymbol,
        assetClass: assetType === 'NFT' ? 'NFT' : (formSymbol === 'PF' ? 'PF' : 'CRYPTO'),
        amount: parseFloat(formAmount),
        priceSymbol: formTargetSymbol,
        priceAmount: parseFloat(formPrice),
        timelock: formTimelock,
        isWash: false,
        acceptsBots: acceptsBots,
        status: 'ACTIVE'
     };
     setListings([newListing, ...listings]);
     setShowCreateModal(false);
     setFormAmount('');
     setFormPrice('');
  };

  const handleCancelOrder = (id: string, amount: number) => {
    const penalty = amount * 0.01;
    if (confirm(`CANCELLATION PENALTY WARNING\n\nUnilateral cancellation incurs a 1% PENALTY sent to the War Chest.\n\nPenalty: ${penalty.toFixed(2)}\nRemaining Refund: ${(amount - penalty).toFixed(2)}\n\nConfirm Cancellation?`)) {
      setListings(prev => prev.filter(l => l.id !== id));
      alert(`${penalty.toFixed(2)} deducted and sent to War Chest.`);
    }
  };


  // --- RENDERS ---

  // 1. ENTRY TOLL (2 ADS)
  if (status === 'ENTRY_TOLL') {
    return (
      <StartupAds onComplete={handleEntryComplete} targetAdCount={2} />
    );
  }

  // 2. LOITERING TAX (1 AD)
  if (status === 'LOITERING_AD') {
    return (
      <StartupAds onComplete={handleLoiterAdComplete} targetAdCount={1} />
    );
  }

  // 3. AFK TIMEOUT (30 MIN)
  if (status === 'AFK_TIMEOUT') {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6">
         <Power size={64} className="text-slate-600" />
         <h2 className="text-2xl font-display font-bold text-white">SYSTEM IDLE</h2>
         <p className="text-slate-400 font-mono text-sm max-w-md text-center">
            MARKETPLACE CONNECTION PAUSED DUE TO INACTIVITY (30 MIN).
         </p>
         <button 
           onClick={handleWakeUp}
           className="px-8 py-3 bg-phoenix-600 hover:bg-phoenix-500 text-black font-bold font-display rounded transition-colors"
         >
           RECONNECT LINK
         </button>
      </div>
    );
  }

  // 4. MAIN SWAP INTERFACE
  return (
    <div className="space-y-6 animate-in fade-in relative h-full flex flex-col">
      
      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-mint-500">
           <p className="text-slate-400 text-sm font-mono mb-1">PF FLOOR PRICE</p>
           <h3 className="text-3xl font-display font-bold text-white">$0.48 <span className="text-sm font-normal text-mint-500">+2.4%</span></h3>
        </div>
        <div className="glass-panel p-6 rounded-xl border-l-4 border-phoenix-500">
           <p className="text-slate-400 text-sm font-mono mb-1">VOLUME (24H)</p>
           <h3 className="text-3xl font-display font-bold text-white">$124,500</h3>
        </div>
        <div className="glass-panel p-6 rounded-xl border-l-4 border-slate-500">
           <p className="text-slate-400 text-sm font-mono mb-1">TOTAL LISTED</p>
           <h3 className="text-3xl font-display font-bold text-white">450,200 PF</h3>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
        
        {/* TABS */}
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
           <button 
             onClick={() => setActiveTab('MARKET')}
             className={`px-4 py-2 rounded text-xs font-bold font-display tracking-wider transition-colors ${activeTab === 'MARKET' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
           >
             LIVE MARKET
           </button>
           <button 
             onClick={() => setActiveTab('MY_ORDERS')}
             className={`px-4 py-2 rounded text-xs font-bold font-display tracking-wider transition-colors ${activeTab === 'MY_ORDERS' ? 'bg-slate-800 text-mint-400' : 'text-slate-500 hover:text-slate-300'}`}
           >
             MY ORDERS
           </button>
        </div>

        <div className="flex gap-2">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-mint-600 hover:bg-mint-500 text-black font-bold rounded text-sm transition-colors shadow-lg shadow-mint-500/20 flex items-center gap-2"
            >
               <Plus size={16} /> NEW ORDER
            </button>
        </div>
      </div>

      {/* LISTINGS DISPLAY - MOBILE CARD / DESKTOP TABLE SWITCH */}
      <div className="flex-1 overflow-y-auto min-h-[400px]">
        
        {/* MOBILE CARD VIEW (< md) */}
        <div className="md:hidden space-y-4">
           {listings
             .filter(l => activeTab === 'MARKET' ? true : l.seller === 'YOU')
             .map((listing) => (
             <div key={listing.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.type === 'BUY' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                        {listing.type}
                      </span>
                      {listing.isWash && <AlertOctagon size={14} className="text-red-500" />}
                   </div>
                   <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-950 px-2 py-1 rounded">
                      <Clock size={12} />
                      {listing.timelock}
                   </div>
                </div>

                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
                      {listing.assetClass === 'PF' && <Coins size={16} className="text-blue-400" />}
                      {listing.assetClass === 'NFT' && <ImageIcon size={16} className="text-purple-400" />}
                      {listing.assetClass === 'CRYPTO' && <Coins size={16} className="text-gold-400" />}
                      {listing.amount.toLocaleString()} {listing.assetSymbol}
                   </div>
                   <ArrowRight size={16} className="text-slate-600" />
                   <div className="text-mint-400 font-mono font-bold">
                      {listing.priceAmount.toLocaleString()} <span className="text-xs text-slate-500">{listing.priceSymbol}</span>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                   <div className="flex items-center gap-2">
                      {listing.acceptsBots ? <Bot size={16} className="text-mint-500"/> : <Bot size={16} className="text-slate-700"/>}
                      <span className="text-xs text-slate-500 font-mono truncate max-w-[100px]">{listing.seller}</span>
                   </div>
                   
                   {listing.seller === 'YOU' ? (
                      <button 
                        onClick={() => handleCancelOrder(listing.id, listing.amount)}
                        className="px-3 py-1.5 bg-red-900/30 text-red-400 rounded text-xs font-bold"
                      >
                        CANCEL
                      </button>
                   ) : (
                      <button className="px-4 py-1.5 bg-slate-800 text-white rounded text-xs font-bold border border-slate-600">
                        {listing.type === 'BUY' ? 'SELL' : 'BUY'}
                      </button>
                   )}
                </div>
             </div>
           ))}
        </div>

        {/* DESKTOP TABLE VIEW (>= md) */}
        <div className="hidden md:block glass-panel rounded-xl overflow-hidden border border-slate-700">
          <table className="w-full text-left">
            <thead className="bg-slate-900/80 text-xs font-mono text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-md">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Price</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Timelock</th>
                <th className="p-3 text-center">API</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {listings
                .filter(l => activeTab === 'MARKET' ? true : l.seller === 'YOU')
                .map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-800/50 transition-colors group text-sm">
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${listing.type === 'BUY' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                      {listing.type}
                    </span>
                  </td>
                  <td className="p-3 font-display font-bold text-white">
                    <div className="flex items-center gap-2">
                       {listing.assetClass === 'PF' && <Coins size={16} className="text-blue-400" />}
                       {listing.assetClass === 'NFT' && <ImageIcon size={16} className="text-purple-400" />}
                       {listing.assetClass === 'CRYPTO' && <Coins size={16} className="text-gold-400" />}
                       {listing.amount.toLocaleString()} {listing.assetSymbol}
                    </div>
                  </td>
                  <td className="p-3 text-slate-300 font-mono">
                    {listing.priceAmount.toLocaleString()} <span className="text-xs text-slate-500">{listing.priceSymbol}</span>
                  </td>
                  <td className="p-3 font-mono text-slate-400 text-xs flex items-center gap-2 max-w-[100px] truncate">
                    {listing.isWash && <AlertOctagon size={14} className="text-red-500" title="Wash Trade Detected (5% Tax)" />}
                    {listing.seller}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-900 px-2 py-1 rounded w-fit">
                       <Clock size={12} />
                       {listing.timelock}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                     {listing.acceptsBots ? (
                        <div className="flex justify-center" title="API Gate Open">
                           <Bot size={16} className="text-mint-500" />
                        </div>
                     ) : (
                        <div className="flex justify-center" title="Manual Only">
                           <Bot size={16} className="text-slate-700" />
                        </div>
                     )}
                  </td>
                  <td className="p-3 text-right">
                    {listing.seller === 'YOU' ? (
                      <button 
                        onClick={() => handleCancelOrder(listing.id, listing.amount)}
                        className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-900 text-red-400 rounded text-xs font-bold transition-all inline-flex items-center gap-1"
                      >
                        <Trash2 size={12} /> CANCEL
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-slate-800 hover:bg-mint-600 hover:text-black border border-slate-600 hover:border-mint-500 text-white rounded text-sm font-bold transition-all inline-flex items-center gap-2">
                        <ShieldCheck size={16} />
                        {listing.type === 'BUY' ? 'SELL' : 'BUY'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 bg-slate-950 p-2 rounded">
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-phoenix-500" />
          <span>ESCROW SECURED • PF & MTRA DUTY FREE</span>
        </div>
        <div className="flex items-center gap-2">
           <RefreshCw size={12} className="animate-spin-slow" />
           <span>REFRESH IN {180 - timeSinceLastAd}s</span>
        </div>
      </div>

      {/* CREATE LISTING MODAL */}
      {showCreateModal && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="w-full max-w-lg bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
                 <h2 className="text-lg font-display font-bold text-white">CREATE ORDER</h2>
                 <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="p-6 space-y-6">
                 
                 {/* Buy/Sell Toggle */}
                 <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg">
                    <button 
                      onClick={() => setOrderType('BUY')}
                      className={`py-2 rounded font-bold transition-colors ${orderType === 'BUY' ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                       BUY (BID)
                    </button>
                    <button 
                      onClick={() => setOrderType('SELL')}
                      className={`py-2 rounded font-bold transition-colors ${orderType === 'SELL' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                       SELL (ASK)
                    </button>
                 </div>

                 {/* Asset Class */}
                 <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400">ASSET CLASS</label>
                    <div className="flex gap-2">
                       <button onClick={() => { setAssetType('PF'); setFormSymbol('PF'); }} className={`flex-1 py-2 border rounded text-xs font-bold ${assetType === 'PF' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-700 bg-slate-900 text-slate-400'}`}>PERMAFROST</button>
                       <button onClick={() => { setAssetType('CRYPTO'); setFormSymbol(''); }} className={`flex-1 py-2 border rounded text-xs font-bold ${assetType === 'CRYPTO' ? 'border-gold-500 bg-gold-500/10 text-gold-400' : 'border-slate-700 bg-slate-900 text-slate-400'}`}>CRYPTO</button>
                       <button onClick={() => { setAssetType('NFT'); setFormSymbol(''); }} className={`flex-1 py-2 border rounded text-xs font-bold ${assetType === 'NFT' ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-slate-700 bg-slate-900 text-slate-400'}`}>NFT</button>
                    </div>
                 </div>

                 {/* Asset Symbol Input (Conditional) */}
                 {assetType !== 'PF' && (
                   <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400">ASSET TICKER / NAME</label>
                      <input 
                        type="text"
                        value={formSymbol}
                        onChange={(e) => setFormSymbol(e.target.value.toUpperCase())}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-mint-500 focus:outline-none placeholder-slate-600 uppercase"
                        placeholder={assetType === 'CRYPTO' ? "ETH, BTC, MATIC..." : "BAYC #8812, PUNK..."}
                      />
                   </div>
                 )}

                 {/* Inputs */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-mono text-slate-400">AMOUNT ({formSymbol || '...' })</label>
                       <input 
                         type="number"
                         value={formAmount}
                         onChange={(e) => setFormAmount(e.target.value)}
                         className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-mint-500 focus:outline-none"
                         placeholder="0.00"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                          <label className="text-xs font-mono text-slate-400">PRICE</label>
                          <input 
                            type="text"
                            value={formTargetSymbol}
                            onChange={(e) => setFormTargetSymbol(e.target.value.toUpperCase())}
                            className="text-right bg-transparent border-b border-slate-700 text-xs font-bold text-mint-500 w-16 focus:outline-none focus:border-mint-500 placeholder-slate-600 uppercase"
                            placeholder="USDC"
                          />
                       </div>
                       <input 
                         type="number"
                         value={formPrice}
                         onChange={(e) => setFormPrice(e.target.value)}
                         className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-mint-500 focus:outline-none"
                         placeholder="0.00"
                       />
                    </div>
                 </div>

                 {/* Timelock Selection */}
                 <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-400">ESCROW TIMELOCK</label>
                    <div className="grid grid-cols-5 gap-1">
                       {(['Instant', '1h', '24h', '5d', '30d'] as const).map(t => (
                          <button
                            key={t}
                            onClick={() => setFormTimelock(t)}
                            className={`py-2 rounded border text-[10px] font-bold transition-colors ${
                               formTimelock === t 
                               ? 'bg-slate-800 border-mint-500 text-mint-500' 
                               : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                            }`}
                          >
                             {t}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* GAS / PROTOCOL FEE ESTIMATOR */}
                 <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 flex items-center gap-1"><Fuel size={12}/> NETWORK FEE</span>
                        {isMintaraTrade ? (
                           <span className="text-mint-500 font-bold bg-mint-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                              <ShieldCheck size={12} /> SPONSORED
                           </span>
                        ) : (
                           <span className="text-yellow-500 font-bold flex items-center gap-1">
                              ~$4.50 (USER PAYS)
                           </span>
                        )}
                     </div>
                     {!isMintaraTrade && (
                        <p className="text-[9px] text-slate-500 mt-1">
                           * Gas sponsored only for Mintara Ecosystem assets (PF & MTRA).
                        </p>
                     )}
                 </div>

                 {/* API GATE TOGGLE */}
                 <div className={`rounded-xl border p-4 transition-colors ${acceptsBots ? 'bg-mint-900/10 border-mint-500/50' : 'bg-red-900/10 border-red-500/30'}`}>
                    <div className="flex justify-between items-center mb-3">
                       <div className="flex items-center gap-2">
                          <Server size={18} className={acceptsBots ? "text-mint-500" : "text-red-500"} />
                          <span className="font-display font-bold text-white">API GATE</span>
                       </div>
                       
                       {/* Toggle Switch */}
                       <button 
                         onClick={() => setAcceptsBots(!acceptsBots)}
                         className={`w-12 h-6 rounded-full p-1 transition-colors ${acceptsBots ? 'bg-mint-500' : 'bg-slate-700'}`}
                       >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${acceptsBots ? 'translate-x-6' : 'translate-x-0'}`} />
                       </button>
                    </div>

                    <div className="flex items-start gap-3">
                       {acceptsBots ? (
                          <>
                             <Bot className="text-mint-500 shrink-0 mt-0.5" size={16} />
                             <div>
                                <p className="text-xs text-mint-400 font-bold mb-0.5">GATE OPEN</p>
                                <p className="text-[10px] text-slate-400 leading-tight">
                                   Order broadcast to API. High-frequency bots and algos can fill this.
                                </p>
                             </div>
                          </>
                       ) : (
                          <>
                             <ShieldCheck className="text-red-400 shrink-0 mt-0.5" size={16} />
                             <div>
                                <p className="text-xs text-red-400 font-bold mb-0.5">GATE CLOSED</p>
                                <p className="text-[10px] text-slate-400 leading-tight">
                                   API access blocked. Only human users can fill this order.
                                </p>
                             </div>
                          </>
                       )}
                    </div>
                 </div>

                 {/* Submit */}
                 <button 
                   onClick={handleCreateListing}
                   className="w-full py-4 bg-white hover:bg-slate-200 text-black font-display font-bold text-lg rounded-xl shadow-xl transition-colors"
                 >
                    PUBLISH {orderType} ORDER
                 </button>

              </div>
           </div>
        </div>
      )}

    </div>
  );
};
