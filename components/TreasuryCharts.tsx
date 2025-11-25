
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SUPPLY_DATA = [
  { period: 'Q1', minted: 5, burned: 1, locked: 3 },
  { period: 'Q2', minted: 15, burned: 4, locked: 10 },
  { period: 'Q3', minted: 35, burned: 12, locked: 20 },
  { period: 'Q4', minted: 60, burned: 25, locked: 32 },
  { period: 'Now', minted: 85, burned: 35, locked: 48 },
];

const OPS_DATA = [
  { name: 'Server/Gas', value: 15, color: '#64748b' },
  { name: 'Rainy Day', value: 85, color: '#10b981' },
];

export const TreasuryCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Supply Dynamics Chart */}
      <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
        <div className="flex justify-between items-start mb-6">
           <div>
              <h3 className="font-display font-bold text-xl text-white mb-1">PROTOCOL EFFICIENCY</h3>
              <p className="text-xs text-slate-400">Net Deflationary Actions over Time</p>
           </div>
           <div className="text-right">
              <span className="text-xs font-bold bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-500/20">
                 BURN RATE RISING
              </span>
           </div>
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SUPPLY_DATA}>
              <defs>
                <linearGradient id="colorLocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBurned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#64748b" tick={{fontSize: 10}} />
              <YAxis stroke="#64748b" tick={{fontSize: 10}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} 
              />
              <Area type="monotone" dataKey="locked" stackId="1" stroke="#3b82f6" fill="url(#colorLocked)" name="Locked (PF)" />
              <Area type="monotone" dataKey="burned" stackId="1" stroke="#f97316" fill="url(#colorBurned)" name="Burned" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operations Budget */}
      <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50 flex flex-col">
        <div className="mb-4">
            <h3 className="font-display font-bold text-xl text-white mb-2">OPS BUDGET (SENTINEL)</h3>
            <p className="text-xs text-slate-400">10% House Ads Allocation</p>
        </div>

        <div className="flex items-center gap-8 h-full">
            <div className="h-[200px] w-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={OPS_DATA}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {OPS_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">85%</span>
                    <span className="text-[10px] text-mint-500 font-mono">SURPLUS</span>
                </div>
            </div>
            
            <div className="space-y-4 flex-1">
                <div>
                   <p className="text-xs text-slate-500 font-mono mb-1">RAINY DAY RESERVE</p>
                   <p className="text-xl font-bold text-mint-400">$845,200</p>
                   <p className="text-[10px] text-slate-600">Held for emergency ops</p>
                </div>
                <div>
                   <p className="text-xs text-slate-500 font-mono mb-1">MONTHLY BURN</p>
                   <p className="text-xl font-bold text-slate-200">$12,400</p>
                   <p className="text-[10px] text-slate-600">Servers, Gas, API</p>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};
