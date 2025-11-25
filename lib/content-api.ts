
import { Game } from '../types';

/**
 * MINTARA CONTENT DELIVERY NETWORK (SIMULATOR)
 * This acts as the interface between the App and the Supabase Database.
 * In production, these functions will simply wrap Supabase JS client calls.
 */

// EXPANDED MOCK DATABASE
export const MOCK_GAMES: Game[] = [
  // --- ARCADE ---
  { 
    id: 'game_001', 
    name: 'Neon Stack', 
    category: 'Arcade', 
    thumbnail: '🧱', 
    url: 'about:blank', 
    color: 'bg-mint-500', 
    hash: 'SHA256_A1B2C3D4', 
    description: 'Stack blocks to reach the stratosphere. High precision required.' 
  },
  { 
    id: 'game_002', 
    name: 'Cyber Solitaire', 
    category: 'Arcade', 
    thumbnail: '🃏', 
    url: 'about:blank', 
    color: 'bg-phoenix-500', 
    hash: 'SHA256_E5F6G7H8', 
    description: 'Classic Klondike with a cyberpunk visual overhaul.' 
  },
  { 
    id: 'game_003', 
    name: 'Quantum 2048', 
    category: 'Arcade', 
    thumbnail: '🔢', 
    url: 'about:blank', 
    color: 'bg-blue-500', 
    hash: 'SHA256_I9J0K1L2', 
    description: 'Merge subatomic particles to unlock the singularity.' 
  },
  { 
    id: 'game_004', 
    name: 'Void Runner', 
    category: 'Arcade', 
    thumbnail: '🏃', 
    url: 'about:blank', 
    color: 'bg-purple-500', 
    hash: 'SHA256_M3N4O5P6', 
    description: 'Infinite procedural runner in the null void.' 
  },
  { 
    id: 'game_005', 
    name: 'Asteroid Miner', 
    category: 'Arcade', 
    thumbnail: '🚀', 
    url: 'about:blank', 
    color: 'bg-red-500', 
    hash: 'SHA256_Q7R8S9T0', 
    description: 'Destroy debris, collect minerals, upgrade ship.' 
  },

  // --- ZENNER (AUDIO/VISUAL) ---
  { 
    id: 'zen_174', 
    name: 'Solfeggio 174Hz', 
    category: 'Zenner', 
    thumbnail: '🧘', 
    url: 'about:blank', 
    color: 'bg-teal-500', 
    hash: 'FREQ_174', 
    description: 'Pain relief and comfort frequency. Digital Incense.' 
  },
  { 
    id: 'zen_528', 
    name: 'Solfeggio 528Hz', 
    category: 'Zenner', 
    thumbnail: '🧬', 
    url: 'about:blank', 
    color: 'bg-emerald-500', 
    hash: 'FREQ_528', 
    description: 'DNA repair and transformation frequency.' 
  },
  { 
    id: 'zen_rain', 
    name: 'Solfeggio 432Hz', 
    category: 'Zenner', 
    thumbnail: '🌧️', 
    url: 'about:blank', 
    color: 'bg-slate-500', 
    hash: 'FREQ_432', 
    description: 'Mathematics of the universe. Deep healing tone.' 
  },

  // --- MEDIA (TV/VIDEO) ---
  { 
    id: 'tv_news', 
    name: 'Crypto News 24/7', 
    category: 'Media', 
    thumbnail: '📺', 
    url: 'about:blank', 
    color: 'bg-yellow-500', 
    hash: 'STREAM_LIVE_NEWS', 
    description: 'Live aggregation of top crypto news streams.' 
  },
  { 
    id: 'tv_lofi', 
    name: 'Lofi Minting Beats', 
    category: 'Media', 
    thumbnail: '🎧', 
    url: 'about:blank', 
    color: 'bg-pink-500', 
    hash: 'STREAM_LOFI_GIRL', 
    description: 'Chill beats to mine MTRA to.' 
  },
];

export const ContentAPI = {
  
  /**
   * Fetches all active content from the "Database".
   * Simulates network latency.
   */
  fetchAll: async (): Promise<Game[]> => {
    // Simulate 500ms network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_GAMES;
  },

  /**
   * Filters content by category.
   */
  fetchByCategory: async (category: string): Promise<Game[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (category === 'All') return MOCK_GAMES;
    return MOCK_GAMES.filter(g => g.category === category);
  },

  /**
   * Searches content by name or description.
   */
  search: async (query: string): Promise<Game[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const q = query.toLowerCase();
    return MOCK_GAMES.filter(g => 
      g.name.toLowerCase().includes(q) || 
      g.description.toLowerCase().includes(q)
    );
  }
};
