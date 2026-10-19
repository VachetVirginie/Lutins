export interface KitAsset {
  file: string
  label: string
  page: number
}

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
    day: 1,
    date: 'SAMEDI 17 OCTOBRE 2026',
    title: "L'Alerte du Pôle Nord",
    adultPreparation:
      'Glisser la lettre dans la boîte aux lettres (dans une belle enveloppe rouge ou kraft, scellée d’un tampon ou d’un dessin de flocon).',
    message:
      'Ho Ho Ho ! Bonjour mon cher Louis,\n\nJe t’écris cette lettre en urgence depuis le Pôle Nord. Ce matin, en faisant l’appel dans l’atelier de jouets, un de mes lutins manquait à l’appel ! Après vérification, il a laissé un petit mot : il paraît qu’il a entendu dire que tu étais un petit garçon très courageux et rigolo à Lyon, et il a décidé de s’échapper pour venir te rencontrer ! Il est très gourmand et un brin farceur. Il s’est mis en route aujourd’hui même.\n\nGarde bien l’œil ouvert sur la boîte aux lettres, il risque de t’envoyer des nouvelles de son voyage... et prépare-toi à l’accueillir bientôt chez toi !\n\nAvec toute mon affection,\nLe Père Noël',
    assets: [],
    gifts: [],
  },
  2: {
    day: 2,
    date: 'DIMANCHE 18 OCTOBRE 2026',
    title: 'La Préparation du Sac',
    adultPreparation:
      'Glisser dans la boîte aux lettres l’illustration imprimée du sac de voyage. À joindre : Carte A (sac à dos).',
    message:
      "Coucou Louis ! C'est moi, le lutin ! Le Père Noël t'a écrit ? Je prépare mon sac avec un bon morceau de pain d'épices pour le grand voyage vers Lyon !",
    assets: [],
    gifts: ['Pain d’épices'],
  },
  3: {
    day: 3,
    date: 'LUNDI 19 OCTOBRE 2026',
    title: 'Le Départ en Traîneau',
    adultPreparation:
      'Déposer la carte des paysages enneigés ainsi que le coloriage du lutin. À joindre : Carte H (Pôle Nord) + Coloriage.',
    message:
      "Je monte à bord du traîneau d'entraînement ! Prochaine étape : la traversée de la banquise. Je t'ai glissé un coloriage de moi pour que tu puisses décorer ta chambre !",
    assets: [],
    gifts: [],
  },
  4: {
    day: 4,
    date: 'MARDI 20 OCTOBRE 2026',
    title: 'La Première Pause goûter',
    adultPreparation:
      'Glisser un petit mot soigneusement plié dans la boîte aux lettres.',
    message:
      "Brrr, il fait très froid sur la banquise ! J'ai dû m'arrêter un instant pour déguster un délicieux biscuit. Et toi, tu as pris un bon goûter aujourd'hui ?",
    assets: [],
    gifts: ['Biscuit'],
  },
  5: {
    day: 5,
    date: 'MERCREDI 21 OCTOBRE 2026',
    title: 'Le Crayon Magique',
    adultPreparation:
      'Déposer un crayon de couleur rigolo ou un stylo 4 couleurs magique dans la boîte.',
    message:
      'Voici un outil magique pour que tu puisses me dessiner de beaux chefs-d’œuvre pendant que je voyage !',
    assets: [],
    gifts: ['Crayon de couleur rigolo ou stylo 4 couleurs'],
  },
  6: {
    day: 6,
    date: 'JEUDI 22 OCTOBRE 2026',
    title: 'La Boussole du Lutin',
    adultPreparation:
      'Déposer une petite boussole jouet ou l’illustration de boussole. À joindre : Carte Boussole.',
    message:
      'Ma boussole m’aide à m’orienter : son aiguille indique le nord. Pour rejoindre Lyon, je poursuis mon voyage tout droit vers le sud !',
    assets: [],
    gifts: ['Petite boussole jouet (optionnelle)'],
  },
  7: {
    day: 7,
    date: 'VENDREDI 23 OCTOBRE 2026',
    title: 'Traversée des Montagnes',
    adultPreparation:
      'Déposer la carte des montagnes enneigées dans la boîte. À joindre : Carte B (montagnes).',
    message:
      'J’escalade de magnifiques montagnes géantes ! Mes petites jambes de lutin sont un peu fatiguées, mais penser à toi me donne tout le courage nécessaire.',
    assets: [],
    gifts: [],
  },
  8: {
    day: 8,
    date: 'SAMEDI 24 OCTOBRE 2026',
    title: 'La Pause Chocolat Chaud',
    adultPreparation:
      'Glisser un sachet de chocolat en poudre et quelques mini-marshmallows dans un petit sachet festif.',
    message:
      'Réchauffons-nous ensemble ! Demande à maman ou papa de te préparer un bon chocolat chaud avec ces marshmallows. Moi, j’en ai bu un grand bol fumant !',
    assets: [],
    gifts: ['Chocolat en poudre', 'Mini-marshmallows'],
  },
  9: {
    day: 9,
    date: 'DIMANCHE 25 OCTOBRE 2026',
    title: 'Le Bateau des Glaces',
    adultPreparation:
      'Fabriquer un petit bateau en papier plié et le glisser dans la boîte. À joindre : Bateau en papier.',
    message:
      "J'ai dû monter à bord d'un bateau pour traverser l'océan d'eau glacée. Tu peux faire voguer ce petit bateau dans ton bain ce soir !",
    assets: [],
    gifts: [],
  },
  10: {
    day: 10,
    date: 'LUNDI 26 OCTOBRE 2026',
    title: "L'Étoile du Soir",
    adultPreparation:
      'Déposer une petite étoile lumineuse ou phosphorescente dans la boîte. À joindre : Planche d’étoiles.',
    message:
      'Quand la nuit tombe, je contemple les étoiles pour retrouver mon chemin. Colle cette étoile au-dessus de ton lit pour qu’elle veille sur tes rêves !',
    assets: [],
    gifts: ['Étoile lumineuse'],
  },
  11: {
    day: 11,
    date: 'MARDI 27 OCTOBRE 2026',
    title: 'La Tempête de Neige',
    adultPreparation: 'Glisser dans l’enveloppe du coton effiloché comme un flocon de neige.',
    message:
      'Ouh la la ! Une grosse tempête de neige m’a ralenti aujourd’hui ! Je me suis réfugié sous un grand sapin bien à l’abri.',
    assets: [],
    gifts: [],
  },
  12: {
    day: 12,
    date: 'MERCREDI 28 OCTOBRE 2026',
    title: 'L’Escale chez les Monstres Gentils',
    adultPreparation:
      'Imprimer et déposer la carte du monstre rigolo. À joindre : Carte C (monstres gentils).',
    message:
      "Je suis arrivé dans une forêt enchantée où l'on prépare la fête d'Halloween. J'y ai rencontré des monstres très gentils qui adorent les bonbons !",
    assets: [],
    gifts: [],
  },
  13: {
    day: 13,
    date: 'JEUDI 29 OCTOBRE 2026',
    title: 'La Rencontre du Lutin de Nîmes !',
    adultPreparation:
      'Déposer l’image montrant les deux lutins avec leurs panneaux indicateurs. À joindre : Carte D (rencontre).',
    message:
      'Incroyable Louis ! J’ai croisé un autre lutin du Père Noël ! Il m’a confié qu’il filait vers Nîmes pour aller chez Papi et Mamie Coco ! On a partagé un morceau de pain d’épices. Lui prend le chemin du sud-ouest, et moi je poursuis droit vers Lyon !',
    assets: [],
    gifts: ['Pain d’épices'],
  },
  14: {
    day: 14,
    date: 'VENDREDI 30 OCTOBRE 2026',
    title: "L'Emporte-Pièce Citrouille",
    adultPreparation: 'Déposer un emporte-pièce en forme de citrouille ou de fantôme.',
    message:
      'Un petit cadeau surprise de la part du lutin de Nîmes et de moi-même ! Préparez de délicieux gâteaux rigolos pour ce week-end !',
    assets: [],
    gifts: ['Emporte-pièce citrouille ou fantôme'],
  },
  15: {
    day: 15,
    date: 'SAMEDI 31 OCTOBRE 2026',
    title: 'La Distribution de Bonbons',
    adultPreparation: "Déposer 2 ou 3 bonbons d'Halloween dans la boîte aux lettres.",
    message:
      'Joyeux Halloween Louis ! Je quitte la forêt des monstres et franchis enfin la frontière française !',
    assets: [],
    gifts: ['2 ou 3 bonbons d’Halloween'],
  },
  16: {
    day: 16,
    date: 'DIMANCHE 1 NOVEMBRE 2026',
    title: 'Arrivée en France',
    adultPreparation:
      'Déposer l’illustration de la carte de France avec le tracé du voyage. À joindre : Carte du parcours.',
    message:
      'Ça y est, me voilà en France ! C’est un pays merveilleux. Plus que quelques étapes importantes avant d’arriver à Lyon !',
    assets: [],
    gifts: [],
  },
  17: {
    day: 17,
    date: 'LUNDI 2 NOVEMBRE 2026',
    title: 'Carte Postale de Paris',
    adultPreparation: 'Glisser la carte postale parisienne dans la boîte aux lettres. À joindre : Carte E (Paris).',
    message:
      'Coucou ! Je me suis arrêté un instant à Paris. J’y ai admiré une immense tour en fer qui monte jusqu’aux nuages ! Mais Lyon m’attend un peu plus au sud.',
    assets: [],
    gifts: [],
  },
  18: {
    day: 18,
    date: 'MARDI 3 NOVEMBRE 2026',
    title: 'Le Ticket de Train Express',
    adultPreparation:
      'Déposer le faux billet de train personnalisé pour le lutin. À joindre : Billet de train.',
    message:
      'Pour aller encore plus vite, j’ai décidé de monter à bord du grand train TGV ! Regarde mon billet : destination Lyon Part-Dieu !',
    assets: [],
    gifts: [],
  },
  19: {
    day: 19,
    date: 'MERCREDI 4 NOVEMBRE 2026',
    title: 'Le Wagon des Gourmandises',
    adultPreparation: 'Glisser un sachet de biscuit individuel dans la boîte.',
    message:
      'Dans le train, le contrôleur m’a offert un délicieux gâteau. Je t’en ai gardé un tout spécialement pour ton goûter !',
    assets: [],
    gifts: ['Biscuit individuel'],
  },
  20: {
    day: 20,
    date: 'JEUDI 5 NOVEMBRE 2026',
    title: 'Arrivée en Gare de Lyon',
    adultPreparation:
      'Glisser la carte montrant le train arrivant en gare. À joindre : Carte F (gare).',
    message:
      'Tchou tchou ! Le train entre en gare ! Le haut-parleur vient d’annoncer : "Terminus, Lyon !". Je suis enfin arrivé dans ta ville Louis !',
    assets: [],
    gifts: [],
  },
  21: {
    day: 21,
    date: 'VENDREDI 6 NOVEMBRE 2026',
    title: 'Carte Postale de Fourvière',
    adultPreparation:
      'Glisser la carte postale lyonnaise dans la boîte. À joindre : Carte G (Fourvière).',
    message:
      'Lyon est une ville magnifique ! Je suis monté tout en haut de la grande colline pour voir la basilique et apercevoir le toit de ta maison !',
    assets: [],
    gifts: [],
  },
  22: {
    day: 22,
    date: 'SAMEDI 7 NOVEMBRE 2026',
    title: 'La Traversée du Rhône',
    adultPreparation: 'Glisser un petit mot écrit sur un papier bleu.',
    message:
      'J’ai traversé un grand pont au-dessus du fleuve. L’eau coulait très vite, j’ai bien serré mon bonnet pour qu’il ne s’envole pas !',
    assets: [],
    gifts: [],
  },
  23: {
    day: 23,
    date: 'DIMANCHE 8 NOVEMBRE 2026',
    title: 'Le Plan de la Ville',
    adultPreparation:
      'Déposer le dessin de carte avec une flèche rouge indiquant le quartier. À joindre : Plan à personnaliser.',
    message:
      'J’ai demandé mon chemin à un pigeon lyonnais très sympathique ! Il m’a dessiné ce plan pour trouver ton quartier.',
    assets: [],
    gifts: [],
  },
  24: {
    day: 24,
    date: 'LUNDI 9 NOVEMBRE 2026',
    title: 'Recherche du Nom de la Rue',
    adultPreparation: 'Glisser le petit mot plié dans la boîte.',
    message:
      'Je suis entré dans ta rue ! Je lis attentivement chaque plaque sur les murs. Je me rapproche de toi de minute en minute !',
    assets: [],
    gifts: [],
  },
  25: {
    day: 25,
    date: 'MARDI 10 NOVEMBRE 2026',
    title: 'La Pause devant l’Entrée',
    adultPreparation:
      'Imprimer une photo du portail ou de l’entrée de la maison. À joindre : Cadre photo imprimable.',
    message:
      'Regarde Louis ! Est-ce que ce n’est pas le portail de ta maison ça ? Je suis juste derrière !',
    assets: [],
    gifts: [],
  },
  26: {
    day: 26,
    date: 'MERCREDI 11 NOVEMBRE 2026',
    title: 'L’Inspection du Paillasson',
    adultPreparation: 'Déposer une mini-plume ou un brin de paille sur le paillasson de l’entrée.',
    message:
      'Je me suis reposé cette nuit sur ton paillasson. Il était drôlement confortable !',
    assets: [],
    gifts: [],
  },
  27: {
    day: 27,
    date: 'JEUDI 12 NOVEMBRE 2026',
    title: 'La Clé Magique',
    adultPreparation:
      'Déposer une clé décorée ou la clé imprimée dans la boîte. À joindre : Clé magique.',
    message:
      'Voici la clé magique des lutins. Elle nous permet de nous glisser sous les portes en toute discrétion !',
    assets: [],
    gifts: [],
  },
  28: {
    day: 28,
    date: 'VENDREDI 13 NOVEMBRE 2026',
    title: 'Les Traces de Pas',
    adultPreparation:
      'Réaliser 3 ou 4 petites empreintes de bottes sur le pas de la porte avec un peu de farine ou du pochoir fourni. À joindre : Pochoir des bottes.',
    message: 'Chut… mes petites bottes sont passées par ici !',
    assets: [],
    gifts: [],
  },
  29: {
    day: 29,
    date: 'SAMEDI 14 NOVEMBRE 2026',
    title: 'Le Mot Sous la Porte',
    adultPreparation: 'Glisser un petit mot sous la porte, visible depuis l’intérieur.',
    message:
      'Chut... Je suis caché juste de l’autre côté de la porte ! Demain matin, ouvre grand tes yeux dans le salon...',
    assets: [],
    gifts: [],
  },
  30: {
    day: 30,
    date: 'DIMANCHE 15 NOVEMBRE 2026',
    title: 'L’ARRIVÉE DU LUTIN !',
    adultPreparation:
      'Mettre en scène le lutin assis au milieu du salon avec une boîte de biscuits et sa pancarte de bienvenue.',
    message: 'COUCOU LOUIS ! C’est moi ! On fête mon arrivée avec des biscuits ?',
    assets: [],
    gifts: ['Biscuits'],
  },
  31: {
    day: 31,
    date: 'LUNDI 16 NOVEMBRE 2026',
    title: 'Le Lutin Momie',
    adultPreparation: 'Enrouler le lutin dans du papier toilette sur le canapé.',
    message:
      'Je voulais devenir une momie mystérieuse… mais je ressemble surtout à un gros rouleau de papier toilette !',
    assets: [],
    gifts: [],
  },
  32: {
    day: 32,
    date: 'MARDI 17 NOVEMBRE 2026',
    title: 'La Tyrolienne',
    adultPreparation:
      'Tendre une ficelle entre deux points bas et stables hors du passage, et y suspendre le lutin.',
    message: 'Youhou Louis ! Je traverse le salon en tyrolienne. Quelle aventure sensationnelle !',
    assets: [],
    gifts: [],
  },
  33: {
    day: 33,
    date: 'MERCREDI 18 NOVEMBRE 2026',
    title: 'Le Lait Bleu',
    adultPreparation:
      'Colorer une petite portion de lait avec du colorant alimentaire bleu dans un verre.',
    message: 'Oups ! Une goutte de magie bleue est tombée dans mon verre de lait !',
    assets: [],
    gifts: ['Colorant alimentaire adapté'],
  },
  34: {
    day: 34,
    date: 'JEUDI 19 NOVEMBRE 2026',
    title: 'Scotché au Placard',
    adultPreparation:
      'Plaquer le lutin contre la porte du placard de cuisine avec du ruban adhésif coloré (masking tape).',
    message:
      'Au secours Louis ! Le ruban magique m’a attrapé pendant mon exploration du placard !',
    assets: [],
    gifts: [],
  },
  35: {
    day: 35,
    date: 'VENDREDI 20 NOVEMBRE 2026',
    title: 'Les Yeux Rigolos sur les Fruits',
    adultPreparation:
      'Coller les yeux en papier fournis sur les fruits de la corbeille. À joindre : Yeux à découper.',
    message:
      'Bonjour Louis ! Aujourd’hui, même les fruits de la cuisine ont les yeux grands ouverts !',
    assets: [],
    gifts: [],
  },
  36: {
    day: 36,
    date: 'SAMEDI 21 NOVEMBRE 2026',
    title: 'Le Dodo dans la Boîte à Mouchoirs',
    adultPreparation:
      'Installer le lutin endormi à l’intérieur d’une boîte de mouchoirs, enveloppé dans un mouchoir plié.',
    message: 'Chut… Cette boîte est exactement à ma taille. Douce nuit, petit lutin !',
    assets: [],
    gifts: [],
  },
  37: {
    day: 37,
    date: 'DIMANCHE 22 NOVEMBRE 2026',
    title: 'L’Échange de Lit des Doudous',
    adultPreparation:
      'Placer le lutin dans le lit des doudous de Louis, et installer les doudous dans le lit du lutin.',
    message:
      'Cette nuit, les doudous et moi avons échangé nos lits ! Tu nous as retrouvés ?',
    assets: [],
    gifts: [],
  },
  38: {
    day: 38,
    date: 'LUNDI 23 NOVEMBRE 2026',
    title: 'La Glissade en Luge',
    adultPreparation:
      'Installer le lutin sur un petit torchon en haut du dossier du canapé, comme sur une luge.',
    message: 'Prêt pour la grande glissade ? Mon torchon s’est transformé en luge !',
    assets: [],
    gifts: [],
  },
  39: {
    day: 39,
    date: 'MARDI 24 NOVEMBRE 2026',
    title: 'Piégé dans le Bocal de Gâteaux',
    adultPreparation: 'Glisser le lutin à l’intérieur d’un bocal en verre vide et propre.',
    message:
      'Je cherchais un petit biscuit gourmand… et maintenant, je cherche la sortie !',
    assets: [],
    gifts: [],
  },
  40: {
    day: 40,
    date: 'MERCREDI 25 NOVEMBRE 2026',
    title: 'La Cape de Super-Héros',
    adultPreparation:
      'Attacher une serviette en papier rouge dans le dos du lutin et l’installer sur la table. À joindre : Écusson Super-Lutin.',
    message: 'Super-Lutin est prêt ! Ma mission prioritaire du jour : te faire sourire !',
    assets: [],
    gifts: [],
  },
  41: {
    day: 41,
    date: 'JEUDI 26 NOVEMBRE 2026',
    title: 'La Pêche dans le Lavabo',
    adultPreparation:
      'Placer des petits poissons dans le lavabo et installer le lutin tenant une paille comme canne à pêche. À joindre : Poissons découpés.',
    message: 'Silence, ça mord ! Tu penses que les poissons aiment le biscuit ?',
    assets: [],
    gifts: [],
  },
  42: {
    day: 42,
    date: 'VENDREDI 27 NOVEMBRE 2026',
    title: 'L’Heure de la Lecture',
    adultPreparation:
      'Placer le lutin devant un livre pour enfants ouvert, entouré de ses peluches attentives.',
    message:
      'Installe-toi confortablement avec nous, Louis. Quelle belle histoire veux-tu lire aujourd’hui ?',
    assets: [],
    gifts: [],
  },
  43: {
    day: 43,
    date: 'SAMEDI 28 NOVEMBRE 2026',
    title: 'Les Moustaches sur le Miroir',
    adultPreparation:
      'Dessiner une petite moustache au feutre effaçable sur le miroir à hauteur d’enfant.',
    message: 'Regarde bien dans le miroir… Une moustache magique t’attend !',
    assets: [],
    gifts: [],
  },
  44: {
    day: 44,
    date: 'DIMANCHE 29 NOVEMBRE 2026',
    title: 'La Tour de Chaussures',
    adultPreparation: 'Empiler de manière stable trois chaussures au sol.',
    message:
      'J’ai construit une immense montagne de chaussures ! Sauras-tu retrouver les tiennes ?',
    assets: [],
    gifts: [],
  },
  45: {
    day: 45,
    date: 'LUNDI 30 NOVEMBRE 2026',
    title: 'L’Annonce du Père Noël',
    adultPreparation: 'Placer une lettre entre les mains du lutin.',
    message:
      'Louis ! Le Père Noël m’a envoyé un message secret : mon meilleur ami lutin s’est échappé lui aussi du Pôle Nord ! Il arrive dès demain pour me rejoindre ici à Lyon !',
    assets: [],
    gifts: [],
  },
  46: {
    day: 46,
    date: 'MARDI 1 DÉCEMBRE 2026',
    title: 'L’ARRIVÉE DU 2ÈME LUTIN !',
    adultPreparation:
      'Installer les 2 lutins côte à côte entourés de confettis avec la banderole de bienvenue. À joindre : Banderole.',
    message:
      'Bienvenue à mon super copain ! À deux, nous aurons deux fois plus d’idées rigolotes à partager !',
    assets: [],
    gifts: [],
  },
  47: {
    day: 47,
    date: 'MERCREDI 2 DÉCEMBRE 2026',
    title: 'La Bataille de Boules de Neige',
    adultPreparation:
      'Disposer des petites boules de coton ou de papier froissé entre les deux lutins.',
    message: 'Grande bataille de neige au salon ! Qui se cache derrière le coussin ?',
    assets: [],
    gifts: [],
  },
  48: {
    day: 48,
    date: 'JEUDI 3 DÉCEMBRE 2026',
    title: 'Coincés dans les Céréales',
    adultPreparation: 'Installer les deux lutins émergeant d’une boîte de céréales.',
    message:
      'Nous cherchions notre petit-déjeuner… et nous sommes tombés la tête la première dans le paquet de céréales !',
    assets: [],
    gifts: ['Céréales'],
  },
  49: {
    day: 49,
    date: 'VENDREDI 4 DÉCEMBRE 2026',
    title: 'La Soirée Pop-corn & Cinéma',
    adultPreparation:
      'Disposer les deux lutins avec un bol de pop-corn et leurs tickets. À joindre : Tickets de cinéma.',
    message:
      'Ce soir, c’est grande séance de cinéma ! Louis, quel dessin animé choisis-tu ?',
    assets: [],
    gifts: ['Collation adaptée à l’âge de Louis'],
  },
  50: {
    day: 50,
    date: 'SAMEDI 5 DÉCEMBRE 2026',
    title: 'Les Chaussures Emballées',
    adultPreparation:
      'Envelopper soigneusement les chaussures de Louis dans du papier cadeau ou alu.',
    message: 'Surprise ! Ce matin, tes chaussures se prennent pour de vrais cadeaux de Noël !',
    assets: [],
    gifts: [],
  },
  51: {
    day: 51,
    date: 'DIMANCHE 6 DÉCEMBRE 2026',
    title: 'Les Pièces en Chocolat',
    adultPreparation:
      'Placer des pièces en chocolat emballées dans les chaussures de Louis.',
    message:
      'Bonne Saint-Nicolas, Louis ! Une douce surprise gourmande s’est glissée dans tes chaussures.',
    assets: [],
    gifts: ['Chocolats emballés'],
  },
  52: {
    day: 52,
    date: 'LUNDI 7 DÉCEMBRE 2026',
    title: 'Préparation de la Fête des Lumières',
    adultPreparation: 'Disposer des petits photophores avec bougies LED sur le bord de fenêtre.',
    message:
      'Demain, c’est le 8 décembre ! Préparons nos jolies bougies pour faire briller notre fenêtre à Lyon !',
    assets: [],
    gifts: [],
  },
  53: {
    day: 53,
    date: 'MARDI 8 DÉCEMBRE 2026',
    title: 'La Chaise Ligotée',
    adultPreparation: 'Enrouler du papier crépon ou du ruban autour des pieds de la chaise.',
    message:
      'Nous voulions décorer la chaise de la cuisine… et nous nous sommes un peu emmêlés les pinceaux !',
    assets: [],
    gifts: [],
  },
  54: {
    day: 54,
    date: 'MERCREDI 9 DÉCEMBRE 2026',
    title: "La Course d'Autos",
    adultPreparation:
      'Installer les deux lutins dans des voitures jouets sur une ligne de départ. À joindre : Panneau Départ/Arrivée.',
    message:
      'Attention… Prêts… Partez ! La grande course des lutins est officiellement lancée !',
    assets: [],
    gifts: [],
  },
  55: {
    day: 55,
    date: 'JEUDI 10 DÉCEMBRE 2026',
    title: 'Les Lutins Fantômes',
    adultPreparation: 'Recouvrir les lutins d’un mouchoir en blanc avec deux yeux dessinés.',
    message: 'Bouh ! Ce sont deux petits fantômes farceurs qui viennent te saluer !',
    assets: [],
    gifts: [],
  },
  56: {
    day: 56,
    date: 'VENDREDI 11 DÉCEMBRE 2026',
    title: 'L’Empreinte de Peinture',
    adultPreparation: 'Déposer une feuille avec deux petites empreintes de mains colorées.',
    message:
      'Deux petites mains de lutins ont laissé leurs couleurs. À ton tour de nous faire un beau dessin !',
    assets: [],
    gifts: [],
  },
  57: {
    day: 57,
    date: 'SAMEDI 12 DÉCEMBRE 2026',
    title: 'Cachés dans le Sapin',
    adultPreparation: 'Cacher les deux lutins dans les branches du sapin de Noël.',
    message:
      'Coucou Louis ! Deux petits bonnets rouges se sont cachés au milieu du sapin. Trouve-nous !',
    assets: [],
    gifts: [],
  },
  58: {
    day: 58,
    date: 'DIMANCHE 13 DÉCEMBRE 2026',
    title: 'La Cabane de Coussins',
    adultPreparation:
      'Monter une cabane avec les coussins du canapé et y cacher les lutins avec une veilleuse.',
    message:
      'Bienvenue dans notre cabane secrète ! Il reste une place douillette pour toi.',
    assets: [],
    gifts: [],
  },
  59: {
    day: 59,
    date: 'LUNDI 14 DÉCEMBRE 2026',
    title: 'Le Portrait des Lutins',
    adultPreparation:
      'Affichez ou posez la photo souvenir des deux lutins. À joindre : Portrait souvenir.',
    message: 'Cheeeese ! Nous avons tiré notre portrait le plus rigolo pour toi !',
    assets: [],
    gifts: [],
  },
  60: {
    day: 60,
    date: 'MARDI 15 DÉCEMBRE 2026',
    title: 'Le Départ du 2ème Lutin',
    adultPreparation:
      'Retirer le 2ème lutin et placer la lettre d’adieu entre les mains du 1er lutin.',
    message:
      'Mon cher Louis,\n\nC’était fantastique de venir faire des farces à Lyon avec mon copain ! Le Père Noël a besoin de moi à l’atelier pour emballer les derniers jouets. Je suis reparti cette nuit pour le Pôle Nord. Mon compagnon reste avec toi jusqu’au grand soir !\n\nÀ très bientôt !',
    assets: [],
    gifts: [],
  },
  61: {
    day: 61,
    date: 'MERCREDI 16 DÉCEMBRE 2026',
    title: 'La Nostalgie du Copain',
    adultPreparation:
      'Mettre le lutin en scène en train de regarder le portrait souvenir. À joindre : Portrait souvenir.',
    message:
      'Mon copain me manque un peu aujourd’hui. Heureusement, il me reste tous nos magnifiques souvenirs partagés avec toi.',
    assets: [],
    gifts: [],
  },
  62: {
    day: 62,
    date: 'JEUDI 17 DÉCEMBRE 2026',
    title: 'La Vérification de la Liste',
    adultPreparation:
      'Dérouler la liste des petits bonheurs. À joindre : Liste des petits bonheurs.',
    message:
      'Louis, voici ta liste magique des petits bonheurs : partager, aider, rire et faire un gros câlin !',
    assets: [],
    gifts: [],
  },
  63: {
    day: 63,
    date: 'VENDREDI 18 DÉCEMBRE 2026',
    title: 'La Patinoire en Farine',
    adultPreparation:
      'Disposer un peu de farine/semoule sur un plateau pour simuler une patinoire.',
    message: 'La table s’est transformée en patinoire ! Regarde mes tout petits patins à glace.',
    assets: [],
    gifts: [],
  },
  64: {
    day: 64,
    date: 'SAMEDI 19 DÉCEMBRE 2026',
    title: 'L’Écoute des Chants de Noël',
    adultPreparation: 'Installer le lutin avec de petits écouteurs près de l’enceinte.',
    message: 'J’écoute les plus beaux chants de Noël. On chante tous ensemble ?',
    assets: [],
    gifts: [],
  },
  65: {
    day: 65,
    date: 'DIMANCHE 20 DÉCEMBRE 2026',
    title: 'Le Doudou Emballé',
    adultPreparation: 'Emballer délicatement le doudou de Louis dans un papier cadeau facile à ouvrir.',
    message:
      'Ton doudou s’est déguisé en paquet cadeau ! Déballe-le vite pour lui faire un gros câlin.',
    assets: [],
    gifts: [],
  },
  66: {
    day: 66,
    date: 'LUNDI 21 DÉCEMBRE 2026',
    title: 'La Recette des Biscuits du Père Noël',
    adultPreparation:
      'Poser la fiche recette des sablés avec les ingrédients. À joindre : Fiche recette.',
    message:
      'Aujourd’hui, nous préparons les sablés pour le Père Noël. Tous à vos tabliers !',
    assets: [],
    gifts: ['Ingrédients des sablés'],
  },
  67: {
    day: 67,
    date: 'MARDI 22 DÉCEMBRE 2026',
    title: 'Caché dans la Chaussette de Noël',
    adultPreparation: 'Placer le lutin émergeant de la grande chaussette de Noël.',
    message:
      'Je suis bien au chaud… Viens vite chercher un petit bonnet rigolo dans la chaussette !',
    assets: [],
    gifts: [],
  },
  68: {
    day: 68,
    date: 'MERCREDI 23 DÉCEMBRE 2026',
    title: 'L’Avis de Passage du Père Noël',
    adultPreparation:
      'Déposer la pancarte d’avis de passage. À joindre : Plateau du Père Noël.',
    message:
      'Demain c’est le grand Réveillon ! N’oublie pas de disposer un verre de lait et un biscuit sous le sapin !',
    assets: [],
    gifts: ['Lait et biscuit pour le Père Noël'],
  },
  69: {
    day: 69,
    date: 'JEUDI 24 DÉCEMBRE 2026',
    title: 'Le Repos sous le Sapin',
    adultPreparation:
      'Installer le lutin allongé sous le sapin avec son sac prêt pour le départ.',
    message:
      'Ce soir, je remonte dans le traîneau avec le Père Noël. Merci pour toutes nos merveilleuses aventures, Louis. Je garde tous tes sourires précieusement dans mon sac !',
    assets: [],
    gifts: [],
  },
  70: {
    day: 70,
    date: 'VENDREDI 25 DÉCEMBRE 2026',
    title: 'LA LETTRE FINALE DU PÈRE NOËL',
    adultPreparation:
      'Retirer le lutin et disposer la grande lettre finale du Père Noël à côté des cadeaux et du verre de lait vide.',
    message:
      'Mon très cher Louis,\n\nMerci d’avoir si chaleureusement accueilli mes deux lutins ! Ton compagnon de voyage est remonté dans mon traîneau cette nuit pour rentrer au Pôle Nord avec moi. Il m’a raconté toutes vos fabuleuses aventures à Lyon, vos fous rires et tes magnifiques idées.\n\nJe te souhaite une merveilleuse journée de Noël, pleine de douceur, de magie et de moments partagés en famille. Nous gardons un souvenir inoubliable de toi dans notre atelier.\n\nJoyeux Noël Louis !\n\nLe Père Noël',
    assets: [],
    gifts: ['Cadeaux de Noël'],
  },
}

export const dailySheetsByActivityId: Record<string, DailySheet> = Object.fromEntries(
  Object.values(dailySheets).map((sheet) => ['jour-' + sheet.day, sheet]),
) as Record<string, DailySheet>

dailySheetsByActivityId['jour-1-alerte-pole-nord'] = dailySheets[1]
dailySheetsByActivityId['jour-2-preparation-sac'] = dailySheets[2]
dailySheetsByActivityId['jour-3-depart-traineau'] = dailySheets[3]
dailySheetsByActivityId['jour-4-pause-gouter'] = dailySheets[4]