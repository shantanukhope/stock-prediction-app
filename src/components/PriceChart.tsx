import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ReferenceLine
} from 'recharts';
import type { StockDataPoint, PredictionResult } from '../types/stock';
import { Activity, BarChart2, Eye } from 'lucide-react';

interface PriceChartProps {
  historicalData: StockDataPoint[];
  predictions: PredictionResult[];
}

export const PriceChart: React.FC<PriceChartProps> = ({
  historicalData,
  predictions,
}) => {
  // Indicator states
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [showBB, setShowBB] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [showPredictions, setShowPredictions] = useState(true);

  // Merge historical data and predictions for Recharts
  // Build lookup map for predictions
  const predMap = new Map<string, PredictionResult>();
  predictions.forEach(p => predMap.set(p.date, p));

  const chartData: any[] = [];

  const lastHistIndex = historicalData.length - 1;

  // Add historical points
  historicalData.forEach((d, i) => {
    const pred = predMap.get(d.date);
    chartData.push({
      date: d.date,
      close: d.close,
      sma20: d.sma20,
      ema50: d.ema50,
      upperBB: d.upperBB,
      lowerBB: d.lowerBB,
      rsi: d.rsi,
      predHistorical: pred ? pred.predicted : null,
      predFuture: (i === lastHistIndex && pred) ? pred.predicted : null,
      confUpper: pred ? pred.confUpper : null,
      confLower: pred ? pred.confLower : null,
    });
  });

  // Add future forecasts (points in predictions not in historicalData)
  const histDates = new Set(historicalData.map(d => d.date));
  predictions.forEach(p => {
    if (!histDates.has(p.date)) {
      chartData.push({
        date: p.date,
        close: null,
        predHistorical: null,
        predFuture: p.predicted,
        confUpper: p.confUpper,
        confLower: p.confLower,
      });
    }
  });

  // Format date for XAxis
  const formatXAxis = (tick: string) => {
    try {
      const date = new Date(tick);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return tick;
    }
  };

  // Custom tooltip renderer
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Sort payload to keep it clean
      return (
        <div className="custom-tooltip">
          <p style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '4px' }}>
            {label}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
            {payload.map((entry: any, index: number) => {
              if (entry.value === undefined || entry.value === null) return null;
              
              let valueStr = `$${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
              if (entry.name === 'RSI') {
                valueStr = entry.value.toFixed(1);
              }

              return (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
                  <span style={{ color: entry.color || entry.stroke, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color || entry.stroke }}></span>
                    {entry.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {valueStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="card-title" style={{ margin: 0 }}>
          <Activity size={18} style={{ color: 'var(--color-purple)' }} />
          Interactive Price Chart & Forecast Projection
        </div>

        {/* Chart Indicator Controls */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-secondary ${showPredictions ? 'active' : ''}`}
            onClick={() => setShowPredictions(!showPredictions)}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            disabled={predictions.length === 0}
          >
            <Eye size={12} /> ML Predictions
          </button>
          <button 
            className={`btn btn-secondary ${showSMA ? 'active' : ''}`}
            onClick={() => setShowSMA(!showSMA)}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            SMA-20
          </button>
          <button 
            className={`btn btn-secondary ${showEMA ? 'active' : ''}`}
            onClick={() => setShowEMA(!showEMA)}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            EMA-50
          </button>
          <button 
            className={`btn btn-secondary ${showBB ? 'active' : ''}`}
            onClick={() => setShowBB(!showBB)}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            Bollinger Bands
          </button>
          <button 
            className={`btn btn-secondary ${showRSI ? 'active' : ''}`}
            onClick={() => setShowRSI(!showRSI)}
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            RSI-14
          </button>
        </div>
      </div>

      {/* Main Chart Container */}
      <div style={{ width: '100%', height: '400px', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis} 
              stroke="var(--text-muted)"
              style={{ fontSize: '0.7rem', fontFamily: 'var(--font-sans)' }}
              dy={10}
              tickLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="var(--text-muted)"
              style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}
              tickLine={false}
              dx={-5}
            />
            <Tooltip content={<CustomChartTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconSize={10} 
              iconType="circle"
              wrapperStyle={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}
            />

            {/* Bollinger Bands Shading */}
            {showBB && (
              <Area 
                name="Bollinger Band"
                dataKey="upperBB" 
                stroke="transparent" 
                fill="rgba(245, 158, 11, 0.05)" 
                activeDot={false}
                legendType="none"
              />
            )}
            {showBB && (
              <Area 
                name="Bollinger Band"
                dataKey="lowerBB" 
                stroke="transparent" 
                fill="transparent" 
                activeDot={false}
                legendType="none"
              />
            )}

            {/* Prediction Interval Cone (shaded area) */}
            {showPredictions && predictions.length > 0 && (
              <Area 
                name="Confidence Range (95%)"
                dataKey="confUpper" 
                stroke="transparent" 
                fill="rgba(139, 92, 246, 0.08)"
                activeDot={false}
              />
            )}

            {/* Actual historical stock price */}
            <Line 
              type="monotone" 
              name="Close Price" 
              dataKey="close" 
              stroke="#cbd5e1" /* slate-300 */
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 4, stroke: 'var(--bg-main)', strokeWidth: 2 }}
            />

            {/* Simulated ML Historical Fit Line */}
            {showPredictions && predictions.length > 0 && (
              <Line 
                type="monotone" 
                name="AI Historical Fit" 
                dataKey="predHistorical" 
                stroke="var(--color-purple)" 
                strokeWidth={1.5} 
                dot={false}
              />
            )}

            {/* Simulated ML Future Forecast Line */}
            {showPredictions && predictions.length > 0 && (
              <Line 
                type="monotone" 
                name="AI Forecast Projection" 
                dataKey="predFuture" 
                stroke="var(--color-purple)" 
                strokeWidth={2} 
                strokeDasharray="3 3"
                dot={false}
              />
            )}

            {/* Indicators overlays */}
            {showSMA && (
              <Line 
                type="monotone" 
                name="SMA (20)" 
                dataKey="sma20" 
                stroke="var(--color-yellow)" 
                strokeWidth={1.5} 
                dot={false} 
              />
            )}
            {showEMA && (
              <Line 
                type="monotone" 
                name="EMA (50)" 
                dataKey="ema50" 
                stroke="var(--color-blue)" 
                strokeWidth={1.5} 
                dot={false} 
              />
            )}

            {/* Vertical demarcation line representing today's date */}
            {predictions.length > 0 && historicalData.length > 0 && (
              <ReferenceLine 
                x={historicalData[historicalData.length - 1].date} 
                stroke="rgba(255, 255, 255, 0.4)" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'TODAY', 
                  position: 'top', 
                  fill: 'var(--text-secondary)', 
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em'
                }} 
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* RSI Sub-Chart Panel */}
      {showRSI && (
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }} className="animate-fade-in">
          <div className="card-title" style={{ fontSize: '0.75rem', margin: 0 }}>
            <BarChart2 size={14} style={{ color: 'var(--color-yellow)' }} />
            Relative Strength Index (RSI-14 Oscillator)
          </div>
          <div style={{ width: '100%', height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData.filter(d => d.rsi !== undefined)} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis} 
                  stroke="var(--text-muted)"
                  style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  ticks={[30, 50, 70]}
                  stroke="var(--text-muted)"
                  style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}
                  tickLine={false}
                  dx={-5}
                />
                <Tooltip content={<CustomChartTooltip />} />

                {/* Overbought / Oversold zones shading */}
                <ReferenceLine y={70} stroke="rgba(244, 63, 94, 0.3)" strokeDasharray="3 3" />
                <ReferenceLine y={30} stroke="rgba(16, 185, 129, 0.3)" strokeDasharray="3 3" />
                <ReferenceLine y={50} stroke="rgba(255, 255, 255, 0.1)" />

                <Line 
                  type="monotone" 
                  name="RSI" 
                  dataKey="rsi" 
                  stroke="var(--color-yellow)" 
                  strokeWidth={1.5} 
                  dot={false} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
