import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard } from "@/components/GlassCard";
import { Header } from "@/components/Header";
import { PremiumButton } from "@/components/PremiumButton";
import { Section } from "@/components/Section";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { loadMasterclassState, startMasterclass } from "@/features/masterclass/storage";
import { MasterclassItem, MasterclassProgressEntry, MasterclassState } from "@/features/masterclass/types";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

export default function MasterclassScreen() {
  const { theme } = useAscensionTheme();
  const [state, setState] = useState<MasterclassState | null>(null);

  const cryptoMasterclasses = useMemo(
    () => state?.masterclasses.filter((masterclass) => masterclass.categoryId === "crypto") ?? [],
    [state?.masterclasses]
  );

  useFocusEffect(
    useCallback(() => {
      loadMasterclassState().then(setState);
    }, [])
  );

  async function handleStart(masterclassId: string) {
    setState(await startMasterclass(masterclassId));
  }

  return (
    <AppScreen>
      <Header
        eyebrow="Ascension Masterclass"
        title="Masterclass"
        subtitle="Approfondis un sujet précis sans modifier ton parcours Academy."
      />

      <GlassCard style={styles.hero}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={[styles.kicker, { color: theme.accentSoft }]}>PROGRESSION MASTERCLASS</Text>
            <Text style={[styles.heroTitle, { color: theme.text }]}>
              {state?.stats.progressPercent ?? 0}% global
            </Text>
          </View>
          <View style={[styles.orb, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
            <Ionicons name="sparkles-outline" size={24} color={theme.accentSoft} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatPill label="Commencées" value={`${state?.stats.startedCount ?? 0}`} />
          <StatPill label="Terminées" value={`${state?.stats.completedCount ?? 0}`} />
          <StatPill label="Disponibles" value={`${state?.stats.totalCount ?? 0}`} />
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.overlay }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${state?.stats.progressPercent ?? 0}%`,
                backgroundColor: theme.accentSoft
              }
            ]}
          />
        </View>
      </GlassCard>

      <Section title="Catégories">
        <View style={styles.categoryGrid}>
          {state?.categories.map((category) => (
            <GlassCard key={category.id} style={styles.categoryCard} elevated={false}>
              <View style={[styles.categoryIcon, { borderColor: theme.accentBorder, backgroundColor: theme.overlay }]}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
              <Text style={[styles.categoryTitle, { color: theme.text }]}>{category.title}</Text>
              <Text style={[styles.categoryText, { color: theme.textMuted }]}>{category.description}</Text>
            </GlassCard>
          ))}
        </View>
      </Section>

      <Section title="Crypto">
        <View style={styles.masterclassList}>
          {cryptoMasterclasses.map((masterclass) => (
            <MasterclassCard
              key={masterclass.id}
              masterclass={masterclass}
              progress={state?.progress.find((entry) => entry.masterclassId === masterclass.id) ?? null}
              onStart={() => handleStart(masterclass.id)}
            />
          ))}
        </View>
      </Section>
    </AppScreen>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  const { theme } = useAscensionTheme();

  return (
    <View style={[styles.statPill, { borderColor: theme.line, backgroundColor: theme.overlay }]}>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

function MasterclassCard({
  masterclass,
  progress,
  onStart
}: {
  masterclass: MasterclassItem;
  progress: MasterclassProgressEntry | null;
  onStart: () => void;
}) {
  const { theme } = useAscensionTheme();
  const isAvailable = masterclass.availability === "available";
  const progressLabel = progress?.status === "completed" ? "Terminée" : progress?.status === "in_progress" ? "En cours" : null;

  return (
    <GlassCard style={styles.masterclassCard}>
      <View style={styles.masterclassTop}>
        <View style={[styles.masterclassIcon, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
          <Text style={[styles.masterclassSymbol, { color: theme.accentSoft }]}>{masterclass.icon}</Text>
        </View>
        <View style={styles.masterclassCopy}>
          <Text style={[styles.masterclassTitle, { color: theme.text }]}>{masterclass.title}</Text>
          <View style={styles.metaRow}>
            <Tag label={masterclass.difficulty} />
            <Tag label={masterclass.estimatedDuration} />
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              borderColor: isAvailable ? theme.accentBorder : theme.line,
              backgroundColor: isAvailable ? theme.glowSoft : theme.overlay
            }
          ]}
        >
          <Text style={[styles.statusText, { color: isAvailable ? theme.accentSoft : theme.textMuted }]}>
            {progressLabel ?? (isAvailable ? "Disponible" : "Bientôt")}
          </Text>
        </View>
      </View>

      <View style={styles.structureRow}>
        <StructureItem icon="albums-outline" label="Chapitres" />
        <StructureItem icon="help-circle-outline" label="Quiz" />
        <StructureItem icon="briefcase-outline" label="Cas pratiques" />
        <StructureItem icon="ribbon-outline" label="Badge" />
      </View>

      {isAvailable ? (
        <PremiumButton
          label={progress?.status === "in_progress" ? "Reprendre" : "Commencer"}
          icon="arrow-forward"
          onPress={onStart}
          style={styles.startButton}
        />
      ) : (
        <Pressable disabled style={[styles.disabledButton, { borderColor: theme.line, backgroundColor: theme.overlay }]}>
          <Text style={[styles.disabledText, { color: theme.textMuted }]}>Préparation</Text>
        </Pressable>
      )}
    </GlassCard>
  );
}

function Tag({ label }: { label: string }) {
  const { theme } = useAscensionTheme();

  return (
    <View style={[styles.tag, { borderColor: theme.line, backgroundColor: theme.overlay }]}>
      <Text style={[styles.tagText, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

function StructureItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { theme } = useAscensionTheme();

  return (
    <View style={styles.structureItem}>
      <Ionicons name={icon} size={13} color={theme.accentSoft} />
      <Text style={[styles.structureText, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: spacing.lg,
    gap: spacing.md
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    alignItems: "center"
  },
  kicker: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: typography.eyebrowTracking,
    textTransform: "uppercase"
  },
  heroTitle: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily,
    fontSize: 28,
    fontWeight: "500",
    letterSpacing: 0.4
  },
  orb: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  statPill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.sm,
    gap: 2
  },
  statValue: {
    fontFamily: typography.fontFamily,
    fontSize: 18,
    fontWeight: "600"
  },
  statLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    letterSpacing: 0.35
  },
  progressTrack: {
    height: 7,
    borderRadius: radii.pill,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.pill
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  categoryCard: {
    width: "48%",
    minHeight: 132,
    padding: spacing.md,
    gap: spacing.sm
  },
  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  categoryEmoji: {
    fontSize: 18
  },
  categoryTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: "600"
  },
  categoryText: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    lineHeight: 17
  },
  masterclassList: {
    gap: spacing.sm
  },
  masterclassCard: {
    padding: spacing.md,
    gap: spacing.md
  },
  masterclassTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  masterclassIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  masterclassSymbol: {
    fontFamily: typography.fontFamily,
    fontSize: 19,
    fontWeight: "600"
  },
  masterclassCopy: {
    flex: 1,
    gap: spacing.xs
  },
  masterclassTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.15
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.xs,
    flexWrap: "wrap"
  },
  tag: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  tagText: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    fontWeight: "500"
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  statusText: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.55,
    textTransform: "uppercase"
  },
  structureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  structureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  structureText: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    letterSpacing: 0.25
  },
  startButton: {
    alignSelf: "flex-start"
  },
  disabledButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 36,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center"
  },
  disabledText: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  }
});
