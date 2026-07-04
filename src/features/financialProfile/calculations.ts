import { FinancialProfile, FinancialProfileMetrics } from "@/features/financialProfile/types";

export const defaultFinancialProfile: FinancialProfile = {
  monthlyNetSalary: 0,
  additionalIncome: 0,
  fixedMonthlyExpenses: 0,
  availableSavings: 0,
  monthlyInvestment: 0,
  currentWealth: 0,
  cash: 0,
  etf: 0,
  stocks: 0,
  crypto: 0,
  realEstate: 0,
  otherInvestments: 0,
  updatedAt: ""
};

const financialFields: Array<keyof Omit<FinancialProfile, "updatedAt" | "sourceVersion">> = [
  "monthlyNetSalary",
  "additionalIncome",
  "fixedMonthlyExpenses",
  "availableSavings",
  "monthlyInvestment",
  "currentWealth",
  "cash",
  "etf",
  "stocks",
  "crypto",
  "realEstate",
  "otherInvestments"
];

export function normalizeFinancialProfile(profile: Partial<FinancialProfile> | null | undefined): FinancialProfile {
  return {
    ...defaultFinancialProfile,
    ...Object.fromEntries(
      financialFields.map((field) => [field, normalizeAmount(profile?.[field])])
    ),
    updatedAt: profile?.updatedAt ?? new Date().toISOString(),
    sourceVersion: profile?.sourceVersion
  };
}

export function calculateFinancialProfileMetrics(profile: FinancialProfile): FinancialProfileMetrics {
  const monthlyIncome = profile.monthlyNetSalary + profile.additionalIncome;
  const savingsCapacity = Math.max(monthlyIncome - profile.fixedMonthlyExpenses, 0);
  const savingsRate = monthlyIncome > 0 ? (savingsCapacity / monthlyIncome) * 100 : 0;
  const assetTotal = profile.cash + profile.etf + profile.stocks + profile.crypto + profile.realEstate + profile.otherInvestments;
  const totalWealth = Math.max(profile.currentWealth, assetTotal);
  const allocationSource = assetTotal > 0 ? assetTotal : totalWealth;
  const completedFields = financialFields.filter((field) => profile[field] > 0).length;

  return {
    monthlyIncome,
    savingsCapacity,
    savingsRate,
    totalWealth,
    allocation: [
      { id: "cash", label: "Livret / cash", value: profile.cash, percent: getAllocationPercent(profile.cash, allocationSource) },
      { id: "etf", label: "ETF", value: profile.etf, percent: getAllocationPercent(profile.etf, allocationSource) },
      { id: "stocks", label: "Actions", value: profile.stocks, percent: getAllocationPercent(profile.stocks, allocationSource) },
      { id: "crypto", label: "Crypto", value: profile.crypto, percent: getAllocationPercent(profile.crypto, allocationSource) },
      { id: "realEstate", label: "Immobilier", value: profile.realEstate, percent: getAllocationPercent(profile.realEstate, allocationSource) },
      { id: "otherInvestments", label: "Autres", value: profile.otherInvestments, percent: getAllocationPercent(profile.otherInvestments, allocationSource) }
    ],
    completedFields,
    totalFields: financialFields.length
  };
}

function normalizeAmount(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function getAllocationPercent(value: number, total: number) {
  return total > 0 ? (value / total) * 100 : 0;
}
