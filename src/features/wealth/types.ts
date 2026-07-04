export type WealthPersonalSituation = {
  monthlyNetSalary: number;
  additionalIncome: number;
  fixedMonthlyExpenses: number;
  variableMonthlyExpenses: number;
  monthlySavings: number;
  monthlyInvestmentCapacity: number;
};

export type WealthCashAccount = {
  id: string;
  name?: string;
  label: "currentAccount" | "livretA" | "ldds" | "lep" | "other";
  amount: number;
};

export type WealthMarketInvestment = {
  id: string;
  name: string;
  type: "etf" | "stock" | "bond" | "commodity";
  quantity: number;
  purchasePrice: number;
  currentValue: number;
  dividendsReceived: number;
  purchaseDate: string;
};

export type WealthCryptoAsset = {
  id: string;
  name: string;
  quantity: number;
  averagePurchasePrice: number;
  currentValue: number;
  annualStaking: number;
  rewardsReceived: number;
};

export type WealthRealEstateAsset = {
  id: string;
  name: string;
  owner?: "jerome" | "eurl";
  category?: "fractional" | "commercialPersonal" | "commercialBusiness" | "residential" | "other";
  purchasePrice?: number;
  acquisitionFees?: number;
  totalAcquisitionCost?: number;
  loanType?: string;
  monthlyPayment?: number;
  loanStartDate?: string;
  loanDurationYears?: number;
  loanEndDate?: string;
  propertyTaxNote?: string;
  currentValue: number;
  remainingDebt: number;
  monthlyRent: number;
  charges: number;
  monthlyCredit: number;
  netIncome: number;
};

export type WealthOtherAsset = {
  id: string;
  name: string;
  type?: "privateEquity" | "professionalAsset" | "other";
  purchasePrice?: number;
  acquisitionFees?: number;
  totalAcquisitionCost?: number;
  value: number;
  monthlyIncome: number;
  comment: string;
};

export type WealthBusinessExtras = {
  treasury: number;
  equipment: number;
  professionalVehicles: number;
  professionalDebts: number;
  professionalDebtRate?: number;
  professionalDebtMonthlyPayment?: number;
  professionalDebtEndDate?: string;
  shareholderCurrentAccounts: number;
};

export type WealthConnectionProvider =
  | "banks"
  | "tradeRepublic"
  | "binance"
  | "revolut"
  | "coinbase"
  | "ledger";

export type WealthConnectionStatus = "notConnected" | "planned";

export type WealthConnection = {
  provider: WealthConnectionProvider;
  status: WealthConnectionStatus;
};

export type WealthSnapshot = {
  date: string;
  grossWealth: number;
  netWealth: number;
};

export type WealthState = {
  personalSituation: WealthPersonalSituation;
  cash: WealthCashAccount[];
  marketInvestments: WealthMarketInvestment[];
  cryptoAssets: WealthCryptoAsset[];
  realEstateAssets: WealthRealEstateAsset[];
  otherAssets: WealthOtherAsset[];
  businessExtras: WealthBusinessExtras;
  connections: WealthConnection[];
  history: WealthSnapshot[];
  updatedAt: string;
  sourceVersion?: string;
};

export type WealthAllocationCategory = "cash" | "market" | "commodities" | "crypto" | "realEstate" | "business" | "privateEquity" | "other";

export type WealthAllocation = {
  category: WealthAllocationCategory;
  label: string;
  value: number;
  percent: number;
};

export type WealthUniverseMetrics = {
  grossWealth: number;
  debt: number;
  netWealth: number;
  passiveMonthlyIncome: number;
  passiveAnnualIncome: number;
  allocation: WealthAllocation[];
};

export type WealthMetrics = {
  monthlyIncome: number;
  monthlyExpenses: number;
  grossWealth: number;
  debt: number;
  netWealth: number;
  passiveMonthlyIncome: number;
  passiveAnnualIncome: number;
  savingsRate: number;
  investmentRate: number;
  allocation: WealthAllocation[];
  debtAllocation: WealthAllocation[];
  incomeAllocation: WealthAllocation[];
  personal: WealthUniverseMetrics;
  business: WealthUniverseMetrics;
  global: WealthUniverseMetrics;
  history: WealthSnapshot[];
};
