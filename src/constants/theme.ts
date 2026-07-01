import { Platform } from "react-native";

export const colors = {
  background: "#020202",
  backgroundSoft: "#090909",
  surface: "#101011",
  surfaceElevated: "#181819",
  border: "rgba(255, 255, 255, 0.10)",
  goldBorder: "rgba(228, 169, 69, 0.24)",
  text: "#F8F7F2",
  textMuted: "#A7A7AA",
  gold: "#F0B84E",
  goldSoft: "#FFF2B8",
  success: "#63E6A2",
  blue: "#6EA8FF",
  violet: "#B18CFF",
  danger: "#FF6B6B",
  white: "#FFFFFF",
  black: "#000000"
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999
};

export const typography = {
  fontFamily: Platform.select({
    ios: "Avenir Next",
    android: "sans-serif",
    web: "Inter, Manrope, Outfit, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
    default: "System"
  }),
  titleTracking: 0.25,
  labelTracking: 0.18,
  eyebrowTracking: 0.7
};

export const shadows = {
  premium: {
    shadowColor: colors.gold,
    shadowOpacity: 0.11,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 4
  }
};
