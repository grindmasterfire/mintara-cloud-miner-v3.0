
import React, { useState, useEffect, useRef } from 'react';
import { SessionStatus, SessionType, Game, GlobalSessionState } from '../types';
import { MiningAPI } from '../lib/mining-api';
import { ZennerVisualizer } from './ZennerVisualizer';
import { 
  Play, 
  Zap, 
  Clock, 
  Tv, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
  Eye,
  Hash,
  Trophy,
  X,
  Crown,
  RefreshCw,
  TrendingUp,
  Pickaxe,
  Coins,
  ArrowRightLeft,
  Activity,
  Wifi,
  Maximize2,
  RotateCcw
} from 'lucide-react';

interface MiningInterfaceProps {
  activeGame: Game;
  sessionState: GlobalSessionState;
  userSessionCount: number;
  discoveryRate: number;
  updateSessionState: (newState: Partial<GlobalSessionState>) => void;
  onSessionComplete: (earnedMtra: number) => void;
}

export const MiningInterface: React.FC<MiningInterfaceProps> = ({ 
  activeGame, 
  sessionState, 
  userSessionCount,
  discoveryRate,
  updateSessionState,
  onSessionComplete 
}) => {
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.IDLE);
  const [showAgentModal, setShowAgentModal] = useState(false);
  
  // Local Timer State (resets per loop)
  const [elapsed, setElapsed] = useState(0);
  const [resumeCountdown, setResumeCountdown] = useState(3);
  const [iframeKey, setIframeKey] = useState(0); // Used to force reload the game container
  
  // DETECT MODE: ZENNER vs MINING
  const isZenner = activeGame.category === 'Zenner';
  // PRODUCTION TIMING: 1800s (30 min) Zenner, 180s (3 min) Mining
  // TESTING TIMING: 10s Zenner, 5s Mining
  const MINING_LOOP_DURATION = isZenner ? 10 : 5; 
  
  const HOUSE_ADS_REQUIRED = 2;
  const MINING_ADS_REQUIRED = 10;
  
  // Agent 03 Stats (Mock)
  const AGENT_03_PF_HOLDINGS = 1850000;
  const AGENT_SUBSIDY_RATE = 15.5; // % of rate funded by agent

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- INITIALIZATION CHECK ---
  useEffect(() => {
    // If the session is already active in global state, skip the intro
    if (sessionState.isActive) {
      if (sessionState.houseAdsWatched < HOUSE_ADS_REQUIRED) {
        setStatus(SessionStatus.HOUSE_ADS);
        simulateAd(true);
      } else {
        // If we are returning, we resume the loop
        setStatus(SessionStatus.ACTIVE_LOOP);
        startLoopTimer();
      }
    }
  }, []);

  // --- LOGIC: START / RESUME ---

  const handleEngage = async () => {
    setStatus(SessionStatus.INITIALIZING);
    
    // 1. Check if we need to start a new backend session
    let currentId = sessionState.sessionId;
    if (!currentId) {
      try {
        currentId = await MiningAPI.startSession();
        updateSessionState({ 
          sessionId: currentId, 
          isActive: true 
        });
      } catch (e) {
        console.error("Start failed", e);
        setStatus(SessionStatus.IDLE);
        return;
      }
    }

    // 2. Determine next step based on "Churn Tax"
    if (sessionState.houseAdsWatched < HOUSE_ADS_REQUIRED) {
      setTimeout(() => {
        setStatus(SessionStatus.HOUSE_ADS);
        simulateAd(true);
      }, 1000);
    } else {
      setTimeout(() => {
        setStatus(SessionStatus.ACTIVE_LOOP);
        startLoopTimer();
      }, 1000);
    }
  };

  const handleReloadGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIframeKey(prev => prev + 1);
  };

  // --- LOGIC: AD SIMULATION ---

  const simulateAd = (isHouse: boolean) => {
    // TESTING: 3 Seconds per Ad
    const duration = 3000; 
    
    setTimeout(() => {
      if (isHouse) {
        const newCount = sessionState.houseAdsWatched + 1;
        updateSessionState({ houseAdsWatched: newCount });
        
        if (newCount < HOUSE_ADS_REQUIRED) {
          simulateAd(true); // Watch second house ad
        } else {
          setStatus(SessionStatus.ACTIVE_LOOP);
          startLoopTimer();
        }
      } else {
        // Mining Ad Complete -> Show Anti-AFK Button
        setStatus(SessionStatus.ANTI_AFK);
      }
    }, duration);
  };

  const handleMiningAdStart = () => {
    setStatus(SessionStatus.MINING_AD); // Transition to Ad View
    simulateAd(false);
  };

  const handleAntiAfkClick = () => {
    // 3-Second Buffer Logic
    setStatus(SessionStatus.RESUMING);
    setResumeCountdown(3);
    
    const countdown = setInterval(() => {
      setResumeCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleResumeGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResumeGame = async () => {
    if (!sessionState.sessionId) return;
    
    setStatus(SessionStatus.CLAIMING);
    
    // Call Backend to Mint Rewards
    const result = await MiningAPI.recordMiningAd(sessionState.sessionId);
    
    if (result.success) {
      const newEarnings = sessionState.currentEarnings + result.earnedMtra;
      const newCount = sessionState.miningAdsWatched + 1;
      
      updateSessionState({ 
        currentEarnings: newEarnings,
        miningAdsWatched: newCount
      });
      
      if (newCount >= MINING_ADS_REQUIRED) {
        setStatus(SessionStatus.COMPLETED);
        onSessionComplete(newEarnings);
        await MiningAPI.completeSession(sessionState.sessionId);
        updateSessionState({ isActive: false, sessionId: null }); // Reset global
      } else {
        setStatus(SessionStatus.ACTIVE_LOOP);
        setElapsed(0);
        startLoopTimer();
      }
    } else {
      alert(`Minting Failed: ${result.error}`);
      setStatus(SessionStatus.IDLE);
    }
  };

  // --- LOGIC: TIMER ---

  const startLoopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1; 
        
        if (next >= MINING_LOOP_DURATION) {
          clearInterval(timerRef.current!);
          handleMiningAdStart(); // Auto-trigger ad break logic
          return next;
        }
        return next;
      });
    }, 1000); // 1s tick for production accuracy
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // -- RENDERERS --

  // 1. THE BOT FILTER (ENTRY)
  if (status === SessionStatus.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="relative group cursor-pointer" onClick={handleEngage}>
          {/* Minimalist Ring - Removed Blob */}
          <div className="absolute inset-0 border-2 border-mint-500/30 rounded-full group-hover:border-mint-500 transition-colors duration-300"></div>
          <div className="absolute inset-2 border border-mint-500/10 rounded-full"></div>
          
          <div className="relative w-64 h-64 bg-dark-950 rounded-full flex flex-col items-center justify-center shadow-2xl group-hover:scale-95 transition-transform duration-200">
             <Play size={60} className="text-mint-500 ml-2 opacity-80 group-hover:opacity-100 transition-opacity" fill="currentColor" />
             <span className="mt-4 font-display font-bold text-lg text-white tracking-[0.3em]">ENGAGE</span>
          </div>
        </div>
        
        <div className="mt-12 text-center space-y-2">
           <h2 className="text-xl font-display font-bold text-slate-200">
             CARTRIDGE: <span className={isZenner ? "text-blue-400" : "text-mint-400"}>{activeGame.name.toUpperCase()}</span>
           </h2>
           <div className="flex items-center justify-center gap-2 text-slate-500 font-mono text-xs">
             <span>EST. YIELD: 0.12 MTRA</span>
             <span>•</span>
             <span>HASH VERIFIED</span>
           </div>
        </div>
      </div>
    );
  }

  // 2. THE SHELL UI (Shared Container)
  return (
    <div className="space-y-4 h-full flex flex-col">
      
      {/* COCKPIT HUD (PROMINENT STATS) - SERIOUS STYLE */}
      <div className="grid grid-cols-3 gap-2">
         {/* Earnings */}
         <div className="bg-slate-900 p-3 rounded border border-slate-800 flex flex-col items-center justify-center">
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Session Yield</span>
            <span className="text-xl font-display font-bold text-mint-400 tabular-nums">
              {sessionState.currentEarnings.toFixed(3)}
            </span>
            <span className="text-[9px] text-slate-600 font-mono">MTRA</span>
         </div>
         
         {/* Discovery Hash (AGENT 03 TRIGGER) */}
         <button 
           onClick={() => setShowAgentModal(true)}
           className="bg-slate-900 p-3 rounded border border-slate-800 flex flex-col items-center justify-center hover:border-phoenix-500/50 hover:bg-slate-800 transition-all group"
         >
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1 group-hover:text-phoenix-400">
               <Crown size={10} className="text-phoenix-500" /> AGENT 03
            </span>
            <span className="text-xl font-display font-bold text-white tabular-nums">
              ONLINE
            </span>
            <span className="text-[9px] text-phoenix-500 font-bold font-mono">
               {discoveryRate} SUBSIDY
            </span>
         </button>

         {/* Total Sessions */}
         <div className="bg-slate-900 p-3 rounded border border-slate-800 flex flex-col items-center justify-center">
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1">
               <Trophy size={10} /> Total Runs
            </span>
            <span className="text-xl font-display font-bold text-white tabular-nums">
              {userSessionCount}
            </span>
            <span className="text-[9px] text-slate-600 font-mono">COMPLETED</span>
         </div>
      </div>

      {/* STATUS BAR */}
      <div className="flex justify-between items-center bg-dark-900 p-2 px-4 rounded border border-slate-800">
         <div className="flex items-center gap-3">
             <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${status === SessionStatus.ACTIVE_LOOP ? 'bg-mint-500 animate-pulse' : 'bg-slate-600'}`}></div>
                <p className="text-[10px] text-slate-300 font-display tracking-wider">{activeGame.name.toUpperCase()}</p>
             </div>
         </div>
         
         <div className="flex items-center gap-4">
             {/* Agent Uplink */}
             <div className="flex items-center gap-1.5">
                <Activity size={10} className="text-phoenix-500" />
                <span className="text-[9px] font-mono text-slate-400 tracking-widest">AGENT 03</span>
             </div>

             {/* The Eye In The Sky */}
             <div className="flex items-center gap-1.5">
                 <Eye size={10} className="text-slate-600" />
                 <span className="text-[9px] font-mono text-slate-600 tracking-widest">SECURE</span>
             </div>
         </div>
      </div>

      {/* MAIN CONTAINER (THE SECURE FRAME) */}
      <div className="flex-1 bg-black rounded border border-slate-800 relative overflow-hidden flex flex-col">
         
         {/* Game Header (Browser Controls) */}
         {(status === SessionStatus.ACTIVE_LOOP || status === SessionStatus.MINING_AD) && (
            <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 z-20">
               <div className="flex items-center gap-2 text-slate-500">
                  <div className="flex gap-1">
                     <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                     <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                     <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                  </div>
                  <div className="h-3 w-[1px] bg-slate-800 mx-1"></div>
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                     <Lock size={8} /> 
                     <span className="truncate max-w-[100px]">mintara://arcade/{activeGame.id}</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[9px] font-mono text-mint-500">
                     <Wifi size={10} />
                     <span>LINK_OK</span>
                  </div>
                  <button 
                     onClick={handleReloadGame}
                     className="text-slate-500 hover:text-white transition-colors" 
                     title="Reload Cartridge"
                  >
                     <RotateCcw size={12} />
                  </button>
               </div>
            </div>
         )}

         {/* CONTENT AREA */}
         <div className="flex-1 relative flex items-center justify-center bg-slate-950">
            
            {/* Background Grid - Subtle */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
                style={{ 
                  backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
                  backgroundSize: '20px 20px' 
                }}>
            </div>

            {/* A. INITIALIZING */}
            {status === SessionStatus.INITIALIZING && (
               <div className="text-mint-500 font-mono text-xs tracking-widest animate-pulse">INITIALIZING PROTOCOL...</div>
            )}

            {/* B. HOUSE ADS */}
            {status === SessionStatus.HOUSE_ADS && (
               <div className="relative z-20 text-center space-y-6 w-full max-w-md animate-in fade-in">
                 <Tv size={48} className="mx-auto text-phoenix-500" />
                 <h3 className="text-xl font-display text-white font-bold tracking-widest">CHURN TAX</h3>
                 <p className="font-mono text-xs text-slate-500">PROTOCOL SUPPORT • AD {sessionState.houseAdsWatched} / {HOUSE_ADS_REQUIRED}</p>
                 <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-phoenix-500 animate-[width_3s_linear]"></div>
                 </div>
               </div>
            )}

            {/* C. ACTIVE GAME / ZENNER */}
            {status === SessionStatus.ACTIVE_LOOP && (
               <div key={iframeKey} className="w-full h-full animate-in fade-in">
                  {isZenner ? (
                    <ZennerVisualizer frequencyHash={activeGame.hash} isActive={true} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      {/* MOCK IFRAME CONTENT */}
                      <div className="text-5xl mb-6 opacity-80 animate-bounce">{activeGame.thumbnail}</div>
                      <div className="space-y-2 text-center">
                         <p className="font-display font-bold text-lg text-white tracking-widest">{activeGame.name.toUpperCase()}</p>
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-mint-900/20 border border-mint-500/20 text-mint-400 text-[10px] font-mono">
                            <Activity size={10} className="animate-pulse" />
                            GAME LOOP ACTIVE
                         </div>
                      </div>
                      
                      <p className="absolute bottom-4 text-[9px] font-mono text-slate-600">
                         CONTENT HASH: {activeGame.hash}
                      </p>
                    </div>
                  )}
               </div>
            )}

            {/* D. MINING AD */}
            {status === SessionStatus.MINING_AD && (
               <div className="relative z-20 text-center space-y-6 w-full max-w-sm px-6">
                 <div className="w-full aspect-video bg-slate-900 rounded border border-slate-800 flex items-center justify-center shadow-2xl">
                    <div className="text-center">
                       <Tv size={32} className="mx-auto text-slate-600 mb-2" />
                       <p className="text-slate-500 font-mono text-xs">ADVERTISEMENT FEED</p>
                    </div>
                 </div>
                 <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-mint-500 animate-[width_3s_linear]"></div>
                 </div>
               </div>
            )}

            {/* E. ANTI-AFK CHECK (Commitment Check) */}
            {status === SessionStatus.ANTI_AFK && (
               <div className="relative z-30 text-center animate-in zoom-in duration-200">
                  <button 
                    onClick={handleAntiAfkClick}
                    className="px-8 py-4 bg-mint-600 hover:bg-mint-500 text-black font-display font-bold text-lg tracking-widest rounded transition-transform active:scale-95 flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  >
                    <ShieldCheck size={20} />
                    CONTINUE
                  </button>
                  <p className="mt-4 text-slate-500 font-mono text-[10px]">CONFIRM PRESENCE</p>
               </div>
            )}

            {/* F. RESUMING BUFFER */}
            {status === SessionStatus.RESUMING && (
               <div className="text-center">
                  <div className="text-6xl font-display font-bold text-white animate-pulse">{resumeCountdown}</div>
                  <p className="mt-4 text-mint-500 font-mono text-[10px] tracking-[0.2em]">SYNCING GAME STATE...</p>
               </div>
            )}

            {/* G. CLAIMING (Revenue Split Vis) */}
            {status === SessionStatus.CLAIMING && (
               <div className="w-full max-w-xs space-y-3 animate-in fade-in">
                  <div className="text-center mb-4">
                     <h3 className="text-white font-display font-bold text-sm tracking-wide">DISTRIBUTING YIELD</h3>
                  </div>
                  
                  {/* 60% User */}
                  <div className="flex items-center gap-3 text-xs">
                     <div className="w-8 text-right font-mono text-mint-500">60%</div>
                     <div className="flex-1 h-6 bg-slate-900 rounded border border-slate-800 flex items-center px-2 text-slate-300 font-bold">
                        WALLET
                     </div>
                  </div>

                  {/* 25% Permafrost */}
                  <div className="flex items-center gap-3 text-xs">
                     <div className="w-8 text-right font-mono text-blue-500">25%</div>
                     <div className="flex-1 h-6 bg-slate-900 rounded border border-slate-800 flex items-center px-2 text-slate-300 font-bold">
                        PERMAFROST
                     </div>
                  </div>

                  {/* 15% Staking */}
                  <div className="flex items-center gap-3 text-xs">
                     <div className="w-8 text-right font-mono text-yellow-500">15%</div>
                     <div className="flex-1 h-6 bg-slate-900 rounded border border-slate-800 flex items-center px-2 text-slate-300 font-bold">
                        STAKING
                     </div>
                  </div>
               </div>
            )}

            {/* H. COMPLETE */}
            {status === SessionStatus.COMPLETED && (
               <div className="text-center space-y-6">
                  <div className="inline-flex p-4 bg-mint-900/20 rounded-full border border-mint-500/30">
                     <CheckCircle2 size={48} className="text-mint-500" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-display font-bold text-white">SESSION COMPLETE</h2>
                     <p className="text-xs text-slate-400 font-mono mt-1">ALL BLOCKS MINED SUCCESSFULLY</p>
                  </div>
                  <button 
                    onClick={() => setStatus(SessionStatus.IDLE)}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono text-xs border border-slate-600"
                  >
                    RETURN TO BASE
                  </button>
               </div>
            )}
         </div>
      </div>

      {/* FOOTER TIMER / PROGRESS */}
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 bg-dark-900 p-2 rounded border border-slate-800">
          <span className="flex items-center gap-2 tabular-nums">
            <Clock size={10} className={isZenner ? "text-blue-400" : "text-mint-500"} />
            {Math.floor((MINING_LOOP_DURATION - elapsed) / 60)}:
            {((MINING_LOOP_DURATION - elapsed) % 60).toString().padStart(2, '0')}
          </span>
          <div className="flex gap-1">
             {Array.from({length: MINING_ADS_REQUIRED}).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-sm transition-colors duration-500 ${i < sessionState.miningAdsWatched ? (isZenner ? 'bg-blue-500' : 'bg-mint-500') : 'bg-slate-800'}`}
                />
             ))}
          </div>
       </div>

       {/* AGENT 03 MODAL */}
       {showAgentModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="w-full max-w-md bg-slate-950 rounded-xl border border-slate-800 shadow-2xl animate-in zoom-in-95">
              
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                 <h2 className="text-sm font-display font-bold text-white flex items-center gap-2">
                    <Zap className="text-phoenix-500" size={16} fill="currentColor" /> PROTOCOL STATUS
                 </h2>
                 <button onClick={() => setShowAgentModal(false)} className="text-slate-500 hover:text-white">
                    <X size={18} />
                 </button>
              </div>

              <div className="p-6">
                 {/* AGENT CARD - SERIOUS */}
                 <div className="p-4 rounded-lg border border-slate-700 bg-slate-900">
                    <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-phoenix-500 rounded text-black">
                             <Crown size={16} fill="currentColor" />
                          </div>
                          <div>
                             <h2 className="text-sm font-display font-bold text-white tracking-wide">AGENT 03 (ATTENTION)</h2>
                             <p className="text-[9px] text-slate-400 font-mono uppercase">Mining Rate Generator</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] text-slate-500 font-mono mb-1">POSITION</p>
                          <p className="text-lg font-display font-bold text-white tabular-nums">{(AGENT_03_PF_HOLDINGS / 1000000).toFixed(2)}M PF</p>
                       </div>
                    </div>

                    {/* THE PIPELINE INJECTOR (7.5% PROPS -> PF) */}
                    <div className="bg-slate-950 rounded p-2 border border-slate-800 mb-3">
                        <div className="flex items-center justify-between text-[9px] font-mono mb-2">
                           <span className="text-slate-500">INPUT SOURCE:</span>
                           <span className="text-yellow-500 font-bold">7.5% PROPS</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[9px] text-slate-400 font-mono">
                            <Coins size={10} className="text-yellow-600"/>
                            <span>USD</span>
                            <ArrowRightLeft size={8} />
                            <span>MINT</span>
                            <ArrowRightLeft size={8} />
                            <span className="text-blue-400 font-bold">PF</span>
                        </div>
                    </div>

                    {/* The 50/50 Reactor */}
                    <div className="bg-slate-950 rounded p-2 border border-slate-800">
                       <div className="flex items-center justify-between text-[9px] font-mono mb-2">
                          <span className="text-slate-500">YIELD STRATEGY:</span>
                          <div className="flex items-center gap-1 text-phoenix-500 font-bold">
                             <RefreshCw size={10} />
                             <span>RECYCLE</span>
                          </div>
                       </div>
                       
                       <div className="flex gap-2">
                          {/* 50% Reinvest */}
                          <div className="flex-1 bg-slate-900 border border-slate-800 p-2 rounded flex flex-col items-center justify-center">
                              <div className="flex items-center gap-1 mb-1">
                                 <TrendingUp size={10} className="text-blue-500"/>
                                 <span className="text-[9px] text-blue-500 font-bold">REINVEST</span>
                              </div>
                          </div>

                          {/* 50% Miner Payout */}
                          <div className="flex-1 bg-slate-900 border border-slate-800 p-2 rounded flex flex-col items-center justify-center">
                              <div className="flex items-center gap-1 mb-1">
                                 <Pickaxe size={10} className="text-phoenix-500"/>
                                 <span className="text-[9px] text-phoenix-500 font-bold">PAYOUT</span>
                              </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Explanation */}
                 <div className="mt-4 text-center">
                    <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                       CURRENT MINING RATE (0.012) IS <span className="text-white font-bold">SUBSIDIZED</span> BY AGENT YIELD.
                    </p>
                 </div>

              </div>
           </div>
        </div>
       )}
    </div>
  );
};
