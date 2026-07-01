import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

import { colors } from "@/constants/theme";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";

export default function TabsLayout() {
  const { theme } = useAscensionTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        animation: "fade",
        tabBarLabelStyle: styles.label,
        tabBarIconStyle: styles.icon,
        tabBarStyle: [
          styles.tabBar,
          {
            borderTopColor: theme.accentBorder,
            backgroundColor: theme.isLight ? "rgba(255, 255, 255, 0.80)" : "rgba(3, 3, 3, 0.72)",
            shadowColor: theme.accent
          }
        ],
        tabBarBackground: () => <BlurView intensity={44} tint="dark" style={StyleSheet.absoluteFill} />
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" color={color} size={20} />
        }}
      />
      <Tabs.Screen
        name="ticket"
        options={{
          title: "Pronostics",
          tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" color={color} size={20} />
        }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: "Marchés",
          tabBarIcon: ({ color }) => <Ionicons name="trending-up-outline" color={color} size={20} />
        }}
      />
      <Tabs.Screen
        name="ascension-ai-market"
        options={{
          title: "AI Market",
          tabBarIcon: ({ color }) => <Ionicons name="sparkles-outline" color={color} size={20} />
        }}
      />
      <Tabs.Screen
        name="academy"
        options={{
          title: "Academy",
          tabBarIcon: ({ color }) => <Ionicons name="book-outline" color={color} size={20} />
        }}
      />
      <Tabs.Screen
        name="discipline"
        options={{
          title: "Objectifs",
          tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle-outline" color={color} size={20} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" color={color} size={20} />
        }}
      />
      <Tabs.Screen
        name="betting"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    minHeight: 74,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 229, 166, 0.24)",
    backgroundColor: "rgba(3, 3, 3, 0.72)",
    shadowColor: colors.gold,
    shadowOpacity: 0.12,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: -10 }
  },
  icon: {
    marginTop: 3
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 1
  }
});
