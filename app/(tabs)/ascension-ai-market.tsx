import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard, useGlassCardPalette } from "@/components/GlassCard";
import { colors, radii, spacing, typography } from "@/constants/theme";
import {
  CoinMarketAsset,
  MarketSortKey,
  fetchTopCryptoMarkets,
  formatCompact,
  formatCurrency,
  formatPercent,
  futureModules
} from "@/features/aiMarket";

const sortOptions: Array<{ key: MarketSortKey; label: string }> = [
  { key: "marketCap", label: "Capitalisation" },
  { key: "price", label: "Prix" },
  { key: "change24h", label: "Variation 24 h" },
  { key: "volume", label: "Volume" }
];

export default function AscensionAIMarketScreen() {
  const palette = useGlassCardPalette();
  const [assets, setAssets] = useState<CoinMarketAsset[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<MarketSortKey>("marketCap");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAssets() {
      setLoading(true);
      setError(null);

      try {
        const fetchedAssets = await fetchTopCryptoMarkets(500);
        if (!cancelled) {
          setAssets(fetchedAssets);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Impossible de charger les données de marché.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAssets = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    const filtered = assets.filter((asset) => {
      if (!normalizedQuery) {
        return true;
      }

      return [asset.name, asset.symbol, asset.id].some((value) => value.toLowerCase().includes(normalizedQuery));
    });

    return filtered.sort((left, right) => {
      switch (sortKey) {
        case "price":
          return right.currentPrice - left.currentPrice;
        case "change24h":
          return right.priceChange24h - left.priceChange24h;
        case "volume":
          return right.totalVolume - left.totalVolume;
        case "marketCap":
        default:
          return right.marketCap - left.marketCap;
      }
    });
  }, [assets, search, sortKey]);

  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: palette.title }]}>Ascension IA Marché</Text>
          <Text style={[styles.subtitle, { color: palette.secondary }]}>Les 500 principales cryptos avec prix en direct, volume, capitalisation et variation 24 h.</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: palette.overlay, borderColor: palette.border }]}>
          <Ionicons name="pulse-outline" size={14} color={palette.accentSoft} />
          <Text style={[styles.badgeText, { color: palette.accentSoft }]}>Données réelles</Text>
        </View>
      </View>

      <GlassCard style={styles.heroCard} contentStyle={styles.heroContent}>
        <View style={styles.heroTopRow}>
          <View>
          <Text style={[styles.heroLabel, { color: palette.accentSoft }]}>Pouls du marché</Text>
            <Text style={[styles.heroTitle, { color: palette.title }]}>Données crypto en temps réel</Text>
          </View>
          <View style={[styles.heroMetricPill, { backgroundColor: palette.overlay, borderColor: palette.border }]}>
            <Text style={[styles.heroMetricValue, { color: palette.title }]}>{assets.length}</Text>
            <Text style={[styles.heroMetricLabel, { color: palette.secondary }]}>actifs</Text>
          </View>
        </View>
        <Text style={[styles.heroText, { color: palette.secondary }]}>
          Recherche, trie et consulte les plus grandes cryptomonnaies avec les données réelles de CoinGecko. Aucun score local n'est présenté comme un signal d'investissement.
        </Text>
      </GlassCard>

      <View style={styles.controlsRow}>
        <View style={[styles.searchBox, { backgroundColor: palette.overlay, borderColor: palette.line }]}>
          <Ionicons name="search-outline" size={16} color={palette.secondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher par nom ou symbole"
            placeholderTextColor={palette.secondary}
            style={[styles.searchInput, { color: palette.title }]}
          />
        </View>
      </View>

      <View style={styles.sortRow}>
        {sortOptions.map((option) => {
          const active = option.key === sortKey;
          return (
            <Pressable
              key={option.key}
              onPress={() => setSortKey(option.key)}
              style={[
                styles.sortChip,
                { backgroundColor: palette.overlay, borderColor: palette.line },
                active && { backgroundColor: palette.glowSoft, borderColor: palette.border }
              ]}
            >
              <Text style={[styles.sortChipText, { color: active ? palette.accentSoft : palette.secondary }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <GlassCard style={styles.stateCard}>
          <ActivityIndicator color={palette.accentSoft} />
          <Text style={[styles.stateTitle, { color: palette.title }]}>Chargement des données crypto</Text>
          <Text style={[styles.stateText, { color: palette.secondary }]}>Récupération du dernier aperçu CoinGecko.</Text>
        </GlassCard>
      ) : error ? (
        <GlassCard style={styles.stateCard}>
          <Ionicons name="warning-outline" size={24} color={palette.accentSoft} />
          <Text style={[styles.stateTitle, { color: palette.title }]}>Données de marché indisponibles</Text>
          <Text style={[styles.stateText, { color: palette.secondary }]}>{error}</Text>
        </GlassCard>
      ) : filteredAssets.length === 0 ? (
        <GlassCard style={styles.stateCard}>
          <Ionicons name="options-outline" size={24} color={palette.accentSoft} />
          <Text style={[styles.stateTitle, { color: palette.title }]}>Aucun actif ne correspond à ta recherche</Text>
          <Text style={[styles.stateText, { color: palette.secondary }]}>Essaie un autre nom ou symbole pour explorer la liste.</Text>
        </GlassCard>
      ) : (
        <View style={styles.list}> 
          {filteredAssets.map((asset) => (
            <GlassCard key={asset.id} style={styles.assetCard}>
              <View style={styles.assetHeader}>
                <View style={styles.assetIdentity}>
                  <Image source={{ uri: asset.image }} style={styles.assetLogo} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.assetName, { color: palette.title }]}>{asset.name}</Text>
                    <Text style={[styles.assetSymbol, { color: palette.secondary }]}>{asset.symbol.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={[styles.aiBadge, { backgroundColor: palette.glowSoft, borderColor: palette.border }]}>
                  <Text style={[styles.aiBadgeLabel, { color: palette.accentSoft }]}>Rang</Text>
                  <Text style={[styles.aiBadgeValue, { color: palette.title }]}>{asset.marketCapRank || "-"}</Text>
                </View>
              </View>

              <View style={styles.metaGrid}>
                <MetricBox label="Prix" value={formatCurrency(asset.currentPrice)} />
                <MetricBox label="24h" value={formatPercent(asset.priceChange24h)} accent={asset.priceChange24h >= 0} />
                <MetricBox label="Capitalisation" value={formatCompact(asset.marketCap)} />
                <MetricBox label="Volume" value={formatCompact(asset.totalVolume)} />
              </View>
            </GlassCard>
          ))}
        </View>
      )}

      <GlassCard style={styles.roadmapCard}>
        <Text style={[styles.roadmapTitle, { color: palette.title }]}>Futurs modules Ascension</Text>
        <View style={styles.roadmapList}>
          {futureModules.map((module) => (
            <View key={module.key} style={styles.roadmapItem}>
              <Ionicons name="construct-outline" size={16} color={palette.accentSoft} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.roadmapItemTitle, { color: palette.title }]}>{module.title}</Text>
                <Text style={[styles.roadmapItemText, { color: palette.secondary }]}>{module.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>
    </AppScreen>
  );
}

function MetricBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const palette = useGlassCardPalette();

  return (
    <View style={[styles.metricBox, { backgroundColor: palette.overlay, borderColor: palette.line }]}>
      <Text style={[styles.metricLabel, { color: palette.secondary }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: accent === undefined ? palette.title : accent ? palette.success : palette.danger }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: typography.titleTracking,
    lineHeight: 31
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: typography.fontFamily,
    marginTop: 4,
    lineHeight: 18
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(4,4,4,0.8)"
  },
  badgeText: {
    color: colors.gold,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  heroCard: {
    marginTop: spacing.md,
    padding: spacing.lg
  },
  heroContent: {
    gap: spacing.sm
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  heroLabel: {
    color: colors.gold,
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 18,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    marginTop: 2
  },
  heroMetricPill: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  heroMetricValue: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  heroMetricLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: typography.fontFamily,
    textTransform: "uppercase"
  },
  heroText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    lineHeight: 18
  },
  controlsRow: {
    marginTop: spacing.md
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    fontFamily: typography.fontFamily
  },
  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  sortChip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6
  },
  sortChipActive: {
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(240,184,78,0.12)"
  },
  sortChipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    fontWeight: "600"
  },
  sortChipTextActive: {
    color: colors.gold
  },
  stateCard: {
    marginTop: spacing.md,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm
  },
  stateTitle: {
    color: colors.white,
    fontSize: 15,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  stateText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    textAlign: "center",
    lineHeight: 18
  },
  list: {
    marginTop: spacing.md,
    gap: spacing.md
  },
  assetCard: {
    padding: spacing.md
  },
  assetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm
  },
  assetIdentity: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.sm
  },
  assetLogo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceElevated
  },
  assetName: {
    color: colors.white,
    fontSize: 15,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  assetSymbol: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    marginTop: 2,
    textTransform: "uppercase"
  },
  aiBadge: {
    borderRadius: radii.md,
    backgroundColor: "rgba(240,184,78,0.14)",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: "center"
  },
  aiBadgeLabel: {
    color: colors.gold,
    fontSize: 10,
    fontFamily: typography.fontFamily,
    textTransform: "uppercase"
  },
  aiBadgeValue: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
    gap: spacing.sm
  },
  metricBox: {
    flexBasis: "48%",
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: spacing.sm
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: typography.fontFamily,
    textTransform: "uppercase"
  },
  metricValue: {
    color: colors.white,
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    marginTop: 4
  },
  metricPositive: {
    color: colors.success
  },
  metricNegative: {
    color: colors.danger
  },
  roadmapCard: {
    marginTop: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.xl
  },
  roadmapTitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  roadmapList: {
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  roadmapItem: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start"
  },
  roadmapItemTitle: {
    color: colors.white,
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  roadmapItemText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    marginTop: 2,
    lineHeight: 18
  }
});
