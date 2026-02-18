
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HistoricalEntry, AnalysisResult } from '../types';
// Added Search to the lucide-react imports
import { Activity, Wind, AlertCircle, TrendingUp, Users, Search } from 'lucide-react';

interface DashboardProps {
  historicalData: HistoricalEntry[];
  recentResults: AnalysisResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ historicalData, recentResults }) => {
  const latestResult = recentResults[0];
  const totalHistoricalCases = historicalData.reduce((acc, curr) => acc + curr.cases, 0);
  const avgAQI = recentResults.length > 0 
    ? (recentResults.reduce((acc, curr) => acc + curr.envData.aqi, 0) / recentResults.length).toFixed(1)
    : 45.0;
  
  const highRiskCount = latestResult 
    ? latestResult.predictions.filter(p => p.probability > 60).length
    : 0;

  // Transform historical data for chart
  const years = Array.from(new Set(historicalData.map(d => d.year))).sort();
  const chartData = years.map(year => {
    const entry: any = { year };
    const items = historicalData.filter(d => d.year === year);
    items.forEach(item => {
      entry[item.disease] = item.cases;
    });
    return entry;
  });

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="glass rounded-3xl p-6 transition-all hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-600`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">System <span className="text-emerald-500">Overview</span></h1>
        <p className="text-slate-500 font-medium">Monitoring environmental triggers and historical disease vectors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Cases (Historical)" value={totalHistoricalCases.toLocaleString()} icon={Activity} color="emerald" trend={12} />
        <StatCard title="Average AQI" value={avgAQI} icon={Wind} color="blue" trend={-5} />
        <StatCard title="Most Frequent" value="Dengue" icon={TrendingUp} color="amber" />
        <StatCard title="High Risk Alerts" value={highRiskCount} icon={AlertCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Disease Prevalence Trends</h2>
            <div className="flex gap-2">
               <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Dengue
               </div>
               <div className="flex items-center gap-1 text-xs font-bold text-blue-500">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div> Malaria
               </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDengue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMalaria" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} fontWeight={600} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} fontWeight={600} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                />
                <Area type="monotone" dataKey="Dengue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDengue)" />
                <Area type="monotone" dataKey="Malaria" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMalaria)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Reports</h2>
          <div className="space-y-4">
            {recentResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Search className="text-slate-300 w-8 h-8" />
                </div>
                <p className="text-slate-400 font-medium">No analyses yet</p>
                <button className="text-emerald-500 text-sm font-bold mt-2">Start Analysis</button>
              </div>
            ) : (
              recentResults.slice(0, 5).map((res) => (
                <div key={res.id} className="p-4 bg-white/50 border border-slate-100 rounded-2xl hover:bg-emerald-50 transition-colors group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-emerald-700">{res.location}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{res.timestamp}</p>
                    </div>
                    <div className={`text-sm font-bold px-3 py-1 rounded-full ${res.riskScore > 60 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                      {res.riskScore}% Risk
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
