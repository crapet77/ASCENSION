import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { AscensionLogo } from "@/components/AscensionLogo";
import { GlassCard } from "@/components/GlassCard";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { brand } from "@/constants/brand";
import { resetAscensionData } from "@/features/appReset/reset";
import { UserAccessService, UserAccessState } from "@/features/access/userAccess";
import { AcademyEngine, AcademyEngineState } from "@/engine/academy";
import {
  loadOnboardingPreferences,
  OnboardingGoal,
  OnboardingPreferences,
  OnboardingUniverse,
  saveOnboardingPreferences
} from "@/features/onboarding/onboardingStorage";
import { loadDisciplineProfile, DisciplineProfile } from "@/features/discipline/disciplineProfile";
import { loadXpProfile, XpProfile } from "@/features/xp/xpSystem";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";
import { colors, radii, spacing } from "@/constants/theme";

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
  const { theme, setUniverse } = useAscensionTheme();
  const [accessState, setAccessState] = useState<UserAccessState | null>(null);
  const [academyState, setAcademyState] = useState<AcademyEngineState | null>(null);
  const [preferences, setPreferences] = useState<OnboardingPreferences | null>(null);
  const [xpProfile, setXpProfile] = useState<XpProfile | null>(null);
  const [disciplineProfile, setDisciplineProfile] = useState<DisciplineProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        UserAccessService.getState(),
        AcademyEngine.getState(),
        loadOnboardingPreferences(),
        loadXpProfile(),
        loadDisciplineProfile()
      ]).then(([nextAccessState, nextAcademyState, nextPreferences, nextXpProfile, nextDisciplineProfile]) => {
        setAccessState(nextAccessState);
        setAcademyState(nextAcademyState);
        setPreferences(nextPreferences);
        setXpProfile(nextXpProfile);
        setDisciplineProfile(nextDisciplineProfile);
      });
    }, [])
  );

  function handleReset() {
    Alert.alert(
      "Réinitialiser mes données",
      "Cela remettra à zéro la bankroll, les paris, statistiques, objectifs et historique sauvegardés.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: async () => {
            await resetAscensionData();
            Alert.alert("Données réinitialisées", "Au prochain test, Ascension te demandera ton capital de départ.");
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
      "Ce choix modifie simplement l'ordre des contenus de l'accueil.",
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
    Alert.alert(title, "Cette préférence sera configurable dans une prochaine étape. Pour l'instant, Ascension conserve tes données localement.");
  }

  return (
    <AppScreen>
      <AscensionLogo compact />
      <Header
        eyebrow="Profil"
        title="Parametres"
        subtitle="Personnalise ton experience et suis ta progression Ascension."
      />

      <GlassCard style={styles.identity}>
        <Text style={styles.identityName}>{brand.name}</Text>
        <Text style={styles.identityMotto}>{brand.motto}</Text>
      </GlassCard>

      <Section title="👤 Personnalisation">
        <View style={styles.list}>
          <ProfileRow icon="color-palette-outline" label="Changer d'univers" value={universeLabels[theme.id]} onPress={chooseUniverse} />
          <ProfileRow icon="contrast-outline" label="Modifier le thème" value={theme.name} onPress={chooseUniverse} />
          <ProfileRow icon="language-outline" label="Choisir la langue" value="Français" onPress={() => showSoon("Choisir la langue")} />
        </View>
      </Section>

      <Section title="🎯 Mon parcours">
        <GlassCard style={styles.versionBox}>
          <Text style={styles.versionTitle}>Objectif principal</Text>
          <Text style={styles.versionText}>
            {preferences?.goal ? goalLabels[preferences.goal] : "Comprendre l'argent"}
          </Text>
        </GlassCard>
        <View style={styles.list}>
          <ProfileRow icon="flag-outline" label="Choisir mon objectif principal" value="Modifier" onPress={chooseMainGoal} />
          <ProfileRow icon="book-outline" label="Comprendre l'argent" value={preferences?.goal === "learn" ? "Actif" : "Disponible"} onPress={() => updateGoal("learn")} />
          <ProfileRow icon="wallet-outline" label="Construire mon patrimoine" value={preferences?.goal === "wealth" ? "Actif" : "Disponible"} onPress={() => updateGoal("wealth")} />
          <ProfileRow icon="trending-up-outline" label="Investir intelligemment" value={preferences?.goal === "invest" ? "Actif" : "Disponible"} onPress={() => updateGoal("invest")} />
          <ProfileRow icon="sparkles-outline" label="Opportunités Ascension" value={preferences?.goal === "opportunities" ? "Actif" : "Disponible"} onPress={() => updateGoal("opportunities")} />
        </View>
      </Section>

      <Section title="🎓 Academy">
        <View style={styles.list}>
          <ProfileRow icon="school-outline" label="Niveau actuel" value={academyState?.profile.level ?? "Bronze"} />
          <ProfileRow icon="checkmark-done-outline" label="Modules validés" value={`${academyState?.completedModules.length ?? 0}`} />
          <ProfileRow icon="help-circle-outline" label="Quiz réussis" value={`${academyState?.certifiedLevels.length ?? 0}`} />
          <ProfileRow icon="ribbon-outline" label="Certificats" value={`${academyState?.certifiedLevels.length ?? 0}`} />
          <ProfileRow icon="analytics-outline" label="Progression" value={`${academyState?.progression.progressPercent ?? 0}%`} />
        </View>
      </Section>

      <Section title="⭐ Progression">
        <View style={styles.list}>
          <ProfileRow icon="flash-outline" label="XP" value={`${xpProfile?.xp ?? academyState?.profile.xp ?? 0} XP`} />
          <ProfileRow icon="medal-outline" label="Badges" value={`${xpProfile?.badges.filter((badge) => badge.unlocked).length ?? 0}`} />
          <ProfileRow icon="flame-outline" label="Série de discipline" value={`${disciplineProfile?.currentStreak ?? 0} jours`} />
          <ProfileRow icon="time-outline" label="Temps passé dans l'application" value="Local · bientôt" />
        </View>
      </Section>

      <Section title="⚙️ Préférences">
        <View style={styles.list}>
          <ProfileRow icon="notifications-outline" label="Notifications" value="À configurer" onPress={() => showSoon("Notifications")} />
          <ProfileRow icon="football-outline" label="Sports favoris" value="À configurer" onPress={() => showSoon("Sports favoris")} />
          <ProfileRow icon="bar-chart-outline" label="Marchés favoris" value="À configurer" onPress={() => showSoon("Marchés favoris")} />
          <ProfileRow icon="alarm-outline" label="Fréquence des alertes" value="À configurer" onPress={() => showSoon("Fréquence des alertes")} />
        </View>
      </Section>

      <Section title="☁️ Compte Ascension">
        <GlassCard style={styles.versionBox}>
          <Text style={styles.versionTitle}>
            {accessState?.accountMode ? "Compte Ascension" : "Sauvegarder ma progression"}
          </Text>
          <Text style={styles.versionText}>
            {accessState?.accountMode
              ? `Compte local : ${accessState.account?.displayName ?? "Utilisateur Ascension"}`
              : "Créer gratuitement un compte pour synchroniser tes appareils, XP, badges, historique et objectifs."}
          </Text>
        </GlassCard>
      </Section>

      <Section title="Mode Fondateur">
        <GlassCard style={styles.versionBox}>
          <Text style={styles.versionTitle}>
            {accessState?.fullAccess ? "Accès fondateur activé" : "Accès créateur Ascension"}
          </Text>
          <Text style={styles.versionText}>
            {accessState?.fullAccess
              ? "Tous les modules sont débloqués localement pour tester Pronostics, Marchés, IA, import JSON, statistiques, reset et outils de simulation."
              : "Active ce mode uniquement pour tester l'application complète sans abonnement ni verrou Premium."}
          </Text>
        </GlassCard>
        <Pressable onPress={handleAdminMode}>
          <GlassCard style={styles.row} contentStyle={styles.rowInner}>
            <View style={styles.iconBox}>
              <Ionicons
                name={accessState?.adminMode ? "shield-checkmark" : "shield-outline"}
                size={18}
                color={accessState?.adminMode ? colors.success : colors.gold}
              />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowLabel}>
                {accessState?.fullAccess ? "Désactiver Mode Fondateur" : "Activer Mode Fondateur"}
              </Text>
              <Text style={styles.rowValue}>
                {accessState?.fullAccess ? "Actif · Premium et modules avancés débloqués" : "Réservé au fondateur"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </GlassCard>
        </Pressable>
      </Section>

      <Pressable onPress={handleReset} style={styles.resetButton}>
        <Ionicons name="refresh" size={18} color={colors.danger} />
        <View style={styles.resetCopy}>
          <Text style={styles.resetTitle}>Réinitialiser mes données</Text>
          <Text style={styles.resetText}>Bankroll, paris, statistiques, objectifs et historique.</Text>
        </View>
      </Pressable>
    </AppScreen>
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
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <GlassCard style={styles.row} contentStyle={styles.rowInner}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} color={colors.gold} />
        </View>
        <View style={styles.rowCopy}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowValue}>{value}</Text>
        </View>
        {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  identity: {
    padding: spacing.lg,
    gap: spacing.xs
  },
  identityName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700"
  },
  identityMotto: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "500"
  },
  list: {
    gap: spacing.sm
  },
  row: {
    minHeight: 68
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
    backgroundColor: "rgba(228, 169, 69, 0.10)",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    alignItems: "center",
    justifyContent: "center"
  },
  rowCopy: {
    flex: 1,
    gap: 2
  },
  rowLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600"
  },
  rowValue: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "400"
  },
  versionBox: {
    padding: spacing.md,
    gap: spacing.xs
  },
  versionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700"
  },
  versionText: {
    color: "#C8C8C8",
    fontSize: 13,
    lineHeight: 20
  },
  resetButton: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.30)",
    borderRadius: radii.md,
    backgroundColor: "rgba(255, 107, 107, 0.06)",
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
    color: colors.danger,
    fontSize: 15,
    fontWeight: "700"
  },
  resetText: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "400"
  }
});
