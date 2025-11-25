
import { MiningResponse } from '../types';

/**
 * SIMULATED BACKEND - SUPABASE EDGE FUNCTIONS
 * In production, this code lives on the server to prevent client-side manipulation.
 */

const EARNING_RATE_PER_AD = 0.012; // Based on $0.25 backing ($0.003 rev / 0.25)
const MIN_LOOP_TIME_MS = 175000; // 2min 55sec (Allowing 5s grace period for lag, strict < 3m check)

interface ActiveSession {
  sessionId: string;
  startTime: number;
  lastAdTime: number;
  adsWatched: number;
  accumulatedRewards: number;
}

let currentSession: ActiveSession | null = null;

export const MiningAPI = {
  
  // 1. Start Session (POST /api/session/start)
  startSession: async (): Promise<string> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const sessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
    currentSession = {
      sessionId,
      startTime: Date.now(),
      lastAdTime: Date.now(), // Reset clock
      adsWatched: 0,
      accumulatedRewards: 0
    };
    
    console.log(`[BACKEND] Session Started: ${sessionId}`);
    return sessionId;
  },

  // 2. Validate Loop & Record Ad (POST /api/session/ad)
  recordMiningAd: async (sessionId: string): Promise<MiningResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate minting lag

    if (!currentSession || currentSession.sessionId !== sessionId) {
      return { success: false, earnedMtra: 0, error: 'INVALID_SESSION' };
    }

    const now = Date.now();
    const timeSinceLastAd = now - currentSession.lastAdTime;

    // SECURITY CHECK: Speed Hack Detection
    // If they try to claim faster than the minimum loop time, reject it.
    // NOTE: For dev/testing purposes in this web demo, we might bypass this if "Force Cycle" is used,
    // but in production, this is a hard rule.
    const IS_DEV_MODE = true; 
    
    if (!IS_DEV_MODE && timeSinceLastAd < MIN_LOOP_TIME_MS) {
      console.warn(`[BACKEND] Speed Hack Detected! Time delta: ${timeSinceLastAd}ms`);
      return { success: false, earnedMtra: 0, error: 'SPEED_LIMIT_EXCEEDED' };
    }

    // Update State
    currentSession.lastAdTime = now;
    currentSession.adsWatched += 1;
    currentSession.accumulatedRewards += EARNING_RATE_PER_AD;

    // Mock Transaction Hash
    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;

    return {
      success: true,
      earnedMtra: EARNING_RATE_PER_AD,
      txHash
    };
  },

  // 3. Complete Session (POST /api/session/complete)
  completeSession: async (sessionId: string): Promise<MiningResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!currentSession || currentSession.sessionId !== sessionId) {
      return { success: false, earnedMtra: 0, error: 'INVALID_SESSION' };
    }

    const total = currentSession.accumulatedRewards;
    
    // Cleanup
    const finalTx = `0xBATCH_${Math.random().toString(16).substr(2, 40)}`;
    currentSession = null;

    return {
      success: true,
      earnedMtra: total,
      txHash: finalTx
    };
  }
};
