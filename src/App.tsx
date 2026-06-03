import { useState, useEffect } from 'react';
import type { StockSymbol, StockDataPoint, ModelType, Hyperparameters, ModelMetrics, PredictionResult, TrainingLog } from './types/stock';
import { generateHistoricalData, getStockInfo } from './utils/stockData';
import { generateTrainingLogs } from './utils/mlSimulator';
import { DashboardHeader } from './components/DashboardHeader';
import { PriceChart } from './components/PriceChart';
import { ModelSelector } from './components/ModelSelector';
import { TrainingSandbox } from './components/TrainingSandbox';
import { PredictionMetrics } from './components/PredictionMetrics';
import { BacktestingEngine } from './components/BacktestingEngine';
import { TechnicalModal } from './components/TechnicalModal';
import { BookOpen, GitBranch } from 'lucide-react';

function App() {
  // Global App States
  const [symbol, setSymbol] = useState<StockSymbol>('AAPL');
  const [historicalData, setHistoricalData] = useState<StockDataPoint[]>([]);
  const [modelType, setModelType] = useState<ModelType>('LSTM');
  const [params, setParams] = useState<Hyperparameters>({
    learningRate: 0.01,
    epochs: 50,
    lookbackWindow: 20,
    splitRatio: 0.8,
  });

  // Training & Prediction states
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isTrained, setIsTrained] = useState<boolean>(false);
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Initialize stock data when symbol changes
  useEffect(() => {
    const data = generateHistoricalData(symbol, 200);
    setHistoricalData(data);
    
    // Reset model training state when asset changes
    setIsTrained(false);
    setIsTraining(false);
    setLogs([]);
    setMetrics(null);
    setPredictions([]);
  }, [symbol]);

  // Handle Model Training Trigger
  const handleTrainModel = () => {
    setIsTraining(true);
    setIsTrained(false);
    setLogs([]);
    setMetrics(null);
    setPredictions([]);

    generateTrainingLogs(
      modelType,
      params,
      // onLog callback
      (log) => {
        setLogs((prev) => [...prev, log]);
      },
      // onComplete callback
      (finalMetrics, finalPredictions) => {
        setMetrics(finalMetrics);
        setPredictions(finalPredictions);
        setIsTraining(false);
        setIsTrained(true);
      },
      historicalData
    );
  };

  // Determine trend direction of prediction
  const getPredictionTrend = (): 'UP' | 'DOWN' | 'STABLE' => {
    if (predictions.length === 0) return 'STABLE';
    // Get last prediction and prediction from today (start of forecasting)
    const futurePreds = predictions.filter(p => p.actual === undefined);
    if (futurePreds.length < 2) return 'STABLE';
    
    const startVal = futurePreds[0].predicted;
    const endVal = futurePreds[futurePreds.length - 1].predicted;
    const diffPercent = (endVal - startVal) / startVal;

    if (diffPercent > 0.01) return 'UP';
    if (diffPercent < -0.01) return 'DOWN';
    return 'STABLE';
  };

  // Get current quote info
  const latestDataPoint = historicalData[historicalData.length - 1];
  const prevDataPoint = historicalData[historicalData.length - 2];
  
  const currentPrice = latestDataPoint ? latestDataPoint.close : 0;
  const priceChange = latestDataPoint && prevDataPoint ? latestDataPoint.close - prevDataPoint.close : 0;
  const priceChangePercent = latestDataPoint && prevDataPoint ? (priceChange / prevDataPoint.close) * 100 : 0;

  const stockInfo = latestDataPoint 
    ? getStockInfo(symbol, currentPrice, priceChange, priceChangePercent)
    : {
        symbol,
        name: '',
        price: 0,
        change: 0,
        changePercent: 0,
        high: 0,
        low: 0,
        volume: 0,
        marketCap: '',
        peRatio: '',
        beta: 1.0,
        description: '',
      };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header style={{
        height: 'var(--header-height)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitBranch style={{ color: 'var(--color-purple)' }} size={20} />
          <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
            ALPHATREND.AI
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setIsModalOpen(true)}
          >
            <BookOpen size={14} />
            Math & Architectures
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="main-content">
        
        {/* Row 1: Header and Stock Quotes */}
        <DashboardHeader 
          currentSymbol={symbol}
          onSymbolChange={setSymbol}
          stockInfo={stockInfo}
        />

        {/* Row 2: Sidebar Configs vs Chart Workspace */}
        <div className="grid-cols-12">
          
          {/* Main Visualizers (Col 8) */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PriceChart 
              historicalData={historicalData}
              predictions={predictions}
            />

            <PredictionMetrics 
              metrics={metrics}
              predictionTrend={getPredictionTrend()}
            />

            <BacktestingEngine 
              historicalData={historicalData}
              predictions={predictions}
              isTrained={isTrained}
            />
          </div>

          {/* Configuration Sandbox (Col 4) */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ModelSelector 
              selectedModel={modelType}
              onModelChange={setModelType}
              hyperparameters={params}
              onParamsChange={setParams}
              onTrain={handleTrainModel}
              isTraining={isTraining}
              isTrained={isTrained}
            />

            <TrainingSandbox 
              logs={logs}
              isTraining={isTraining}
              modelName={modelType}
            />
          </div>

        </div>
      </main>

      {/* Bottom Footer Info */}
      <footer style={{
        padding: '24px',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginTop: 'auto'
      }}>
        AlphaTrend AI // Quantitative Portfolio Analysis Tool. Engineered for placement demonstrations.
      </footer>

      {/* Technical explainer Modal overlay */}
      <TechnicalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
