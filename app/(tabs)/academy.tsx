import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard, useGlassCardPalette } from "@/components/GlassCard";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { AcademyEngine, AcademyEngineState, AcademyModule } from "@/engine/academy";
import { resetAcademyProfile } from "@/engine/academy/storage";
import { UserAccessService, UserAccessState, UserLevel } from "@/features/access/userAccess";
import { getAcademyCoachAdvice } from "@/features/intelligence/coach";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

const featureLabels = {
  sport: "Sport",
  markets: "Marchés",
  ai: "IA"
} as const;

export default function AcademyScreen() {
  const router = useRouter();
  const { theme } = useAscensionTheme();
  const [academyState, setAcademyState] = useState<AcademyEngineState | null>(null);
  const [accessState, setAccessState] = useState<UserAccessState | null>(null);

  const refreshAcademy = useCallback(async () => {
    const nextAcademyState = await AcademyEngine.getState();
    setAcademyState(nextAcademyState);
    setAccessState(await UserAccessService.getState(nextAcademyState));
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshAcademy();
    }, [refreshAcademy])
  );

  async function handleResetAcademy() {
    Alert.alert("Réinitialiser Academy", "Remettre la seed Academy complète et effacer l’état courant ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Réinitialiser",
        style: "destructive",
        onPress: async () => {
          await resetAcademyProfile();
          await refreshAcademy();
        }
      }
    ]);
  }

  function openLesson(moduleId: string, lessonId: string) {
    router.push(`/academy/lesson/${lessonId}?moduleId=${moduleId}`);
  }

  async function completeLevelTest(level: UserLevel) {
    const nextAccessState = await UserAccessService.completeLevelTest(level, academyState ?? undefined);
    setAccessState(nextAccessState);
  }

  const progressPercent = academyState?.progressPercent ?? 0;
  const coachAdvice = getAcademyCoachAdvice(academyState);

  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={styles.headerLine}>
          <Text style={[styles.heading, { color: theme.text, textShadowColor: theme.glow }]}>Academy</Text>
          <View style={[styles.badge, { borderColor: theme.accentBorder, backgroundColor: theme.overlay }]}>
            <Ionicons name="trophy" size={13} color={theme.accentSoft} />
            <Text style={[styles.badgeText, { color: theme.accentSoft }]}>FORMATION</Text>
          </View>
        </View>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Les bases d'abord. Les fonctionnalités avancées ensuite.</Text>
        <Pressable onPress={handleResetAcademy} style={[styles.resetButton, { borderColor: theme.line, backgroundColor: theme.overlay }]}>
          <Text style={[styles.resetText, { color: theme.accentSoft }]}>Réinitialiser Academy</Text>
        </Pressable>
      </View>

      <GlassCard style={styles.progressCard}>
        <View style={styles.modeTop}>
          <View style={[styles.modeBadge, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
            <Ionicons name={accessState?.fullAccess ? "shield-checkmark-outline" : "compass-outline"} size={13} color={theme.accentSoft} />
            <Text style={[styles.modeBadgeText, { color: theme.accentSoft }]}>{accessState?.fullAccess ? "Mode Fondateur" : "Mode Découverte"}</Text>
          </View>
          <Text style={[styles.modeMeta, { color: theme.textMuted }]}>{accessState?.fullAccess ? "Accès complet" : "Sans compte"}</Text>
        </View>
        <Text style={[styles.progressHint, { color: theme.textMuted }]}>
          {accessState?.fullAccess
            ? "Tous les modules sont accessibles pour tester Ascension sans restriction."
            : accessState?.discoveryMessage ??
              "Tu peux explorer librement. Crée un compte seulement si tu veux sauvegarder ta progression."}
        </Text>
      </GlassCard>

      <GlassCard style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View>
            <Text style={[styles.progressTitle, { color: theme.accentSoft }]}>Parcours essentiel</Text>
            <Text style={[styles.progressText, { color: theme.accentSoft }]}>{progressPercent}% validé</Text>
          </View>
          <View style={styles.levelBox}>
            <Text style={[styles.levelLabel, { color: theme.textMuted }]}>Niveau</Text>
            <Text style={[styles.levelValue, { color: theme.text }]}>{academyState?.profile.level ?? "Bronze"}</Text>
          </View>
        </View>
        <View style={[styles.track, { backgroundColor: theme.line }]}>
          <View style={[styles.fill, { width: `${progressPercent}%`, backgroundColor: theme.accent }]} />
        </View>
        <Text style={[styles.progressHint, { color: theme.textMuted }]}>
          XP Academy : {academyState?.profile.xp ?? 0} · Modules validés : {academyState?.completedModules.length ?? 0}
        </Text>
      </GlassCard>

      <GlassCard style={styles.coachCard}>
        <View style={styles.coachHeader}>
          <View style={[styles.coachIcon, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
            <Ionicons name="sparkles-outline" size={16} color={theme.accentSoft} />
          </View>
          <View style={styles.coachCopy}>
            <Text style={[styles.progressTitle, { color: theme.accentSoft }]}>{coachAdvice.title}</Text>
            <Text style={[styles.coachProgress, { color: theme.textMuted }]}>{coachAdvice.progressLabel}</Text>
          </View>
        </View>
        <Text style={[styles.progressHint, { color: theme.textMuted }]}>{coachAdvice.text}</Text>
        <View style={[styles.coachNextBox, { borderColor: theme.line, backgroundColor: theme.overlay }]}>
          <Text style={[styles.coachNextLabel, { color: theme.accentSoft }]}>PROCHAINE LEÇON</Text>
          <Text style={[styles.coachNextText, { color: theme.text }]}>{coachAdvice.nextLesson}</Text>
        </View>
        <Text style={[styles.coachReminder, { color: theme.textMuted }]}>{coachAdvice.reminder}</Text>
      </GlassCard>

      <View style={styles.unlockRow}>
        {accessState
          ? Object.entries(accessState.unlockedModules)
              .filter(([feature]) => feature !== "advancedStats" && feature !== "crypto")
              .map(([feature, unlocked]) => (
              <View
                key={feature}
                style={[
                  styles.unlockPill,
                  { borderColor: unlocked ? theme.success : theme.accentBorder, backgroundColor: unlocked ? `${theme.success}14` : theme.glowSoft }
                ]}
              >
                <Ionicons
                  name={unlocked ? "checkmark-circle" : "lock-closed-outline"}
                  size={13}
                  color={unlocked ? theme.success : theme.accentSoft}
                />
                <Text style={[styles.unlockText, { color: unlocked ? theme.success : theme.accentSoft }]}>
                  {featureLabels[feature as keyof typeof featureLabels]}
                </Text>
              </View>
            ))
          : null}
      </View>

      <GlassCard style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View>
            <Text style={[styles.progressTitle, { color: theme.accentSoft }]}>Questionnaire de niveau</Text>
            <Text style={[styles.progressHint, { color: theme.textMuted }]}>
              Il ne bloque pas l'entrée dans l'application. Il adapte simplement ton parcours et prépare les modules avancés.
            </Text>
          </View>
          <View style={[styles.statusBadge, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
            <Text style={[styles.statusText, { color: theme.accentSoft }]}>
              {accessState?.userLevelTest.status === "completed" ? "Validé" : "Optionnel"}
            </Text>
          </View>
        </View>
        <View style={styles.levelChoices}>
          {(["beginner", "intermediate", "advanced"] as const).map((level) => {
            const selected = accessState?.userLevelTest.level === level;

            return (
              <Pressable
                key={level}
                onPress={() => completeLevelTest(level)}
                style={[
                  styles.levelChoice,
                  { borderColor: selected ? theme.accentBorder : theme.line, backgroundColor: selected ? theme.glowSoft : theme.overlay }
                ]}
              >
                <Text style={[styles.levelChoiceText, { color: selected ? theme.accentSoft : theme.textMuted }]}>
                  {getLevelTestLabel(level)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassCard>

      <View style={styles.list}>
        {academyState?.modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            founderAccess={Boolean(accessState?.fullAccess)}
            onOpenLesson={openLesson}
          />
        ))}
      </View>
    </AppScreen>
  );
}

function ModuleCard({
  module,
  founderAccess,
  onOpenLesson
}: {
  module: AcademyModule;
  founderAccess: boolean;
  onOpenLesson: (moduleId: string, lessonId: string) => void;
}) {
  const palette = useGlassCardPalette();
  const isLocked = module.status === "locked" && !founderAccess;
  const isCompleted = module.status === "completed";

  return (
    <GlassCard style={[styles.moduleCard, isLocked && styles.lockedCard]}>
      <View style={styles.moduleTop}>
        <View style={[styles.moduleIcon, { backgroundColor: palette.overlay, borderColor: palette.line }]}>
          <Ionicons name={getModuleIcon(module.category)} size={22} color={isLocked ? palette.secondary : palette.accentSoft} />
        </View>
        <View style={styles.moduleCopy}>
          <Text style={[styles.moduleTitle, { color: palette.title }]}>{module.title}</Text>
          <Text style={[styles.moduleDescription, { color: palette.secondary }]}>{module.description}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: palette.glowSoft, borderColor: palette.border },
            isCompleted && { backgroundColor: "rgba(110, 231, 183, 0.08)", borderColor: "rgba(110, 231, 183, 0.46)" }
          ]}
        >
          <Text style={[styles.statusText, { color: isCompleted ? palette.success : palette.accentSoft }]}>
            {founderAccess && module.status === "locked" ? "Fondateur" : getModuleStatusLabel(module.status)}
          </Text>
        </View>
      </View>

      <View style={styles.lessonList}>
        {module.lessons.map((lesson) => {
          const lessonLocked = !founderAccess && (lesson.status === "locked" || isLocked);
          const lessonCompleted = lesson.status === "completed";

          return (
            <Pressable key={lesson.id} onPress={() => !lessonLocked && onOpenLesson(module.id, lesson.id)} style={styles.lessonRow}>
              <Ionicons
                name={lessonCompleted ? "checkmark-circle" : lessonLocked ? "lock-closed-outline" : "ellipse-outline"}
                size={17}
                color={lessonCompleted ? palette.success : lessonLocked ? palette.secondary : palette.accentSoft}
              />
              <View style={styles.lessonCopy}>
                <Text style={[styles.lessonTitle, { color: palette.title }]}>{lesson.title}</Text>
                <Text style={[styles.lessonDescription, { color: palette.secondary }]}>{lesson.description}</Text>
              </View>
              {!lessonLocked && !lessonCompleted ? (
                <View style={[styles.smallAction, { backgroundColor: palette.glowSoft, borderColor: palette.border }]}>
                  <Text style={[styles.smallActionText, { color: palette.accentSoft }]}>Ouvrir</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.quizBox, { backgroundColor: palette.overlay, borderColor: palette.line }]}>
        <View>
          <Text style={[styles.quizTitle, { color: palette.title }]}>{module.quiz.title}</Text>
          <Text style={[styles.quizMeta, { color: palette.secondary }]}>
            {module.quiz.status === "passed"
              ? `Validé · ${module.quiz.score ?? 100}%`
              : founderAccess
                  ? "Accessible en Mode Fondateur"
                  : "Termine les leçons pour ouvrir le quiz"}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

function getModuleIcon(category: AcademyModule["category"]) {
  if (category === "finance") {
    return "wallet-outline";
  }

  if (category === "sport") {
    return "football-outline";
  }

  if (category === "markets") {
    return "trending-up-outline";
  }

  if (category === "ai") {
    return "sparkles-outline";
  }

  return "checkmark-done-outline";
}

function getModuleStatusLabel(status: AcademyModule["status"]) {
  if (status === "completed") {
    return "Validé";
  }

  if (status === "available") {
    return "Actif";
  }

  return "Verrouillé";
}

function getLevelTestLabel(level: UserLevel) {
  if (level === "advanced") {
    return "Avancé";
  }

  if (level === "intermediate") {
    return "Intermédiaire";
  }

  return "Débutant";
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs
  },
  headerLine: {
    minHeight: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  heading: {
    color: colors.white,
    fontSize: 22,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.4
  },
  badge: {
    minHeight: 26,
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
    fontSize: 10,
    fontWeight: "700"
  },
  subtitle: {
    color: "#C8C8C8",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400"
  },
  resetButton: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  resetText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700"
  },
  progressCard: {
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm
  },
  coachCard: {
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm
  },
  coachHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  coachIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  coachCopy: {
    flex: 1,
    gap: 2
  },
  coachProgress: {
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.7,
    textTransform: "uppercase"
  },
  coachNextBox: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.sm,
    gap: 4
  },
  coachNextLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.eyebrowTracking,
    textTransform: "uppercase"
  },
  coachNextText: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    lineHeight: 19
  },
  coachReminder: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 18
  },
  modeTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  modeBadge: {
    minHeight: 28,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "rgba(228, 169, 69, 0.06)"
  },
  modeBadgeText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700"
  },
  modeMeta: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "600"
  },
  progressTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  progressTitle: {
    color: colors.white,
    fontSize: typography.titleSize,
    fontFamily: typography.fontFamily,
    fontWeight: typography.titleWeight,
    letterSpacing: typography.titleTracking,
    textTransform: "uppercase"
  },
  progressText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "700"
  },
  levelBox: {
    alignItems: "flex-end"
  },
  levelLabel: {
    color: "#8A8A8A",
    fontSize: 10,
    textTransform: "uppercase"
  },
  levelValue: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700"
  },
  track: {
    height: 7,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.gold
  },
  progressHint: {
    color: "#C8C8C8",
    fontSize: 12,
    lineHeight: 17
  },
  unlockRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  unlockPill: {
    minHeight: 30,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "rgba(228, 169, 69, 0.06)"
  },
  unlockPillActive: {
    borderColor: "rgba(84, 221, 132, 0.50)",
    backgroundColor: "rgba(84, 221, 132, 0.08)"
  },
  unlockText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700"
  },
  unlockTextActive: {
    color: colors.success
  },
  levelChoices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  levelChoice: {
    minHeight: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050505"
  },
  levelChoiceActive: {
    borderColor: "rgba(84, 221, 132, 0.50)",
    backgroundColor: "rgba(84, 221, 132, 0.08)"
  },
  levelChoiceText: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "700"
  },
  levelChoiceTextActive: {
    color: colors.success
  },
  list: {
    gap: spacing.md
  },
  moduleCard: {
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.md
  },
  lockedCard: {
    opacity: 0.66
  },
  moduleTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  moduleIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050505"
  },
  moduleCopy: {
    flex: 1,
    gap: 4
  },
  moduleTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700"
  },
  moduleDescription: {
    color: "#C8C8C8",
    fontSize: 12,
    lineHeight: 17
  },
  statusBadge: {
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    backgroundColor: "rgba(228, 169, 69, 0.06)"
  },
  statusBadgeDone: {
    borderColor: "rgba(84, 221, 132, 0.50)",
    backgroundColor: "rgba(84, 221, 132, 0.08)"
  },
  statusText: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: "700"
  },
  statusTextDone: {
    color: colors.success
  },
  lessonList: {
    gap: spacing.sm
  },
  lessonRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  lessonCopy: {
    flex: 1,
    gap: 2
  },
  lessonTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700"
  },
  lessonDescription: {
    color: "#C8C8C8",
    fontSize: 11,
    lineHeight: 16
  },
  smallAction: {
    minHeight: 28,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(228, 169, 69, 0.08)"
  },
  smallActionText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700"
  },
  quizBox: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.sm,
    backgroundColor: "#050505",
    padding: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  quizTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700"
  },
  quizMeta: {
    color: "#C8C8C8",
    fontSize: 11,
    lineHeight: 16
  }
});
