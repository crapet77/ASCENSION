import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AcademyChapter,
  AcademyLevel,
  AcademyLesson,
  AcademyLessonContent,
  AcademyModule,
  AcademyProfile,
  AcademyQuizQuestion
} from "@/engine/academy/model";

export const ACADEMY_ENGINE_STORAGE_KEY = "@ascension/engine/academy/v1";

const localAcademyLevels: AcademyLevel[] = [
  createLevel({
    id: "level-1-foundations",
    order: 1,
    title: "Niveau 1 : Les Fondations",
    category: "foundations",
    description: "Comprendre l'argent avant de chercher la performance.",
    status: "in_progress",
    unlocks: [],
    chapters: [
      createChapter(
        "discipline-money",
        "Chapitre 1 : Discipline & argent",
        "Construire une base solide avant de chercher à gagner plus.",
        [
          createLessonSeed(
            "Pourquoi la discipline vaut plus que l'argent",
            "6 min",
            "La discipline n'est pas une règle triste. C'est la force qui te permet de garder le cap quand la tentation arrive.",
            "Une règle simple suivie chaque semaine vaut plus qu'une bonne idée de temps en temps.",
            createQuizQuestions([
              {
                question: "Quel comportement protège le plus la stabilité financière à court terme ?",
                options: ["Suivre une règle simple et régulière", "Multiplier les dépenses", "Attendre un gain miraculeux"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi la discipline aide-t-elle à mieux décider ?",
                options: ["Parce qu'elle réduit les mouvements émotionnels", "Parce qu'elle supprime le besoin d'épargner", "Parce qu'elle garantit un rendement immédiat"],
                correctOptionIndex: 0
              },
              {
                question: "Que favorise une discipline financière claire ?",
                options: ["Une vision plus stable de ses priorités", "Une hausse artificielle des dépenses", "Une dépendance aux impulsions"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Tu n'as pas besoin d'être motivé à chaque instant pour avancer.",
                "Une règle claire te protège quand l'émotion prend le dessus."
              ],
              example: "Tu décides d'envoyer 50 € sur ton épargne chaque vendredi, même si tu as envie d'acheter autre chose.",
              takeaway: "Une règle simple suivie chaque semaine vaut plus qu'une bonne idée de temps en temps."
              }
            ),
          createLessonSeed(
            "Les intérêts composés",
            "7 min",
            "L'argent ne grandit pas seulement parce que tu en mets. Il grandit parce que tu lui laisses du temps.",
            "Le plus tôt tu commences, plus le temps devient ton allié.",
            createQuizQuestions([
              {
                question: "Quel rôle joue le temps dans les intérêts composés ?",
                options: ["Il fait grossir progressivement le capital", "Il annule les intérêts", "Il remplace l'épargne"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi commencer tôt est-il précieux ?",
                options: ["Parce que chaque petite somme a plus de temps pour fructifier", "Parce que le rendement devient instantané", "Parce que les frais disparaissent tout de suite"],
                correctOptionIndex: 0
              },
              {
                question: "Quel geste profite le plus aux intérêts composés ?",
                options: ["Ajouter régulièrement une petite somme", "Retirer tout l'argent d'un coup", "Éviter tout placement"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Un petit montant récurrent peut devenir puissant à long terme.",
                "Le vrai levier, c'est la régularité et la patience."
              ],
              example: "Tu mets 30 € par mois sur un placement simple et tu laisses l'effet du temps faire le reste.",
              takeaway: "Le plus tôt tu commences, plus le temps devient ton allié."
              }
            ),
          createLessonSeed(
            "Budget personnel",
            "7 min",
            "Chaque euro que tu reçois doit avoir une mission.\n\nLe budget est l'outil qui te permet de décider où ton argent va travailler.",
            "Chaque euro doit avoir une mission avant d'être dépensé.",
            createQuizQuestions([
              {
                question: "Quel est l'objectif principal d'un budget personnel ?",
                options: ["Voir où chaque euro est utilisé", "Augmenter les dépenses de façon spontanée", "Supprimer toutes les priorités"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi faut-il relire son budget ?",
                options: ["Pour ajuster les dépenses à ses vrais priorités", "Pour justifier des achats impulsifs", "Pour ignorer les écarts"],
                correctOptionIndex: 0
              },
              {
                question: "Avant de dépenser, que permet un budget ?",
                options: ["De décider si cette dépense sert vraiment un objectif", "De supprimer toute planification", "De multiplier les imprévus"],
                correctOptionIndex: 0
              }
            ])
          ),
          createLessonSeed(
            "Épargne de sécurité",
            "6 min",
            "Une réserve n'est pas un frein. C'est la protection qui te permet d'avancer sans paniquer.",
            "Une petite sécurité aujourd'hui évite de grosses décisions sous pression demain.",
            createQuizQuestions([
              {
                question: "À quoi sert principalement une épargne de sécurité ?",
                options: ["À absorber les surprises sans casser le plan", "À remplacer tous les investissements", "À financer des dépenses inutiles"],
                correctOptionIndex: 0
              },
              {
                question: "Quel type d'événement cette épargne aide-t-elle à couvrir ?",
                options: ["Une réparation d'urgence ou une baisse de revenus", "Un achat impulsif de luxe", "Un gain de hasard"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi garder une réserve est-il rassurant ?",
                options: ["Parce qu'on évite de paniquer face à l'imprévu", "Parce qu'on n'a plus besoin de budget", "Parce qu'on peut dépenser sans limite"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "La sécurité n'est pas un luxe, c'est une base pour rester calme.",
                "Quand l'imprévu arrive, tu veux déjà avoir une réponse simple."
              ],
              example: "Tu gardes 300 € de côté pour couvrir une réparation ou une baisse de revenus sans bouleverser ton plan.",
              takeaway: "Une petite sécurité aujourd'hui évite de grosses décisions sous pression demain."
            }
          ),
          createLessonSeed(
            "Les mauvaises dettes",
            "7 min",
            "Toutes les dettes ne se ressemblent pas. Certaines ralentissent ta vie, d'autres servent un vrai projet.",
            "Une dette doit toujours être pensée comme un coût de temps, d'énergie et de paix mentale.",
            createQuizQuestions([
              {
                question: "Quelle dette mérite le plus d'attention ?",
                options: ["La dette qui finance un consommable sans retour durable", "La dette liée à un actif productif", "La dette contractée avec un plan clair"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi une mauvaise dette peut ralentir la progression ?",
                options: ["Parce qu'elle consomme de l'énergie et du cash-flow", "Parce qu'elle augmente automatiquement les revenus", "Parce qu'elle rend la planification inutile"],
                correctOptionIndex: 0
              },
              {
                question: "Que faut-il regarder avant d'emprunter ?",
                options: ["Si l'argent emprunté crée un vrai bénéfice ou un simple confort", "Si la dette peut être cachée longtemps", "Si les mensualités sont toujours petites"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Une dette ne doit pas être un réflexe de confort.",
                "Avant d'emprunter, demande-toi si ça sert vraiment ton projet."
              ],
              example: "Tu refuses un crédit pour un achat qui ne te rendra rien à long terme et tu attendes d'avoir un vrai besoin.",
              takeaway: "Une dette doit toujours être pensée comme un coût de temps, d'énergie et de paix mentale."
            }
          )
        ]
      ),
      createChapter(
        "habits-goals",
        "Chapitre 2 : Habitudes & objectifs",
        "Transformer les bonnes intentions en habitudes simples et durables.",
        [
          createLessonSeed(
            "Les bonnes habitudes financières",
            "6 min",
            "Une bonne habitude n'a pas besoin d'être spectaculaire. Elle doit juste être répétée assez souvent pour devenir naturelle.",
            "Le vrai levier, c'est la régularité, pas la motivation d'un instant.",
            createQuizQuestions([
              {
                question: "Quelle qualité a le plus d'impact sur la progression financière ?",
                options: ["La régularité de petits gestes", "L'achat impulsif", "La multiplication des promesses"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi une habitude simple est-elle plus efficace qu'un effort isolé ?",
                options: ["Parce qu'elle se répète et devient durable", "Parce qu'elle supprime toute réflexion", "Parce qu'elle élimine la nécessité de planifier"],
                correctOptionIndex: 0
              },
              {
                question: "Quel est le meilleur levier pour construire une habitude financière solide ?",
                options: ["Une routine légère mais répétée", "Un changement radical chaque semaine", "Un manque de suivi"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Les habitudes simples sont plus faciles à garder que les grands plans.",
                "Quand le geste est petit, tu as plus de chances de le refaire."
              ],
              example: "Tu commandes un transfert automatique de 20 € chaque semaine au lieu d'attendre d'avoir envie de faire l'effort.",
              takeaway: "Le vrai levier, c'est la régularité, pas la motivation d'un instant."
              }
            ),
          createLessonSeed(
            "Les erreurs des débutants",
            "6 min",
            "Le problème n'est pas toujours le manque d'effort. C'est souvent le fait de vouloir changer trop de choses à la fois.",
            "Le meilleur progrès vient souvent de la simplicité et de la patience.",
            createQuizQuestions([
              {
                question: "Quelle erreur est fréquente chez les débutants ?",
                options: ["Essayer de corriger tout d'un coup", "Suivre un plan très simple", "Établir une réserve de sécurité"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi trop de changements en même temps peuvent nuire ?",
                options: ["Parce qu'ils dispersent l'attention et l'énergie", "Parce qu'ils rendent l'épargne automatique", "Parce qu'ils simplifient la prise de décision"],
                correctOptionIndex: 0
              },
              {
                question: "Quel est le meilleur réflexe face à un début difficile ?",
                options: ["Rester simple et progresser étape par étape", "Tout abandonner immédiatement", "Multiplier les risques"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Le plus gros piège, c'est souvent l'excès d'ambition.",
                "Quand tu changes trop de choses, tu finis par ne rien faire vraiment."
              ],
              example: "Au lieu de réformer tous tes frais d'un coup, tu choisis d'abord une seule règle à suivre pendant 2 semaines.",
              takeaway: "Le meilleur progrès vient souvent de la simplicité et de la patience."
              }
            ),
          createLessonSeed(
            "Le pouvoir du temps",
            "7 min",
            "Le temps ne fait pas tout seul. Il fait surtout des choses possibles quand tu restes régulier.",
            "Une action régulière, même petite, devient un moteur de transformation.",
            createQuizQuestions([
              {
                question: "Pourquoi le temps est-il un allié dans la construction de richesse ?",
                options: ["Parce qu'il accroît l'effet des actions régulières", "Parce qu'il supprime la nécessité de choisir", "Parce qu'il rend les erreurs inoffensives"],
                correctOptionIndex: 0
              },
              {
                question: "Que permet une action régulière sur le long terme ?",
                options: ["De transformer de petits efforts en résultats plus grands", "De remplacer toute stratégie par du hasard", "D'éliminer le besoin de patience"],
                correctOptionIndex: 0
              },
              {
                question: "Quel message ce chapitre transmet-il le plus clairement ?",
                options: ["Il faut commencer tôt et persévérer", "Il faut attendre le bon moment parfait", "Il faut éviter toute répétition"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Ce qui se répète finit par compter.",
                "Le temps transforme les petits gestes en résultats visibles."
              ],
              example: "Tu continues à mettre 20 € chaque mois, même quand le résultat n'est pas encore spectaculaire.",
              takeaway: "Une action régulière, même petite, devient un moteur de transformation."
              }
            ),
          createLessonSeed(
            "Inflation",
            "6 min",
            "L'inflation n'est pas qu'un mot de finance. C'est la force qui fait perdre de la valeur à l'argent laissé sans mouvement.",
            "Comprendre l'inflation aide à protéger ton pouvoir d'achat.",
            createQuizQuestions([
              {
                question: "Que fait l'inflation sur l'argent laissé au repos ?",
                options: ["Elle réduit son pouvoir d'achat", "Elle le rend plus stable à court terme", "Elle augmente sa valeur sans effort"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi l'inflation peut-elle gêner les objectifs financiers ?",
                options: ["Parce qu'elle fait perdre de la valeur à l'argent non protégé", "Parce qu'elle rend tous les prix plus bas", "Parce qu'elle supprime les coûts de la vie"],
                correctOptionIndex: 0
              },
              {
                question: "Quel comportement aide à mieux gérer l'inflation ?",
                options: ["Faire fructifier son argent au lieu de le laisser inactif", "Éviter toute comparaison avec les prix", "Dépenser plus sans regarder l'évolution"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "L'argent dormant perd du pouvoir d'achat au fil du temps.",
                "Le vrai enjeu, c'est de faire travailler ton argent au lieu de le laisser au repos."
              ],
              example: "Tu ne laisses pas ton épargne sans plan, parce que l'inflation la ronge doucement chaque année.",
              takeaway: "Comprendre l'inflation aide à protéger ton pouvoir d'achat."
              }
            ),
          createLessonSeed(
            "Objectifs financiers",
            "7 min",
            "Un objectif clair n'est pas un rêve flou. C'est une direction que tu peux suivre sans te perdre.",
            "Un bon objectif doit être simple, mesurable et réaliste.",
            createQuizQuestions([
              {
                question: "Quel est le premier pas vers un objectif financier clair ?",
                options: ["Définir une cible simple et mesurable", "Augmenter ses dépenses sans contrôle", "Reporter toute décision à plus tard"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi un objectif doit-il être précis ?",
                options: ["Parce qu'il donne une direction visible et mesurable", "Parce qu'il supprime la nécessité d'agir", "Parce qu'il évite toute réflexion"],
                correctOptionIndex: 0
              },
              {
                question: "Que permet un objectif financier bien formulé ?",
                options: ["De choisir des actions cohérentes avec sa priorité", "De multiplier les dépenses impulsives", "D'ignorer l'échéancier"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Un objectif vague ne donne pas de direction.",
                "Quand la cible est claire, les choix deviennent plus simples."
              ],
              example: "Tu te fixes un objectif simple : épargner 500 € d'ici trois mois pour créer une réserve.",
              takeaway: "Un bon objectif doit être simple, mesurable et réaliste."
            }
          )
        ]
      )
    ]
  }),
  createLevel({
    id: "level-2-investment",
    order: 2,
    title: "Niveau 2 : Investissement",
    category: "investment",
    description: "Découvrir les bases de l'investissement long terme.",
    status: "locked",
    unlocks: [],
    chapters: [
      createChapter("compound-interest", "Intérêts composés", "Comprendre comment le temps transforme une petite régularité en grand écart."),
      createChapter("etf", "ETF", "Découvrir les fonds indiciels comme outil simple de diversification."),
      createChapter("stocks", "Actions", "Comprendre ce que signifie devenir propriétaire d'une fraction d'entreprise."),
      createChapter("diversification", "Diversification", "Répartir le risque pour éviter qu'une seule décision décide de tout."),
      createChapter("inflation", "Inflation", "Comprendre pourquoi l'argent immobile perd du pouvoir d'achat.")
    ]
  }),
  createLevel({
    id: "level-3-risk",
    order: 3,
    title: "Niveau 3 : Gestion du risque",
    category: "risk",
    description: "Apprendre à protéger son capital et sa psychologie.",
    status: "locked",
    unlocks: [],
    chapters: [
      createChapter("psychology", "Psychologie", "Identifier les émotions qui poussent aux mauvaises décisions."),
      createChapter("capital-management", "Gestion du capital", "Décider à l'avance combien risquer et pourquoi."),
      createChapter("mistakes", "Erreurs à éviter", "Reconnaître les pièges classiques : précipitation, surconfiance, revanche."),
      createChapter("discipline", "Discipline", "Répéter une bonne méthode même quand le résultat immédiat déçoit."),
      createChapter("goals", "Objectifs", "Transformer une ambition vague en trajectoire mesurable.")
    ]
  }),
  createLevel({
    id: "level-4-opportunities",
    order: 4,
    title: "Niveau 4 : Opportunités",
    category: "opportunities",
    description: "Lire les opportunités sans oublier le risque.",
    status: "locked",
    unlocks: ["sport", "markets", "ai"],
    chapters: [
      createChapter("financial-markets", "Marchés financiers", "Comprendre qu'un signal n'est jamais une certitude."),
      createChapter("crypto", "Crypto", "Approcher les actifs numériques avec prudence et méthode."),
      createChapter("commodities", "Matières premières", "Lire l'or, l'énergie ou les matières premières comme des marchés cycliques."),
      createChapter("responsible-sports", "Paris sportifs responsables", "Analyser un pari comme une décision de risque, pas comme une promesse de gain.")
    ]
  })
];

const localAcademyProfile: AcademyProfile = {
  academyVersion: "v2",
  xp: 0,
  level: "Bronze",
  disciplineDays: 18,
  levels: localAcademyLevels,
  modules: createModulesFromLevels(localAcademyLevels),
  missions: [
    {
      id: "academy-foundations",
      title: "Fondations",
      description: "Valider les bases de l'éducation financière.",
      xpReward: 120,
      status: "active"
    },
    {
      id: "academy-risk",
      title: "Gestion du risque",
      description: "Comprendre la discipline avant les opportunités.",
      xpReward: 150,
      status: "active"
    }
  ],
  badges: [
    {
      id: "badge-foundations",
      title: "Fondations financières",
      unlocked: false
    },
    {
      id: "badge-certified-v2",
      title: "Parcours Ascension certifié",
      unlocked: false
    }
  ],
  updatedAt: new Date().toISOString()
};

export async function loadAcademyProfile() {
  const rawProfile = await AsyncStorage.getItem(ACADEMY_ENGINE_STORAGE_KEY);
  const storedProfile = rawProfile ? (JSON.parse(rawProfile) as AcademyProfile) : null;
  const shouldUseSeed = !isValidAcademyProfile(storedProfile);

  if (shouldUseSeed) {
    const fallbackProfile = buildFallbackAcademyProfile(storedProfile);
    await saveAcademyProfile(fallbackProfile);
    return fallbackProfile;
  }

  const repairedProfile: AcademyProfile = {
    ...storedProfile,
    academyVersion: storedProfile?.academyVersion ?? "v2",
    xp: storedProfile?.xp ?? localAcademyProfile.xp,
    level: storedProfile?.level ?? localAcademyProfile.level,
    disciplineDays: storedProfile?.disciplineDays ?? localAcademyProfile.disciplineDays,
    missions: storedProfile?.missions ?? localAcademyProfile.missions,
    badges: storedProfile?.badges ?? localAcademyProfile.badges,
    levels: storedProfile?.levels ?? localAcademyProfile.levels,
    modules: storedProfile?.modules?.length ? storedProfile.modules : createModulesFromLevels(storedProfile?.levels ?? localAcademyProfile.levels),
    updatedAt: storedProfile?.updatedAt ?? new Date().toISOString()
  };

  if (!hasLessonContent(repairedProfile.modules)) {
    const fallbackProfile = buildFallbackAcademyProfile(storedProfile);
    await saveAcademyProfile(fallbackProfile);
    return fallbackProfile;
  }

  return repairedProfile;
}

export async function saveAcademyProfile(profile: AcademyProfile) {
  await AsyncStorage.setItem(ACADEMY_ENGINE_STORAGE_KEY, JSON.stringify(profile));
}

export async function resetAcademyProfile() {
  await saveAcademyProfile(localAcademyProfile);
  return localAcademyProfile;
}

function buildFallbackAcademyProfile(storedProfile: AcademyProfile | null | undefined): AcademyProfile {
  return {
    academyVersion: "v2",
    xp: storedProfile?.xp ?? localAcademyProfile.xp,
    level: storedProfile?.level ?? localAcademyProfile.level,
    disciplineDays: storedProfile?.disciplineDays ?? localAcademyProfile.disciplineDays,
    levels: localAcademyProfile.levels,
    modules: localAcademyProfile.modules,
    missions: storedProfile?.missions ?? localAcademyProfile.missions,
    badges: storedProfile?.badges ?? localAcademyProfile.badges,
    updatedAt: new Date().toISOString()
  };
}

function isValidAcademyProfile(profile: AcademyProfile | null | undefined) {
  if (!profile || profile.academyVersion !== "v2") {
    return false;
  }

  const hasLevels = Array.isArray(profile.levels) && profile.levels.length > 0;
  const hasModules = Array.isArray(profile.modules) && profile.modules.length > 0;

  return hasLevels && hasModules && hasLessonContent(profile.modules);
}

function hasLessonContent(modules: AcademyModule[] | undefined) {
  return Boolean(
    Array.isArray(modules) &&
      modules.some((module) => Array.isArray(module.lessons) && module.lessons.length > 0)
  );
}

function createLevel(params: Omit<AcademyLevel, "certification">): AcademyLevel {
  const chapters = params.status === "in_progress"
    ? params.chapters.map((chapter, index) => ({
        ...chapter,
        status: index === 0 ? "in_progress" as const : chapter.status,
        quiz: index === 0 ? { ...chapter.quiz, status: "available" as const } : chapter.quiz
      }))
    : params.chapters;

  return {
    ...params,
    chapters,
    certification: {
      id: `certification-${params.id}`,
      title: `Certification ${params.title}`,
      requiredScore: 80,
      xpReward: 80,
      status: params.status === "locked" ? "locked" : "in_progress"
    }
  };
}

function createChapter(id: string, title: string, shortLesson: string, lessons?: AcademyLesson[], content?: AcademyLessonContent): AcademyChapter {
  const lessonsQuestions = content?.quizQuestions ?? [
    {
      id: `question-${id}`,
      question: `Quel est le principe clé du chapitre "${title}" ?`,
      options: ["Comprendre avant d'agir", "Agir sans mesurer", "Chercher le gain rapide"],
      correctOptionIndex: 0
    }
  ];

  return {
    id: `chapter-${id}`,
    title,
    shortLesson,
    estimatedMinutes: content?.estimatedMinutes ?? 7,
    summary: `À retenir : ${shortLesson}`,
    illustration: `academy-${id}`,
    xpReward: 20,
    badgeTitle: title,
    status: "locked",
    content,
    lessons,
    quiz: {
      id: `quiz-${id}`,
      title: `Quiz : ${title}`,
      xpReward: 15,
      requiredScore: 80,
      status: "locked",
      questions: lessonsQuestions
    }
  };
}

function createModulesFromLevels(levels: AcademyLevel[]): AcademyModule[] {
  return levels.map((level) => {
    const isLocked = level.status === "locked";
    const firstChapter = level.chapters[0];
    const firstChapterQuestions = firstChapter?.content?.quizQuestions ?? firstChapter?.quiz.questions;
    const lessonSeeds = level.chapters.flatMap((chapter) => chapter.lessons ?? []);

    return {
      id: level.id,
      title: level.title,
      description: level.description,
      category: level.category === "opportunities" ? "markets" : "finance",
      order: level.order,
      required: true,
      status: level.status === "certified" ? "completed" : isLocked ? "locked" : "available",
      lessons: lessonSeeds.length
        ? lessonSeeds.map((lesson, index) => ({
            ...lesson,
            id: lesson.id,
            title: lesson.title,
            description: lesson.summary ?? lesson.description,
            xpReward: lesson.xpReward,
            status: level.status === "certified"
              ? "completed" as const
              : isLocked || (level.order === 1 && index > 0 && firstChapter.status === "locked")
                ? "locked" as const
                : "available" as const,
            completedAt: undefined,
            intro: lesson.intro,
            sections: lesson.sections,
            takeaway: lesson.takeaway,
            example: lesson.example,
            estimatedMinutes: lesson.estimatedMinutes,
            content: lesson.content,
            summary: lesson.summary,
            duration: lesson.duration,
            quizQuestions: lesson.quizQuestions,
            successMessage: lesson.successMessage
          }))
        : level.chapters.map((chapter, index) => ({
            id: chapter.id,
            title: chapter.title,
            description: chapter.summary,
            xpReward: chapter.xpReward,
            status: chapter.status === "validated" || chapter.status === "certified"
              ? "completed"
              : isLocked || (level.order === 1 && index > 0 && firstChapter.status === "locked")
                ? "locked"
                : "available",
            completedAt: chapter.completedAt,
            intro: chapter.content?.intro,
            sections: chapter.content?.sections,
            takeaway: chapter.content?.takeaway,
            example: chapter.content?.example,
            estimatedMinutes: chapter.content?.estimatedMinutes,
            quizQuestions: chapter.content?.quizQuestions,
            successMessage: chapter.content?.successMessage
          })),
      quiz: {
        ...level.certification,
        status: level.certification.status === "certified" ? "passed" : level.certification.status === "locked" ? "locked" : "available",
        questions: level.order === 1 && firstChapterQuestions?.length ? firstChapterQuestions : level.chapters.flatMap((chapter) => chapter.quiz.questions)
      },
      unlocks: level.unlocks
    };
  });
}

function createLessonSeed(
  title: string,
  duration: string,
  content: string,
  summary: string,
  quizQuestions: AcademyQuizQuestion[],
  lessonDetails?: {
    intro?: string;
    sections?: string[];
    takeaway?: string;
    example?: string;
  }
): AcademyLesson {
  return {
    id: `lesson-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    title,
    description: summary,
    xpReward: 20,
    status: "available",
    intro: lessonDetails?.intro ?? content,
    sections: lessonDetails?.sections ?? [content, summary],
    takeaway: lessonDetails?.takeaway ?? summary,
    example: lessonDetails?.example ?? `Exemple concret : applique cette règle sur une décision simple de la semaine.`,
    estimatedMinutes: Number(duration.split(" ")[0]),
    content,
    summary,
    duration,
    quizQuestions,
    successMessage: `Bravo ! Tu as compris la leçon « ${title} ».`
  };
}

function createQuizQuestions(questions: Array<{ question: string; options: string[]; correctOptionIndex: number }>) {
  return questions.map((q, index) => ({
    id: `quiz-question-${index + 1}`,
    question: q.question,
    options: q.options,
    correctOptionIndex: q.correctOptionIndex
  }));
}

function createLessonContent(
  intro: string,
  sections: string[],
  takeaway: string,
  example: string,
  estimatedMinutes: number,
  quizQuestions: AcademyLessonContent["quizQuestions"],
  successMessage: string
): AcademyLessonContent {
  return {
    intro,
    sections,
    takeaway,
    example,
    estimatedMinutes,
    quizQuestions,
    successMessage
  };
}
