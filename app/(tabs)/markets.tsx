import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard } from "@/components/GlassCard";
import { PremiumButton } from "@/components/PremiumButton";
import { colors, radii, spacing } from "@/constants/theme";
import { AcademyEngine } from "@/engine/academy";
import { MarketEngine, MarketEngineOpportunity } from "@/engine/markets";
import { MarketStats } from "@/engine/markets/marketStats";
import { UserAccessService } from "@/features/access/userAccess";
import {
  MarketCategory,
  MarketDirection,
  MarketOpportunityStatus
} from "@/features/markets/types";

const categoryLabel: Record<MarketCategory, string> = {
  action: "Action",
  etf: "ETF",
  crypto: "Crypto",
  matiere_premiere: "Matière première",
  devise: "Devise",
  indice: "Indice"
};

const directionLabel: Record<MarketDirection, string> = {
  achat: "ACHAT",
  vente: "VENTE",
  surveillance: "SURVEILLANCE"
};

const statusLabel: Record<MarketOpportunityStatus, string> = {
  forecast: "Prévision",
  watchlist: "À surveiller",
  validated: "Validée",
  ignored: "Ignoré",
  finished: "Terminée"
};
const academyRoute = "/(tabs)/academy" as never;

export default function MarketsScreen() {
  const router = useRouter();
  const [dailyOpportunity, setDailyOpportunity] = useState<MarketEngineOpportunity | null>(null);
  const [secondaryOpportunities, setSecondaryOpportunities] = useState<MarketEngineOpportunity[]>([]);
  const [marketHistory, setMarketHistory] = useState<MarketEngineOpportunity[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [generatedAt, setGeneratedAt] = useState("");
  const [hasMarketsPremiumAccess, setHasMarketsPremiumAccess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      Promise.all([MarketEngine.getState(), AcademyEngine.getState()]).then(async ([marketState, academyState]) => {
        const accessState = await UserAccessService.getState(academyState);
        setDailyOpportunity(marketState.dailyOpportunity);
        setSecondaryOpportunities(marketState.secondaryOpportunities);
        setMarketHistory(marketState.history);
        setMarketStats(marketState.stats);
        setGeneratedAt(marketState.generatedAt);
        setHasMarketsPremiumAccess(accessState.fullAccess || accessState.premiumAccess.markets);
      });
    }, [])
  );
  const totalDisplayed = (dailyOpportunity ? 1 : 0) + secondaryOpportunities.length;

  return (
    <AppScreen>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Radar Marchés</Text>
          <Text style={styles.subtitle}>Bourse, crypto, matières premières et devises.</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name={hasMarketsPremiumAccess ? "trending-up-outline" : "lock-closed-outline"} size={14} color={colors.gold} />
          <Text style={styles.badgeText}>{hasMarketsPremiumAccess ? `${totalDisplayed}/3` : "Découverte"}</Text>
        </View>
      </View>

      <Text style={styles.syncText}>
        Source locale · prêt pour IA/API{generatedAt ? ` · ${new Date(generatedAt).toLocaleDateString("fr-FR")}` : ""}
      </Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Opportunité du jour</Text>
          <Text style={styles.sectionMeta}>{hasMarketsPremiumAccess ? (dailyOpportunity ? "1 signal" : "0 signal") : "Premium"}</Text>
        </View>

        <View style={styles.list}>
          {!hasMarketsPremiumAccess ? (
            <GlassCard style={styles.lockedPanel}>
              <Ionicons name="lock-closed-outline" size={28} color={colors.gold} />
              <Text style={styles.emptyTitle}>Signaux du jour réservés</Text>
              <Text style={styles.emptyText}>
                En Mode Découverte, tu peux consulter la méthode, les statistiques publiques et l'historique. Les opportunités en temps réel nécessitent les conditions applicables et un abonnement actif.
              </Text>
              <PremiumButton label="Ouvrir Academy" icon="school-outline" onPress={() => router.push(academyRoute)} />
            </GlassCard>
          ) : !dailyOpportunity ? (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="scan-outline" size={28} color={colors.gold} />
              <Text style={styles.emptyTitle}>Aucune opportunité aujourd'hui.</Text>
              <Text style={styles.emptyText}>Ascension préfère ne rien afficher plutôt que forcer un signal faible.</Text>
            </GlassCard>
          ) : null}

          {hasMarketsPremiumAccess && dailyOpportunity ? <MarketOpportunityCard opportunity={dailyOpportunity} featured /> : null}
        </View>
      </View>

      {hasMarketsPremiumAccess && secondaryOpportunities.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Opportunités secondaires</Text>
            <Text style={styles.sectionMeta}>{secondaryOpportunities.length}/2</Text>
          </View>
          <View style={styles.list}>
            {secondaryOpportunities.map((opportunity) => (
              <MarketOpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Statistiques publiques</Text>
          <Text style={styles.sectionMeta}>Méthode Ascension</Text>
        </View>
        <View style={styles.grid}>
          <MarketInfo label="Signaux suivis" value={`${marketStats?.total ?? 0}`} />
          <MarketInfo label="Score moyen" value={`${marketStats?.averageScore ?? 0}/100`} />
          <MarketInfo label="Terminés" value={`${marketStats?.byStatus.finished ?? 0}`} />
          <MarketInfo label="À surveiller" value={`${marketStats?.byStatus.watchlist ?? 0}`} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Historique Marchés</Text>
          <Text style={styles.sectionMeta}>{marketHistory.length} terminé</Text>
        </View>
        <View style={styles.list}>
          {marketHistory.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="bar-chart-outline" size={28} color={colors.gold} />
              <Text style={styles.emptyTitle}>Aucun historique marché pour l'instant.</Text>
              <Text style={styles.emptyText}>Les opportunités terminées apparaîtront ici pour rester consultables en Mode Découverte.</Text>
            </GlassCard>
          ) : null}
          {marketHistory.map((opportunity) => (
            <MarketOpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </View>
      </View>
    </AppScreen>
  );
}

function MarketOpportunityCard({ opportunity, featured = false }: { opportunity: MarketEngineOpportunity; featured?: boolean }) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.assetPill}>
          <Ionicons name="pulse-outline" size={13} color={colors.gold} />
          <Text style={styles.assetPillText}>{categoryLabel[opportunity.category]}</Text>
        </View>
        <Text style={styles.status}>{statusLabel[opportunity.status]}</Text>
      </View>

      <View style={styles.assetRow}>
        <View>
          <Text style={[styles.asset, featured && styles.assetFeatured]}>{opportunity.asset}</Text>
          <Text style={styles.direction}>Action : {directionLabel[opportunity.direction]}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Score Ascension</Text>
          <Text style={styles.score}>{opportunity.ascensionScore}<Text style={styles.scoreSuffix}>/100</Text></Text>
        </View>
      </View>

      <View style={styles.grid}>
        <MarketInfo label="Prix actuel" value={opportunity.estimatedCurrentPrice} />
        <MarketInfo label="Zone d'entrée" value={opportunity.entryZone} />
        <MarketInfo label="Objectif" value={opportunity.target} />
        <MarketInfo label="Stop conseillé" value={opportunity.stopLoss} />
      </View>

      <View style={styles.analysisBox}>
        <Text style={styles.confidence}>Confiance : {formatStars(opportunity.confidenceStars)}</Text>
        <Text style={styles.analysisTitle}>Analyse Ascension</Text>
        <Text style={styles.analysis}>{opportunity.shortAnalysis}</Text>
      </View>
    </GlassCard>
  );
}

function formatStars(stars: number) {
  return `${"★".repeat(Math.max(0, Math.min(stars, 5)))}${"☆".repeat(Math.max(0, 5 - stars))}`;
}

function MarketInfo({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  title: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "700"
  },
  subtitle: {
    color: "#C8C8C8",
    fontSize: 13,
    fontWeight: "400"
  },
  badge: {
    minHeight: 34,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#050505"
  },
  badgeText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700"
  },
  syncText: {
    color: "#8A8A8A",
    fontSize: 11,
    fontWeight: "400",
    marginTop: -spacing.sm
  },
  section: {
    gap: spacing.sm
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700"
  },
  sectionMeta: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "500"
  },
  list: {
    gap: spacing.md
  },
  emptyCard: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    backgroundColor: "#050505",
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center"
  },
  emptyText: {
    color: "#C8C8C8",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  },
  lockedPanel: {
    minHeight: 240,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md
  },
  card: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm
  },
  cardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  assetPill: {
    minHeight: 28,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "rgba(228, 169, 69, 0.08)"
  },
  assetPillText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700"
  },
  status: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700"
  },
  assetRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  asset: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700"
  },
  assetFeatured: {
    fontSize: 24
  },
  direction: {
    color: "#C8C8C8",
    fontSize: 13,
    fontWeight: "500"
  },
  scoreBox: {
    alignItems: "flex-end"
  },
  scoreLabel: {
    color: "#8A8A8A",
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase"
  },
  score: {
    color: colors.gold,
    fontSize: 26,
    fontWeight: "700"
  },
  scoreSuffix: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "600"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  infoBox: {
    width: "48%",
    minHeight: 76,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.sm,
    backgroundColor: "#050505",
    padding: spacing.sm,
    gap: 5
  },
  metaLabel: {
    color: "#8A8A8A",
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase"
  },
  infoValue: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600"
  },
  analysisBox: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.sm,
    backgroundColor: "#050505",
    padding: spacing.sm,
    gap: 5
  },
  confidence: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700"
  },
  analysisTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700"
  },
  analysis: {
    color: "#C8C8C8",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400"
  }
});
