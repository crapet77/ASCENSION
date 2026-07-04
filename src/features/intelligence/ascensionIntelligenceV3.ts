import { AcademyEngineState } from "@/engine/academy";
import { ObjectiveEngineState } from "@/engine/objectives";
import { getBankrollStats } from "@/features/bankroll/math";
import { BankrollState } from "@/features/bankroll/types";
import { DisciplineProfile } from "@/features/discipline/disciplineProfile";
import { calculateFinancialProfileMetrics } from "@/features/financialProfile";
import { FinancialProfile } from "@/features/financialProfile/types";
import { AscensionIQProfile } from "@/features/ascensionIQ/ascensionIQ";
import { AscensionTicket } from "@/features/tickets/types";
import { calculateWealthMetrics } from "@/features/wealth";
import { WealthState } from "@/features/wealth/types";
import { XpProfile } from "@/features/xp/xpSystem";

export type AscensionIntelligencePriority =
  | "data"
  | "risk"
  | "patrimony"
  | "objectives"
  | "academy"
  | "discipline"
  | "sport"
  | "growth";

export type AscensionIntelligenceV3Input = {
  academyState: AcademyEngineState | null;
  ascensionIQ: AscensionIQProfile | null;
  objectiveState: ObjectiveEngineState | null;
  wealthState: WealthState | null;
  bankroll: BankrollState;
  tickets: AscensionTicket[];
  disciplineProfile: DisciplineProfile;
  xpProfile: XpProfile | null;
  financialProfile?: FinancialProfile | null;
  today?: Date;
};

export type AscensionIntelligenceV3Recommendation = {
  priority: AscensionIntelligencePriority;
  contextLabel: string;
  adviceOfTheDay: string;
  dailyMission: string;
  mistakeToAvoid: string;
  nextStep: string;
  recommendedObjective: string;
  strength: string;
  weakness: string;
  score: number;
  source: "local";
};

type Candidate = AscensionIntelligenceV3Recommendation & {
  conditions: string[];
};

const adviceOpeners = [
  "Aujourd'hui, le point le plus important est simple :",
  "Ascension te conseille de commencer par ceci :",
  "Ton meilleur levier du jour est clair :",
  "La décision la plus utile aujourd'hui est la suivante :",
  "Le signal local le plus fort indique ceci :",
  "Avant de chercher plus loin, concentre-toi sur ceci :",
  "Le conseil prioritaire du jour est le suivant :",
  "Ton tableau de bord montre une priorité nette :",
  "La meilleure action n'est pas la plus spectaculaire :",
  "Ascension voit une action plus importante que les autres :"
];

const missionVerbs = [
  "Mets à jour",
  "Vérifie",
  "Écris",
  "Compare",
  "Calcule",
  "Clarifie",
  "Revois",
  "Termine",
  "Ajoute",
  "Observe"
];

const missionObjects = [
  "un chiffre réel",
  "ton objectif principal",
  "ta capacité d'épargne",
  "ta prochaine leçon",
  "ta répartition patrimoniale",
  "ta bankroll",
  "ta série de discipline",
  "ton point faible Ascension IQ",
  "tes revenus passifs",
  "ton prochain petit progrès"
];

const encouragements = [
  "La précision construit la confiance.",
  "Un chiffre réel vaut mieux qu'une estimation flatteuse.",
  "La discipline protège ton futur.",
  "La progression durable vient des petits réglages.",
  "La maîtrise commence par la clarté.",
  "Une décision calme peut éviter beaucoup d'erreurs.",
  "Tu n'as pas besoin d'aller vite pour avancer.",
  "La cohérence est plus puissante que l'intensité.",
  "Chaque donnée vraie rend Ascension plus intelligente.",
  "Ton futur se construit dans les détails."
];

const mistakePatterns = [
  "Éviter d'agir avec des chiffres incomplets.",
  "Éviter de confondre envie et objectif.",
  "Éviter de modifier une méthode après un seul résultat.",
  "Éviter de chercher une opportunité avant de comprendre ta situation.",
  "Éviter de comparer ton parcours à celui des autres.",
  "Éviter d'investir sans horizon clair.",
  "Éviter de surcharger ta journée avec dix actions.",
  "Éviter de compter sur une seule source de progression.",
  "Éviter de laisser un objectif sans date.",
  "Éviter de prendre une baisse comme un échec personnel."
];

const nextStepPatterns = [
  "Ouvre Profil puis Mon Patrimoine.",
  "Va dans Academy et continue la prochaine leçon.",
  "Va dans Objectifs et vérifie la cohérence de ta cible.",
  "Regarde ta bankroll sans modifier ton plan.",
  "Relis ton point faible Ascension IQ.",
  "Complète une donnée manquante avant d'ajouter une action.",
  "Choisis une mission courte et termine-la.",
  "Compare ton taux d'épargne avec ton objectif.",
  "Observe ta répartition avant de chercher un nouveau signal.",
  "Garde une seule priorité jusqu'à ce soir."
];

const objectivePatterns = [
  "Créer une réserve de sécurité claire.",
  "Augmenter progressivement l'épargne mensuelle.",
  "Réduire une dépense variable inutile.",
  "Atteindre une série de discipline de 7 jours.",
  "Terminer le niveau Academy en cours.",
  "Créer un objectif patrimonial chiffré.",
  "Stabiliser la bankroll avant toute nouvelle prise de risque.",
  "Diversifier progressivement le patrimoine.",
  "Suivre les revenus passifs réels.",
  "Améliorer le point faible Ascension IQ."
];

export function generateAscensionIntelligenceV3(input: AscensionIntelligenceV3Input): AscensionIntelligenceV3Recommendation {
  const today = input.today ?? new Date();
  const seed = getRecommendationSeed(input, today);
  const candidates = buildCandidates(input, seed);
  const sortedCandidates = candidates.sort((left, right) => right.score - left.score);
  const selectedCandidate = sortedCandidates[0] ?? buildFallbackCandidate(seed);

  return {
    priority: selectedCandidate.priority,
    contextLabel: selectedCandidate.contextLabel,
    adviceOfTheDay: selectedCandidate.adviceOfTheDay,
    dailyMission: selectedCandidate.dailyMission,
    mistakeToAvoid: selectedCandidate.mistakeToAvoid,
    nextStep: selectedCandidate.nextStep,
    recommendedObjective: selectedCandidate.recommendedObjective,
    strength: selectedCandidate.strength,
    weakness: selectedCandidate.weakness,
    score: selectedCandidate.score,
    source: "local"
  };
}

function buildCandidates(input: AscensionIntelligenceV3Input, seed: number): Candidate[] {
  const academyLessons = input.academyState?.modules.flatMap((module) => module.lessons) ?? [];
  const completedLessons = academyLessons.filter((lesson) => lesson.status === "completed");
  const nextLesson = academyLessons.find((lesson) => lesson.status !== "completed");
  const academyProgress = input.academyState?.progressPercent ?? 0;
  const wealthMetrics = input.wealthState ? calculateWealthMetrics(input.wealthState) : null;
  const financialMetrics = input.financialProfile ? calculateFinancialProfileMetrics(input.financialProfile) : null;
  const bankrollStats = getBankrollStats(input.bankroll);
  const playedTickets = input.tickets.filter((ticket) => ticket.input.playStatus === "played");
  const pendingTickets = playedTickets.filter((ticket) => ticket.selection.status === "pending");
  const activeObjectives = input.objectiveState?.activeObjectives ?? [];
  const achievedObjectives = input.objectiveState?.achievedObjectives ?? [];
  const strongestSkill = input.ascensionIQ?.strengths[0];
  const weakestSkill = input.ascensionIQ?.improvements[0];
  const candidates: Candidate[] = [];

  if (!wealthMetrics || (wealthMetrics.grossWealth === 0 && wealthMetrics.monthlyIncome === 0)) {
    candidates.push(makeCandidate({
      priority: "data",
      score: 980,
      contextLabel: "Patrimoine à compléter",
      coreAdvice: "renseigne ton patrimoine réel avant d'attendre des recommandations précises.",
      mission: "ajoute au moins une donnée réelle dans Mon Patrimoine.",
      nextStep: "Ouvre Profil puis Mon Patrimoine.",
      recommendedObjective: "Créer une première base patrimoniale fiable.",
      strength: "Tu avances sans connecter de compte bancaire.",
      weakness: "Ascension manque encore de données réelles.",
      seed,
      conditions: ["wealth-empty"]
    }));
  }

  if (wealthMetrics && wealthMetrics.grossWealth > 0) {
    const mainAllocation = [...wealthMetrics.allocation].sort((left, right) => right.percent - left.percent)[0];
    const businessShare = wealthMetrics.grossWealth > 0 ? (wealthMetrics.business.grossWealth / wealthMetrics.grossWealth) * 100 : 0;
    const realEstateShare = wealthMetrics.grossWealth > 0
      ? ((wealthMetrics.allocation.find((item) => item.category === "realEstate")?.value ?? 0) / wealthMetrics.grossWealth) * 100
      : 0;

    if (mainAllocation && mainAllocation.percent >= 70) {
      candidates.push(makeCandidate({
        priority: "patrimony",
        score: 900 + mainAllocation.percent,
        contextLabel: "Concentration patrimoniale",
        coreAdvice: `ton patrimoine est très concentré sur ${mainAllocation.label.toLowerCase()}.`,
        mission: "observe ta répartition avant d'ajouter un nouvel actif.",
        nextStep: "Va dans Mon Patrimoine et regarde la répartition.",
        recommendedObjective: "Construire une répartition plus équilibrée.",
        strength: "Tu as commencé à suivre ton patrimoine réel.",
        weakness: `La catégorie ${mainAllocation.label} pèse ${mainAllocation.percent.toFixed(0)}%.`,
        seed: seed + 1,
        conditions: ["wealth-concentration"]
      }));
    }

    if (businessShare >= 35) {
      candidates.push(makeCandidate({
        priority: "patrimony",
        score: 885 + businessShare,
        contextLabel: "Entreprise",
        coreAdvice: "ton entreprise contribue fortement à ton patrimoine global.",
        mission: "vérifie régulièrement la valeur actuelle du fonds et des murs.",
        nextStep: "Ouvre Mon Patrimoine puis la section Entreprise.",
        recommendedObjective: "Suivre la valorisation professionnelle tous les trimestres.",
        strength: "Tu as une base patrimoniale professionnelle importante.",
        weakness: `L'entreprise représente ${businessShare.toFixed(0)}% du patrimoine brut.`,
        seed: seed + 11,
        conditions: ["business-contribution"]
      }));
    }

    if (realEstateShare >= 40) {
      candidates.push(makeCandidate({
        priority: "patrimony",
        score: 845 + realEstateShare,
        contextLabel: "Immobilier",
        coreAdvice: "ton patrimoine immobilier représente une part majeure de ton patrimoine.",
        mission: "observe la valeur nette des murs et le capital restant dû.",
        nextStep: "Va dans Mon Patrimoine et regarde les murs commerciaux.",
        recommendedObjective: "Suivre l'évolution de la valeur immobilière nette.",
        strength: "Tes murs prennent de la valeur dans ton suivi patrimonial.",
        weakness: `L'immobilier représente ${realEstateShare.toFixed(0)}% du patrimoine brut.`,
        seed: seed + 12,
        conditions: ["real-estate-share"]
      }));
    }

    if (wealthMetrics.passiveMonthlyIncome === 0) {
      candidates.push(makeCandidate({
        priority: "patrimony",
        score: 760,
        contextLabel: "Revenus passifs",
        coreAdvice: "tes revenus passifs sont encore à zéro dans les données locales.",
        mission: "renseigne les dividendes, loyers ou revenus déjà perçus si tu en as.",
        nextStep: "Complète les champs revenus dans Mon Patrimoine.",
        recommendedObjective: "Suivre les premiers revenus passifs réels.",
        strength: "Ta base patrimoniale peut maintenant être suivie.",
        weakness: "Les revenus générés ne sont pas encore mesurés.",
        seed: seed + 2,
        conditions: ["passive-income-empty"]
      }));
    }
  }

  const monthlyIncome = wealthMetrics?.monthlyIncome ?? financialMetrics?.monthlyIncome ?? 0;
  const investmentCapacity = input.wealthState?.personalSituation.monthlyInvestmentCapacity ?? input.financialProfile?.monthlyInvestment ?? 0;
  const savingsRate = wealthMetrics?.savingsRate ?? financialMetrics?.savingsRate ?? 0;

  if (monthlyIncome > 0 && investmentCapacity / monthlyIncome < 0.05) {
    candidates.push(makeCandidate({
      priority: "growth",
      score: 830,
      contextLabel: "Investissement mensuel",
      coreAdvice: "tu investis peu chaque mois par rapport à tes revenus renseignés.",
      mission: "teste mentalement une hausse de 50 € sans la valider trop vite.",
      nextStep: "Compare ta capacité d'investissement avec tes charges.",
      recommendedObjective: "Augmenter progressivement l'investissement mensuel.",
      strength: "Tu peux mesurer ton effort réel.",
      weakness: "La capacité d'investissement semble encore basse.",
      seed: seed + 3,
      conditions: ["low-investment-rate"]
    }));
  }

  if (monthlyIncome > 0 && savingsRate < 10) {
    candidates.push(makeCandidate({
      priority: "risk",
      score: 850,
      contextLabel: "Taux d'épargne",
      coreAdvice: "ton taux d'épargne mérite d'être renforcé avant d'accélérer.",
      mission: "cherche une dépense variable que tu peux réduire sans frustration.",
      nextStep: "Mets à jour tes dépenses variables dans Mon Patrimoine.",
      recommendedObjective: "Gagner 50 € d'épargne mensuelle.",
      strength: "Tu as assez de données pour agir précisément.",
      weakness: `Le taux d'épargne est à ${savingsRate.toFixed(1)}%.`,
      seed: seed + 4,
      conditions: ["low-savings-rate"]
    }));
  }

  if (activeObjectives.length === 0 && achievedObjectives.length === 0) {
    candidates.push(makeCandidate({
      priority: "objectives",
      score: 810,
      contextLabel: "Objectif manquant",
      coreAdvice: "tes données ont besoin d'un objectif clair pour devenir une trajectoire.",
      mission: "crée un objectif avec un montant, une raison et une date.",
      nextStep: "Va dans Objectifs et ajoute une première cible.",
      recommendedObjective: "Créer un objectif financier simple.",
      strength: "Tu peux transformer tes chiffres en plan.",
      weakness: "Aucun objectif actif ne guide encore tes décisions.",
      seed: seed + 5,
      conditions: ["no-objectives"]
    }));
  }

  if (academyProgress >= 70 && nextLesson) {
    candidates.push(makeCandidate({
      priority: "academy",
      score: 780 + academyProgress,
      contextLabel: "Academy",
      coreAdvice: "tu progresses rapidement dans Academy.",
      mission: `continue la prochaine leçon : ${nextLesson.title}.`,
      nextStep: "Ouvre Academy et garde l'élan.",
      recommendedObjective: "Terminer le niveau en cours.",
      strength: `${completedLessons.length} leçons terminées.`,
      weakness: "Le plus grand risque serait de perdre le rythme.",
      seed: seed + 6,
      conditions: ["academy-fast-progress"]
    }));
  }

  if (input.ascensionIQ && weakestSkill && weakestSkill.progress < 35) {
    candidates.push(makeCandidate({
      priority: "academy",
      score: 790 + (35 - weakestSkill.progress),
      contextLabel: "Ascension IQ",
      coreAdvice: `ta compétence ${weakestSkill.label} est le meilleur axe d'amélioration.`,
      mission: `travaille ${weakestSkill.label} pendant quelques minutes.`,
      nextStep: "Ouvre Academy ou une Masterclass liée à ce sujet.",
      recommendedObjective: `Renforcer ${weakestSkill.label}.`,
      strength: strongestSkill ? `Ton point fort actuel : ${strongestSkill.label}.` : "Tu construis ton profil progressivement.",
      weakness: `${weakestSkill.label} est à ${weakestSkill.progress}%.`,
      seed: seed + 7,
      conditions: ["iq-weak-skill"]
    }));
  }

  if (pendingTickets.length > 0) {
    candidates.push(makeCandidate({
      priority: "sport",
      score: 740 + pendingTickets.length * 12,
      contextLabel: "Pronostics",
      coreAdvice: "tes paris en attente doivent rester suivis sans intervention impulsive.",
      mission: "attends le résultat officiel avant toute conclusion.",
      nextStep: "Va dans Pronostics seulement pour vérifier le statut.",
      recommendedObjective: "Respecter la méthode jusqu'au résultat.",
      strength: "Les tickets joués sont déjà structurés.",
      weakness: "L'impatience peut coûter plus cher qu'une erreur d'analyse.",
      seed: seed + 8,
      conditions: ["pending-tickets"]
    }));
  }

  if (bankrollStats.profit < 0 && bankrollStats.settledCount > 0) {
    candidates.push(makeCandidate({
      priority: "risk",
      score: 860 + Math.abs(bankrollStats.profit),
      contextLabel: "Bankroll",
      coreAdvice: "ta bankroll traverse une baisse, la priorité est de protéger la méthode.",
      mission: "ne modifie pas la mise pour récupérer une perte.",
      nextStep: "Relis l'historique avant de jouer autre chose.",
      recommendedObjective: "Stabiliser la bankroll.",
      strength: "Les pertes sont suivies au lieu d'être ignorées.",
      weakness: `Bénéfice actuel : ${bankrollStats.profit.toFixed(2)} €.`,
      seed: seed + 9,
      conditions: ["negative-bankroll"]
    }));
  }

  if (input.disciplineProfile.currentStreak >= 7) {
    candidates.push(makeCandidate({
      priority: "discipline",
      score: 700 + input.disciplineProfile.currentStreak,
      contextLabel: "Discipline",
      coreAdvice: "ta série quotidienne devient un avantage réel.",
      mission: "protège ta série avec une seule action simple.",
      nextStep: "Termine la mission du jour avant toute autre chose.",
      recommendedObjective: "Atteindre la prochaine série de discipline.",
      strength: `${input.disciplineProfile.currentStreak} jours de discipline.`,
      weakness: "Une série se perd souvent quand on veut trop en faire.",
      seed: seed + 10,
      conditions: ["discipline-streak"]
    }));
  }

  if ((input.xpProfile?.progressToNextLevel ?? 0) >= 80) {
    candidates.push(makeCandidate({
      priority: "growth",
      score: 730,
      contextLabel: "XP",
      coreAdvice: "tu es proche du prochain niveau.",
      mission: "termine une action qui rapporte des XP aujourd'hui.",
      nextStep: "Ouvre Academy ou valide une mission simple.",
      recommendedObjective: "Passer au prochain niveau Ascension.",
      strength: `${input.xpProfile?.xp ?? 0} XP accumulés.`,
      weakness: "L'élan peut se perdre si tu reportes trop longtemps.",
      seed: seed + 11,
      conditions: ["xp-close-next-level"]
    }));
  }

  return candidates;
}

function makeCandidate({
  priority,
  score,
  contextLabel,
  coreAdvice,
  mission,
  nextStep,
  recommendedObjective,
  strength,
  weakness,
  seed,
  conditions
}: {
  priority: AscensionIntelligencePriority;
  score: number;
  contextLabel: string;
  coreAdvice: string;
  mission: string;
  nextStep: string;
  recommendedObjective: string;
  strength: string;
  weakness: string;
  seed: number;
  conditions: string[];
}): Candidate {
  return {
    priority,
    score,
    contextLabel,
    adviceOfTheDay: `${pick(adviceOpeners, seed)} ${coreAdvice}`,
    dailyMission: `${pick(missionVerbs, seed + 1)} ${pick(missionObjects, seed + 2)} : ${mission}`,
    mistakeToAvoid: pick(mistakePatterns, seed + 3),
    nextStep: nextStep || pick(nextStepPatterns, seed + 4),
    recommendedObjective: recommendedObjective || pick(objectivePatterns, seed + 5),
    strength: strength || pick(encouragements, seed + 6),
    weakness: weakness || pick(mistakePatterns, seed + 7),
    source: "local",
    conditions
  };
}

function buildFallbackCandidate(seed: number): Candidate {
  return makeCandidate({
    priority: "growth",
    score: 500,
    contextLabel: "Coach local",
    coreAdvice: "continue avec une seule action utile aujourd'hui.",
    mission: "termine une action courte dans Ascension.",
    nextStep: pick(nextStepPatterns, seed),
    recommendedObjective: pick(objectivePatterns, seed + 1),
    strength: pick(encouragements, seed + 2),
    weakness: "Le risque principal est de vouloir tout faire en même temps.",
    seed,
    conditions: ["fallback"]
  });
}

function getRecommendationSeed(input: AscensionIntelligenceV3Input, date: Date) {
  const daySeed = Math.floor(date.getTime() / 86_400_000);
  const xpSeed = input.xpProfile?.xp ?? 0;
  const ticketSeed = input.tickets.length * 17;
  const objectiveSeed = (input.objectiveState?.objectives.length ?? 0) * 31;
  const disciplineSeed = input.disciplineProfile.currentStreak * 13 + input.disciplineProfile.score;

  return daySeed + xpSeed + ticketSeed + objectiveSeed + disciplineSeed;
}

function pick(items: string[], seed: number) {
  return items[Math.abs(Math.round(seed)) % items.length] ?? items[0] ?? "";
}
