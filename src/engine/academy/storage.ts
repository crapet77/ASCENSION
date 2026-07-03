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
                question: "Maximilien gagne 2 000 € et dépense tout. Martin gagne 2 000 € et met 10 € de côté par jour. Quelle différence compte vraiment ?",
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
              example: "Maximilien et Martin gagnent chacun 2 000 €. Maximilien dépense tout. Martin met simplement 10 € de côté chaque jour.",
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
                question: "Martin commence à investir à 20 ans. Maximilien commence à 35 ans. Pourquoi Martin peut-il finir avec beaucoup plus ?",
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
                question: "Emma dépense puis épargne ce qu'il reste. Martin répartit son salaire dès le premier jour. Quelle différence explique leur résultat ?",
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
                question: "Maëlya paie une réparation de 900 € avec sa réserve. Maximilien s'endette. Quelle différence compte vraiment ?",
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
                question: "Maëlya emprunte 3 000 € pour un téléphone alors que le sien fonctionne. Quel est le vrai risque ?",
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
                question: "Maëlya dépense d'abord. Martin épargne, investit et suit son budget chaque mois. Qu'est-ce qui explique surtout l'écart futur ?",
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
                question: "Maximilien perd 200 € et abandonne. Emma perd 200 € et analyse son erreur. Quelle différence compte le plus ?",
                options: ["Le montant perdu uniquement", "La capacité à apprendre de l'erreur", "Le fait de ne plus jamais agir"],
                correctOptionIndex: 1
              },
              {
                question: "Pourquoi une erreur faite tôt peut-elle coûter moins cher ?",
                options: ["Parce qu'elle permet d'apprendre avant de gérer de plus gros montants", "Parce qu'elle n'a aucune conséquence", "Parce qu'elle garantit les prochains gains"],
                correctOptionIndex: 0
              },
              {
                question: "Quel est le plus grand danger après une erreur financière ?",
                options: ["La reconnaître rapidement", "Adapter sa méthode", "Répéter la même erreur sans l'analyser"],
                correctOptionIndex: 2
              },
              {
                question: "Tu fais un mauvais investissement. Quelle réaction est la plus constructive ?",
                options: ["Abandonner définitivement", "Comprendre ce qui n'a pas fonctionné avant de continuer", "Recommencer immédiatement sans réflexion"],
                correctOptionIndex: 1
              },
              {
                question: "Quelle phrase correspond le mieux à cette leçon ?",
                options: ["Une erreur prouve que tu es mauvais", "Il faut éviter tout apprentissage risqué", "Les erreurs sont inévitables, les répéter est un choix"],
                correctOptionIndex: 2
              }
            ]),
            {
              sections: [
                "Une erreur est une information.",
                "Elle te montre ce qu'il faut améliorer.",
                "Les personnes qui réussissent évitent surtout de refaire les mêmes erreurs."
              ],
              example: "Maximilien et Emma perdent chacun 200 €. Maximilien abandonne. Emma analyse son erreur et investit ensuite avec plus d'expérience.",
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
                question: "Maëlya commence à investir à 20 ans. Martin commence à 35 ans. Quelle différence compte le plus ?",
                options: ["Maëlya investit forcément plus chaque mois", "Maëlya laisse plus de temps à son argent pour travailler", "Martin ne peut jamais progresser"],
                correctOptionIndex: 1
              },
              {
                question: "Pourquoi commencer tôt vaut souvent mieux que commencer avec beaucoup d'argent plus tard ?",
                options: ["Parce que les petites actions ont plus d'années pour produire des effets", "Parce que le temps garantit tous les rendements", "Parce qu'il ne faut jamais augmenter ses montants"],
                correctOptionIndex: 0
              },
              {
                question: "Quel est le risque de dire « je commencerai quand j'aurai un meilleur salaire » ?",
                options: ["Commencer trop tôt avec une méthode simple", "Créer une habitude immédiatement", "Attendre une situation parfaite qui n'arrive jamais"],
                correctOptionIndex: 2
              },
              {
                question: "Quelle stratégie est souvent la plus efficace ?",
                options: ["Attendre cinq ans pour investir davantage", "Commencer aujourd'hui avec une petite somme", "Reporter jusqu'à être certain de tout"],
                correctOptionIndex: 1
              },
              {
                question: "Quelle phrase résume le mieux cette leçon ?",
                options: ["Le temps peut être racheté plus tard", "Seules les grosses sommes comptent", "Chaque jour compte"],
                correctOptionIndex: 2
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
            "Construire ton avenir financier",
            "8 min",
            "Une maison ne commence jamais par le toit.\n\nElle commence par des fondations solides.\n\nC'est exactement ce que tu viens de construire.\n\nTu sais maintenant gérer un budget, éviter les mauvaises dettes, créer de bonnes habitudes, fixer des objectifs et comprendre que le temps est ton meilleur allié.",
            "La liberté financière ne dépend pas de ton salaire. Elle dépend des décisions que tu prends régulièrement.",
            createQuizQuestions([
              {
                question: "Pourquoi la liberté financière ne se construit-elle pas en une semaine ?",
                options: ["Parce qu'elle dépend de décisions répétées dans le temps", "Parce qu'elle dépend uniquement de la chance", "Parce qu'il faut forcément gagner beaucoup"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle stratégie est la plus solide sur plusieurs années ?",
                options: ["Chercher un gain très rapide", "Construire progressivement de bonnes habitudes", "Attendre le moment parfait"],
                correctOptionIndex: 1
              },
              {
                question: "Que montrent les petites décisions répétées ?",
                options: ["Qu'elles sont inutiles séparément", "Qu'elles remplacent toute méthode", "Qu'ensemble, elles peuvent changer une vie"],
                correctOptionIndex: 2
              },
              {
                question: "Quelle erreur faut-il éviter après les fondations ?",
                options: ["Vouloir devenir riche rapidement avec trop de risques", "Continuer à suivre son budget", "Investir avec patience"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase résume le mieux le Niveau 1 ?",
                options: ["Le salaire décide de tout", "Les décisions régulières construisent l'avenir financier", "Il faut attendre avant de commencer"],
                correctOptionIndex: 1
              }
            ]),
            {
              sections: [
                "Chaque petite décision compte.",
                "Séparément, ces actions semblent insignifiantes.",
                "Ensemble, elles changent une vie."
              ],
              example: "100 € investis chaque mois pendant 20 ans peuvent représenter plusieurs dizaines de milliers d'euros grâce aux intérêts composés.",
              takeaway: "Commence aujourd'hui.\n\nTon futur toi te remerciera."
            }
          )
        ]
      )
    ]
  }),
  createLevel({
    id: "level-2-investment",
    order: 2,
    title: "Niveau 2 : Épargne & Investissement",
    category: "investment",
    description: "Comprendre comment faire travailler son argent simplement.",
    status: "locked",
    unlocks: [],
    chapters: [
      createChapter(
        "savings-investment",
        "Chapitre 1 : Faire travailler son argent",
        "Passer de l'argent immobile à un plan simple, patient et régulier.",
        [
          createInvestmentLesson({
            title: "Pourquoi épargner ?",
            intro: "Épargner ne veut pas dire se priver de tout.\n\nÉpargner veut dire reprendre de l'avance sur la vie.\n\nQuand tu gardes une partie de ton argent, tu crées de la sécurité, des choix et de la liberté.",
            story: "Emma reçoit 1 800 € par mois. Elle dépense tout et attend le mois suivant.\n\nMaëlya reçoit le même salaire, mais met 150 € de côté dès le début du mois.\n\nAprès un an, Emma n'a presque rien.\n\nMaëlya possède 1 800 € de réserve.\n\nLe salaire était identique. La décision ne l'était pas.",
            explanation: "L'épargne est le premier argent qui travaille pour toi.\n\nAvant même d'investir, elle te protège des imprévus et t'évite de dépendre du prochain salaire.",
            example: "150 € épargnés chaque mois pendant 12 mois représentent 1 800 €.\n\nCe n'est pas spectaculaire au début, mais c'est une vraie base.",
            mistake: "Croire qu'il faut attendre de gagner beaucoup pour épargner.\n\nEn réalité, l'habitude compte plus que le montant de départ.",
            mission: "Choisis un petit montant automatique à mettre de côté chaque mois.\n\nMême 20 € suffisent pour commencer.",
            challenge: "Tu gagnes 1 800 € et tu épargnes 100 € par mois. Combien auras-tu mis de côté en un an ?\n\nRéponse : 1 200 €.",
            takeaway: "L'épargne n'est pas de l'argent oublié.\n\nC'est de la liberté préparée à l'avance.",
            quiz: [
              ["Pourquoi épargner est-il utile ?", ["Pour créer de la sécurité et des choix", "Pour ne plus jamais dépenser", "Pour impressionner les autres"], 0],
              ["Quelle habitude est la plus solide ?", ["Épargner seulement quand il reste quelque chose", "Épargner dès le début du mois", "Attendre un gros salaire"], 1],
              ["Si tu mets 50 € de côté pendant 12 mois, combien obtiens-tu ?", ["300 €", "1 200 €", "600 €"], 2],
              ["Que montre l'histoire d'Emma et Maëlya ?", ["Le salaire suffit toujours", "La chance décide de tout", "La décision répétée change le résultat"], 2],
              ["Quelle phrase résume la leçon ?", ["Épargner crée de l'avance sur la vie", "Épargner empêche de vivre", "Épargner ne sert qu'aux riches"], 0]
            ]
          }),
          createInvestmentLesson({
            title: "Les intérêts composés",
            intro: "Les intérêts composés sont simples à comprendre.\n\nTon argent produit des gains.\n\nPuis ces gains peuvent produire d'autres gains.\n\nAvec le temps, l'effet devient très puissant.",
            story: "Martin commence avec 50 € par mois.\n\nMaximilien attend d'avoir plus d'argent.\n\nAu début, la différence semble petite.\n\nMais après plusieurs années, Martin a déjà laissé son argent travailler pendant longtemps.",
            explanation: "Les intérêts composés récompensent surtout le temps.\n\nPlus ton argent reste investi longtemps, plus il a d'occasions de produire de nouveaux gains.",
            example: "50 € investis chaque mois pendant 20 ans à 7 % par an peuvent devenir environ 26 000 €.\n\nLa somme versée est de 12 000 €.\n\nLe reste vient de la croissance.",
            mistake: "Penser que les intérêts composés ne servent qu'aux grosses fortunes.\n\nIls commencent aussi avec de petites sommes régulières.",
            mission: "Choisis un montant mensuel que tu pourrais investir sans stress.\n\nL'objectif est de comprendre le mécanisme, pas de viser la perfection.",
            challenge: "Que vaut mieux faire : commencer petit aujourd'hui ou attendre dix ans pour commencer plus gros ?\n\nSouvent, commencer tôt gagne.",
            takeaway: "Les intérêts composés transforment le temps en allié.",
            quiz: [
              ["Que sont les intérêts composés ?", ["Des intérêts qui peuvent produire d'autres intérêts", "Une dépense obligatoire", "Un rendement garanti"], 0],
              ["Quel élément est le plus important au départ ?", ["Le hasard", "Le temps", "La mode"], 1],
              ["Pourquoi commencer tôt aide ?", ["Parce que cela supprime tous les risques", "Parce que les prix baissent toujours", "Parce que l'argent travaille plus longtemps"], 2],
              ["50 € par mois pendant 20 ans à 7 % peut devenir environ :", ["26 000 €", "2 600 €", "260 €"], 0],
              ["Quelle erreur faut-il éviter ?", ["Commencer avec une petite somme", "Attendre la somme parfaite", "Comprendre avant d'agir"], 1]
            ]
          }),
          createInvestmentLesson({
            title: "Les différents placements",
            intro: "Tous les placements ne servent pas au même objectif.\n\nCertains protègent.\n\nCertains font grandir.\n\nCertains sont plus risqués.\n\nComprendre leur rôle évite de tout mélanger.",
            story: "Emma place toute son épargne sur un seul support sans comprendre.\n\nMaximilien sépare son argent : réserve de sécurité, projets à moyen terme et investissement long terme.\n\nIl sait pourquoi chaque euro est placé.",
            explanation: "Un placement doit répondre à une question simple : à quoi sert cet argent ?\n\nSi tu en as besoin bientôt, tu ne le places pas comme un argent prévu pour dix ans.",
            example: "Un fonds d'urgence peut rester disponible.\n\nUn projet dans deux ans peut demander un placement prudent.\n\nUn investissement sur quinze ans peut accepter plus de variations.",
            mistake: "Chercher le placement qui fait tout.\n\nAucun placement n'est parfait pour tous les besoins.",
            mission: "Classe ton argent en trois zones : sécurité, projets, long terme.",
            challenge: "Tu veux acheter une voiture dans 6 mois. Est-ce un argent à risquer fortement ?\n\nNon, car l'échéance est proche.",
            takeaway: "Le bon placement dépend toujours de l'objectif et du temps disponible.",
            quiz: [
              ["Pourquoi existe-t-il plusieurs placements ?", ["Parce qu'ils ont des rôles différents", "Parce qu'ils sont tous identiques", "Parce qu'un seul suffit toujours"], 0],
              ["Un argent nécessaire dans 6 mois doit plutôt être :", ["Très risqué", "Prudent et disponible", "Bloqué pendant 20 ans"], 1],
              ["Que faut-il définir avant de placer ?", ["La couleur de l'application", "Le dernier avis à la mode", "L'objectif de l'argent"], 2],
              ["Quelle erreur est fréquente ?", ["Adapter le placement à l'objectif", "Chercher un placement magique pour tout", "Garder une réserve"], 1],
              ["Quel exemple est cohérent ?", ["Sécurité, projets, long terme", "Tout sur un seul support inconnu", "Tout risquer pour aller plus vite"], 0]
            ]
          }),
          createInvestmentLesson({
            title: "L'inflation",
            intro: "L'inflation signifie que les prix augmentent avec le temps.\n\nQuand les prix montent, le même billet permet d'acheter moins de choses.",
            story: "Maëlya garde 1 000 € sans plan pendant plusieurs années.\n\nMartin cherche à protéger progressivement son pouvoir d'achat.\n\nLe montant de Maëlya reste identique, mais ce qu'elle peut acheter diminue.",
            explanation: "L'inflation ne fait pas disparaître ton argent.\n\nElle réduit doucement ce qu'il permet d'acheter.",
            example: "Si les prix montent de 3 % par an, un panier qui coûte 100 € aujourd'hui peut coûter environ 103 € dans un an.\n\nTon argent doit donc avancer lui aussi.",
            mistake: "Croire que l'argent immobile est toujours sans risque.\n\nIl peut perdre du pouvoir d'achat sans que le montant affiché change.",
            mission: "Choisis un prix que tu connais bien et compare son évolution sur plusieurs années.",
            challenge: "Si ton argent ne progresse jamais mais que les prix montent, que se passe-t-il ?\n\nTon pouvoir d'achat baisse.",
            takeaway: "L'inflation rappelle que l'argent doit être protégé, pas seulement conservé.",
            quiz: [
              ["Que fait l'inflation ?", ["Elle augmente le pouvoir d'achat", "Elle peut réduire ce qu'un euro permet d'acheter", "Elle garantit les investissements"], 1],
              ["Si les prix montent de 3 %, un achat de 100 € peut coûter :", ["103 €", "50 €", "100 € exactement pour toujours"], 0],
              ["Quel est le risque d'un argent immobile ?", ["Il devient toujours plus puissant", "Il ne peut jamais perdre de valeur réelle", "Il peut perdre du pouvoir d'achat"], 2],
              ["Que cherche-t-on à protéger face à l'inflation ?", ["Son pouvoir d'achat", "Ses envies impulsives", "Les prix des autres"], 0],
              ["Quelle phrase est vraie ?", ["Le montant affiché suffit à tout comprendre", "L'inflation agit doucement dans le temps", "L'inflation supprime le besoin d'investir"], 1]
            ]
          }),
          createInvestmentLesson({
            title: "Les ETF",
            intro: "Un ETF est un panier d'investissements.\n\nAu lieu d'acheter une seule entreprise, tu peux acheter un morceau d'un grand ensemble.",
            story: "Maximilien veut investir mais ne sait pas choisir une action.\n\nEmma découvre qu'un ETF peut suivre des centaines d'entreprises à la fois.\n\nElle comprend que cela peut être plus simple pour débuter.",
            explanation: "Un ETF permet souvent de diversifier avec un seul produit.\n\nC'est pour cela qu'il est souvent utilisé dans l'investissement long terme.",
            example: "Un ETF Monde peut contenir des centaines ou milliers d'entreprises de plusieurs pays.\n\nTon argent n'est pas dépendant d'une seule entreprise.",
            mistake: "Croire qu'un ETF est sans risque.\n\nIl peut baisser, surtout à court terme.",
            mission: "Regarde ce que signifie ETF et note une phrase simple : panier d'investissements.",
            challenge: "Pourquoi un ETF peut-il être plus simple qu'une seule action ?\n\nParce qu'il regroupe plusieurs investissements.",
            takeaway: "Un ETF peut être une porte d'entrée simple vers l'investissement diversifié.",
            quiz: [
              ["Un ETF ressemble à :", ["Un panier d'investissements", "Une seule dépense", "Une garantie bancaire"], 0],
              ["Pourquoi un ETF peut aider un débutant ?", ["Il évite tout risque", "Il peut diversifier simplement", "Il promet un gain rapide"], 1],
              ["Un ETF Monde peut contenir :", ["Uniquement une entreprise", "Aucun actif", "Beaucoup d'entreprises de plusieurs pays"], 2],
              ["Quelle erreur éviter ?", ["Comprendre avant d'acheter", "Croire qu'un ETF est sans risque", "Investir avec patience"], 1],
              ["Quel horizon correspond souvent aux ETF ?", ["Long terme", "Une heure", "Un pari impulsif"], 0]
            ]
          }),
          createInvestmentLesson({
            title: "Le risque",
            intro: "Investir implique toujours du risque.\n\nLe but n'est pas de le nier.\n\nLe but est de le comprendre et de le gérer.",
            story: "Martin panique dès que son investissement baisse.\n\nMaëlya savait avant d'investir que la valeur pouvait varier.\n\nElle garde son plan parce qu'elle avait prévu le risque.",
            explanation: "Le risque signifie que le résultat n'est pas certain.\n\nUn bon investisseur ne cherche pas à tout contrôler. Il prépare sa réaction.",
            example: "Un placement peut faire -10 % une année et remonter ensuite.\n\nSi tu as besoin de l'argent demain, cette baisse peut être un problème.\n\nSi ton horizon est long, elle peut être plus acceptable.",
            mistake: "Investir de l'argent dont tu as besoin rapidement.",
            mission: "Écris pour chaque somme d'argent : j'en ai besoin quand ?",
            challenge: "Quel argent peut accepter plus de variations : celui pour le loyer du mois prochain ou celui prévu pour dans 15 ans ?\n\nCelui prévu pour dans 15 ans.",
            takeaway: "Le risque devient plus maîtrisable quand tu connais ton horizon.",
            quiz: [
              ["Que signifie le risque ?", ["Le résultat n'est pas certain", "Le gain est garanti", "La baisse est impossible"], 0],
              ["Quel argent ne doit pas être fortement risqué ?", ["L'argent dont tu as besoin rapidement", "L'argent long terme", "L'argent déjà prévu dans un plan"], 0],
              ["Pourquoi prévoir sa réaction ?", ["Pour paniquer plus vite", "Pour vendre sans réfléchir", "Pour rester cohérent avec son plan"], 2],
              ["Un horizon long permet parfois :", ["D'accepter plus de variations", "D'éviter toute baisse", "De supprimer la réflexion"], 0],
              ["Quelle erreur est dangereuse ?", ["Comprendre le risque", "Investir l'argent du loyer", "Avoir une réserve"], 1]
            ]
          }),
          createInvestmentLesson({
            title: "Diversifier",
            intro: "Diversifier veut dire ne pas mettre tout son argent au même endroit.\n\nC'est une règle simple pour éviter qu'une seule erreur décide de tout.",
            story: "Emma investit tout dans une seule entreprise.\n\nMaximilien répartit son argent entre plusieurs zones.\n\nSi une partie baisse, tout son avenir ne dépend pas d'une seule décision.",
            explanation: "La diversification ne garantit pas de gagner.\n\nMais elle réduit la dépendance à un seul actif, un seul pays ou un seul secteur.",
            example: "Au lieu d'avoir 100 % sur une seule action, un investisseur peut répartir entre ETF, épargne de sécurité et plusieurs zones géographiques.",
            mistake: "Croire qu'aimer une entreprise suffit pour tout investir dessus.",
            mission: "Regarde ton argent et demande-toi : dépend-il d'une seule chose ?",
            challenge: "Quel portefeuille est le plus fragile : 100 % sur une action ou réparti sur plusieurs actifs ?\n\n100 % sur une action.",
            takeaway: "Diversifier, c'est accepter de ne pas tout miser sur une seule idée.",
            quiz: [
              ["Diversifier signifie :", ["Tout mettre au même endroit", "Répartir son argent", "Ne jamais investir"], 1],
              ["Pourquoi diversifier ?", ["Pour réduire la dépendance à une seule décision", "Pour garantir un gain", "Pour éviter d'apprendre"], 0],
              ["Quel portefeuille est souvent plus fragile ?", ["Un portefeuille réparti", "Une réserve de sécurité", "100 % sur une seule action"], 2],
              ["La diversification garantit-elle de gagner ?", ["Oui, toujours", "Non, elle aide surtout à gérer le risque", "Oui, si on investit vite"], 1],
              ["Quelle phrase résume la leçon ?", ["Ne pas tout miser sur une seule idée", "Choisir une seule entreprise préférée", "Ignorer les risques"], 0]
            ]
          }),
          createInvestmentLesson({
            title: "Commencer avec 50 €",
            intro: "Beaucoup de personnes pensent qu'investir commence avec de grosses sommes.\n\nC'est faux.\n\nCommencer petit peut suffire pour apprendre.",
            story: "Martin attend d'avoir 5 000 € pour commencer.\n\nMaëlya commence avec 50 € par mois.\n\nAu bout d'un an, elle comprend mieux, elle a créé une routine et elle n'a pas attendu la situation parfaite.",
            explanation: "Le premier objectif n'est pas d'être riche immédiatement.\n\nLe premier objectif est de construire l'habitude et de comprendre ce que tu fais.",
            example: "50 € par mois représentent 600 € investis en un an.\n\nMais surtout, cela représente 12 décisions disciplinées.",
            mistake: "Mépriser les petits montants.\n\nUn petit montant régulier peut former une grande habitude.",
            mission: "Choisis un montant réaliste que tu pourrais investir sans te mettre en difficulté.",
            challenge: "50 € par mois pendant 12 mois représentent combien ?\n\n600 €.",
            takeaway: "Commencer petit vaut mieux que rester bloqué en attendant grand.",
            quiz: [
              ["Pourquoi commencer avec 50 € peut être utile ?", ["Pour apprendre et créer une routine", "Pour devenir riche en un mois", "Pour supprimer le risque"], 0],
              ["50 € par mois pendant un an représentent :", ["50 €", "600 €", "5 000 €"], 1],
              ["Quelle erreur faut-il éviter ?", ["Commencer prudemment", "Choisir un montant réaliste", "Mépriser les petits montants"], 2],
              ["Quel est le premier objectif ?", ["Tout gagner vite", "Construire l'habitude", "Copier les autres"], 1],
              ["Quelle phrase résume la leçon ?", ["Attendre grand est toujours mieux", "Les petits montants sont inutiles", "Commencer petit vaut mieux que rester bloqué"], 2]
            ]
          }),
          createInvestmentLesson({
            title: "Le pouvoir du temps",
            intro: "Le temps est l'un des plus grands avantages d'un investisseur.\n\nTu ne peux pas l'acheter.\n\nTu peux seulement l'utiliser.",
            story: "Emma commence à investir à 25 ans.\n\nMaximilien commence à 40 ans.\n\nMême si Maximilien investit plus tard avec sérieux, Emma a déjà quinze années d'avance.",
            explanation: "Le temps permet aux habitudes, à l'épargne et aux intérêts composés de s'accumuler.\n\nIl transforme les petites décisions en grands écarts.",
            example: "100 € par mois pendant 30 ans peuvent créer un résultat très différent de 100 € par mois pendant 10 ans.\n\nLa différence vient surtout des années.",
            mistake: "Remettre à plus tard parce que le montant paraît trop petit aujourd'hui.",
            mission: "Écris une date de début. Pas une date parfaite. Une date réelle.",
            challenge: "Qu'est-ce qui est impossible à récupérer : un euro dépensé ou dix années perdues ?\n\nLes dix années perdues.",
            takeaway: "Le temps récompense ceux qui commencent avant de se sentir prêts.",
            quiz: [
              ["Pourquoi le temps est-il puissant ?", ["Il laisse plus d'années aux décisions pour produire leurs effets", "Il garantit tous les gains", "Il annule tous les risques"], 0],
              ["Que montre l'histoire d'Emma et Maximilien ?", ["Commencer plus tôt peut créer un grand avantage", "Attendre est toujours meilleur", "Investir tard annule tout effort"], 0],
              ["Quelle erreur revient souvent ?", ["Choisir une date réelle", "Commencer petit", "Reporter car le montant paraît petit"], 2],
              ["Que peut faire le temps ?", ["Transformer des petites décisions en grands écarts", "Supprimer la nécessité d'épargner", "Remplacer toute méthode"], 0],
              ["Quelle phrase résume la leçon ?", ["Le temps récompense ceux qui commencent", "Il faut attendre d'être prêt", "Le temps ne change rien"], 0]
            ]
          }),
          createInvestmentLesson({
            title: "Ton premier plan d'investissement",
            intro: "Un plan d'investissement n'a pas besoin d'être compliqué.\n\nIl doit surtout être clair, réaliste et facile à répéter.",
            story: "Maëlya veut investir mais se perd dans trop d'informations.\n\nMartin écrit un plan simple : réserve d'abord, 50 € par mois, horizon long terme, ETF diversifié, point mensuel.\n\nSon plan tient en quelques lignes.",
            explanation: "Un bon plan répond à quatre questions : combien, où, pourquoi et pendant combien de temps ?",
            example: "Plan simple : garder 3 mois de réserve, investir 50 € par mois, choisir un support diversifié, revoir le plan une fois par mois.",
            mistake: "Changer de stratégie à chaque nouvelle vidéo ou chaque nouvelle peur.",
            mission: "Écris ton premier plan en quatre lignes : montant, support, horizon, règle de suivi.",
            challenge: "Quel plan est le plus solide : simple et répété, ou compliqué et abandonné ?\n\nSimple et répété.",
            takeaway: "Un plan imparfait mais suivi vaut mieux qu'une stratégie brillante jamais appliquée.\n\nTu sais maintenant comment commencer à faire travailler ton argent.",
            quiz: [
              ["Que doit être un premier plan ?", ["Clair, réaliste et répétable", "Secret et compliqué", "Basé sur l'émotion du jour"], 0],
              ["Quelles questions doit-il poser ?", ["Combien, où, pourquoi, combien de temps", "Qui va gagner demain", "Quelle tendance copier"], 0],
              ["Quelle erreur faut-il éviter ?", ["Suivre une règle simple", "Revoir son plan calmement", "Changer de stratégie à chaque peur"], 2],
              ["Quel plan est plus solide ?", ["Un plan compliqué abandonné", "Un plan simple répété", "Aucun plan"], 1],
              ["Que sais-tu à la fin du Niveau 2 ?", ["Comment commencer à faire travailler ton argent", "Comment garantir tous tes gains", "Comment éviter tout risque"], 0]
            ],
            successMessage: "Tu sais maintenant comment commencer à faire travailler ton argent."
          })
        ]
      )
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
  const secondLevelSeed = localAcademyProfile.levels[1];
  const premiumLessonIndexes = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  if (!firstLevelSeed) {
    return profile;
  }

  const levels = profile.levels.map((level, levelIndex) => {
    if (levelIndex === 1 && secondLevelSeed) {
      return {
        ...secondLevelSeed,
        status: level.status,
        certification: level.certification,
        chapters: secondLevelSeed.chapters.map((chapter, chapterIndex) => {
          const storedChapter = level.chapters[chapterIndex];

          return {
            ...chapter,
            status: storedChapter?.status ?? chapter.status,
            completedAt: storedChapter?.completedAt,
            lessons: chapter.lessons?.map((lesson, lessonIndex) => {
              const storedLesson = storedChapter?.lessons?.[lessonIndex];
              return {
                ...lesson,
                status: storedLesson?.status ?? lesson.status,
                completedAt: storedLesson?.completedAt
              };
            })
          };
        })
      };
    }

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
    if (moduleIndex === 1 && localAcademyProfile.modules[1]) {
      return {
        ...localAcademyProfile.modules[1],
        status: module.status,
        lessons: localAcademyProfile.modules[1].lessons.map((lesson, lessonIndex) => {
          const storedLesson = module.lessons[lessonIndex];
          return {
            ...lesson,
            status: storedLesson?.status ?? lesson.status,
            completedAt: storedLesson?.completedAt
          };
        }),
        quiz: {
          ...localAcademyProfile.modules[1].quiz,
          status: module.quiz.status,
          score: module.quiz.score,
          completedAt: module.quiz.completedAt
        }
      };
    }

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

function createInvestmentLesson(params: {
  title: string;
  intro: string;
  story: string;
  explanation: string;
  example: string;
  mistake: string;
  mission: string;
  challenge: string;
  takeaway: string;
  quiz: Array<[string, string[], number]>;
  successMessage?: string;
}) {
  const lesson = createLessonSeed(
    params.title,
    "8 min",
    params.intro,
    params.takeaway,
    createQuizQuestions(
      params.quiz.map(([question, options, correctOptionIndex]) => ({
        question,
        options,
        correctOptionIndex
      }))
    ),
    {
      intro: params.intro,
      sections: [
        params.story,
        params.explanation,
        params.example,
        params.mistake,
        params.mission,
        params.challenge,
        params.takeaway
      ],
      example: params.example,
      takeaway: params.takeaway
    }
  );

  return {
    ...lesson,
    successMessage: params.successMessage ?? lesson.successMessage
  };
}

function createQuizQuestions(questions: Array<{ question: string; options: string[]; correctOptionIndex: number }>) {
  const targetPattern = questions.length === 5 ? [0, 1, 2, 1, 2] : [0, 1, 2];

  return questions.map((q, index) => {
    const targetIndex = Math.min(targetPattern[index % targetPattern.length], q.options.length - 1);
    const normalizedQuestion = moveCorrectAnswer(q.options, q.correctOptionIndex, targetIndex);

    return {
      id: `quiz-question-${index + 1}`,
      question: q.question,
      options: normalizedQuestion.options,
      correctOptionIndex: normalizedQuestion.correctOptionIndex
    };
  });
}

function moveCorrectAnswer(options: string[], correctOptionIndex: number, targetIndex: number) {
  const correctAnswer = options[correctOptionIndex] ?? options[0] ?? "";
  const otherOptions = options.filter((_, index) => index !== correctOptionIndex);
  const nextOptions = [...otherOptions];
  nextOptions.splice(targetIndex, 0, correctAnswer);

  return {
    options: nextOptions,
    correctOptionIndex: targetIndex
  };
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
