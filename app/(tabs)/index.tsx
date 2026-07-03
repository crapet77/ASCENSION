import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop
} from "react-native-svg";

import { AppScreen } from "@/components/AppScreen";
import { AscensionLogo } from "@/components/AscensionLogo";
import { GlassCard } from "@/components/GlassCard";
import { PremiumDashboardHighlights } from "@/components/PremiumDashboardHighlights";
import { brand } from "@/constants/brand";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { dailyObjectives, habits as seedHabits } from "@/data/seed";
import { AcademyEngine } from "@/engine/academy";
import { ObjectiveEngine } from "@/engine/objectives";
import { getBankrollBetProfit, getBankrollStats } from "@/features/bankroll/math";
import { loadBankrollState } from "@/features/bankroll/storage";
import { BankrollBet, BankrollState } from "@/features/bankroll/types";
import {
  calculateDisciplineProfile,
  DisciplineProfile,
  saveDisciplineProfile
} from "@/features/discipline/disciplineProfile";
import { loadHabits } from "@/features/discipline/storage";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";
import { loadTickets } from "@/features/tickets/storage";
import {
  calculateXpProfile,
  defaultXpProfile,
  saveXpProfile,
  XpProfile
} from "@/features/xp/xpSystem";
import { Habit } from "@/types/domain";
import { formatCurrency, formatPercent } from "@/utils/format";

const emeraldDeep = "#0E7A58";
const emeraldGlow = "#63E6A2";
const champagneGold = "#F4C96C";
const champagneLight = "#FFF0B8";
const champagneDeep = "#B77A21";
const defaultDisciplineProfile: DisciplineProfile = {
  score: 0,
  xp: 0,
  level: "Bronze",
  currentStreak: 0,
  week: ["L", "M", "M", "J", "V", "S", "D"].map((label, index) => ({
    date: `future-${index}`,
    label,
    status: "future"
  })),
  updatedAt: ""
};

const dailyMotivations = [
  "La discipline construit les résultats.",
  "Chaque jour compte.",
  "Un petit progrès vaut mieux qu'un grand projet abandonné.",
  "L'Ascension continue.",
  "La régularité transforme les intentions en résultats.",
  "Avance calmement, mais avance.",
  "La maîtrise commence par une décision simple."
];

function getTimeBasedGreeting(date: Date) {
  const hour = date.getHours();

  if (hour >= 6 && hour <= 10) {
    return "Bonjour Jérôme ☀️";
  }

  if (hour >= 11 && hour <= 17) {
    return "Bon après-midi Jérôme 👋";
  }

  if (hour >= 18 && hour <= 21) {
    return "Bonsoir Jérôme 🌙";
  }

  return "Bonne nuit Jérôme ✨";
}

function getDailyMotivation(date: Date) {
  const daySeed = Math.floor(date.getTime() / 86_400_000);
  return dailyMotivations[daySeed % dailyMotivations.length];
}

function DisciplineRing({ score }: { score: number }) {
  const ringProgress = useRef(new Animated.Value(0)).current;
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 45;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const listener = ringProgress.addListener(({ value }) => {
      setAnimatedScore(Math.round(value));
    });

    Animated.timing(ringProgress, {
      toValue: score,
      duration: 1400,
      useNativeDriver: false
    }).start();

    return () => ringProgress.removeListener(listener);
  }, [ringProgress, score]);

  return (
    <View style={styles.ringWrap}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.12)", "rgba(244, 201, 108, 0.10)", "rgba(0, 0, 0, 0.36)"]}
        style={styles.ringGlass}
      />
      <View style={styles.ringHalo} />
      <View pointerEvents="none" style={styles.ringInnerShadow} />
      <Svg width={148} height={148} viewBox="0 0 148 148">
        <Defs>
          <SvgLinearGradient id="disciplineEmeraldChampagne" x1="22" y1="126" x2="126" y2="22">
            <Stop offset="0" stopColor={emeraldDeep} />
            <Stop offset="0.36" stopColor={emeraldGlow} />
            <Stop offset="0.66" stopColor={champagneGold} />
            <Stop offset="0.86" stopColor={champagneLight} />
            <Stop offset="1" stopColor={champagneGold} />
          </SvgLinearGradient>
        </Defs>
        <Circle cx="74" cy="74" r="66" fill="rgba(255,255,255,0.018)" />
        <Circle cx="74" cy="74" r="59" stroke="rgba(244,201,108,0.13)" strokeWidth="1.3" fill="none" />
        <Circle cx="74" cy="74" r={radius} stroke="rgba(255,255,255,0.07)" strokeWidth={stroke + 12} fill="none" />
        <Circle cx="74" cy="74" r={radius} stroke="#1B1D1B" strokeWidth={stroke} fill="none" />
        <Circle
          cx="74"
          cy="74"
          r={radius}
          stroke={colors.white}
          strokeWidth={stroke + 7}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin="74, 74"
          opacity="0.16"
        />
        <Circle
          cx="74"
          cy="74"
          r={radius}
          stroke="url(#disciplineEmeraldChampagne)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin="74, 74"
        />
      </Svg>
      <Text style={styles.ringText}>{animatedScore}%</Text>
      <Text style={styles.ringCaption}>DISCIPLINE</Text>
    </View>
  );
}

type BankrollCurve = {
  areaPath: string;
  linePath: string;
  endPoint: { x: number; y: number };
  zeroY: number;
  minProfit: number;
  maxProfit: number;
};

function getBankrollCurve(bankroll: BankrollState): BankrollCurve {
  const chart = {
    left: 4,
    right: 276,
    top: 10,
    bottom: 54
  };
  const settledBets = [...bankroll.bets]
    .filter((bet) => bet.result === "won" || bet.result === "lost" || bet.result === "void")
    .sort((left, right) => getBetDate(left).localeCompare(getBetDate(right)));
  const values = settledBets.reduce<number[]>(
    (curveValues, bet) => {
      const previousValue = curveValues[curveValues.length - 1] ?? 0;
      return [...curveValues, previousValue + getBankrollBetProfit(bet)];
    },
    [0]
  );
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  const range = Math.max(maxValue - minValue, 1);
  const zeroY = chart.bottom - ((0 - minValue) / range) * (chart.bottom - chart.top);
  const horizontalStep = values.length > 1 ? (chart.right - chart.left) / (values.length - 1) : 0;
  const points = values.map((value, index) => {
    const x = values.length > 1 ? chart.left + index * horizontalStep : chart.left;
    const y = chart.bottom - ((value - minValue) / range) * (chart.bottom - chart.top);

    return { x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const endPoint = points[points.length - 1] ?? { x: chart.left, y: chart.bottom };

  return {
    linePath,
    areaPath: `${linePath} L${endPoint.x.toFixed(2)} ${zeroY.toFixed(2)} L${chart.left} ${zeroY.toFixed(2)} Z`,
    endPoint,
    zeroY,
    minProfit: minValue,
    maxProfit: maxValue
  };
}

function getBetDate(bet: BankrollBet) {
  return bet.settledAt ?? bet.placedAt;
}

function ProgressLine({ progress, curve }: { progress: Animated.Value; curve: BankrollCurve }) {
  const { theme } = useAscensionTheme();
  const revealStyle = {
    opacity: progress,
    transform: [
      {
        scaleX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.04, 1]
        })
      }
    ]
  };

  return (
    <Animated.View style={[styles.chartReveal, revealStyle]}>
      <Svg width="100%" height={66} viewBox="0 0 280 66">
        <Defs>
          <SvgLinearGradient id="progressMotionTheme" x1="4" y1="54" x2="276" y2="14">
            <Stop offset="0" stopColor={theme.accent} stopOpacity="0.34" />
            <Stop offset="0.34" stopColor={theme.accent} />
            <Stop offset="0.64" stopColor={theme.accentSoft} />
            <Stop offset="0.80" stopColor={colors.white} stopOpacity="0.92" />
            <Stop offset="1" stopColor={theme.accent} />
          </SvgLinearGradient>
          <SvgLinearGradient id="progressMotionWhite" x1="92" y1="38" x2="276" y2="10">
            <Stop offset="0" stopColor={colors.white} stopOpacity="0" />
            <Stop offset="0.45" stopColor={colors.white} stopOpacity="0.34" />
            <Stop offset="0.72" stopColor={colors.white} stopOpacity="0.90" />
            <Stop offset="1" stopColor={colors.white} stopOpacity="0" />
          </SvgLinearGradient>
          <SvgLinearGradient id="progressAreaTheme" x1="8" y1="16" x2="276" y2="66">
            <Stop offset="0" stopColor={theme.accentSoft} stopOpacity="0.20" />
            <Stop offset="0.45" stopColor={theme.accent} stopOpacity="0.085" />
            <Stop offset="1" stopColor={theme.accent} stopOpacity="0" />
          </SvgLinearGradient>
        </Defs>
        {[18, 32, 46, 60].map((y) => (
          <Path key={`grid-y-${y}`} d={`M4 ${y} L276 ${y}`} stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" />
        ))}
        {[44, 88, 132, 176, 220, 264].map((x) => (
          <Path key={`grid-x-${x}`} d={`M${x} 10 L${x} 66`} stroke="rgba(255,255,255,0.025)" strokeWidth="0.8" />
        ))}
        <Path
          d={`M4 ${curve.zeroY.toFixed(2)} L276 ${curve.zeroY.toFixed(2)}`}
          stroke={theme.accentBorder}
          strokeWidth="1.15"
          strokeDasharray="4 5"
          opacity="0.92"
        />
        <Path
          d={curve.areaPath}
          fill="url(#progressAreaTheme)"
        />
        <Path
          d={curve.linePath}
          stroke={theme.accentSoft}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.14"
        />
        <Path
          d={curve.linePath}
          stroke="url(#progressMotionTheme)"
          strokeWidth="2.35"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={curve.linePath}
          stroke="url(#progressMotionWhite)"
          strokeWidth="1.25"
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={curve.endPoint.x} cy={curve.endPoint.y} r="3.2" fill={theme.accentSoft} opacity="0.92" />
      </Svg>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const { theme } = useAscensionTheme();
  const entrance = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(0)).current;
  const missionProgress = useRef(new Animated.Value(0)).current;
  const missionCelebrate = useRef(new Animated.Value(0)).current;
  const progressDraw = useRef(new Animated.Value(0)).current;
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [bankroll, setBankroll] = useState<BankrollState>({
    initialCapital: null,
    transactions: [],
    bets: [],
    updatedAt: ""
  });
  const [habits, setHabits] = useState<Habit[]>(seedHabits);
  const [disciplineProfile, setDisciplineProfile] = useState<DisciplineProfile>(defaultDisciplineProfile);
  const [xpProfile, setXpProfile] = useState<XpProfile>(defaultXpProfile);
  const completedObjectives = dailyObjectives.filter((objective) => objective.done).length;
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const dashboardDate = useMemo(
    () => currentDate.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }),
    [currentDate]
  );
  const greetingMessage = useMemo(() => getTimeBasedGreeting(currentDate), [currentDate]);
  const dailyMotivation = useMemo(() => getDailyMotivation(currentDate), [currentDate]);
  const stats = getBankrollStats(bankroll);
  const bankrollCurve = useMemo(() => getBankrollCurve(bankroll), [bankroll]);
  const opportunityGroups = [
    { icon: "football-outline", label: "Sport", count: 0, suffix: "opportunité" },
    { icon: "trending-up-outline", label: "Marchés", count: 0, suffix: "opportunité" },
    { icon: "home-outline", label: "Patrimoine", count: 0, suffix: "alerte" }
  ] as const;
  const totalOpportunities = opportunityGroups.reduce((total, group) => total + group.count, 0);
  const todayQuote = useMemo(() => {
    const quotes = [
      "La discipline transforme les intentions en résultats.",
      "Chaque matin est une nouvelle chance de choisir l'excellence.",
      "Une seule décision juste peut changer la journée."
    ];
    return quotes[currentDate.getDate() % quotes.length];
  }, [currentDate]);
  const missionSummary = completedObjectives >= dailyObjectives.length
    ? "Aujourd'hui, tu as déjà validé ta mission principale."
    : "Aujourd'hui, aucune décision impulsive."
  const aiAdvice = useMemo(() => {
    if (disciplineProfile.score >= 80) {
      return "Ton rythme est solide. Prolonge l'élan avec une seule action premium aujourd'hui.";
    }

    if (stats.profit >= 0) {
      return "Reste calme et suivez ton plan : la régularité crée l'ascension.";
    }

    return "Une journée d'équilibre vaut mieux qu'un coup de chaleur. Reprends le cap avec douceur.";
  }, [disciplineProfile.score, stats.profit]);
  const targetAmount = 5000;
  const currentAmount = Math.min(stats.currentCapital, targetAmount);
  const remainingAmount = targetAmount - currentAmount;
  const goalPercent = targetAmount > 0 ? Math.min(100, (currentAmount / targetAmount) * 100) : 0;
  const goalEstimate = remainingAmount <= 0
    ? "Objectif atteint."
    : stats.profit > 0
      ? `Estimation : objectif atteint dans environ ${Math.ceil(remainingAmount / stats.profit)} mois.`
      : "Estimation disponible après bénéfice régulier.";
  const financialStats = [
    { label: "Capital", value: formatCurrency(stats.initialCapital), tone: "neutral" },
    { label: "Bankroll", value: formatCurrency(stats.currentCapital), tone: "neutral" },
    { label: "ROI", value: formatPercent(stats.roi), tone: "positive" },
    { label: "Bénéfice", value: formatCurrency(stats.profit), tone: stats.profit >= 0 ? "positive" : "danger" },
    { label: "Paris", value: `${stats.placedCount}`, tone: "neutral" },
    { label: "Réussite", value: formatPercent(stats.winRate), tone: "positive" }
  ];

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        loadBankrollState(),
        loadHabits(),
        loadTickets(),
        AcademyEngine.getState(),
        ObjectiveEngine.getState()
      ]).then(([loadedBankroll, loadedHabits, loadedTickets, academyState, objectiveState]) => {
        const nextDisciplineProfile = calculateDisciplineProfile({
          bankroll: loadedBankroll,
          habits: loadedHabits,
          objectives: dailyObjectives
        });
        const nextXpProfile = calculateXpProfile({
          bankroll: loadedBankroll,
          tickets: loadedTickets,
          academyMissions: academyState.profile.missions,
          academyModules: academyState.profile.modules,
          objectives: objectiveState.objectives,
          disciplineProfile: nextDisciplineProfile
        });

        setBankroll(loadedBankroll);
        setHabits(loadedHabits);
        setDisciplineProfile(nextDisciplineProfile);
        setXpProfile(nextXpProfile);
        saveDisciplineProfile(nextDisciplineProfile);
        saveXpProfile(nextXpProfile);
      });
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stats.placedCount > 0) {
      setMissionCompleted(true);
    }
  }, [stats.placedCount]);

  useEffect(() => {
    progressDraw.setValue(0);
    Animated.parallel([
      Animated.timing(entrance, {
        toValue: 1,
        duration: 920,
        useNativeDriver: true
      }),
      Animated.timing(progressDraw, {
        toValue: 1,
        duration: 1650,
        useNativeDriver: false
      })
    ]).start();
  }, [bankrollCurve.linePath, entrance, progressDraw]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoPulse, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true
      }),
      Animated.timing(logoPulse, {
        toValue: 0,
        duration: 1800,
        useNativeDriver: true
      })
    ]).start();
  }, [logoPulse]);

  useEffect(() => {
    if (!missionCompleted) {
      missionCelebrate.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.timing(missionCelebrate, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true
      }),
      Animated.timing(missionCelebrate, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true
      })
    ]).start();
  }, [missionCelebrate, missionCompleted]);
  useEffect(() => {
    Animated.timing(missionProgress, {
      toValue: missionCompleted ? 1 : 0.22,
      duration: 920,
      useNativeDriver: false
    }).start();
  }, [missionCompleted, missionProgress]);

  const animatedStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0]
        })
      }
    ]
  };
  const logoAnimatedStyle = {
    transform: [
      {
        scale: logoPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.018]
        })
      }
    ]
  };
  const logoHaloStyle = {
    opacity: logoPulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.24]
    }),
    transform: [
      {
        scale: logoPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [0.86, 1.05]
        })
      }
    ]
  };
  const particleStyle = {
    opacity: logoPulse.interpolate({
      inputRange: [0, 0.35, 1],
      outputRange: [0, 0.42, 0]
    }),
    transform: [
      {
        translateY: logoPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [8, -10]
        })
      }
    ]
  };
  const missionCelebrateStyle = {
    transform: [
      {
        scale: missionCelebrate.interpolate({
          inputRange: [0, 0.45, 1],
          outputRange: [1, 1.006, 1]
        })
      }
    ]
  };
  const confettiStyle = {
    opacity: missionCelebrate.interpolate({
      inputRange: [0, 0.15, 1],
      outputRange: [0, 0.42, 0]
    }),
    transform: [
      {
        translateY: missionCelebrate.interpolate({
          inputRange: [0, 1],
          outputRange: [6, -14]
        })
      }
    ]
  };
  const missionFillStyle = {
    width: missionProgress.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"]
    })
  };
  const goalFillStyle = {
    width: progressDraw.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", `${goalPercent}%`]
    })
  };

  return (
    <AppScreen>
      <Animated.View style={[styles.animatedContent, animatedStyle]}>
        <View style={styles.topBar}>
          <Animated.View style={[styles.logoBox, logoAnimatedStyle]}>
            <Animated.View pointerEvents="none" style={[styles.logoHalo, logoHaloStyle]} />
            <Animated.View pointerEvents="none" style={[styles.logoParticle, styles.logoParticleOne, particleStyle]} />
            <Animated.View pointerEvents="none" style={[styles.logoParticle, styles.logoParticleTwo, particleStyle]} />
            <Animated.View pointerEvents="none" style={[styles.logoParticle, styles.logoParticleThree, particleStyle]} />
            <AscensionLogo compact markOnly />
          </Animated.View>
        </View>

        <PremiumDashboardHighlights
          greeting={greetingMessage}
          dashboardDate={dashboardDate}
          dailyMotivation={dailyMotivation}
          quote={todayQuote}
          disciplineProfile={disciplineProfile}
          xpProfile={xpProfile}
          goalPercent={goalPercent}
          goalLabel="Atteindre 5 000 €"
          goalValue={`${formatCurrency(currentAmount)} / ${formatCurrency(targetAmount)}`}
          missionLabel={missionSummary}
          missionCompleted={missionCompleted}
          advice={aiAdvice}
          onStartDay={() => {
            setMissionCompleted(true);
            router.push("/(tabs)/ticket" as never);
          }}
          onOpenProfile={() => router.push("/profile")}
        />

        <Pressable onPress={() => router.push("/(tabs)/ticket" as never)}>
          <GlassCard style={[styles.opportunityCard, styles.cardDepth]}>
          <View pointerEvents="none" style={styles.cardInnerHalo} />
          <View pointerEvents="none" style={styles.cardReflection} />
          <View pointerEvents="none" style={styles.cardCarbonA} />
          <View pointerEvents="none" style={styles.cardCarbonB} />
          <View style={styles.cardHeader}>
            <View style={styles.headerWithIcon}>
              <View style={styles.headerIcon}>
                <Ionicons name="globe-outline" size={17} color={theme.accentSoft} />
              </View>
              <View>
                <Text style={[styles.premiumHomeTitle, { color: theme.accentSoft }]}>OPPORTUNITÉS DU JOUR</Text>
                <Text style={[styles.cardMuted, { color: theme.textMuted }]}>Sport, marchés et patrimoine.</Text>
              </View>
            </View>
          </View>
          {totalOpportunities === 0 ? (
            <Text style={[styles.opportunityEmpty, { color: theme.textMuted }]}>Aucune opportunité aujourd'hui.</Text>
          ) : (
            <View style={styles.opportunityRows}>
              {opportunityGroups.map((group) => (
                <View key={group.label} style={styles.opportunityRow}>
                  <View style={styles.opportunityIcon}>
                    <Ionicons name={group.icon} size={16} color={theme.accentSoft} />
                  </View>
                  <Text style={[styles.opportunityLabel, { color: theme.text }]}>{group.label}</Text>
                  <Text style={[styles.opportunityValue, { color: theme.accentSoft }]}>
                    {group.count === 0
                      ? "Aucune opportunité"
                      : `${group.count} ${group.suffix}${group.count > 1 ? "s" : ""}`}
                  </Text>
                </View>
              ))}
            </View>
          )}
          </GlassCard>
        </Pressable>

        <GlassCard style={[styles.performancePanel, styles.cardDepth]}>
          <View pointerEvents="none" style={[styles.progressAura, { backgroundColor: theme.glowSoft, shadowColor: theme.accentSoft }]} />
          <View pointerEvents="none" style={styles.cardReflection} />
          <View pointerEvents="none" style={styles.cardCarbonA} />
          <View pointerEvents="none" style={styles.cardCarbonB} />
          <LinearGradient colors={theme.cardGradient} style={styles.progressCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerWithIcon}>
                <View style={styles.headerIconSmall}>
                  <Ionicons name="bar-chart" size={15} color={theme.accentSoft} />
                </View>
                <View style={styles.progressTitleBlock}>
                  <Text style={[styles.premiumHomeTitle, { color: theme.accentSoft }]}>PROGRESSION</Text>
                  <Text style={[styles.progressMuted, { color: theme.textMuted }]}>Ce mois</Text>
                  <Text style={[styles.progressMicro, { color: theme.textMuted }]}>Évolution réelle locale</Text>
                </View>
              </View>
              <Text style={[styles.positive, { color: stats.roi >= 0 ? theme.success : theme.danger, textShadowColor: stats.roi >= 0 ? `${theme.success}22` : `${theme.danger}22` }]}>{formatPercent(stats.roi)}</Text>
            </View>
            <ProgressLine progress={progressDraw} curve={bankrollCurve} />
          </LinearGradient>

          <View style={[styles.financialGrid, { borderTopColor: theme.line, backgroundColor: theme.surface }]}>
            {financialStats.map((item) => (
              <View key={item.label} style={[styles.financialTile, { borderBottomColor: theme.line, borderRightColor: theme.line }]}>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>{item.label}</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: item.tone === "danger" ? theme.danger : item.tone === "neutral" ? theme.text : theme.success },
                    item.tone === "neutral" && styles.statValueNeutral
                  ]}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={[styles.intelligenceCard, styles.cardDepth]}>
          <View pointerEvents="none" style={styles.cardInnerHalo} />
          <View pointerEvents="none" style={styles.cardReflection} />
          <View pointerEvents="none" style={styles.cardCarbonA} />
          <View pointerEvents="none" style={styles.cardCarbonB} />
          <View style={styles.cardHeader}>
            <Text style={[styles.premiumHomeTitle, { color: theme.accentSoft }]}>ASCENSION INTELLIGENCE</Text>
          </View>
          <Text style={[styles.intelligenceText, { color: theme.textMuted }]}>L'IA analyse en permanence :</Text>
          <View style={styles.intelligenceGrid}>
            {["Sport", "Marchés", "Patrimoine", "Objectifs"].map((item) => (
              <View key={item} style={[styles.intelligenceItem, { borderColor: theme.line, backgroundColor: theme.overlay }]}>
                <Ionicons name="sparkles-outline" size={15} color={theme.accentSoft} />
                <Text style={[styles.intelligenceItemText, { color: theme.text }]}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.intelligenceBadge, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
            <Text style={[styles.comingSoon, { color: theme.accentSoft }]}>Mode local actif</Text>
          </View>
        </GlassCard>

        <Text style={styles.footerBrand}>{brand.name.toUpperCase()} · {brand.motto.toUpperCase()}</Text>
      </Animated.View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  animatedContent: {
    gap: 18,
    paddingTop: 0
  },
  topBar: {
    minHeight: 124,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  logoBox: {
    width: 210,
    height: 136,
    alignItems: "center",
    justifyContent: "center"
  },
  logoHalo: {
    position: "absolute",
    width: 146,
    height: 146,
    borderRadius: radii.pill,
    backgroundColor: "rgba(228, 169, 69, 0.18)",
    shadowColor: colors.gold,
    shadowOpacity: 0.36,
    shadowRadius: 44,
    shadowOffset: { width: 0, height: 0 }
  },
  logoParticle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.goldSoft,
    shadowColor: colors.gold,
    shadowOpacity: 0.32,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 }
  },
  logoParticleOne: {
    top: 38,
    left: 62
  },
  logoParticleTwo: {
    top: 56,
    right: 58
  },
  logoParticleThree: {
    bottom: 34,
    left: 92
  },
  cardDepth: {
    shadowColor: "#E2B45C",
    shadowOpacity: 0.16,
    shadowRadius: 46,
    shadowOffset: { width: 0, height: 26 },
    elevation: 8
  },
  cardInnerHalo: {
    position: "absolute",
    top: -110,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 224, 142, 0.070)",
    shadowColor: champagneLight,
    shadowOpacity: 0.16,
    shadowRadius: 82,
    shadowOffset: { width: 0, height: 0 }
  },
  cardReflection: {
    position: "absolute",
    top: 0,
    left: 22,
    right: 22,
    height: 2,
    backgroundColor: "rgba(255, 247, 216, 0.30)",
    shadowColor: champagneLight,
    shadowOpacity: 0.34,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }
  },
  cardCarbonA: {
    position: "absolute",
    top: 34,
    left: -46,
    width: 420,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.028)",
    transform: [{ rotate: "-18deg" }]
  },
  cardCarbonB: {
    position: "absolute",
    bottom: 28,
    right: -58,
    width: 420,
    height: 1,
    backgroundColor: "rgba(240, 184, 78, 0.044)",
    transform: [{ rotate: "18deg" }]
  },
  greetingRow: {
    minHeight: 52,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 229, 166, 0.32)",
    backgroundColor: "rgba(10, 10, 10, 0.70)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.gold,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 }
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs
  },
  greeting: {
    color: colors.white,
    fontSize: 25,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.titleTracking,
    lineHeight: 31
  },
  subtitle: {
    color: "#D4D0C8",
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    letterSpacing: 0.08,
    lineHeight: 20
  },
  ascensionHeroCard: {
    minHeight: 286,
    borderWidth: 1,
    borderColor: "rgba(255, 229, 166, 0.34)",
    borderRadius: 22,
    padding: 22,
    gap: 16,
    overflow: "hidden",
    backgroundColor: "rgba(7, 8, 10, 0.76)"
  },
  heroWarmGlow: {
    position: "absolute",
    top: -92,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    shadowColor: champagneLight,
    shadowOpacity: 0.26,
    shadowRadius: 68,
    shadowOffset: { width: 0, height: 0 }
  },
  heroHeaderLine: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  heroMoment: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  heroDate: {
    color: "#E6DDD0",
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.12,
    textTransform: "capitalize"
  },
  heroTimeRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  heroTime: {
    color: colors.white,
    fontSize: 34,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: -0.2,
    lineHeight: 40
  },
  heroUniverseName: {
    fontSize: 15,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.2
  },
  heroMotivationBlock: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4
  },
  heroMotivationLabel: {
    color: "#D5D0C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.4,
    lineHeight: 17,
    textTransform: "uppercase"
  },
  heroMotivationText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.titleTracking,
    lineHeight: 22,
    textAlign: "right"
  },
  indexPanel: {
    minHeight: 148,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    alignItems: "center",
    flexDirection: "row",
    gap: 18,
    padding: 18,
    overflow: "hidden"
  },
  indexCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 8,
    backgroundColor: "rgba(0,0,0,0.34)",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.28,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 0 }
  },
  indexValue: {
    color: colors.white,
    fontSize: 38,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: -0.5,
    lineHeight: 42
  },
  indexSuffix: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.2
  },
  indexBadge: {
    marginTop: 4,
    borderRadius: radii.pill,
    overflow: "hidden",
    color: "#F7EAD1",
    backgroundColor: "rgba(0,0,0,0.30)",
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.15,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  indexCopy: {
    flex: 1,
    gap: 8
  },
  indexTitle: {
    color: colors.white,
    fontSize: 20,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.titleTracking,
    lineHeight: 26
  },
  indexSubtitle: {
    color: "#E5D6C4",
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 19
  },
  indexBulletRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  indexBulletText: {
    color: "#F3EEE6",
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    lineHeight: 18
  },
  heroTrend: {
    opacity: 0.82,
    transform: [{ rotate: "-8deg" }]
  },
  opportunityCard: {
    minHeight: 148,
    padding: 22,
    gap: 20
  },
  headerWithIcon: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    gap: 13
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 229, 166, 0.30)",
    backgroundColor: "rgba(255, 237, 190, 0.075)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.gold,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 }
  },
  headerIconSmall: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: "rgba(244, 201, 108, 0.12)",
    alignItems: "center",
    justifyContent: "center"
  },
  opportunityRows: {
    gap: spacing.sm
  },
  opportunityRow: {
    minHeight: 42,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.095)",
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm
  },
  opportunityIcon: {
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 237, 190, 0.080)",
    alignItems: "center",
    justifyContent: "center"
  },
  opportunityLabel: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.labelTracking
  },
  opportunityValue: {
    color: colors.goldSoft,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.labelTracking
  },
  opportunityEmpty: {
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.095)",
    backgroundColor: "rgba(255, 255, 255, 0.030)",
    color: "#A9A9A9",
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 20,
    paddingHorizontal: 15,
    paddingVertical: 13
  },
  missionCard: {
    minHeight: 214,
    borderWidth: 1,
    borderColor: "rgba(255, 229, 166, 0.30)",
    borderRadius: 18,
    padding: 24,
    overflow: "hidden",
    gap: 17,
    backgroundColor: "rgba(6, 6, 6, 0.82)"
  },
  missionValidatedCard: {
    borderColor: "rgba(77, 255, 107, 0.24)",
    shadowColor: colors.success,
    shadowOpacity: 0.08,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 }
  },
  confettiLayer: {
    position: "absolute",
    top: 38,
    right: 28,
    width: 72,
    height: 54
  },
  confettiDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.success
  },
  confettiOne: {
    top: 8,
    left: 8
  },
  confettiTwo: {
    top: 0,
    right: 22,
    backgroundColor: colors.goldSoft
  },
  confettiThree: {
    bottom: 8,
    right: 4
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  missionTitle: {
    color: colors.white,
    fontSize: 22,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.titleTracking,
    lineHeight: 28
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.titleTracking,
    lineHeight: 22
  },
  cardTitleLarge: {
    color: colors.text,
    fontSize: 22,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.titleTracking,
    lineHeight: 28
  },
  cardMuted: {
    color: "#C9C4BA",
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    letterSpacing: 0.08,
    lineHeight: 20
  },
  goldCount: {
    color: champagneLight,
    fontSize: 26,
    fontFamily: typography.fontFamily,
    fontWeight: "800",
    letterSpacing: 0.35,
    textShadowColor: "rgba(244, 201, 108, 0.56)",
    textShadowRadius: 18
  },
  counterShell: {
    minWidth: 96,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "rgba(255, 229, 166, 0.46)",
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.gold,
    shadowOpacity: 0.32,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 }
  },
  counterShellDone: {
    borderColor: "rgba(99, 230, 162, 0.34)",
    shadowColor: colors.success
  },
  missionText: {
    color: colors.white,
    fontSize: 21,
    lineHeight: 31,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.titleTracking
  },
  progressTrack: {
    height: 7,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.065)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 229, 166, 0.15)"
  },
  progressFillClip: {
    height: "100%",
    borderRadius: radii.pill,
    overflow: "hidden",
    shadowColor: colors.gold,
    shadowOpacity: 0.38,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }
  },
  progressFill: {
    flex: 1,
    borderRadius: radii.pill,
    overflow: "hidden"
  },
  progressShine: {
    position: "absolute",
    top: 1,
    left: 8,
    right: 8,
    height: 1,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.70)"
  },
  validCount: {
    color: colors.success
  },
  missionAction: {
    alignSelf: "flex-start",
    marginTop: 2
  },
  disciplineCard: {
    minHeight: 238,
    borderWidth: 1,
    borderColor: "rgba(255, 229, 166, 0.30)",
    borderRadius: 18,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    backgroundColor: "rgba(6, 6, 6, 0.82)"
  },
  disciplineAura: {
    position: "absolute",
    right: 18,
    top: 18,
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: "rgba(99, 230, 162, 0.060)",
    shadowColor: champagneGold,
    shadowOpacity: 0.22,
    shadowRadius: 64,
    shadowOffset: { width: 0, height: 0 }
  },
  disciplineCopy: {
    flex: 1,
    gap: 10
  },
  weekRow: {
    flexDirection: "row",
    gap: 15
  },
  disciplineMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  metaPill: {
    borderWidth: 1,
    borderColor: "rgba(120, 236, 180, 0.34)",
    borderRadius: radii.pill,
    color: emeraldGlow,
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.labelTracking,
    paddingHorizontal: 12,
    paddingVertical: 5
  },
  metaPillXp: {
    borderColor: "rgba(110, 168, 255, 0.30)",
    color: colors.blue
  },
  streakLine: {
    color: "#F0EEE9",
    fontSize: 15,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.05,
    lineHeight: 21
  },
  dayItem: {
    alignItems: "center",
    gap: 5
  },
  dayDot: {
    width: 16,
    height: 16,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.070)"
  },
  dayDotDone: {
    borderColor: "rgba(99, 230, 162, 0.42)",
    backgroundColor: colors.success,
    shadowColor: colors.success,
    shadowOpacity: 0.42,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }
  },
  dayDotGold: {
    borderColor: "rgba(244, 201, 108, 0.55)",
    backgroundColor: champagneGold,
    shadowColor: champagneGold
  },
  dayDotMissed: {
    borderColor: "rgba(255, 107, 107, 0.42)",
    backgroundColor: colors.danger,
    shadowColor: colors.danger,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 }
  },
  dayLabel: {
    color: "#D9D3C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    letterSpacing: 0.16
  },
  ringWrap: {
    width: 148,
    height: 148,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill
  },
  ringGlass: {
    position: "absolute",
    width: 148,
    height: 148,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 240, 184, 0.22)",
    shadowColor: champagneLight,
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 }
  },
  ringHalo: {
    position: "absolute",
    width: 176,
    height: 176,
    borderRadius: radii.pill,
    backgroundColor: "rgba(14, 122, 88, 0.070)",
    shadowColor: champagneGold,
    shadowOpacity: 0.45,
    shadowRadius: 44,
    shadowOffset: { width: 0, height: 0 }
  },
  ringInnerShadow: {
    position: "absolute",
    width: 98,
    height: 98,
    borderRadius: radii.pill,
    backgroundColor: "rgba(0, 0, 0, 0.32)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)"
  },
  ringText: {
    position: "absolute",
    color: colors.text,
    fontSize: 38,
    fontFamily: typography.fontFamily,
    fontWeight: "800",
    letterSpacing: -0.2,
    textShadowColor: "rgba(244, 201, 108, 0.26)",
    textShadowRadius: 14
  },
  ringCaption: {
    position: "absolute",
    bottom: 45,
    color: champagneGold,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: 0.9
  },
  goalCard: {
    minHeight: 176,
    borderWidth: 1,
    borderColor: "rgba(255, 229, 166, 0.30)",
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingTop: 19,
    paddingBottom: 17,
    gap: 9,
    backgroundColor: "rgba(6, 6, 6, 0.82)"
  },
  goalAura: {
    position: "absolute",
    right: -18,
    bottom: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 224, 142, 0.055)",
    shadowColor: colors.gold,
    shadowOpacity: 0.28,
    shadowRadius: 48,
    shadowOffset: { width: 0, height: 0 }
  },
  goalSectionTitle: {
    color: colors.white,
    fontSize: 21,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.titleTracking,
    lineHeight: 27
  },
  goalTerm: {
    color: "#C8C8C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 18
  },
  goalLine: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  goalTitle: {
    color: colors.white,
    fontSize: 15,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.08,
    lineHeight: 21
  },
  goalAmount: {
    color: "#C8C8C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 18
  },
  goalInsight: {
    color: colors.violet,
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.labelTracking,
    lineHeight: 20
  },
  goalEstimate: {
    color: "#C8C8C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 18
  },
  performancePanel: {
    overflow: "hidden"
  },
  progressAura: {
    position: "absolute",
    right: 8,
    top: 30,
    width: 180,
    height: 130,
    borderRadius: 90,
    backgroundColor: "rgba(255, 224, 142, 0.055)",
    shadowColor: champagneLight,
    shadowOpacity: 0.30,
    shadowRadius: 54,
    shadowOffset: { width: 0, height: 0 }
  },
  progressCard: {
    minHeight: 150,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: spacing.xs,
    gap: 8
  },
  chartReveal: {
    width: "100%"
  },
  progressTitleBlock: {
    gap: 7
  },
  progressTitle: {
    color: colors.white,
    fontSize: 21,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.titleTracking,
    lineHeight: 27
  },
  premiumHomeTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 2,
    lineHeight: 20,
    textTransform: "uppercase"
  },
  progressMuted: {
    color: "#C8C8C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 18
  },
  progressMicro: {
    color: "#C8C8C8",
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    letterSpacing: 0.05,
    lineHeight: 16
  },
  positive: {
    color: colors.success,
    fontSize: 22,
    fontFamily: typography.fontFamily,
    fontWeight: "800",
    letterSpacing: -0.05,
    textShadowColor: "rgba(77, 255, 107, 0.10)",
    textShadowRadius: 8
  },
  financialGrid: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.075)",
    backgroundColor: "rgba(3, 3, 3, 0.74)",
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden"
  },
  financialTile: {
    width: "33.333%",
    minHeight: 74,
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.045)",
    borderRightColor: "rgba(255, 255, 255, 0.055)"
  },
  statLabel: {
    color: "#C8C8C8",
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 17
  },
  statValue: {
    color: colors.success,
    fontSize: 17,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: 0.05,
    textShadowColor: "rgba(77, 255, 107, 0.10)",
    textShadowRadius: 8
  },
  statValueNeutral: {
    color: colors.white,
    textShadowColor: "rgba(228, 169, 69, 0.12)",
    textShadowRadius: 8
  },
  statValueDanger: {
    color: colors.danger
  },
  intelligenceCard: {
    minHeight: 134,
    padding: 22,
    gap: 14
  },
  intelligenceTitle: {
    color: colors.white,
    fontSize: 17,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.titleTracking,
    lineHeight: 23
  },
  comingSoon: {
    color: colors.gold,
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.eyebrowTracking,
    textTransform: "uppercase"
  },
  intelligenceText: {
    color: "#D6D6D6",
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 19
  },
  intelligenceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  intelligenceItem: {
    minHeight: 34,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm
  },
  intelligenceBadge: {
    alignSelf: "flex-start",
    minHeight: 28,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 229, 166, 0.34)",
    backgroundColor: "rgba(255, 237, 190, 0.070)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  intelligenceItemText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.labelTracking
  },
  footerBrand: {
    color: colors.gold,
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: 1.3,
    textAlign: "center",
    marginTop: spacing.sm
  }
});
