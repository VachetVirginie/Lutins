---
name: accessibilite-rgaa-lutins
description: Auditer et corriger l’accessibilité RGAA 4.1 de l’application de planning des lutins, notamment clavier, formulaires, statuts, contrastes et responsive.
---
# Accessibilité RGAA — Mon aventure des lutins

Vérifier titres/régions, lien d’évitement, focus visible, clavier et ordre de tabulation. Donner un nom accessible à tout contrôle et relier les erreurs aux champs. Exprimer les statuts “À préparer”, “Prête”, “Réalisée” et “Passée volontairement” par texte, jamais par couleur seule. Annoncer les confirmations via `aria-live` avec parcimonie. Préférer HTML natif (`button`, `label`, `fieldset`, `main`) à ARIA de compensation. Vérifier contrastes, zoom/reflow, cibles tactiles et mobile.

Chaque audit doit citer le critère RGAA, la non-conformité, la correction et le test de vérification. Références : [RGAA](https://accessibilite.numerique.gouv.fr/rgaa/criteres/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
