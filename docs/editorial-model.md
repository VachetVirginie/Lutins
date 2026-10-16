# Modèle éditorial — Mon aventure des lutins

Ce document transforme le kit « Louis et les lutins voyageurs » en modèle réutilisable pour une aventure annuelle. Le contenu du kit reste un modèle de référence ; les informations propres à Louis, Lyon et Nîmes deviennent des paramètres personnalisables.

## Principes éditoriaux

- Une fiche par matin de découverte.
- Une préparation adulte séparée du contenu visible par l’enfant.
- Le voyage précède l’arrivée du premier lutin.
- L’arrivée lance la période des farces quotidiennes.
- Les cadeaux et activités spéciales restent ponctuels.
- Les identifiants d’activités sont indépendants des dates.
- Chaque fiche peut être déplacée, remplacée ou personnalisée.
- Les étapes narratives essentielles sont conservées quand la durée est raccourcie.

## Phases du récit de référence

| Phase | Jours du kit | Fonction |
|---|---:|---|
| Voyage | 1–29 | Lettres, cartes, indices et rapprochement progressif de la maison |
| Arrivée du premier lutin | 30 | Rencontre et passage aux farces quotidiennes |
| Farces avec un lutin | 31–45 | Scènes simples, jeux et petites surprises |
| Arrivée du second lutin | 46 | Nouveau personnage et renouvellement du rythme |
| Farces avec deux lutins | 47–59 | Jeux à deux, activités et souvenirs |
| Départ du second lutin | 60 | Transition émotionnelle, le premier reste jusqu’à Noël |
| Dernière semaine | 61–69 | Farces, moments complices et préparation du réveillon |
| Conclusion | 70 | Disparition du lutin et lettre finale du Père Noël |

## Classification des journées

Chaque activité doit être classée avec les champs suivants :

```ts
type StoryPhase =
  | 'voyage'
  | 'arrivee'
  | 'farce'
  | 'depart'
  | 'conclusion'

type ActivityCategory =
  | 'courrier'
  | 'farce'
  | 'cadeau'
  | 'activite'
  | 'mise-en-scene'

type NarrativeImportance = 'essential' | 'recommended' | 'optional'

interface ActivityTemplate {
  id: string
  referenceDay: number
  phase: StoryPhase
  category: ActivityCategory
  importance: NarrativeImportance
  title: string
  childDiscovery: string
  parentPreparation: string[]
  childMessage?: string
  materialIds: string[]
  supportIds: string[]
  requiresElfPresent: boolean
  safetyNotes?: string[]
  personalizationKeys?: string[]
}
```

## Journées de référence

Les 70 fiches du PDF sont intégrées comme modèles éditoriaux. Leurs rôles narratifs sont les suivants :

### Voyage — jours 1 à 29

1. Alerte du Pôle Nord — courrier essentiel
2. Préparation du sac — carte et petit élément de voyage
3. Départ en traîneau — carte et coloriage
4. Première pause goûter — courrier
5. Crayon magique — petit cadeau
6. Boussole du lutin — accessoire
7. Traversée des montagnes — carte
8. Pause chocolat chaud — gourmandise
9. Bateau des glaces — activité papier
10. Étoile du soir — petit cadeau
11. Tempête de neige — mise en scène
12. Escale chez les monstres gentils — carte saisonnière
13. La Rencontre du Lutin de Nîmes ! — embranchement narratif adaptable
14. Emporte-pièce citrouille — petit cadeau
15. Distribution de bonbons — gourmandise
16. Arrivée en France — carte de progression
17. Carte postale de Paris — courrier
18. Ticket de train express — accessoire
19. Wagon des gourmandises — petit cadeau
20. Arrivée en gare de Lyon — étape de voyage
21. Carte postale de Fourvière — localisation
22. Traversée du Rhône — courrier
23. Plan de la ville — support personnalisable
24. Recherche du nom de la rue — indice
25. La Pause devant l'Immeuble/Maison — photo personnalisable
26. Inspection du paillasson — indice physique
27. Clé magique — petit cadeau / accessoire
28. Traces de pas — indice physique
29. Mot sous la porte — veille de l’arrivée

### Arrivée et farces — jours 30 à 45

30. Arrivée du premier lutin — événement essentiel
31. Lutin momie — farce
32. Tyrolienne — farce avec contrainte de sécurité
33. Lait bleu — farce alimentaire
34. Scotché au placard — farce
35. Yeux rigolos sur les fruits — farce / accessoire
36. Dodo dans la boîte à mouchoirs — mise en scène
37. Échange de lit des doudous — farce tendre
38. Glissade en luge — mise en scène
39. Piégé dans le bocal de gâteaux — farce
40. La Cape de Super-Héros — accessoire / mise en scène
41. Pêche dans le lavabo — activité / mise en scène
42. Heure de la lecture — activité calme
43. Moustaches sur le miroir — farce
44. Tour de chaussures — farce
45. L’Annonce du Père Noël — transition essentielle

### Deux lutins — jours 46 à 59

46. Arrivée du second lutin — événement essentiel
47. Bataille de boules de neige — farce
48. Coincés dans les céréales — farce alimentaire
49. Soirée pop-corn et cinéma — activité familiale
50. Chaussures emballées — farce
51. Pièces en chocolat — petit cadeau
52. Préparation de la fête des Lumières — activité saisonnière adaptable
53. Chaise ligotée — farce
54. Course d’autos — jeu
55. Lutins fantômes — farce
56. Empreinte de peinture — activité créative
57. Cachés dans le sapin — recherche
58. Cabane de coussins — activité imaginaire
59. Portrait des lutins — souvenir

### Départ et conclusion — jours 60 à 70

60. Départ du second lutin — transition essentielle
61. Nostalgie du copain — moment émotionnel
62. Vérification de la liste — activité de partage
63. Patinoire en farine — farce
64. Écoute des chants de Noël — activité calme
65. Doudou emballé — farce tendre
66. Recette des biscuits du Père Noël — activité familiale
67. Caché dans la chaussette — recherche
68. Avis de passage du Père Noël — préparation du réveillon
69. Repos sous le sapin — veille du départ
70. Lettre finale du Père Noël — conclusion essentielle

## Supports du kit

Les supports doivent être enregistrés comme ressources indépendantes et pouvoir être associés à plusieurs journées :

```ts
interface SupportTemplate {
  id: string
  name: string
  type: 'lettre' | 'carte' | 'activite' | 'accessoire' | 'photo' | 'recette'
  referencePages: number[]
  required: boolean
  personalizationKeys?: string[]
  containsEmbeddedFamilyData: boolean
}
```

Ressources identifiées : cartes A à H, coloriage, boussole, bateau, étoiles, clé, parcours, billet de train, plan, cadre photo, empreintes, yeux, poissons, banderole, tickets, portrait, liste de petits bonheurs, recette, étiquettes et accueil du Père Noël.

## Matériel global

Le matériel est regroupé une seule fois, puis relié aux journées :

- papeterie : enveloppes, papier, carton, colle, ruban, crayons, ficelle ;
- décors réutilisables : peluches, sac, boîte, panier, coton, jouets, coussins, LED ;
- petites surprises : crayon, étoile, emporte-pièce, clé ;
- consommables : gourmandises, cacao, guimauves, biscuits, céréales, chocolat ;
- impressions : cartes, accessoires et supports.

```ts
interface MaterialTemplate {
  id: string
  name: string
  kind: 'reusable' | 'consumable' | 'printable'
  quantity?: number
  notes?: string
  safetyNotes?: string[]
}
```

L’écran de préparatifs doit agréger les besoins des sept prochains jours sans compter plusieurs fois un objet réutilisable.

## Adaptation à une autre durée

Le kit de 70 jours est un modèle complet, pas une durée imposée. Lors de la création d’une aventure :

1. conserver les événements essentiels : arrivée, second lutin si applicable, départs et conclusion ;
2. conserver une farce par jour après l’arrivée lorsque le calendrier le permet ;
3. réduire d’abord les étapes de voyage optionnelles ;
4. regrouper plusieurs cartes de voyage si le départ est tardif ;
5. ne jamais afficher une référence personnelle non renseignée ;
6. présenter un aperçu avant création du planning.

Les activités peuvent ensuite être remplacées ou déplacées. Une activité prévue après l’arrivée peut être utilisée avant celle-ci uniquement si elle est compatible, ou après confirmation du parent comme « indice laissé avant l’arrivée ».

## Personnalisation

Variables prévues :

```text
{{prenom_enfant}}
{{prenoms_enfants}}
{{nom_lutin}}
{{nom_second_lutin}}
{{ville}}
{{destination}}
{{nom_proche}}
{{quartier}}
```

Les PDF ou images contenant déjà « Louis », « Lyon », « Nîmes » ou un autre nom sont signalés comme personnalisés pour une autre famille. Ils doivent être remplacés ou conservés explicitement par le parent ; aucune substitution automatique ne doit être prétendue.

## Règles de sécurité à conserver

- adulte pour les ciseaux, la cuisson et les boissons chaudes ;
- bougies LED uniquement ;
- petites pièces et décors hors de portée ;
- adaptation aux allergies et à l’âge ;
- installations stables et hors des zones de passage ;
- retrait des éléments papier avant consommation des aliments ;
- aucun support de voyage ne doit être présenté comme une vraie carte géographique.
