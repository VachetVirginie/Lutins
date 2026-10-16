export interface KitAsset { file: string; label: string; page: number }

export interface DailySheet {
  day: number
  date: string
  title: string
  adultPreparation: string
  message: string
  assets: KitAsset[]
  gifts: string[]
}

/** Source éditoriale vérifiée dans Le-voyage-des-lutins-Louis-70-jours.pdf. */
export const dailySheets: Record<number, DailySheet> = {
  1: {
    "day": 1,
    "date": "SAMEDI 17 OCTOBRE 2026",
    "title": "L'Alerte du Pôle Nord",
    "adultPreparation": "Glisser la lettre dans la boîte aux lettres (dans une enveloppe rouge ou kraft, avec un tampon ou dessin de flocon).",
    "message": "Ho Ho Ho ! Bonjour mon cher Louis, Je t’écris cette lettre en urgence depuis le Pôle Nord. Ce matin, en faisant l’appel dans l’atelier de jouets, un de mes lutins manquait à l’appel ! Après vérification, il a laissé un petit mot : il paraît qu’il a entendu dire que tu étais un petit garçon très courageux et rigolo à Lyon, et il a décidé de s’échapper pour venir te rencontrer ! Il est très gourmand et un brin farceur. Il s’est mis en route aujourd’hui même. Garde bien l’œil ouvert sur la boîte aux lettres, il risque de t’envoyer des nouvelles de son voyage... et prépare-toi à l’accueillir bientôt chez toi ! Avec toute mon affection, Le Père Noël",
    "assets": [],
    "gifts": []
  },
  2: {
    "day": 2,
    "date": "DIMANCHE 18 OCTOBRE 2026",
    "title": "La Préparation du Sac",
    "adultPreparation": "Imprimer une image d'un petit sac à dos au pied d'un sapin enneigé. À joindre : Carte A : sac à dos (annexes).",
    "message": "Coucou Louis ! C'est moi, le lutin ! Le Père Noël t'a écrit ? Je prépare mon sac avec du pain d'épices pour le grand voyage vers Lyon !",
    "assets": [
      {
        "file": "/assets/printables/annexe-74.png",
        "label": "Carte du sac de voyage",
        "page": 74
      }
    ],
    "gifts": [
      "Pain d’épices"
    ]
  },
  3: {
    "day": 3,
    "date": "LUNDI 19 OCTOBRE 2026",
    "title": "Le Départ en Traîneau",
    "adultPreparation": "Une carte imprimée avec une illustration de paysages enneigés + un coloriage de lutin à faire. À joindre : Carte H : Pôle Nord + coloriage (annexes).",
    "message": "Je monte à bord du traîneau d'entraînement ! Prochaine étape : la banquise. Je t'ai mis un coloriage de moi pour que tu puisses décorer ta chambre !",
    "assets": [
      {
        "file": "/assets/printables/annexe-81.png",
        "label": "Carte du départ du Pôle Nord",
        "page": 81
      },
      {
        "file": "/assets/printables/annexe-82.png",
        "label": "Coloriage du lutin",
        "page": 82
      }
    ],
    "gifts": []
  },
  4: {
    "day": 4,
    "date": "MARDI 20 OCTOBRE 2026",
    "title": "La Première Pause goûter",
    "adultPreparation": "Petit papier plié dans la boîte aux lettres.",
    "message": "Brrr, il fait très froid sur la banquise ! J'ai dû m'arrêter pour manger un biscuit. Et toi, tu as pris un bon goûter aujourd'hui ?",
    "assets": [],
    "gifts": [
      "Biscuit"
    ]
  },
  5: {
    "day": 5,
    "date": "MERCREDI 21 OCTOBRE 2026",
    "title": "Le Crayon Magique",
    "adultPreparation": "Déposer un crayon de couleur rigolo ou un stylo 4 couleurs dans la boîte.",
    "message": "Un petit outil magique pour que tu puisses me faire des dessins pendant que je voyage !",
    "assets": [],
    "gifts": [
      "Crayon de couleur rigolo ou stylo 4 couleurs"
    ]
  },
  6: {
    "day": 6,
    "date": "JEUDI 22 OCTOBRE 2026",
    "title": "La Boussole du Lutin",
    "adultPreparation": "Une petite boussole jouet ou un dessin de boussole. À joindre : Boussole (annexes).",
    "message": "Ma boussole m’aide à m’orienter : son aiguille indique le nord. Pour rejoindre Lyon, je poursuis mon voyage vers le sud !",
    "assets": [
      {
        "file": "/assets/printables/annexe-83.png",
        "label": "Boussole du voyageur",
        "page": 83
      }
    ],
    "gifts": [
      "Petite boussole jouet (optionnelle)"
    ]
  },
  7: {
    "day": 7,
    "date": "VENDREDI 23 OCTOBRE 2026",
    "title": "Traversée des Montagnes",
    "adultPreparation": "Déposer la photo dans la boîte. À joindre : Carte B : montagnes (annexes).",
    "message": "J'escalade des montagnes géantes ! Mes petites jambes de lutin sont fatiguées, mais je pense à toi et ça me donne du courage.",
    "assets": [
      {
        "file": "/assets/printables/annexe-75.png",
        "label": "Carte des montagnes enneigées",
        "page": 75
      }
    ],
    "gifts": []
  },
  8: {
    "day": 8,
    "date": "SAMEDI 24 OCTOBRE 2026",
    "title": "La Pause Chocolat Chaud",
    "adultPreparation": "Un sachet de chocolat en poudre et quelques mini-marshmallows dans un petit sac congélation.",
    "message": "Réchauffons-nous ensemble ! Demande à maman ou papa de te faire un chocolat chaud avec ces marshmallows. Moi, j'en ai bu un grand bol !",
    "assets": [],
    "gifts": [
      "Chocolat en poudre",
      "Mini-marshmallows"
    ]
  },
  9: {
    "day": 9,
    "date": "DIMANCHE 25 OCTOBRE 2026",
    "title": "Le Bateau des Glaces",
    "adultPreparation": "Fabriquer un petit bateau en papier plié et le glisser dans la boîte. À joindre : Bateau en papier (annexes).",
    "message": "J'ai dû prendre un bateau pour traverser l'océan d'eau glacée. Tu peux faire voguer ce bateau dans ton bain ce soir !",
    "assets": [
      {
        "file": "/assets/printables/annexe-84.png",
        "label": "Bateau en papier",
        "page": 84
      }
    ],
    "gifts": []
  },
  10: {
    "day": 10,
    "date": "LUNDI 26 OCTOBRE 2026",
    "title": "L'Étoile du Soir",
    "adultPreparation": "Déposer une étoile lumineuse dans la boîte. À joindre : Étoiles (annexes).",
    "message": "Quand la nuit tombe, je regarde les étoiles pour trouver mon chemin. Colle cette étoile près de ton lit !",
    "assets": [
      {
        "file": "/assets/printables/annexe-85.png",
        "label": "Étoiles et clé magique",
        "page": 85
      }
    ],
    "gifts": [
      "Étoile lumineuse"
    ]
  },
  11: {
    "day": 11,
    "date": "MARDI 27 OCTOBRE 2026",
    "title": "La Tempête de Neige",
    "adultPreparation": "Enveloppe contenant du coton effiloché.",
    "message": "Ouh la la ! Une grosse tempête de neige m'a ralenti aujourd'hui ! Je me suis caché sous un sapin.",
    "assets": [],
    "gifts": []
  },
  12: {
    "day": 12,
    "date": "MERCREDI 28 OCTOBRE 2026",
    "title": "L'Escale chez les Monstres Gentils",
    "adultPreparation": "Une carte imprimée avec un petit monstre rigolo et coloré. À joindre : Carte C : monstres gentils (annexes).",
    "message": "Je suis arrivé dans une forêt magique où la fête d'Halloween se prépare. J'ai rencontré des monstres très gentils qui adorent les bonbons !",
    "assets": [
      {
        "file": "/assets/printables/annexe-76.png",
        "label": "Carte des monstres gentils",
        "page": 76
      }
    ],
    "gifts": []
  },
  13: {
    "day": 13,
    "date": "JEUDI 29 OCTOBRE 2026",
    "title": "La Rencontre du Lutin de Nîmes !",
    "adultPreparation": "Image imprimée montrant deux lutins avec des panneaux \"Nîmes\" et \"Lyon\". À joindre : Carte D : rencontre (annexes).",
    "message": "Incroyable Louis ! J'ai croisé un autre lutin du Père Noël ! Il m'a dit qu'il filait vers Nîmes pour aller chez Papi et Mamie Coco ! On a mangé un bout de pain d'épices ensemble. Lui prend le chemin de Nîmes, et moi je continue vers Lyon !",
    "assets": [
      {
        "file": "/assets/printables/annexe-77.png",
        "label": "Carte de la rencontre des deux chemins",
        "page": 77
      }
    ],
    "gifts": [
      "Pain d’épices"
    ]
  },
  14: {
    "day": 14,
    "date": "VENDREDI 30 OCTOBRE 2026",
    "title": "L'Emporte-Pièce Citrouille",
    "adultPreparation": "Un emporte-pièce en forme de citrouille ou de fantôme.",
    "message": "Un petit cadeau de la part du lutin de Nîmes et de moi ! Préparez des gâteaux rigolos pour ce week-end !",
    "assets": [],
    "gifts": [
      "Emporte-pièce citrouille ou fantôme"
    ]
  },
  15: {
    "day": 15,
    "date": "SAMEDI 31 OCTOBRE 2026",
    "title": "La Distribution de Bonbons",
    "adultPreparation": "Déposer 2 ou 3 bonbons d'Halloween dans la boîte.",
    "message": "Joyeux Halloween Louis ! Je quitte la forêt des monstres et j'entre en France !",
    "assets": [],
    "gifts": [
      "2 ou 3 bonbons d’Halloween"
    ]
  },
  16: {
    "day": 16,
    "date": "DIMANCHE 1 NOVEMBRE 2026",
    "title": "Arrivée en France",
    "adultPreparation": "Photo imprimée d'une carte de France avec un tracé. À joindre : Parcours imaginaire (annexes).",
    "message": "Ça y est, je suis en France ! C'est un très beau pays. Plus que quelques étapes avant d'arriver à Lyon !",
    "assets": [
      {
        "file": "/assets/printables/annexe-86.png",
        "label": "Parcours imaginaire",
        "page": 86
      }
    ],
    "gifts": []
  },
  17: {
    "day": 17,
    "date": "LUNDI 2 NOVEMBRE 2026",
    "title": "Carte Postale de Paris",
    "adultPreparation": "Glisser la carte postale dans la boîte. À joindre : Carte E : Paris (annexes).",
    "message": "Coucou ! Je me suis arrêté à Paris. J'ai vu une immense tour en fer qui monte jusqu'au ciel ! Mais Lyon est encore un peu plus loin au sud.",
    "assets": [],
    "gifts": []
  },
  18: {
    "day": 18,
    "date": "MARDI 3 NOVEMBRE 2026",
    "title": "Le Ticket de Train Express",
    "adultPreparation": "Déposer un faux billet de train nominatif pour le lutin. À joindre : Billet de train (annexes).",
    "message": "Pour aller plus vite, j'ai décidé de prendre le train TGV ! Regarde mon billet, destination : Lyon Part-Dieu !",
    "assets": [
      {
        "file": "/assets/printables/annexe-87.png",
        "label": "Billet du train des lutins",
        "page": 87
      }
    ],
    "gifts": []
  },
  19: {
    "day": 19,
    "date": "MERCREDI 4 NOVEMBRE 2026",
    "title": "Le Wagon des Gourmandises",
    "adultPreparation": "Un paquet de biscuits format individuel dans la boîte.",
    "message": "Dans le train, le contrôleur m'a donné un gâteau. Je t'en ai gardé un pour ton goûter !",
    "assets": [],
    "gifts": [
      "Biscuit individuel"
    ]
  },
  20: {
    "day": 20,
    "date": "JEUDI 5 NOVEMBRE 2026",
    "title": "Arrivée en Gare de Lyon",
    "adultPreparation": "Image de train arrivant en gare. À joindre : Carte F : gare (annexes).",
    "message": "Tchou tchou ! Le train s'arrête ! Le haut-parleur a dit 'Terminus, Lyon !'. Je suis enfin dans ta ville Louis !",
    "assets": [
      {
        "file": "/assets/printables/annexe-79.png",
        "label": "Carte de la gare de Lyon",
        "page": 79
      }
    ],
    "gifts": []
  },
  21: {
    "day": 21,
    "date": "VENDREDI 6 NOVEMBRE 2026",
    "title": "Carte Postale de Fourvière",
    "adultPreparation": "Carte postale lyonnaise déposée dans la boîte. À joindre : Carte G : Lyon (annexes).",
    "message": "Lyon est magnifique ! Je suis monté sur la grande colline pour voir la basilique et chercher le toit de ta maison !",
    "assets": [
      {
        "file": "/assets/printables/annexe-80.png",
        "label": "Carte postale de Lyon",
        "page": 80
      }
    ],
    "gifts": []
  },
  22: {
    "day": 22,
    "date": "SAMEDI 7 NOVEMBRE 2026",
    "title": "La Traversée du Rhône",
    "adultPreparation": "Un petit mot sur du papier bleu.",
    "message": "J'ai dû traverser un grand pont au-dessus du fleuve. L'eau coulait très vite, j'ai bien serré mon bonnet !",
    "assets": [],
    "gifts": []
  },
  23: {
    "day": 23,
    "date": "DIMANCHE 8 NOVEMBRE 2026",
    "title": "Le Plan de la Ville",
    "adultPreparation": "Un dessin simplifié d'une carte avec une flèche rouge vers votre quartier. À joindre : Plan à personnaliser (annexes).",
    "message": "J'ai demandé mon chemin à un pigeon lyonnais ! Il m'a dessiné cette carte pour trouver ton quartier.",
    "assets": [
      {
        "file": "/assets/printables/annexe-88.png",
        "label": "Plan du quartier",
        "page": 88
      }
    ],
    "gifts": []
  },
  24: {
    "day": 24,
    "date": "LUNDI 9 NOVEMBRE 2026",
    "title": "Recherche du Nom de la Rue",
    "adultPreparation": "Petit mot plié.",
    "message": "Je suis entré dans ta rue ! Je lis les plaques avec le nom des rues. Je me rapproche de minute en minute !",
    "assets": [],
    "gifts": []
  },
  25: {
    "day": 25,
    "date": "MARDI 10 NOVEMBRE 2026",
    "title": "La Pause devant l'Immeuble/Maison",
    "adultPreparation": "Prendre une photo rapide du portail ou de l'entrée de chez vous et l'imprimer. À joindre : Cadre photo (annexes).",
    "message": "Regarde Louis ! Est-ce que ce n'est pas le portail de ta maison ça ? Je suis juste derrière !",
    "assets": [
      {
        "file": "/assets/printables/annexe-89.png",
        "label": "Cadre photo de l’entrée",
        "page": 89
      }
    ],
    "gifts": []
  },
  26: {
    "day": 26,
    "date": "MERCREDI 11 NOVEMBRE 2026",
    "title": "L'Inspection du Paillasson",
    "adultPreparation": "Déposer une mini-plume ou un brin de paille sur le paillasson devant la porte.",
    "message": "Je me suis reposé cette nuit sur ton paillasson. C'était très confortable !",
    "assets": [],
    "gifts": []
  },
  27: {
    "day": 27,
    "date": "JEUDI 12 NOVEMBRE 2026",
    "title": "La Clé Magique",
    "adultPreparation": "Une vieille clé ou une clé en plastique décorée déposée dans la boîte. À joindre : Clé magique (annexes).",
    "message": "C'est la clé magique des lutins. Elle permet de passer sous les portes sans faire de bruit !",
    "assets": [
      {
        "file": "/assets/printables/annexe-85.png",
        "label": "Étoiles et clé magique",
        "page": 85
      }
    ],
    "gifts": []
  },
  28: {
    "day": 28,
    "date": "VENDREDI 13 NOVEMBRE 2026",
    "title": "Les Traces de Pas",
    "adultPreparation": "Faire 3 ou 4 petites empreintes de pas sur le pas de la porte avec un peu de farine ou de sucre glace. À joindre : Empreintes (annexes). Le mot ci-dessous est facultatif : le programme prévoit seulement les traces.",
    "message": "Chut… mes petites bottes sont passées par ici !",
    "assets": [
      {
        "file": "/assets/printables/annexe-90.png",
        "label": "Pochoir des petites bottes",
        "page": 90
      }
    ],
    "gifts": []
  },
  29: {
    "day": 29,
    "date": "SAMEDI 14 NOVEMBRE 2026",
    "title": "Le Mot Sous la Porte",
    "adultPreparation": "Glisser un papier sous la porte, visible depuis l'intérieur.",
    "message": "Chut... Je suis caché juste de l'autre côté de la porte ! Demain matin, ouvre bien tes yeux dans le salon...",
    "assets": [],
    "gifts": []
  },
  30: {
    "day": 30,
    "date": "DIMANCHE 15 NOVEMBRE 2026",
    "title": "L'ARRIVÉE DU LUTIN !",
    "adultPreparation": "Le lutin est assis au milieu du salon avec une boîte de biscuits et une pancarte.",
    "message": "COUCOU LOUIS ! C'est moi ! On fête mon arrivée avec des biscuits ?",
    "assets": [],
    "gifts": [
      "Biscuits"
    ]
  },
  31: {
    "day": 31,
    "date": "LUNDI 16 NOVEMBRE 2026",
    "title": "Le Lutin Momie",
    "adultPreparation": "Le lutin est enroulé dans du papier toilette sur le canapé.",
    "message": "Je voulais devenir une momie… mais je ressemble surtout à un rouleau de papier toilette !",
    "assets": [],
    "gifts": []
  },
  32: {
    "day": 32,
    "date": "MARDI 17 NOVEMBRE 2026",
    "title": "La Tyrolienne",
    "adultPreparation": "Tendez une ficelle courte entre deux points bas et stables, hors du passage. Fixez seulement le lutin.",
    "message": "Youhou Louis ! Je traverse le salon en tyrolienne. Quelle aventure !",
    "assets": [],
    "gifts": []
  },
  33: {
    "day": 33,
    "date": "MERCREDI 18 NOVEMBRE 2026",
    "title": "Le Lait Bleu",
    "adultPreparation": "Colorez une petite portion de lait dans un verre, avec un colorant alimentaire adapté ; gardez le reste au frais.",
    "message": "Oups ! Une goutte de magie bleue est tombée dans mon lait !",
    "assets": [],
    "gifts": [
      "Colorant alimentaire adapté"
    ]
  },
  34: {
    "day": 34,
    "date": "JEUDI 19 NOVEMBRE 2026",
    "title": "Scotché au Placard",
    "adultPreparation": "Le lutin est plaqué contre la porte d'un placard de cuisine avec plusieurs bandes de ruban adhésif coloré (masking tape).",
    "message": "Au secours Louis ! Le ruban m’a attrapé pendant mon exploration du placard !",
    "assets": [],
    "gifts": []
  },
  35: {
    "day": 35,
    "date": "VENDREDI 20 NOVEMBRE 2026",
    "title": "Les Yeux Rigolos sur les Fruits",
    "adultPreparation": "Utilisez les yeux papier fournis ; retirez-les avant de laver et manger les fruits. À joindre : Yeux à découper (annexes).",
    "message": "Bonjour Louis ! Aujourd’hui, même les fruits ont les yeux grands ouverts !",
    "assets": [
      {
        "file": "/assets/printables/annexe-91.png",
        "label": "Yeux à découper",
        "page": 91
      }
    ],
    "gifts": []
  },
  36: {
    "day": 36,
    "date": "SAMEDI 21 NOVEMBRE 2026",
    "title": "Le Dodo dans la Boîte à Mouchoirs",
    "adultPreparation": "Le lutin dort à l'intérieur d'une boîte de mouchoirs, avec un mouchoir plié en guise de couette.",
    "message": "Chut… Cette boîte est juste à ma taille. Bonne sieste, petit lutin !",
    "assets": [],
    "gifts": []
  },
  37: {
    "day": 37,
    "date": "DIMANCHE 22 NOVEMBRE 2026",
    "title": "L'Échange de Lit des Doudous",
    "adultPreparation": "Le lutin dort dans le lit des doudous de Louis, et tous les doudous de Louis sont installés dans le lit du lutin (ou sur la chaise de Louis).",
    "message": "Cette nuit, les doudous et moi avons échangé nos lits. Tu nous as retrouvés ?",
    "assets": [],
    "gifts": []
  },
  38: {
    "day": 38,
    "date": "LUNDI 23 NOVEMBRE 2026",
    "title": "La Glissade en Luge",
    "adultPreparation": "Le lutin est assis sur un petit torchon ou un débarbouillette en haut du dossier du canapé, prêt à glisser.",
    "message": "Prêt pour la glissade ? Mon torchon est devenu une luge !",
    "assets": [],
    "gifts": []
  },
  39: {
    "day": 39,
    "date": "MARDI 24 NOVEMBRE 2026",
    "title": "Piégé dans le Bocal de Gâteaux",
    "adultPreparation": "Utilisez un bocal vide et propre ; gardez les biscuits séparément.",
    "message": "Je cherchais un biscuit… et maintenant, je cherche la sortie !",
    "assets": [],
    "gifts": []
  },
  40: {
    "day": 40,
    "date": "MERCREDI 25 NOVEMBRE 2026",
    "title": "La Cape de Super-Héros",
    "adultPreparation": "Attacher un serviette en papier rouge dans le dos du lutin comme une cape et le placer debout sur la table. À joindre : Écusson Super-Lutin (annexes).",
    "message": "Super-Lutin est prêt ! Ma mission du jour : te faire sourire !",
    "assets": [
      {
        "file": "/assets/printables/annexe-91.png",
        "label": "Écusson Super-Lutin",
        "page": 91
      }
    ],
    "gifts": []
  },
  41: {
    "day": 41,
    "date": "JEUDI 26 NOVEMBRE 2026",
    "title": "La Pêche dans le Lavabo",
    "adultPreparation": "Remplir un peu le lavabo (ou une bassine) avec des poissons en plastique. Le lutin tient une paille comme canne à pêche. À joindre : Poissons (annexes).",
    "message": "Silence, ça mord ! Tu crois que les poissons aiment les biscuits ?",
    "assets": [
      {
        "file": "/assets/printables/annexe-91.png",
        "label": "Poissons à découper",
        "page": 91
      }
    ],
    "gifts": []
  },
  42: {
    "day": 42,
    "date": "VENDREDI 27 NOVEMBRE 2026",
    "title": "L'Heure de la Lecture",
    "adultPreparation": "Le lutin est assis avec un livre pour enfants ouvert devant lui, entouré de 3 ou 4 peluches qui \"l'écoutent\".",
    "message": "Installe-toi avec nous, Louis. Quelle histoire veux-tu lire aujourd’hui ?",
    "assets": [],
    "gifts": []
  },
  43: {
    "day": 43,
    "date": "SAMEDI 28 NOVEMBRE 2026",
    "title": "Les Moustaches sur le Miroir",
    "adultPreparation": "Testez un feutre adapté sur un coin du miroir ; essuyez ensuite.",
    "message": "Regarde dans le miroir… Une moustache magique t’attend !",
    "assets": [],
    "gifts": []
  },
  44: {
    "day": 44,
    "date": "DIMANCHE 29 NOVEMBRE 2026",
    "title": "La Tour de Chaussures",
    "adultPreparation": "Faites une petite tour stable de trois chaussures, au sol.",
    "message": "J’ai construit une montagne de chaussures ! Tu retrouves les tiennes ?",
    "assets": [],
    "gifts": []
  },
  45: {
    "day": 45,
    "date": "LUNDI 30 NOVEMBRE 2026",
    "title": "L'Annonce du Père Noël",
    "adultPreparation": "Le lutin tient une lettre dans ses mains.",
    "message": "Louis ! Le Père Noël m'a envoyé un message : mon meilleur ami lutin s'est échappé à son tour du Pôle Nord ! Il arrive demain pour me rejoindre ici à Lyon !",
    "assets": [],
    "gifts": []
  },
  46: {
    "day": 46,
    "date": "MARDI 1 DÉCEMBRE 2026",
    "title": "L'ARRIVÉE DU 2ÈME LUTIN !",
    "adultPreparation": "Le 1er lutin et le 2ème lutin sont côte à côte au milieu de confettis ou cotillons avec une banderole *\"BIENVENUE !\"*. À joindre : Banderole (annexes).",
    "message": "Bienvenue à mon copain ! À deux, nous avons deux fois plus d’idées rigolotes !",
    "assets": [
      {
        "file": "/assets/printables/annexe-92.png",
        "label": "Banderole de bienvenue",
        "page": 92
      }
    ],
    "gifts": []
  },
  47: {
    "day": 47,
    "date": "MERCREDI 2 DÉCEMBRE 2026",
    "title": "La Bataille de Boules de Neige",
    "adultPreparation": "Utilisez des boules de papier si le coton ne convient pas.",
    "message": "Bataille de neige au salon ! Qui se cache derrière le mur ?",
    "assets": [],
    "gifts": []
  },
  48: {
    "day": 48,
    "date": "JEUDI 3 DÉCEMBRE 2026",
    "title": "Coincés dans les Céréales",
    "adultPreparation": "Prenez une boîte vide et gardez les céréales propres à part.",
    "message": "Nous cherchions le petit-déjeuner… et nous sommes tombés dans les céréales !",
    "assets": [],
    "gifts": [
      "Céréales"
    ]
  },
  49: {
    "day": 49,
    "date": "VENDREDI 4 DÉCEMBRE 2026",
    "title": "La Soirée Pop-corn & Cinéma",
    "adultPreparation": "Utilisez une collation adaptée à l’âge de Louis ; des boules de papier peuvent représenter le pop-corn. À joindre : Tickets de cinéma (annexes).",
    "message": "Ce soir, séance de cinéma ! Louis, tu choisis le dessin animé ?",
    "assets": [
      {
        "file": "/assets/printables/annexe-93.png",
        "label": "Tickets de cinéma",
        "page": 93
      }
    ],
    "gifts": [
      "Collation adaptée à l’âge de Louis"
    ]
  },
  50: {
    "day": 50,
    "date": "SAMEDI 5 DÉCEMBRE 2026",
    "title": "Les Chaussures Emballées",
    "adultPreparation": "Les deux lutins ont enveloppé les chaussures de Louis dans du papier alu ou du papier cadeau.",
    "message": "Surprise ! Tes chaussures se prennent pour des cadeaux !",
    "assets": [],
    "gifts": []
  },
  51: {
    "day": 51,
    "date": "DIMANCHE 6 DÉCEMBRE 2026",
    "title": "Les Pièces en Chocolat",
    "adultPreparation": "Placez les chocolats emballés dans un petit sachet propre posé dans la chaussure.",
    "message": "Bonne Saint-Nicolas, Louis ! Une petite gourmandise se cache dans tes chaussures.",
    "assets": [],
    "gifts": [
      "Chocolats emballés"
    ]
  },
  52: {
    "day": 52,
    "date": "LUNDI 7 DÉCEMBRE 2026",
    "title": "Préparation de la Fête des Lumières (Lyon)",
    "adultPreparation": "Installez des pots stables et des bougies LED uniquement, en retrait du bord.",
    "message": "Demain, c’est le 8 décembre ! Préparons des lumignons pour faire briller notre fenêtre à Lyon.",
    "assets": [],
    "gifts": []
  },
  53: {
    "day": 53,
    "date": "MARDI 8 DÉCEMBRE 2026",
    "title": "La Chaise Ligotée",
    "adultPreparation": "Enroulez quelques bandes de papier autour du dossier ; retirez-les avant utilisation.",
    "message": "Nous voulions décorer la chaise… Nous nous sommes un peu emmêlés !",
    "assets": [],
    "gifts": []
  },
  54: {
    "day": 54,
    "date": "MERCREDI 9 DÉCEMBRE 2026",
    "title": "La Course d'Autos",
    "adultPreparation": "Les deux lutins sont installés chacun dans une voiture en plastique de Louis, alignés sur une ligne de départ tracée au ruban adhésif. À joindre : Départ et arrivée (annexes).",
    "message": "À vos marques… prêts… partez ! La course des lutins commence !",
    "assets": [
      {
        "file": "/assets/printables/annexe-93.png",
        "label": "Départ et arrivée",
        "page": 93
      }
    ],
    "gifts": []
  },
  55: {
    "day": 55,
    "date": "JEUDI 10 DÉCEMBRE 2026",
    "title": "Les Lutins Fantômes",
    "adultPreparation": "Posez des mouchoirs avec les yeux dessinés sur les lutins : inutile de découper des chaussettes.",
    "message": "Bouh ! Ce sont deux petits fantômes gentils qui te disent bonjour !",
    "assets": [],
    "gifts": []
  },
  56: {
    "day": 56,
    "date": "VENDREDI 11 DÉCEMBRE 2026",
    "title": "L'Empreinte de Peinture",
    "adultPreparation": "Faites les empreintes sur la feuille avec un tampon ou vos doigts ; gardez les peluches propres.",
    "message": "Deux petites mains de lutins ont laissé leurs couleurs. À toi de créer un dessin !",
    "assets": [],
    "gifts": []
  },
  57: {
    "day": 57,
    "date": "SAMEDI 12 DÉCEMBRE 2026",
    "title": "Cachés dans le Sapin",
    "adultPreparation": "Placez les lutins dans des branches basses et solides, loin des câbles.",
    "message": "Coucou Louis ! Deux bonnets se cachent dans le sapin. À toi de les trouver !",
    "assets": [],
    "gifts": []
  },
  58: {
    "day": 58,
    "date": "DIMANCHE 13 DÉCEMBRE 2026",
    "title": "La Cabane de Coussins",
    "adultPreparation": "Monter une petite cabane avec les coussins du canapé. Les deux lutins sont cachés à l'intérieur avec une petite lampe torche.",
    "message": "Bienvenue dans notre cabane ! Il reste une place pour ton imagination.",
    "assets": [],
    "gifts": []
  },
  59: {
    "day": 59,
    "date": "LUNDI 14 DÉCEMBRE 2026",
    "title": "Le Portrait des Lutins",
    "adultPreparation": "Affichez une photo sur un appareil verrouillé en mode photo, ou utilisez le portrait imprimé. À joindre : Portrait souvenir (annexes).",
    "message": "Cheeeese ! Nous avons fait notre portrait le plus rigolo !",
    "assets": [
      {
        "file": "/assets/printables/annexe-94.png",
        "label": "Portrait souvenir des lutins",
        "page": 94
      }
    ],
    "gifts": []
  },
  60: {
    "day": 60,
    "date": "MARDI 15 DÉCEMBRE 2026",
    "title": "Le Départ du 2ème Lutin",
    "adultPreparation": "Le 2ème lutin a disparu. Le 1er lutin tient une lettre d'adieu.",
    "message": "Mon cher Louis, C’était fantastique de venir faire des farces à Lyon avec mon copain ! Le Père Noël a besoin de moi à l’atelier pour emballer les derniers jouets. Je suis reparti cette nuit au Pôle Nord. Mon copain reste avec toi jusqu’au grand soir ! À bientôt !",
    "assets": [],
    "gifts": []
  },
  61: {
    "day": 61,
    "date": "MERCREDI 16 DÉCEMBRE 2026",
    "title": "La Nostalgie du Copain",
    "adultPreparation": "Le lutin est assis en train de regarder une photo ou un dessin du 2ème lutin. À joindre : Portrait souvenir (annexes).",
    "message": "Mon copain me manque un peu. Heureusement, il me reste plein de beaux souvenirs avec toi.",
    "assets": [
      {
        "file": "/assets/printables/annexe-94.png",
        "label": "Portrait souvenir des lutins",
        "page": 94
      }
    ],
    "gifts": []
  },
  62: {
    "day": 62,
    "date": "JEUDI 17 DÉCEMBRE 2026",
    "title": "La Vérification de la Liste",
    "adultPreparation": "Déroulez la liste de petits bonheurs fournie. Invitez Louis à choisir une activité. À joindre : Liste de petits bonheurs (annexes).",
    "message": "Louis, voici ta liste des petits bonheurs : partager, aider, rire et faire un câlin si tu en as envie !",
    "assets": [
      {
        "file": "/assets/printables/annexe-95.png",
        "label": "Liste des petits bonheurs",
        "page": 95
      }
    ],
    "gifts": []
  },
  63: {
    "day": 63,
    "date": "VENDREDI 18 DÉCEMBRE 2026",
    "title": "La Patinoire en Farine",
    "adultPreparation": "Utilisez un plateau de semoule ou une feuille blanche décorée ; les patins peuvent être en carton.",
    "message": "La table est devenue une patinoire ! Regarde mes tout petits patins.",
    "assets": [],
    "gifts": []
  },
  64: {
    "day": 64,
    "date": "SAMEDI 19 DÉCEMBRE 2026",
    "title": "L'Écoute des Chants de Noël",
    "adultPreparation": "Le lutin porte de petits écouteurs (ou du coton sur les oreilles) posé à côté de la radio ou d'une enceinte.",
    "message": "J’écoute les chansons de Noël. On chante ensemble ?",
    "assets": [],
    "gifts": []
  },
  65: {
    "day": 65,
    "date": "DIMANCHE 20 DÉCEMBRE 2026",
    "title": "Le Doudou Emballé",
    "adultPreparation": "Emballez le doudou de façon facile à ouvrir et laissez-le disponible dès le réveil.",
    "message": "Ton doudou s’est déguisé en cadeau ! Tu peux vite le déballer pour lui faire un câlin.",
    "assets": [],
    "gifts": []
  },
  66: {
    "day": 66,
    "date": "LUNDI 21 DÉCEMBRE 2026",
    "title": "La Recette des Biscuits du Père Noël",
    "adultPreparation": "Le lutin pose une carte recette simple pour préparer les sablés de Noël avec maman/papa. À joindre : Recette des sablés (annexes).",
    "message": "Aujourd’hui, on prépare des sablés pour le Père Noël. À vos tabliers !",
    "assets": [
      {
        "file": "/assets/printables/annexe-96.png",
        "label": "Recette des sablés",
        "page": 96
      }
    ],
    "gifts": [
      "Ingrédients des sablés"
    ]
  },
  67: {
    "day": 67,
    "date": "MARDI 22 DÉCEMBRE 2026",
    "title": "Caché dans la Chaussette de Noël",
    "adultPreparation": "Le lutin dépasse de la grande chaussette de Noël suspendue au mur ou au sapin.",
    "message": "Je suis bien au chaud… Cherche un petit bonnet dans la chaussette de Noël !",
    "assets": [],
    "gifts": []
  },
  68: {
    "day": 68,
    "date": "MERCREDI 23 DÉCEMBRE 2026",
    "title": "L'Avis de Passage du Père Noël",
    "adultPreparation": "Le lutin tient une pancarte. À joindre : Plateau du Père Noël (annexes).",
    "message": "Demain c'est le Réveillon ! N'oublie pas de préparer un verre de lait et un biscuit sous le sapin !",
    "assets": [
      {
        "file": "/assets/printables/annexe-97.png",
        "label": "Plateau du Père Noël",
        "page": 97
      }
    ],
    "gifts": [
      "Lait et biscuit pour le Père Noël"
    ]
  },
  69: {
    "day": 69,
    "date": "JEUDI 24 DÉCEMBRE 2026",
    "title": "Le Repos sous le Sapin",
    "adultPreparation": "Le lutin est allongé sous le sapin, son petit sac de voyage fait à côté de lui, prêt à remonter dans le traîneau.",
    "message": "Ce soir, je rentre au Pôle Nord avec le Père Noël. Merci pour toutes nos aventures, Louis. Je garde tes sourires dans mon sac !",
    "assets": [],
    "gifts": []
  },
  70: {
    "day": 70,
    "date": "VENDREDI 25 DÉCEMBRE 2026",
    "title": "LA LETTRE FINALE DU PÈRE NOËL",
    "adultPreparation": "Le lutin a disparu ! À sa place, les cadeaux de Noël et une grande lettre posée sur le verre de lait vide.",
    "message": "Mon très cher Louis, Merci d’avoir si bien accueilli mes deux lutins ! Ton compagnon est remonté dans mon traîneau cette nuit pour rentrer au Pôle Nord avec moi. Il m’a raconté vos aventures à Lyon, vos fous rires et tes belles idées. Je te souhaite une merveilleuse journée de Noël, pleine de douceur et de moments partagés. Nous gardons de beaux souvenirs de toi dans notre atelier. Joyeux Noël Louis ! Le Père Noël",
    "assets": [],
    "gifts": [
      "Cadeaux de Noël"
    ]
  },
}

export const dailySheetsByActivityId: Record<string, DailySheet> = Object.fromEntries(
  Object.values(dailySheets).map((sheet) => ['jour-' + sheet.day, sheet]),
) as Record<string, DailySheet>

dailySheetsByActivityId['jour-1-alerte-pole-nord'] = dailySheets[1]
dailySheetsByActivityId['jour-2-preparation-sac'] = dailySheets[2]
dailySheetsByActivityId['jour-3-depart-traineau'] = dailySheets[3]
dailySheetsByActivityId['jour-4-pause-gouter'] = dailySheets[4]
