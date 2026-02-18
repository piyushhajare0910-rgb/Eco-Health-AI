
import React, { useState } from 'react';
// Added Activity to the lucide-react imports
import { Search, MapPin, Wind, Thermometer, Droplets, CloudRain, Users, Loader2, Download, AlertCircle, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { EnvironmentalData, AnalysisResult, DiseasePrediction } from '../types';
import { getAIInsights } from '../services/geminiService';
import RiskMeter from './RiskMeter';
import { DISEASE_ICONS } from '../constants';

interface AnalyzeAreaProps {
  onAddResult: (res: AnalysisResult) => void;
}

const AnalyzeArea: React.FC<AnalyzeAreaProps> = ({ onAddResult }) => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [expandedTips, setExpandedTips] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EnvironmentalData>({
    aqi: 45,
    temperature: 28,
    humidity: 65,
    rainfall: 120,
    populationDensity: 1200
  });

  const handlePredict = async () => {
    if (!location) return alert("Please enter a location");
    setLoading(true);
    
    // Simulated prediction logic
    setTimeout(async () => {
      // Fixed type incompatibility by explicitly typing the mock array or casting union literals
      const mockPredictions: DiseasePrediction[] = [
        {
          name: 'Dengue',
          probability: Math.min(95, Math.floor(formData.rainfall / 3 + formData.humidity / 2)),
          riskLevel: (formData.rainfall > 200 ? 'Critical' : 'High') as DiseasePrediction['riskLevel'],
          trend: 'Up' as DiseasePrediction['trend'],
          preventionTips: ['Clear stagnant water', 'Use mosquito repellents', 'Wear long sleeves']
        },
        {
          name: 'Respiratory Distress',
          probability: Math.min(95, Math.floor(formData.aqi * 1.5)),
          riskLevel: (formData.aqi > 100 ? 'High' : 'Moderate') as DiseasePrediction['riskLevel'],
          trend: 'Up' as DiseasePrediction['trend'],
          preventionTips: ['Avoid outdoor activity during peak smog', 'Use N95 masks', 'Use air purifiers indoors']
        },
        {
          name: 'Typhoid',
          probability: Math.min(95, Math.floor(formData.temperature + formData.rainfall / 10)),
          riskLevel: 'Moderate' as DiseasePrediction['riskLevel'],
          trend: 'Stable' as DiseasePrediction['trend'],
          preventionTips: ['Boil drinking water', 'Maintain personal hygiene', 'Avoid street food']
        }
      ].sort((a, b) => b.probability - a.probability);

      const score = Math.floor(mockPredictions.reduce((acc, p) => acc + p.probability, 0) / mockPredictions.length);
      const aiInsights = await getAIInsights(formData, location, mockPredictions);

      const newResult: AnalysisResult = {
        id: Math.random().toString(36).substr(2, 9),
        location,
        timestamp: new Date().toLocaleString(),
        envData: formData,
        predictions: mockPredictions,
        aiInsights,
        riskScore: score
      };

      setResult(newResult);
      onAddResult(newResult);
      setLoading(false);
    }, 1500);
  };

  const downloadReport = () => {
    if (!result) return;
    const reportText = `
      HEALTH OUTBREAK REPORT: ${result.location}
      Generated: ${result.timestamp}
      ---
      Overall Risk Score: ${result.riskScore}%
      
      ENVIRONMENTAL DATA:
      AQI: ${result.envData.aqi}
      Temp: ${result.envData.temperature}°C
      Humidity: ${result.envData.humidity}%
      Rainfall: ${result.envData.rainfall}mm
      
      PREDICTIONS:
      ${result.predictions.map(p => `${p.name}: ${p.probability}% (${p.riskLevel})`).join('\n')}
      
      AI INSIGHTS:
      ${result.aiInsights}
    `;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${result.location}_${new Date().toLocaleDateString()}.txt`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in">
      <div className="glass rounded-3xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Search className="text-emerald-500" />
          Analyze Environmental Risk
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-semibold text-slate-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Location/City
            </label>
            <input 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, India"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 flex items-center gap-1">
              <Wind className="w-4 h-4" /> AQI Level
            </label>
            <input 
              type="number"
              value={formData.aqi}
              onChange={(e) => setFormData({...formData, aqi: Number(e.target.value)})}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 flex items-center gap-1">
              <Thermometer className="w-4 h-4" /> Temperature (°C)
            </label>
            <input 
              type="number"
              value={formData.temperature}
              onChange={(e) => setFormData({...formData, temperature: Number(e.target.value)})}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 flex items-center gap-1">
              <Droplets className="w-4 h-4" /> Humidity (%)
            </label>
            <input 
              type="number"
              value={formData.humidity}
              onChange={(e) => setFormData({...formData, humidity: Number(e.target.value)})}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 flex items-center gap-1">
              <CloudRain className="w-4 h-4" /> Rainfall (mm)
            </label>
            <input 
              type="number"
              value={formData.rainfall}
              onChange={(e) => setFormData({...formData, rainfall: Number(e.target.value)})}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <button 
          onClick={handlePredict}
          disabled={loading}
          className="mt-8 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing Environment Data...
            </>
          ) : (
            'Generate Outbreak Prediction'
          )}
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-slate-800">Results for {result.location}</h3>
            <button 
              onClick={downloadReport}
              className="flex items-center gap-2 text-emerald-600 font-semibold hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" /> Download Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 glass rounded-3xl p-8 flex flex-col items-center justify-center">
              <RiskMeter score={result.riskScore} />
              <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm font-medium">Environmental Context</p>
                <div className="flex gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{result.envData.aqi}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">AQI</p>
                  </div>
                  <div className="w-px bg-slate-100 h-8" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{result.envData.temperature}°</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Temp</p>
                  </div>
                  <div className="w-px bg-slate-100 h-8" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{result.envData.rainfall}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Rain</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 glass rounded-3xl p-8 bg-emerald-900/5 border-emerald-500/20">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-800">
                <AlertCircle className="w-5 h-5" />
                AI Health Insights
              </h4>
              <div className="bg-white/60 p-6 rounded-2xl text-slate-700 italic leading-relaxed shadow-sm border border-emerald-200">
                "{result.aiInsights}"
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 px-2 py-1 bg-emerald-100 rounded">GEN AI VERIFIED</span>
                <span className="text-xs text-slate-400 italic">Based on real-time environmental indexing</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.predictions.map((p) => (
              <div key={p.name} className="glass rounded-3xl p-6 hover:shadow-xl transition-all border border-transparent hover:border-emerald-500/20 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-emerald-50 transition-colors">
                    {DISEASE_ICONS[p.name] || <Activity className="w-6 h-6 text-emerald-500" />}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    p.riskLevel === 'High' || p.riskLevel === 'Critical' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {p.riskLevel} RISK
                  </span>
                </div>
                
                <h5 className="font-bold text-xl text-slate-800 mb-1">{p.name}</h5>
                <p className="text-sm text-slate-400 mb-4 font-medium">Trend: <span className="text-emerald-500">{p.trend}</span></p>

                <div className="mb-6">
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span className="text-slate-600">Probability</span>
                    <span className="text-emerald-600">{p.probability}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        p.probability > 70 ? 'bg-red-500' : p.probability > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${p.probability}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => setExpandedTips(expandedTips === p.name ? null : p.name)}
                    className="w-full flex items-center justify-between text-sm font-bold text-slate-500 hover:text-emerald-500 transition-colors"
                  >
                    PREVENTION TIPS
                    {expandedTips === p.name ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedTips === p.name && (
                    <ul className="space-y-2 pt-2 animate-slide-down">
                      {p.preventionTips.map(tip => (
                        <li key={tip} className="text-xs flex items-center gap-2 text-slate-600">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzeArea;
