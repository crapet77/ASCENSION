import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { AscensionLogo } from "@/components/AscensionLogo";
import { GlassCard, useGlassCardPalette } from "@/components/GlassCard";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { brand } from "@/constants/brand";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { AcademyEngine, AcademyEngineState } from "@/engine/academy";
import { ObjectiveEngine, ObjectiveEngineState } from "@/engine/objectives";
import { UserAccessService, UserAccessState } from "@/features/access/userAccess";
import { resetAscensionData } from "@/features/appReset/reset";
import { calculateAscensionIQ } from "@/features/ascensionIQ/ascensionIQ";
import { loadBankrollState } from "@/features/bankroll/storage";
import { BankrollState } from "@/features/bankroll/types";
import { loadDisciplineProfile, DisciplineProfile } from "@/features/discipline/disciplineProfile";
import { defaultFinancialProfile, FinancialProfile, loadFinancialProfile } from "@/features/financialProfile";
import {
  loadOnboardingPreferences,
  OnboardingGoal,
  OnboardingPreferences,
  OnboardingUniverse,
  saveOnboardingPreferences
} from "@/features/onboarding/onboardingStorage";
import { loadTickets } from "@/features/tickets/storage";
import { AscensionTicket } from "@/features/tickets/types";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";
import { loadXpProfile, XpProfile } from "@/features/xp/xpSystem";

const universeLabels: Record<OnboardingUniverse, string> = {
  carbon: "Carbone",
  nature: "Nature",
  ocean: "Océan",
  blossom: "Blossom",
  cosmos: "Cosmos"
};

const goalLabels: Record<OnboardingGoal, string> = {
  learn: "Comprendre l'argent",
  wealth: "Construire mon patrimoine",
  invest: "Investir intelligemment",
  opportunities: "Opportunités Ascension"
};

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, setUniverse } = useAscensionTheme();
  const [accessState, setAccessState] = useState<UserAccessState | null>(null);
  const [academyState, setAcademyState] = useState<AcademyEngineState | null>(null);
  const [preferences, setPreferences] = useState<OnboardingPreferences | null>(null);
  const [xpProfile, setXpProfile] = useState<XpProfile | null>(null);
  const [disciplineProfile, setDisciplineProfile] = useState<DisciplineProfile | null>(null);
  const [bankroll, setBankroll] = useState<BankrollState | null>(null);
  const [tickets, setTickets] = useState<AscensionTicket[]>([]);
  const [objectiveState, setObjectiveState] = useState<ObjectiveEngineState | null>(null);
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>(defaultFinancialProfile);

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        UserAccessService.getState(),
        AcademyEngine.getState(),
        loadOnboardingPreferences(),
        loadXpProfile(),
        loadDisciplineProfile(),
        loadBankrollState(),
        loadTickets(),
        ObjectiveEngine.getState(),
        loadFinancialProfile()
      ]).then(([
        nextAccessState,
        nextAcademyState,
        nextPreferences,
        nextXpProfile,
        nextDisciplineProfile,
        nextBankroll,
        nextTickets,
        nextObjectiveState,
        nextFinancialProfile
      ]) => {
        setAccessState(nextAccessState);
        setAcademyState(nextAcademyState);
        setPreferences(nextPreferences);
        setXpProfile(nextXpProfile);
        setDisciplineProfile(nextDisciplineProfile);
        setBankroll(nextBankroll);
        setTickets(nextTickets);
        setObjectiveState(nextObjectiveState);
        setFinancialProfile(nextFinancialProfile);
      });
    }, [])
  );

  const ascensionIQ = calculateAscensionIQ({
    academyState,
    xpProfile,
    bankroll,
    tickets,
    objectiveState,
    disciplineProfile,
    financialProfile
  });
  const xp = xpProfile?.xp ?? academyState?.profile.xp ?? 0;
  const unlockedBadges = xpProfile?.badges.filter((badge) => badge.unlocked).length ?? ascensionIQ.badges.filter((badge) => badge.unlocked).length;
  const completedModules = academyState?.completedModules.length ?? 0;
  const activeObjectives = objectiveState?.activeObjectives.length ?? 0;
  const playedTickets = tickets.filter((ticket) => ticket.input.playStatus === "played").length;

  function handleReset() {
    Alert.alert(
      "Réinitialiser mes données",
      "Cela remettra à zéro les données locales sauvegardées.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: async () => {
            await resetAscensionData();
            Alert.alert("Données réinitialisées", "Ascension repartira sur une base locale propre.");
          }
        }
      ]
    );
  }

  function handleAdminMode() {
    if (accessState?.adminMode) {
      UserAccessService.returnToGuestMode().then(setAccessState);
      return;
    }

    UserAccessService.activateAdminMode({
      displayName: "Jérôme"
    }).then(setAccessState);
  }

  function chooseUniverse() {
    Alert.alert(
      "Changer d'univers",
      "Choisis l'ambiance visuelle d'Ascension.",
      [
        { text: "Nature", onPress: () => updateUniverse("nature") },
        { text: "Océan", onPress: () => updateUniverse("ocean") },
        { text: "Carbone", onPress: () => updateUniverse("carbon") },
        { text: "Blossom", onPress: () => updateUniverse("blossom") },
        { text: "Cosmos", onPress: () => updateUniverse("cosmos") },
        { text: "Annuler", style: "cancel" }
      ]
    );
  }

  async function updateUniverse(universe: OnboardingUniverse) {
    await setUniverse(universe);
    setPreferences(await saveOnboardingPreferences({ universe }));
  }

  function chooseMainGoal() {
    Alert.alert(
      "Choisir mon objectif principal",
      "Ce choix personnalise simplement ton parcours.",
      [
        { text: "Comprendre l'argent", onPress: () => updateGoal("learn") },
        { text: "Construire mon patrimoine", onPress: () => updateGoal("wealth") },
        { text: "Investir intelligemment", onPress: () => updateGoal("invest") },
        { text: "Opportunités Ascension", onPress: () => updateGoal("opportunities") },
        { text: "Annuler", style: "cancel" }
      ]
    );
  }

  async function updateGoal(goal: OnboardingGoal) {
    setPreferences(await saveOnboardingPreferences({ goal }));
  }

  function showSoon(title: string) {
    Alert.alert(title, "Cette préférence sera configurable dans une prochaine étape.");
  }

  return (
    <AppScreen>
      <AscensionLogo compact />
      <Header
        eyebrow="Profil"
        title="Carte Ascension"
        subtitle="Ton identité, ton niveau et tes accès essentiels."
      />

      <GlassCard style={styles.identityCard}>
        <View style={styles.identityTop}>
          <View style={[styles.avatar, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
            <Text style={[styles.avatarLetter, { color: theme.accentSoft }]}>J</Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={[styles.identityName, { color: theme.text }]}>Jérôme</Text>
            <Text style={[styles.identityMeta, { color: theme.textMuted }]}>
              {accessState?.fullAccess ? "Fondateur Ascension" : "Mode Découverte"}
            </Text>
          </View>
          <View style={[styles.levelPill, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
            <Text style={[styles.levelPillText, { color: theme.accentSoft }]}>{academyState?.profile.level ?? "Bronze"}</Text>
          </View>
        </View>
        <Text style={[styles.motto, { color: theme.accentSoft }]}>{brand.motto}</Text>
      </GlassCard>

      <GlassCard style={styles.iqSummaryCard}>
        <View style={styles.iqHeader}>
          <View>
            <Text style={[styles.kicker, { color: theme.accentSoft }]}>ASCENSION IQ</Text>
            <Text style={[styles.iqScore, { color: theme.text }]}>{ascensionIQ.score} IQ Finance</Text>
            <Text style={[styles.iqLevel, { color: theme.textMuted }]}>{ascensionIQ.level}</Text>
          </View>
          <View style={[styles.iqOrb, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
            <Ionicons name="analytics-outline" size={24} color={theme.accentSoft} />
          </View>
        </View>
        <View style={styles.summaryGrid}>
          <SummaryMetric label="XP" value={`${xp}`} />
          <SummaryMetric label="Badges" value={`${unlockedBadges}`} />
          <SummaryMetric label="Série" value={`${disciplineProfile?.currentStreak ?? 0} j`} />
        </View>
        <View style={styles.badgePreview}>
          {ascensionIQ.badges.slice(0, 3).map((badge) => (
            <View key={badge.id} style={[styles.badgePill, { borderColor: badge.unlocked ? theme.accentBorder : theme.line, backgroundColor: badge.unlocked ? theme.glowSoft : theme.overlay }]}>
              <Ionicons name={badge.unlocked ? "ribbon-outline" : "lock-closed-outline"} size={13} color={badge.unlocked ? theme.accentSoft : theme.textMuted} />
              <Text style={[styles.badgeText, { color: badge.unlocked ? theme.text : theme.textMuted }]}>{badge.title}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <Section title="Accès rapides">
        <View style={styles.list}>
          <ProfileRow icon="wallet-outline" label="Voir mon patrimoine" value="Détail financier" onPress={() => router.push("/wealth" as never)} />
          <ProfileRow icon="flag-outline" label="Voir mes objectifs" value={`${activeObjectives} en cours`} onPress={() => router.push("/(tabs)/discipline" as never)} />
          <ProfileRow icon="stats-chart-outline" label="Voir mes statistiques" value={`${playedTickets} pronostics joués`} onPress={() => router.push("/(tabs)/index" as never)} />
          <ProfileRow icon="settings-outline" label="Paramètres" value="Thème, préférences, compte" onPress={() => showSoon("Paramètres")} />
        </View>
      </Section>

      <Section title="Statistiques générales">
        <GlassCard style={styles.statsCard}>
          <SummaryMetric label="Modules validés" value={`${completedModules}`} />
          <SummaryMetric label="Progression Academy" value={`${academyState?.progression.progressPercent ?? 0}%`} />
          <SummaryMetric label="Univers" value={universeLabels[theme.id]} />
        </GlassCard>
      </Section>

      <Section title="Paramètres">
        <View style={styles.list}>
          <ProfileRow icon="color-palette-outline" label="Changer d'univers" value={universeLabels[theme.id]} onPress={chooseUniverse} />
          <ProfileRow icon="flag-outline" label="Objectif principal" value={preferences?.goal ? goalLabels[preferences.goal] : "Comprendre l'argent"} onPress={chooseMainGoal} />
          <ProfileRow icon="language-outline" label="Langue" value="Français" onPress={() => showSoon("Langue")} />
          <ProfileRow icon="notifications-outline" label="Notifications" value="À configurer" onPress={() => showSoon("Notifications")} />
          <ProfileRow icon="sparkles-outline" label="Ascension Masterclass" value="Approfondir" onPress={() => router.push("/masterclass" as never)} />
        </View>
      </Section>

      <Section title="Compte Ascension">
        <GlassCard style={styles.accountCard}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {accessState?.accountMode ? "Compte Ascension" : "Sauvegarder ma progression"}
          </Text>
          <Text style={[styles.cardText, { color: theme.textMuted }]}>
            {accessState?.accountMode
              ? `Compte local : ${accessState.account?.displayName ?? "Utilisateur Ascension"}`
              : "Crée un compte uniquement lorsque tu veux synchroniser ta progression."}
          </Text>
        </GlassCard>
      </Section>

      <Section title="Mode Fondateur">
        <Pressable onPress={handleAdminMode}>
          <GlassCard style={styles.row} contentStyle={styles.rowInner}>
            <View style={[styles.iconBox, { backgroundColor: theme.glowSoft, borderColor: theme.accentBorder }]}>
              <Ionicons
                name={accessState?.adminMode ? "shield-checkmark" : "shield-outline"}
                size={18}
                color={accessState?.adminMode ? theme.success : theme.accentSoft}
              />
            </View>
            <View style={styles.rowCopy}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>
                {accessState?.fullAccess ? "Désactiver Mode Fondateur" : "Activer Mode Fondateur"}
              </Text>
              <Text style={[styles.rowValue, { color: theme.textMuted }]}>
                {accessState?.fullAccess ? "Tous les modules sont accessibles" : "Réservé au fondateur"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </GlassCard>
        </Pressable>
      </Section>

      <Pressable onPress={handleReset} style={[styles.resetButton, { borderColor: `${theme.danger}55`, backgroundColor: `${theme.danger}12` }]}>
        <Ionicons name="refresh" size={18} color={theme.danger} />
        <View style={styles.resetCopy}>
          <Text style={[styles.resetTitle, { color: theme.danger }]}>Réinitialiser mes données</Text>
          <Text style={[styles.resetText, { color: theme.textMuted }]}>Remettre les données locales à zéro.</Text>
        </View>
      </Pressable>
    </AppScreen>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  const palette = useGlassCardPalette();

  return (
    <View style={[styles.summaryMetric, { borderColor: palette.line, backgroundColor: palette.overlay }]}>
      <Text style={[styles.summaryLabel, { color: palette.secondary }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: palette.title }]}>{value}</Text>
    </View>
  );
}

function ProfileRow({
  icon,
  label,
  value,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const palette = useGlassCardPalette();

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <GlassCard style={styles.row} contentStyle={styles.rowInner}>
        <View style={[styles.iconBox, { backgroundColor: palette.glowSoft, borderColor: palette.border }]}>
          <Ionicons name={icon} size={18} color={palette.accentSoft} />
        </View>
        <View style={styles.rowCopy}>
          <Text style={[styles.rowLabel, { color: palette.title }]}>{label}</Text>
          <Text style={[styles.rowValue, { color: palette.secondary }]}>{value}</Text>
        </View>
        {onPress ? <Ionicons name="chevron-forward" size={18} color={palette.secondary} /> : null}
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  identityCard: {
    padding: spacing.lg,
    gap: spacing.md
  },
  identityTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarLetter: {
    fontSize: 24,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  identityCopy: {
    flex: 1,
    gap: 3
  },
  identityName: {
    fontSize: 24,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.35
  },
  identityMeta: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "500"
  },
  levelPill: {
    minHeight: 34,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  levelPillText: {
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.labelTracking,
    textTransform: "uppercase"
  },
  motto: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    lineHeight: 19
  },
  iqSummaryCard: {
    padding: spacing.lg,
    gap: spacing.md
  },
  iqHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  kicker: {
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.eyebrowTracking,
    textTransform: "uppercase"
  },
  iqScore: {
    fontSize: 28,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.2,
    lineHeight: 36
  },
  iqLevel: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "500"
  },
  iqOrb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  summaryGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  summaryMetric: {
    flex: 1,
    minHeight: 68,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    justifyContent: "center",
    gap: 4
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.7,
    textTransform: "uppercase"
  },
  summaryValue: {
    fontSize: 17,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  badgePreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  badgePill: {
    minHeight: 30,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5
  },
  badgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "600"
  },
  statsCard: {
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.sm
  },
  accountCard: {
    padding: spacing.md,
    gap: spacing.xs
  },
  cardTitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: typography.labelTracking
  },
  cardText: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 20
  },
  list: {
    gap: spacing.sm
  },
  row: {
    minHeight: 68,
    borderRadius: radii.lg
  },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 68,
    padding: spacing.md
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  rowCopy: {
    flex: 1,
    gap: 2
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.2
  },
  rowValue: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400"
  },
  resetButton: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  resetCopy: {
    flex: 1,
    gap: 3
  },
  resetTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  resetText: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400"
  }
});
