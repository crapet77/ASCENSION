export type PortfolioAssetCategory =
  | "cash"
  | "etf"
  | "stocks"
  | "crypto"
  | "realEstate"
  | "dividends"
  | "staking"
  | "other";

export type PortfolioAsset = {
  id: string;
  name: string;
  category: PortfolioAssetCategory;
  investedAmount: number;
  currentValue: number;
  unrealizedGain: number;
  realizedGain: number;
  generatedIncome: number;
  dividends: number;
  staking: number;
  purchaseDate: string;
  comment: string;
  updatedAt: string;
};

export type PortfolioSnapshot = {
  date: string;
  totalValue: number;
};

export type InvestmentPortfolioState = {
  assets: PortfolioAsset[];
  history: PortfolioSnapshot[];
  updatedAt: string;
};

export type PortfolioMetrics = {
  totalInvested: number;
  totalValue: number;
  unrealizedGain: number;
  realizedGain: number;
  totalGainLoss: number;
  generatedIncome: number;
  passiveMonthlyIncome: number;
  roi: number;
  performance: number;
  allocation: Array<{
    category: PortfolioAssetCategory;
    label: string;
    value: number;
    percent: number;
  }>;
  evolution: PortfolioSnapshot[];
};
