---
name: vue-vuetify-lutins
description: Implémenter ou refactorer les fonctionnalités du planning des lutins en Vue 3 et TypeScript, avec une architecture modulaire, testable et légère.
---
# Développement Vue 3 — Mon aventure des lutins

Utiliser Vue 3 Composition API et TypeScript. Typer les états métier (`DayStatus`, journée, checklist), garder les vues minces et séparer contenu d’exemple, configuration familiale, progression et médias. Rendre les mutations explicites et persistantes ; éviter effets de bord dans les templates et watchers non nettoyés. Ne pas ajouter dépendance ou store global sans besoin démontré. Vérifier `pnpm build` après changement significatif.

```ts
type DayStatus = 'a-preparer' | 'prete' | 'realisee' | 'passee-volontairement'
```

Références : [Vue TypeScript](https://vuejs.org/guide/typescript/overview.html), [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html).
