import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { BacktestResult, BacktestSummary, StockDataPoint, PredictionResult } from '../types/stock';
import { runBacktest } from '../utils/mlSimulator';
import { Landmark, ArrowUpRight, ShieldAlert, Coins, RefreshCw } from 'lucide-react';

interface BacktestingEngineProps {
  historicalData: StockDataPoint[];
  predictions: PredictionResult[];
  isTrained: boolean;
}

export const BacktestingEngine: React.FC<BacktestingEngineProps> = ({
  historicalData,
  predictions,
  isTrained,
}) => {
  const [strategy, setStrategy] = useState<'TREND_FOLLOW' | 'RSI_PREDICTIVE'>('TREND_FOLLOW');
  const [capital, setCapital] = useState<number>(10000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [backtestData, setBacktestData] = useState<{ results: BacktestResult[]; summary: BacktestSummary } | null>(null);

  // Run backtest automatically when model is trained or stock changes
  useEffect(() => {
    if (isTrained && predictions.length > 0) {
      handleRunBacktest();
    } else {
      setBacktestData(null);
    }
  }, [isTrained, predictions, strategy]); // runs when trained, predictions change, or strategy toggles

  const handleRunBacktest = () => {
    setIsRunning(true);
    // Add small delay for realistic UI processing feel
    setTimeout(() => {
      const data = runBacktest(historicalData, predictions, capital, strategy);
      setBacktestData(data);
      setIsRunning(false);
    }, 500);
  };

  if (!isTrained) {
    return (
      <div className="glass-card animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', minHeight: '150px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Compile and train the machine learning model to unlock historical backtesting simulations...
      </div>
    );
  }

  const summary = backtestData?.summary;
  const isStrategyWinner = summary ? summary.totalStrategyReturn >= summary.totalBuyHoldReturn : false;

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card-title" style={{ margin: 0, justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Landmark size={18} style={{ color: 'var(--color-purple)' }} />
          Quantitative Strategy Backtester
        </span>
      </div>

      {/* Backtesting Parameter Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="form-group">
          <label className="form-label">Strategy Mode</label>
          <select 
            className="select-input"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as any)}
            disabled={isRunning}
          >
            <option value="TREND_FOLLOW">Predictive Swing (Trend Following)</option>
            <option value="RSI_PREDICTIVE">RSI Overbought/Oversold Filter</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Starting Capital ($)</label>
          <input 
            type="number"
            className="select-input"
            value={capital}
            onChange={(e) => setCapital(Math.max(100, parseInt(e.target.value) || 0))}
            disabled={isRunning}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '10px' }}
            onClick={handleRunBacktest}
            disabled={isRunning}
          >
            <RefreshCw size={14} className={isRunning ? 'synapse-active' : ''} />
            Re-run Backtest Simulation
          </button>
        </div>
      </div>

      {summary && backtestData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Performance Indicators (KPIs) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            
            {/* Strategy Return */}
            <div style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Coins size={12} style={{ color: 'var(--color-green)' }} />
                Strategy Return
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-green)', marginTop: '4px' }}>
                {summary.totalStrategyReturn >= 0 ? '+' : ''}{summary.totalStrategyReturn}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                Portfolio: ${summary.finalStrategyValue.toLocaleString()}
              </div>
            </div>

            {/* Benchmark Return */}
            <div style={{ background: 'rgba(6, 182, 212, 0.03)', border: '1px solid rgba(6, 182, 212, 0.1)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Landmark size={12} style={{ color: 'var(--color-blue)' }} />
                Buy & Hold Return
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-blue)', marginTop: '4px' }}>
                {summary.totalBuyHoldReturn >= 0 ? '+' : ''}{summary.totalBuyHoldReturn.toFixed(2)}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                Portfolio: ${summary.finalBuyHoldValue.toLocaleString()}
              </div>
            </div>

            {/* Sharpe Ratio */}
            <div style={{ background: 'rgba(139, 92, 246, 0.03)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={12} style={{ color: 'var(--color-purple)' }} />
                Sharpe Ratio
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-purple)', marginTop: '4px' }}>
                {summary.sharpeRatio.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {summary.sharpeRatio > 2.0 ? 'Excellent' : summary.sharpeRatio > 1.0 ? 'Acceptable' : 'Sub-optimal'}
              </div>
            </div>

            {/* Max Drawdown */}
            <div style={{ background: 'rgba(244, 63, 94, 0.03)', border: '1px solid rgba(244, 63, 94, 0.1)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldAlert size={12} style={{ color: 'var(--color-red)' }} />
                Max Drawdown
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-red)', marginTop: '4px' }}>
                -{summary.maxDrawdown}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Peak-to-trough risk
              </div>
            </div>

            {/* Strategy Win Rate */}
            <div style={{ background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.1)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Coins size={12} style={{ color: 'var(--color-yellow)' }} />
                Strategy Win Rate
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-yellow)', marginTop: '4px' }}>
                {summary.winRate}%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Profitable trade ratio
              </div>
            </div>

          </div>

          {/* Outperformance Banner */}
          <div 
            style={{ 
              background: isStrategyWinner ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
              border: `1px solid ${isStrategyWinner ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '0.8rem',
              color: isStrategyWinner ? 'var(--color-green)' : 'var(--color-red)',
              fontWeight: 600
            }}
          >
            {isStrategyWinner 
              ? `Strategy outpaced standard Buy & Hold by ${(summary.totalStrategyReturn - summary.totalBuyHoldReturn).toFixed(2)}% net returns.`
              : `Buy & Hold outpaced the strategy by ${(summary.totalBuyHoldReturn - summary.totalStrategyReturn).toFixed(2)}% due to high market momentum.`
            }
          </div>

          {/* Cumulative Return Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              CUMULATIVE PORTFOLIO PERFORMANCE YIELD OVER TIME ($)
            </div>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={backtestData.results} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(tick) => {
                      const date = new Date(tick);
                      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    }} 
                    stroke="var(--text-muted)"
                    style={{ fontSize: '0.6rem', fontFamily: 'var(--font-sans)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="var(--text-muted)"
                    style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)' }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: '0.7rem', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.05)' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }} />
                  
                  {/* Strategy returns curve */}
                  <defs>
                    <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-green)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--color-green)" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorBuyHold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-blue)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--color-blue)" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>

                  <Area 
                    type="monotone" 
                    name="AlphaTrend Strategy" 
                    dataKey="strategyValue" 
                    stroke="var(--color-green)" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorStrategy)"
                  />
                  <Area 
                    type="monotone" 
                    name="Buy & Hold Benchmark" 
                    dataKey="buyAndHoldValue" 
                    stroke="var(--color-blue)" 
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorBuyHold)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
