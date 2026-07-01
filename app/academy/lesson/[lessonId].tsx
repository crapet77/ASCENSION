import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
    () => module?.lessons.find((item) => item.id === lessonId) ?? null,
    [module, lessonId]
  );

  const lessonMeta = useMemo(() => getLessonContent(module, lesson), [module, lesson]);
  const isCompleted = lesson?.status === "completed";
  const isBudgetLesson = lesson?.title?.toLowerCase().includes("budget") ?? false;
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

  return (
    <AppScreen>
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

        {isBudgetLesson ? (
          <>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.summary}>{lessonMeta.intro}</Text>

            <View style={styles.premiumPanel}>
              <Text style={styles.sectionTitle}>Exemple concret</Text>
              <Text style={styles.summary}>Imagine une personne qui gagne 2 000 € par mois.</Text>
              <View style={styles.exampleList}>
                <View style={styles.exampleRow}>
                  <View style={styles.exampleIconWrap}>
                    <Ionicons name="home-outline" size={16} color={colors.gold} />
                  </View>
                  <View style={styles.exampleCopy}>
                    <Text style={styles.exampleLabel}>Dépenses obligatoires</Text>
                    <Text style={styles.exampleAmount}>1 100 €</Text>
                  </View>
                </View>
                <View style={styles.exampleRow}>
                  <View style={styles.exampleIconWrap}>
                    <Ionicons name="happy-outline" size={16} color={colors.gold} />
                  </View>
                  <View style={styles.exampleCopy}>
                    <Text style={styles.exampleLabel}>Loisirs</Text>
                    <Text style={styles.exampleAmount}>250 €</Text>
                  </View>
                </View>
                <View style={styles.exampleRow}>
                  <View style={styles.exampleIconWrap}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={colors.gold} />
                  </View>
                  <View style={styles.exampleCopy}>
                    <Text style={styles.exampleLabel}>Épargne de sécurité</Text>
                    <Text style={styles.exampleAmount}>250 €</Text>
                  </View>
                </View>
                <View style={styles.exampleRow}>
                  <View style={styles.exampleIconWrap}>
                    <Ionicons name="trending-up-outline" size={16} color={colors.gold} />
                  </View>
                  <View style={styles.exampleCopy}>
                    <Text style={styles.exampleLabel}>Investissement</Text>
                    <Text style={styles.exampleAmount}>400 €</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.premiumPanel}>
              <Text style={styles.sectionTitle}>Erreur fréquente</Text>
              <Text style={styles.summary}>Beaucoup de personnes dépensent d’abord puis épargnent ce qu’il reste. La bonne méthode consiste à attribuer une mission à chaque euro dès la réception du salaire.</Text>
            </View>

            <View style={styles.callout}>
              <Text style={styles.calloutLabel}>À retenir</Text>
              <Text style={styles.calloutText}>{lessonMeta.takeaway}</Text>
            </View>

            <View style={styles.actionBox}>
              <Text style={styles.sectionTitle}>🎯 Aujourd’hui</Text>
              <Text style={styles.summary}>Répartis ton prochain salaire en quatre catégories :</Text>
              <View style={styles.actionList}>
                <Text style={styles.actionItem}>• Dépenses</Text>
                <Text style={styles.actionItem}>• Loisirs</Text>
                <Text style={styles.actionItem}>• Épargne</Text>
                <Text style={styles.actionItem}>• Investissement</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.summary}>{lessonMeta.intro}</Text>

            <View style={styles.contentBox}>
              {lessonMeta.sections.map((point) => (
                <View key={point} style={styles.contentRow}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={colors.gold} />
                  <Text style={styles.contentText}>{point}</Text>
                </View>
              ))}
            </View>

            <View style={styles.callout}>
              <Text style={styles.calloutLabel}>À retenir</Text>
              <Text style={styles.calloutText}>{lessonMeta.takeaway}</Text>
            </View>

            <View style={styles.exampleBox}>
              <Text style={styles.sectionTitle}>Exemple concret</Text>
              <Text style={styles.summary}>{lessonMeta.example}</Text>
            </View>
          </>
        )}

        <View style={styles.actions}>
          <PremiumButton
            label={isCompleted ? "Leçon déjà validée" : nextActionLabel}
            icon="checkmark-circle"
            onPress={completeLesson}
            disabled={isCompleting || isCompleted}
          />
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={styles.sectionTitle}>Pourquoi c’est utile</Text>
        <Text style={styles.summary}>
          Cette leçon te donne une base solide pour prendre des décisions plus lucides, plus disciplinées et plus cohérentes avec ton plan.
        </Text>
      </GlassCard>
    </AppScreen>
  );
}

function getLessonContent(module: AcademyModule | null, lesson: AcademyLesson | null) {
  const title = lesson?.title ?? "Leçon";
  const moduleTitle = module?.title ?? "Academy";
  const xpReward = lesson?.xpReward ?? 20;

  if (lesson?.intro && lesson.sections?.length && lesson.takeaway && lesson.example) {
    return {
      duration: `${lesson.estimatedMinutes ?? 7} min`,
      intro: lesson.intro,
      sections: lesson.sections,
      takeaway: lesson.takeaway,
      example: lesson.example,
      xpReward,
      points: lesson.sections
    };
  }

  if (title.toLowerCase().includes("argent") || title.toLowerCase().includes("budget") || title.toLowerCase().includes("épargne")) {
    return {
      duration: "7 min",
      intro: title.toLowerCase().includes("budget")
        ? "Chaque euro que tu reçois doit avoir une mission.\n\nLe budget est l'outil qui te permet de décider où ton argent va travailler."
        : `Dans ${moduleTitle}, cette leçon te montre comment ${title.toLowerCase()} sans perdre de vue l’objectif global.`,
      sections: [
        "Identifier l’idée centrale à retenir",
        "Appliquer la logique à un cas simple",
        "Transposer la méthode à ta situation"
      ],
      takeaway: "La discipline transforme l'argent en outil de vie, pas en source d'instabilité.",
      example: "Un budget simple, respecté chaque semaine, vaut souvent mieux qu'un gain ponctuel mal géré.",
      xpReward,
      points: [
        "Identifier l’idée centrale à retenir",
        "Appliquer la logique à un cas simple",
        "Transposer la méthode à ta situation"
      ]
    };
  }

  if (title.toLowerCase().includes("risque") || title.toLowerCase().includes("psychologie") || title.toLowerCase().includes("discipline")) {
    return {
      duration: "8 min",
      intro: `Cette étape renforce ta capacité à ${title.toLowerCase()} avant de prendre une décision importante.`,
      sections: [
        "Repérer les pièges émotionnels",
        "Choisir une règle simple à suivre",
        "Préserver ton capital et ta clarté"
      ],
      takeaway: "Une règle simple est plus forte qu'un sentiment de court terme.",
      example: "Même avec un bon signal, tu ne prends pas de risque si ta méthode te dit de ne pas agir.",
      xpReward,
      points: [
        "Repérer les pièges émotionnels",
        "Choisir une règle simple à suivre",
        "Préserver ton capital et ta clarté"
      ]
    };
  }

  return {
    duration: "6 min",
    intro: `Cette leçon t’aide à intégrer les bases de ${moduleTitle.toLowerCase()} avec un contenu simple, concret et immédiatement applicable.`,
    sections: [
      "Comprendre l’enjeu de la leçon",
      "Retenir le réflexe principal",
      "Continuer le chapitre pour valider la progression"
    ],
    takeaway: "La progression vient de la répétition simple et régulière.",
    example: "Appliquer une méthode au quotidien crée plus de résultats qu'un apprentissage isolé.",
    xpReward,
    points: [
      "Comprendre l’enjeu de la leçon",
      "Retenir le réflexe principal",
      "Continuer le chapitre pour valider la progression"
    ]
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
