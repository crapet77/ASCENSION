import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard } from "@/components/GlassCard";
import { Header } from "@/components/Header";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { ObjectiveEngine, ObjectiveEngineState, ObjectiveProgress } from "@/engine/objectives";
import {
  calculateFinancialProfileMetrics,
  defaultFinancialProfile,
  FinancialProfile,
  loadFinancialProfile
} from "@/features/financialProfile";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

type GoalCategoryView = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  color: string;
};

const motivationQuotes = [
  "Les petits progrès répétés créent les grandes réussites.",
  "Chaque euro investi travaille pour ton futur.",
  "La discipline construit la liberté.",
  "Un objectif clair transforme l'effort en direction.",
  "Le calme gagne souvent contre la précipitation."
];

export default function DisciplineScreen() {
  const { theme } = useAscensionTheme();
  const [objectiveState, setObjectiveState] = useState<ObjectiveEngineState | null>(null);
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>(defaultFinancialProfile);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      Promise.all([ObjectiveEngine.getState(), loadFinancialProfile()]).then(([nextState, nextFinancialProfile]) => {
        if (active) {
          setObjectiveState(nextState);
          setFinancialProfile(nextFinancialProfile);
        }
      });

      return () => {
        active = false;
      };
    }, [])
  );

  const objectives = objectiveState?.objectives ?? [];
  const activeObjectives = objectiveState?.activeObjectives ?? [];
  const achievedObjectives = objectiveState?.achievedObjectives ?? [];
  const financialMetrics = useMemo(() => calculateFinancialProfileMetrics(financialProfile), [financialProfile]);
  const primaryObjective = activeObjectives[0] ?? objectives[0] ?? null;
  const stats = useMemo(() => getObjectiveStats(objectiveState), [objectiveState]);
  const recommendation = useMemo(() => getObjectiveRecommendation(primaryObjective, financialMetrics), [primaryObjective, financialMetrics]);
  const distribution = useMemo(() => getDistributionRows(financialMetrics), [financialMetrics]);
  const motivation = motivationQuotes[new Date().getDate() % motivationQuotes.length];

  return (
    <AppScreen>
      <Header
        eyebrow="Objectifs"
        title="Construire ton avenir"
        subtitle="Un conseiller personnel pour suivre tes objectifs, mesurer ton rythme et garder le cap."
      />

      {primaryObjective ? (
        <GlassCard style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Ionicons name={getObjectiveIcon(primaryObjective.category)} size={24} color={theme.accentSoft} />
            </View>
            <View style={styles.heroCopy}>
              <Text style={[styles.sectionEyebrow, { color: theme.accentSoft }]}>OBJECTIF PRINCIPAL</Text>
              <Text style={[styles.heroTitle, { color: theme.text }]}>{primaryObjective.title}</Text>
            </View>
          </View>

          <View style={styles.heroMetrics}>
            <View>
              <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Montant cible</Text>
              <Text style={[styles.heroAmount, { color: theme.text }]}>{formatObjectiveValue(primaryObjective.targetValue, primaryObjective.category)}</Text>
            </View>
            <View style={[styles.percentPill, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
              <Text style={[styles.percentText, { color: theme.accentSoft }]}>{Math.round(primaryObjective.progressPercent)}%</Text>
            </View>
          </View>

          <AnimatedProgressBar progress={primaryObjective.progressPercent} />

          <View style={styles.heroFooter}>
            <InfoPill label="Progression" value={formatObjectiveValue(primaryObjective.currentValue, primaryObjective.category)} />
            <InfoPill label="Temps restant" value={primaryObjective.estimatedTimeLabel ?? "Rythme à suivre"} />
          </View>
        </GlassCard>
      ) : (
        <GlassCard style={styles.heroCard}>
          <Text style={[styles.heroTitle, { color: theme.text }]}>Aucun objectif actif</Text>
          <Text style={[styles.bodyText, { color: theme.textMuted }]}>Ajoute un objectif pour commencer à mesurer ton ascension.</Text>
        </GlassCard>
      )}

      <GlassCard style={styles.projectionCard}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>MON PROFIL FINANCIER</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Revenus mensuels" value={formatMoney(financialMetrics.monthlyIncome)} />
          <StatCard label="Charges fixes" value={formatMoney(financialProfile.fixedMonthlyExpenses)} />
          <StatCard label="Capacité d'épargne" value={formatMoney(financialMetrics.savingsCapacity)} tone="success" />
          <StatCard label="Taux d'épargne" value={`${formatNumber(financialMetrics.savingsRate)} %`} />
          <StatCard label="Patrimoine réel" value={formatMoney(financialMetrics.totalWealth)} />
          <StatCard label="Investi / mois" value={formatMoney(financialProfile.monthlyInvestment)} />
        </View>
      </GlassCard>

      <View style={styles.sectionBlock}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>LES OBJECTIFS EN COURS</Text>
        <View style={styles.objectiveList}>
          {activeObjectives.map((objective) => (
            <ObjectiveCard key={objective.id} objective={objective} />
          ))}
          {activeObjectives.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Text style={[styles.bodyText, { color: theme.textMuted }]}>Aucun objectif en cours pour le moment.</Text>
            </GlassCard>
          ) : null}
        </View>
      </View>

      <GlassCard style={styles.coachCard}>
        <View style={styles.rowHeader}>
          <View style={[styles.smallIcon, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
            <Ionicons name="sparkles-outline" size={16} color={theme.accentSoft} />
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>RECOMMANDATION ASCENSION</Text>
        </View>
        <Text style={[styles.coachText, { color: theme.text }]}>{recommendation}</Text>
      </GlassCard>

      <GlassCard style={styles.projectionCard}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>PROJECTION</Text>
        {financialMetrics.savingsCapacity > 0 ? (
          <View style={styles.projectionGrid}>
            <InfoPill label="Dans 6 mois" value={formatMoney(financialMetrics.totalWealth + financialMetrics.savingsCapacity * 6)} />
            <InfoPill label="Dans 1 an" value={formatMoney(financialMetrics.totalWealth + financialMetrics.savingsCapacity * 12)} />
            <InfoPill label="Dans 5 ans" value={formatMoney(financialMetrics.totalWealth + financialMetrics.savingsCapacity * 60)} />
          </View>
        ) : (
          <Text style={[styles.bodyText, { color: theme.textMuted }]}>
            Ajoute ton profil financier pour voir une projection basée sur tes données réelles.
          </Text>
        )}
      </GlassCard>

      <GlassCard style={styles.distributionCard}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>RÉPARTITION DES OBJECTIFS</Text>
        <View style={styles.distributionList}>
          {distribution.map((category) => (
            <View key={category.label} style={styles.distributionRow}>
              <View style={styles.distributionLabel}>
                <Ionicons name={category.icon} size={17} color={category.color} />
                <Text style={[styles.bodyText, { color: theme.text }]}>{category.label}</Text>
              </View>
              <View style={styles.distributionTrack}>
                <View style={[styles.distributionFill, { width: `${category.value}%`, backgroundColor: category.color }]} />
              </View>
              <Text style={[styles.distributionValue, { color: theme.textMuted }]}>{Math.round(category.value)}%</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.motivationCard}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={theme.accentSoft} />
        <Text style={[styles.quoteText, { color: theme.text }]}>{motivation}</Text>
      </GlassCard>

      <View style={styles.sectionBlock}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>STATISTIQUES</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Objectifs" value={String(stats.total)} />
          <StatCard label="Terminés" value={String(achievedObjectives.length)} tone="success" />
          <StatCard label="En cours" value={String(activeObjectives.length)} />
          <StatCard label="Total visé" value={formatMoney(stats.totalTarget)} />
          <StatCard label="Déjà atteint" value={formatMoney(stats.totalCurrent)} tone={stats.totalCurrent >= 0 ? "success" : "danger"} />
          <StatCard label="Réussite" value={`${stats.successRate}%`} tone="success" />
        </View>
      </View>
    </AppScreen>
  );
}

function ObjectiveCard({ objective }: { objective: ObjectiveProgress }) {
  const { theme } = useAscensionTheme();

  return (
    <GlassCard style={styles.objectiveCard}>
      <View style={styles.objectiveTop}>
        <View style={styles.objectiveTitleWrap}>
          <Text style={[styles.objectiveTitle, { color: theme.text }]}>{objective.title}</Text>
          <Text style={[styles.objectiveCategory, { color: theme.textMuted }]}>{getObjectiveCategoryLabel(objective.category)}</Text>
        </View>
        <Text style={[styles.objectivePercent, { color: theme.accentSoft }]}>{Math.round(objective.progressPercent)}%</Text>
      </View>
      <AnimatedProgressBar progress={objective.progressPercent} compact />
      <View style={styles.objectiveMetaGrid}>
        <InfoPill label="Actuel" value={formatObjectiveValue(objective.currentValue, objective.category)} />
        <InfoPill label="Cible" value={formatObjectiveValue(objective.targetValue, objective.category)} />
        <InfoPill label="Estimation" value={objective.estimatedTimeLabel ?? "À suivre"} />
      </View>
    </GlassCard>
  );
}

function AnimatedProgressBar({ progress, compact = false }: { progress: number; compact?: boolean }) {
  const { theme } = useAscensionTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.max(0, Math.min(progress, 100));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: clampedProgress,
      duration: 720,
      useNativeDriver: false
    }).start();
  }, [animatedValue, clampedProgress]);

  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"]
  });

  return (
    <View style={[styles.progressTrack, compact && styles.progressTrackCompact, { backgroundColor: theme.line }]}>
      <Animated.View style={[styles.progressFill, { width, backgroundColor: theme.accent }]} />
      <View style={[styles.progressShine, { backgroundColor: theme.accentSoft }]} />
    </View>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  const { theme } = useAscensionTheme();

  return (
    <View style={[styles.infoPill, { borderColor: theme.line, backgroundColor: theme.overlay }]}>
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone?: "success" | "danger" }) {
  const { theme } = useAscensionTheme();
  const valueColor = tone === "success" ? theme.success : tone === "danger" ? theme.danger : theme.text;

  return (
    <GlassCard style={styles.statCard} elevated={false}>
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    </GlassCard>
  );
}

function getObjectiveStats(state: ObjectiveEngineState | null) {
  const objectives = state?.objectives ?? [];
  const totalTarget = objectives.reduce((total, objective) => total + normalizeObjectiveMoneyValue(objective.targetValue, objective.category), 0);
  const totalCurrent = objectives.reduce((total, objective) => total + normalizeObjectiveMoneyValue(objective.currentValue, objective.category), 0);
  const successRate = objectives.length ? Math.round(((state?.achievedObjectives.length ?? 0) / objectives.length) * 100) : 0;

  return {
    total: objectives.length,
    totalTarget,
    totalCurrent,
    successRate
  };
}

function getObjectiveRecommendation(objective: ObjectiveProgress | null, financialMetrics: ReturnType<typeof calculateFinancialProfileMetrics>) {
  if (!objective) {
    return financialMetrics.completedFields > 0
      ? "Ton profil financier est prêt. Ajoute un objectif simple pour donner une direction à ton argent."
      : "Renseigne ton profil financier pour créer des objectifs réalistes.";
  }

  const remaining = Math.max(100 - objective.progressPercent, 0);

  if (objective.status === "achieved") {
    return "Objectif atteint. Excellent rythme, continue à construire sur cette base.";
  }

  if (objective.progressPercent >= 75) {
    return "Excellent rythme, continue. Tu es proche de transformer cet objectif en victoire.";
  }

  if (objective.progressPercent >= 45) {
    return "À ce rythme, tu avances correctement. Une action régulière peut accélérer la suite.";
  }

  if (objective.category === "bankroll_target" || objective.category === "profit_target") {
    return financialMetrics.savingsCapacity > 0
      ? `Ta capacité d'épargne actuelle est de ${formatMoney(financialMetrics.savingsCapacity)} par mois. Utilise-la pour ajuster ton échéance.`
      : "Renseigne tes revenus et charges pour estimer ton rythme réel.";
  }

  if (remaining > 80) {
    return "Ton objectif semble ambitieux. Garde-le, mais avance par paliers plus simples.";
  }

  return "Bon cap. La régularité compte plus que la vitesse.";
}

function getDistributionRows(financialMetrics: ReturnType<typeof calculateFinancialProfileMetrics>): GoalCategoryView[] {
  const iconById: Record<string, keyof typeof Ionicons.glyphMap> = {
    cash: "wallet-outline",
    etf: "pie-chart-outline",
    stocks: "trending-up-outline",
    crypto: "logo-bitcoin",
    realEstate: "home-outline",
    otherInvestments: "briefcase-outline"
  };
  const colorById: Record<string, string> = {
    cash: "#6EE7B7",
    etf: "#6EA8FF",
    stocks: "#B18CFF",
    crypto: "#F7931A",
    realEstate: "#C8A15A",
    otherInvestments: "#D9CBE8"
  };

  return financialMetrics.allocation.map((item) => ({
    label: item.label,
    icon: iconById[item.id],
    value: item.percent,
    color: colorById[item.id]
  }));
}

function normalizeObjectiveMoneyValue(value: number, category: ObjectiveProgress["category"]) {
  if (category === "bankroll_target" || category === "profit_target") {
    return Math.max(value, 0);
  }

  return 0;
}

function getObjectiveCategoryLabel(category: ObjectiveProgress["category"]) {
  switch (category) {
    case "bankroll_target":
      return "Épargne";
    case "profit_target":
      return "Performance";
    case "roi_target":
      return "Rendement";
    case "analyzed_bets_target":
      return "Analyse";
    case "discipline_streak_target":
      return "Discipline";
  }
}

function getObjectiveIcon(category: ObjectiveProgress["category"]): keyof typeof Ionicons.glyphMap {
  switch (category) {
    case "bankroll_target":
      return "wallet-outline";
    case "profit_target":
      return "cash-outline";
    case "roi_target":
      return "trending-up-outline";
    case "analyzed_bets_target":
      return "analytics-outline";
    case "discipline_streak_target":
      return "flame-outline";
  }
}

function formatObjectiveValue(value: number, category: ObjectiveProgress["category"]) {
  if (category === "roi_target") {
    return `${formatNumber(value)} %`;
  }

  if (category === "analyzed_bets_target") {
    return `${Math.round(value)} paris`;
  }

  if (category === "discipline_streak_target") {
    return `${Math.round(value)} jours`;
  }

  return formatMoney(value);
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value)} €`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(value);
}

const styles = StyleSheet.create({
  heroCard: {
    padding: spacing.lg,
    gap: spacing.lg
  },
  heroTop: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center"
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center"
  },
  heroCopy: {
    flex: 1,
    gap: 6
  },
  sectionEyebrow: {
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 2.2
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 31,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.2
  },
  heroMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md
  },
  heroAmount: {
    fontSize: 27,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.2
  },
  percentPill: {
    minWidth: 86,
    minHeight: 42,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  percentText: {
    fontSize: 18,
    fontFamily: typography.fontFamily,
    fontWeight: "600"
  },
  heroFooter: {
    flexDirection: "row",
    gap: spacing.sm
  },
  sectionBlock: {
    gap: spacing.md
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 2.1
  },
  objectiveList: {
    gap: spacing.md
  },
  objectiveCard: {
    padding: spacing.md,
    gap: spacing.md
  },
  objectiveTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  objectiveTitleWrap: {
    flex: 1,
    gap: 5
  },
  objectiveTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: typography.fontFamily,
    fontWeight: "500"
  },
  objectiveCategory: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400"
  },
  objectivePercent: {
    fontSize: 18,
    fontFamily: typography.fontFamily,
    fontWeight: "600"
  },
  objectiveMetaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  infoPill: {
    flexGrow: 1,
    minWidth: 96,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    gap: 4
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    letterSpacing: 0.25
  },
  infoValue: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "600"
  },
  progressTrack: {
    height: 9,
    borderRadius: radii.pill,
    overflow: "hidden"
  },
  progressTrackCompact: {
    height: 7
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.pill
  },
  progressShine: {
    position: "absolute",
    top: 1,
    left: 8,
    right: 8,
    height: 1,
    borderRadius: radii.pill,
    opacity: 0.62
  },
  coachCard: {
    padding: spacing.lg,
    gap: spacing.md
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  smallIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  coachText: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: typography.fontFamily,
    fontWeight: "500"
  },
  projectionCard: {
    padding: spacing.lg,
    gap: spacing.md
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: typography.fontFamily,
    fontWeight: "400"
  },
  projectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  projectionItem: {
    flex: 1,
    minWidth: 96,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: 6
  },
  projectionValue: {
    fontSize: 18,
    fontFamily: typography.fontFamily,
    fontWeight: "600"
  },
  distributionCard: {
    padding: spacing.lg,
    gap: spacing.md
  },
  distributionList: {
    gap: spacing.md
  },
  distributionRow: {
    gap: spacing.sm
  },
  distributionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  distributionTrack: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.09)",
    overflow: "hidden"
  },
  distributionFill: {
    height: "100%",
    borderRadius: radii.pill
  },
  distributionValue: {
    position: "absolute",
    right: 0,
    top: 0,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "500"
  },
  motivationCard: {
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: "flex-start"
  },
  quoteText: {
    fontSize: 19,
    lineHeight: 28,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.2
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  statCard: {
    width: "48%",
    minHeight: 82,
    padding: spacing.md,
    justifyContent: "space-between"
  },
  statValue: {
    fontSize: 20,
    fontFamily: typography.fontFamily,
    fontWeight: "600"
  },
  emptyCard: {
    padding: spacing.lg
  }
});
