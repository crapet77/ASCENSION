import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard, useGlassCardPalette } from "@/components/GlassCard";
import { PremiumButton } from "@/components/PremiumButton";
import { colors, radii, spacing, typography } from "@/constants/theme";
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
  const palette = useGlassCardPalette();
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
          <Text style={[styles.title, { color: palette.title }]}>Radar Marchés</Text>
          <Text style={[styles.subtitle, { color: palette.secondary }]}>Bourse, crypto, matières premières et devises.</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: palette.overlay, borderColor: palette.border }]}>
          <Ionicons name={hasMarketsPremiumAccess ? "trending-up-outline" : "lock-closed-outline"} size={14} color={palette.accentSoft} />
          <Text style={[styles.badgeText, { color: palette.accentSoft }]}>{hasMarketsPremiumAccess ? `${totalDisplayed}/3` : "Découverte"}</Text>
        </View>
      </View>

      <Text style={[styles.syncText, { color: palette.secondary }]}>
        Source locale · prêt pour IA/API{generatedAt ? ` · ${new Date(generatedAt).toLocaleDateString("fr-FR")}` : ""}
      </Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.accentSoft }]}>Opportunité du jour</Text>
          <Text style={[styles.sectionMeta, { color: palette.secondary }]}>{hasMarketsPremiumAccess ? (dailyOpportunity ? "1 signal" : "0 signal") : "Premium"}</Text>
        </View>

        <View style={styles.list}>
          {!hasMarketsPremiumAccess ? (
            <GlassCard style={styles.lockedPanel}>
              <Ionicons name="lock-closed-outline" size={28} color={palette.accentSoft} />
              <Text style={[styles.emptyTitle, { color: palette.title }]}>Signaux du jour réservés</Text>
              <Text style={[styles.emptyText, { color: palette.secondary }]}>
                En Mode Découverte, tu peux consulter la méthode, les statistiques publiques et l'historique. Les opportunités en temps réel nécessitent les conditions applicables et un abonnement actif.
              </Text>
              <PremiumButton label="Ouvrir Academy" icon="school-outline" onPress={() => router.push(academyRoute)} />
            </GlassCard>
          ) : !dailyOpportunity ? (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="scan-outline" size={28} color={palette.accentSoft} />
              <Text style={[styles.emptyTitle, { color: palette.title }]}>Aucune opportunité aujourd'hui.</Text>
              <Text style={[styles.emptyText, { color: palette.secondary }]}>Ascension préfère ne rien afficher plutôt que forcer un signal faible.</Text>
            </GlassCard>
          ) : null}

          {hasMarketsPremiumAccess && dailyOpportunity ? <MarketOpportunityCard opportunity={dailyOpportunity} featured /> : null}
        </View>
      </View>

      {hasMarketsPremiumAccess && secondaryOpportunities.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: palette.accentSoft }]}>Opportunités secondaires</Text>
            <Text style={[styles.sectionMeta, { color: palette.secondary }]}>{secondaryOpportunities.length}/2</Text>
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
          <Text style={[styles.sectionTitle, { color: palette.accentSoft }]}>Statistiques publiques</Text>
          <Text style={[styles.sectionMeta, { color: palette.secondary }]}>Méthode Ascension</Text>
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
          <Text style={[styles.sectionTitle, { color: palette.accentSoft }]}>Historique Marchés</Text>
          <Text style={[styles.sectionMeta, { color: palette.secondary }]}>{marketHistory.length} terminé</Text>
        </View>
        <View style={styles.list}>
          {marketHistory.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="bar-chart-outline" size={28} color={palette.accentSoft} />
              <Text style={[styles.emptyTitle, { color: palette.title }]}>Aucun historique marché pour l'instant.</Text>
              <Text style={[styles.emptyText, { color: palette.secondary }]}>Les opportunités terminées apparaîtront ici pour rester consultables en Mode Découverte.</Text>
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
  const palette = useGlassCardPalette();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.assetPill, { backgroundColor: palette.glowSoft, borderColor: palette.border }]}>
          <Ionicons name="pulse-outline" size={13} color={palette.accentSoft} />
          <Text style={[styles.assetPillText, { color: palette.accentSoft }]}>{categoryLabel[opportunity.category]}</Text>
        </View>
        <Text style={[styles.status, { color: palette.accentSoft }]}>{statusLabel[opportunity.status]}</Text>
      </View>

      <View style={styles.assetRow}>
        <View>
          <Text style={[styles.asset, { color: palette.title }, featured && styles.assetFeatured]}>{opportunity.asset}</Text>
          <Text style={[styles.direction, { color: palette.secondary }]}>Action : {directionLabel[opportunity.direction]}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={[styles.scoreLabel, { color: palette.secondary }]}>Score Ascension</Text>
          <Text style={[styles.score, { color: palette.accentSoft }]}>{opportunity.ascensionScore}<Text style={[styles.scoreSuffix, { color: palette.secondary }]}>/100</Text></Text>
        </View>
      </View>

      <View style={styles.grid}>
        <MarketInfo label="Prix actuel" value={opportunity.estimatedCurrentPrice} />
        <MarketInfo label="Zone d'entrée" value={opportunity.entryZone} />
        <MarketInfo label="Objectif" value={opportunity.target} />
        <MarketInfo label="Stop conseillé" value={opportunity.stopLoss} />
      </View>

      <View style={[styles.analysisBox, { backgroundColor: palette.overlay, borderColor: palette.line }]}>
        <Text style={[styles.confidence, { color: palette.accentSoft }]}>Confiance : {formatStars(opportunity.confidenceStars)}</Text>
        <Text style={[styles.analysisTitle, { color: palette.title }]}>Analyse Ascension</Text>
        <Text style={[styles.analysis, { color: palette.secondary }]}>{opportunity.shortAnalysis}</Text>
      </View>
    </GlassCard>
  );
}

function formatStars(stars: number) {
  return `${"★".repeat(Math.max(0, Math.min(stars, 5)))}${"☆".repeat(Math.max(0, 5 - stars))}`;
}

function MarketInfo({ label, value }: { label: string; value: string }) {
  const palette = useGlassCardPalette();

  return (
    <View style={[styles.infoBox, { backgroundColor: palette.overlay, borderColor: palette.line }]}>
      <Text style={[styles.metaLabel, { color: palette.secondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: palette.title }]}>{value}</Text>
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
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: typography.titleTracking,
    lineHeight: 32
  },
  subtitle: {
    color: "#C8C8C8",
    fontSize: 13,
    fontFamily: typography.fontFamily,
    lineHeight: 19,
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
    fontFamily: typography.fontFamily,
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
    fontSize: typography.titleSize,
    fontFamily: typography.fontFamily,
    fontWeight: typography.titleWeight,
    letterSpacing: typography.titleTracking,
    textTransform: "uppercase"
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
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    textAlign: "center"
  },
  emptyText: {
    color: "#C8C8C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
    lineHeight: 18,
    textAlign: "center"
  },
  lockedPanel: {
    minHeight: 240,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md
  },
  card: {
    borderRadius: radii.lg,
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
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  status: {
    color: colors.gold,
    fontSize: 12,
    fontFamily: typography.fontFamily,
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
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  assetFeatured: {
    fontSize: 24
  },
  direction: {
    color: "#C8C8C8",
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "500"
  },
  scoreBox: {
    alignItems: "flex-end"
  },
  scoreLabel: {
    color: "#8A8A8A",
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    textTransform: "uppercase"
  },
  score: {
    color: colors.gold,
    fontSize: 26,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  scoreSuffix: {
    color: "#C8C8C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
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
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    gap: 5
  },
  metaLabel: {
    color: "#8A8A8A",
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    textTransform: "uppercase"
  },
  infoValue: {
    color: colors.white,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    lineHeight: 17,
    fontWeight: "600"
  },
  analysisBox: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    gap: 5
  },
  confidence: {
    color: colors.gold,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  analysisTitle: {
    color: colors.white,
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  analysis: {
    color: "#C8C8C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
    lineHeight: 18,
    fontWeight: "400"
  }
});
