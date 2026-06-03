import React from 'react';
import type { ModelMetrics } from '../types/stock';
import { Award, Percent, Info, ShieldCheck } from 'lucide-react';

interface PredictionMetricsProps {
  metrics: ModelMetrics | null;
  predictionTrend: 'UP' | 'DOWN' | 'STABLE';
}

export const PredictionMetrics: React.FC<PredictionMetricsProps> = ({
  metrics,
  predictionTrend,
}) => {
  if (!metrics) {
    return (
      <div className="glass-card animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Awaiting model training to compile evaluation metrics...
      </div>
    );
  }

  // Determine trade signal
  let signal = 'HOLD';
  let badgeClass = 'badge-purple';
  let explanation = 'The model forecasts consolidative price movement with low directional drift.';
  
  if (predictionTrend === 'UP') {
    signal = metrics.directionalAccuracy > 70 ? 'STRONG BUY' : 'BUY';
    badgeClass = 'badge-green';
    explanation = `The model projects a bullish trajectory with ${metrics.directionalAccuracy}% historical directional accuracy.`;
  } else if (predictionTrend === 'DOWN') {
    signal = metrics.directionalAccuracy > 70 ? 'STRONG SELL' : 'SELL';
    badgeClass = 'badge-red';
    explanation = `The model projects a bearish trajectory. Risk-reduction or short positions recommended.`;
  }

  // Info triggers for metric explanations
  const metricsExplanations = [
    {
      title: 'Directional Accuracy',
      value: `${metrics.directionalAccuracy}%`,
      icon: <Percent size={14} />,
      desc: 'The proportion of days where the model correctly predicted the upward or downward sign of price change.',
    },
    {
      title: 'R-Squared (R²)',
      value: metrics.r2.toFixed(3),
      icon: <Award size={14} />,
      desc: 'Coefficient of determination. Measures the proportion of variance in the stock price explainable by model inputs.',
    },
    {
      title: 'Root Mean Squared Error (RMSE)',
      value: `$${metrics.rmse}`,
      icon: <Info size={14} />,
      desc: 'Standard deviation of residuals. penalizes larger forecasting errors more heavily.',
    },
    {
      title: 'Mean Absolute Error (MAE)',
      value: `$${metrics.mae}`,
      icon: <Info size={14} />,
      desc: 'Average magnitude of forecast errors. Represents average absolute distance between predictions and actuals.',
    },
  ];

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card-title" style={{ margin: 0 }}>
        <ShieldCheck size={18} style={{ color: 'var(--color-green)' }} />
        Model Evaluation & Trading Signals
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        
        {/* Recommendation Widget */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.04)', 
          borderRadius: '8px', 
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            AI PREDICTIVE TRADING SIGNAL
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`badge ${badgeClass}`} style={{ fontSize: '1.25rem', padding: '8px 16px', fontWeight: 800 }}>
              {signal}
            </span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Confidence: {metrics.directionalAccuracy}%
            </div>
          </div>
          
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {explanation}
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {metricsExplanations.map((m, index) => (
            <div 
              key={index}
              style={{ 
                background: 'rgba(255, 255, 255, 0.01)', 
                border: '1px solid rgba(255, 255, 255, 0.03)', 
                borderRadius: '8px', 
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {m.icon}
                {m.title}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '2px' }}>
                {m.value}
              </div>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginTop: '4px' }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
