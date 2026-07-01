import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";
import { AscensionThemeProvider } from "@/features/theme/ascensionTheme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <AscensionThemeProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </AscensionThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
