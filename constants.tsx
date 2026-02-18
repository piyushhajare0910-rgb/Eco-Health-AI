
import React from 'react';
import { 
  Activity, 
  Wind, 
  Droplets, 
  Thermometer, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  ShieldAlert,
  Bug,
  Waves,
  Stethoscope
} from 'lucide-react';

export const DISEASE_ICONS: Record<string, React.ReactNode> = {
  'Malaria': <Bug className="w-5 h-5 text-red-500" />,
  'Dengue': <Waves className="w-5 h-5 text-blue-500" />,
  'Typhoid': <Activity className="w-5 h-5 text-emerald-500" />,
  'Respiratory Distress': <Wind className="w-5 h-5 text-orange-500" />,
  'Cholera': <Droplets className="w-5 h-5 text-cyan-500" />,
};

export const INITIAL_HISTORICAL_DATA = [
  { year: 2019, disease: 'Dengue', cases: 120 },
  { year: 2020, disease: 'Dengue', cases: 240 },
  { year: 2021, disease: 'Dengue', cases: 180 },
  { year: 2022, disease: 'Dengue', cases: 310 },
  { year: 2023, disease: 'Dengue', cases: 450 },
  { year: 2019, disease: 'Malaria', cases: 80 },
  { year: 2020, disease: 'Malaria', cases: 100 },
  { year: 2021, disease: 'Malaria', cases: 90 },
  { year: 2022, disease: 'Malaria', cases: 120 },
  { year: 2023, disease: 'Malaria', cases: 150 },
];
