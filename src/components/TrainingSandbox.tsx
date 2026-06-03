import React, { useEffect, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { TrainingLog } from '../types/stock';
import { Terminal, Shield, Zap } from 'lucide-react';

interface TrainingSandboxProps {
  logs: TrainingLog[];
  isTraining: boolean;
  modelName: string;
}

export const TrainingSandbox: React.FC<TrainingSandboxProps> = ({
  logs,
  isTraining,
  modelName,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Extract loss history for the mini-chart
  const chartData = logs.map((l) => ({
    epoch: l.epoch,
    loss: l.loss,
    valLoss: l.valLoss,
  }));

  // Define neural network coordinates for SVG (Input: 4, Hidden1: 5, Hidden2: 4, Output: 1)
  const layerSizes = [4, 5, 4, 1];
  const width = 360;
  const height = 150;
  const paddingX = 40;
  const paddingY = 15;

  const getNeuronCoords = () => {
    const coords: { x: number; y: number; layer: number; index: number }[][] = [];
    const colSpacing = (width - paddingX * 2) / (layerSizes.length - 1);

    layerSizes.forEach((size, lIndex) => {
      const layerCoords: { x: number; y: number; layer: number; index: number }[] = [];
      const x = paddingX + lIndex * colSpacing;
      const rowSpacing = (height - paddingY * 2) / (size - 1 || 1);
      const startY = size === 1 ? height / 2 : paddingY;

      for (let i = 0; i < size; i++) {
        layerCoords.push({
          x,
          y: size === 1 ? startY : startY + i * rowSpacing,
          layer: lIndex,
          index: i,
        });
      }
      coords.push(layerCoords);
    });

    return coords;
  };

  const neuronLayers = getNeuronCoords();

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card-title" style={{ margin: 0, justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} style={{ color: 'var(--color-yellow)' }} />
          Network Training Sandbox & Analytics
        </span>
        {isTraining && (
          <span className="badge badge-purple" style={{ animation: 'pulseGlow 2s infinite' }}>
            LIVE RUN
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* SVG Neural Network Visualization */}
        <div style={{ 
          background: '#060913', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          borderRadius: '8px', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          minHeight: '200px'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-start' }}>
            <Shield size={12} style={{ color: 'var(--color-purple)' }} />
            LAYER ACTIVATION PATHWAYS ({modelName})
          </div>

          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '380px' }}>
            {/* Draw Synapses (Connections) */}
            {neuronLayers.map((layer, lIndex) => {
              if (lIndex === neuronLayers.length - 1) return null;
              const nextLayer = neuronLayers[lIndex + 1];

              return layer.map((source) => 
                nextLayer.map((target, tIndex) => {
                  const isActive = isTraining && (source.index + target.index + lIndex) % 2 === 0;
                  return (
                    <line
                      key={`synapse-${lIndex}-${source.index}-${tIndex}`}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isActive ? 'var(--color-purple)' : 'rgba(255,255,255,0.06)'}
                      strokeWidth={isActive ? 1.2 : 0.6}
                      className={isActive ? 'synapse-active' : ''}
                    />
                  );
                })
              );
            })}

            {/* Draw Neurons */}
            {neuronLayers.map((layer) => 
              layer.map((n) => {
                const isActive = isTraining;
                let color = 'rgba(255, 255, 255, 0.15)';
                if (isActive) {
                  if (n.layer === 0) color = 'var(--color-blue)';
                  else if (n.layer === neuronLayers.length - 1) color = 'var(--color-green)';
                  else color = 'var(--color-purple)';
                }

                return (
                  <g key={`neuron-${n.layer}-${n.index}`}>
                    {/* Glowing outer circle */}
                    {isActive && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={6}
                        fill={color}
                        opacity={0.3}
                        className="neuron-active"
                      />
                    )}
                    {/* Inner core circle */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={4}
                      fill={color}
                      stroke="#060913"
                      strokeWidth={1}
                    />
                  </g>
                );
              })
            )}
          </svg>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-blue)' }}></span>
              Inputs
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-purple)' }}></span>
              Hidden Weights
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-green)' }}></span>
              Outputs
            </span>
          </div>
        </div>

        {/* Live Loss Chart */}
        <div style={{ 
          background: '#060913', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          borderRadius: '8px', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minHeight: '200px'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Terminal size={12} style={{ color: 'var(--color-red)' }} />
            GRADIENT CONVERGENCE (MSE LOSS)
          </div>

          <div style={{ width: '100%', height: '140px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="epoch" 
                    stroke="var(--text-muted)"
                    style={{ fontSize: '0.55rem', fontFamily: 'var(--font-sans)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="var(--text-muted)"
                    style={{ fontSize: '0.55rem', fontFamily: 'var(--font-mono)' }}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ fontSize: '0.65rem', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.05)' }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }} />
                  <Line 
                    type="monotone" 
                    name="Train Loss" 
                    dataKey="loss" 
                    stroke="var(--color-red)" 
                    strokeWidth={1.5} 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    name="Val Loss" 
                    dataKey="valLoss" 
                    stroke="var(--color-purple)" 
                    strokeWidth={1.5} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Awaiting training initialization...
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Terminal Log Console */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Terminal size={14} /> LIVE STACK TRAINING CONSOLE Logs
        </div>
        <div className="terminal-console" ref={terminalRef}>
          {logs.length > 0 ? (
            logs.map((log, index) => {
              let styleClass = 'terminal-line';
              if (log.message.includes('complete') || log.message.includes('Finalizing')) {
                styleClass = 'terminal-line success';
              } else if (log.message.includes('Initializing') || log.message.includes('Validating')) {
                styleClass = 'terminal-line info';
              }
              return (
                <div key={index} className={styleClass}>
                  {`> ${log.message}`}
                </div>
              );
            })
          ) : (
            <div className="terminal-line" style={{ color: 'var(--text-muted)' }}>
              {`> System idle. Click "Compile & Train Model" above to initiate model network calculations.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
