export type StockSymbol = 'AAPL' | 'TSLA' | 'NVDA' | 'MSFT' | 'BTC' | 'ETH';

export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  ema50?: number;
  upperBB?: number;
  lowerBB?: number;
  rsi?: number;
}

export type ModelType = 'LSTM' | 'PROPHET' | 'RANDOM_FOREST';

export interface Hyperparameters {
  learningRate: number;
  epochs: number;
  lookbackWindow: number;
  splitRatio: number;
}

export interface ModelMetrics {
  rmse: number;
  mae: number;
  r2: number;
  directionalAccuracy: number;
}

export interface PredictionResult {
  date: string;
  actual?: number;
  predicted: number;
  confUpper: number;
  confLower: number;
}

export interface BacktestResult {
  date: string;
  strategyValue: number;
  buyAndHoldValue: number;
  strategyReturn: number;
  buyAndHoldReturn: number;
  position: 'BUY' | 'SELL' | 'HOLD';
}

export interface BacktestSummary {
  initialCapital: number;
  finalStrategyValue: number;
  finalBuyHoldValue: number;
  totalStrategyReturn: number;
  totalBuyHoldReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
}

export interface TrainingLog {
  epoch: number;
  loss: number;
  valLoss: number;
  message: string;
}

export interface StockInfo {
  symbol: StockSymbol;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap: string;
  peRatio: string;
  beta: number;
  description: string;
}
