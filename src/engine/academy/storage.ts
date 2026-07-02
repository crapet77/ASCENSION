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
            "La discipline : le premier investissement",
            "6 min",
            "Beaucoup pensent que les personnes riches ont commencé avec plus d'argent.\n\nPourtant, ce n'est presque jamais le cas.\n\nCertaines gagnent 1 500 € par mois et deviennent financièrement libres.\n\nD'autres gagnent 10 000 € par mois et terminent endettées.\n\nPourquoi ?\n\nParce que l'argent ne crée pas les habitudes.\n\nLes habitudes créent l'argent.",
            "La liberté financière commence avec la discipline appliquée au premier euro gagné.",
            createQuizQuestions([
              {
                question: "Thomas gagne 2 000 € et dépense tout. Lucas gagne 2 000 € et met 10 € de côté par jour. Quelle différence compte vraiment ?",
                options: ["Leur discipline", "Leur salaire", "Leur chance"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi la phrase « J'investirai quand je gagnerai plus » est-elle dangereuse ?",
                options: ["Parce qu'elle repousse l'habitude au lieu de la construire", "Parce qu'il ne faut jamais investir", "Parce qu'un gros salaire garantit toujours la liberté"],
                correctOptionIndex: 0
              },
              {
                question: "Si tu économises 5 € par jour pendant un an, que prouves-tu surtout ?",
                options: ["Qu'une petite routine peut devenir un vrai résultat", "Que 5 € ne servent jamais à rien", "Que seule une grosse somme compte"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase correspond le mieux à la philosophie Ascension ?",
                options: ["Les habitudes créent l'argent", "L'argent crée automatiquement les habitudes", "La motivation suffit toujours"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle action montre le mieux que tu commences à contrôler ton argent ?",
                options: ["Noter toutes tes dépenses pendant 7 jours", "Attendre d'avoir plus de revenus", "Ignorer les petits achats"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "La motivation est une émotion.",
                "La discipline est une habitude.",
                "Les personnes qui réussissent construisent des routines."
              ],
              example: "Thomas et Lucas gagnent chacun 2 000 €. Thomas dépense tout. Lucas met simplement 10 € de côté chaque jour.",
              takeaway: "La liberté financière ne commence pas avec un gros salaire.\n\nElle commence le jour où tu contrôles le premier euro que tu gagnes."
              }
            ),
          createLessonSeed(
            "Les intérêts composés",
            "8 min",
            "Beaucoup pensent qu'il faut investir beaucoup pour devenir riche.\n\nEn réalité, les personnes qui réussissent commencent souvent avec de petites sommes.\n\nLeur véritable avantage n'est pas l'argent.\n\nC'est le temps.\n\nChaque année, leur argent travaille pendant qu'elles continuent leur vie.",
            "Le temps est l'investissement que personne ne peut acheter.",
            createQuizQuestions([
              {
                question: "Lucas commence à investir à 20 ans. Thomas commence à 35 ans. Pourquoi Lucas peut-il finir avec beaucoup plus ?",
                options: ["Son argent travaille plus longtemps", "Il investit forcément plus chaque mois", "Il évite tous les risques"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle idée résume le mieux les intérêts composés ?",
                options: ["Les intérêts produisent à leur tour des intérêts", "L'argent reste toujours identique", "Seules les grosses sommes peuvent progresser"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi attendre d'avoir plus d'argent peut coûter cher ?",
                options: ["Parce qu'on perd des années de croissance", "Parce qu'investir tôt supprime toutes les pertes", "Parce que les petites sommes sont inutiles"],
                correctOptionIndex: 0
              },
              {
                question: "Si tu ne peux investir que 20 € par mois aujourd'hui, quelle est souvent la meilleure décision ?",
                options: ["Commencer quand même pour créer l'habitude", "Attendre une somme parfaite", "Ne jamais investir"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase correspond le mieux à cette leçon ?",
                options: ["Commencer tôt est souvent plus puissant que commencer gros", "Le rendement est toujours garanti", "Le temps ne change rien"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Les intérêts produisent des intérêts.",
                "Ces nouveaux intérêts produisent encore d'autres intérêts.",
                "Le temps fait une grande partie du travail."
              ],
              example: "100 € investis chaque mois avec un rendement moyen de 8 % par an peuvent devenir environ 18 000 € après 10 ans, 59 000 € après 20 ans et 149 000 € après 30 ans.",
              takeaway: "Le temps est l'investissement que personne ne peut acheter.\n\nPlus tu commences tôt,\n\nplus ton argent aura le temps de travailler pour toi."
              }
            ),
          createLessonSeed(
            "Le budget : donne une mission à chaque euro",
            "8 min",
            "Quand on entend le mot \"budget\", on pense souvent à des restrictions.\n\nMoins sortir.\n\nMoins acheter.\n\nMoins profiter.\n\nPourtant...\n\nLes personnes financièrement libres utilisent un budget pour une raison totalement différente.\n\nElles veulent décider où va leur argent.\n\nPas se demander où il est parti.",
            "Chaque euro sans mission est un euro qui risque de disparaître.",
            createQuizQuestions([
              {
                question: "Emma dépense puis épargne ce qu'il reste. Julien répartit son salaire dès le premier jour. Quelle différence explique leur résultat ?",
                options: ["L'organisation de leur argent", "Le montant de leur salaire", "La chance uniquement"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi un budget n'est-il pas une punition ?",
                options: ["Parce qu'il donne une direction à l'argent", "Parce qu'il interdit tout plaisir", "Parce qu'il supprime toutes les dépenses"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi la phrase « J'épargnerai à la fin du mois » échoue souvent ?",
                options: ["Parce qu'il ne reste souvent plus rien", "Parce qu'épargner est inutile", "Parce que le budget doit être fait une fois par an"],
                correctOptionIndex: 0
              },
              {
                question: "Tu reçois 2 000 €. Quelle méthode donne le plus de contrôle ?",
                options: ["Attribuer une mission à chaque euro dès le départ", "Dépenser d'abord et regarder ensuite", "Éviter de suivre les petites dépenses"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase correspond le mieux à cette leçon ?",
                options: ["Le budget construit la liberté", "Le budget empêche de vivre", "Un budget sert seulement quand on gagne beaucoup"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Un budget consiste à donner une mission à chaque euro.",
                "Cette mission se décide avant même que le mois commence.",
                "Ton argent doit travailler pour toi."
              ],
              example: "Avec un salaire de 2 000 €, tu peux répartir 1 100 € en dépenses fixes, 250 € en loisirs, 250 € en épargne de sécurité, 300 € en investissements et 100 € en plaisir ou projets.",
              takeaway: "Chaque euro sans mission est un euro qui risque de disparaître.\n\nLe budget ne limite pas ta liberté.\n\nIl la construit."
            }
          ),
          createLessonSeed(
            "L'épargne de sécurité : ton premier bouclier financier",
            "8 min",
            "Une panne de voiture.\n\nUne machine à laver qui casse.\n\nUne facture imprévue.\n\nCes situations arrivent à tout le monde.\n\nLa différence n'est pas le problème.\n\nLa différence, c'est la préparation.\n\nUne épargne de sécurité transforme une urgence en simple contretemps.",
            "Une épargne de sécurité transforme une urgence en simple contretemps.",
            createQuizQuestions([
              {
                question: "Sophie paie une réparation de 900 € avec sa réserve. Marc s'endette. Quelle différence compte vraiment ?",
                options: ["La préparation", "Le montant de la réparation", "La chance uniquement"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi une épargne de sécurité n'est-elle pas un investissement ?",
                options: ["Parce qu'elle sert d'abord à protéger", "Parce qu'elle doit rapporter le plus possible", "Parce qu'elle doit être risquée"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi investir tout son argent sans réserve peut être dangereux ?",
                options: ["Parce qu'un imprévu peut forcer à vendre au mauvais moment", "Parce qu'investir est toujours interdit", "Parce qu'une réserve empêche de progresser"],
                correctOptionIndex: 0
              },
              {
                question: "Tu disposes de 2 000 € et aucune réserve. Quelle décision est souvent la plus solide ?",
                options: ["Construire une réserve avant d'investir", "Investir immédiatement tout l'argent", "Dépenser pour éviter de réfléchir"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase correspond le mieux à cette leçon ?",
                options: ["La sécurité permet d'investir plus sereinement", "La sécurité remplace tous les objectifs", "Une réserve ne sert jamais"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Une épargne de sécurité n'est pas là pour rapporter de l'argent.",
                "Elle protège ton équilibre financier.",
                "Elle évite de vendre tes investissements dans l'urgence."
              ],
              example: "Si tes dépenses mensuelles sont de 1 600 €, un mois de réserve représente 1 600 €, trois mois 4 800 € et six mois 9 600 €.",
              takeaway: "Une épargne de sécurité ne te rend pas riche.\n\nElle t'empêche simplement de redevenir pauvre au premier imprévu."
            }
          ),
          createLessonSeed(
            "Les mauvaises dettes : l'argent qui travaille contre toi",
            "8 min",
            "Emprunter n'est pas forcément une erreur.\n\nLe véritable danger est d'emprunter pour acheter quelque chose qui perd de la valeur ou qui ne t'apporte rien à long terme.\n\nChaque mensualité réduit une partie de ta liberté.\n\nAvant de signer un crédit, pose-toi une question :\n\n\"Est-ce que cet achat améliore vraiment mon avenir ?\"",
            "Une mauvaise dette ne te vole pas seulement de l'argent.",
            createQuizQuestions([
              {
                question: "Julie emprunte 3 000 € pour un téléphone alors que le sien fonctionne. Quel est le vrai risque ?",
                options: ["Créer une contrainte durable pour un plaisir court", "Améliorer automatiquement son avenir", "Supprimer toutes ses dépenses"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi « ce n'est que 40 € par mois » peut être dangereux ?",
                options: ["Parce que plusieurs petites mensualités peuvent peser lourd", "Parce que 40 € ne comptent jamais", "Parce qu'une mensualité ne dure jamais longtemps"],
                correctOptionIndex: 0
              },
              {
                question: "Avant un crédit, quelle question protège le mieux ta liberté ?",
                options: ["Est-ce que cet achat améliore vraiment mon avenir ?", "Est-ce que je peux ignorer le coût total ?", "Est-ce que la mensualité semble petite ?"],
                correctOptionIndex: 0
              },
              {
                question: "Un téléphone coûte 1 500 € comptant ou 1 680 € à crédit. Que faut-il regarder ?",
                options: ["Le coût total et la valeur réelle de l'achat", "Uniquement la mensualité", "Uniquement l'envie du moment"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase correspond le mieux à cette leçon ?",
                options: ["Une mauvaise dette réduit tes choix futurs", "Toute dette est forcément mauvaise", "Une dette rend toujours plus libre"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Une mauvaise dette sert souvent à financer un plaisir immédiat.",
                "Le plaisir dure quelques jours.",
                "Les mensualités peuvent durer plusieurs années."
              ],
              example: "Un téléphone à 1 500 € peut coûter 1 680 € avec 24 mensualités de 70 €, pendant que le téléphone perd de la valeur.",
              takeaway: "Une mauvaise dette ne te vole pas seulement de l'argent.\n\nElle réduit aussi tes choix futurs."
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
            "8 min",
            "Beaucoup de personnes pensent qu'il faut une idée géniale ou un énorme salaire pour réussir.\n\nEn réalité, ce sont souvent les petits gestes répétés chaque semaine qui font toute la différence.\n\nÉpargner.\n\nSuivre ses dépenses.\n\nInvestir régulièrement.\n\nLire quelques pages.\n\nCes habitudes semblent insignifiantes aujourd'hui, mais elles deviennent puissantes avec le temps.",
            "Tu n'as pas besoin d'être parfait.",
            createQuizQuestions([
              {
                question: "Sarah dépense d'abord. Nicolas épargne, investit et suit son budget chaque mois. Qu'est-ce qui explique surtout l'écart futur ?",
                options: ["Leurs habitudes répétées", "Une seule grande décision", "La chance uniquement"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi une petite action répétée peut dépasser une grande action occasionnelle ?",
                options: ["Parce que la répétition crée un effet durable", "Parce que les petites actions sont toujours faciles", "Parce qu'une seule action suffit toujours"],
                correctOptionIndex: 0
              },
              {
                question: "Quel est le meilleur premier pas pour créer une habitude financière ?",
                options: ["Choisir une seule habitude durable", "Changer dix choses en même temps", "Attendre d'être parfait"],
                correctOptionIndex: 0
              },
              {
                question: "Quel comportement a le plus de chances de construire un patrimoine ?",
                options: ["Investir un petit montant chaque mois pendant des années", "Investir beaucoup une seule fois sans routine", "Agir seulement quand la motivation arrive"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase correspond le mieux à cette leçon ?",
                options: ["La régularité compte plus que la perfection", "La perfection est obligatoire", "Les habitudes ne changent rien"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Une habitude est une action répétée jusqu'à devenir presque automatique.",
                "Quand une bonne habitude devient naturelle, tu n'as plus besoin d'y penser.",
                "Elle travaille pour toi."
              ],
              example: "Une routine mensuelle peut contenir : épargner 10 %, investir 10 %, vérifier son budget, lire 10 minutes sur la finance et mettre à jour ses objectifs.",
              takeaway: "Tu n'as pas besoin d'être parfait.\n\nTu as seulement besoin d'être régulier."
              }
            ),
          createLessonSeed(
            "Les erreurs des débutants",
            "8 min",
            "Personne ne naît en sachant gérer son argent.\n\nLes investisseurs expérimentés, les entrepreneurs et les personnes financièrement libres ont tous fait des erreurs.\n\nLa différence, ce n'est pas qu'ils en ont fait moins.\n\nC'est qu'ils en ont tiré des leçons.",
            "Les erreurs sont inévitables. Les répéter est un choix.",
            createQuizQuestions([
              {
                question: "Paul perd 200 € et abandonne. Claire perd 200 € et analyse son erreur. Quelle différence compte le plus ?",
                options: ["La capacité à apprendre de l'erreur", "Le montant perdu uniquement", "Le fait de ne plus jamais agir"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi une erreur faite tôt peut-elle coûter moins cher ?",
                options: ["Parce qu'elle permet d'apprendre avant de gérer de plus gros montants", "Parce qu'elle n'a aucune conséquence", "Parce qu'elle garantit les prochains gains"],
                correctOptionIndex: 0
              },
              {
                question: "Quel est le plus grand danger après une erreur financière ?",
                options: ["Répéter la même erreur sans l'analyser", "La reconnaître rapidement", "Adapter sa méthode"],
                correctOptionIndex: 0
              },
              {
                question: "Tu fais un mauvais investissement. Quelle réaction est la plus constructive ?",
                options: ["Comprendre ce qui n'a pas fonctionné avant de continuer", "Abandonner définitivement", "Recommencer immédiatement sans réflexion"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase correspond le mieux à cette leçon ?",
                options: ["Les erreurs sont inévitables, les répéter est un choix", "Une erreur prouve que tu es mauvais", "Il faut éviter tout apprentissage risqué"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Une erreur est une information.",
                "Elle te montre ce qu'il faut améliorer.",
                "Les personnes qui réussissent évitent surtout de refaire les mêmes erreurs."
              ],
              example: "Paul et Claire perdent chacun 200 €. Paul abandonne. Claire analyse son erreur et investit ensuite avec plus d'expérience.",
              takeaway: "Les erreurs sont inévitables.\n\nLes répéter est un choix."
              }
            ),
          createLessonSeed(
            "Le pouvoir du temps",
            "8 min",
            "Beaucoup de personnes pensent qu'elles ont encore le temps.\n\n\"Elles commenceront plus tard.\"\n\nPourtant, chaque année qui passe est une année que ton argent ne pourra jamais récupérer.\n\nLe temps est une ressource que personne ne peut acheter.",
            "Le temps est le seul investissement que personne ne peut te rendre.",
            createQuizQuestions([
              {
                question: "Camille commence à investir à 20 ans. Léo commence à 35 ans. Quelle différence compte le plus ?",
                options: ["Camille laisse plus de temps à son argent pour travailler", "Camille investit forcément plus chaque mois", "Léo ne peut jamais progresser"],
                correctOptionIndex: 0
              },
              {
                question: "Pourquoi commencer tôt vaut souvent mieux que commencer avec beaucoup d'argent plus tard ?",
                options: ["Parce que les petites actions ont plus d'années pour produire des effets", "Parce que le temps garantit tous les rendements", "Parce qu'il ne faut jamais augmenter ses montants"],
                correctOptionIndex: 0
              },
              {
                question: "Quel est le risque de dire « je commencerai quand j'aurai un meilleur salaire » ?",
                options: ["Attendre une situation parfaite qui n'arrive jamais", "Commencer trop tôt avec une méthode simple", "Créer une habitude immédiatement"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle stratégie est souvent la plus efficace ?",
                options: ["Commencer aujourd'hui avec une petite somme", "Attendre cinq ans pour investir davantage", "Reporter jusqu'à être certain de tout"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase résume le mieux cette leçon ?",
                options: ["Chaque jour compte", "Le temps peut être racheté plus tard", "Seules les grosses sommes comptent"],
                correctOptionIndex: 0
              }
            ]),
            {
              sections: [
                "Le temps permet à ton épargne, à tes investissements et à tes intérêts composés de travailler.",
                "Chaque année supplémentaire augmente leur puissance.",
                "Plus tu attends, plus tu dois investir pour obtenir le même résultat."
              ],
              example: "100 € par mois commencés à 20 ans peuvent créer environ 350 000 € à 60 ans, contre environ 110 000 € en commençant à 35 ans.",
              takeaway: "Le temps est le seul investissement que personne ne peut te rendre.\n\nChaque jour compte."
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
  const syncedProfile = syncPremiumAcademyLessons(repairedProfile);

  if (!hasLessonContent(syncedProfile.modules)) {
    const fallbackProfile = buildFallbackAcademyProfile(storedProfile);
    await saveAcademyProfile(fallbackProfile);
    return fallbackProfile;
  }

  if (JSON.stringify(syncedProfile) !== JSON.stringify(repairedProfile)) {
    await saveAcademyProfile(syncedProfile);
  }

  return syncedProfile;
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

function syncPremiumAcademyLessons(profile: AcademyProfile): AcademyProfile {
  const firstLevelSeed = localAcademyProfile.levels[0];
  const premiumLessonIndexes = new Set([0, 1, 2, 3, 4, 5, 6, 7]);

  if (!firstLevelSeed) {
    return profile;
  }

  const levels = profile.levels.map((level, levelIndex) => {
    if (levelIndex !== 0) {
      return level;
    }

    return {
      ...firstLevelSeed,
      status: level.status,
      certification: level.certification,
      chapters: firstLevelSeed.chapters.map((chapter, chapterIndex) => {
        const storedChapter = level.chapters[chapterIndex];
        if (chapterIndex !== 0 || !chapter.lessons?.length) {
          return storedChapter ? { ...chapter, status: storedChapter.status, completedAt: storedChapter.completedAt } : chapter;
        }

        return {
          ...chapter,
          status: storedChapter?.status ?? chapter.status,
          completedAt: storedChapter?.completedAt,
          lessons: chapter.lessons.map((lesson, lessonIndex) => {
            const storedLesson = storedChapter?.lessons?.[lessonIndex];
            return premiumLessonIndexes.has(lessonIndex)
              ? { ...lesson, status: storedLesson?.status ?? lesson.status, completedAt: storedLesson?.completedAt }
              : storedLesson ? { ...storedLesson } : lesson;
          })
        };
      })
    };
  });

  const modules = profile.modules.map((module, moduleIndex) => {
    if (moduleIndex !== 0) {
      return module;
    }

    return {
      ...module,
      lessons: module.lessons.map((lesson, lessonIndex) => {
        const lessonSeed = localAcademyProfile.modules[0]?.lessons[lessonIndex];
        return premiumLessonIndexes.has(lessonIndex) && lessonSeed
          ? { ...lessonSeed, status: lesson.status, completedAt: lesson.completedAt }
          : lesson;
      }),
      quiz: {
        ...module.quiz,
        questions: localAcademyProfile.modules[0]?.lessons[0]?.quizQuestions?.length
          ? localAcademyProfile.modules[0].lessons[0].quizQuestions
          : module.quiz.questions
      }
    };
  });

  return {
    ...profile,
    levels,
    modules,
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
    const firstLessonQuestions = lessonSeeds[0]?.quizQuestions;

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
        questions: level.order === 1 && firstLessonQuestions?.length
          ? firstLessonQuestions
          : level.order === 1 && firstChapterQuestions?.length
            ? firstChapterQuestions
            : level.chapters.flatMap((chapter) => chapter.quiz.questions)
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
