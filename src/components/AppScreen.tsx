import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from "react-native-svg";

import { colors, spacing } from "@/constants/theme";
import { AscensionTheme, useAscensionTheme } from "@/features/theme/ascensionTheme";

type AppScreenProps = PropsWithChildren<{
  scroll?: boolean;
  preserveScrollPosition?: boolean;
}>;

export function AppScreen({ children, scroll = true, preserveScrollPosition = false }: AppScreenProps) {
  const { theme } = useAscensionTheme();
  const twinkle = useRef(new Animated.Value(0)).current;
  const cosmicDrift = useRef(new Animated.Value(0)).current;
  const entrance = useRef(new Animated.Value(0)).current;
  const isCosmos = theme.id === "cosmos";
  const stars = useMemo<Array<{ left: `${number}%`; top: `${number}%`; opacity: number; size: number }>>(
    () => [
      { left: "24%", top: "7%", opacity: 0.09, size: 0.9 },
      { left: "34%", top: "11%", opacity: 0.14, size: 1 },
      { left: "43%", top: "8%", opacity: 0.12, size: 0.8 },
      { left: "57%", top: "9%", opacity: 0.16, size: 1 },
      { left: "66%", top: "13%", opacity: 0.12, size: 0.8 },
      { left: "75%", top: "11%", opacity: 0.09, size: 0.9 },
      { left: "16%", top: "15%", opacity: 0.06, size: 0.8 },
      { left: "82%", top: "16%", opacity: 0.07, size: 0.8 },
      { left: "29%", top: "18%", opacity: 0.08, size: 0.7 },
      { left: "71%", top: "19%", opacity: 0.08, size: 0.7 },
      { left: "48%", top: "20%", opacity: 0.06, size: 0.7 },
      { left: "10%", top: "28%", opacity: 0.035, size: 0.65 },
      { left: "90%", top: "30%", opacity: 0.035, size: 0.65 },
      { left: "38%", top: "36%", opacity: 0.030, size: 0.6 },
      { left: "61%", top: "42%", opacity: 0.030, size: 0.6 }
    ],
    []
  );
  const cosmosStars = useMemo<Array<{ left: `${number}%`; top: `${number}%`; opacity: number; size: number; delay: number }>>(
    () => [
      { left: "8%", top: "8%", opacity: 0.28, size: 1.2, delay: 0 },
      { left: "18%", top: "13%", opacity: 0.18, size: 0.9, delay: 1 },
      { left: "29%", top: "7%", opacity: 0.34, size: 1.4, delay: 2 },
      { left: "41%", top: "16%", opacity: 0.20, size: 0.8, delay: 0 },
      { left: "53%", top: "9%", opacity: 0.38, size: 1.1, delay: 1 },
      { left: "64%", top: "18%", opacity: 0.18, size: 0.7, delay: 2 },
      { left: "77%", top: "11%", opacity: 0.32, size: 1.3, delay: 0 },
      { left: "90%", top: "22%", opacity: 0.20, size: 0.8, delay: 1 },
      { left: "12%", top: "30%", opacity: 0.16, size: 0.7, delay: 2 },
      { left: "24%", top: "42%", opacity: 0.22, size: 1.0, delay: 0 },
      { left: "36%", top: "34%", opacity: 0.18, size: 0.8, delay: 1 },
      { left: "49%", top: "47%", opacity: 0.24, size: 1.1, delay: 2 },
      { left: "63%", top: "39%", opacity: 0.17, size: 0.8, delay: 0 },
      { left: "82%", top: "51%", opacity: 0.25, size: 1.0, delay: 1 },
      { left: "7%", top: "62%", opacity: 0.12, size: 0.7, delay: 2 },
      { left: "21%", top: "73%", opacity: 0.18, size: 0.9, delay: 0 },
      { left: "40%", top: "66%", opacity: 0.14, size: 0.7, delay: 1 },
      { left: "58%", top: "78%", opacity: 0.20, size: 1.1, delay: 2 },
      { left: "73%", top: "69%", opacity: 0.13, size: 0.8, delay: 0 },
      { left: "91%", top: "82%", opacity: 0.18, size: 0.9, delay: 1 }
    ],
    []
  );
  const cosmicDust = useMemo<Array<{ left: `${number}%`; top: `${number}%`; width: number; opacity: number }>>(
    () => [
      { left: "7%", top: "18%", width: 56, opacity: 0.10 },
      { left: "20%", top: "24%", width: 88, opacity: 0.08 },
      { left: "62%", top: "15%", width: 72, opacity: 0.10 },
      { left: "78%", top: "33%", width: 108, opacity: 0.07 },
      { left: "13%", top: "54%", width: 94, opacity: 0.06 },
      { left: "49%", top: "61%", width: 128, opacity: 0.06 },
      { left: "72%", top: "76%", width: 84, opacity: 0.07 }
    ],
    []
  );

  const entranceStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0]
        })
      }
    ]
  };
  const content = <Animated.View style={[styles.content, entranceStyle]}>{children}</Animated.View>;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true
    }).start();
  }, [entrance]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, {
          toValue: 1,
          duration: 7200,
          useNativeDriver: true
        }),
        Animated.timing(twinkle, {
          toValue: 0,
          duration: 7600,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [twinkle]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cosmicDrift, {
          toValue: 1,
          duration: 18000,
          useNativeDriver: true
        }),
        Animated.timing(cosmicDrift, {
          toValue: 0,
          duration: 21000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [cosmicDrift]);

  const twinkleStyle = {
    opacity: twinkle.interpolate({
      inputRange: [0, 1],
      outputRange: isCosmos ? [0.50, 0.92] : [0.38, 0.76]
    })
  };
  const moonPulseStyle = {
    opacity: twinkle.interpolate({
      inputRange: [0, 1],
      outputRange: [0.58, 0.78]
    }),
    transform: [
      {
        scale: twinkle.interpolate({
          inputRange: [0, 1],
          outputRange: [0.985, 1.015]
        })
      }
    ]
  };
  const cosmicDriftStyle = {
    transform: [
      {
        translateX: cosmicDrift.interpolate({
          inputRange: [0, 1],
          outputRange: [-8, 10]
        })
      },
      {
        translateY: cosmicDrift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 14]
        })
      }
    ]
  };

  return (
    <LinearGradient colors={theme.backgroundGradient} style={styles.root}>
      {isCosmos ? (
        <CosmosBackdrop
          theme={theme}
          stars={cosmosStars}
          dust={cosmicDust}
          twinkleStyle={twinkleStyle}
          moonPulseStyle={moonPulseStyle}
          cosmicDriftStyle={cosmicDriftStyle}
        />
      ) : (
        <>
          <LinearGradient
            pointerEvents="none"
            colors={[theme.glow, theme.glowSoft, "rgba(0, 0, 0, 0)"]}
            locations={[0, 0.28, 1]}
            style={styles.centralLight}
          />
          <LinearGradient
            pointerEvents="none"
            colors={[theme.glow, theme.glowSoft, "rgba(0, 0, 0, 0)"]}
            locations={[0, 0.28, 1]}
            style={[styles.lightBeam, styles.lightBeamLeft]}
          />
          <LinearGradient
            pointerEvents="none"
            colors={[theme.glow, theme.glowSoft, "rgba(0, 0, 0, 0)"]}
            locations={[0, 0.30, 1]}
            style={[styles.lightBeam, styles.lightBeamRight]}
          />
          <View pointerEvents="none" style={[styles.ambientHalo, { backgroundColor: theme.glowSoft, shadowColor: theme.accentSoft }]} />
          <View pointerEvents="none" style={[styles.logoDustHalo, { backgroundColor: theme.glowSoft, shadowColor: theme.accent }]} />
          <View pointerEvents="none" style={styles.carbonLayer}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={`carbon-a-${index}`} style={[styles.carbonLine, styles.carbonLineA, { top: 260 + index * 196 }]} />
            ))}
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={`carbon-b-${index}`} style={[styles.carbonLine, styles.carbonLineB, { top: 372 + index * 196, backgroundColor: theme.line }]} />
            ))}
          </View>
          <Svg pointerEvents="none" style={styles.geometryLayer} viewBox="0 0 430 932" preserveAspectRatio="none">
            <Path d="M-42 142 C78 196 316 196 472 142" stroke={theme.accentBorder} strokeWidth="0.65" fill="none" />
            <Path d="M-30 143 C96 206 308 206 462 143" stroke={theme.line} strokeWidth="1.5" fill="none" opacity={0.42} />
            <Path d="M-40 224 L470 86" stroke={theme.accentBorder} strokeWidth="0.55" opacity={0.32} />
            <Path d="M-44 332 L470 654" stroke={theme.accentBorder} strokeWidth="0.55" opacity={0.32} />
            <Path d="M-36 646 L466 336" stroke={theme.accentBorder} strokeWidth="0.6" opacity={0.38} />
            <Path d="M-18 216 L448 464" stroke="rgba(255, 255, 255, 0.016)" strokeWidth="0.55" />
          </Svg>
          <View pointerEvents="none" style={[styles.arcSpark, { backgroundColor: theme.accent, shadowColor: theme.accent }]} />
          <Animated.View pointerEvents="none" style={[styles.starsLayer, twinkleStyle]}>
            {stars.map((star, index) => (
              <View
                key={`${star.left}-${index}`}
                style={[
                  styles.star,
                  {
                    left: star.left,
                    top: star.top,
                    opacity: star.opacity,
                    width: star.size,
                    height: star.size,
                    backgroundColor: theme.accent
                  }
                ]}
              />
            ))}
          </Animated.View>
        </>
      )}
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            maintainVisibleContentPosition={preserveScrollPosition ? { minIndexForVisible: 0 } : undefined}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

function CosmosBackdrop({
  theme,
  stars,
  dust,
  twinkleStyle,
  moonPulseStyle,
  cosmicDriftStyle
}: {
  theme: AscensionTheme;
  stars: Array<{ left: `${number}%`; top: `${number}%`; opacity: number; size: number; delay: number }>;
  dust: Array<{ left: `${number}%`; top: `${number}%`; width: number; opacity: number }>;
  twinkleStyle: object;
  moonPulseStyle: object;
  cosmicDriftStyle: object;
}) {
  return (
    <>
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(255,255,255,0.12)", "rgba(167, 139, 250, 0.060)", "rgba(0,0,0,0)"]}
        locations={[0, 0.28, 1]}
        style={styles.cosmosTopLight}
      />
      <View pointerEvents="none" style={[styles.cosmosNebula, styles.cosmosNebulaLeft]} />
      <View pointerEvents="none" style={[styles.cosmosNebula, styles.cosmosNebulaRight]} />
      <Animated.View pointerEvents="none" style={[styles.cosmosMoonWrap, moonPulseStyle]}>
        <LinearGradient
          colors={["rgba(255,255,255,0.82)", "rgba(233,213,255,0.46)", "rgba(139,92,246,0.08)"]}
          start={{ x: 0.18, y: 0.08 }}
          end={{ x: 0.92, y: 1 }}
          style={styles.cosmosMoon}
        />
        <View style={styles.cosmosMoonCraterLarge} />
        <View style={styles.cosmosMoonCraterSmall} />
      </Animated.View>
      <Svg pointerEvents="none" style={styles.geometryLayer} viewBox="0 0 430 932" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="cosmosGalaxy" cx="50%" cy="35%" r="65%">
            <Stop offset="0" stopColor="#E9D5FF" stopOpacity="0.18" />
            <Stop offset="0.38" stopColor="#8B5CF6" stopOpacity="0.07" />
            <Stop offset="1" stopColor="#02030A" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.18" />
            <Stop offset="0.54" stopColor="#C4B5FD" stopOpacity="0.08" />
            <Stop offset="1" stopColor="#02030A" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="332" cy="145" r="210" fill="url(#moonHalo)" />
        <Circle cx="92" cy="280" r="188" fill="url(#cosmosGalaxy)" />
        <Path d="M-38 128 C82 198 310 188 468 114" stroke={theme.accentBorder} strokeWidth="0.75" fill="none" opacity={0.52} />
        <Path d="M-44 212 C90 262 304 252 474 188" stroke="rgba(233,213,255,0.10)" strokeWidth="0.55" fill="none" />
        <Path d="M-46 594 C98 504 282 428 476 352" stroke="rgba(139,92,246,0.12)" strokeWidth="0.7" fill="none" />
        <Path d="M-30 786 C92 690 302 642 458 576" stroke="rgba(233,213,255,0.070)" strokeWidth="0.55" fill="none" />
      </Svg>
      <Animated.View pointerEvents="none" style={[styles.starsLayer, twinkleStyle]}>
        {stars.map((star, index) => (
          <View
            key={`cosmos-star-${index}`}
            style={[
              styles.cosmosStar,
              {
                left: star.left,
                top: star.top,
                opacity: star.opacity,
                width: star.size,
                height: star.size,
                backgroundColor: star.delay === 1 ? "#E9D5FF" : star.delay === 2 ? "#A78BFA" : "#FFFFFF"
              }
            ]}
          />
        ))}
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.cosmicDustLayer, cosmicDriftStyle]}>
        {dust.map((particle, index) => (
          <LinearGradient
            key={`cosmic-dust-${index}`}
            colors={["rgba(233,213,255,0)", "rgba(233,213,255,0.30)", "rgba(139,92,246,0)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              styles.cosmicDust,
              {
                left: particle.left,
                top: particle.top,
                width: particle.width,
                opacity: particle.opacity
              }
            ]}
          />
        ))}
        <View style={[styles.cosmicAsteroid, styles.cosmicAsteroidOne]} />
        <View style={[styles.cosmicAsteroid, styles.cosmicAsteroidTwo]} />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  centralLight: {
    position: "absolute",
    top: -12,
    alignSelf: "center",
    width: 168,
    height: 330,
    borderBottomLeftRadius: 84,
    borderBottomRightRadius: 84,
    opacity: 0.58
  },
  lightBeam: {
    position: "absolute",
    top: -8,
    width: 54,
    height: 280,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28
  },
  lightBeamLeft: {
    left: "43%",
  },
  lightBeamRight: {
    right: "42%",
  },
  ambientHalo: {
    position: "absolute",
    top: 68,
    alignSelf: "center",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(228, 169, 69, 0.046)",
    shadowColor: colors.goldSoft,
    shadowOpacity: 0.18,
    shadowRadius: 108,
    shadowOffset: { width: 0, height: 0 }
  },
  logoDustHalo: {
    position: "absolute",
    top: 124,
    alignSelf: "center",
    width: 360,
    height: 72,
    borderRadius: 180,
    backgroundColor: "rgba(228, 169, 69, 0.022)",
    shadowColor: colors.gold,
    shadowOpacity: 0.12,
    shadowRadius: 56,
    shadowOffset: { width: 0, height: 0 }
  },
  geometryLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.92
  },
  starsLayer: {
    ...StyleSheet.absoluteFillObject
  },
  carbonLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
    overflow: "hidden"
  },
  carbonLine: {
    position: "absolute",
    left: -210,
    width: 860,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.014)"
  },
  carbonLineA: {
    transform: [{ rotate: "-28deg" }]
  },
  carbonLineB: {
    backgroundColor: "rgba(228, 169, 69, 0.018)",
    transform: [{ rotate: "28deg" }]
  },
  star: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 214, 119, 0.76)"
  },
  arcSpark: {
    position: "absolute",
    top: 143,
    alignSelf: "center",
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255, 240, 176, 0.86)",
    shadowColor: colors.goldSoft,
    shadowOpacity: 0.62,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }
  },
  cosmosTopLight: {
    position: "absolute",
    top: -18,
    alignSelf: "center",
    width: 250,
    height: 360,
    borderBottomLeftRadius: 125,
    borderBottomRightRadius: 125,
    opacity: 0.64
  },
  cosmosNebula: {
    position: "absolute",
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: "rgba(139, 92, 246, 0.055)",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.18,
    shadowRadius: 96,
    shadowOffset: { width: 0, height: 0 }
  },
  cosmosNebulaLeft: {
    left: -160,
    top: 120
  },
  cosmosNebulaRight: {
    right: -170,
    top: 330,
    backgroundColor: "rgba(76, 29, 149, 0.070)"
  },
  cosmosMoonWrap: {
    position: "absolute",
    top: 86,
    right: -42,
    width: 184,
    height: 184,
    borderRadius: 92,
    shadowColor: "#E9D5FF",
    shadowOpacity: 0.34,
    shadowRadius: 72,
    shadowOffset: { width: 0, height: 0 }
  },
  cosmosMoon: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 92,
    opacity: 0.62
  },
  cosmosMoonCraterLarge: {
    position: "absolute",
    top: 46,
    left: 54,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(79, 70, 129, 0.14)"
  },
  cosmosMoonCraterSmall: {
    position: "absolute",
    right: 44,
    bottom: 52,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(79, 70, 129, 0.12)"
  },
  cosmosStar: {
    position: "absolute",
    borderRadius: 999,
    shadowColor: "#E9D5FF",
    shadowOpacity: 0.28,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 }
  },
  cosmicDustLayer: {
    ...StyleSheet.absoluteFillObject
  },
  cosmicDust: {
    position: "absolute",
    height: 1,
    borderRadius: 999,
    transform: [{ rotate: "-14deg" }]
  },
  cosmicAsteroid: {
    position: "absolute",
    width: 34,
    height: 14,
    borderRadius: 14,
    backgroundColor: "rgba(233, 213, 255, 0.055)",
    shadowColor: "#A78BFA",
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    transform: [{ rotate: "-22deg" }]
  },
  cosmicAsteroidOne: {
    top: "44%",
    left: "82%"
  },
  cosmicAsteroidTwo: {
    top: "72%",
    left: "9%",
    width: 24,
    height: 10,
    opacity: 0.68
  },
  safeArea: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 120
  },
  content: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
    gap: 24
  }
});
