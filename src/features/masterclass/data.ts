import { MasterclassAvailability, MasterclassCategory, MasterclassDifficulty, MasterclassItem } from "@/features/masterclass/types";

export const masterclassCategories: MasterclassCategory[] = [
  {
    id: "crypto",
    icon: "₿",
    title: "Crypto",
    description: "Comprendre les actifs numériques avec méthode."
  },
  {
    id: "markets",
    icon: "📈",
    title: "Bourse",
    description: "Approfondir actions, ETF, indices et cycles."
  },
  {
    id: "realEstate",
    icon: "🏠",
    title: "Immobilier",
    description: "Lire un projet immobilier comme un investisseur."
  },
  {
    id: "entrepreneurship",
    icon: "💼",
    title: "Entrepreneuriat",
    description: "Créer, vendre, structurer et développer."
  },
  {
    id: "tax",
    icon: "💰",
    title: "Fiscalité",
    description: "Comprendre les règles avant d'optimiser."
  },
  {
    id: "international",
    icon: "🌍",
    title: "International",
    description: "Découvrir les opportunités et contraintes mondiales."
  }
];

const defaultStructure: MasterclassItem["structure"] = {
  chapters: [],
  hasIllustrations: true,
  hasQuiz: true,
  hasCaseStudies: true,
  hasSummary: true,
  hasFinalBadge: true
};

type CryptoMasterclassSeed = [
  id: string,
  icon: string,
  title: string,
  difficulty: MasterclassDifficulty,
  estimatedDuration: string,
  availability: MasterclassAvailability
];

export const cryptoMasterclasses: MasterclassItem[] = ([
  ["bitcoin", "₿", "Bitcoin", "Débutant", "35 min", "available"],
  ["ethereum", "Ξ", "Ethereum", "Débutant", "30 min", "available"],
  ["blockchain", "▦", "Blockchain", "Débutant", "28 min", "available"],
  ["stablecoins", "$", "Stablecoins", "Débutant", "22 min", "available"],
  ["wallet", "◈", "Wallet", "Débutant", "24 min", "available"],
  ["ledger", "▣", "Ledger", "Intermédiaire", "26 min", "available"],
  ["defi", "⌁", "DeFi", "Intermédiaire", "40 min", "soon"],
  ["staking", "◆", "Staking", "Intermédiaire", "32 min", "soon"],
  ["ico", "ICO", "ICO", "Avancé", "30 min", "soon"],
  ["ieo", "IEO", "IEO", "Avancé", "30 min", "soon"],
  ["ido", "IDO", "IDO", "Avancé", "30 min", "soon"],
  ["launchpad", "↗", "Launchpad", "Avancé", "38 min", "soon"],
  ["tokenomics", "◎", "Tokenomics", "Intermédiaire", "36 min", "soon"],
  ["whitepaper", "▤", "Whitepaper", "Intermédiaire", "28 min", "soon"],
  ["market-cap", "◌", "Market Cap", "Débutant", "20 min", "available"],
  ["security", "◍", "Sécurité", "Intermédiaire", "34 min", "available"]
] satisfies CryptoMasterclassSeed[]).map(([id, icon, title, difficulty, estimatedDuration, availability]) => ({
  id: `masterclass-crypto-${id}`,
  categoryId: "crypto",
  icon,
  title,
  difficulty,
  estimatedDuration,
  availability,
  structure: defaultStructure
}));

export const masterclasses: MasterclassItem[] = cryptoMasterclasses;
