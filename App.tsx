
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, UserStats, TreasuryData, AppLifecycle, Game, GlobalSessionState, SessionStatus } from './types';
import { MainMenu } from './components/Dashboard';
import { SplashScreen, LoginScreen, StartupAds } from './components/EntryFlow';
import { MiningInterface } from './components/MiningInterface';
import { GameRoom } from './components/GameRoom';
import { MOCK_GAMES } from './lib/content-api';
import { PFSwap } from './components/PFSwap';
import { TreasuryInterface } from './components/TreasuryInterface';
import { StakingInterface } from './components/StakingInterface';
import { PermafrostInterface } from './components/PermafrostInterface';
import { WalletInterface } from './components/WalletInterface';
import { ProfileInterface } from './components/ProfileInterface';
import { ArrowLeft } from 'lucide-react';

// Mock Data Initial State
const INITIAL_USER: UserStats = {
  username: undefined,
  mtraBalance: 1250.50,
  pfBalance: 5000,
  stakedMtra: 2500,
  legacyStatus: true,
  tier: 'Diamond',
  sessionCount: 142
};

const INITIAL_TREASURY: TreasuryData = {
  warChestBalance: 14500200, // $14.5M
  discoveryHashRate: 0.003,
  circulatingSupply: 20000000,
  lockedSupply: 45000000,
  burnedSupply: 5000000,
  backingRatio: 0.72
};

const INITIAL_SESSION_STATE: GlobalSessionState = {
  isActive: false,
  houseAdsWatched: 0,
  miningAdsWatched: 0,
  currentEarnings: 0,
  sessionId: null,
  activeGameId: 'game_001',
  loopElapsed: 0,
  loopStatus: SessionStatus.IDLE
};

const App: React.FC = () => {
  // --- APP LIFECYCLE ---
  const [lifecycle, setLifecycle] = useState<AppLifecycle>(AppLifecycle.SPLASH);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // --- GLOBAL PERSISTENT STATE ---
  const [user, setUser] = useState<UserStats>(INITIAL_USER);
  const [activeGame, setActiveGame] = useState<Game>(MOCK_GAMES[0]); // Default to "Neon Stack"
  const [sessionState, setSessionState] = useState<GlobalSessionState>(INITIAL_SESSION_STATE);
  
  // --- ANTI-AFK LOGIC ---
  const [lastActivity, setLastActivity] = useState(Date.now());
  const TIMEOUT_MS = 10 * 60 * 1000; // 10 Minutes

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    const interval = setInterval(() => {
      // Logic: Only logout if NOT in Splash/Login AND NOT in Marketplace
      if (lifecycle !== AppLifecycle.SPLASH && lifecycle !== AppLifecycle.LOGIN) {
        
        // MARKETPLACE EXCEPTION: Bots/Idlers allowed (30 min logic handled inside component)
        if (currentView === ViewState.MARKETPLACE) {
          return; 
        }

        if (Date.now() - lastActivity > TIMEOUT_MS) {
          console.log("AFK Detected - Logging out");
          setLifecycle(AppLifecycle.LOGIN);
          setCurrentView(ViewState.DASHBOARD);
          setSessionState(INITIAL_SESSION_STATE); // Reset session on logout
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearInterval(interval);
    };
  }, [lastActivity, lifecycle, resetTimer, currentView]);


  // --- HANDLERS ---
  const handleLogin = useCallback((isGuest: boolean) => {
    if (isGuest) {
      setUser(prev => ({ ...prev, username: 'GUEST_USER_01' }));
    } else {
      setUser(prev => ({ ...prev, username: 'GOOGLE_USER' })); // Simulating SSO name
    }
    setLifecycle(AppLifecycle.ENTRY_ADS);
  }, []);

  const handleLogout = useCallback(() => {
    setLifecycle(AppLifecycle.LOGIN);
    setCurrentView(ViewState.DASHBOARD);
    setSessionState(INITIAL_SESSION_STATE);
    setUser(INITIAL_USER);
  }, []);

  const handleAdsComplete = useCallback(() => {
    setLifecycle(AppLifecycle.MAIN_MENU);
  }, []);

  const handleNavigate = useCallback((view: ViewState) => {
    setCurrentView(view);
    setLifecycle(AppLifecycle.IN_VIEW);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setCurrentView(ViewState.DASHBOARD);
    setLifecycle(AppLifecycle.MAIN_MENU);
  }, []);

  const handleSessionComplete = useCallback((earnedAmount: number) => {
    setUser(prev => ({
      ...prev,
      mtraBalance: prev.mtraBalance + earnedAmount,
      sessionCount: prev.sessionCount + 1
    }));
  }, []);

  const handleSelectGame = useCallback((game: Game) => {
    setActiveGame(game);
  }, []);

  const updateSessionState = useCallback((newState: Partial<GlobalSessionState>) => {
    setSessionState(prev => ({ ...prev, ...newState }));
  }, []);

  // --- WALLET UPDATES ---
  const updateWalletBalance = useCallback((amountChange: number) => {
    setUser(prev => ({ 
      ...prev, 
      mtraBalance: prev.mtraBalance + amountChange,
      // If negative change (staking), add to staked balance
      stakedMtra: amountChange < 0 ? prev.stakedMtra + Math.abs(amountChange) : prev.stakedMtra
    }));
  }, []);

  const handlePfConversion = useCallback((mtraDeducted: number, pfAdded: number) => {
    setUser(prev => ({ 
      ...prev, 
      mtraBalance: prev.mtraBalance - mtraDeducted,
      pfBalance: prev.pfBalance + pfAdded
    }));
  }, []);

  // --- RENDER CONTENT BASED ON LIFECYCLE ---
  if (lifecycle === AppLifecycle.SPLASH) {
    return <SplashScreen onComplete={() => setLifecycle(AppLifecycle.LOGIN)} />;
  }

  if (lifecycle === AppLifecycle.LOGIN) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (lifecycle === AppLifecycle.ENTRY_ADS) {
    return <StartupAds onComplete={handleAdsComplete} />;
  }

  // --- MAIN APP RENDER ---
  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-mint-500/30 selection:text-white">
      
      {/* CENTERING CONTAINER - FORCES MOBILE WIDTH ON DESKTOP */}
      <main className="min-h-screen max-w-md mx-auto bg-dark-950 shadow-2xl border-x border-slate-800 flex flex-col relative">
        
        {/* TOP BAR */}
        {lifecycle === AppLifecycle.IN_VIEW && (
          <div className="bg-dark-950/95 backdrop-blur border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center gap-4">
             <button onClick={handleBackToMenu} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                <ArrowLeft size={20} className="text-white" />
             </button>
             <div className="flex flex-col">
                <h2 className="font-display font-bold text-xl text-white tracking-wide leading-none">
                  {currentView.replace('_', ' ')}
                </h2>
                {currentView === ViewState.MINING && sessionState.isActive && (
                   <span className="text-[10px] font-mono text-mint-500">SESSION ACTIVE • {sessionState.miningAdsWatched}/10</span>
                )}
             </div>
          </div>
        )}

        <div className={`p-4 flex-1 flex flex-col ${lifecycle === AppLifecycle.MAIN_MENU ? 'pt-0' : ''}`}>
          
          {/* MAIN MENU */}
          {lifecycle === AppLifecycle.MAIN_MENU && (
             <MainMenu 
                userStats={user} 
                treasuryData={INITIAL_TREASURY} 
                onNavigate={handleNavigate} 
             />
          )}

          {/* SUB-VIEWS */}
          {lifecycle === AppLifecycle.IN_VIEW && (
            <div className="flex-1 flex flex-col h-full">
              {currentView === ViewState.MINING && (
                <MiningInterface 
                  activeGame={activeGame}
                  sessionState={sessionState}
                  userSessionCount={user.sessionCount}
                  discoveryRate={INITIAL_TREASURY.discoveryHashRate}
                  updateSessionState={updateSessionState}
                  onSessionComplete={handleSessionComplete} 
                />
              )}
              {currentView === ViewState.GAMEROOM && (
                <GameRoom 
                  activeGame={activeGame} 
                  onSelectGame={handleSelectGame} 
                />
              )}
              {currentView === ViewState.MARKETPLACE && <PFSwap />}
              {currentView === ViewState.TREASURY && (
                 <TreasuryInterface data={INITIAL_TREASURY} />
              )}
              {currentView === ViewState.STAKING && (
                 <StakingInterface 
                   userBalance={user.mtraBalance} 
                   onUpdateBalance={updateWalletBalance} 
                 />
              )}
              {currentView === ViewState.PERMAFROST && (
                <PermafrostInterface 
                  userBalance={user.mtraBalance}
                  userLegacy={user.legacyStatus}
                  onConvert={handlePfConversion}
                />
              )}
              {currentView === ViewState.WALLET && (
                <WalletInterface user={user} />
              )}
              {currentView === ViewState.PROFILE && (
                <ProfileInterface user={user} onLogout={handleLogout} />
              )}
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default App;
