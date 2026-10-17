# Direction artistique — Mon aventure des lutins

**Nom de la DA : « Courrier du Pôle Nord »**

L'app n'est pas un tableau de bord qui *suit* l'aventure — c'est un artefact qui en fait partie. On ne consulte pas l'app, on ouvre le courrier des lutins. Tout découle de là.

## Piliers

### 1. La nuit éclairée à la bougie

Le monde est sombre (forêt de nuit) et la lumière est toujours *locale* — un halo doré, une étincelle, une lune. Jamais de plafond blanc. La lumière vient d'un objet : lanterne, cire chaude, feu follet. Les éléments magiques **émettent** leur lumière (`mix-blend-mode: screen`, halos radiaux) au lieu de la refléter.

### 2. Le papier avant le pixel

Le matériau de référence est l'objet physique du rituel : enveloppe, parchemin jauni, cire, tampon postal, fil doré. Bords irréguliers, lettrines, grain, ombres profondes. **Pas de glassmorphism** — le verre dépoli est un matériau d'app SaaS sans rapport avec l'histoire. Quand une surface doit exister, c'est du papier de nuit, pas du verre.

### 3. La magie se mérite

Un seul effet fort par écran, jamais deux. La magie répond à un geste (maintenir, révéler, cocher) ou à un événement (nouveau jour) — elle n'est jamais décorative permanente au premier plan. La poussière ambiante reste en arrière-plan, quasi subliminale. *Le luxe c'est la retenue.*

### 4. On voyage, on ne clique pas

La navigation est diegetic : elle fait partie du récit. La piste dorée du voyage **est** le menu — chaque écran est une étape sur la route des lutins.

- **Modèle spatial** : l'app est un chemin, pas une pile de pages. Swiper entre les jours = suivre la piste.
- **Transition signature** : le point-étape doré de la carte **morphe en cachet de cire** quand on ouvre la fiche du jour (shared-element). Retour = le sceau se referme en point.
- **La lettre se déplie** : ouvrir une fiche déplie le papier (léger rotateX/scale), la quitter le replie.
- **Menu** : trois lanternes posées sur la piste en bas d'écran (Aujourd'hui · Carte · Souvenirs) — l'active brille, jamais une barre iOS générique.
- **Chaque passage** a du poids : spring doux + tick haptique par étape.

## Charte

| Élément | Définition |
|---|---|
| **Palette** | Nuit : `#0c1e19 → #07140e` · Forêt : `#173b32` · Or encre : `#f1cc7a` · Or lumineux : `#ffe9a8` · Bronze : `#a67d34` · Parchemin : `#f6ecd2 → #e2cd9e` · Cire : `#8a2b1a` |
| **Typo** | Titres : serif grand, italique or pour les mots-clés · Corps de lettre : Cormorant italique (`--font-literary`) · UI : Inter + overlines petites caps `.18em` · Phases : numérotées en chapitres (« Chapitre I — Le voyage ») |
| **Motion** | Lent et pesé. Springs doux (~200/25), entrées qui remontent comme un objet posé, halos qui respirent en 3–5 s, rien qui boucle vite. Haptique (`haptic()`) = partie intégrante de la DA. |
| **Texture** | Grain de film global ~5 %, vignette douce, halos en `screen` |
| **Ornements** | SVG artisanaux : boule suspendue, cachets, pointillés dorés, filets à l'encre. Jamais une icône MDI seule là où un ornement est attendu. |
| **Ciel** | `--ambient-glow` étendu à un ciel horaire : aube dorée / jour froid / crépuscule ambré / nuit profonde |

## Ce que la DA refuse

- Rouge/vert de Noël saturé façon supermarché — le vert est *forêt de nuit*, le rouge est *cire*
- Glassmorphism, neumorphism, Material Design
- `border-radius` uniforme sur toutes les cartes (= look composant par défaut)
- Animations rapides, rebonds cartoonesques, confettis
- Plus d'une créature/particule animée de premier plan par écran
- Barre de navigation iOS standard

## Signature

Le **sceau** est le logo interactif : maintenir pour débloquer (anneau conique, or qui se condense, flash). Ce langage réapparaît en miniature ailleurs — lune-progression du home, bouton-cire de la dépêche — comme un leitmotiv.

## Barre de qualité visée : « App of the Day »

Détails que l'équipe éditoriale Apple remarque :

- Transitions shared-element cohérentes avec le récit (point → sceau)
- Physicalité : springs, haptique, friction papier — chaque geste a une masse
- Noir OLED réel en fond, contrastes, `safe-area` respecté
- `prefers-reduced-motion` supporté partout (déjà en place)
- Aucune animation non-compositée (`transform`/`opacity` uniquement)
- Zéro élément mort : pas de bouton sans destination, pas d'écran orphelin
- Hors-ligne complet (PWA/sw.js)
- Fenêtre éditoriale : la période de décembre est un angle de feature naturel

> Note : « App of the Day » exige une app native sur l'App Store. La PWA devra être encapsulée (Capacitor ou équivalent) au moment de la publication — la DA n'en est pas affectée.
