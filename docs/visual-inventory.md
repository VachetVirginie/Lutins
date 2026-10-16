# Inventaire des visuels — Mon aventure des lutins

Objectif : aucune fiche quotidienne ne doit afficher un visuel manquant sans solution. Chaque besoin visuel doit pointer vers un fichier prêt à afficher, à imprimer ou à personnaliser.

## Statuts

- `source-pdf` : visuel présent dans les annexes du kit et à extraire proprement.
- `created` : visuel à produire pour l’application à partir de la description de la fiche.
- `family-input` : élément qui doit venir de la famille, avec un modèle de remplacement fourni.
- `real-object` : objet physique à préparer ; aucun fichier n’est nécessaire, mais la fiche doit afficher une illustration ou une aide visuelle.

## Supports imprimables du kit

| Identifiant | Visuel | Journée(s) | Statut cible |
|---|---|---:|---|
| `travel-card-bag` | Carte du sac de voyage | 2 | source-pdf |
| `travel-card-polar` | Carte du départ du Pôle Nord | 3 | source-pdf |
| `coloring-elf` | Coloriage du lutin | 3 | source-pdf |
| `travel-card-mountains` | Carte des montagnes enneigées | 7 | source-pdf |
| `travel-card-monsters` | Carte des monstres gentils | 12 | source-pdf |
| `travel-card-meeting` | Carte de la rencontre des deux chemins | 13 | source-pdf |
| `travel-route` | Parcours imaginaire Pôle Nord → maison | 16 | source-pdf |
| `travel-card-paris` | Carte postale de Paris | 17 | source-pdf |
| `train-ticket` | Billet du train des lutins | 18 | source-pdf |
| `travel-card-station` | Carte de la gare de Lyon | 20 | source-pdf |
| `travel-card-lyon` | Carte postale de Lyon | 21 | source-pdf |
| `compass` | Boussole du voyageur | 6 | source-pdf |
| `paper-boat` | Gabarit du bateau en papier | 9 | source-pdf |
| `stars` | Étoiles à découper | 10 | source-pdf |
| `magic-key` | Clé magique à découper | 27 | source-pdf |
| `neighborhood-map` | Plan du quartier à personnaliser | 23 | family-input |
| `entrance-photo-frame` | Cadre pour photo de l’entrée | 25 | family-input |
| `footprints-stencil` | Pochoir des petites bottes | 28 | source-pdf |
| `funny-eyes` | Yeux à découper | 35 | source-pdf |
| `super-elf-badge` | Écusson Super-Lutin | 40 | source-pdf |
| `paper-fish` | Poissons à découper | 41 | source-pdf |
| `welcome-banner` | Banderole d’arrivée du second lutin | 46 | source-pdf |
| `cinema-tickets` | Tickets de cinéma | 49 | source-pdf |
| `race-start-finish` | Départ et arrivée de la course | 54 | source-pdf |
| `elf-portrait` | Portrait souvenir des lutins | 59, 61 | source-pdf |
| `happiness-list` | Liste des petits bonheurs | 62 | source-pdf |
| `christmas-cookie-recipe` | Recette des sablés | 66 | source-pdf |
| `santa-tray-labels` | Étiquettes verre et biscuit | 68 | source-pdf |
| `reusable-mail-labels` | Étiquettes du courrier magique | plusieurs | source-pdf |

## Visuels à créer ou à fournir pour les fiches

Les fiches décrivent parfois une image, mais le kit ne fournit pas nécessairement un fichier image indépendant. Ces besoins doivent être couverts dans la bibliothèque de l’application.

| Identifiant | Besoin | Journée(s) | Solution |
|---|---|---:|---|
| `journey-snowy-backpack` | Sac du lutin au pied d’un sapin enneigé | 2 | created |
| `journey-sleigh-landscape` | Paysages enneigés et traîneau | 3 | source-pdf ou created |
| `journey-mountains-photo` | Illustration ou photo des montagnes | 7 | created |
| `journey-france-route` | Carte de France avec trajet imaginaire | 16 | source-pdf |
| `journey-lyon-station` | Train arrivant en gare | 20 | created |
| `journey-lyon-landmark` | Carte postale lyonnaise / Fourvière | 21 | created |
| `arrival-sign` | Pancarte d’arrivée du premier lutin | 30 | created |
| `second-elf-portrait` | Photo ou portrait des deux peluches | 59, 61 | family-input + template |
| `entrance-photo` | Photo réelle de la porte, du portail ou du paillasson | 25 | family-input + template |

## Fiches reposant principalement sur une mise en scène physique

Ces journées n’ont pas besoin d’un support imprimé obligatoire, mais l’application doit proposer une illustration d’aide et une fiche de préparation claire.

- 4 : pause goûter ;
- 8 : chocolat chaud ;
- 11 : tempête de neige ;
- 14 : emporte-pièce ;
- 15 : bonbons ;
- 19 : biscuit ;
- 22 : traversée du Rhône ;
- 26 : paillasson ;
- 31 : momie ;
- 32 : tyrolienne ;
- 33 : lait bleu ;
- 34 : placard ;
- 36 : boîte à mouchoirs ;
- 37 : échange de lits ;
- 38 : luge ;
- 39 : bocal de gâteaux ;
- 40 : cape de super-héros ;
- 41 : pêche dans le lavabo ;
- 42 : lecture ;
- 43 : moustaches sur miroir ;
- 44 : tour de chaussures ;
- 47 : bataille de boules de neige ;
- 48 : céréales ;
- 50 : chaussures emballées ;
- 51 : pièces en chocolat ;
- 53 : chaise ligotée ;
- 55 : lutins fantômes ;
- 56 : empreintes de peinture ;
- 57 : sapin ;
- 58 : cabane de coussins ;
- 60 : départ du second lutin ;
- 61 : nostalgie du copain ;
- 63 : patinoire en farine ;
- 64 : chants de Noël ;
- 65 : doudou emballé ;
- 67 : chaussette de Noël ;
- 69 : repos sous le sapin ;
- 70 : lettre finale et disparition du lutin.

## Règles de production

1. Extraire les supports réellement présents dans le PDF sans les modifier.
2. Produire séparément les visuels décrits mais absents comme fichiers autonomes.
3. Ne jamais intégrer un prénom ou une ville dans un visuel générique.
4. Créer des variantes personnalisables pour les photos, plans et portraits.
5. Conserver une version imprimable et une version prévisualisable dans l’application.
6. Associer chaque fichier à une ou plusieurs journées par identifiant stable.
7. Afficher « À personnaliser » lorsqu’une photo ou une information familiale est requise.
8. Afficher une alternative lorsque le parent ne souhaite pas importer sa photo.
9. Vérifier les droits, la lisibilité et le contraste des supports avant publication.

## Critère de complétude

Une fiche est considérée comme prête uniquement si :

- son texte enfant existe ;
- sa préparation adulte existe ;
- son matériel est listé ;
- chaque support requis possède un fichier ou un modèle de remplacement ;
- chaque élément personnalisé est explicitement signalé ;
- aucun bouton « afficher », « imprimer » ou « télécharger » ne pointe vers une ressource absente.
