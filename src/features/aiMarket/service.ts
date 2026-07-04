import { CoinMarketAsset, FutureModuleCard } from "./types";

const COINGECKO_ENDPOINT = "https://api.coingecko.com/api/v3/coins/markets";
const MAX_PAGE_SIZE = 250;

export async function fetchTopCryptoMarkets(limit = 500): Promise<CoinMarketAsset[]> {
  const normalizedLimit = Math.max(1, Math.min(limit, 500));
  const pageCount = Math.ceil(normalizedLimit / MAX_PAGE_SIZE);
  const requests = Array.from({ length: pageCount }, (_, index) => fetchCoinGeckoPage(index + 1, MAX_PAGE_SIZE));
  const pages = await Promise.all(requests);

  return pages.flat().slice(0, normalizedLimit).map((asset) => normalizeMarketAsset(asset));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2
  }).format(value);
}

async function fetchCoinGeckoPage(page: number, perPage: number): Promise<Array<Record<string, unknown>>> {
  const params = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: String(perPage),
    page: String(page),
    sparkline: "false",
    price_change_percentage: "24h"
  });

  const response = await fetch(`${COINGECKO_ENDPOINT}?${params.toString()}`, {
    headers: buildCoinGeckoHeaders()
  });

  if (!response.ok) {
    throw new Error(`La requête CoinGecko a échoué avec le statut ${response.status}`);
  }

  return (await response.json()) as Array<Record<string, unknown>>;
}

function buildCoinGeckoHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    accept: "application/json"
  };

  const rawApiKey = process.env.EXPO_PUBLIC_COINGECKO_API_KEY?.trim() ?? "";

  if (!rawApiKey) {
    return headers;
  }

  if (rawApiKey.startsWith("http://") || rawApiKey.startsWith("https://")) {
    try {
      const url = new URL(rawApiKey);
      const demoKey = url.searchParams.get("x_cg_demo_api_key");
      const proKey = url.searchParams.get("x_cg_pro_api_key") || url.searchParams.get("api_key");

      if (demoKey) {
        headers["x-cg-demo-api-key"] = demoKey;
      } else if (proKey) {
        headers["x-cg-pro-api-key"] = proKey;
      }
    } catch {
      headers["x-cg-demo-api-key"] = rawApiKey;
    }
  } else {
    headers["x-cg-demo-api-key"] = rawApiKey;
  }

  return headers;
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export const futureModules: FutureModuleCard[] = [
  {
    key: "stocks",
    title: "Actions",
    description: "Idées multi-marchés et listes de surveillance actions.",
    status: "planned"
  },
  {
    key: "etfs",
    title: "ETFs",
    description: "Aperçus des ETF sectoriels et thématiques.",
    status: "planned"
  },
  {
    key: "news",
    title: "Actualités",
    description: "Suivi des catalyseurs et du sentiment de marché.",
    status: "planned"
  },
  {
    key: "watchlist",
    title: "Liste de suivi",
    description: "Surveillance personnelle et favoris.",
    status: "planned"
  },
  {
    key: "alerts",
    title: "Alertes",
    description: "Notifications par seuil pour tes idées.",
    status: "planned"
  }
];

function normalizeMarketAsset(asset: Record<string, unknown>): CoinMarketAsset {
  return {
    id: String(asset.id ?? ""),
    symbol: String(asset.symbol ?? ""),
    name: String(asset.name ?? ""),
    image: String(asset.image ?? ""),
    currentPrice: Number(asset.current_price ?? 0),
    priceChange24h: Number(asset.price_change_percentage_24h ?? 0),
    marketCap: Number(asset.market_cap ?? 0),
    totalVolume: Number(asset.total_volume ?? 0),
    marketCapRank: Number(asset.market_cap_rank ?? 9999)
  };
}
