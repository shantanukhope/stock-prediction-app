import type { StockSymbol, StockDataPoint, StockInfo } from '../types/stock';

// Helper for Box-Muller transform to get Gaussian distribution
function randNormal(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

// Asset Profile Parameters for GBM
interface AssetProfile {
  name: string;
  startPrice: number;
  drift: number;      // Annual growth rate
  volatility: number; // Annual volatility
  peRatio: string;
  marketCap: string;
  beta: number;
  description: string;
}

const ASSET_PROFILES: Record<StockSymbol, AssetProfile> = {
  AAPL: {
    name: 'Apple Inc.',
    startPrice: 175.5,
    drift: 0.12,
    volatility: 0.18,
    peRatio: '31.4',
    marketCap: '2.89T',
    beta: 1.12,
    description: 'Consumer electronics leader known for high brand loyalty, ecosystem lock-in, and stable cash flows.',
  },
  TSLA: {
    name: 'Tesla, Inc.',
    startPrice: 180.2,
    drift: 0.22,
    volatility: 0.42,
    peRatio: '58.7',
    marketCap: '568B',
    beta: 2.10,
    description: 'Electric vehicle pioneer and clean energy company characterized by high growth and extreme price volatility.',
  },
  NVDA: {
    name: 'NVIDIA Corporation',
    startPrice: 850.0,
    drift: 0.35,
    volatility: 0.38,
    peRatio: '68.2',
    marketCap: '2.26T',
    beta: 1.85,
    description: 'Semiconductor giant leading the artificial intelligence computing expansion with top-tier GPUs.',
  },
  MSFT: {
    name: 'Microsoft Corporation',
    startPrice: 415.0,
    drift: 0.15,
    volatility: 0.15,
    peRatio: '35.1',
    marketCap: '3.12T',
    beta: 0.88,
    description: 'Enterprise software behemoth capitalizing on cloud computing (Azure) and enterprise AI integrations.',
  },
  BTC: {
    name: 'Bitcoin (USD)',
    startPrice: 65000,
    drift: 0.30,
    volatility: 0.55,
    peRatio: 'N/A',
    marketCap: '1.28T',
    beta: 2.45,
    description: 'The first and largest decentralized digital asset, serving as digital gold and market sentiment leader.',
  },
  ETH: {
    name: 'Ethereum (USD)',
    startPrice: 3450.0,
    drift: 0.28,
    volatility: 0.60,
    peRatio: 'N/A',
    marketCap: '414B',
    beta: 2.60,
    description: 'Smart contract network underpinning decentralized finance (DeFi) and web3 application protocols.',
  },
};

// Generate Historical Stock Data using Geometric Brownian Motion (GBM)
export function generateHistoricalData(symbol: StockSymbol, daysCount = 200): StockDataPoint[] {
  const profile = ASSET_PROFILES[symbol];
  const dt = 1 / 252; // Time step (1 trading day)
  const data: StockDataPoint[] = [];

  // Generate date list excluding weekends
  const dates: string[] = [];
  const currentDate = new Date();
  // Go backward in time
  let dIndex = 0;
  while (dates.length < daysCount) {
    const tempDate = new Date(currentDate);
    tempDate.setDate(currentDate.getDate() - dIndex);
    const day = tempDate.getDay();
    // Exclude weekends for stocks (standard market schedules)
    if (day !== 0 && day !== 6) {
      dates.unshift(tempDate.toISOString().split('T')[0]);
    }
    dIndex++;
  }

  let currentPrice = profile.startPrice;

  // Simulate price changes forward
  for (let i = 0; i < daysCount; i++) {
    const driftTerm = (profile.drift - 0.5 * Math.pow(profile.volatility, 2)) * dt;
    const diffusionTerm = profile.volatility * randNormal(0, 1) * Math.sqrt(dt);
    
    // GBM formula
    const nextPrice = currentPrice * Math.exp(driftTerm + diffusionTerm);
    
    const open = currentPrice;
    const close = nextPrice;
    const volatilityIntraday = profile.volatility * 0.08; // Scaling factor for daily high/low
    
    const maxVal = Math.max(open, close);
    const minVal = Math.min(open, close);
    const high = maxVal + Math.abs(randNormal(0, 1)) * volatilityIntraday * currentPrice;
    const low = minVal - Math.abs(randNormal(0, 1)) * volatilityIntraday * currentPrice;
    
    const volumeMultiplier = symbol === 'BTC' || symbol === 'ETH' ? 100000 : 10000;
    const volume = Math.round(randNormal(50, 15) * volumeMultiplier);

    data.push({
      date: dates[i],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume,
    });

    currentPrice = nextPrice;
  }

  // Calculate technical indicators
  calculateIndicators(data);

  return data;
}

// Get Stock Profile Info
export function getStockInfo(symbol: StockSymbol, currentPrice: number, dailyChange: number, dailyChangePercent: number): StockInfo {
  const profile = ASSET_PROFILES[symbol];
  const history = generateHistoricalData(symbol, 2);
  const prevClose = history[0].close;

  // Randomize daily stats for realistic look
  const high = Math.max(currentPrice, prevClose) * 1.015;
  const low = Math.min(currentPrice, prevClose) * 0.985;
  const volume = Math.round(5000000 + Math.random() * 8000000);

  return {
    symbol,
    name: profile.name,
    price: parseFloat(currentPrice.toFixed(2)),
    change: parseFloat(dailyChange.toFixed(2)),
    changePercent: parseFloat(dailyChangePercent.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    volume,
    marketCap: profile.marketCap,
    peRatio: profile.peRatio,
    beta: profile.beta,
    description: profile.description,
  };
}

// Calculate indicators: SMA-20, EMA-50, Bollinger Bands, RSI-14
function calculateIndicators(data: StockDataPoint[]): void {
  const len = data.length;
  if (len < 50) return; // Need at least 50 points

  // SMA-20 and Bollinger Bands
  for (let i = 19; i < len; i++) {
    const subset = data.slice(i - 19, i + 1);
    const sum = subset.reduce((acc, p) => acc + p.close, 0);
    const sma = sum / 20;
    data[i].sma20 = parseFloat(sma.toFixed(2));

    // StdDev for Bollinger Bands
    const variance = subset.reduce((acc, p) => acc + Math.pow(p.close - sma, 2), 0) / 20;
    const stdDev = Math.sqrt(variance);
    data[i].upperBB = parseFloat((sma + 2 * stdDev).toFixed(2));
    data[i].lowerBB = parseFloat((sma - 2 * stdDev).toFixed(2));
  }

  // EMA-50
  // First EMA is simple average of first 50 points
  const first50Sum = data.slice(0, 50).reduce((acc, p) => acc + p.close, 0);
  let emaVal = first50Sum / 50;
  data[49].ema50 = parseFloat(emaVal.toFixed(2));

  const k = 2 / (50 + 1); // Smoothing constant
  for (let i = 50; i < len; i++) {
    emaVal = data[i].close * k + emaVal * (1 - k);
    data[i].ema50 = parseFloat(emaVal.toFixed(2));
  }

  // RSI-14
  let avgGain = 0;
  let avgLoss = 0;

  // First RSI
  for (let i = 1; i <= 14; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff > 0) {
      avgGain += diff;
    } else {
      avgLoss += Math.abs(diff);
    }
  }
  avgGain /= 14;
  avgLoss /= 14;

  let rs = avgGain / (avgLoss || 1);
  data[14].rsi = parseFloat((100 - 100 / (1 + rs)).toFixed(2));

  // Wilder's Smoothing for subsequent RSI points
  for (let i = 15; i < len; i++) {
    const diff = data[i].close - data[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * 13 + gain) / 14;
    avgLoss = (avgLoss * 13 + loss) / 14;

    rs = avgGain / (avgLoss || 1);
    data[i].rsi = parseFloat((100 - 100 / (1 + rs)).toFixed(2));
  }
}
