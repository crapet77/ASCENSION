import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard } from "@/components/GlassCard";
import { PremiumButton } from "@/components/PremiumButton";
import { colors, radii, spacing } from "@/constants/theme";
import { AcademyEngine, AcademyEngineState, AcademyLesson, AcademyModule } from "@/engine/academy";

export default function AcademyLessonDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string; moduleId?: string }>();
  const [academyState, setAcademyState] = useState<AcademyEngineState | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [showChallengeResult, setShowChallengeResult] = useState(false);
  const [firstQuizQuestionIndex, setFirstQuizQuestionIndex] = useState(0);
  const [firstQuizAnswers, setFirstQuizAnswers] = useState<number[]>([]);
  const [isFirstQuizSubmitted, setIsFirstQuizSubmitted] = useState(false);
  const [isFirstQuizFinished, setIsFirstQuizFinished] = useState(false);

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

  useEffect(() => {
    setChallengeAnswer("");
    setShowChallengeResult(false);
    setFirstQuizQuestionIndex(0);
    setFirstQuizAnswers([]);
    setIsFirstQuizSubmitted(false);
    setIsFirstQuizFinished(false);
  }, [lessonId]);

  const module = useMemo(
    () => academyState?.modules.find((item) => item.id === moduleId) ?? null,
    [academyState, moduleId]
  );
  const lesson = useMemo(
    () => module?.lessons.find((item) => item.id === lessonId) ?? null,
    [module, lessonId]
  );

  const lessonMeta = useMemo(() => getLessonContent(module, lesson), [module, lesson]);
  const isCompleted = lesson?.status === "completed";
  const isFirstDisciplineLesson = lesson?.title === "La discipline : le premier investissement";
  const isCompoundInterestLesson = lesson?.title === "Les intérêts composés";
  const isBudgetMissionLesson = lesson?.title === "Le budget : donne une mission à chaque euro";
  const isSafetySavingsLesson = lesson?.title === "L'épargne de sécurité : ton premier bouclier financier";
  const isBadDebtLesson = lesson?.title === "Les mauvaises dettes : l'argent qui travaille contre toi";
  const isGoodHabitsLesson = lesson?.title === "Les bonnes habitudes financières";
  const isBeginnerMistakesLesson = lesson?.title === "Les erreurs des débutants";
  const isTimePowerLesson = lesson?.title === "Le pouvoir du temps";
  const isFinalFoundationsLesson = lesson?.title === "Construire ton avenir financier";
  const isInvestmentLevelLesson = module?.id === "level-2-investment";
  const isPremiumInteractiveLesson = isInvestmentLevelLesson || isFirstDisciplineLesson || isCompoundInterestLesson || isBudgetMissionLesson || isSafetySavingsLesson || isBadDebtLesson || isGoodHabitsLesson || isBeginnerMistakesLesson || isTimePowerLesson || isFinalFoundationsLesson;
  const firstQuizQuestions = lesson?.quizQuestions ?? [];
  const firstQuizCurrentQuestion = firstQuizQuestions[firstQuizQuestionIndex] ?? null;
  const firstQuizSelectedOption = firstQuizAnswers[firstQuizQuestionIndex] ?? null;
  const firstQuizScore = firstQuizQuestions.length
    ? Math.round((firstQuizAnswers.filter((answer, index) => answer === firstQuizQuestions[index]?.correctOptionIndex).length / firstQuizQuestions.length) * 100)
    : 0;
  const chapterLessons = module?.lessons ?? [];
  const currentLessonIndex = chapterLessons.findIndex((item) => item.id === lessonId);
  const isLastLesson = currentLessonIndex >= 0 && currentLessonIndex === chapterLessons.length - 1;
  const nextActionLabel = isLastLesson ? "Commencer le quiz du chapitre" : "Leçon suivante →";
  const lessonNumber = useMemo(() => {
    const index = module?.lessons.findIndex((item) => item.id === lessonId);
    return index !== undefined && index >= 0 ? index + 1 : 1;
  }, [module, lessonId]);

  async function completeLesson() {
    if (!moduleId || !lessonId) {
      return;
    }

    setIsCompleting(true);
    const nextState = await AcademyEngine.completeLesson(moduleId, lessonId);
    setAcademyState(nextState);
    setIsCompleting(false);

    const nextModule = nextState.modules.find((item) => item.id === moduleId) ?? null;
    const nextLessons = nextModule?.lessons ?? [];

    if (isLastLesson) {
      router.push(`/academy/quiz/${lessonId}?moduleId=${moduleId}`);
      return;
    }

    const nextLessonIndex = nextLessons.findIndex((item) => item.id === lessonId);
    const nextLessonId = nextLessonIndex >= 0 && nextLessonIndex < nextLessons.length - 1 ? nextLessons[nextLessonIndex + 1]?.id : null;

    if (nextLessonId) {
      router.push(`/academy/lesson/${nextLessonId}?moduleId=${moduleId}`);
    }
  }

  function selectFirstQuizAnswer(optionIndex: number) {
    if (isFirstQuizSubmitted || isFirstQuizFinished) {
      return;
    }

    setFirstQuizAnswers((previous) => {
      const next = [...previous];
      next[firstQuizQuestionIndex] = optionIndex;
      return next;
    });
  }

  function advanceFirstQuiz() {
    if (!firstQuizCurrentQuestion) {
      return;
    }

    if (firstQuizSelectedOption === null) {
      Alert.alert("Réponse manquante", "Choisis une réponse avant de continuer.");
      return;
    }

    if (!isFirstQuizSubmitted) {
      setIsFirstQuizSubmitted(true);
      return;
    }

    if (firstQuizQuestionIndex + 1 < firstQuizQuestions.length) {
      setFirstQuizQuestionIndex((previous) => previous + 1);
      setIsFirstQuizSubmitted(false);
      return;
    }

    setIsFirstQuizFinished(true);
  }

  return (
    <AppScreen preserveScrollPosition>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={18} color={colors.white} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Leçon Academy</Text>
          <Text style={styles.heading}>{lesson?.title ?? "Leçon"}</Text>
        </View>
      </View>

      <GlassCard style={styles.card}>
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Ionicons name="book-outline" size={14} color={colors.gold} />
            <Text style={styles.metaText}>{`Leçon ${lessonNumber} / 10`}</Text>
          </View>
          <View style={styles.metaPill}>
            <Ionicons name="sparkles-outline" size={14} color={colors.gold} />
            <Text style={styles.metaText}>{lessonMeta.xpReward} XP</Text>
          </View>
        </View>

        {isFirstDisciplineLesson ? (
          <FirstDisciplineLessonLayout
            challengeAnswer={challengeAnswer}
            showChallengeResult={showChallengeResult}
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            onChallengeAnswerChange={setChallengeAnswer}
            onRevealChallenge={() => setShowChallengeResult(true)}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : isCompoundInterestLesson ? (
          <CompoundInterestLessonLayout
            challengeAnswer={challengeAnswer}
            showChallengeResult={showChallengeResult}
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            onChallengeAnswerChange={setChallengeAnswer}
            onRevealChallenge={() => setShowChallengeResult(true)}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : isBudgetMissionLesson ? (
          <BudgetMissionLessonLayout
            challengeAnswer={challengeAnswer}
            showChallengeResult={showChallengeResult}
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            onChallengeAnswerChange={setChallengeAnswer}
            onRevealChallenge={() => setShowChallengeResult(true)}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : isSafetySavingsLesson ? (
          <SafetySavingsLessonLayout
            challengeAnswer={challengeAnswer}
            showChallengeResult={showChallengeResult}
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            onChallengeAnswerChange={setChallengeAnswer}
            onRevealChallenge={() => setShowChallengeResult(true)}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : isBadDebtLesson ? (
          <BadDebtLessonLayout
            challengeAnswer={challengeAnswer}
            showChallengeResult={showChallengeResult}
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            onChallengeAnswerChange={setChallengeAnswer}
            onRevealChallenge={() => setShowChallengeResult(true)}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : isGoodHabitsLesson ? (
          <GoodHabitsLessonLayout
            challengeAnswer={challengeAnswer}
            showChallengeResult={showChallengeResult}
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            onChallengeAnswerChange={setChallengeAnswer}
            onRevealChallenge={() => setShowChallengeResult(true)}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : isBeginnerMistakesLesson ? (
          <BeginnerMistakesLessonLayout
            challengeAnswer={challengeAnswer}
            showChallengeResult={showChallengeResult}
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            onChallengeAnswerChange={setChallengeAnswer}
            onRevealChallenge={() => setShowChallengeResult(true)}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : isTimePowerLesson ? (
          <TimePowerLessonLayout
            challengeAnswer={challengeAnswer}
            showChallengeResult={showChallengeResult}
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            onChallengeAnswerChange={setChallengeAnswer}
            onRevealChallenge={() => setShowChallengeResult(true)}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : isFinalFoundationsLesson ? (
          <FinalFoundationsLessonLayout
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : isInvestmentLevelLesson ? (
          <InvestmentLessonLayout
            lessonMeta={lessonMeta}
            questions={firstQuizQuestions}
            questionIndex={firstQuizQuestionIndex}
            selectedOption={firstQuizSelectedOption}
            isQuizSubmitted={isFirstQuizSubmitted}
            isQuizFinished={isFirstQuizFinished}
            quizScore={firstQuizScore}
            isFinalLesson={isLastLesson}
            onSelectQuizAnswer={selectFirstQuizAnswer}
            onAdvanceQuiz={advanceFirstQuiz}
          />
        ) : (
          <PremiumLessonLayout lessonMeta={lessonMeta} />
        )}

        <View style={styles.actions}>
          {isPremiumInteractiveLesson && (isFirstQuizFinished || isCompleted) ? (
            <View style={styles.lessonCompletedPanel}>
              <View style={styles.xpBadge}>
                <Ionicons name="sparkles-outline" size={18} color={colors.gold} />
                <Text style={styles.xpBadgeText}>+20 XP</Text>
              </View>
              <Text style={styles.lessonCompletedTitle}>Leçon terminée</Text>
            </View>
          ) : null}
          <PremiumButton
            label={isCompleted ? "Leçon déjà validée" : isFirstDisciplineLesson ? "Continuer vers la Leçon 2" : isCompoundInterestLesson ? "Continuer vers la Leçon 3" : isBudgetMissionLesson ? "Continuer vers la Leçon 4" : isSafetySavingsLesson ? "Continuer vers la Leçon 5" : isBadDebtLesson ? "Continuer vers la Leçon 6" : isGoodHabitsLesson ? "Continuer vers la Leçon 7" : isBeginnerMistakesLesson ? "Continuer vers la Leçon 8" : isTimePowerLesson ? "Continuer vers la Leçon 9" : isFinalFoundationsLesson ? "Débloquer le Niveau 2" : isInvestmentLevelLesson && isLastLesson ? "Débloquer le Niveau 3" : isInvestmentLevelLesson ? `Continuer vers la Leçon ${lessonNumber + 1}` : nextActionLabel}
            icon="checkmark-circle"
            onPress={completeLesson}
            disabled={isCompleting || isCompleted || (isPremiumInteractiveLesson && !isFirstQuizFinished)}
          />
        </View>
      </GlassCard>

      {!isPremiumInteractiveLesson ? (
        <GlassCard style={styles.card}>
          <Text style={styles.sectionTitle}>Pourquoi c’est utile</Text>
          <Text style={styles.summary}>
            Cette leçon te donne une base solide pour prendre des décisions plus lucides, plus disciplinées et plus cohérentes avec ton plan.
          </Text>
        </GlassCard>
      ) : null}
    </AppScreen>
  );
}

type LessonMeta = ReturnType<typeof getLessonContent>;
type PremiumExampleRow = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
};

function PremiumLessonLayout({ lessonMeta }: { lessonMeta: LessonMeta }) {
  return (
    <>
      <Text style={styles.sectionTitle}>Introduction</Text>
      <Text style={styles.summary}>{lessonMeta.intro}</Text>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Exemple concret</Text>
        <Text style={styles.summary}>{lessonMeta.example}</Text>
        <View style={styles.exampleList}>
          {lessonMeta.exampleRows.map((row) => (
            <View key={`${row.label}-${row.value ?? ""}`} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                {row.value ? <Text style={styles.exampleAmount}>{row.value}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.summary}>{lessonMeta.frequentMistake}</Text>
      </View>

      <View style={styles.callout}>
        <Text style={styles.calloutLabel}>À retenir</Text>
        <Text style={styles.calloutText}>{lessonMeta.takeaway}</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Aujourd’hui</Text>
        <Text style={styles.summary}>{lessonMeta.dailyAction}</Text>
        <View style={styles.actionList}>
          {lessonMeta.actionItems.map((item) => (
            <Text key={item} style={styles.actionItem}>{`• ${item}`}</Text>
          ))}
        </View>
      </View>
    </>
  );
}

function FirstDisciplineLessonLayout({
  challengeAnswer,
  showChallengeResult,
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onChallengeAnswerChange,
  onRevealChallenge,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  challengeAnswer: string;
  showChallengeResult: boolean;
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onChallengeAnswerChange: (value: string) => void;
  onRevealChallenge: () => void;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const budgetRows: PremiumExampleRow[] = [
    { icon: "home-outline", label: "Dépenses obligatoires", value: "1 100 €" },
    { icon: "fast-food-outline", label: "Loisirs", value: "250 €" },
    { icon: "shield-checkmark-outline", label: "Épargne sécurité", value: "250 €" },
    { icon: "trending-up-outline", label: "Investissements", value: "400 €" }
  ];
  const missionItems = ["un café", "une baguette", "un abonnement", "un achat de 2 €"];
  const currentQuestion = questions[questionIndex] ?? null;
  const quizProgress = questions.length ? ((questionIndex + 1) / questions.length) * 100 : 0;

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>Introduction</Text>
        <Text style={styles.lessonHeroText}>
          Beaucoup pensent que les personnes riches ont commencé avec plus d'argent.{"\n\n"}
          Pourtant, ce n'est presque jamais le cas.{"\n\n"}
          Certaines gagnent 1 500 € par mois et deviennent financièrement libres.{"\n\n"}
          D'autres gagnent 10 000 € par mois et terminent endettées.{"\n\n"}
          Pourquoi ?{"\n\n"}
          Parce que l'argent ne crée pas les habitudes.{"\n\n"}
          Les habitudes créent l'argent.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 Deux amis, deux destins</Text>
        <View style={styles.duelGrid}>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Maximilien</Text>
            <Text style={styles.duelAmount}>2 000 €</Text>
            <Text style={styles.summary}>Il dépense tout.</Text>
          </View>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Martin</Text>
            <Text style={styles.duelAmount}>2 000 €</Text>
            <Text style={styles.summary}>Il met 10 € de côté chaque jour.</Text>
          </View>
        </View>
        <Text style={styles.summary}>
          Quelques années plus tard, Maximilien possède très peu d'épargne. Martin possède déjà un patrimoine important. Leur salaire était identique. Leur discipline ne l'était pas.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre</Text>
        <View style={styles.vsRow}>
          <View style={styles.vsCard}>
            <Text style={styles.vsLabel}>Motivation</Text>
            <Text style={styles.summary}>Une émotion.</Text>
          </View>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.vsCard}>
            <Text style={styles.vsLabel}>Discipline</Text>
            <Text style={styles.summary}>Une habitude.</Text>
          </View>
        </View>
        <Text style={styles.summary}>Les personnes qui réussissent construisent des routines.</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📊 Exemple concret</Text>
        <Text style={styles.summary}>Imagine une personne qui gagne 2 000 € par mois.</Text>
        <View style={styles.exampleList}>
          {budgetRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                <Text style={styles.exampleAmount}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.quoteText}>"J'investirai quand je gagnerai plus."</Text>
        <Text style={styles.summary}>
          Cette phrase est fausse parce qu'elle repousse l'habitude. Si tu ne sais pas diriger 10 €, tu risques de perdre le contrôle avec 1 000 € de plus.
        </Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.sectionTitle}>💬 Citation</Text>
        <Text style={styles.quoteText}>
          "Nous sommes ce que nous faisons de manière répétée.{"\n\n"}
          L'excellence n'est donc pas un acte mais une habitude."
        </Text>
        <Text style={styles.quoteAuthor}>— Aristote</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission Ascension</Text>
        <Text style={styles.summary}>Pendant les 7 prochains jours, note toutes tes dépenses.</Text>
        <View style={styles.actionList}>
          {missionItems.map((item) => (
            <Text key={item} style={styles.actionItem}>{`• ${item}`}</Text>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>Si tu économises seulement 5 € par jour, combien cela représente en un an ?</Text>
        <View style={styles.challengeRow}>
          <TextInput
            value={challengeAnswer}
            onChangeText={onChallengeAnswerChange}
            keyboardType="numeric"
            placeholder="Ta réponse"
            placeholderTextColor="rgba(255,255,255,0.42)"
            style={styles.challengeInput}
          />
          <Pressable onPress={onRevealChallenge} style={styles.challengeButton}>
            <Text style={styles.challengeButtonText}>Vérifier</Text>
          </Pressable>
        </View>
        {showChallengeResult ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultAmount}>1 825 €</Text>
            <Text style={styles.summary}>Une petite habitude quotidienne peut devenir une vraie base financière.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>
          "La liberté financière ne commence pas avec un gros salaire.{"\n\n"}
          Elle commence le jour où tu contrôles le premier euro que tu gagnes."
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>
    </>
  );
}

function CompoundInterestLessonLayout({
  challengeAnswer,
  showChallengeResult,
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onChallengeAnswerChange,
  onRevealChallenge,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  challengeAnswer: string;
  showChallengeResult: boolean;
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onChallengeAnswerChange: (value: string) => void;
  onRevealChallenge: () => void;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const timelineRows: PremiumExampleRow[] = [
    { icon: "time-outline", label: "Après 10 ans", value: "≈ 18 000 €" },
    { icon: "trending-up-outline", label: "Après 20 ans", value: "≈ 59 000 €" },
    { icon: "rocket-outline", label: "Après 30 ans", value: "≈ 149 000 €" }
  ];
  const missionItems = ["Calcule ton montant mensuel possible", "Même si ce n'est que 20 €", "Commence avant de chercher la perfection"];
  const challengeOptions = [
    { id: "A", label: "A", text: "Investir 500 € par mois dans 10 ans." },
    { id: "B", label: "B", text: "Investir 100 € par mois dès aujourd'hui." }
  ];

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>Le secret que les personnes riches connaissent.</Text>
        <Text style={styles.lessonHeroText}>
          Beaucoup pensent qu'il faut investir beaucoup pour devenir riche.{"\n\n"}
          En réalité, les personnes qui réussissent commencent souvent avec de petites sommes.{"\n\n"}
          Leur véritable avantage n'est pas l'argent.{"\n\n"}
          C'est le temps.{"\n\n"}
          Chaque année, leur argent travaille pendant qu'elles continuent leur vie.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 Deux investisseurs</Text>
        <View style={styles.duelGrid}>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Martin</Text>
            <Text style={styles.duelAmount}>20 ans</Text>
            <Text style={styles.summary}>Il investit 100 € par mois.</Text>
          </View>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Maximilien</Text>
            <Text style={styles.duelAmount}>35 ans</Text>
            <Text style={styles.summary}>Il attend avant de commencer.</Text>
          </View>
        </View>
        <Text style={styles.summary}>
          Tous les deux investissent exactement la même somme chaque mois. À 60 ans, Martin possède un patrimoine beaucoup plus important parce que son argent a eu 15 années supplémentaires pour travailler.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre</Text>
        <Text style={styles.summary}>
          Les intérêts produisent des intérêts. Puis ces nouveaux intérêts produisent encore d'autres intérêts. C'est comme une boule de neige qui grossit en descendant une montagne.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📈 Exemple concret</Text>
        <Text style={styles.summary}>100 € investis chaque mois. Rendement moyen : 8 % par an.</Text>
        <View style={styles.exampleList}>
          {timelineRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                <Text style={styles.exampleAmount}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.summary}>Le temps fait une grande partie du travail.</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.quoteText}>"J'attendrai d'avoir plus d'argent."</Text>
        <Text style={styles.summary}>
          Attendre quelques années coûte souvent beaucoup plus cher que commencer avec une petite somme, parce que les années perdues ne peuvent pas être rachetées.
        </Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.sectionTitle}>💬 Citation</Text>
        <Text style={styles.quoteText}>"Les intérêts composés sont parfois appelés la huitième merveille du monde."</Text>
        <Text style={styles.quoteAuthor}>— Citation souvent attribuée à Albert Einstein</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission Ascension</Text>
        <Text style={styles.summary}>Calcule combien tu pourrais investir chaque mois.</Text>
        <View style={styles.actionList}>
          {missionItems.map((item) => (
            <Text key={item} style={styles.actionItem}>{`• ${item}`}</Text>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>Que vaut mieux faire ?</Text>
        <View style={styles.quizOptions}>
          {challengeOptions.map((option) => {
            const isSelected = challengeAnswer === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onChallengeAnswerChange(option.id)}
                style={[styles.quizOption, isSelected && styles.quizOptionSelected]}
              >
                <Text style={[styles.quizOptionText, isSelected && styles.quizOptionTextSelected]}>
                  {option.label}) {option.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onRevealChallenge} style={styles.challengeButton}>
          <Text style={styles.challengeButtonText}>Voir l'explication</Text>
        </Pressable>
        {showChallengeResult ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultAmount}>B</Text>
            <Text style={styles.summary}>Commencer tôt est souvent plus puissant, car chaque année donne plus de temps aux intérêts composés pour travailler.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>
          Le temps est l'investissement que personne ne peut acheter.{"\n\n"}
          Plus tu commences tôt,{"\n\n"}
          plus ton argent aura le temps de travailler pour toi.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>
    </>
  );
}

function BudgetMissionLessonLayout({
  challengeAnswer,
  showChallengeResult,
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onChallengeAnswerChange,
  onRevealChallenge,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  challengeAnswer: string;
  showChallengeResult: boolean;
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onChallengeAnswerChange: (value: string) => void;
  onRevealChallenge: () => void;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const budgetRows: PremiumExampleRow[] = [
    { icon: "home-outline", label: "Dépenses fixes", value: "1 100 €" },
    { icon: "fast-food-outline", label: "Loisirs", value: "250 €" },
    { icon: "shield-checkmark-outline", label: "Épargne de sécurité", value: "250 €" },
    { icon: "trending-up-outline", label: "Investissements", value: "300 €" },
    { icon: "gift-outline", label: "Plaisir / projets", value: "100 €" }
  ];
  const missionItems = [
    "Prends une feuille.",
    "Écris ton salaire.",
    "Répartis chaque euro dans une catégorie.",
    "Même si ce n'est pas parfait."
  ];
  const challengeOptions = [
    { id: "A", label: "A", text: "Dépenser puis épargner ce qu'il reste." },
    { id: "B", label: "B", text: "Décider immédiatement de la mission de chaque euro." }
  ];

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>Pourquoi la plupart des budgets échouent</Text>
        <Text style={styles.lessonHeroText}>
          Quand on entend le mot "budget", on pense souvent à des restrictions.{"\n\n"}
          Moins sortir.{"\n\n"}
          Moins acheter.{"\n\n"}
          Moins profiter.{"\n\n"}
          Pourtant...{"\n\n"}
          Les personnes financièrement libres utilisent un budget pour une raison totalement différente.{"\n\n"}
          Elles veulent décider où va leur argent.{"\n\n"}
          Pas se demander où il est parti.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 Deux salaires identiques</Text>
        <View style={styles.duelGrid}>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Emma</Text>
            <Text style={styles.duelAmount}>2 000 €</Text>
            <Text style={styles.summary}>Elle dépense puis épargne ce qu'il reste.</Text>
          </View>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Martin</Text>
            <Text style={styles.duelAmount}>2 000 €</Text>
            <Text style={styles.summary}>Il répartit son salaire dès le premier jour.</Text>
          </View>
        </View>
        <Text style={styles.summary}>
          Quelques mois plus tard, Emma termine régulièrement le mois à découvert. Martin sait exactement où est allé chaque euro. Le salaire est identique. L'organisation change tout.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre</Text>
        <Text style={styles.summary}>
          Un budget consiste à donner une mission à chaque euro avant même que le mois commence. Ton argent doit travailler pour toi, pas disparaître sans que tu t'en rendes compte.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📊 Exemple concret</Text>
        <Text style={styles.summary}>Salaire : 2 000 €</Text>
        <View style={styles.exampleList}>
          {budgetRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                <Text style={styles.exampleAmount}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.quoteText}>"J'épargnerai à la fin du mois."</Text>
        <Text style={styles.summary}>
          Pour la plupart des personnes, il ne reste plus rien à la fin du mois. Il vaut mieux épargner dès la réception du salaire, avant que les dépenses ne décident à ta place.
        </Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.sectionTitle}>💬 Citation</Text>
        <Text style={styles.quoteText}>
          "Ne dépense pas ce qui reste après avoir épargné.{"\n\n"}
          Épargne ce qui reste après avoir décidé de ton budget."
        </Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission Ascension</Text>
        <Text style={styles.summary}>Le plus important est de commencer.</Text>
        <View style={styles.actionList}>
          {missionItems.map((item) => (
            <Text key={item} style={styles.actionItem}>{`• ${item}`}</Text>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>Tu reçois 2 000 €. Quelle est la meilleure méthode ?</Text>
        <View style={styles.quizOptions}>
          {challengeOptions.map((option) => {
            const isSelected = challengeAnswer === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onChallengeAnswerChange(option.id)}
                style={[styles.quizOption, isSelected && styles.quizOptionSelected]}
              >
                <Text style={[styles.quizOptionText, isSelected && styles.quizOptionTextSelected]}>
                  {option.label}) {option.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onRevealChallenge} style={styles.challengeButton}>
          <Text style={styles.challengeButtonText}>Voir l'explication</Text>
        </Pressable>
        {showChallengeResult ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultAmount}>B</Text>
            <Text style={styles.summary}>La réponse B est la bonne : décider immédiatement de la mission de chaque euro te donne le contrôle avant que les dépenses ne prennent la place.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>
          Chaque euro sans mission est un euro qui risque de disparaître.{"\n\n"}
          Le budget ne limite pas ta liberté.{"\n\n"}
          Il la construit.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>
    </>
  );
}

function SafetySavingsLessonLayout({
  challengeAnswer,
  showChallengeResult,
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onChallengeAnswerChange,
  onRevealChallenge,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  challengeAnswer: string;
  showChallengeResult: boolean;
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onChallengeAnswerChange: (value: string) => void;
  onRevealChallenge: () => void;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const reserveRows: PremiumExampleRow[] = [
    { icon: "shield-outline", label: "Objectif 1 mois", value: "1 600 €" },
    { icon: "layers-outline", label: "Objectif 3 mois", value: "4 800 €" },
    { icon: "lock-closed-outline", label: "Objectif 6 mois", value: "9 600 €" }
  ];
  const missionItems = [
    "Calcule trois mois de tes dépenses.",
    "Écris cet objectif.",
    "Avance à ton rythme.",
    "Même si cela prend plusieurs années."
  ];
  const challengeOptions = [
    { id: "A", label: "A", text: "Tu investis immédiatement les 2 000 €." },
    { id: "B", label: "B", text: "Tu gardes une réserve avant d'investir." }
  ];

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>Pourquoi tout le monde devrait avoir une réserve.</Text>
        <Text style={styles.lessonHeroText}>
          Une panne de voiture.{"\n\n"}
          Une machine à laver qui casse.{"\n\n"}
          Une facture imprévue.{"\n\n"}
          Ces situations arrivent à tout le monde.{"\n\n"}
          La différence n'est pas le problème.{"\n\n"}
          La différence, c'est la préparation.{"\n\n"}
          Une épargne de sécurité transforme une urgence en simple contretemps.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 Deux réactions différentes</Text>
        <View style={styles.duelGrid}>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Maëlya</Text>
            <Text style={styles.duelAmount}>900 €</Text>
            <Text style={styles.summary}>Elle possède une réserve et paie immédiatement.</Text>
          </View>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Maximilien</Text>
            <Text style={styles.duelAmount}>900 €</Text>
            <Text style={styles.summary}>Il n'a aucune réserve et s'endette.</Text>
          </View>
        </View>
        <Text style={styles.summary}>Le problème est identique. La préparation change tout.</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre</Text>
        <Text style={styles.summary}>
          Une épargne de sécurité n'est pas là pour rapporter de l'argent. Elle est là pour protéger ton équilibre financier. Elle t'évite de vendre tes investissements dans l'urgence ou de contracter un crédit.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📊 Exemple concret</Text>
        <Text style={styles.summary}>Dépenses mensuelles : 1 600 €. Chacun avance à son rythme.</Text>
        <View style={styles.exampleList}>
          {reserveRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                <Text style={styles.exampleAmount}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.quoteText}>Investir tout son argent sans conserver la moindre réserve.</Text>
        <Text style={styles.summary}>
          Cette erreur oblige souvent les personnes à vendre leurs placements au mauvais moment, simplement parce qu'un imprévu arrive avant qu'elles soient prêtes.
        </Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.sectionTitle}>💬 Citation</Text>
        <Text style={styles.quoteText}>
          "La tranquillité financière ne vient pas seulement de ce que tu possèdes.{"\n\n"}
          Elle vient aussi de ce que tu as prévu."
        </Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission Ascension</Text>
        <Text style={styles.summary}>Calcule aujourd'hui combien représentent trois mois de tes dépenses.</Text>
        <View style={styles.actionList}>
          {missionItems.map((item) => (
            <Text key={item} style={styles.actionItem}>{`• ${item}`}</Text>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>Tu disposes de 2 000 €. Que fais-tu ?</Text>
        <View style={styles.quizOptions}>
          {challengeOptions.map((option) => {
            const isSelected = challengeAnswer === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onChallengeAnswerChange(option.id)}
                style={[styles.quizOption, isSelected && styles.quizOptionSelected]}
              >
                <Text style={[styles.quizOptionText, isSelected && styles.quizOptionTextSelected]}>
                  {option.label}) {option.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onRevealChallenge} style={styles.challengeButton}>
          <Text style={styles.challengeButtonText}>Voir l'explication</Text>
        </Pressable>
        {showChallengeResult ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultAmount}>B</Text>
            <Text style={styles.summary}>La réponse B est la meilleure dans la plupart des situations : une réserve te permet ensuite d'investir sans paniquer au premier imprévu.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>
          Une épargne de sécurité ne te rend pas riche.{"\n\n"}
          Elle t'empêche simplement de redevenir pauvre au premier imprévu.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>
    </>
  );
}

function BadDebtLessonLayout({
  challengeAnswer,
  showChallengeResult,
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onChallengeAnswerChange,
  onRevealChallenge,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  challengeAnswer: string;
  showChallengeResult: boolean;
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onChallengeAnswerChange: (value: string) => void;
  onRevealChallenge: () => void;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const phoneRows: PremiumExampleRow[] = [
    { icon: "phone-portrait-outline", label: "Téléphone", value: "1 500 €" },
    { icon: "cash-outline", label: "Paiement comptant", value: "1 500 €" },
    { icon: "calendar-outline", label: "Paiement à crédit", value: "24 x 70 €" },
    { icon: "warning-outline", label: "Coût total", value: "1 680 €" }
  ];
  const missionItems = [
    "Liste tous tes crédits.",
    "Ajoute tes paiements mensuels.",
    "Demande-toi pour chacun s'il améliore réellement ta vie aujourd'hui."
  ];
  const challengeOptions = [
    { id: "A", label: "A", text: "L'acheter immédiatement à crédit sans réflexion." },
    { id: "B", label: "B", text: "Économiser quelques mois si possible et comparer le coût total avant de décider." }
  ];

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>Une dette n'est pas toujours un problème.</Text>
        <Text style={styles.lessonHeroText}>
          Emprunter n'est pas forcément une erreur.{"\n\n"}
          Le véritable danger est d'emprunter pour acheter quelque chose qui perd de la valeur ou qui ne t'apporte rien à long terme.{"\n\n"}
          Chaque mensualité réduit une partie de ta liberté.{"\n\n"}
          Avant de signer un crédit, pose-toi une question :{"\n\n"}
          "Est-ce que cet achat améliore vraiment mon avenir ?"
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 Deux choix différents</Text>
        <View style={styles.duelGrid}>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Maëlya</Text>
            <Text style={styles.duelAmount}>3 000 €</Text>
            <Text style={styles.summary}>Elle emprunte pour changer de téléphone alors que le sien fonctionne encore.</Text>
          </View>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Martin</Text>
            <Text style={styles.duelAmount}>3 000 €</Text>
            <Text style={styles.summary}>Il garde son téléphone un an de plus et met cette somme de côté.</Text>
          </View>
        </View>
        <Text style={styles.summary}>
          Deux ans plus tard, Maëlya rembourse toujours son crédit. Martin possède une épargne pour un projet important. Leur revenu est identique. Leurs décisions sont différentes.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre</Text>
        <Text style={styles.summary}>
          Une mauvaise dette sert souvent à financer un plaisir immédiat. Le plaisir dure quelques jours. Les mensualités peuvent durer plusieurs années. Une bonne décision aujourd'hui peut éviter des années de contraintes.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📊 Exemple concret</Text>
        <View style={styles.exampleList}>
          {phoneRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                <Text style={styles.exampleAmount}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.summary}>Le téléphone perd de la valeur pendant que tu continues de le payer.</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.quoteText}>"Ce n'est que 40 € par mois."</Text>
        <Text style={styles.summary}>
          Une petite mensualité peut sembler anodine. Mais en additionnant voiture, téléphone, meuble ou abonnement, elles finissent par peser lourd sur le budget.
        </Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.sectionTitle}>💬 Citation</Text>
        <Text style={styles.quoteText}>"Chaque mensualité est une partie de ton salaire déjà dépensée avant même d'être gagnée."</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission Ascension</Text>
        <Text style={styles.summary}>Liste tous tes crédits et paiements mensuels.</Text>
        <View style={styles.actionList}>
          {missionItems.map((item) => (
            <Text key={item} style={styles.actionItem}>{`• ${item}`}</Text>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>Tu souhaites acheter un ordinateur à 1 200 €. Que vaut-il mieux faire ?</Text>
        <View style={styles.quizOptions}>
          {challengeOptions.map((option) => {
            const isSelected = challengeAnswer === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onChallengeAnswerChange(option.id)}
                style={[styles.quizOption, isSelected && styles.quizOptionSelected]}
              >
                <Text style={[styles.quizOptionText, isSelected && styles.quizOptionTextSelected]}>
                  {option.label}) {option.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onRevealChallenge} style={styles.challengeButton}>
          <Text style={styles.challengeButtonText}>Voir l'explication</Text>
        </Pressable>
        {showChallengeResult ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultAmount}>B</Text>
            <Text style={styles.summary}>La réponse B est généralement la plus prudente : elle te laisse comparer le coût total et décider avec plus de clarté, sans te piéger dans une mensualité.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>
          Une mauvaise dette ne te vole pas seulement de l'argent.{"\n\n"}
          Elle réduit aussi tes choix futurs.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>
    </>
  );
}

function GoodHabitsLessonLayout({
  challengeAnswer,
  showChallengeResult,
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onChallengeAnswerChange,
  onRevealChallenge,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  challengeAnswer: string;
  showChallengeResult: boolean;
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onChallengeAnswerChange: (value: string) => void;
  onRevealChallenge: () => void;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const routineRows: PremiumExampleRow[] = [
    { icon: "cash-outline", label: "Épargner", value: "10 %" },
    { icon: "trending-up-outline", label: "Investir", value: "10 %" },
    { icon: "document-text-outline", label: "Vérifier son budget" },
    { icon: "book-outline", label: "Lire sur la finance", value: "10 min" },
    { icon: "flag-outline", label: "Mettre à jour ses objectifs" }
  ];
  const missionItems = [
    "noter tes dépenses",
    "épargner automatiquement",
    "investir chaque mois",
    "vérifier ton budget chaque dimanche"
  ];
  const challengeOptions = [
    { id: "A", label: "A", text: "Quelqu'un qui investit beaucoup une seule fois." },
    { id: "B", label: "B", text: "Quelqu'un qui investit un petit montant chaque mois pendant plusieurs années." }
  ];

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>Les petites habitudes changent les grandes vies.</Text>
        <Text style={styles.lessonHeroText}>
          Beaucoup de personnes pensent qu'il faut une idée géniale ou un énorme salaire pour réussir.{"\n\n"}
          En réalité, ce sont souvent les petits gestes répétés chaque semaine qui font toute la différence.{"\n\n"}
          Épargner.{"\n\n"}
          Suivre ses dépenses.{"\n\n"}
          Investir régulièrement.{"\n\n"}
          Lire quelques pages.{"\n\n"}
          Ces habitudes semblent insignifiantes aujourd'hui, mais elles deviennent puissantes avec le temps.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 Deux routines</Text>
        <View style={styles.duelGrid}>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Maëlya</Text>
            <Text style={styles.duelAmount}>Salaire reçu</Text>
            <Text style={styles.summary}>Elle dépense d'abord et verra plus tard.</Text>
          </View>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Martin</Text>
            <Text style={styles.duelAmount}>Routine</Text>
            <Text style={styles.summary}>Il épargne 10 %, investit une partie et suit son budget.</Text>
          </View>
        </View>
        <Text style={styles.summary}>Après plusieurs années, les résultats sont totalement différents. Ce ne sont pas leurs revenus qui ont changé. Ce sont leurs habitudes.</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre</Text>
        <Text style={styles.summary}>
          Une habitude est une action tellement répétée qu'elle devient presque automatique. Quand une bonne habitude devient naturelle, tu n'as plus besoin d'y penser. Elle travaille pour toi.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📊 Exemple concret</Text>
        <Text style={styles.summary}>Exemple d'une routine mensuelle. Aucune action n'est compliquée. C'est leur répétition qui fait la différence.</Text>
        <View style={styles.exampleList}>
          {routineRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                {row.value ? <Text style={styles.exampleAmount}>{row.value}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.quoteText}>Vouloir tout changer d'un seul coup.</Text>
        <Text style={styles.summary}>
          Il vaut mieux mettre en place une seule bonne habitude durable que dix habitudes abandonnées après une semaine.
        </Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.sectionTitle}>💬 Citation</Text>
        <Text style={styles.quoteText}>"Les grandes réussites sont souvent le résultat de petites actions répétées pendant longtemps."</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission Ascension</Text>
        <Text style={styles.summary}>Choisis UNE seule habitude financière et garde cette habitude pendant 30 jours.</Text>
        <View style={styles.actionList}>
          {missionItems.map((item) => (
            <Text key={item} style={styles.actionItem}>{`• ${item}`}</Text>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>Quelle personne a le plus de chances de réussir ?</Text>
        <View style={styles.quizOptions}>
          {challengeOptions.map((option) => {
            const isSelected = challengeAnswer === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onChallengeAnswerChange(option.id)}
                style={[styles.quizOption, isSelected && styles.quizOptionSelected]}
              >
                <Text style={[styles.quizOptionText, isSelected && styles.quizOptionTextSelected]}>
                  {option.label}) {option.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onRevealChallenge} style={styles.challengeButton}>
          <Text style={styles.challengeButtonText}>Voir l'explication</Text>
        </Pressable>
        {showChallengeResult ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultAmount}>B</Text>
            <Text style={styles.summary}>La réponse B est généralement la meilleure : une petite action répétée pendant plusieurs années construit une vraie trajectoire.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>
          Tu n'as pas besoin d'être parfait.{"\n\n"}
          Tu as seulement besoin d'être régulier.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>
    </>
  );
}

function BeginnerMistakesLessonLayout({
  challengeAnswer,
  showChallengeResult,
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onChallengeAnswerChange,
  onRevealChallenge,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  challengeAnswer: string;
  showChallengeResult: boolean;
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onChallengeAnswerChange: (value: string) => void;
  onRevealChallenge: () => void;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const mistakeRows: PremiumExampleRow[] = [
    { icon: "wallet-outline", label: "Dépenser sans budget" },
    { icon: "help-circle-outline", label: "Investir sans comprendre" },
    { icon: "flash-outline", label: "Vouloir devenir riche rapidement" },
    { icon: "people-outline", label: "Copier les autres sans réfléchir" },
    { icon: "close-circle-outline", label: "Abandonner après un premier échec" }
  ];
  const missionItems = [
    "Pense à une erreur financière que tu as déjà faite.",
    "Écris ce qu'elle t'a appris.",
    "Ne cherche pas à regretter.",
    "Cherche à progresser."
  ];
  const challengeOptions = [
    { id: "A", label: "A", text: "Tu abandonnes définitivement." },
    { id: "B", label: "B", text: "Tu analyses ton erreur avant de continuer." }
  ];

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>Tout le monde commence un jour.</Text>
        <Text style={styles.lessonHeroText}>
          Personne ne naît en sachant gérer son argent.{"\n\n"}
          Les investisseurs expérimentés, les entrepreneurs et les personnes financièrement libres ont tous fait des erreurs.{"\n\n"}
          La différence, ce n'est pas qu'ils en ont fait moins.{"\n\n"}
          C'est qu'ils en ont tiré des leçons.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 Deux réactions</Text>
        <View style={styles.duelGrid}>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Maximilien</Text>
            <Text style={styles.duelAmount}>-200 €</Text>
            <Text style={styles.summary}>Il perd 200 € sur un mauvais investissement et abandonne immédiatement.</Text>
          </View>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Emma</Text>
            <Text style={styles.duelAmount}>-200 €</Text>
            <Text style={styles.summary}>Elle perd également 200 €, puis cherche à comprendre ce qui n'a pas fonctionné.</Text>
          </View>
        </View>
        <Text style={styles.summary}>
          Quelques années plus tard, Maximilien n'investit toujours plus. Emma investit avec beaucoup plus d'expérience. La même erreur. Deux résultats totalement différents.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre</Text>
        <Text style={styles.summary}>
          Une erreur est une information. Elle te montre ce qu'il faut améliorer, à condition d'accepter de l'analyser. Les personnes qui réussissent ne cherchent pas à éviter toutes les erreurs. Elles cherchent à éviter de refaire les mêmes.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📊 Exemple concret</Text>
        <Text style={styles.summary}>Les erreurs les plus fréquentes :</Text>
        <View style={styles.exampleList}>
          {mistakeRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.summary}>Chaque erreur peut devenir une leçon.</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.quoteText}>Penser qu'un échec signifie que l'on est mauvais.</Text>
        <Text style={styles.summary}>L'échec fait partie de l'apprentissage. Il ne définit pas ta valeur. Il indique simplement une méthode à ajuster.</Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.sectionTitle}>💬 Citation</Text>
        <Text style={styles.quoteText}>
          "Je n'ai pas échoué.{"\n\n"}
          J'ai simplement trouvé des façons qui ne fonctionnent pas."
        </Text>
        <Text style={styles.quoteAuthor}>— Thomas Edison</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission Ascension</Text>
        <Text style={styles.summary}>L'objectif n'est pas de regretter. L'objectif est de progresser.</Text>
        <View style={styles.actionList}>
          {missionItems.map((item) => (
            <Text key={item} style={styles.actionItem}>{`• ${item}`}</Text>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>Tu fais un mauvais investissement. Que fais-tu ?</Text>
        <View style={styles.quizOptions}>
          {challengeOptions.map((option) => {
            const isSelected = challengeAnswer === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onChallengeAnswerChange(option.id)}
                style={[styles.quizOption, isSelected && styles.quizOptionSelected]}
              >
                <Text style={[styles.quizOptionText, isSelected && styles.quizOptionTextSelected]}>
                  {option.label}) {option.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onRevealChallenge} style={styles.challengeButton}>
          <Text style={styles.challengeButtonText}>Voir l'explication</Text>
        </Pressable>
        {showChallengeResult ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultAmount}>B</Text>
            <Text style={styles.summary}>La réponse B est la bonne : analyser ton erreur te permet de corriger ta méthode au lieu de répéter le même choix.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>
          Les erreurs sont inévitables.{"\n\n"}
          Les répéter est un choix.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>
    </>
  );
}

function TimePowerLessonLayout({
  challengeAnswer,
  showChallengeResult,
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onChallengeAnswerChange,
  onRevealChallenge,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  challengeAnswer: string;
  showChallengeResult: boolean;
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onChallengeAnswerChange: (value: string) => void;
  onRevealChallenge: () => void;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const timelineRows: PremiumExampleRow[] = [
    { icon: "calendar-outline", label: "Investissement", value: "100 € / mois" },
    { icon: "rocket-outline", label: "Début à 20 ans", value: "≈ 350 000 €" },
    { icon: "time-outline", label: "Début à 35 ans", value: "≈ 110 000 €" }
  ];
  const missionItems = [
    "Choisis aujourd'hui une date de début.",
    "Même si tu investis seulement 20 € par mois.",
    "Le plus important est de commencer."
  ];
  const challengeOptions = [
    { id: "A", label: "A", text: "Attendre cinq ans pour investir davantage." },
    { id: "B", label: "B", text: "Commencer aujourd'hui avec une petite somme." }
  ];

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>Le temps fait ce que l'argent ne peut pas faire.</Text>
        <Text style={styles.lessonHeroText}>
          Beaucoup de personnes pensent qu'elles ont encore le temps.{"\n\n"}
          "Elles commenceront plus tard."{"\n\n"}
          Pourtant, chaque année qui passe est une année que ton argent ne pourra jamais récupérer.{"\n\n"}
          Le temps est une ressource que personne ne peut acheter.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 Deux décisions</Text>
        <View style={styles.duelGrid}>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Maëlya</Text>
            <Text style={styles.duelAmount}>20 ans</Text>
            <Text style={styles.summary}>Elle commence à investir 100 € par mois.</Text>
          </View>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Martin</Text>
            <Text style={styles.duelAmount}>35 ans</Text>
            <Text style={styles.summary}>Il attend, puis investit exactement la même somme chaque mois.</Text>
          </View>
        </View>
        <Text style={styles.summary}>
          À 60 ans, Maëlya possède un patrimoine beaucoup plus important. Pas parce qu'elle était plus riche. Parce qu'elle a commencé plus tôt.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre</Text>
        <Text style={styles.summary}>
          Le temps permet à ton épargne, à tes investissements et à tes intérêts composés de travailler. Chaque année supplémentaire augmente leur puissance. Plus tu attends, plus tu dois investir pour obtenir le même résultat.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📊 Exemple concret</Text>
        <Text style={styles.summary}>Le même effort mensuel peut produire deux résultats très différents selon le moment où tu commences.</Text>
        <View style={styles.exampleList}>
          {timelineRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                {row.value ? <Text style={styles.exampleAmount}>{row.value}</Text> : null}
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.summary}>Le temps a créé une différence énorme.</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.quoteText}>"Je commencerai quand j'aurai un meilleur salaire."</Text>
        <Text style={styles.summary}>Beaucoup de personnes attendent la situation parfaite, qui n'arrive jamais. La vraie progression commence souvent avec une petite action imparfaite.</Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.sectionTitle}>💬 Citation</Text>
        <Text style={styles.quoteText}>
          "Le meilleur moment pour planter un arbre était il y a vingt ans.{"\n\n"}
          Le deuxième meilleur moment est aujourd'hui."
        </Text>
        <Text style={styles.quoteAuthor}>— Proverbe chinois</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission Ascension</Text>
        <Text style={styles.summary}>Choisis aujourd'hui une date de début. Le plus important est de commencer.</Text>
        <View style={styles.actionList}>
          {missionItems.map((item) => (
            <Text key={item} style={styles.actionItem}>{`• ${item}`}</Text>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>Quelle est la meilleure stratégie ?</Text>
        <View style={styles.quizOptions}>
          {challengeOptions.map((option) => {
            const isSelected = challengeAnswer === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onChallengeAnswerChange(option.id)}
                style={[styles.quizOption, isSelected && styles.quizOptionSelected]}
              >
                <Text style={[styles.quizOptionText, isSelected && styles.quizOptionTextSelected]}>
                  {option.label}) {option.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onRevealChallenge} style={styles.challengeButton}>
          <Text style={styles.challengeButtonText}>Voir l'explication</Text>
        </Pressable>
        {showChallengeResult ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultAmount}>B</Text>
            <Text style={styles.summary}>La réponse B est souvent la plus efficace : commencer aujourd'hui donne plus de temps à ton argent et à tes habitudes pour grandir.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>
          Le temps est le seul investissement que personne ne peut te rendre.{"\n\n"}
          Chaque jour compte.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>
    </>
  );
}

function FinalFoundationsLessonLayout({
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const foundationRows: PremiumExampleRow[] = [
    { icon: "wallet-outline", label: "Budget", value: "donner une mission à chaque euro" },
    { icon: "shield-checkmark-outline", label: "Sécurité", value: "éviter les mauvaises dettes" },
    { icon: "repeat-outline", label: "Habitudes", value: "répéter les bonnes décisions" },
    { icon: "time-outline", label: "Temps", value: "laisser les résultats grandir" }
  ];
  const exampleRows: PremiumExampleRow[] = [
    { icon: "cash-outline", label: "Montant", value: "100 € / mois" },
    { icon: "calendar-outline", label: "Durée", value: "20 ans" },
    { icon: "trending-up-outline", label: "Effet", value: "plusieurs dizaines de milliers d'euros" }
  ];
  const challengeOptions = [
    { id: "A", text: "Chercher à devenir riche très vite." },
    { id: "B", text: "Construire progressivement de bonnes habitudes pendant plusieurs années." },
    { id: "C", text: "Attendre le bon moment pour commencer." }
  ];

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>Tu viens de poser les fondations.</Text>
        <Text style={styles.lessonHeroText}>
          Une maison ne commence jamais par le toit.{"\n\n"}
          Elle commence par des fondations solides.{"\n\n"}
          C'est exactement ce que tu viens de construire.{"\n\n"}
          Tu sais maintenant gérer un budget, éviter les mauvaises dettes, créer de bonnes habitudes, fixer des objectifs et comprendre que le temps est ton meilleur allié.{"\n\n"}
          Tu possèdes déjà plus de connaissances financières que beaucoup de personnes n'en auront jamais.
        </Text>
        <View style={styles.exampleList}>
          {foundationRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                <Text style={styles.exampleAmount}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 L'histoire</Text>
        <View style={styles.duelGrid}>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Martin</Text>
            <Text style={styles.duelAmount}>Même salaire</Text>
            <Text style={styles.summary}>Il dépense tout son salaire et vit toujours au mois le mois.</Text>
          </View>
          <View style={styles.duelCard}>
            <Text style={styles.duelName}>Maximilien</Text>
            <Text style={styles.duelAmount}>Même salaire</Text>
            <Text style={styles.summary}>Il applique les principes appris dans l'Academy.</Text>
          </View>
        </View>
        <Text style={styles.summary}>
          Dix ans plus tard, Martin vit toujours au mois le mois. Maximilien possède une épargne, des investissements et prépare déjà son avenir. Ce n'est pas la chance. Ce sont les décisions prises chaque mois.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre</Text>
        <Text style={styles.summary}>
          Chaque petite décision compte.{"\n\n"}
          Un euro économisé.{"\n\n"}
          Une dépense évitée.{"\n\n"}
          Un investissement.{"\n\n"}
          Une bonne habitude.{"\n\n"}
          Séparément, ces actions semblent insignifiantes. Ensemble, elles changent une vie.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📊 Exemple</Text>
        <Text style={styles.summary}>Imagine 100 € investis chaque mois pendant 20 ans.</Text>
        <View style={styles.exampleList}>
          {exampleRows.map((row) => (
            <View key={row.label} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                <Text style={styles.exampleAmount}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.summary}>Grâce aux intérêts composés, cette discipline peut représenter plusieurs dizaines de milliers d'euros. La richesse se construit lentement. Mais elle finit par accélérer.</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.quoteText}>Vouloir devenir riche rapidement.</Text>
        <Text style={styles.summary}>
          La plupart des personnes qui recherchent des gains immédiats prennent des risques excessifs.{"\n\n"}
          Les patrimoines solides se construisent avec du temps, de la discipline et de la patience.
        </Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.sectionTitle}>💬 Citation</Text>
        <Text style={styles.quoteText}>
          "Le succès financier n'est pas une question de vitesse.{"\n\n"}
          C'est une question de constance."
        </Text>
        <Text style={styles.quoteAuthor}>— Ascension</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission</Text>
        <Text style={styles.summary}>Prends un engagement envers toi-même.</Text>
        <Text style={styles.summary}>
          Écris une seule phrase.{"\n\n"}
          "À partir d'aujourd'hui, je prends le contrôle de mon avenir financier."{"\n\n"}
          Lis-la chaque fois que tu doutes.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>Quelle est la meilleure stratégie ?</Text>
        <View style={styles.quizOptions}>
          {challengeOptions.map((option) => (
            <View key={option.id} style={[styles.quizOption, option.id === "B" && styles.quizOptionCorrect]}>
              <Text style={[styles.quizOptionText, option.id === "B" && styles.quizOptionTextSelected]}>
                {option.id}. {option.text}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.resultBox}>
          <Text style={styles.resultAmount}>B</Text>
          <Text style={styles.summary}>Construire progressivement de bonnes habitudes est plus solide que chercher des résultats immédiats. La constance protège tes décisions.</Text>
        </View>
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>
          La liberté financière ne dépend pas de ton salaire.{"\n\n"}
          Elle dépend des décisions que tu prends régulièrement.{"\n\n"}
          Commence aujourd'hui.{"\n\n"}
          Ton futur toi te remerciera.
        </Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>🎉 Félicitations !</Text>
        <Text style={styles.takeawayHeroText}>
          Tu viens de terminer le Niveau 1 :{"\n\n"}
          Les Fondations.{"\n\n"}
          +20 XP{"\n\n"}
          Niveau 2 débloqué : Épargne & Investissement.
        </Text>
      </View>
    </>
  );
}

function InvestmentLessonLayout({
  lessonMeta,
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  isFinalLesson,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  lessonMeta: LessonMeta;
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  isFinalLesson: boolean;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const [story, explanation, example, mistake, mission, challenge, takeaway] = lessonMeta.sections;
  const exampleRows: PremiumExampleRow[] = [
    { icon: "wallet-outline", label: "Montant", value: getFirstAmount(example) },
    { icon: "time-outline", label: "Horizon", value: getFirstDuration(example) },
    { icon: "trending-up-outline", label: "Objectif", value: "Faire travailler l'argent" }
  ];

  return (
    <>
      <View style={styles.lessonHero}>
        <Text style={styles.lessonHeroIcon}>🎬</Text>
        <Text style={styles.lessonHeroTitle}>{lessonMeta.title}</Text>
        <Text style={styles.lessonHeroText}>{lessonMeta.intro}</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📖 Histoire concrète</Text>
        <Text style={styles.summary}>{story}</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧠 Comprendre simplement</Text>
        <Text style={styles.summary}>{explanation}</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>📊 Exemple chiffré</Text>
        <Text style={styles.summary}>{example}</Text>
        <View style={styles.exampleList}>
          {exampleRows.map((row) => (
            <View key={`${lessonMeta.title}-${row.label}`} style={styles.exampleRow}>
              <View style={styles.exampleIconWrap}>
                <Ionicons name={row.icon} size={16} color={colors.gold} />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={styles.exampleLabel}>{row.label}</Text>
                <Text style={styles.exampleAmount}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>Erreur fréquente</Text>
        <Text style={styles.summary}>{mistake}</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionTitle}>🎯 Mission Ascension</Text>
        <Text style={styles.summary}>{mission}</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🧩 Défi</Text>
        <Text style={styles.summary}>{challenge}</Text>
      </View>

      <View style={styles.takeawayHero}>
        <Text style={styles.calloutLabel}>⭐ À retenir</Text>
        <Text style={styles.takeawayHeroText}>{takeaway}</Text>
      </View>

      <View style={styles.premiumPanel}>
        <Text style={styles.sectionTitle}>🏆 Quiz</Text>
        <PremiumInlineQuiz
          questions={questions}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isQuizSubmitted={isQuizSubmitted}
          isQuizFinished={isQuizFinished}
          quizScore={quizScore}
          onSelectQuizAnswer={onSelectQuizAnswer}
          onAdvanceQuiz={onAdvanceQuiz}
        />
      </View>

      {isFinalLesson ? (
        <View style={styles.takeawayHero}>
          <Text style={styles.calloutLabel}>🎉 Niveau 2 terminé</Text>
          <Text style={styles.takeawayHeroText}>
            Tu sais maintenant comment commencer à faire travailler ton argent.{"\n\n"}
            Niveau 3 débloqué : Gestion du risque.
          </Text>
        </View>
      ) : null}
    </>
  );
}

function PremiumInlineQuiz({
  questions,
  questionIndex,
  selectedOption,
  isQuizSubmitted,
  isQuizFinished,
  quizScore,
  onSelectQuizAnswer,
  onAdvanceQuiz
}: {
  questions: NonNullable<AcademyLesson["quizQuestions"]>;
  questionIndex: number;
  selectedOption: number | null;
  isQuizSubmitted: boolean;
  isQuizFinished: boolean;
  quizScore: number;
  onSelectQuizAnswer: (optionIndex: number) => void;
  onAdvanceQuiz: () => void;
}) {
  const currentQuestion = questions[questionIndex] ?? null;
  const quizProgress = questions.length ? ((questionIndex + 1) / questions.length) * 100 : 0;

  if (isQuizFinished) {
    return (
      <View style={styles.quizResultBox}>
        <Text style={styles.resultAmount}>{quizScore}%</Text>
        <Text style={styles.summary}>Score final obtenu. Tu peux maintenant valider la leçon et recevoir tes XP.</Text>
      </View>
    );
  }

  if (!currentQuestion) {
    return <Text style={styles.summary}>Aucune question disponible pour ce quiz.</Text>;
  }

  return (
    <>
      <View style={styles.quizProgressRow}>
        <Text style={styles.progressText}>Question {questionIndex + 1}/{questions.length}</Text>
        <Text style={styles.progressText}>{Math.round(quizProgress)}%</Text>
      </View>
      <View style={styles.quizTrack}>
        <View style={[styles.quizFill, { width: `${quizProgress}%` }]} />
      </View>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      <View style={styles.quizOptions}>
        {currentQuestion.options.map((option, optionIndex) => {
          const isSelected = selectedOption === optionIndex;
          const isCorrect = isQuizSubmitted && optionIndex === currentQuestion.correctOptionIndex;
          const isWrong = isQuizSubmitted && isSelected && optionIndex !== currentQuestion.correctOptionIndex;

          return (
            <Pressable
              key={`${currentQuestion.id}-${optionIndex}`}
              onPress={() => onSelectQuizAnswer(optionIndex)}
              style={[
                styles.quizOption,
                isSelected && styles.quizOptionSelected,
                isCorrect && styles.quizOptionCorrect,
                isWrong && styles.quizOptionWrong
              ]}
            >
              <Text
                style={[
                  styles.quizOptionText,
                  isSelected && styles.quizOptionTextSelected,
                  isCorrect && styles.quizOptionTextCorrect,
                  isWrong && styles.quizOptionTextWrong
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {isQuizSubmitted ? (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackText}>
            {selectedOption === currentQuestion.correctOptionIndex ? "Bonne réponse !" : "La bonne réponse a été mise en évidence."}
          </Text>
        </View>
      ) : null}
      <Pressable onPress={onAdvanceQuiz} style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>
          {isQuizSubmitted ? questionIndex + 1 < questions.length ? "Question suivante" : "Voir le score" : "Valider la réponse"}
        </Text>
      </Pressable>
    </>
  );
}

function getFirstAmount(text: string) {
  return text.match(/\d[\d\s]*\s?€/)?.[0] ?? "Plan simple";
}

function getFirstDuration(text: string) {
  return text.match(/\d+\s?(ans|an|mois)/i)?.[0] ?? "Long terme";
}

function getLessonContent(module: AcademyModule | null, lesson: AcademyLesson | null) {
  const title = lesson?.title ?? "Leçon";
  const moduleTitle = module?.title ?? "Academy";
  const xpReward = lesson?.xpReward ?? 20;
  const isBudgetLesson = title.toLowerCase().includes("budget");
  const budgetExampleRows: PremiumExampleRow[] = [
    { icon: "home-outline", label: "Dépenses obligatoires", value: "1 100 €" },
    { icon: "happy-outline", label: "Loisirs", value: "250 €" },
    { icon: "shield-checkmark-outline", label: "Épargne de sécurité", value: "250 €" },
    { icon: "trending-up-outline", label: "Investissement", value: "400 €" }
  ];

  if (lesson?.intro && lesson.sections?.length && lesson.takeaway && lesson.example) {
    const sections = lesson.sections;
    return {
      title,
      duration: `${lesson.estimatedMinutes ?? 7} min`,
      intro: lesson.intro,
      sections,
      takeaway: lesson.takeaway,
      example: lesson.example,
      frequentMistake: isBudgetLesson
        ? "Beaucoup de personnes dépensent d’abord puis épargnent ce qu’il reste. La bonne méthode consiste à attribuer une mission à chaque euro dès la réception du salaire."
        : sections[0],
      dailyAction: isBudgetLesson ? "Répartis ton prochain salaire en quatre catégories :" : lesson.example,
      exampleRows: isBudgetLesson
        ? budgetExampleRows
        : sections.map((point): PremiumExampleRow => ({ icon: "checkmark-circle-outline", label: point })),
      actionItems: isBudgetLesson ? ["Dépenses", "Loisirs", "Épargne", "Investissement"] : sections,
      xpReward,
      points: sections
    };
  }

  if (title.toLowerCase().includes("argent") || title.toLowerCase().includes("budget") || title.toLowerCase().includes("épargne")) {
    const sections = [
      "Identifier l’idée centrale à retenir",
      "Appliquer la logique à un cas simple",
      "Transposer la méthode à ta situation"
    ];
    return {
      title,
      duration: "7 min",
      intro: title.toLowerCase().includes("budget")
        ? "Chaque euro que tu reçois doit avoir une mission.\n\nLe budget est l'outil qui te permet de décider où ton argent va travailler."
        : `Dans ${moduleTitle}, cette leçon te montre comment ${title.toLowerCase()} sans perdre de vue l’objectif global.`,
      sections,
      takeaway: "La discipline transforme l'argent en outil de vie, pas en source d'instabilité.",
      example: "Un budget simple, respecté chaque semaine, vaut souvent mieux qu'un gain ponctuel mal géré.",
      frequentMistake: isBudgetLesson
        ? "Beaucoup de personnes dépensent d’abord puis épargnent ce qu’il reste. La bonne méthode consiste à attribuer une mission à chaque euro dès la réception du salaire."
        : sections[0],
      dailyAction: isBudgetLesson ? "Répartis ton prochain salaire en quatre catégories :" : "Un budget simple, respecté chaque semaine, vaut souvent mieux qu'un gain ponctuel mal géré.",
      exampleRows: isBudgetLesson
        ? budgetExampleRows
        : sections.map((point): PremiumExampleRow => ({ icon: "checkmark-circle-outline", label: point })),
      actionItems: isBudgetLesson ? ["Dépenses", "Loisirs", "Épargne", "Investissement"] : sections,
      xpReward,
      points: sections
    };
  }

  if (title.toLowerCase().includes("risque") || title.toLowerCase().includes("psychologie") || title.toLowerCase().includes("discipline")) {
    const sections = [
      "Repérer les pièges émotionnels",
      "Choisir une règle simple à suivre",
      "Préserver ton capital et ta clarté"
    ];
    return {
      title,
      duration: "8 min",
      intro: `Cette étape renforce ta capacité à ${title.toLowerCase()} avant de prendre une décision importante.`,
      sections,
      takeaway: "Une règle simple est plus forte qu'un sentiment de court terme.",
      example: "Même avec un bon signal, tu ne prends pas de risque si ta méthode te dit de ne pas agir.",
      frequentMistake: sections[0],
      dailyAction: "Même avec un bon signal, tu ne prends pas de risque si ta méthode te dit de ne pas agir.",
      exampleRows: sections.map((point): PremiumExampleRow => ({ icon: "checkmark-circle-outline", label: point })),
      actionItems: sections,
      xpReward,
      points: sections
    };
  }

  const sections = [
    "Comprendre l’enjeu de la leçon",
    "Retenir le réflexe principal",
    "Continuer le chapitre pour valider la progression"
  ];

  return {
    title,
    duration: "6 min",
    intro: `Cette leçon t’aide à intégrer les bases de ${moduleTitle.toLowerCase()} avec un contenu simple, concret et immédiatement applicable.`,
    sections,
    takeaway: "La progression vient de la répétition simple et régulière.",
    example: "Appliquer une méthode au quotidien crée plus de résultats qu'un apprentissage isolé.",
    frequentMistake: sections[0],
    dailyAction: "Appliquer une méthode au quotidien crée plus de résultats qu'un apprentissage isolé.",
    exampleRows: sections.map((point): PremiumExampleRow => ({ icon: "checkmark-circle-outline", label: point })),
    actionItems: sections,
    xpReward,
    points: sections
  };
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
  metaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: "rgba(228, 169, 69, 0.06)"
  },
  metaText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600"
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
  contentBox: {
    gap: spacing.sm,
    paddingTop: spacing.xs
  },
  callout: {
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(228, 169, 69, 0.08)"
  },
  calloutLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4
  },
  calloutText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20
  },
  exampleBox: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  premiumPanel: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: spacing.sm
  },
  exampleList: {
    gap: spacing.sm
  },
  exampleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 4
  },
  exampleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212, 175, 55, 0.14)"
  },
  exampleCopy: {
    flex: 1
  },
  exampleLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600"
  },
  exampleAmount: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2
  },
  actionBox: {
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.26)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    gap: spacing.sm
  },
  actionList: {
    gap: 6
  },
  actionItem: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500"
  },
  lessonHero: {
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: "rgba(228, 169, 69, 0.08)"
  },
  lessonHeroIcon: {
    fontSize: 28
  },
  lessonHeroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800"
  },
  lessonHeroText: {
    color: "#F2F2F2",
    fontSize: 15,
    lineHeight: 23
  },
  duelGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  duelCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.18)",
    gap: 6
  },
  duelName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800"
  },
  duelAmount: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: "800"
  },
  vsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  vsCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 4
  },
  vsLabel: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: "800"
  },
  vsText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
    opacity: 0.7
  },
  quoteCard: {
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.28)",
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.05)"
  },
  quoteText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700"
  },
  quoteAuthor: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "700"
  },
  challengeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center"
  },
  challengeInput: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    color: colors.white,
    backgroundColor: "rgba(0,0,0,0.22)",
    fontSize: 15,
    fontWeight: "700"
  },
  challengeButton: {
    minHeight: 44,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gold
  },
  challengeButtonText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: "800"
  },
  resultBox: {
    borderWidth: 1,
    borderColor: "rgba(86, 211, 139, 0.30)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(86, 211, 139, 0.08)",
    gap: 4
  },
  resultAmount: {
    color: "#56D38B",
    fontSize: 26,
    fontWeight: "900"
  },
  quizProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  progressText: {
    color: "#CFCFCF",
    fontSize: 12,
    fontWeight: "700"
  },
  quizTrack: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.10)"
  },
  quizFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.gold
  },
  questionText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "800"
  },
  quizOptions: {
    gap: spacing.sm
  },
  quizOption: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.18)"
  },
  quizOptionSelected: {
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(228, 169, 69, 0.12)"
  },
  quizOptionCorrect: {
    borderColor: "rgba(86, 211, 139, 0.70)",
    backgroundColor: "rgba(86, 211, 139, 0.12)"
  },
  quizOptionWrong: {
    borderColor: "rgba(255, 91, 91, 0.65)",
    backgroundColor: "rgba(255, 91, 91, 0.10)"
  },
  quizOptionText: {
    color: "#D6D6D6",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  quizOptionTextSelected: {
    color: colors.white
  },
  quizOptionTextCorrect: {
    color: "#56D38B"
  },
  quizOptionTextWrong: {
    color: "#FF8A8A"
  },
  feedbackBox: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  feedbackText: {
    color: "#D6D6D6",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  },
  quizResultBox: {
    borderWidth: 1,
    borderColor: "rgba(86, 211, 139, 0.30)",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: "rgba(86, 211, 139, 0.08)",
    gap: spacing.xs
  },
  takeawayHero: {
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: "rgba(228, 169, 69, 0.12)"
  },
  takeawayHeroText: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "800"
  },
  lessonCompletedPanel: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: "rgba(228, 169, 69, 0.08)"
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: "rgba(228, 169, 69, 0.10)"
  },
  xpBadgeText: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "900"
  },
  lessonCompletedTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800"
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8
  },
  contentText: {
    color: colors.white,
    fontSize: 14,
    flex: 1,
    lineHeight: 20
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs
  }
});
