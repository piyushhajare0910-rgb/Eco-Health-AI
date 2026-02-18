
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AnalyzeArea from './components/AnalyzeArea';
import { AnalysisResult, HistoricalEntry } from './types';
import { INITIAL_HISTORICAL_DATA } from './constants';
// Added Activity to the lucide-react imports
import { Github, Globe, Heart, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [recentResults, setRecentResults] = useState<AnalysisResult[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>(INITIAL_HISTORICAL_DATA);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.replace('bg-gradient-to-br', 'dark:bg-slate-950');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.replace('dark:bg-slate-950', 'bg-gradient-to-br');
    }
  }, [isDark]);

  const addResult = (res: AnalysisResult) => {
    setRecentResults(prev => [res, ...prev]);
    // Simulate updating historical database
    const newEntry: HistoricalEntry = {
      year: 2024,
      disease: res.predictions[0].name,
      cases: Math.floor(Math.random() * 500)
    };
    setHistoricalData(prev => [...prev, newEntry]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard historicalData={historicalData} recentResults={recentResults} />;
      case 'analyze':
        return <AnalyzeArea onAddResult={addResult} />;
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto py-12 px-4 text-center">
            <div className="glass rounded-3xl p-12 border-dashed border-2 border-slate-300">
               <Globe className="w-16 h-16 text-emerald-500 mx-auto mb-6 opacity-50" />
               <h2 className="text-3xl font-bold text-slate-800 mb-2">Upload Historical Dataset</h2>
               <p className="text-slate-500 mb-8 max-w-md mx-auto">Upload CSV or JSON files containing regional disease reports to improve AI accuracy.</p>
               <input type="file" className="hidden" id="file-upload" />
               <label htmlFor="file-upload" className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold cursor-pointer hover:bg-emerald-600 transition-colors inline-block shadow-lg shadow-emerald-500/20">
                 Browse Files
               </label>
            </div>
          </div>
        );
      case 'history':
        return (
           <div className="max-w-4xl mx-auto py-12 px-4">
             <h2 className="text-3xl font-bold mb-8">Prediction Records</h2>
             <div className="space-y-4">
                {recentResults.length === 0 ? (
                  <p className="text-slate-400">No predictions made yet.</p>
                ) : (
                  recentResults.map(res => (
                    <div key={res.id} className="glass rounded-2xl p-6 flex justify-between items-center">
                       <div>
                         <h4 className="font-bold text-xl">{res.location}</h4>
                         <p className="text-sm text-slate-400">{res.timestamp}</p>
                       </div>
                       <div className="text-right">
                         <span className="text-emerald-500 font-bold block">{res.riskScore}% RISK</span>
                         <span className="text-xs text-slate-400 font-medium">Predicted for: {res.predictions.map(p => p.name).join(', ')}</span>
                       </div>
                    </div>
                  ))
                )}
             </div>
           </div>
        );
      case 'about':
        return (
          <div className="max-w-3xl mx-auto py-12 px-4 leading-relaxed">
            <h2 className="text-4xl font-extrabold mb-8">EcoHealth <span className="text-emerald-500">Project</span></h2>
            <div className="glass rounded-3xl p-8 space-y-6 text-slate-600">
              <p>
                Our system uses advanced machine learning models coupled with Google's Gemini AI to analyze environmental triggers for disease outbreaks. By correlating factors like AQI, Humidity, and Temperature with historical health data, we provide actionable insights for NGOs and health departments.
              </p>
              <h3 className="text-xl font-bold text-slate-800">Key Innovations:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Predictive analytics for vector-borne diseases</li>
                <li>Real-time environmental data indexing</li>
                <li>LLM-powered epidemiological insights</li>
                <li>Historical trend visualization</li>
              </ul>
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Heart className="w-4 h-4 text-red-500" /> Made for HealthTech Hackathon
                </div>
                <div className="flex items-center gap-4">
                   <Github className="w-5 h-5 text-slate-400 cursor-pointer" />
                   <Globe className="w-5 h-5 text-slate-400 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard historicalData={historicalData} recentResults={recentResults} />;
    }
  };

  return (
    <div className={`transition-all duration-500 ${isDark ? 'dark' : ''}`}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDark={isDark} 
        setIsDark={setIsDark} 
      />
      
      <main className="pt-20 pb-20 min-h-screen">
        {renderContent()}
      </main>

      <footer className="glass border-t border-white/20 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500 rounded-lg scale-75">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-600 tracking-tight">EcoHealthAI © 2024</span>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            Team <span className="text-emerald-500 font-bold">BioGuardians</span> | Global Health Summit Hackathon
          </div>
          <div className="flex gap-4">
            <button className="text-slate-400 hover:text-emerald-500 transition-colors text-xs font-bold uppercase tracking-wider">Privacy Policy</button>
            <button className="text-slate-400 hover:text-emerald-500 transition-colors text-xs font-bold uppercase tracking-wider">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
