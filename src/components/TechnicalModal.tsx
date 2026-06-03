import React from 'react';
import { X, BookOpen, Layers, LineChart, Code, Award } from 'lucide-react';

interface TechnicalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalModal: React.FC<TechnicalModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div 
        className="glass-card animate-fade-in" 
        style={{ 
          maxWidth: '850px', 
          width: '100%', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          position: 'relative',
          padding: '32px',
          borderColor: 'var(--color-purple-muted)',
          boxShadow: 'var(--shadow-purple)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
          <BookOpen style={{ color: 'var(--color-purple)' }} size={28} />
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800 }}>Model Architectures & Mathematical Foundations</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deep technical reference card for engineering interviews</span>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'left' }}>
          
          {/* LSTM Explainer */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Layers size={18} style={{ color: 'var(--color-purple)' }} />
              1. LSTM (Long Short-Term Memory Networks)
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              LSTM is a specialized Recurrent Neural Network (RNN) designed to combat the vanishing gradient problem. By introducing a cell state (acting as a memory conveyor belt) and three regulator gates, LSTMs learn long-range temporal dependencies in sequential stock prices.
            </p>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid rgba(255, 255, 255, 0.04)', 
              borderRadius: '8px', 
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: '#38bdf8',
              lineHeight: 1.6
            }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>CORE LSTM CELL EQUATIONS:</div>
              {`Forget Gate:     f_t = σ(W_f · [h_{t-1}, x_t] + b_f)
Input Gate:      i_t = σ(W_i · [h_{t-1}, x_t] + b_i)
Candidate State:  C~_t = tanh(W_c · [h_{t-1}, x_t] + b_c)
Updated Cell:    C_t = f_t * C_{t-1} + i_t * C~_t
Output Gate:     o_t = σ(W_o · [h_{t-1}, x_t] + b_o)
Hidden Output:   h_t = o_t * tanh(C_t)`}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
              *Here, σ represents the sigmoid activation mapping values to [0,1] for gating decisions, and tanh scales values to [-1,1] to manage network gradients.
            </p>
          </div>

          {/* Random Forest Explainer */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Code size={18} style={{ color: 'var(--color-green)' }} />
              2. Random Forest Regression
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              An ensemble machine learning model that constructs multiple decision trees during training. For regression tasks, the prediction is the average of predictions from individual trees.
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Bootstrap Aggregation (Bagging):</strong> Each tree is trained on a random bootstrap sample of data, decreasing total ensemble variance.</li>
              <li><strong>Feature Randomness:</strong> At each node split, only a random subset of features is evaluated, reducing tree correlation and increasing robustness to outliers.</li>
              <li><strong>Split Criteria:</strong> Formulated by minimizing Mean Squared Error (MSE) at each node split: 
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#10b981', display: 'block', margin: '4px 0' }}>
                  MSE = (1/N) * Σ (y_i - ŷ_i)²
                </span>
              </li>
            </ul>
          </div>

          {/* Prophet Explainer */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <LineChart size={18} style={{ color: 'var(--color-blue)' }} />
              3. Prophet Additive Time-Series Model
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              Prophet is an additive regression model developed by Facebook for forecasting time-series data. It works by decomposing the target variable into trends, seasonal components, and holiday events.
            </p>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid rgba(255, 255, 255, 0.04)', 
              borderRadius: '8px', 
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: '#22d3ee',
              lineHeight: 1.6
            }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>PROPHET MODEL DECOMPOSITION:</div>
              {`y(t) = g(t) + s(t) + h(t) + ε_t`}
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '6px' }}>
                {`- g(t): Piecewise linear or logistic growth trend (non-periodic growth).
- s(t): Seasonal periodic changes (e.g., weekly, yearly effects via Fourier series).
- h(t): Irregular holiday effects (predefined calendar-based shock dates).
- ε_t: Idiosyncratic error term representing unmodeled variance (Gaussian white noise).`}
              </div>
            </div>
          </div>

          {/* Quantitative Performance Formulas */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Award size={18} style={{ color: 'var(--color-yellow)' }} />
              4. Quantitative Performance Metrics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>Sharpe Ratio (Risk-Adjusted Return)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Quantifies the excess return generated per unit of risk/volatility.
                </p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-yellow)', margin: '6px 0' }}>
                  Sharpe = (E[R_p] - R_f) / σ_p
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  R_p: strategy return | R_f: risk-free rate (2%) | σ_p: annualized volatility of strategy.
                </span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>Maximum Drawdown (MDD)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Measures the absolute largest historical peak-to-trough peak loss of capital.
                </p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-yellow)', margin: '6px 0' }}>
                  MDD = (Peak - Trough) / Peak
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  Assesses downside capital protection and maximum risk exposure of strategy.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '8px 24px' }}>
            Acknowledge Technical Card
          </button>
        </div>
      </div>
    </div>
  );
};
