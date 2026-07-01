import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { AscensionLogo } from "@/components/AscensionLogo";
import { PremiumButton } from "@/components/PremiumButton";
import { colors, radii, spacing, typography } from "@/constants/theme";
import {
  completeOnboarding,
  OnboardingUniverse
} from "@/features/onboarding/onboardingStorage";
import { getAscensionTheme, useAscensionTheme } from "@/features/theme/ascensionTheme";

const universes: Array<{
  id: OnboardingUniverse;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  tint: string;
}> = [
  { id: "aurora", icon: "partly-sunny-outline", title: "Aurore", description: "L'ascension commence chaque matin.", tint: "#FFB45E" },
  { id: "carbon", icon: "ellipse", title: "Carbone", description: "La puissance de la sobriété.", tint: colors.gold },
  { id: "elegance", icon: "sparkles-outline", title: "Élégance", description: "La simplicité au service de la performance.", tint: colors.white },
  { id: "nature", icon: "leaf-outline", title: "Nature", description: "Grandir à son rythme.", tint: colors.success },
  { id: "ocean", icon: "water-outline", title: "Océan", description: "Garder le cap.", tint: colors.blue },
  { id: "cosmos", icon: "sparkles", title: "Cosmos", description: "Vis plus grand que tes excuses.", tint: "#B47CFF" }
];

const philosophyLines = [
  "Personne ne devient libre financièrement en un jour.",
  "Les connaissances valent plus que les pronostics.",
  "Les opportunités passent.",
  "Les compétences restent.",
  "La discipline construit les résultats."
];

export default function OnboardingScreen() {
  const { theme, setUniverse } = useAscensionTheme();
  const [step, setStep] = useState(0);
  const [selectedUniverse, setSelectedUniverse] = useState<OnboardingUniverse>("carbon");
  const [philosophyIndex, setPhilosophyIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const riseAnim = useRef(new Animated.Value(16)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    riseAnim.setValue(16);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true
      }),
      Animated.timing(riseAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      })
    ]).start();
  }, [fadeAnim, glowAnim, riseAnim, step]);

  useEffect(() => {
    if (step !== 2) {
      return;
    }

    setPhilosophyIndex(0);
    const interval = setInterval(() => {
      setPhilosophyIndex((currentIndex) => Math.min(currentIndex + 1, philosophyLines.length - 1));
    }, 1500);

    return () => clearInterval(interval);
  }, [step]);

  const animatedStyle = useMemo(
    () => ({
      opacity: fadeAnim,
      transform: [{ translateY: riseAnim }]
    }),
    [fadeAnim, riseAnim]
  );

  async function nextStep() {
  setStep((currentStep) => Math.min(currentStep + 1, 2));
}


  async function enterAscension() {
    await completeOnboarding({
      universe: selectedUniverse,
      goal: null
    });
    router.replace("/(tabs)");
  }

  async function selectUniverse(universe: OnboardingUniverse) {
  setSelectedUniverse(universe);

  try {
    Promise.resolve(setUniverse(universe)).catch((error) => {
      console.error("Erreur setUniverse :", error);
    });
  } catch (error) {
    console.error("Erreur setUniverse :", error);
  }
}

  return (
    <LinearGradient colors={theme.backgroundGradient} style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.backgroundGlow, { backgroundColor: theme.glow }]} />
        <View style={[styles.goldParticleOne, { backgroundColor: theme.accent }]} />
   <Animated.View style={[styles.content, animatedStyle]}>
  {step === 0 ? <StartStep glowAnim={glowAnim} onStart={nextStep} /> : null}
  {step === 1 ? <WelcomeStep onExplore={nextStep} /> : null}
  {step === 2 ? (
    <PhilosophyStep
      line={philosophyLines[philosophyIndex]}
      onEnter={enterAscension}
    />
  ) : null}
</Animated.View>

<View style={styles.dots}>
  {[0, 1, 2].map((dot) => (
    <View
      key={dot}
      style={[
        styles.dot,
        step === dot && styles.dotActive,
        step === dot && { backgroundColor: theme.accent }
      ]}
    />
  ))}
</View>
</SafeAreaView>
</LinearGradient>
);
}    


function StartStep({ glowAnim, onStart }: { glowAnim: Animated.Value; onStart: () => void }) {
  return (
    <View style={styles.centeredStep}>
      <Animated.View style={[styles.logoHalo, { opacity: glowAnim }]} />
      <AscensionLogo />
      <View style={styles.heroCopy}>
        <Text style={styles.heroTitle}>Et si ton avenir financier commençait aujourd'hui ?</Text>
        <Text style={styles.heroSubtitle}>La discipline avant la performance.</Text>
      </View>
      <PremiumButton label="COMMENCER L'ASCENSION" icon="arrow-forward" onPress={onStart} style={styles.primaryButton} />
    </View>
  );
}

function UniverseStep({
  selectedUniverse,
  onSelect,
  onContinue
}: {
  selectedUniverse: OnboardingUniverse;
  onSelect: (universe: OnboardingUniverse) => void;
  onContinue: () => void;
}) {
  return (
    <View style={styles.step}>
      <Text style={styles.title}>Choisis ton univers</Text>
      <Text style={styles.subtitle}>Chaque univers inspire ton ascension.</Text>
      <View style={styles.cardGrid}>
        {universes.map((universe) => {
          const cardTheme = getAscensionTheme(universe.id);

          return (
          <ChoiceCard
            key={universe.id}
            icon={universe.icon}
            title={universe.title}
            description={universe.description}
            tint={cardTheme.accent}
            selected={selectedUniverse === universe.id}
            onPress={() => onSelect(universe.id)}
            themeId={universe.id}
          />
        );
        })}
      </View>
      <PremiumButton label="CONTINUER" icon="arrow-forward" onPress={onContinue} style={styles.primaryButton} />
    </View>
  );
}

function WelcomeStep({ onExplore }: { onExplore: () => void }) {
  return (
    <View style={styles.step}>
      <Text style={styles.title}>Bienvenue dans Ascension.</Text>
      <Text style={styles.bodyText}>
        Tu peux découvrir librement l'application.{"\n\n"}
        Aucun compte n'est nécessaire.{"\n"}
        Aucune donnée personnelle n'est demandée.
      </Text>
      <View style={styles.actions}>
        <PremiumButton label="Découvrir gratuitement" icon="compass-outline" onPress={onExplore} style={styles.primaryButton} />
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>J'ai déjà un compte</Text>
        </Pressable>
      </View>
    </View>
  );
}

function PhilosophyStep({ line, onEnter }: { line: string; onEnter: () => void }) {
  return (
    <View style={styles.centeredStep}>
      <Text style={styles.philosophyLine}>{line}</Text>
      <View style={styles.finalLogo}>
        <AscensionLogo compact />
      </View>
      <Text style={styles.finalMotto}>LA DISCIPLINE AVANT LA PERFORMANCE.</Text>
      <PremiumButton label="ENTRER DANS ASCENSION" icon="rocket-outline" onPress={onEnter} style={styles.primaryButton} />
    </View>
  );
}

function ChoiceCard({
  icon,
  title,
  description,
  tint = colors.gold,
  selected,
  onPress,
  themeId
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  tint?: string;
  selected: boolean;
  onPress: () => void;
  themeId?: OnboardingUniverse;
}) {
  const cardTheme = themeId ? getAscensionTheme(themeId) : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceCard,
        cardTheme ? { backgroundColor: cardTheme.surface, borderColor: cardTheme.accentBorder } : null,
        selected && styles.choiceCardSelected,
        selected && cardTheme ? { borderColor: cardTheme.accent, backgroundColor: cardTheme.glowSoft } : null,
        pressed && styles.choiceCardPressed
      ]}
    >
      <View style={[styles.choiceIcon, selected && styles.choiceIconSelected, cardTheme ? { borderColor: cardTheme.accentBorder } : null]}>
        <Ionicons name={icon} size={22} color={tint} />
      </View>
      <View style={styles.choiceCopy}>
        <Text style={styles.choiceTitle}>{title}</Text>
        {description ? <Text style={styles.choiceDescription}>{description}</Text> : null}
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={20} color={tint} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    padding: spacing.lg
  },
  backgroundGlow: {
    position: "absolute",
    top: 48,
    alignSelf: "center",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(240, 184, 78, 0.10)"
  },
  goldParticleOne: {
    position: "absolute",
    top: 120,
    right: 52,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gold
  },
  goldParticleTwo: {
    position: "absolute",
    top: 220,
    left: 46,
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.gold
  },
  content: {
    flex: 1,
    justifyContent: "center"
  },
  centeredStep: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl
  },
  step: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg
  },
  logoHalo: {
    position: "absolute",
    top: "23%",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(240, 184, 78, 0.12)"
  },
  heroCopy: {
    gap: spacing.md
  },
  heroTitle: {
    color: colors.white,
    fontFamily: typography.fontFamily,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "700",
    textAlign: "center"
  },
  heroSubtitle: {
    color: colors.gold,
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.7,
    textAlign: "center",
    textTransform: "uppercase"
  },
  title: {
    color: colors.white,
    fontFamily: typography.fontFamily,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: typography.titleTracking,
    textAlign: "center"
  },
  subtitle: {
    color: "#C8C8C8",
    fontFamily: typography.fontFamily,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center"
  },
  bodyText: {
    color: "#E8E8E8",
    fontFamily: typography.fontFamily,
    fontSize: 17,
    lineHeight: 27,
    textAlign: "center"
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  list: {
    gap: spacing.md
  },
  choiceCard: {
    minHeight: 96,
    width: "47.5%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    backgroundColor: "rgba(7, 7, 7, 0.92)",
    padding: spacing.md,
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  choiceCardSelected: {
    borderColor: "rgba(240, 184, 78, 0.72)",
    backgroundColor: "rgba(240, 184, 78, 0.08)",
    transform: [{ scale: 1.02 }]
  },
  choiceCardPressed: {
    transform: [{ scale: 0.98 }]
  },
  choiceIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050505"
  },
  choiceIconSelected: {
    borderColor: colors.goldBorder
  },
  choiceCopy: {
    flex: 1,
    gap: 4
  },
  choiceTitle: {
    color: colors.white,
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: "700"
  },
  choiceDescription: {
    color: "#C8C8C8",
    fontFamily: typography.fontFamily,
    fontSize: 12,
    lineHeight: 17
  },
  actions: {
    gap: spacing.md
  },
  primaryButton: {
    alignSelf: "center",
    minWidth: 230
  },
  secondaryButton: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonText: {
    color: "#C8C8C8",
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: "700"
  },
  philosophyLine: {
    color: colors.white,
    fontFamily: typography.fontFamily,
    fontSize: 25,
    lineHeight: 35,
    fontWeight: "700",
    textAlign: "center"
  },
  finalLogo: {
    alignSelf: "center"
  },
  finalMotto: {
    color: colors.gold,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.3,
    textAlign: "center"
  },
  dots: {
    minHeight: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.22)"
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.gold
  }
});
