import {
  InvestmentPortfolioState,
  PortfolioAsset,
  PortfolioAssetCategory,
  PortfolioMetrics
} from "@/features/investmentPortfolio/types";

export const portfolioCategoryLabels: Record<PortfolioAssetCategory, string> = {
  cash: "Cash / Livrets",
  etf: "ETF",
  stocks: "Actions",
  crypto: "Crypto",
  realEstate: "Immobilier",
  dividends: "Dividendes",
  staking: "Staking",
  other: "Autres"
};

export const portfolioCategories = Object.keys(portfolioCategoryLabels) as PortfolioAssetCategory[];

export const emptyPortfolioAsset: PortfolioAsset = {
  id: "",
  name: "",
  category: "etf",
  investedAmount: 0,
  currentValue: 0,
  unrealizedGain: 0,
  realizedGain: 0,
  generatedIncome: 0,
  dividends: 0,
  staking: 0,
  purchaseDate: "",
  comment: "",
  updatedAt: ""
};

export const emptyInvestmentPortfolioState: InvestmentPortfolioState = {
  assets: [],
  history: [],
  updatedAt: ""
};

export function normalizePortfolioAsset(asset: Partial<PortfolioAsset>): PortfolioAsset {
  const investedAmount = normalizeAmount(asset.investedAmount);
  const currentValue = normalizeAmount(asset.currentValue);

  return {
    ...emptyPortfolioAsset,
    ...asset,
    id: asset.id?.trim() || createPortfolioAssetId(),
    name: asset.name?.trim() || "Actif sans nom",
    category: isPortfolioCategory(asset.category) ? asset.category : "other",
    investedAmount,
    currentValue,
    unrealizedGain: currentValue - investedAmount,
    realizedGain: normalizeAmount(asset.realizedGain),
    generatedIncome: normalizeAmount(asset.generatedIncome),
    dividends: normalizeAmount(asset.dividends),
    staking: normalizeAmount(asset.staking),
    purchaseDate: asset.purchaseDate?.trim() ?? "",
    comment: asset.comment?.trim() ?? "",
    updatedAt: asset.updatedAt ?? new Date().toISOString()
  };
}

export function normalizeInvestmentPortfolioState(state: Partial<InvestmentPortfolioState> | null | undefined): InvestmentPortfolioState {
  return {
    assets: Array.isArray(state?.assets) ? state.assets.map(normalizePortfolioAsset) : [],
    history: Array.isArray(state?.history)
      ? state.history.map((snapshot) => ({
          date: snapshot.date,
          totalValue: normalizeAmount(snapshot.totalValue)
        }))
      : [],
    updatedAt: state?.updatedAt ?? new Date().toISOString()
  };
}

export function calculatePortfolioMetrics(state: InvestmentPortfolioState): PortfolioMetrics {
  const assets = state.assets.map(normalizePortfolioAsset);
  const totalInvested = assets.reduce((total, asset) => total + asset.investedAmount, 0);
  const totalValue = assets.reduce((total, asset) => total + asset.currentValue, 0);
  const unrealizedGain = assets.reduce((total, asset) => total + asset.unrealizedGain, 0);
  const realizedGain = assets.reduce((total, asset) => total + asset.realizedGain, 0);
  const generatedIncome = assets.reduce((total, asset) => total + asset.generatedIncome + asset.dividends + asset.staking, 0);
  const totalGainLoss = unrealizedGain + realizedGain + generatedIncome;
  const roi = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
  const performance = totalInvested > 0 ? ((totalValue + realizedGain + generatedIncome - totalInvested) / totalInvested) * 100 : 0;
  const passiveMonthlyIncome = assets.reduce((total, asset) => total + asset.generatedIncome + asset.dividends + asset.staking, 0);
  const allocation = portfolioCategories.map((category) => {
    const value = assets
      .filter((asset) => asset.category === category)
      .reduce((total, asset) => total + asset.currentValue, 0);

    return {
      category,
      label: portfolioCategoryLabels[category],
      value,
      percent: totalValue > 0 ? (value / totalValue) * 100 : 0
    };
  });

  return {
    totalInvested,
    totalValue,
    unrealizedGain,
    realizedGain,
    totalGainLoss,
    generatedIncome,
    passiveMonthlyIncome,
    roi,
    performance,
    allocation,
    evolution: state.history
  };
}

export function upsertPortfolioAsset(state: InvestmentPortfolioState, asset: Partial<PortfolioAsset>): InvestmentPortfolioState {
  const normalizedAsset = normalizePortfolioAsset({ ...asset, updatedAt: new Date().toISOString() });
  const assets = state.assets.some((item) => item.id === normalizedAsset.id)
    ? state.assets.map((item) => (item.id === normalizedAsset.id ? normalizedAsset : item))
    : [normalizedAsset, ...state.assets];

  return normalizeInvestmentPortfolioState({
    assets,
    history: appendPortfolioSnapshot(state.history, assets),
    updatedAt: new Date().toISOString()
  });
}

export function removePortfolioAsset(state: InvestmentPortfolioState, assetId: string): InvestmentPortfolioState {
  const assets = state.assets.filter((asset) => asset.id !== assetId);

  return normalizeInvestmentPortfolioState({
    assets,
    history: appendPortfolioSnapshot(state.history, assets),
    updatedAt: new Date().toISOString()
  });
}

export function createPortfolioAssetId() {
  return `portfolio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendPortfolioSnapshot(history: InvestmentPortfolioState["history"], assets: PortfolioAsset[]) {
  const snapshot = {
    date: new Date().toISOString(),
    totalValue: assets.reduce((total, asset) => total + asset.currentValue, 0)
  };

  return [...history, snapshot].slice(-120);
}

function normalizeAmount(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function isPortfolioCategory(category: unknown): category is PortfolioAssetCategory {
  return typeof category === "string" && portfolioCategories.includes(category as PortfolioAssetCategory);
}
