export type FinancialProfile = {
  monthlyNetSalary: number;
  additionalIncome: number;
  fixedMonthlyExpenses: number;
  availableSavings: number;
  monthlyInvestment: number;
  currentWealth: number;
  cash: number;
  etf: number;
  stocks: number;
  crypto: number;
  realEstate: number;
  otherInvestments: number;
  updatedAt: string;
  sourceVersion?: string;
};

export type FinancialProfileMetrics = {
  monthlyIncome: number;
  savingsCapacity: number;
  savingsRate: number;
  totalWealth: number;
  allocation: Array<{
    id: keyof Pick<FinancialProfile, "cash" | "etf" | "stocks" | "crypto" | "realEstate" | "otherInvestments">;
    label: string;
    value: number;
    percent: number;
  }>;
  completedFields: number;
  totalFields: number;
};
