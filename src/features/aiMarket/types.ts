export type MarketSortKey = "marketCap" | "price" | "change24h" | "aiScore";

export type FutureModuleKey = "stocks" | "etfs" | "news" | "watchlist" | "alerts";

export type CoinMarketAsset = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  totalVolume: number;
  marketCapRank: number;
  aiScore: number;
};

export type FutureModuleCard = {
  key: FutureModuleKey;
  title: string;
  description: string;
  status: "planned";
};
