import { Image, StyleSheet, Text, View } from "react-native";

import { brand } from "@/constants/brand";
import { colors, spacing } from "@/constants/theme";

const logoSource = require("../../assets/ascension-logo-transparent.png");

type AscensionLogoProps = {
  compact?: boolean;
  markOnly?: boolean;
};

export function AscensionLogo({ compact = false, markOnly = false }: AscensionLogoProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <Image
        source={logoSource}
        resizeMode="contain"
        style={[styles.logoImage, compact && styles.logoImageCompact, markOnly && styles.logoImageMarkOnly]}
      />
      {!markOnly ? (
        <View style={styles.copy}>
          {!compact ? <Text style={styles.motto}>{brand.motto}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md
  },
  compact: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  logoImage: {
    width: 230,
    height: 210
  },
  logoImageCompact: {
    width: 190,
    height: 160
  },
  logoImageMarkOnly: {
    width: 188,
    height: 158
  },
  copy: {
    gap: spacing.xs
  },
  motto: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center"
  }
});
