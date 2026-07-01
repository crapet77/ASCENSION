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
import { LinearGradient } from "expo-linear-gradient";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard } from "@/components/GlassCard";
import { colors, radii, spacing } from "@/constants/theme";
import {
  CoinMarketAsset,
  MarketSortKey,
  fetchTopCryptoMarkets,
  formatCompact,
  formatCurrency,
  formatPercent,
  futureModules,
  marketRoadmap
} from "@/features/aiMarket";

const sortOptions: Array<{ key: MarketSortKey; label: string }> = [
  { key: "marketCap", label: "Market Cap" },
  { key: "price", label: "Price" },
  { key: "change24h", label: "24h change" },
  { key: "aiScore", label: "AI Score" }
];

export default function AscensionAIMarketScreen() {
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
          setError(err instanceof Error ? err.message : "Unable to load market data.");
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
        case "aiScore":
          return right.aiScore - left.aiScore;
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
          <Text style={styles.title}>Ascension AI Market</Text>
          <Text style={styles.subtitle}>Top 500 crypto with live prices, transparent metrics, and a temporary AI score.</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="sparkles-outline" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>AI-ready</Text>
        </View>
      </View>

      <GlassCard style={styles.heroCard} contentStyle={styles.heroContent}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroLabel}>Market pulse</Text>
            <Text style={styles.heroTitle}>Realtime crypto intelligence</Text>
          </View>
          <View style={styles.heroMetricPill}>
            <Text style={styles.heroMetricValue}>{assets.length}</Text>
            <Text style={styles.heroMetricLabel}>assets</Text>
          </View>
        </View>
        <Text style={styles.heroText}>
          Search, sort, and inspect the largest cryptocurrencies with a transparent scoring model that relies only on volume, liquidity, capitalization, and momentum.
        </Text>
      </GlassCard>

      <View style={styles.controlsRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or symbol"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
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
              style={[styles.sortChip, active && styles.sortChipActive]}
            >
              <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <GlassCard style={styles.stateCard}>
          <ActivityIndicator color={colors.gold} />
          <Text style={styles.stateTitle}>Loading crypto market data</Text>
          <Text style={styles.stateText}>Fetching the latest CoinGecko snapshot.</Text>
        </GlassCard>
      ) : error ? (
        <GlassCard style={styles.stateCard}>
          <Ionicons name="warning-outline" size={24} color={colors.gold} />
          <Text style={styles.stateTitle}>Market data unavailable</Text>
          <Text style={styles.stateText}>{error}</Text>
        </GlassCard>
      ) : filteredAssets.length === 0 ? (
        <GlassCard style={styles.stateCard}>
          <Ionicons name="options-outline" size={24} color={colors.gold} />
          <Text style={styles.stateTitle}>No assets match your search</Text>
          <Text style={styles.stateText}>Try a different name or symbol to explore the market list.</Text>
        </GlassCard>
      ) : (
        <View style={styles.list}> 
          {filteredAssets.map((asset) => (
            <GlassCard key={asset.id} style={styles.assetCard}>
              <View style={styles.assetHeader}>
                <View style={styles.assetIdentity}>
                  <Image source={{ uri: asset.image }} style={styles.assetLogo} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetSymbol}>{asset.symbol.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeLabel}>AI Score</Text>
                  <Text style={styles.aiBadgeValue}>{asset.aiScore}</Text>
                </View>
              </View>

              <View style={styles.metaGrid}>
                <MetricBox label="Price" value={formatCurrency(asset.currentPrice)} />
                <MetricBox label="24h" value={formatPercent(asset.priceChange24h)} accent={asset.priceChange24h >= 0} />
                <MetricBox label="MCap" value={formatCompact(asset.marketCap)} />
                <MetricBox label="Volume" value={formatCompact(asset.totalVolume)} />
              </View>
            </GlassCard>
          ))}
        </View>
      )}

      <GlassCard style={styles.roadmapCard}>
        <Text style={styles.roadmapTitle}>Future Ascension modules</Text>
        <View style={styles.roadmapList}>
          {futureModules.map((module) => (
            <View key={module.key} style={styles.roadmapItem}>
              <Ionicons name="construct-outline" size={16} color={colors.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.roadmapItemTitle}>{module.title}</Text>
                <Text style={styles.roadmapItemText}>{module.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>
    </AppScreen>
  );
}

function MetricBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, accent !== undefined ? (accent ? styles.metricPositive : styles.metricNegative) : null]}>{value}</Text>
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
    fontWeight: "700"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
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
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 18,
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
    fontWeight: "700"
  },
  heroMetricLabel: {
    color: colors.textMuted,
    fontSize: 10,
    textTransform: "uppercase"
  },
  heroText: {
    color: colors.textMuted,
    fontSize: 12,
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
    fontSize: 14
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
    fontWeight: "700"
  },
  stateText: {
    color: colors.textMuted,
    fontSize: 12,
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
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  assetName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700"
  },
  assetSymbol: {
    color: colors.textMuted,
    fontSize: 12,
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
    textTransform: "uppercase"
  },
  aiBadgeValue: {
    color: colors.white,
    fontSize: 16,
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
    textTransform: "uppercase"
  },
  metricValue: {
    color: colors.white,
    fontSize: 13,
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
    fontWeight: "700"
  },
  roadmapItemText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 18
  }
});
