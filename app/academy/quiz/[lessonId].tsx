import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard } from "@/components/GlassCard";
import { PremiumButton } from "@/components/PremiumButton";
import { colors, radii, spacing } from "@/constants/theme";
import { AcademyEngine, AcademyEngineState, AcademyModule } from "@/engine/academy";

export default function AcademyQuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string; moduleId?: string }>();
  const [academyState, setAcademyState] = useState<AcademyEngineState | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const moduleId = Array.isArray(params.moduleId) ? params.moduleId[0] : params.moduleId;

  useEffect(() => {
    let active = true;

    async function loadState() {
      const nextState = await AcademyEngine.getState();
      if (active) {
        setAcademyState(nextState);
      }
    }

    loadState();

    return () => {
      active = false;
    };
  }, []);

  const module = useMemo(
    () => academyState?.modules.find((item) => item.id === moduleId) ?? null,
    [academyState, moduleId]
  );

  const lesson = useMemo(
    () => academyState?.modules.find((item) => item.id === moduleId)?.lessons.find((item) => item.id === lessonId) ?? null,
    [academyState, lessonId, moduleId]
  );
  const quiz = module?.quiz;
  const questions = lesson?.quizQuestions?.length ? lesson.quizQuestions : quiz?.questions ?? [];
  const currentQuestion = questions[questionIndex] ?? null;
  const totalQuestions = questions.length;
  const progress = totalQuestions ? ((questionIndex + 1) / totalQuestions) * 100 : 0;
  const isCompleted = Boolean(quiz?.status === "passed");
  const finalScore = totalQuestions
    ? Math.round((answers.filter((answer, index) => answer === questions[index]?.correctOptionIndex).length / totalQuestions) * 100)
    : 0;

  function handleSelect(optionIndex: number) {
    if (isSubmitted) {
      return;
    }

    setSelectedOption(optionIndex);
    setAnswers((previous) => {
      const next = [...previous];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  function handleNext() {
    if (selectedOption === null || !currentQuestion) {
      Alert.alert("Réponse manquante", "Choisis une option avant de continuer.");
      return;
    }

    setIsSubmitted(true);
  }

  function handleContinue() {
    if (!currentQuestion) {
      return;
    }

    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((previous) => previous + 1);
      setSelectedOption(answers[questionIndex + 1] ?? null);
      setIsSubmitted(false);
      return;
    }

    if (finalScore >= (quiz?.requiredScore ?? 80)) {
      setSuccessMessage(lesson?.successMessage ?? "Bravo ! Ta compréhension est solidement acquise.");
    } else {
      setSuccessMessage(null);
    }
    setShowSummary(true);
  }

  function resetQuiz() {
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowSummary(false);
    setAnswers([]);
  }

  async function validateLesson() {
    if (!moduleId || !lessonId) {
      return;
    }

    if (answers.some((answer) => answer === null)) {
      Alert.alert("Quiz incomplet", "Réponds à toutes les questions avant de valider la leçon.");
      return;
    }

    setIsValidating(true);
    const nextState = await AcademyEngine.submitQuiz(moduleId, answers as number[]);
    setAcademyState(nextState);
    setIsValidating(false);

    const nextModule = nextState.modules.find((item) => item.id === moduleId);
    if (nextModule?.status === "completed") {
      Alert.alert("Leçon validée", "Le quiz est validé et la progression Academy est sauvegardée.");
      router.back();
    }
  }

  return (
    <AppScreen>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={18} color={colors.white} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Quiz Academy</Text>
          <Text style={styles.heading}>{quiz?.title ?? "Quiz"}</Text>
        </View>
      </View>

      <GlassCard style={styles.card}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>Question {questionIndex + 1}/{totalQuestions}</Text>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>

        {currentQuestion ? (
          <>
            <Text style={styles.question}>{currentQuestion.question}</Text>
            <View style={styles.options}>
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = selectedOption === optionIndex;
                const isCorrect = isSubmitted && optionIndex === currentQuestion.correctOptionIndex;
                const isWrong = isSubmitted && isSelected && optionIndex !== currentQuestion.correctOptionIndex;

                return (
                  <Pressable
                    key={`${currentQuestion.id}-${optionIndex}`}
                    onPress={() => handleSelect(optionIndex)}
                    style={[styles.option, isSelected && styles.optionSelected, isCorrect && styles.optionCorrect, isWrong && styles.optionWrong]}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected, isCorrect && styles.optionTextCorrect, isWrong && styles.optionTextWrong]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.feedbackBox}>
              {!isSubmitted ? (
                <Text style={styles.feedbackText}>Sélectionne la bonne réponse pour continuer.</Text>
              ) : (
                <Text style={styles.feedbackText}>
                  {selectedOption === currentQuestion.correctOptionIndex
                    ? "Bonne réponse !"
                    : "La bonne réponse a été mise en évidence."}
                </Text>
              )}
            </View>

            {!isSubmitted ? (
              <PremiumButton label="Valider la réponse" icon="checkmark-circle" onPress={handleNext} />
            ) : (
              <PremiumButton label={questionIndex + 1 < totalQuestions ? "Question suivante" : "Voir le résultat"} icon="arrow-forward" onPress={handleContinue} />
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>Aucune question disponible pour ce quiz.</Text>
        )}
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Résultat du parcours</Text>
        <Text style={styles.summary}>
          {isCompleted ? "Ce module est déjà validé." : showSummary ? `Score final : ${finalScore}%` : `Score actuel : ${finalScore}%`}
        </Text>
        {showSummary && successMessage ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Bravo</Text>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}
        {showSummary ? (
          <PremiumButton
            label="Valider la leçon"
            icon="school-outline"
            onPress={validateLesson}
            disabled={isValidating || isCompleted || totalQuestions === 0 || answers.some((answer) => answer === null)}
          />
        ) : (
          <PremiumButton label="Recommencer" icon="refresh-outline" onPress={resetQuiz} />
        )}
      </GlassCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  headerCopy: {
    flex: 1,
    gap: 4
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  heading: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700"
  },
  card: {
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  progressText: {
    color: "#D6D6D6",
    fontSize: 12,
    fontWeight: "600"
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  fill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.gold
  },
  question: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24
  },
  options: {
    gap: spacing.sm
  },
  option: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  optionSelected: {
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(228, 169, 69, 0.12)"
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: "rgba(28, 184, 98, 0.16)"
  },
  optionWrong: {
    borderColor: "#FF7A59",
    backgroundColor: "rgba(255, 122, 89, 0.16)"
  },
  optionText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20
  },
  optionTextSelected: {
    color: colors.white,
    fontWeight: "700"
  },
  optionTextCorrect: {
    color: colors.white,
    fontWeight: "700"
  },
  optionTextWrong: {
    color: colors.white,
    fontWeight: "700"
  },
  feedbackBox: {
    minHeight: 40,
    justifyContent: "center"
  },
  feedbackText: {
    color: "#D6D6D6",
    fontSize: 13,
    lineHeight: 18
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700"
  },
  summary: {
    color: "#D6D6D6",
    fontSize: 14,
    lineHeight: 20
  },
  emptyText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20
  },
  successBox: {
    borderWidth: 1,
    borderColor: "rgba(84, 221, 132, 0.40)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(84, 221, 132, 0.10)"
  },
  successTitle: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4
  },
  successText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18
  }
});
