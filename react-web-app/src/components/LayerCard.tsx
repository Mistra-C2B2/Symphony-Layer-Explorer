import React from 'react';
import type { SymphonyLayer } from '../types';
import Card from './Card';
import { dataService } from '../services/dataService';

interface LayerCardProps {
  layer: SymphonyLayer;
  onClick: (layer: SymphonyLayer) => void;
}

// Color mapping for status indicators
const STATUS_COLORS = {
  improvement: {
    large: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200', 
    small: 'bg-green-100 text-green-700 border-green-200',
  },
  difficulty: {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  }
} as const;

// Utility functions
const getStatusColor = (type: 'improvement' | 'difficulty', value: string): string => {
  return STATUS_COLORS[type][value as keyof typeof STATUS_COLORS[typeof type]] || 
         'bg-neutral-100 text-neutral-700 border-neutral-200';
};



// Sub-components for better organization
const LayerHeader: React.FC<{ name: string; theme: string }> = ({ name, theme }) => (
  <div className="mb-5">
    <h3 className="text-lg font-semibold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
      {name}
    </h3>
    <span className="text-sm text-primary-600 font-semibold bg-primary-50 px-3 py-1.5 rounded-full inline-block shadow-soft">
      {theme}
    </span>
  </div>
);


const MetricRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-neutral-600 font-semibold">{label}</span>
    <div className="flex items-center gap-3">
      {children}
    </div>
  </div>
);

const StatusTag: React.FC<{ 
  type: 'improvement' | 'difficulty' | 'satellite' | 'category' | 'digital_earth_sweden';
  value?: string;
  label: string;
}> = ({ type, value, label }) => {
  const getTagStyles = () => {
    if (type === 'satellite') {
      return 'bg-secondary-100 text-secondary-700 border-secondary-200 shadow-soft';
    }
    if (type === 'category') {
      return 'bg-primary-100 text-primary-700 border-primary-200 shadow-soft';
    }
    if (type === 'digital_earth_sweden') {
      return 'bg-blue-100 text-blue-700 border-blue-200 shadow-soft';
    }
    return `${getStatusColor(type, value || '')} shadow-soft`;
  };

  return (
    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 hover:scale-105 ${getTagStyles()}`}>
      {label}
    </span>
  );
};


const LayerCard: React.FC<LayerCardProps> = ({ layer, onClick }) => {
  const relatedDatasetsCount = dataService.getRelatedDatasetsCount(layer);

  return (
    <Card 
      hover
      onClick={() => onClick(layer)}
      className="group animate-slide-up hover:shadow-card-hover transition-all duration-300"
    >
      <LayerHeader name={layer.name} theme={layer.symphony_theme} />

      {/* Enhanced Metrics Section */}
      <div className="space-y-4 mb-5">

        <MetricRow label="Related Datasets:">
          <span className="font-bold text-neutral-900 bg-secondary-100 px-3 py-1.5 rounded-lg text-sm shadow-soft min-w-[3rem] text-center text-secondary-700">
            {relatedDatasetsCount}
          </span>
        </MetricRow>
      </div>

      {/* Enhanced Tags Section */}
      <div className="flex flex-wrap gap-2 mb-5">
        <StatusTag 
          type="category"
          label={layer.symphony_category}
        />
        <StatusTag 
          type="improvement" 
          value={layer.improvement_potential}
          label={`${layer.improvement_potential} improvement`}
        />
        <StatusTag 
          type="difficulty" 
          value={layer.difficulty}
          label={`${layer.difficulty} difficulty`}
        />
        {layer.satellite && (
          <StatusTag 
            type="satellite"
            label="satellite"
          />
        )}
        {layer.digital_earth_sweden && (
          <StatusTag 
            type="digital_earth_sweden"
            label="DES data"
          />
        )}
      </div>

      {/* <LayerSummary summary={layer.summary} /> */}
    </Card>
  );
};

export default LayerCard;