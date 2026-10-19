import { adventure } from './adventureStore'
import { arrivalDay, totalDays } from './calendar'
import { dailySheets, type DailySheet } from './dailySheets'

/**
 * Le plan des farces — un récit séquentiel ancré au JOUR D'ARRIVÉE du lutin,
 * pas à des dates fixes : changez date_debut ou arrivee_lutin dans le
 * formulaire et tout le plan glisse avec.
 *
 * farcePlan[0] = le jour de l'arrivée. Les deux dernières pièces du récit
 * (la valise, la lettre finale) s'ancrent toujours aux deux derniers jours
 * de l'aventure, quelle que soit sa durée.
 */

export interface FarceDay {
  title: string
  adultPreparation: string
  message: string
  gifts: string[]
}

const mk = (day: number, f: FarceDay): DailySheet => ({
  day,
  date: '',
  assets: [],
  gifts: f.gifts,
  title: f.title,
  adultPreparation: f.adultPreparation,
  message: f.message,
})

/** La veille de l'arrivée : la dernière nuit de route, tout proche */
const veille: FarceDay = {
  title: 'La dernière nuit de route',
  adultPreparation:
    'Glisser le mot dans la boîte aux lettres. Un peu de farine ou de paillettes sur le pas de la porte peut annoncer une arrivée imminente.',
  message:
    "Louis ! Devine où je suis ? Je vois les lumières de ta ville depuis ma branche ! Cette nuit je dors à deux pas de chez toi — demain, si tout va bien, je serai enfin arrivé. Prépare-toi : je ne suis pas un lutin très discret...",
  gifts: [],
}

/** L'avant-dernier jour : la valise bouclée, le départ se prépare */
const avantDernier: FarceDay = {
  title: 'La valise beaucoup trop pleine',
  adultPreparation:
    'Installer le lutin penché sur un minuscule sac débordant : un doudou miniature, une pantoufle et des chaussettes en dépassent. Une pancarte écrite à la main : « Ça rentre… presque ! »',
  message:
    "Louis, il va falloir que tu m'aides : je veux emporter TOUT un tas de souvenirs — un bout de coussin, une miette de pain d'épices, et surtout une de tes chaussettes (pour le parfum de chez toi). Mais rien ne rentre dans mon sac ! Choisis pour moi : je ne peux garder qu'une chose ?",
  gifts: ['Petit sac', 'Pancarte'],
}

/** Le dernier jour : le lutin est reparti, le Père Noël écrit */
const finale: FarceDay = {
  title: 'La dernière bêtise',
  adultPreparation:
    'Le lutin a disparu. Aligner les doudous près des cadeaux ; l’un d’eux tient la lettre finale du Père Noël — à l’envers, évidemment.',
  message:
    "Mon très cher Louis,\n\nC'est le Père Noël. J'ai enfin retrouvé mon petit lutin — il ronronne près du feu de l'atelier, avec une chaussette qui sent bon ta maison serrée contre lui. Il m'a tout raconté : tes rires, ta gentillesse, et toutes les bêtises qu'il a réussies grâce à toi.\n\nMerci de l'avoir si bien accueilli. Il m'a dit, très sérieusement, que tu étais la plus belle rencontre de son voyage. Garde ton rire et ta bonne humeur — et garde une place pour lui : les lutins, ça revient toujours.\n\nJoyeux Noël,\nLe Père Noël",
  gifts: [],
}

/**
 * Les farces, dans l'ordre, à partir du jour d'arrivée.
 * Les grosses mises en scène sont placées sur les week-ends.
 * Certains jours invitent l'enfant à répondre — un échange semé tous les 2-3 jours.
 */
const farcePlan: FarceDay[] = [
  {
    title: 'L’arrivée en pantoufle',
    adultPreparation:
      'Installer le lutin assis dans une grande pantoufle, son mot d’arrivée à la main, près de la porte ou du sapin.',
    message:
      "Louis ! Je suis ENFIN arrivé ! Quel voyage — des semaines de traîneau, de train et de sac à dos. Heureusement que j'ai trouvé cette pantoufle géante pour me reposer : c'est le lit le plus doux du monde. Tu me laisses la garder ?",
    gifts: ['Grande pantoufle'],
  },
  {
    title: 'La momie échappée',
    adultPreparation:
      'Entourer le lutin de quelques feuilles de papier toilette, avec une petite traîne qui serpente autour du canapé.',
    message:
      "Au secours, Louis ! Cette nuit j'ai découvert le papier toilette — et j'ai roulé, roulé, roulé... Résultat : je suis devenu une momie du Pôle Nord ! Compte combien de feuilles j'ai utilisées, je parie que tu n'en trouveras pas moins de dix.",
    gifts: ['Papier toilette'],
  },
  {
    title: 'Le lit-chaussette',
    adultPreparation:
      'Coucher le lutin dans une chaussette propre, son bonnet dépassant du revers comme d’un édredon.',
    message:
      "Chhht... tu m'as réveillé ! J'ai trouvé cette chaussette tellement confortable que j'y ai dormi comme un bébé renne. Au Pôle Nord, on dort dans des bottes, mais la chaussette, c'est encore mieux.",
    gifts: ['Chaussette propre'],
  },
  {
    title: 'La réunion secrète',
    adultPreparation:
      'Installer les doudous en cercle autour du lutin, un papier plié devant eux : « Réunion de bêtises ! »',
    message:
      "Louis, ne le répète à personne : cette nuit, j'ai convoqué une réunion TRÈS sérieuse avec tes doudous. Ordre du jour : comment préparer les meilleures bêtises de l'hiver. Ils étaient tous d'accord avec moi — ça promet !",
    gifts: ['Doudous', 'Panneau'],
  },
  {
    title: 'Le lecteur à l’envers',
    adultPreparation:
      'Assoir le lutin avec un livre ouvert à l’envers, quelques peluches sagement installées en cercle pour l’écouter.',
    message:
      "Louis, j'ai lu une histoire FORMIDABLE à tes doudous cette nuit ! Enfin... je crois que je tenais le livre à l'envers, parce que le dragon devenait un chat à la fin. Ce soir, tu veux bien me relire la vraie histoire — à l'endroit ?",
    gifts: ['Livre', 'Peluches'],
  },
  {
    title: 'La guirlande de chaussettes',
    adultPreparation:
      'Suspendre des chaussettes propres en guirlande sur le dossier du canapé ou la crédence. Le lutin porte la dernière sur la tête.',
    message:
      "Regarde Louis, j'ai fabriqué la plus belle guirlande du monde — avec vos chaussettes ! Chez moi, on décore avec des chaussettes de Noël, alors pourquoi pas ici ? Si tu veux m'aider, ajoute une chaussette ce soir : on fera la guirlande la plus longue du quartier !",
    gifts: ['Chaussettes'],
  },
  {
    title: 'Le salon sens dessus dessous',
    adultPreparation:
      'Mise en scène du week-end : coussins retournés, doudous les pieds en l’air, le lutin faisant le poirier contre un coussin.',
    message:
      "Houp là ! Louis, cette nuit je me suis entraîné à la lutin-acrobatie — j'ai UN PEU remué le salon. Bon d'accord, beaucoup. Mais regarde ce poirier : presque trois secondes de tenue !",
    gifts: ['Coussins'],
  },
  {
    title: 'Le bain sans eau',
    adultPreparation:
      'Installer le lutin dans un saladier vide ou une casserole renversée, un gant de toilette sur la tête comme bonnet de bain.',
    message:
      "Après tant d'efforts, je méritais un bon bain chaud ! J'ai juste oublié un petit détail : l'eau. Glisse-moi un gant de toilette ce soir, qu'au moins je fasse semblant comme il faut.",
    gifts: ['Saladier', 'Gant de toilette'],
  },
  {
    title: 'Le garagiste des chaussons',
    adultPreparation:
      'Retourner un chausson comme une voiture en panne, le lutin penché dessus avec un ustensile en guise d’outil.',
    message:
      "Diagnostic du jour, Louis : ce chausson a un bruit bizarre au démarrage et un volant qui tire à gauche. J'ai tout vérifié — verdict : il manque juste un pied dedans !",
    gifts: ['Chausson'],
  },
  {
    title: 'La luge de salon',
    adultPreparation:
      'Construire une petite pente avec des coussins, le lutin assis sur un torchon en haut comme sur une luge.',
    message:
      "Wouuuh ! J'ai construit la piste de luge la plus rapide du salon ! Un torchon, trois coussins, et hop — presque aussi vite qu'un traîneau. Tu testes la descente avec un doudou ?",
    gifts: ['Coussins', 'Torchon'],
  },
  {
    title: 'Super-Lutin',
    adultPreparation:
      'Attacher une serviette ou un torchon rouge dans le dos du lutin comme une cape ; il pose fièrement devant les doudous.',
    message:
      "Tadaaa ! Super-Lutin est arrivé — le héros qui sauve les doudous tristes et les chaussettes perdues ! Il me manque juste un écusson officiel sur la poitrine... Tu veux bien me le dessiner ?",
    gifts: ['Serviette ou torchon'],
  },
  {
    title: 'L’embouteillage géant',
    adultPreparation:
      'Mise en scène du week-end : voitures jouets et chaussures alignées en bouchon dans un coin du salon ; le lutin dort dans un chausson qui bloque tout.',
    message:
      "Louis, c'est la CATASTROPHE sur la route du salon ! Un bouchon de trois mètres, tout le monde klaxonne — et moi je dors dans mon chausson-taxi. Heureusement qu'il n'y a pas d'heure de pointe chez les doudous...",
    gifts: ['Voitures', 'Chaussures'],
  },
  {
    title: 'La sieste en boîte',
    adultPreparation:
      'Coucher le lutin dans une boîte de mouchoirs vide, un mouchoir tiré sur lui comme une couverture.',
    message:
      "Jour de repos, Louis ! J'ai trouvé la chambre parfaite : une boîte de mouchoirs avec couverture assortie. Chuchote-moi un secret ce soir avant de dormir — les secrets, ça fait de très beaux rêves.",
    gifts: ['Boîte de mouchoirs'],
  },
  {
    title: 'Les objets nous regardent !',
    adultPreparation:
      'Mise en scène du week-end : découper de grands yeux dans du papier et les coller sur plusieurs objets (fruits, vases, lampe). Le lutin tient les derniers yeux.',
    message:
      "Attention Louis, ta maison a des YEUX ! J'ai passé la nuit à coller des regards partout — le grille-pain te surveille, la plante aussi. Et si tu découpes des yeux toi aussi, on pourra en mettre PARTOUT !",
    gifts: ['Yeux en papier à découper'],
  },
  {
    title: 'La cachette ratée',
    adultPreparation:
      'Cacher le lutin derrière un coussin... mal : son bonnet et ses pieds dépassent de partout.',
    message:
      "1, 2, 3, SOLEIL ! Tu ne me vois pas, n'est-ce pas ? Je suis le meilleur cache-cacheur du Pôle Nord. Bon d'accord, mon bonnet dépasse un tout petit peu... Rejouons ce soir — toi qui te caches, promis je ne regarderai pas (ou presque).",
    gifts: ['Coussin'],
  },
  {
    title: 'Le lit du copain',
    adultPreparation:
      'Préparer une deuxième chaussette-lit à côté de celle du lutin, avec une pancarte : « Réservé à mon copain ! »',
    message:
      "Louis, un GRAND secret : mon meilleur ami lutin arrive peut-être bientôt ! Je lui prépare déjà son lit-chaussette, comme le mien. Tu veux lui écrire un petit mot de bienvenue ? Il adore les messages.",
    gifts: ['Deuxième chaussette', 'Pancarte'],
  },
  {
    title: 'Le colis catastrophe',
    adultPreparation:
      'Renverser une boîte d’où sort le deuxième lutin ; le premier est coincé sous un rabat, les jambes dépassant.',
    message:
      "IL EST ARRIVÉ ! Louis, mon copain le lutin de Nîmes est arrivé par colis express — et il m'a écrasé en sortant de sa boîte ! Maintenant nous sommes DEUX pour les bêtises. Ça va être le double de fun (et le double de dégâts, chhht).",
    gifts: ['Boîte'],
  },
  {
    title: 'La guerre des doudous',
    adultPreparation:
      'Construire deux petits forts de coussins face à face ; chaque lutin commande une équipe de peluches, quelques boulettes de papier au sol.',
    message:
      "Louis, déclare ton camp ! Mon copain le lutin de Nîmes et moi avons fait la guerre des doudous : mes ours contre ses lapins. Résultat : nul partout, boulettes partout. Ce soir, choisis ton équipe et dis-le à ton doudou préféré !",
    gifts: ['Coussins', 'Boulettes de papier'],
  },
  {
    title: 'Les explorateurs coincés',
    adultPreparation:
      'Plonger les deux lutins tête en bas dans une boîte vide ; seuls leurs pieds dépassent.',
    message:
      "Louis ! Au fond de cette boîte, il paraît qu'il y avait un trésor ! On a plongé pour le chercher et... on est restés coincés, tous les deux. Le trésor ? Une vieille miette de biscuit. Expédition réussie quand même !",
    gifts: ['Boîte vide'],
  },
  {
    title: 'Le cinéma miniature',
    adultPreparation:
      'Installer les deux lutins devant un livre illustré grand ouvert, les doudous alignés derrière eux comme au cinéma.',
    message:
      "Séance de minuit au cinéma des doudous ! On a regardé le livre d'images trois fois — le deuxième lutin a pleuré à la fin (il dit que non, mais si). Vote ce soir pour le film de demain : aventure, dragons ou rennes ?",
    gifts: ['Livre illustré', 'Doudous'],
  },
  {
    title: 'Le magasin de chaussures folles',
    adultPreparation:
      'Disposer quelques chaussures avec des étiquettes en papier : « Fusée », « Bateau », « Pour géant ». Les lutins tiennent la caisse avec une boîte vide.',
    message:
      "Bienvenue chez Lutin & Fils, cordonniers fous ! En vente aujourd'hui : une chaussure-fusée, une chaussure-bateau et un modèle spécial pour géant. Prix imbattables : un câlin par paire. Invente un nom pour ta chaussure préférée !",
    gifts: ['Chaussures', 'Étiquettes en papier'],
  },
  {
    title: 'Le trésor de chaussettes',
    adultPreparation:
      'Remplir les pantoufles de chaussettes roulées en boules ; les lutins exhibent fièrement leur découverte.',
    message:
      "Louis, TÉSOR TROUVÉ ! Nous avons découvert l'or de la maison : des chaussettes ! On les a rangées dans vos pantoufles pour être sûrs de ne pas les perdre. Cache-nous une chaussette aujourd'hui — on la retrouvera pour notre collection !",
    gifts: ['Chaussettes', 'Pantoufles'],
  },
  {
    title: 'Le défilé complètement raté',
    adultPreparation:
      'Coiffer les doudous de chaussettes en bonnets ; les deux lutins défilent chacun dans une manche de vêtement trop grande.',
    message:
      "Défilé de mode au Pôle du salon ! Le thème : les chaussettes. Les doudous étaient magnifiques, mais nous... on s'est trompés de manche, de pied, de tout. Notez notre style sur dix — soyez gentils.",
    gifts: ['Chaussettes', 'Manches de vêtements'],
  },
  {
    title: 'Les décorateurs emmêlés',
    adultPreparation:
      'Poser des étoiles en papier autour des lutins ; l’un en porte une de travers sur le bonnet.',
    message:
      "On a voulu vous fabriquer des étoiles pour le sapin — résultat : on s'est emmêlé dans le papier et moi j'ai une étoile sur le bonnet (je la garde, elle me va bien). Découpe une étoile à ton tour et ajoute-la aux nôtres !",
    gifts: ['Étoiles en papier'],
  },
  {
    title: 'Le grand prix des chaussons',
    adultPreparation:
      'Tracer une courte piste de papier toilette dans un coin dégagé ; chaque lutin pilote un chausson.',
    message:
      "À vos marques... Le Grand Prix des Chaussons 2026 ! J'ai gagné, évidemment — mon chausson avait un meilleur aileron. Le lutin de Nîmes conteste le résultat : il demande une revanche. La prochaine course a lieu... dans ta chambre ?",
    gifts: ['Chaussons', 'Piste en papier'],
  },
  {
    title: 'Les fantômes gentils',
    adultPreparation:
      'Recouvrir les deux lutins de mouchoirs avec des yeux dessinés ; leurs pieds dépassent du linge.',
    message:
      "OUUUUUH ! Ne nous reconnais-tu pas ? On s'est déguisés en fantômes gentils — les seuls fantômes qui ont peur du noir. Nos pieds dépassent un peu, mais personne n'est parfait.",
    gifts: ['Mouchoirs', 'Feutre'],
  },
  {
    title: 'Les portraits catastrophiques',
    adultPreparation:
      'Laisser une feuille avec des portraits de lutins dessinés : gros nez, oreilles géantes, bonnets tordus.',
    message:
      "Louis, regarde nos autoportraits ! On s'est dessinés l'un l'autre — je trouve que le mien me ressemble ENORMÉMENT (le gros nez, c'est le style). Dessine-moi à ton tour, j'accepte même les oreilles géantes !",
    gifts: ['Feuille', 'Crayons'],
  },
  {
    title: 'La pyramide des coussins',
    adultPreparation:
      'Empiler quelques coussins en pyramide stable au sol ; les deux lutins trônent au sommet.',
    message:
      "Nous sommes les ROIS de la montagne de coussins ! Douze minutes de construction, trois secondes de fierté — et un petit éboulement (rien de cassé, promis). Empile deux coussins pour agrandir notre royaume ?",
    gifts: ['Coussins'],
  },
  {
    title: 'Le quartier général des bêtises',
    adultPreparation:
      'Monter une cabane de coussins avec une pancarte « Quartier général des bêtises » ; les doudous gardent l’entrée.',
    message:
      "TOP SECRET, Louis : on a construit notre quartier général ! Mot de passe obligatoire pour entrer : « chaussette ». Invente un autre mot de passe ce soir — on l'adoptera si les doudous l'approuvent.",
    gifts: ['Coussins', 'Pancarte'],
  },
  {
    title: 'Le dernier échange de vêtements',
    adultPreparation:
      'Échanger les bonnets des deux lutins, ou leur faire porter chacun une chaussette différente en déguisement.',
    message:
      "Dernier jour pour s'amuser à deux : on a échangé nos bonnets ! Le lutin de Nîmes dit que le mien lui gratte — menteur, il sent le pain d'épices. Prête-moi une chaussette dépareillée pour la route de mon copain ?",
    gifts: ['Bonnets ou chaussettes'],
  },
  {
    title: 'Le copain a emporté une chaussette !',
    adultPreparation:
      'Le deuxième lutin a disparu. Le premier tient une chaussette seule et sa petite lettre de départ ; garder l’autre chaussette de côté.',
    message:
      "Louis, mon copain le lutin de Nîmes est reparti au Pôle Nord cette nuit — il prépare Noël là-haut. Tu sais ce qu'il a emporté en souvenir ? TA chaussette. Il dit qu'elle sentait l'aventure. Il m'a laissé un mot et je l'ai gardée pour toi... avec sa moitié.",
    gifts: ['Chaussette seule', 'Petite lettre'],
  },
  {
    title: 'Le nouveau copain',
    adultPreparation:
      'Coiffer un doudou d’un bonnet en papier ; il est assis auprès du lutin comme nouveau compagnon.',
    message:
      "Un lutin seul, c'est triste — alors ton doudou a gentiment accepté de devenir mon copain officiel ! Il ne parle pas beaucoup, mais il rit très fort (dans sa tête). Présente-lui ton doudou préféré ce soir : on fait un club.",
    gifts: ['Doudou', 'Bonnet en papier'],
  },
  {
    title: 'Les fruits déguisés',
    adultPreparation:
      'Poser des visages en papier devant les fruits de la corbeille ; le lutin arbore une grande moustache en papier.',
    message:
      "Psst ! J'ai déguisé tes fruits pour la fête — les bananes ont des moustaches, les pommes ont du style. Moi aussi d'ailleurs, regarde ! Déguise un fruit de plus pour compléter le bal masqué de la corbeille ?",
    gifts: ['Visages en papier', 'Fruits'],
  },
  {
    title: 'La patinoire miniature',
    adultPreparation:
      'Poser une feuille blanche par terre comme patinoire ; fixer deux petits cartons sous les pieds du lutin en patins.',
    message:
      "J'ai transformé votre sol en patinoire olympique ! Mes figures : la spirale du pingouin et le saut du renne volant. Fais glisser un doudou sur la glace — attention, c'est TRÈS glissant (enfin presque).",
    gifts: ['Feuille blanche', 'Cartons-patins'],
  },
  {
    title: 'Le concert infernal',
    adultPreparation:
      'Installer le lutin jouant de la batterie avec des boîtes vides et des cuillères ; les doudous se bouchent les oreilles.',
    message:
      "BADOUM-BOUM-TSCHAK ! Louis, j'ai fondé un groupe : les Lutins du Vacarme ! Les doudous adorent (ils se bouchent les oreilles de joie). Commande-moi un morceau pour le concert de ce soir — je joue de tout : boîtes, casseroles, cuillères !",
    gifts: ['Boîtes vides', 'Cuillères'],
  },
  {
    title: 'Le doudou-cadeau',
    adultPreparation:
      'Envelopper un doudou dans un torchon facile à ouvrir ; le lutin s’affaire sur le nœud.',
    message:
      "Chhht, ne le dis à personne : j'emballerais bien un de tes doudous pour Noël — sauf que les nœuds, c'est COMPLIQUÉ avec des mains de lutin. Tu peux envelopper un doudou toi aussi pour m'apprendre ? Je te surveille en cachette !",
    gifts: ['Torchon', 'Doudou'],
  },
  {
    title: 'Le pâtissier dans le saladier',
    adultPreparation:
      'Installer le lutin dans un saladier vide avec une cuillère en bois et la recette des sablés écrite à la main.',
    message:
      "Aujourd'hui, atelier cuisine ! Je prépare des sablés magiques — recette secrète de l'atelier du Père Noël. Il me manque juste la cannelle... tu peux m'aider à la trouver dans le placard ? Ensuite, dégustation obligatoire !",
    gifts: ['Saladier', 'Cuillère en bois', 'Recette manuscrite'],
  },
  {
    title: 'La chaussette occupée',
    adultPreparation:
      'Faire dépasser le lutin d’une grande chaussette accrochée ou posée, avec un panneau : « Ne pas laver : lutin à l’intérieur ! »',
    message:
      "ATTENTION, zone occupée ! J'ai trouvé LA cachette parfaite pour faire la sieste — interdiction formelle de laver cette chaussette tant que je suis dedans. Glisse-moi un petit mot sous le panneau ce soir ?",
    gifts: ['Grande chaussette', 'Panneau'],
  },
  {
    title: 'Les doudous prennent le petit-déjeuner',
    adultPreparation:
      'Installer les doudous aux places de la famille devant des assiettes vides ; le lutin est à la place de Louis, couronné de papier.',
    message:
      "Bonjour la famille ! J'ai invité vos doudous au petit-déjeuner — ils avaient TELLEMENT faim (d'attention). J'ai pris TA place Louis, avec la couronne, évidemment. Demain matin, viens prendre le petit-déj avec nous en pyjama : place d'honneur garantie !",
    gifts: ['Doudous', 'Assiettes', 'Couronne de papier'],
  },
]

const finaleSheet = (day: number) => mk(day, finale)
const avantDernierSheet = (day: number) => mk(day, avantDernier)

/**
 * La fiche narrative du jour : la veille puis la séquence des farces,
 * la valise et la lettre finale toujours aux deux derniers jours.
 * Renvoie null si le jour n'est pas couvert par le plan (le kit fait relais).
 */
export function farceForDay(day: number): DailySheet | null {
  const arrival = arrivalDay.value
  const total = totalDays.value
  if (day === total) return finaleSheet(day)
  if (day === total - 1) return avantDernierSheet(day)
  if (day === arrival - 1) return mk(day, veille)
  const idx = day - arrival
  if (idx >= 0 && idx < farcePlan.length) {
    // L'arc « copain » (lit réservé → nouveau compagnon) n'existe qu'à deux lutins ;
    // en solo, le kit prend le relais ces jours-là.
    const DUO_WINDOW: readonly [number, number] = [15, 31]
    if (!adventure.deuxieme_lutin && idx >= DUO_WINDOW[0] && idx <= DUO_WINDOW[1]) return null
    return mk(day, farcePlan[idx])
  }
  return null
}

/** La fiche du jour : la farce du plan si elle existe, sinon la fiche du kit */
export function sheetForDay(day: number): DailySheet | undefined {
  return farceForDay(day) ?? dailySheets[day]
}
