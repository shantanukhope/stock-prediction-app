import React, { useState } from 'react';
import type { StockSymbol, StockInfo } from '../types/stock';
import { TrendingUp, Cpu, Award, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface DashboardHeaderProps {
  currentSymbol: StockSymbol;
  onSymbolChange: (symbol: StockSymbol) => void;
  stockInfo: StockInfo;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentSymbol,
  onSymbolChange,
  stockInfo,
}) => {
  const [showRecruiterInfo, setShowRecruiterInfo] = useState(true);

  const symbols: { symbol: StockSymbol; name: string }[] = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
  ];

  const isPositive = stockInfo.change >= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      {/* Recruiter Showcase Banner */}
      <div 
        className="glass-card" 
        style={{ 
          borderColor: 'rgba(139, 92, 246, 0.3)', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(17, 24, 39, 0.8) 100%)',
          padding: '16px 24px',
          boxShadow: 'var(--shadow-purple)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowRecruiterInfo(!showRecruiterInfo)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award style={{ color: 'var(--color-purple)' }} size={24} />
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, letterSpacing: '0.02em' }}>
              RECRUITER & PLACEMENT PANEL: Project Highlights
            </h2>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            {showRecruiterInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {showRecruiterInfo && (
          <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={16} style={{ color: 'var(--color-purple)' }} />
                Simulated ML Engine
              </div>
              Runs dynamic, client-side simulations of **LSTM**, **Random Forest**, and **Prophet** forecasting workflows. Displays real-time epoch logs, gradient loss convergence curves, and network synapse weights.
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} style={{ color: 'var(--color-green)' }} />
                Backtesting Framework
              </div>
              Implements quantitative backtests calculating portfolio metrics: ** Sharpe Ratio**, **Max Drawdown**, **Win Rate**, and **Cumulative Yield** comparing predictions against a standard buy-and-hold benchmark.
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} style={{ color: 'var(--color-blue)' }} />
                Math & Data Foundations
              </div>
              Generates assets using **Geometric Brownian Motion (GBM)** with drift & volatility equations. Implements native JS algorithms for **Box-Muller** Gaussian variables, **Bollinger Bands**, **SMA**, **EMA**, and smoothed **RSI**.
            </div>
          </div>
        )}
      </div>

      {/* Main Header / Navigation */}
      <div 
        className="glass-card" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          padding: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              background: 'var(--color-purple-muted)', 
              border: '1px solid var(--color-purple)', 
              borderRadius: '10px', 
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-purple)'
            }}>
              <TrendingUp size={24} style={{ color: 'var(--color-purple)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AlphaTrend AI
              </h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v1.0.0 // ML Stock Forecasting</span>
            </div>
          </div>

          {/* Ticker Selector */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {symbols.map((item) => (
              <button
                key={item.symbol}
                className={`btn btn-secondary ${currentSymbol === item.symbol ? 'active' : ''}`}
                onClick={() => onSymbolChange(item.symbol)}
                style={{ padding: '8px 14px', fontSize: '0.8rem' }}
              >
                <span style={{ fontWeight: 700 }}>{item.symbol}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.7, marginLeft: '4px' }}>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stock Details Grid */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{stockInfo.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({stockInfo.symbol})</span></h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '700px' }}>{stockInfo.description}</p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                ${stockInfo.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className={`badge ${isPositive ? 'badge-green' : 'badge-red'}`} style={{ marginTop: '4px', fontSize: '0.8rem' }}>
                {isPositive ? '+' : ''}{stockInfo.change.toFixed(2)} ({isPositive ? '+' : ''}{stockInfo.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Stats Items */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
            gap: '12px', 
            background: 'rgba(255, 255, 255, 0.02)', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid rgba(255, 255, 255, 0.04)' 
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>High</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                ${stockInfo.high.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Low</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                ${stockInfo.low.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Volume</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {stockInfo.volume.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Market Cap</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {stockInfo.marketCap}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>P/E Ratio</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {stockInfo.peRatio}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Beta</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {stockInfo.beta.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
