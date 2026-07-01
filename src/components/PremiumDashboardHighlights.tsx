import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { DailyWelcome } from "@/components/DailyWelcome";
import { GlassCard } from "@/components/GlassCard";
import { PremiumButton } from "@/components/PremiumButton";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { DisciplineProfile } from "@/features/discipline/disciplineProfile";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";
import { XpProfile } from "@/features/xp/xpSystem";

type PremiumDashboardHighlightsProps = {
  greeting: string;
  dashboardDate: string;
  dailyMotivation: string;
  quote: string;
  disciplineProfile: DisciplineProfile;
  xpProfile: XpProfile;
  goalPercent: number;
  goalLabel: string;
  goalValue: string;
  missionLabel: string;
  missionCompleted: boolean;
  advice: string;
  onStartDay: () => void;
  onOpenProfile?: () => void;
};

export function PremiumDashboardHighlights({
  greeting,
  dashboardDate,
  dailyMotivation,
  quote,
  disciplineProfile,
  xpProfile,
  goalPercent,
  goalLabel,
  goalValue,
  missionLabel,
  missionCompleted,
  advice,
  onStartDay,
  onOpenProfile
}: PremiumDashboardHighlightsProps) {
  const { theme } = useAscensionTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, useNativeDriver: true })
      ])
    ).start();
  }, [pulse]);

  const sparkleStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.06] }) }]
  };

  return (
    <View style={styles.stack}>
      <GlassCard style={styles.welcomeCard}>
        <View pointerEvents="none" style={styles.floatGlow} />
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeCopy}>
            <DailyWelcome title={greeting} subtitle={dashboardDate} />
            <Text style={styles.quote}>“{quote}”</Text>
          </View>
          {onOpenProfile ? (
            <Pressable style={styles.sparkleBadge} onPress={onOpenProfile}>
              <Ionicons name="notifications-outline" size={16} color={theme.accentSoft} />
            </Pressable>
          ) : (
            <Animated.View style={[styles.sparkleBadge, sparkleStyle]}>
              <Ionicons name="sparkles-outline" size={18} color={theme.accentSoft} />
            </Animated.View>
          )}
        </View>
        <View style={styles.motivationWrap}>
          <Text style={styles.motivationLabel}>Pensée du jour</Text>
          <Text style={styles.motivationText}>{dailyMotivation}</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.disciplineCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardKicker}>Discipline</Text>
            <Text style={styles.cardTitle}>Série actuelle</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakValue}>{disciplineProfile.currentStreak}</Text>
            <Text style={styles.streakLabel}>jours</Text>
          </View>
        </View>

        <View style={styles.disciplineMetaRow}>
          <View>
            <Text style={styles.metaLabel}>Niveau</Text>
            <Text style={styles.metaValue}>{xpProfile.level}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Progression</Text>
            <Text style={styles.metaValue}>{disciplineProfile.score}%</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[colors.gold, colors.goldSoft, theme.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${Math.min(100, disciplineProfile.score)}%` }]}
          />
        </View>

        <PremiumButton label="Commencer ma journée" icon="sunny-outline" onPress={onStartDay} />
      </GlassCard>

      <GlassCard style={styles.missionCard}>
        <View style={styles.inlineHeader}>
          <View style={styles.inlineIcon}>
            <Ionicons name="flag-outline" size={16} color={theme.accentSoft} />
          </View>
          <Text style={styles.cardKicker}>Mission du jour</Text>
        </View>
        <Text style={styles.missionText}>{missionLabel}</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>{missionCompleted ? "Mission validée" : "À lancer"}</Text>
          <Ionicons name={missionCompleted ? "checkmark-circle" : "arrow-forward-circle-outline"} size={17} color={theme.accentSoft} />
        </View>
      </GlassCard>

      <GlassCard style={styles.goalCard}>
        <View style={styles.inlineHeader}>
          <View style={styles.inlineIcon}>
            <Ionicons name="wallet-outline" size={16} color={theme.accentSoft} />
          </View>
          <Text style={styles.cardKicker}>Objectif financier</Text>
        </View>
        <Text style={styles.goalText}>{goalLabel}</Text>
        <View style={styles.goalLine}>
          <Text style={styles.goalValue}>{goalValue}</Text>
          <Text style={styles.goalPercent}>{Math.round(goalPercent)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[colors.gold, colors.goldSoft, theme.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${Math.max(4, Math.min(100, goalPercent))}%` }]}
          />
        </View>
      </GlassCard>

      <GlassCard style={styles.aiCard}>
        <View style={styles.inlineHeader}>
          <View style={styles.inlineIcon}>
            <Ionicons name="hardware-chip-outline" size={16} color={theme.accentSoft} />
          </View>
          <Text style={styles.cardKicker}>Conseil IA Ascension</Text>
        </View>
        <Text style={styles.aiText}>{advice}</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
    marginBottom: 8
  },
  welcomeCard: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    overflow: "hidden"
  },
  floatGlow: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(240, 184, 78, 0.16)"
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  welcomeCopy: {
    flex: 1,
    gap: 4
  },
  quote: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: typography.fontFamily,
    marginTop: 4
  },
  sparkleBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)"
  },
  motivationWrap: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)"
  },
  motivationLabel: {
    color: colors.goldSoft,
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: "700",
    textTransform: "uppercase",
    fontFamily: typography.fontFamily,
    marginBottom: 4
  },
  motivationText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: typography.fontFamily
  },
  disciplineCard: {
    padding: spacing.lg,
    gap: spacing.md
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardKicker: {
    color: colors.goldSoft,
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: "700",
    textTransform: "uppercase",
    fontFamily: typography.fontFamily
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: typography.fontFamily,
    marginTop: 2
  },
  streakBadge: {
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  streakValue: {
    color: colors.goldSoft,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: typography.fontFamily
  },
  streakLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: typography.fontFamily
  },
  disciplineMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: typography.fontFamily
  },
  metaValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: typography.fontFamily,
    marginTop: 2
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden"
  },
  progressFill: {
    height: 8,
    borderRadius: 999
  },
  missionCard: {
    padding: spacing.lg,
    gap: spacing.sm
  },
  inlineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  inlineIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  missionText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: typography.fontFamily,
    marginTop: 2
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2
  },
  statusText: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: typography.fontFamily
  },
  goalCard: {
    padding: spacing.lg,
    gap: spacing.sm
  },
  goalText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: typography.fontFamily
  },
  goalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  goalValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: typography.fontFamily
  },
  goalPercent: {
    color: colors.goldSoft,
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  aiCard: {
    padding: spacing.lg,
    gap: spacing.sm
  },
  aiText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: typography.fontFamily
  }
});
