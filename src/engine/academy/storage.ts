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

const ACADEMY_LESSON_CARD_DESCRIPTIONS: Record<string, string> = {
  "level-1-foundations:La discipline : le premier investissement": "Tout commence par tes habitudes. Un euro peut changer ton regard. La base se construit ici.",
  "level-1-foundations:Les intérêts composés": "Le temps travaille en silence. Les petits montants prennent de l'élan. Patience devient puissance.",
  "level-1-foundations:Le budget : donne une mission à chaque euro": "Ton argent mérite une direction. Chaque euro reçoit un rôle. Le contrôle devient plus simple.",
  "level-1-foundations:L'épargne de sécurité : ton premier bouclier financier": "Les imprévus arrivent sans prévenir. Une réserve calme la pression. La sérénité commence ici.",
  "level-1-foundations:Les mauvaises dettes : l'argent qui travaille contre toi": "Une mensualité paraît légère. Plusieurs finissent par peser. Tes choix futurs se protègent.",
  "level-1-foundations:Les bonnes habitudes financières": "Les grands résultats naissent doucement. Une routine change tout. La régularité devient ton avantage.",
  "level-1-foundations:Les erreurs des débutants": "Se tromper n'est pas échouer. Répéter coûte plus cher. Chaque erreur peut devenir utile.",
  "level-1-foundations:Le pouvoir du temps": "Le temps ne revient jamais. Commencer tôt crée l'écart. Chaque jour compte vraiment.",
  "level-1-foundations:Inflation": "Les prix montent doucement. L'argent immobile perd du terrain. Protéger ton pouvoir devient essentiel.",
  "level-1-foundations:Construire ton avenir financier": "Les fondations sont posées. Les décisions prennent forme. Ton parcours peut commencer.",
  "level-2-investment:Pourquoi épargner ?": "L'épargne crée de l'avance. Une marge change tout. La liberté commence discrètement.",
  "level-2-investment:Les intérêts composés": "Le temps multiplie les efforts. Les intérêts nourrissent les intérêts. La patience accélère ensuite.",
  "level-2-investment:Les différents placements": "Chaque placement a son rôle. Certains protègent, d'autres développent. Choisir devient plus clair.",
  "level-2-investment:L'inflation": "Ton argent doit rester vivant. Les prix avancent chaque année. Comprendre protège tes efforts.",
  "level-2-investment:Les ETF": "Investir peut rester simple. Un panier remplace mille choix. La méthode compte davantage.",
  "level-2-investment:Le risque": "Le risque ne disparaît pas. Il se prépare calmement. Ta méthode protège ton cap.",
  "level-2-investment:Diversifier": "Ne dépends pas d'une idée. Répartir calme les secousses. Un portefeuille respire mieux.",
  "level-2-investment:Commencer avec 50 €": "Un petit départ suffit. L'habitude vaut plus que l'orgueil. Le mouvement crée l'élan.",
  "level-2-investment:Le pouvoir du temps": "Attendre coûte souvent cher. Commencer tôt change l'équation. Le temps devient allié.",
  "level-2-investment:Ton premier plan d'investissement": "Une règle vaut mieux qu'une envie. Le plan calme l'émotion. La suite devient lisible.",
  "level-3-real-estate:Pourquoi l'immobilier attire autant ?": "La pierre rassure vite. Les chiffres révèlent la vérité. Regarder lentement protège mieux.",
  "level-3-real-estate:Acheter sa résidence principale ou investir ?": "Habiter et investir diffèrent. Le confort a son prix. L'intention guide le choix.",
  "level-3-real-estate:Comprendre un crédit immobilier": "Un crédit semble simple. La durée change tout. Le coût réel mérite attention.",
  "level-3-real-estate:Rendement brut, net et cash-flow": "Un pourcentage peut séduire. Les charges racontent la suite. Le mois réel tranche.",
  "level-3-real-estate:Les charges à ne jamais oublier": "Le loyer se voit vite. Les dépenses avancent discrètement. La marge peut disparaître.",
  "level-3-real-estate:Les travaux : opportunité ou piège ?": "Les travaux créent du potentiel. Ils peuvent aussi déborder. Prévoir évite la surprise.",
  "level-3-real-estate:Louer vide, meublé ou saisonnier ?": "Chaque format change l'équilibre. Le revenu ne suffit pas. La gestion compte aussi.",
  "level-3-real-estate:Les erreurs du premier investissement": "L'envie pousse à signer. La méthode demande du recul. Une erreur peut coûter longtemps.",
  "level-3-real-estate:Immobilier et fiscalité : les bases": "La fiscalité change le résultat. Le brut ne suffit jamais. Comprendre évite les illusions.",
  "level-3-real-estate:Construire son premier plan immobilier": "Un achat doit servir un plan. Les chiffres fixent le cadre. La décision devient plus calme.",
  "level-4-stock-market:C'est quoi la bourse ?": "La bourse impressionne souvent. Derrière, des entreprises vivent. Comprendre apaise le bruit.",
  "level-4-stock-market:Actions, ETF et obligations": "Chaque actif joue différemment. Le mélange construit l'équilibre. Choisir demande du sens.",
  "level-4-stock-market:Le PEA, le CTO et l'assurance-vie": "L'enveloppe change les règles. Le support ne suffit pas. Le cadre compte aussi.",
  "level-4-stock-market:Les ETF : investir simplement": "La simplicité peut être puissante. Un indice porte la méthode. Comprendre reste indispensable.",
  "level-4-stock-market:Les dividendes": "Un versement attire l'œil. La solidité compte davantage. Le revenu doit rester compris.",
  "level-4-stock-market:Le DCA : investir régulièrement": "Le timing parfait épuise. La régularité simplifie l'action. La méthode avance chaque mois.",
  "level-4-stock-market:Le risque en bourse": "Les baisses font partie du jeu. L'horizon aide à tenir. La préparation évite la panique.",
  "level-4-stock-market:La diversification": "Une seule idée fragilise. Plusieurs moteurs équilibrent mieux. Prévoir l'imprévu devient possible.",
  "level-4-stock-market:Les erreurs des débutants en bourse": "La foule attire vite. L'excitation brouille les choix. La méthode remet du calme.",
  "level-4-stock-market:Construire son premier portefeuille": "Un portefeuille doit rester lisible. Chaque ligne mérite sa raison. Simple peut être solide."
};

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
    id: "level-3-real-estate",
    order: 3,
    title: "Niveau 3 : Immobilier",
    category: "risk",
    description: "Comprendre les bases de l'investissement immobilier.",
    status: "locked",
    unlocks: [],
    chapters: [
      createChapter(
        "real-estate-basics",
        "Chapitre 1 : Bases de l'immobilier",
        "Comprendre l'achat, le crédit, le rendement et les pièges classiques.",
        [
          createLessonSeed(
            "Pourquoi l'immobilier attire autant ?",
            "8 min",
            "Maximilien visite un studio près d'une gare.\n\nLa pièce est propre.\n\nL'agent parle déjà d'autres acheteurs.\n\nTout donne envie d'aller vite.\n\nPourtant, un bien qui rassure peut changer dès que les chiffres apparaissent.",
            "La pierre rassure. Les chiffres protègent.",
            createQuizQuestions([
              {
                question: "Pourquoi Maximilien doit-il ralentir ?",
                options: ["Parce qu'une impression rassurante ne suffit pas", "Parce qu'un studio est toujours mauvais", "Parce qu'il faut éviter tous les achats"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle donnée rend l'analyse plus solide ?",
                options: ["La couleur du parquet", "Le coût complet du projet", "Le nombre de photos"],
                correctOptionIndex: 1
              },
              {
                question: "Quelle erreur doit-il éviter ?",
                options: ["Comparer avant de décider", "Relire l'annonce", "Croire l'urgence sans vérifier"],
                correctOptionIndex: 2
              },
              {
                question: "Que montre le rendement brut ?",
                options: ["Un premier rapport entre revenu et coût", "Une garantie de bénéfice", "Le montant exact du crédit"],
                correctOptionIndex: 0
              },
              {
                question: "Quelle phrase résume la méthode ?",
                options: ["Acheter vite protège l'opportunité", "Le charme suffit", "Ralentir avant de s'attacher"],
                correctOptionIndex: 2
              }
            ]),
            {
              sections: [
                "Un bien immobilier paraît concret : une adresse, une porte, des clés.\n\nCette sensation donne confiance.\n\nMais posséder un logement ne suffit pas.\n\nUn investissement doit aussi être financé, entretenu et loué correctement.",
                "L'erreur fréquente consiste à croire l'annonce trop vite.\n\nUn bien demandé n'est pas forcément rentable.\n\nLa pression aide surtout le vendeur.\n\nL'acheteur, lui, doit vérifier avant de s'attacher.",
                "Trouve une annonce proche de chez toi.\n\nRemplis les mêmes lignes que l'exemple, sans ajouter d'avis personnel.\n\nRegarde seulement si le projet tient debout."
              ],
              example: "🏢 Prix :\n126 000 €\n\n📑 Frais de notaire :\n9 500 €\n\n🛠 Travaux :\n3 800 €\n\n🏠 Loyer réaliste :\n640 € / mois\n\n💰 Coût total :\n139 300 €\n\n📊 Rendement brut :\n5,5 %",
              takeaway: "La pierre rassure.\n\nLes chiffres protègent.\n\nCelui qui ralentit achète déjà mieux."
            }
          ),
          createTopicLesson({
            title: "Acheter sa résidence principale ou investir ?",
            duration: "8 min",
            intro: "Acheter un logement peut répondre à deux envies très différentes.\n\nHabiter mieux.\n\nOu faire travailler son argent.\n\nLes deux projets peuvent être intelligents, mais ils ne se jugent pas avec la même grille.",
            story: "Maëlya cherche une résidence principale. Elle travaille tôt le matin et veut réduire ses trajets. Elle visite un appartement calme, proche de son travail, avec une cuisine ouverte et une petite terrasse.\n\nPour elle, le vrai bénéfice serait de gagner quarante minutes par jour et de se sentir chez elle.\n\nMartin, de son côté, étudie une colocation dans une ville étudiante. Le salon n'est pas très séduisant, mais l'emplacement est proche d'un campus, les chambres sont bien séparées et la demande locative semble forte.\n\nMaëlya pense qualité de vie.\n\nMartin pense usage locatif.\n\nIls parlent tous les deux d'immobilier, mais ils ne cherchent pas la même victoire.",
            explanation: "La résidence principale est d'abord un choix de vie. Elle peut apporter de la stabilité, du confort et une protection contre certains changements de loyer.\n\nUn investissement locatif est différent. Il doit être observé comme un petit système économique : argent qui entre, argent qui sort, temps de gestion, risques et fiscalité.\n\nLe danger apparaît quand on mélange les deux approches. Un logement parfait pour toi peut être moyen pour un locataire. À l'inverse, un bien très efficace en location peut ne pas te donner envie d'y vivre.",
            example: "Exemple pédagogique : Maëlya achète sa résidence principale avec une mensualité de 950 €.\n\nSon ancien loyer était de 850 €.\n\nElle paie donc 100 € de plus par mois, mais gagne du confort, de la stabilité et réduit ses trajets.\n\nMartin étudie une colocation à 180 000 € qui peut louer trois chambres à 380 €.\n\nLoyer total : 1 140 € par mois.\n\nPour Martin, la question n'est pas « est-ce que j'aimerais y vivre ? » mais « est-ce que les loyers couvrent le crédit, les charges, l'entretien et les risques ? »",
            mistake: "Première erreur : croire que payer un crédit est toujours mieux que payer un loyer. Si le projet est trop lourd, il peut réduire ta liberté.\n\nDeuxième erreur : acheter sa résidence principale comme si elle devait forcément être rentable.\n\nTroisième erreur : choisir un investissement locatif parce qu'il correspond à tes goûts, alors que le futur locataire n'aura peut-être pas les mêmes besoins.\n\nQuatrième erreur : oublier les frais de changement. Acheter puis revendre rapidement peut coûter cher.",
            mission: "Prends une feuille et trace deux colonnes.\n\nColonne 1 : « logement pour vivre ».\n\nColonne 2 : « logement pour louer ».\n\nÉcris cinq critères dans chaque colonne. Tu verras que certains critères se ressemblent, mais que les priorités changent.",
            challenge: "Imagine un appartement très rentable sur le papier, mais situé dans une ville où tu ne voudrais jamais habiter.\n\nEst-ce forcément un mauvais investissement ?\n\nLa réponse dépend d'une chose : qui va l'utiliser, toi ou un locataire.",
            takeaway: "Habiter et investir sont deux objectifs différents.\n\nLe confort se mesure autrement que la rentabilité.\n\nUn bon choix commence par une intention claire.",
            quiz: [
              ["Quelle est la priorité d'une résidence principale ?", ["Un lieu de vie adapté", "Un locataire immédiat", "Un rendement garanti"], 0],
              ["Pourquoi Martin regarde-t-il la colocation différemment ?", ["Il veut y vivre", "Il analyse la demande et les loyers", "Il cherche seulement une terrasse"], 1],
              ["Quel danger existe quand on mélange les deux approches ?", ["Le prix disparaît", "Le crédit devient gratuit", "On juge un investissement avec ses goûts personnels"], 2],
              ["Pourquoi revendre rapidement peut coûter cher ?", ["À cause des frais liés à l'achat et à la revente", "Parce que le logement devient invisible", "Parce que les loyers sont interdits"], 0],
              ["Quelle question doit venir en premier ?", ["Quelle peinture choisir ?", "Quel est l'objectif du bien ?", "Combien de meubles acheter ?"], 1]
            ]
          }),
          createTopicLesson({
            title: "Comprendre un crédit immobilier",
            duration: "9 min",
            intro: "Le crédit est l'un des grands leviers de l'immobilier.\n\nIl permet d'acheter aujourd'hui un bien que l'on remboursera demain.\n\nUtilisé avec méthode, il accélère un projet.\n\nMal compris, il enferme pendant des années.",
            story: "Maximilien prépare son premier achat avec sa banque. Il pense surtout à une chose : obtenir une mensualité qui « passe ».\n\nLe conseiller lui propose deux scénarios. Sur 20 ans, la mensualité est plus élevée. Sur 25 ans, elle devient plus confortable.\n\nMaximilien préfère d'abord la deuxième option.\n\nPuis Emma lui demande de regarder la dernière ligne du tableau : le coût total du crédit.\n\nIl découvre que la mensualité plus douce peut coûter plusieurs milliers d'euros de plus sur la durée.\n\nCe n'est pas une mauvaise solution pour autant. Mais ce n'est plus une décision à prendre seulement avec le montant mensuel.",
            explanation: "Un crédit immobilier se lit avec plusieurs informations : le capital emprunté, le taux d'intérêt, la durée, l'assurance, les frais éventuels et le coût total.\n\nLa mensualité indique l'effort chaque mois. Le coût total indique le prix réel du financement.\n\nUn crédit plus long peut aider à respirer, surtout au début. Mais il augmente souvent la somme payée en intérêts. La bonne question n'est donc pas seulement « puis-je payer ? » mais aussi « qu'est-ce que cette durée me coûte et me permet ? »",
            example: "Exemple pédagogique : Maximilien emprunte 160 000 €.\n\nScénario A : mensualité d'environ 910 € sur 20 ans. Total remboursé approximatif : 218 400 €.\n\nScénario B : mensualité d'environ 790 € sur 25 ans. Total remboursé approximatif : 237 000 €.\n\nDifférence mensuelle : 120 € de moins avec le scénario B.\n\nDifférence totale : environ 18 600 € de plus sur la durée.\n\nLe scénario B peut rester utile si la trésorerie est fragile, mais il doit être choisi consciemment.",
            mistake: "Première erreur : ne regarder que la mensualité.\n\nDeuxième erreur : oublier l'assurance emprunteur, qui peut peser chaque mois.\n\nTroisième erreur : emprunter au maximum de ce que la banque accepte sans garder de marge pour vivre.\n\nQuatrième erreur : croire qu'un accord bancaire signifie automatiquement que le projet est sain.",
            mission: "Utilise un simulateur de crédit et compare trois durées pour le même montant emprunté : 15 ans, 20 ans et 25 ans.\n\nNote à chaque fois la mensualité, puis le total remboursé.\n\nTu dois voir le compromis entre confort mensuel et coût global.",
            challenge: "Si une durée plus longue te fait économiser 120 € par mois mais coûte 18 600 € de plus au total, dans quel cas cela peut-il quand même se défendre ?\n\nRéfléchis en termes de sécurité, de marge mensuelle et de stabilité.",
            takeaway: "La mensualité montre l'effort.\n\nLe coût total révèle le prix du temps.\n\nUn bon crédit se choisit avec une marge de sécurité.",
            quiz: [
              ["Que montre principalement la mensualité ?", ["L'effort à payer chaque mois", "La valeur exacte du bien", "Le montant du loyer futur"], 0],
              ["Que découvre Maximilien en comparant deux durées ?", ["La durée ne change rien", "Une mensualité plus basse peut coûter plus cher au total", "L'assurance disparaît"], 1],
              ["Quel élément est souvent oublié dans un crédit ?", ["L'adresse du bien", "La couleur du dossier", "L'assurance emprunteur"], 2],
              ["Pourquoi ne pas emprunter au maximum possible ?", ["Pour garder une marge de sécurité", "Pour payer plus cher volontairement", "Pour éviter toute analyse"], 0],
              ["Quelle phrase est la plus juste ?", ["Un accord bancaire suffit", "Un crédit doit être compris avant d'être signé", "Le coût total ne compte jamais"], 1]
            ]
          }),
          createTopicLesson({
            title: "Rendement brut, net et cash-flow",
            duration: "9 min",
            intro: "Un rendement élevé peut donner l'impression qu'un bien est excellent.\n\nMais un seul pourcentage ne raconte jamais toute l'histoire.\n\nPour comprendre un projet, il faut descendre du chiffre séduisant vers l'argent réellement disponible.",
            story: "Martin étudie un petit immeuble de rapport composé de trois appartements. Sur l'annonce, le vendeur met en avant « plus de 8 % de rendement ».\n\nLe chiffre impressionne Martin. Trois loyers, un seul immeuble, une rentabilité qui semble supérieure à la moyenne.\n\nMaëlya lui propose de refaire le calcul ensemble. Elle sépare les loyers, les charges, la taxe foncière, l'assurance, l'entretien et la mensualité du crédit.\n\nLe projet reste intéressant, mais il n'a plus la même apparence.\n\nLe rendement brut avait ouvert la porte. Le cash-flow décide s'il peut respirer chaque mois.",
            explanation: "Le rendement brut est le calcul le plus rapide : loyers annuels divisés par le coût d'achat.\n\nLe rendement net ajoute une dose de réalisme en retirant des frais comme la taxe foncière, les charges non récupérables, l'assurance ou l'entretien.\n\nLe cash-flow observe le mois concret : une fois les loyers encaissés et toutes les dépenses payées, reste-t-il de l'argent, faut-il en ajouter, ou le projet est-il équilibré ?\n\nCes trois lectures ne s'opposent pas. Elles se complètent.",
            example: "Exemple pédagogique : un immeuble coûte 210 000 € frais inclus.\n\nIl produit trois loyers de 520 € par mois, soit 1 560 € mensuels.\n\nLoyer annuel : 1 560 € x 12 = 18 720 €.\n\nRendement brut : 18 720 € / 210 000 € = 8,91 %.\n\nCharges annuelles estimées : taxe foncière 1 800 €, assurance 360 €, entretien prévisionnel 1 200 €, charges non récupérables 840 €.\n\nFrais annuels : 4 200 €.\n\nRevenu net avant crédit : 18 720 € - 4 200 € = 14 520 €.\n\nSi le crédit coûte 1 320 € par mois, soit 15 840 € par an, le cash-flow annuel devient 14 520 € - 15 840 € = -1 320 €, donc environ -110 € par mois.",
            mistake: "Première erreur : annoncer le rendement brut comme si c'était le résultat final.\n\nDeuxième erreur : oublier qu'un bien peut être rentable sur un an parfait et plus fragile avec un logement vide.\n\nTroisième erreur : confondre cash-flow négatif et mauvais projet. Parfois un effort mensuel peut être accepté, mais il doit être volontaire.\n\nQuatrième erreur : comparer deux biens sans utiliser la même méthode de calcul.",
            mission: "Choisis un bien à louer et calcule trois lignes : rendement brut, charges annuelles estimées, cash-flow après crédit.\n\nMême avec des chiffres approximatifs, l'exercice t'apprend à poser les bonnes questions.",
            challenge: "Un projet affiche 9 % brut mais demande 110 € d'effort chaque mois après crédit.\n\nEst-il mauvais automatiquement ?\n\nRéponds en pensant à l'objectif, à la sécurité et au potentiel du bien.",
            takeaway: "Le brut sert à repérer.\n\nLe net sert à filtrer.\n\nLe cash-flow sert à décider avec lucidité.",
            quiz: [
              ["Comment calcule-t-on le rendement brut ?", ["Loyers annuels divisés par coût d'achat", "Mensualité divisée par surface", "Taxe foncière divisée par loyer"], 0],
              ["Que fait Maëlya dans l'histoire ?", ["Elle ignore les frais", "Elle refait le calcul avec les dépenses", "Elle choisit selon la façade"], 1],
              ["Que montre le cash-flow ?", ["La note énergétique seulement", "La valeur sentimentale du bien", "L'argent restant ou manquant chaque mois"], 2],
              ["Un cash-flow négatif signifie toujours :", ["Un projet à analyser consciemment", "Un projet impossible", "Un rendement brut nul"], 0],
              ["Quelle méthode est la plus solide ?", ["Comparer seulement les annonces", "Utiliser la même méthode de calcul pour chaque bien", "Garder uniquement le chiffre vendeur"], 1]
            ]
          }),
          createTopicLesson({
            title: "Les charges à ne jamais oublier",
            duration: "8 min",
            intro: "Un loyer est facile à voir.\n\nLes charges, elles, avancent souvent plus discrètement.\n\nPourtant, ce sont elles qui transforment parfois un projet confortable en effort imprévu.",
            story: "Emma analyse une maison à rénover légèrement pour la louer à une famille. Le loyer estimé est de 980 € et la mensualité du crédit serait proche de 760 €.\n\nAu premier regard, il semble rester 220 €.\n\nPuis Martin lui propose de construire une année complète comme si elle possédait déjà la maison.\n\nIls ajoutent la taxe foncière, l'assurance propriétaire non occupant, l'entretien du jardin, une provision pour chaudière, quelques semaines de vacance possible et les petites réparations que personne ne prévoit au départ.\n\nLe projet n'est pas détruit. Il devient simplement plus réel.\n\nEmma réalise qu'un bien immobilier ne demande pas seulement d'être acheté. Il demande d'être entretenu.",
            explanation: "Les charges sont toutes les dépenses qui accompagnent le bien pendant sa détention.\n\nCertaines sont prévisibles : taxe foncière, assurance, copropriété, frais de gestion, comptabilité éventuelle.\n\nD'autres sont irrégulières : réparation, remplacement d'un équipement, vacance locative, remise en état entre deux locataires.\n\nUne bonne analyse ne prétend pas connaître l'avenir. Elle réserve une place aux dépenses probables.",
            example: "Exemple pédagogique : loyer mensuel estimé : 980 €.\n\nMensualité du crédit : 760 €.\n\nÉcart apparent : +220 € par mois.\n\nCharges à mensualiser : taxe foncière 1 080 € par an = 90 € par mois ; assurance 240 € par an = 20 € par mois ; entretien prévisionnel 600 € par an = 50 € par mois ; vacance locative estimée 490 € par an = environ 41 € par mois.\n\nTotal charges mensualisées : 201 €.\n\nMarge réelle estimée : 220 € - 201 € = 19 € par mois avant fiscalité.",
            mistake: "Première erreur : calculer seulement l'écart entre loyer et mensualité.\n\nDeuxième erreur : oublier les dépenses annuelles parce qu'elles n'arrivent pas tous les mois.\n\nTroisième erreur : ne rien prévoir pour l'entretien, alors qu'un logement s'use naturellement.\n\nQuatrième erreur : considérer la vacance locative comme impossible.\n\nCinquième erreur : ne pas relire les documents de copropriété quand il y en a.",
            mission: "Crée ta checklist de charges immobilières.\n\nElle doit contenir au moins huit lignes : taxe foncière, assurance, copropriété, entretien, travaux, vacance, gestion, fiscalité à vérifier.\n\nGarde cette liste pour les prochaines leçons.",
            challenge: "Un bien semble dégager +220 € par mois avant charges, puis seulement +19 € après charges mensualisées.\n\nQuelle information ce changement t'apporte-t-il sur la solidité du projet ?",
            takeaway: "Une charge annuelle doit devenir un chiffre mensuel.\n\nUn logement s'use même quand tout va bien.\n\nLa marge réelle se calcule après les dépenses oubliées.",
            quiz: [
              ["Pourquoi mensualiser la taxe foncière ?", ["Pour l'intégrer au calcul réel", "Pour la supprimer", "Pour augmenter le loyer automatiquement"], 0],
              ["Dans l'histoire, que comprend Emma ?", ["Une maison ne s'entretient jamais", "Un bien doit être entretenu après l'achat", "La mensualité suffit à tout calculer"], 1],
              ["Quelle dépense irrégulière doit être prévue ?", ["La vacance locative", "Un rendement garanti", "Une plus-value obligatoire"], 0],
              ["Que montre l'exemple chiffré ?", ["Les charges peuvent réduire fortement la marge", "Les charges n'ont aucun effet", "Le loyer disparaît"], 0],
              ["Quelle checklist est la plus utile ?", ["Loyer et mensualité seulement", "Taxe, assurance, entretien, vacance, gestion et fiscalité à vérifier", "Couleur des murs et exposition"], 1]
            ]
          }),
          createTopicLesson({
            title: "Les travaux : opportunité ou piège ?",
            duration: "8 min",
            intro: "Les travaux peuvent créer de la valeur.\n\nIls peuvent aussi coûter plus cher, durer plus longtemps et fatiguer plus que prévu.\n\nIl faut donc les analyser avec prudence.",
            story: "Maëlya voit un appartement à rénover et imagine une belle plus-value.\n\nMartin demande des devis, ajoute une marge de sécurité et vérifie le temps sans locataire.\n\nL'opportunité devient un calcul, pas un rêve.",
            explanation: "Les travaux sont intéressants s'ils améliorent vraiment le bien, le loyer ou la valeur.\n\nMais ils doivent être chiffrés avant l'achat.",
            example: "Exemple pédagogique : 15 000 € de travaux peuvent devenir 18 000 € si un imprévu apparaît.\n\nPrévoir une marge protège le projet.",
            mistake: "Sous-estimer le coût, la durée et l'énergie nécessaires.",
            mission: "Regarde une annonce avec travaux et note trois questions à poser avant de visiter.",
            challenge: "Des travaux non chiffrés sont-ils une opportunité ou un risque ?\n\nD'abord un risque.",
            takeaway: "Les travaux peuvent enrichir un projet seulement s'ils sont maîtrisés.",
            quiz: [
              ["Les travaux peuvent être :", ["Une opportunité ou un piège", "Toujours gratuits", "Toujours inutiles"], 0],
              ["Que fait Martin avant de décider ?", ["Il demande des devis", "Il signe immédiatement", "Il ignore la durée"], 0],
              ["Pourquoi prévoir une marge ?", ["Pour absorber les imprévus", "Pour décorer davantage", "Pour éviter tout calcul"], 0],
              ["Quelle erreur est fréquente ?", ["Chiffrer les travaux", "Sous-estimer coût et durée", "Vérifier les artisans"], 1],
              ["Quelle phrase est juste ?", ["Des travaux maîtrisés peuvent créer de la valeur", "Les travaux garantissent un gain", "Aucun devis n'est utile"], 0]
            ]
          }),
          createTopicLesson({
            title: "Louer vide, meublé ou saisonnier ?",
            duration: "9 min",
            intro: "Tous les types de location ne se ressemblent pas.\n\nLouer vide, meublé ou en saisonnier peut changer le loyer, les règles, le temps de gestion et le risque.",
            story: "Maximilien veut le loyer le plus élevé possible.\n\nEmma lui demande combien de temps il veut gérer, quelles règles s'appliquent et quel type de locataire recherche le secteur.\n\nLe meilleur choix dépend du contexte.",
            explanation: "La location vide peut être plus simple et stable.\n\nLa location meublée peut demander plus d'équipement.\n\nLa location saisonnière peut être plus active et plus réglementée.",
            example: "Exemple pédagogique : un studio en ville étudiante peut mieux fonctionner en meublé qu'une grande maison familiale.",
            mistake: "Choisir le mode de location seulement parce que le loyer affiché semble plus haut.",
            mission: "Choisis une ville et demande-toi : qui loue ici ? Étudiants, familles, touristes, salariés ?",
            challenge: "Le loyer le plus élevé est-il toujours le meilleur choix ?\n\nNon, il faut regarder gestion, règles et risque.",
            takeaway: "Le bon mode de location dépend du bien, du secteur et du temps que tu peux gérer.",
            quiz: [
              ["Quels modes de location existent ?", ["Vide, meublé, saisonnier", "Uniquement vide", "Uniquement achat-revente"], 0],
              ["Pourquoi le contexte compte ?", ["Parce que la demande change selon le secteur", "Parce que les règles disparaissent", "Parce que le prix suffit"], 0],
              ["Quelle location peut demander plus de gestion ?", ["Saisonnière", "Aucune", "Toutes sans différence"], 0],
              ["Quelle erreur éviter ?", ["Étudier la demande", "Choisir seulement le loyer le plus haut", "Comparer les règles"], 1],
              ["Quelle phrase résume la leçon ?", ["Le mode de location se choisit avec méthode", "Le meublé gagne toujours", "La location vide est toujours mauvaise"], 0]
            ]
          }),
          createTopicLesson({
            title: "Les erreurs du premier investissement",
            duration: "8 min",
            intro: "Le premier investissement immobilier est souvent le plus émotionnel.\n\nOn veut bien faire, mais on peut aller trop vite.\n\nConnaître les erreurs classiques permet de les éviter.",
            story: "Martin visite un bien et se projette immédiatement.\n\nMaëlya garde une grille simple : prix, loyer, charges, travaux, demande, crédit et marge de sécurité.\n\nElle ne cherche pas le bien parfait.\n\nElle cherche un projet compréhensible.",
            explanation: "Les erreurs viennent souvent de l'émotion, d'un calcul incomplet ou d'une confiance excessive.",
            example: "Exemple pédagogique : acheter sans vérifier la demande locative peut créer plusieurs mois sans locataire.",
            mistake: "Confondre coup de cœur et investissement.",
            mission: "Crée une checklist de sept points à vérifier avant tout achat immobilier.",
            challenge: "Un coup de cœur peut-il remplacer une analyse ?\n\nNon.",
            takeaway: "Le premier investissement doit être simple, lisible et calculé.",
            quiz: [
              ["Pourquoi le premier investissement est risqué ?", ["Il peut être très émotionnel", "Il est toujours gratuit", "Il ne demande aucune analyse"], 0],
              ["Que vérifie Maëlya ?", ["Prix, loyer, charges, travaux et demande", "Seulement la cuisine", "Uniquement le coup de cœur"], 0],
              ["Quelle erreur faut-il éviter ?", ["Faire une checklist", "Confondre coup de cœur et investissement", "Vérifier la demande"], 1],
              ["Que peut provoquer une demande locative faible ?", ["Des mois sans locataire", "Un loyer garanti", "Une taxe supprimée"], 0],
              ["Quelle phrase résume la leçon ?", ["Simple, lisible, calculé", "Rapide, impulsif, flou", "Secret, urgent, garanti"], 0]
            ]
          }),
          createTopicLesson({
            title: "Immobilier et fiscalité : les bases",
            duration: "9 min",
            intro: "La fiscalité fait partie du résultat immobilier.\n\nElle peut changer ce qu'il reste réellement après les loyers, les charges et les impôts.\n\nIl faut l'intégrer dès le départ.",
            story: "Emma calcule son projet avant impôts.\n\nMaximilien ajoute une ligne fiscalité et comprend que le résultat réel peut être différent.\n\nIl ne cherche pas à optimiser tout de suite.\n\nIl veut d'abord éviter les surprises.",
            explanation: "Selon le type de location, le régime fiscal et la situation personnelle, le résultat peut changer.\n\nCeci est un exemple pédagogique, pas un conseil fiscal personnalisé.",
            example: "Exemple pédagogique : 500 € de loyer mensuel ne deviennent pas automatiquement 500 € disponibles.\n\nIl faut tenir compte des charges et de la fiscalité.",
            mistake: "Calculer la rentabilité sans aucune ligne pour les impôts.",
            mission: "Ajoute une ligne « fiscalité à vérifier » dans toute analyse immobilière.",
            challenge: "Un projet rentable avant impôts peut-il devenir moins intéressant après fiscalité ?\n\nOui.",
            takeaway: "La fiscalité ne doit pas faire peur.\n\nElle doit être prévue.",
            quiz: [
              ["Pourquoi intégrer la fiscalité ?", ["Elle influence le résultat réel", "Elle garantit un gain", "Elle remplace les charges"], 0],
              ["Ce contenu est :", ["Un exemple pédagogique", "Un conseil fiscal personnalisé", "Une promesse de résultat"], 0],
              ["Quelle erreur est fréquente ?", ["Prévoir une ligne fiscalité", "Calculer sans tenir compte des impôts", "Demander conseil si nécessaire"], 1],
              ["500 € de loyer signifie-t-il 500 € disponibles ?", ["Pas forcément", "Oui toujours", "Oui sans charges"], 0],
              ["Quelle phrase résume la leçon ?", ["La fiscalité doit être prévue", "La fiscalité n'existe pas", "Les impôts garantissent le cash-flow"], 0]
            ]
          }),
          createTopicLesson({
            title: "Construire son premier plan immobilier",
            duration: "10 min",
            intro: "Un premier plan immobilier doit rester simple.\n\nIl ne sert pas à acheter immédiatement.\n\nIl sert à savoir quoi chercher, pourquoi et avec quelles limites.",
            story: "Maëlya veut investir mais se sent perdue.\n\nMartin écrit un plan : ville ciblée, budget maximum, type de bien, loyer attendu, charges à vérifier, travaux acceptables et marge de sécurité.\n\nIl transforme une envie en méthode.",
            explanation: "Un plan immobilier définit le cadre avant les visites.\n\nIl évite de décider sous pression ou sous émotion.",
            example: "Exemple pédagogique : budget maximum 130 000 €, studio ou T2, demande locative étudiante, travaux légers seulement, cash-flow au moins équilibré.",
            mistake: "Visiter sans critères et adapter les calculs pour justifier un coup de cœur.",
            mission: "Écris ton premier cadre immobilier : ville, budget, type de bien, risque accepté et objectif.",
            challenge: "Pourquoi fixer des critères avant les visites ?\n\nPour éviter les décisions impulsives.",
            takeaway: "Tu comprends maintenant les bases de l'immobilier.",
            quiz: [
              ["À quoi sert un plan immobilier ?", ["À décider sous émotion", "À fixer un cadre avant les visites", "À garantir un gain"], 1],
              ["Que peut contenir le plan ?", ["Ville, budget, type de bien et objectif", "Seulement une photo", "Une promesse de richesse"], 0],
              ["Quelle erreur éviter ?", ["Avoir des critères", "Adapter les calculs pour un coup de cœur", "Prévoir une marge"], 1],
              ["Pourquoi fixer une limite de budget ?", ["Pour protéger le projet", "Pour acheter plus cher", "Pour ignorer le crédit"], 0],
              ["Que sais-tu à la fin du Niveau 3 ?", ["Les bases de l'immobilier", "Comment garantir tous les loyers", "Comment supprimer les impôts"], 0]
            ],
            successMessage: "Tu comprends maintenant les bases de l'immobilier."
          })
        ]
      )
    ]
  }),
  createLevel({
    id: "level-4-stock-market",
    order: 4,
    title: "Niveau 4 : Bourse",
    category: "opportunities",
    description: "Comprendre les bases de la bourse et investir avec méthode.",
    status: "locked",
    unlocks: ["sport", "markets", "ai"],
    chapters: [
      createChapter(
        "stock-market-basics",
        "Chapitre 1 : Bases de la bourse",
        "Comprendre actions, ETF, risque, diversification et portefeuille simple.",
        [
          createTopicLesson({
            title: "C'est quoi la bourse ?",
            duration: "8 min",
            intro: "La bourse est un lieu où l'on peut acheter et vendre des parts d'entreprises ou d'autres produits financiers.\n\nElle peut sembler impressionnante.\n\nMais à la base, elle sert à relier des entreprises qui cherchent de l'argent et des investisseurs qui acceptent un risque.",
            story: "Emma pense que la bourse est réservée aux experts.\n\nMaximilien lui explique qu'acheter une action, c'est devenir propriétaire d'une petite partie d'une entreprise.\n\nCe n'est pas un jeu.\n\nC'est une décision de long terme à comprendre.",
            explanation: "La bourse monte et baisse parce que les investisseurs changent d'avis sur la valeur future des entreprises.",
            example: "Exemple pédagogique : si une entreprise grandit pendant plusieurs années, son action peut prendre de la valeur.\n\nMais si ses résultats déçoivent, elle peut aussi baisser.",
            mistake: "Confondre investir en bourse avec parier sur une hausse rapide.",
            mission: "Choisis une entreprise connue et demande-toi : comment gagne-t-elle de l'argent ?",
            challenge: "Acheter une action, est-ce acheter un ticket magique ?\n\nNon, c'est acheter une petite part d'entreprise.",
            takeaway: "La bourse devient moins impressionnante quand tu comprends ce que tu achètes.",
            quiz: [
              ["Acheter une action signifie :", ["Acheter une petite part d'entreprise", "Acheter une garantie de gain", "Acheter une dette personnelle"], 0],
              ["Pourquoi les prix bougent-ils ?", ["Parce que les avis sur l'avenir changent", "Parce que tout est garanti", "Parce que les prix sont fixes"], 0],
              ["Quelle erreur éviter ?", ["Comprendre l'entreprise", "Parier sur une hausse rapide", "Investir avec méthode"], 1],
              ["La bourse sert notamment à :", ["Relier entreprises et investisseurs", "Supprimer le risque", "Garantir un revenu"], 0],
              ["Quelle phrase résume la leçon ?", ["Comprendre ce qu'on achète", "Acheter sans réfléchir", "Chercher le coup rapide"], 0]
            ]
          }),
          createTopicLesson({
            title: "Actions, ETF et obligations",
            duration: "8 min",
            intro: "La bourse ne contient pas seulement des actions.\n\nOn peut aussi trouver des ETF et des obligations.\n\nChaque produit a un rôle différent.",
            story: "Martin veut acheter une seule action connue.\n\nMaëlya compare trois options : une action, un ETF diversifié et une obligation.\n\nElle comprend que le choix dépend de l'objectif et du risque accepté.",
            explanation: "Une action est une part d'entreprise.\n\nUn ETF est souvent un panier de plusieurs actifs.\n\nUne obligation ressemble davantage à une dette émise par une entreprise ou un État.",
            example: "Exemple pédagogique : acheter une action unique concentre le risque.\n\nAcheter un ETF Monde peut répartir l'investissement sur de nombreuses entreprises.",
            mistake: "Penser que tous les produits boursiers fonctionnent pareil.",
            mission: "Écris une phrase simple pour définir action, ETF et obligation.",
            challenge: "Quel produit répartit souvent le risque plus facilement : une seule action ou un ETF large ?\n\nUn ETF large.",
            takeaway: "Avant d'investir, il faut savoir quel outil tu utilises.",
            quiz: [
              ["Une action est :", ["Une part d'entreprise", "Un livret bancaire", "Une garantie publique"], 0],
              ["Un ETF est souvent :", ["Un panier d'actifs", "Une seule facture", "Un pari sportif"], 0],
              ["Une obligation ressemble plutôt à :", ["Une dette émise par une entreprise ou un État", "Une action de croissance", "Une crypto"], 0],
              ["Quelle erreur éviter ?", ["Définir les produits", "Penser que tout fonctionne pareil", "Comparer les risques"], 1],
              ["Quel outil diversifie souvent plus facilement ?", ["Une seule action", "Un ETF large", "Une intuition"], 1]
            ]
          }),
          createTopicLesson({
            title: "Le PEA, le CTO et l'assurance-vie",
            duration: "9 min",
            intro: "Avant d'acheter un investissement, il faut souvent choisir une enveloppe.\n\nPEA, CTO et assurance-vie sont des cadres différents.\n\nIls n'ont pas les mêmes règles.",
            story: "Maximilien veut investir dans un ETF.\n\nEmma lui demande où il va le loger : PEA, CTO ou assurance-vie.\n\nIl découvre que l'enveloppe compte autant que le produit.",
            explanation: "Le PEA est souvent utilisé pour les actions et ETF éligibles.\n\nLe CTO est plus large mais avec une fiscalité différente.\n\nL'assurance-vie peut servir à plusieurs objectifs patrimoniaux.",
            example: "Exemple pédagogique : le même ETF peut ne pas être disponible dans toutes les enveloppes.",
            mistake: "Ouvrir une enveloppe sans comprendre ses règles de base.",
            mission: "Note les trois mots : PEA, CTO, assurance-vie. Ajoute pour chacun : à vérifier avant d'ouvrir.",
            challenge: "L'enveloppe peut-elle influencer ton investissement ?\n\nOui.",
            takeaway: "Le support compte, mais l'enveloppe aussi.",
            quiz: [
              ["PEA, CTO et assurance-vie sont :", ["Des enveloppes d'investissement", "Des entreprises", "Des garanties de rendement"], 0],
              ["Pourquoi l'enveloppe compte ?", ["Elle a ses règles et sa fiscalité", "Elle supprime tout risque", "Elle garantit les dividendes"], 0],
              ["Le CTO est souvent :", ["Plus large en choix", "Réservé aux logements", "Toujours sans fiscalité"], 0],
              ["Quelle erreur éviter ?", ["Lire les règles", "Ouvrir sans comprendre", "Comparer les enveloppes"], 1],
              ["Quelle phrase résume la leçon ?", ["Le produit et l'enveloppe comptent", "L'enveloppe ne sert à rien", "Tout est identique"], 0]
            ]
          }),
          createTopicLesson({
            title: "Les ETF : investir simplement",
            duration: "8 min",
            intro: "Les ETF sont souvent utilisés pour investir simplement.\n\nIls permettent d'acheter un panier d'actifs sans choisir chaque entreprise une par une.",
            story: "Maëlya ne veut pas passer ses soirées à analyser toutes les actions.\n\nMartin lui montre qu'un ETF large peut suivre un indice composé de nombreuses entreprises.\n\nElle comprend que simplicité peut aussi vouloir dire méthode.",
            explanation: "Un ETF suit généralement un indice.\n\nIl peut être utile pour investir régulièrement avec diversification.",
            example: "Exemple pédagogique : un ETF Monde peut donner une exposition à des entreprises de plusieurs pays et secteurs.",
            mistake: "Croire qu'un ETF est automatiquement parfait ou sans risque.",
            mission: "Cherche ce que veut dire indice boursier et écris une définition simple.",
            challenge: "Un ETF permet-il d'éviter toute baisse ?\n\nNon.",
            takeaway: "Un ETF peut simplifier l'investissement, mais il doit rester compris.",
            quiz: [
              ["Un ETF permet souvent :", ["D'acheter un panier d'actifs", "D'éviter tout risque", "De garantir un rendement"], 0],
              ["Un ETF suit généralement :", ["Un indice", "Une facture", "Un salaire"], 0],
              ["Pourquoi l'ETF peut être simple ?", ["Il évite de choisir chaque entreprise une par une", "Il supprime les frais", "Il prédit le marché"], 0],
              ["Quelle erreur éviter ?", ["Comprendre l'indice", "Croire qu'un ETF est sans risque", "Investir régulièrement"], 1],
              ["Quelle phrase est juste ?", ["Simple ne veut pas dire magique", "ETF veut dire gain garanti", "Un ETF ne peut jamais baisser"], 0]
            ]
          }),
          createTopicLesson({
            title: "Les dividendes",
            duration: "8 min",
            intro: "Un dividende est une partie des bénéfices qu'une entreprise peut verser à ses actionnaires.\n\nC'est une notion importante, mais elle ne doit pas être idéalisée.",
            story: "Emma veut acheter uniquement des actions à dividendes.\n\nMaximilien lui rappelle qu'un dividende élevé peut parfois cacher une entreprise fragile.\n\nIl regarde la qualité globale, pas seulement le versement.",
            explanation: "Le dividende peut créer un revenu, mais il n'est jamais garanti.\n\nUne entreprise peut le réduire ou l'arrêter.",
            example: "Exemple pédagogique : une action à 100 € verse 4 € de dividende annuel.\n\nCela représente 4 % avant fiscalité et variation du prix de l'action.",
            mistake: "Choisir une action uniquement parce que son dividende semble élevé.",
            mission: "Regarde une entreprise connue et cherche si elle verse un dividende. Note que ce n'est pas une promesse.",
            challenge: "Un dividende élevé est-il toujours bon signe ?\n\nNon.",
            takeaway: "Le dividende peut être intéressant, mais la solidité de l'entreprise reste essentielle.",
            quiz: [
              ["Un dividende est :", ["Une partie des bénéfices versée parfois aux actionnaires", "Un salaire garanti", "Une taxe"], 0],
              ["Le dividende est-il garanti ?", ["Non", "Oui toujours", "Oui si l'action baisse"], 0],
              ["Que peut faire une entreprise ?", ["Réduire ou arrêter son dividende", "Le rendre obligatoire pour toujours", "Supprimer le risque"], 0],
              ["Quelle erreur éviter ?", ["Étudier l'entreprise", "Choisir seulement le dividende élevé", "Regarder la fiscalité"], 1],
              ["Quelle phrase résume la leçon ?", ["La qualité compte plus que le seul dividende", "Le dividende suffit à tout", "Un dividende élevé garantit un bon achat"], 0]
            ]
          }),
          createTopicLesson({
            title: "Le DCA : investir régulièrement",
            duration: "8 min",
            intro: "Le DCA consiste à investir régulièrement la même somme, par exemple chaque mois.\n\nL'objectif est de réduire la pression du timing parfait.",
            story: "Martin attend toujours le meilleur moment pour investir.\n\nMaëlya investit 50 € chaque mois selon son plan.\n\nElle ne sait pas prédire le marché, mais elle construit une discipline.",
            explanation: "Le DCA n'empêche pas les baisses.\n\nIl aide surtout à investir sans dépendre d'une seule date d'achat.",
            example: "Exemple pédagogique : investir 100 € tous les mois pendant un an crée 12 points d'entrée différents.",
            mistake: "Croire que le DCA garantit un gain.",
            mission: "Choisis une somme théorique mensuelle et écris une règle simple : même jour, même montant.",
            challenge: "Pourquoi le DCA peut aider un débutant ?\n\nParce qu'il rend l'action régulière.",
            takeaway: "Le DCA transforme l'investissement en habitude.",
            quiz: [
              ["Le DCA consiste à :", ["Investir régulièrement", "Tout investir au hasard", "Attendre le point parfait"], 0],
              ["Quel avantage principal ?", ["Réduire la pression du timing", "Garantir un gain", "Supprimer les baisses"], 0],
              ["12 mois d'investissement créent :", ["12 points d'entrée", "Une seule décision", "Aucun suivi"], 0],
              ["Quelle erreur éviter ?", ["Avoir une règle", "Croire que le DCA garantit un gain", "Investir régulièrement"], 1],
              ["Quelle phrase résume la leçon ?", ["Le DCA construit une habitude", "Le DCA prédit le marché", "Le DCA interdit les pertes"], 0]
            ]
          }),
          createTopicLesson({
            title: "Le risque en bourse",
            duration: "9 min",
            intro: "La bourse peut baisser.\n\nParfois fortement.\n\nComprendre ce risque évite de paniquer au mauvais moment.",
            story: "Maximilien voit son portefeuille baisser de 12 % et veut tout vendre.\n\nEmma relit son plan : horizon long terme, argent non nécessaire rapidement, diversification.\n\nLa baisse reste désagréable, mais elle ne détruit pas automatiquement le plan.",
            explanation: "Le risque boursier vient des variations de prix, des entreprises, de l'économie et des émotions des investisseurs.",
            example: "Exemple pédagogique : un portefeuille peut perdre 20 % une année et remonter ensuite.\n\nRien n'est garanti, mais l'horizon compte beaucoup.",
            mistake: "Investir de l'argent nécessaire à court terme.",
            mission: "Écris ton horizon : quand pourrais-tu avoir besoin de cet argent ?",
            challenge: "Si tu as besoin de ton argent dans trois mois, dois-tu l'exposer fortement à la bourse ?\n\nNon.",
            takeaway: "Le risque ne disparaît pas.\n\nIl se prépare.",
            quiz: [
              ["La bourse peut :", ["Monter et baisser", "Monter seulement", "Garantir le capital"], 0],
              ["Que vérifie Emma ?", ["Son plan et son horizon", "La panique des autres", "Une rumeur"], 0],
              ["Quel argent faut-il éviter d'exposer fortement ?", ["L'argent nécessaire à court terme", "L'argent long terme", "Une somme prévue dans un plan"], 0],
              ["Quelle erreur éviter ?", ["Préparer le risque", "Investir l'argent utile dans trois mois", "Diversifier"], 1],
              ["Quelle phrase résume la leçon ?", ["Le risque se prépare", "Le risque n'existe pas", "La baisse est impossible"], 0]
            ]
          }),
          createTopicLesson({
            title: "La diversification",
            duration: "8 min",
            intro: "Diversifier signifie répartir son argent.\n\nL'idée est simple : ne pas dépendre d'une seule entreprise, d'un seul pays ou d'un seul secteur.",
            story: "Maëlya aime une entreprise et veut tout investir dessus.\n\nMartin lui montre qu'une mauvaise nouvelle sur cette seule entreprise pourrait peser sur tout son portefeuille.\n\nIl préfère répartir.",
            explanation: "La diversification ne garantit pas de gagner.\n\nElle évite surtout qu'une seule erreur décide de tout.",
            example: "Exemple pédagogique : un ETF mondial peut répartir l'argent sur plusieurs pays et secteurs au lieu d'une seule action.",
            mistake: "Croire que connaître une marque suffit pour tout miser dessus.",
            mission: "Regarde ton portefeuille théorique : dépend-il d'une seule idée ?",
            challenge: "Qu'est-ce qui est plus fragile : une seule action ou un panier diversifié ?\n\nUne seule action.",
            takeaway: "Diversifier, c'est reconnaître qu'on ne peut pas tout prévoir.",
            quiz: [
              ["Diversifier veut dire :", ["Répartir son argent", "Tout mettre sur une action", "Ne jamais investir"], 0],
              ["Pourquoi diversifier ?", ["Pour dépendre moins d'une seule idée", "Pour garantir un gain", "Pour éviter de réfléchir"], 0],
              ["Un ETF mondial peut aider à :", ["Répartir sur plusieurs zones", "Supprimer tout risque", "Garantir un dividende"], 0],
              ["Quelle erreur éviter ?", ["Répartir", "Tout miser sur une marque connue", "Comprendre son portefeuille"], 1],
              ["Quelle phrase résume la leçon ?", ["On ne peut pas tout prévoir", "Une seule action suffit toujours", "La diversification est inutile"], 0]
            ]
          }),
          createTopicLesson({
            title: "Les erreurs des débutants en bourse",
            duration: "8 min",
            intro: "Les débutants font souvent les mêmes erreurs.\n\nCe n'est pas grave de débuter.\n\nCe qui coûte cher, c'est de refuser d'apprendre.",
            story: "Emma achète parce qu'un actif monte vite.\n\nMaximilien attend de comprendre ce qu'il achète, combien il risque et pourquoi cela entre dans son plan.\n\nLa différence n'est pas l'intelligence.\n\nC'est la méthode.",
            explanation: "Les erreurs classiques sont : suivre la foule, investir sans comprendre, paniquer à la baisse et changer de stratégie trop souvent.",
            example: "Exemple pédagogique : acheter après une hausse de 80 % sans comprendre peut exposer à une forte correction.",
            mistake: "Confondre popularité et qualité d'investissement.",
            mission: "Avant tout achat, écris trois raisons rationnelles et un risque principal.",
            challenge: "Une action très populaire est-elle automatiquement un bon achat ?\n\nNon.",
            takeaway: "En bourse, la méthode protège mieux que l'excitation.",
            quiz: [
              ["Quelle erreur est fréquente ?", ["Suivre la foule sans comprendre", "Lire son plan", "Diversifier"], 0],
              ["Que fait Maximilien ?", ["Il comprend avant d'acheter", "Il copie la tendance", "Il ignore le risque"], 0],
              ["Popularité signifie-t-elle qualité ?", ["Non", "Oui toujours", "Oui si tout le monde en parle"], 0],
              ["Quelle mission protège ?", ["Écrire raisons et risque", "Acheter vite", "Ignorer les baisses"], 0],
              ["Quelle phrase résume la leçon ?", ["La méthode protège mieux que l'excitation", "La foule a toujours raison", "La hausse passée garantit la suite"], 0]
            ]
          }),
          createTopicLesson({
            title: "Construire son premier portefeuille",
            duration: "10 min",
            intro: "Un premier portefeuille doit être simple.\n\nIl doit correspondre à ton objectif, ton horizon et ta capacité à accepter les baisses.",
            story: "Martin veut acheter dix actifs différents dès le premier jour.\n\nMaëlya préfère un plan clair : réserve de sécurité, montant mensuel, ETF principal, horizon long terme et suivi mensuel.\n\nElle construit une base, pas une usine à gaz.",
            explanation: "Un portefeuille simple peut commencer avec peu de lignes.\n\nL'important est de savoir pourquoi chaque élément existe.",
            example: "Exemple pédagogique : 80 % ETF Monde, 20 % épargne disponible pour un profil débutant prudent peut être un cadre d'étude, pas un conseil personnalisé.",
            mistake: "Construire un portefeuille trop compliqué avant de maîtriser les bases.",
            mission: "Dessine un portefeuille théorique en trois lignes : réserve, investissement principal, règle de suivi.",
            challenge: "Un portefeuille simple et compris vaut-il mieux qu'un portefeuille compliqué et flou ?\n\nOui.",
            takeaway: "Tu sais maintenant construire les bases d'un portefeuille simple.",
            quiz: [
              ["Un premier portefeuille doit être :", ["Simple et compris", "Très compliqué", "Basé sur des rumeurs"], 0],
              ["Que doit-il respecter ?", ["Objectif, horizon et tolérance au risque", "Uniquement la mode", "La peur du jour"], 0],
              ["L'exemple donné est :", ["Un exemple pédagogique", "Un conseil personnalisé", "Une garantie"], 0],
              ["Quelle erreur éviter ?", ["Faire simple", "Compliquer avant de comprendre", "Suivre une règle"], 1],
              ["Que sais-tu à la fin du Niveau 4 ?", ["Construire les bases d'un portefeuille simple", "Garantir la performance", "Supprimer tous les risques"], 0]
            ],
            successMessage: "Tu sais maintenant construire les bases d'un portefeuille simple."
          })
        ]
      )
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

  const levels = localAcademyProfile.levels.map((_, levelIndex) => {
    const level = profile.levels[levelIndex] ?? localAcademyProfile.levels[levelIndex]!;

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

    if (levelIndex >= 2 && localAcademyProfile.levels[levelIndex]) {
      const levelSeed = localAcademyProfile.levels[levelIndex];

      return {
        ...levelSeed,
        status: level.status,
        certification: {
          ...levelSeed.certification,
          status: level.certification?.status ?? levelSeed.certification.status,
          score: level.certification?.score,
          certifiedAt: level.certification?.certifiedAt
        },
        chapters: levelSeed.chapters.map((chapter, chapterIndex) => {
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

  const modules = localAcademyProfile.modules.map((_, moduleIndex) => {
    const module = profile.modules[moduleIndex] ?? localAcademyProfile.modules[moduleIndex]!;

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

    if (moduleIndex >= 2 && localAcademyProfile.modules[moduleIndex]) {
      const moduleSeed = localAcademyProfile.modules[moduleIndex];

      return {
        ...moduleSeed,
        status: module.status,
        lessons: moduleSeed.lessons.map((lesson, lessonIndex) => {
          const storedLesson = module.lessons[lessonIndex];
          return {
            ...lesson,
            status: storedLesson?.status ?? lesson.status,
            completedAt: storedLesson?.completedAt
          };
        }),
        quiz: {
          ...moduleSeed.quiz,
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
            description: getAcademyLessonCardDescription(level.id, lesson.title, lesson.summary ?? lesson.description),
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

function getAcademyLessonCardDescription(levelId: string, title: string, fallback: string): string {
  return ACADEMY_LESSON_CARD_DESCRIPTIONS[`${levelId}:${title}`] ?? fallback;
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

function createTopicLesson(params: {
  title: string;
  duration: string;
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
    params.duration,
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
        `Erreur fréquente : ${params.mistake}`,
        `Mission Ascension : ${params.mission}`,
        `Défi : ${params.challenge}`,
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
