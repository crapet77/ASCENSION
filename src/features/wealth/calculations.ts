import {
  WealthAllocation,
  WealthBusinessExtras,
  WealthCashAccount,
  WealthConnection,
  WealthConnectionProvider,
  WealthConnectionStatus,
  WealthCryptoAsset,
  WealthMarketInvestment,
  WealthMetrics,
  WealthOtherAsset,
  WealthPersonalSituation,
  WealthRealEstateAsset,
  WealthState
} from "@/features/wealth/types";

export const wealthCashLabels: Record<WealthCashAccount["label"], string> = {
  currentAccount: "Compte courant",
  livretA: "Livret A",
  ldds: "LDDS",
  lep: "LEP",
  other: "Autres"
};

export const wealthMarketTypeLabels: Record<WealthMarketInvestment["type"], string> = {
  etf: "ETF",
  stock: "Action",
  bond: "Obligation",
  commodity: "Matière première"
};

export const wealthConnectionLabels: Record<WealthConnectionProvider, string> = {
  banks: "Banques",
  tradeRepublic: "Trade Republic",
  binance: "Binance",
  revolut: "Revolut",
  coinbase: "Coinbase",
  ledger: "Ledger"
};

export const emptyWealthPersonalSituation: WealthPersonalSituation = {
  monthlyNetSalary: 0,
  additionalIncome: 0,
  fixedMonthlyExpenses: 0,
  variableMonthlyExpenses: 0,
  monthlySavings: 0,
  monthlyInvestmentCapacity: 0
};

export const defaultWealthConnections: WealthConnection[] = [
  { provider: "banks", status: "planned" },
  { provider: "tradeRepublic", status: "planned" },
  { provider: "binance", status: "planned" },
  { provider: "revolut", status: "planned" },
  { provider: "coinbase", status: "planned" },
  { provider: "ledger", status: "planned" }
];

export const emptyWealthBusinessExtras: WealthBusinessExtras = {
  treasury: 0,
  equipment: 0,
  professionalVehicles: 0,
  professionalDebts: 0,
  professionalDebtRate: 0,
  professionalDebtMonthlyPayment: 0,
  professionalDebtEndDate: "",
  shareholderCurrentAccounts: 0
};

export const emptyWealthState: WealthState = {
  personalSituation: emptyWealthPersonalSituation,
  cash: [],
  marketInvestments: [],
  cryptoAssets: [],
  realEstateAssets: [],
  otherAssets: [],
  businessExtras: emptyWealthBusinessExtras,
  connections: defaultWealthConnections,
  history: [],
  updatedAt: ""
};

export const emptyCashAccount: WealthCashAccount = {
  id: "",
  name: "",
  label: "currentAccount",
  amount: 0
};

export const emptyMarketInvestment: WealthMarketInvestment = {
  id: "",
  name: "",
  type: "etf",
  quantity: 0,
  purchasePrice: 0,
  currentValue: 0,
  dividendsReceived: 0,
  purchaseDate: ""
};

export const emptyCryptoAsset: WealthCryptoAsset = {
  id: "",
  name: "",
  quantity: 0,
  averagePurchasePrice: 0,
  currentValue: 0,
  annualStaking: 0,
  rewardsReceived: 0
};

export const emptyRealEstateAsset: WealthRealEstateAsset = {
  id: "",
  name: "",
  owner: "jerome",
  category: "other",
  purchasePrice: 0,
  acquisitionFees: 0,
  totalAcquisitionCost: 0,
  loanType: "",
  monthlyPayment: 0,
  loanStartDate: "",
  loanDurationYears: 0,
  loanEndDate: "",
  propertyTaxNote: "",
  currentValue: 0,
  remainingDebt: 0,
  monthlyRent: 0,
  charges: 0,
  monthlyCredit: 0,
  netIncome: 0
};

export const emptyOtherAsset: WealthOtherAsset = {
  id: "",
  name: "",
  type: "other",
  purchasePrice: 0,
  acquisitionFees: 0,
  totalAcquisitionCost: 0,
  value: 0,
  monthlyIncome: 0,
  comment: ""
};

export function normalizeWealthState(state: Partial<WealthState> | null | undefined): WealthState {
  return {
    personalSituation: normalizePersonalSituation(state?.personalSituation),
    cash: Array.isArray(state?.cash) ? state.cash.map(normalizeCashAccount) : [],
    marketInvestments: Array.isArray(state?.marketInvestments) ? state.marketInvestments.map(normalizeMarketInvestment) : [],
    cryptoAssets: Array.isArray(state?.cryptoAssets) ? state.cryptoAssets.map(normalizeCryptoAsset) : [],
    realEstateAssets: Array.isArray(state?.realEstateAssets) ? state.realEstateAssets.map(normalizeRealEstateAsset) : [],
    otherAssets: Array.isArray(state?.otherAssets) ? state.otherAssets.map(normalizeOtherAsset) : [],
    businessExtras: normalizeBusinessExtras(state?.businessExtras),
    connections: normalizeConnections(state?.connections),
    history: Array.isArray(state?.history)
      ? state.history.map((snapshot) => ({
          date: snapshot.date || new Date().toISOString(),
          grossWealth: normalizeAmount(snapshot.grossWealth),
          netWealth: normalizeAmount(snapshot.netWealth)
        }))
      : [],
    updatedAt: state?.updatedAt ?? new Date().toISOString(),
    sourceVersion: state?.sourceVersion
  };
}

export function calculateWealthMetrics(state: WealthState): WealthMetrics {
  const cashTotal = state.cash.reduce((total, item) => total + item.amount, 0);
  const marketTotal = state.marketInvestments
    .filter((item) => item.type !== "commodity")
    .reduce((total, item) => total + item.currentValue, 0);
  const commoditiesTotal = state.marketInvestments
    .filter((item) => item.type === "commodity")
    .reduce((total, item) => total + item.currentValue, 0);
  const cryptoTotal = state.cryptoAssets.reduce((total, item) => total + item.currentValue, 0);
  const personalRealEstateAssets = state.realEstateAssets.filter((item) => item.owner !== "eurl");
  const businessRealEstateAssets = state.realEstateAssets.filter((item) => item.owner === "eurl");
  const personalRealEstateGross = personalRealEstateAssets.reduce((total, item) => total + item.currentValue, 0);
  const personalRealEstateDebt = personalRealEstateAssets.reduce((total, item) => total + item.remainingDebt, 0);
  const businessRealEstateGross = businessRealEstateAssets.reduce((total, item) => total + item.currentValue, 0);
  const businessRealEstateDebt = businessRealEstateAssets.reduce((total, item) => total + item.remainingDebt, 0);
  const realEstateGross = personalRealEstateGross + businessRealEstateGross;
  const realEstateDebt = personalRealEstateDebt + businessRealEstateDebt;
  const privateEquityTotal = state.otherAssets
    .filter((item) => item.type === "privateEquity")
    .reduce((total, item) => total + item.value, 0);
  const businessTotal = state.otherAssets
    .filter((item) => item.type === "professionalAsset")
    .reduce((total, item) => total + item.value, 0);
  const otherTotal = state.otherAssets
    .filter((item) => item.type !== "privateEquity" && item.type !== "professionalAsset")
    .reduce((total, item) => total + item.value, 0);
  const businessExtrasGross = state.businessExtras.treasury + state.businessExtras.equipment + state.businessExtras.professionalVehicles;
  const businessExtraDebt = state.businessExtras.professionalDebts + state.businessExtras.shareholderCurrentAccounts;
  const grossWealth = cashTotal + marketTotal + commoditiesTotal + cryptoTotal + realEstateGross + businessTotal + businessExtrasGross + privateEquityTotal + otherTotal;
  const totalDebt = realEstateDebt + businessExtraDebt;
  const netWealth = grossWealth - totalDebt;
  const monthlyIncome = state.personalSituation.monthlyNetSalary + state.personalSituation.additionalIncome;
  const monthlyExpenses = state.personalSituation.fixedMonthlyExpenses + state.personalSituation.variableMonthlyExpenses;
  const personalRealEstateIncome = personalRealEstateAssets.reduce((total, item) => total + item.netIncome, 0);
  const businessRealEstateIncome = businessRealEstateAssets.reduce((total, item) => total + item.netIncome, 0);
  const realEstateIncome = personalRealEstateIncome + businessRealEstateIncome;
  const otherIncome = state.otherAssets.reduce((total, item) => total + item.monthlyIncome, 0);
  const annualDividends = state.marketInvestments.reduce((total, item) => total + item.dividendsReceived, 0);
  const annualCryptoIncome = state.cryptoAssets.reduce(
    (total, item) => total + item.rewardsReceived + (item.currentValue * item.annualStaking) / 100,
    0
  );
  const passiveMonthlyIncome = realEstateIncome + otherIncome + (annualDividends + annualCryptoIncome) / 12;
  const passiveAnnualIncome = passiveMonthlyIncome * 12;
  const savingsRate = monthlyIncome > 0 ? (state.personalSituation.monthlySavings / monthlyIncome) * 100 : 0;
  const investmentRate = monthlyIncome > 0 ? (state.personalSituation.monthlyInvestmentCapacity / monthlyIncome) * 100 : 0;
  const personalGrossWealth = cashTotal + marketTotal + commoditiesTotal + cryptoTotal + personalRealEstateGross + privateEquityTotal + otherTotal;
  const personalDebt = personalRealEstateDebt;
  const businessGrossWealth = businessRealEstateGross + businessTotal + businessExtrasGross;
  const businessDebt = businessRealEstateDebt + businessExtraDebt;
  const personalPassiveMonthlyIncome = personalRealEstateIncome + otherIncome + (annualDividends + annualCryptoIncome) / 12;
  const businessPassiveMonthlyIncome = businessRealEstateIncome;
  const allocation = buildAllocation([
    ["cash", "Liquidités", cashTotal],
    ["market", "Bourse", marketTotal],
    ["commodities", "Matières premières", commoditiesTotal],
    ["crypto", "Crypto", cryptoTotal],
    ["realEstate", "Immobilier", realEstateGross],
    ["business", "Entreprise", businessTotal + businessExtrasGross],
    ["privateEquity", "Non coté", privateEquityTotal],
    ["other", "Autres actifs", otherTotal]
  ]);
  const debtAllocation = buildAllocation([
    ["realEstate", "Crédits immobiliers", realEstateDebt],
    ["business", "Dettes professionnelles", businessExtraDebt]
  ]);
  const incomeAllocation = buildAllocation([
    ["cash", "Liquidités", 0],
    ["market", "Dividendes", annualDividends / 12],
    ["crypto", "Crypto", annualCryptoIncome / 12],
    ["realEstate", "Immobilier", realEstateIncome],
    ["other", "Autres revenus", otherIncome]
  ]);

  return {
    monthlyIncome,
    monthlyExpenses,
    grossWealth,
    debt: totalDebt,
    netWealth,
    passiveMonthlyIncome,
    passiveAnnualIncome,
    savingsRate,
    investmentRate,
    allocation,
    debtAllocation,
    incomeAllocation,
    personal: {
      grossWealth: personalGrossWealth,
      debt: personalDebt,
      netWealth: personalGrossWealth - personalDebt,
      passiveMonthlyIncome: personalPassiveMonthlyIncome,
      passiveAnnualIncome: personalPassiveMonthlyIncome * 12,
      allocation: buildAllocation([
        ["cash", "Liquidités", cashTotal],
        ["market", "Bourse", marketTotal],
        ["commodities", "Métaux précieux", commoditiesTotal],
        ["crypto", "Crypto", cryptoTotal],
        ["realEstate", "Immobilier personnel", personalRealEstateGross],
        ["privateEquity", "Non coté", privateEquityTotal],
        ["other", "Autres actifs", otherTotal]
      ])
    },
    business: {
      grossWealth: businessGrossWealth,
      debt: businessDebt,
      netWealth: businessGrossWealth - businessDebt,
      passiveMonthlyIncome: businessPassiveMonthlyIncome,
      passiveAnnualIncome: businessPassiveMonthlyIncome * 12,
      allocation: buildAllocation([
        ["realEstate", "Immobilier EURL", businessRealEstateGross],
        ["business", "Fonds de commerce", businessTotal],
        ["cash", "Trésorerie entreprise", state.businessExtras.treasury],
        ["other", "Matériel et véhicules", state.businessExtras.equipment + state.businessExtras.professionalVehicles]
      ])
    },
    global: {
      grossWealth,
      debt: totalDebt,
      netWealth,
      passiveMonthlyIncome,
      passiveAnnualIncome,
      allocation
    },
    history: state.history
  };
}

export function saveWealthSnapshot(state: WealthState): WealthState {
  const metrics = calculateWealthMetrics(state);
  const snapshot = {
    date: new Date().toISOString(),
    grossWealth: metrics.grossWealth,
    netWealth: metrics.netWealth
  };

  return normalizeWealthState({
    ...state,
    history: [...state.history, snapshot].slice(-120),
    updatedAt: new Date().toISOString()
  });
}

export function createWealthItemId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePersonalSituation(personalSituation?: Partial<WealthPersonalSituation>): WealthPersonalSituation {
  return {
    monthlyNetSalary: normalizeAmount(personalSituation?.monthlyNetSalary),
    additionalIncome: normalizeAmount(personalSituation?.additionalIncome),
    fixedMonthlyExpenses: normalizeAmount(personalSituation?.fixedMonthlyExpenses),
    variableMonthlyExpenses: normalizeAmount(personalSituation?.variableMonthlyExpenses),
    monthlySavings: normalizeAmount(personalSituation?.monthlySavings),
    monthlyInvestmentCapacity: normalizeAmount(personalSituation?.monthlyInvestmentCapacity)
  };
}

function normalizeBusinessExtras(businessExtras?: Partial<WealthBusinessExtras>): WealthBusinessExtras {
  return {
    treasury: normalizeAmount(businessExtras?.treasury),
    equipment: normalizeAmount(businessExtras?.equipment),
    professionalVehicles: normalizeAmount(businessExtras?.professionalVehicles),
    professionalDebts: normalizeAmount(businessExtras?.professionalDebts),
    professionalDebtRate: normalizeAmount(businessExtras?.professionalDebtRate),
    professionalDebtMonthlyPayment: normalizeAmount(businessExtras?.professionalDebtMonthlyPayment),
    professionalDebtEndDate: businessExtras?.professionalDebtEndDate?.trim() ?? "",
    shareholderCurrentAccounts: normalizeAmount(businessExtras?.shareholderCurrentAccounts)
  };
}

function normalizeCashAccount(account: Partial<WealthCashAccount>): WealthCashAccount {
  const labels = Object.keys(wealthCashLabels) as WealthCashAccount["label"][];

  return {
    id: account.id?.trim() || createWealthItemId("cash"),
    name: account.name?.trim() ?? "",
    label: labels.includes(account.label as WealthCashAccount["label"]) ? account.label as WealthCashAccount["label"] : "other",
    amount: normalizeAmount(account.amount)
  };
}

function normalizeMarketInvestment(investment: Partial<WealthMarketInvestment>): WealthMarketInvestment {
  const types = Object.keys(wealthMarketTypeLabels) as WealthMarketInvestment["type"][];

  return {
    id: investment.id?.trim() || createWealthItemId("market"),
    name: investment.name?.trim() || "Investissement sans nom",
    type: types.includes(investment.type as WealthMarketInvestment["type"]) ? investment.type as WealthMarketInvestment["type"] : "etf",
    quantity: normalizeAmount(investment.quantity),
    purchasePrice: normalizeAmount(investment.purchasePrice),
    currentValue: normalizeAmount(investment.currentValue),
    dividendsReceived: normalizeAmount(investment.dividendsReceived),
    purchaseDate: investment.purchaseDate?.trim() ?? ""
  };
}

function normalizeCryptoAsset(asset: Partial<WealthCryptoAsset>): WealthCryptoAsset {
  return {
    id: asset.id?.trim() || createWealthItemId("crypto"),
    name: asset.name?.trim() || "Crypto sans nom",
    quantity: normalizeAmount(asset.quantity),
    averagePurchasePrice: normalizeAmount(asset.averagePurchasePrice),
    currentValue: normalizeAmount(asset.currentValue),
    annualStaking: normalizeAmount(asset.annualStaking),
    rewardsReceived: normalizeAmount(asset.rewardsReceived)
  };
}

function normalizeRealEstateAsset(asset: Partial<WealthRealEstateAsset>): WealthRealEstateAsset {
  const owner = asset.owner === "eurl" ? "eurl" : "jerome";
  const category = ["fractional", "commercialPersonal", "commercialBusiness", "residential", "other"].includes(asset.category ?? "")
    ? asset.category
    : "other";

  return {
    id: asset.id?.trim() || createWealthItemId("real-estate"),
    name: asset.name?.trim() || "Bien immobilier",
    owner,
    category,
    purchasePrice: normalizeAmount(asset.purchasePrice),
    acquisitionFees: normalizeAmount(asset.acquisitionFees),
    totalAcquisitionCost: normalizeAmount(asset.totalAcquisitionCost),
    loanType: asset.loanType?.trim() ?? "",
    monthlyPayment: normalizeAmount(asset.monthlyPayment),
    loanStartDate: asset.loanStartDate?.trim() ?? "",
    loanDurationYears: normalizeAmount(asset.loanDurationYears),
    loanEndDate: asset.loanEndDate?.trim() ?? "",
    propertyTaxNote: asset.propertyTaxNote?.trim() ?? "",
    currentValue: normalizeAmount(asset.currentValue),
    remainingDebt: normalizeAmount(asset.remainingDebt),
    monthlyRent: normalizeAmount(asset.monthlyRent),
    charges: normalizeAmount(asset.charges),
    monthlyCredit: normalizeAmount(asset.monthlyCredit),
    netIncome: normalizeAmount(asset.netIncome)
  };
}

function normalizeOtherAsset(asset: Partial<WealthOtherAsset>): WealthOtherAsset {
  const type = asset.type === "privateEquity" || asset.type === "professionalAsset" ? asset.type : "other";

  return {
    id: asset.id?.trim() || createWealthItemId("other"),
    name: asset.name?.trim() || "Actif libre",
    type,
    purchasePrice: normalizeAmount(asset.purchasePrice),
    acquisitionFees: normalizeAmount(asset.acquisitionFees),
    totalAcquisitionCost: normalizeAmount(asset.totalAcquisitionCost),
    value: normalizeAmount(asset.value),
    monthlyIncome: normalizeAmount(asset.monthlyIncome),
    comment: asset.comment?.trim() ?? ""
  };
}

function normalizeConnections(connections?: WealthConnection[]) {
  return defaultWealthConnections.map((connection) => {
    const existingConnection = connections?.find((item) => item.provider === connection.provider);
    const status: WealthConnectionStatus = existingConnection?.status === "notConnected" ? "notConnected" : "planned";

    return {
      provider: connection.provider,
      status
    };
  });
}

function buildAllocation(rows: Array<[WealthAllocation["category"], string, number]>): WealthAllocation[] {
  const total = rows.reduce((sum, [, , value]) => sum + value, 0);

  return rows.map(([category, label, value]) => ({
    category,
    label,
    value,
    percent: total > 0 ? (value / total) * 100 : 0
  }));
}

function normalizeAmount(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}
