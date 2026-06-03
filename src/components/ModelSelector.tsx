import React from 'react';
import type { ModelType, Hyperparameters } from '../types/stock';
import { Cpu, Settings, Play, Check } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  hyperparameters: Hyperparameters;
  onParamsChange: (params: Hyperparameters) => void;
  onTrain: () => void;
  isTraining: boolean;
  isTrained: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  hyperparameters,
  onParamsChange,
  onTrain,
  isTraining,
  isTrained,
}) => {
  
  const modelsList: { type: ModelType; name: string; tag: string; desc: string }[] = [
    {
      type: 'LSTM',
      name: 'LSTM Neural Net',
      tag: 'Recommended // Deep Learning',
      desc: 'Long Short-Term Memory recurrent neural network optimized for sequential pattern recognition and temporal financial dependencies.',
    },
    {
      type: 'RANDOM_FOREST',
      name: 'Random Forest Regressor',
      tag: 'Robust // Ensemble Model',
      desc: 'Decision tree ensemble using bagging and random subspace projection to prevent overfitting and capture non-linear relationships.',
    },
    {
      type: 'PROPHET',
      name: 'Prophet Time-Series',
      tag: 'Statistical // Additive Model',
      desc: 'Bayesian curve-fitting regression model optimized for capturing daily, weekly, and yearly seasonal patterns in historical data.',
    },
  ];

  const updateParam = (key: keyof Hyperparameters, val: number) => {
    onParamsChange({
      ...hyperparameters,
      [key]: val,
    });
  };

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card-title" style={{ margin: 0 }}>
        <Cpu size={18} style={{ color: 'var(--color-purple)' }} />
        Configure Machine Learning Model
      </div>

      {/* Model Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {modelsList.map((m) => (
          <div
            key={m.type}
            onClick={() => !isTraining && onModelChange(m.type)}
            className="glass-card"
            style={{
              padding: '16px',
              cursor: isTraining ? 'not-allowed' : 'pointer',
              borderColor: selectedModel === m.type ? 'var(--color-purple)' : 'var(--border-color)',
              background: selectedModel === m.type ? 'var(--color-purple-muted)' : 'rgba(255, 255, 255, 0.01)',
              transition: 'all 0.2s ease',
              boxShadow: selectedModel === m.type ? 'var(--shadow-purple)' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{m.name}</div>
              <span 
                className="badge" 
                style={{ 
                  fontSize: '0.65rem',
                  background: selectedModel === m.type ? 'var(--color-purple)' : 'rgba(255, 255, 255, 0.05)',
                  color: 'white'
                }}
              >
                {m.tag}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
              {m.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Hyperparameters Controls */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <Settings size={14} /> MODEL HYPERPARAMETERS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Learning Rate */}
          <div className="form-group">
            <label className="form-label">
              Learning Rate
              <span className="value">{hyperparameters.learningRate}</span>
            </label>
            <select
              className="select-input"
              value={hyperparameters.learningRate}
              onChange={(e) => updateParam('learningRate', parseFloat(e.target.value))}
              disabled={isTraining}
            >
              <option value={0.001}>0.001 (Slow / Stable)</option>
              <option value={0.005}>0.005</option>
              <option value={0.01}>0.01 (Optimal)</option>
              <option value={0.05}>0.05</option>
              <option value={0.1}>0.1 (Fast / Volatile)</option>
            </select>
          </div>

          {/* Epochs */}
          <div className="form-group">
            <label className="form-label">
              Training Epochs
              <span className="value">{hyperparameters.epochs}</span>
            </label>
            <input
              type="range"
              min={10}
              max={150}
              step={10}
              value={hyperparameters.epochs}
              onChange={(e) => updateParam('epochs', parseInt(e.target.value))}
              disabled={isTraining}
            />
          </div>

          {/* Lookback Window */}
          <div className="form-group">
            <label className="form-label">
              Lookback Window (Days)
              <span className="value">{hyperparameters.lookbackWindow}d</span>
            </label>
            <select
              className="select-input"
              value={hyperparameters.lookbackWindow}
              onChange={(e) => updateParam('lookbackWindow', parseInt(e.target.value))}
              disabled={isTraining}
            >
              <option value={5}>5 Days</option>
              <option value={10}>10 Days</option>
              <option value={20}>20 Days (Default)</option>
              <option value={30}>30 Days</option>
            </select>
          </div>

          {/* Train Split Ratio */}
          <div className="form-group">
            <label className="form-label">
              Train / Test Split
              <span className="value">{Math.round(hyperparameters.splitRatio * 100)}%</span>
            </label>
            <input
              type="range"
              min={0.6}
              max={0.9}
              step={0.05}
              value={hyperparameters.splitRatio}
              onChange={(e) => updateParam('splitRatio', parseFloat(e.target.value))}
              disabled={isTraining}
            />
          </div>
        </div>
      </div>

      {/* Train Button */}
      <button
        className="btn btn-primary"
        style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '8px' }}
        disabled={isTraining}
        onClick={onTrain}
      >
        {isTraining ? (
          <>
            <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'signalFlow 1s infinite linear' }} />
            Training ML Network Weights...
          </>
        ) : isTrained ? (
          <>
            <Check size={16} /> Re-Train AI Predictor Model
          </>
        ) : (
          <>
            <Play size={16} /> Compile & Train {selectedModel} Model
          </>
        )}
      </button>
    </div>
  );
};
