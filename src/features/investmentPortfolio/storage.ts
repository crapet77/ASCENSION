import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  emptyInvestmentPortfolioState,
  normalizeInvestmentPortfolioState
} from "@/features/investmentPortfolio/calculations";
import { InvestmentPortfolioState } from "@/features/investmentPortfolio/types";

export const INVESTMENT_PORTFOLIO_STORAGE_KEY = "@ascension/investment-portfolio/v1";

export async function loadInvestmentPortfolio(): Promise<InvestmentPortfolioState> {
  const rawState = await AsyncStorage.getItem(INVESTMENT_PORTFOLIO_STORAGE_KEY);

  if (!rawState) {
    return {
      ...emptyInvestmentPortfolioState,
      updatedAt: new Date().toISOString()
    };
  }

  return normalizeInvestmentPortfolioState(JSON.parse(rawState) as Partial<InvestmentPortfolioState>);
}

export async function saveInvestmentPortfolio(state: InvestmentPortfolioState) {
  await AsyncStorage.setItem(
    INVESTMENT_PORTFOLIO_STORAGE_KEY,
    JSON.stringify(normalizeInvestmentPortfolioState({ ...state, updatedAt: new Date().toISOString() }))
  );
}
