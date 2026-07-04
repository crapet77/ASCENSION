import { FinancialProfile } from "@/features/financialProfile/types";
import { WealthState } from "@/features/wealth/types";

export const REAL_WEALTH_SOURCE_VERSION = "jerome-real-wealth-2026-07-04-v8";

const previousRealWealthTotal = 15220.26;
const bakeryWallsTotalAcquisitionCost = 78000;
const bakeryWallsMonthlyPayment = 444.44;
const bakeryWallsCurrentValue = 120000;
const bakeryWallsMonthlyRent = 800;
const bakeryBusinessTotalAcquisitionCost = 80000;
const bakeryBusinessCurrentValue = bakeryBusinessTotalAcquisitionCost;
const bakeryProfessionalDebt = 30097.48;
const bakeryProfessionalDebtRate = 1.11;
const bakeryProfessionalDebtMonthlyPayment = 910.91;
const bakeryProfessionalDebtEndDate = "06/04/2029";
const bakeryWallsElapsedPayments = getElapsedMonthlyPayments(new Date("2026-01-01"), new Date());
const bakeryWallsRemainingDebt = Math.max(
  0,
  roundCurrency(bakeryWallsTotalAcquisitionCost - bakeryWallsElapsedPayments * bakeryWallsMonthlyPayment)
);
const bakeryWallsNetValue = roundCurrency(bakeryWallsCurrentValue - bakeryWallsRemainingDebt);

export const REAL_WEALTH_EXPECTED_TOTAL = roundCurrency(previousRealWealthTotal + bakeryWallsCurrentValue + bakeryBusinessCurrentValue);
export const REAL_WEALTH_EXPECTED_NET_TOTAL = roundCurrency(previousRealWealthTotal + bakeryWallsNetValue + bakeryBusinessCurrentValue - bakeryProfessionalDebt);

export const realWealthState: WealthState = {
  sourceVersion: REAL_WEALTH_SOURCE_VERSION,
  updatedAt: new Date().toISOString(),
  personalSituation: {
    monthlyNetSalary: 0,
    additionalIncome: 0,
    fixedMonthlyExpenses: 0,
    variableMonthlyExpenses: 0,
    monthlySavings: 0,
    monthlyInvestmentCapacity: 150
  },
  cash: [
    { id: "real-bnp-current-account", name: "BNP", label: "currentAccount", amount: 1900 },
    { id: "real-bricks-available-balance", name: "Bricks · Solde disponible", label: "other", amount: 30.05 },
    { id: "real-revolut-savings-funds", name: "Revolut · Épargne et fonds", label: "other", amount: 201 },
    { id: "real-revolut-cash", name: "Revolut · Espèces", label: "currentAccount", amount: 32 }
  ],
  marketInvestments: [
    { id: "real-revolut-ishares-nasdaq-100", name: "Revolut · iShares NASDAQ 100 Acc ETF", type: "etf", quantity: 0, purchasePrice: 0, currentValue: 391.06, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-nvidia", name: "Revolut · NVIDIA", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 294.94, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-tokio-marine", name: "Revolut · Tokio Marine Holdings", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 97.44, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-privia-health", name: "Revolut · Privia Health Group", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 94.86, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-origin-materials", name: "Revolut · Origin Materials", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 50.57, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-palladium", name: "Revolut · Palladium", type: "commodity", quantity: 0, purchasePrice: 0, currentValue: 190.12, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-platinum", name: "Revolut · Platine", type: "commodity", quantity: 0, purchasePrice: 0, currentValue: 186.85, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-silver", name: "Revolut · Argent", type: "commodity", quantity: 0, purchasePrice: 0, currentValue: 161.83, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-gold", name: "Revolut · Or", type: "commodity", quantity: 0, purchasePrice: 0, currentValue: 86.84, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-robo-advisor", name: "Revolut · Robo-Advisor Investissement général", type: "etf", quantity: 0, purchasePrice: 0, currentValue: 142.30, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-revolut-invest-unlisted-balance", name: "Revolut · Solde Investir non détaillé", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 1.19, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-tr-core-msci-world", name: "Trade Republic · Core MSCI World USD Acc", type: "etf", quantity: 0, purchasePrice: 0, currentValue: 2282.19, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-tr-orchid-island-capital", name: "Trade Republic · Orchid Island Capital", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 894.41, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-tr-icade", name: "Trade Republic · Icade", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 461.98, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-tr-oxford-square-capital", name: "Trade Republic · Oxford Square Capital", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 282.08, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-tr-prospect-capital", name: "Trade Republic · Prospect Capital", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 211.87, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-tr-engie", name: "Trade Republic · Engie", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 102.56, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-tr-spacex", name: "Trade Republic · SpaceX", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 39.21, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-tr-securities-unlisted-balance", name: "Trade Republic · Solde Compte-Titres non détaillé", type: "stock", quantity: 0, purchasePrice: 0, currentValue: 0.09, dividendsReceived: 0, purchaseDate: "" },
    { id: "real-tr-pea", name: "Trade Republic · PEA", type: "etf", quantity: 0, purchasePrice: 0, currentValue: 1, dividendsReceived: 0, purchaseDate: "" }
  ],
  cryptoAssets: [
    { id: "real-revolut-ondo", name: "Revolut · Ondo", quantity: 0, averagePurchasePrice: 0, currentValue: 290.21, annualStaking: 0, rewardsReceived: 0 },
    { id: "real-revolut-dogecoin", name: "Revolut · Dogecoin", quantity: 0, averagePurchasePrice: 0, currentValue: 147.51, annualStaking: 0, rewardsReceived: 0 },
    { id: "real-revolut-cronos", name: "Revolut · Cronos", quantity: 0, averagePurchasePrice: 0, currentValue: 73.46, annualStaking: 0, rewardsReceived: 0 },
    { id: "real-revolut-onefootball-club", name: "Revolut · OneFootball Club", quantity: 0, averagePurchasePrice: 0, currentValue: 30.69, annualStaking: 0, rewardsReceived: 0 },
    { id: "real-revolut-vechain", name: "Revolut · VeChain", quantity: 0, averagePurchasePrice: 0, currentValue: 0.41, annualStaking: 0, rewardsReceived: 0 },
    { id: "real-revolut-flare", name: "Revolut · Flare", quantity: 0, averagePurchasePrice: 0, currentValue: 0.27, annualStaking: 0, rewardsReceived: 0 },
    { id: "real-revolut-cat-in-a-dogs-world", name: "Revolut · cat in a dogs world", quantity: 0, averagePurchasePrice: 0, currentValue: 0.13, annualStaking: 0, rewardsReceived: 0 },
    { id: "real-revolut-polyhedra-network", name: "Revolut · Polyhedra Network", quantity: 0, averagePurchasePrice: 0, currentValue: 0.07, annualStaking: 0, rewardsReceived: 0 },
    { id: "real-revolut-crypto-unlisted-balance", name: "Revolut · Solde crypto non détaillé", quantity: 0, averagePurchasePrice: 0, currentValue: 826.25, annualStaking: 0, rewardsReceived: 0 },
    { id: "real-tr-wallet-crypto", name: "Trade Republic · Wallet Crypto", quantity: 0, averagePurchasePrice: 0, currentValue: 1645.71, annualStaking: 0, rewardsReceived: 0 }
  ],
  realEstateAssets: [
    { id: "real-bricks-fractional-real-estate", name: "Bricks · Immobilier fractionné", owner: "jerome", category: "fractional", currentValue: 3929.90, remainingDebt: 0, monthlyRent: 0, charges: 0, monthlyCredit: 0, netIncome: 0 },
    {
      id: "real-bakery-commercial-walls",
      name: "Murs de la Boulangerie Crapet",
      owner: "jerome",
      category: "commercialPersonal",
      purchasePrice: 71000,
      acquisitionFees: 7000,
      totalAcquisitionCost: bakeryWallsTotalAcquisitionCost,
      loanType: "PTZ 0 %",
      monthlyPayment: bakeryWallsMonthlyPayment,
      loanStartDate: "Janvier 2026",
      loanDurationYears: 15,
      loanEndDate: "Janvier 2041",
      propertyTaxNote: "Propriétaire : Jérôme. Taxe foncière payée par l'EURL, non déduite du cash-flow personnel.",
      currentValue: bakeryWallsCurrentValue,
      remainingDebt: bakeryWallsRemainingDebt,
      monthlyRent: bakeryWallsMonthlyRent,
      charges: 0,
      monthlyCredit: bakeryWallsMonthlyPayment,
      netIncome: roundCurrency(bakeryWallsMonthlyRent - bakeryWallsMonthlyPayment)
    }
  ],
  otherAssets: [
    { id: "real-tr-private-equity", name: "Trade Republic · Non coté", type: "privateEquity", value: 139.21, monthlyIncome: 0, comment: "Non coté Trade Republic" },
    {
      id: "real-bakery-business-goodwill",
      name: "Fonds de commerce Boulangerie Crapet",
      type: "professionalAsset",
      purchasePrice: 70000,
      acquisitionFees: 10000,
      totalAcquisitionCost: bakeryBusinessTotalAcquisitionCost,
      value: bakeryBusinessCurrentValue,
      monthlyIncome: 0,
      comment: "Actif professionnel indépendant des murs. Valeur estimée actuelle modifiable."
    }
  ],
  businessExtras: {
    treasury: 0,
    equipment: 0,
    professionalVehicles: 0,
    professionalDebts: bakeryProfessionalDebt,
    professionalDebtRate: bakeryProfessionalDebtRate,
    professionalDebtMonthlyPayment: bakeryProfessionalDebtMonthlyPayment,
    professionalDebtEndDate: bakeryProfessionalDebtEndDate,
    shareholderCurrentAccounts: 0
  },
  connections: [
    { provider: "banks", status: "planned" },
    { provider: "tradeRepublic", status: "planned" },
    { provider: "binance", status: "planned" },
    { provider: "revolut", status: "planned" },
    { provider: "coinbase", status: "planned" },
    { provider: "ledger", status: "planned" }
  ],
  history: [
    {
      date: new Date().toISOString(),
      grossWealth: REAL_WEALTH_EXPECTED_TOTAL,
      netWealth: REAL_WEALTH_EXPECTED_NET_TOTAL
    }
  ]
};

export const realFinancialProfile: FinancialProfile = {
  sourceVersion: REAL_WEALTH_SOURCE_VERSION,
  monthlyNetSalary: 0,
  additionalIncome: 0,
  fixedMonthlyExpenses: 0,
  availableSavings: 2163.05,
  monthlyInvestment: 150,
  currentWealth: REAL_WEALTH_EXPECTED_NET_TOTAL,
  cash: 2163.05,
  etf: 2816.55,
  stocks: 2531.20,
  crypto: 3014.71,
  realEstate: roundCurrency(3929.90 + bakeryWallsNetValue),
  otherInvestments: roundCurrency(764.85 + bakeryBusinessCurrentValue),
  updatedAt: new Date().toISOString()
};

function getElapsedMonthlyPayments(startDate: Date, currentDate: Date) {
  const monthDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + currentDate.getMonth() - startDate.getMonth();
  return Math.max(0, monthDiff + 1);
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}
