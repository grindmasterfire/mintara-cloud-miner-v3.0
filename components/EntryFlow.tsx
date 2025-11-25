
import React, { useState, useEffect, useRef } from 'react';
import { Cpu, ShieldCheck, Tv, Fingerprint, Key, Mail, Terminal } from 'lucide-react';

// --- SPLASH SCREEN ---
export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    // Simulate initialization time
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-dark-950 flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-mint-500/20 blur-xl rounded-full animate-pulse"></div>
        <Cpu size={80} className="text-mint-500 relative z-10 animate-bounce" />
      </div>
      <h1 className="mt-8 text-2xl font-display font-bold text-white tracking-widest animate-pulse uppercase">
        The Mintara Project
      </h1>
      <p className="mt-2 text-mint-500/70 font-mono text-xs tracking-[0.2em]">INITIALIZING CLOUD MINER...</p>
      
      <div className="mt-12 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-mint-500 animate-[width_3s_ease-in-out]"></div>
      </div>
    </div>
  );
};

// --- LOGIN SCREEN ---
export const LoginScreen: React.FC<{ onLogin: (guest: boolean) => void }> = ({ onLogin }) => {
  return (
    <div className="fixed inset-0 bg-dark-950 flex flex-col items-center justify-center p-6 z-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] overflow-hidden">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl border border-slate-700">
        <div className="text-center">
          <div className="mx-auto bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mb-4 border border-slate-600 shadow-lg shadow-mint-500/10">
             <Fingerprint className="text-mint-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white uppercase">Mintara Cloud Miner</h2>
          <p className="text-slate-400 mt-2 text-xs font-mono">SECURE ACCESS NODE</p>
        </div>

        <div className="space-y-4 pt-4">
          {/* GOOGLE SSO BUTTON */}
          <button 
            onClick={() => onLogin(false)} // Simulating Google Login flow
            className="w-full bg-white hover:bg-slate-100 text-black py-4 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-3 shadow-xl group"
          >
            {/* Simple SVG for Google G Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="tracking-wide">Continue with Google</span>
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-dark-900/50 backdrop-blur text-slate-500 font-mono">PROTOCOL LINK</span>
            </div>
          </div>

          {/* DEV DOOR: GUEST PASS RESTORED */}
          <button 
            onClick={() => onLogin(true)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-lg font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-600"
          >
            <Terminal size={14} />
            GUEST PASS (DEV MODE)
          </button>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-600 leading-relaxed">
           By continuing, you agree to the <span className="text-slate-400 underline cursor-pointer">Terms of Service</span> & <span className="text-slate-400 underline cursor-pointer">Privacy Policy</span>.
           <br/>
           Protected by SuperClaude Security.
        </p>
      </div>
    </div>
  );
};

// --- MANDATORY HOUSE ADS (ATOMIC TIMER FIXED) ---
interface StartupAdsProps {
  onComplete: () => void;
  targetAdCount?: number; 
}

export const StartupAds: React.FC<StartupAdsProps> = ({ onComplete, targetAdCount = 2 }) => {
  const [adIndex, setAdIndex] = useState(1);
  const [progress, setProgress] = useState(0);
  
  // ATOMIC TIME REF: We use absolute timestamps to prevent "Drift" on mobile
  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const initializedRef = useRef(false);
  
  // HYPER-SPEED SETTINGS FOR TESTING (3 Seconds)
  const AD_DURATION_MS = 3000; 

  useEffect(() => {
    // Initialize Start Time ONCE
    if (!initializedRef.current) {
      startTimeRef.current = Date.now();
      initializedRef.current = true;
    }

    const totalDurationMs = targetAdCount * AD_DURATION_MS;

    const animate = () => {
      const now = Date.now();
      const elapsedMs = now - startTimeRef.current;

      // 1. Completion Check (Hard Stop)
      if (elapsedMs >= totalDurationMs) {
        onComplete();
        return; // Stop animation frame
      }

      // 2. Calculate Current Ad Logic
      // Math.floor(0 / 3000) + 1 = 1
      const currentAd = Math.floor(elapsedMs / AD_DURATION_MS) + 1;
      const clampedAdIndex = Math.min(currentAd, targetAdCount);
      
      // Only update React state if value actually changed (Optimization)
      setAdIndex(prev => (prev !== clampedAdIndex ? clampedAdIndex : prev));

      // 3. Calculate Progress (0-100%) for current ad
      // Modulo operator gives us time within the current ad block
      const timeInCurrentAd = elapsedMs % AD_DURATION_MS;
      const currentProgress = (timeInCurrentAd / AD_DURATION_MS) * 100;
      
      // Visual smoothness: cap at 100
      setProgress(Math.min(currentProgress, 100));

      // Loop
      requestRef.current = requestAnimationFrame(animate);
    };

    // Start Loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [targetAdCount, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-6 overflow-hidden overscroll-none">
      <div className="absolute top-8 right-8 flex items-center gap-2">
         <span className="text-xs font-mono text-slate-500">HOUSE AD {adIndex} / {targetAdCount}</span>
         <div className="w-2 h-2 bg-phoenix-500 rounded-full animate-pulse"></div>
      </div>

      <div className="w-full max-w-md aspect-[9/16] bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
         {/* Fake Ad Content */}
         <div className="text-center space-y-4 p-8 z-10">
            <Tv size={64} className="mx-auto text-phoenix-500" />
            <h2 className="text-2xl font-bold text-white font-display">PROTOCOL SPONSOR</h2>
            <p className="text-slate-400 animate-pulse">
               {adIndex === 1 ? "Initializing Stream..." : "Fueling the Endowment..."}
            </p>
            <p className="text-[10px] text-slate-600 font-mono mt-8">
               AD DURATION: 3s (TEST MODE)
            </p>
         </div>
         
         {/* Progress Bar */}
         <div className="absolute bottom-0 left-0 h-2 bg-phoenix-600 transition-all duration-75 ease-linear" style={{ width: `${progress}%` }}></div>
         
         {/* Background Effect */}
         <div className="absolute inset-0 bg-phoenix-500/5 z-0"></div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-slate-600 text-xs font-mono">
        <ShieldCheck size={14} />
        VERIFIED IMPRESSION • NO SKIP AVAILABLE
      </div>
    </div>
  );
};
