
export interface EnvironmentalData {
  aqi: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  populationDensity: number;
}

export interface DiseasePrediction {
  name: string;
  probability: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  trend: 'Up' | 'Down' | 'Stable';
  preventionTips: string[];
}

export interface AnalysisResult {
  id: string;
  location: string;
  timestamp: string;
  envData: EnvironmentalData;
  predictions: DiseasePrediction[];
  aiInsights: string;
  riskScore: number;
}

export interface HistoricalEntry {
  year: number;
  disease: string;
  cases: number;
}
