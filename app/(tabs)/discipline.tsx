import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard } from "@/components/GlassCard";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { PremiumButton } from "@/components/PremiumButton";
import { Section } from "@/components/Section";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { loadHabits, saveHabits } from "@/features/discipline/storage";
import { Habit } from "@/types/domain";

export default function DisciplineScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitTitle, setHabitTitle] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadHabits()
        .then(setHabits)
        .finally(() => setIsLoaded(true));
    }, [])
  );

  useEffect(() => {
    if (isLoaded) {
      saveHabits(habits);
    }
  }, [habits, isLoaded]);

  const completedToday = useMemo(
    () => habits.filter((habit) => habit.completedToday).length,
    [habits]
  );

  function toggleHabit(id: string) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== id) {
          return habit;
        }

        const completedTodayNext = !habit.completedToday;

        return {
          ...habit,
          completedToday: completedTodayNext,
          streak: completedTodayNext ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      })
    );
  }

  function addHabit() {
    const title = habitTitle.trim();

    if (!title) {
      return;
    }

    setHabits((currentHabits) => [
      {
        id: `h-${Date.now()}`,
        title,
        category: "focus",
        streak: 0,
        targetPerWeek: 5,
        completedToday: false
      },
      ...currentHabits
    ]);
    setHabitTitle("");
  }

  return (
    <AppScreen>
      <Header
        eyebrow="Discipline quotidienne"
        title="Habitudes"
        subtitle="Construis une base simple : une action claire, cochee chaque jour, suivie dans le temps."
      />

      <View style={styles.metricsGrid}>
        <MetricCard label="Completes" value={`${completedToday}/${habits.length}`} detail="aujourd'hui" tone="success" />
        <MetricCard
          label="Serie moyenne"
          value={`${habits.length > 0 ? Math.round(habits.reduce((total, habit) => total + habit.streak, 0) / habits.length) : 0} j`}
          detail="toutes habitudes"
        />
      </View>

      <Section title="Nouvelle habitude">
        <View style={styles.form}>
          <TextInput
            value={habitTitle}
            onChangeText={setHabitTitle}
            placeholder="Ex : lecture 20 minutes"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <PremiumButton label="Creer" icon="add" onPress={addHabit} />
        </View>
      </Section>

      <Section title="Routine du jour">
        <View style={styles.habitList}>
          {habits.map((habit) => (
            <Pressable key={habit.id} onPress={() => toggleHabit(habit.id)}>
              <GlassCard style={styles.habitRow}>
                <View style={[styles.status, habit.completedToday && styles.statusDone]}>
                  {habit.completedToday ? <Ionicons name="checkmark" size={16} color={colors.black} /> : null}
                </View>
                <View style={styles.habitCopy}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>
                  <Text style={styles.habitMeta}>{habit.targetPerWeek} fois/semaine</Text>
                </View>
                <View style={styles.streakPill}>
                  <Ionicons name="flame" size={14} color={colors.gold} />
                  <Text style={styles.streakText}>{habit.streak} j</Text>
                </View>
              </GlassCard>
            </Pressable>
          ))}
        </View>
      </Section>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  form: {
    gap: spacing.sm
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.lg,
    backgroundColor: "#050505",
    color: colors.white,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontWeight: "500"
  },
  habitList: {
    gap: spacing.sm
  },
  habitRow: {
    minHeight: 76,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  status: {
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(77, 255, 107, 0.32)",
    backgroundColor: "rgba(77, 255, 107, 0.06)",
    alignItems: "center",
    justifyContent: "center"
  },
  statusDone: {
    borderColor: colors.success,
    backgroundColor: colors.success,
    shadowColor: colors.success,
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4
  },
  habitCopy: {
    flex: 1,
    gap: 2
  },
  habitTitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.2
  },
  habitMeta: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "400"
  },
  streakPill: {
    minWidth: 68,
    minHeight: 34,
    borderRadius: radii.pill,
    backgroundColor: "rgba(228, 169, 69, 0.10)",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  streakText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600"
  }
});
