import { dailySheets } from './dailySheets'

export type ContentGapType = 'visual-scene' | 'printable-support' | 'material-breakdown' | 'personalization'
export type ContentGapPriority = 'high' | 'medium' | 'low'

export interface ContentGap {
  id: string
  day: number
  type: ContentGapType
  priority: ContentGapPriority
  title: string
  detail: string
  expectedOutput: string
}

/**
 * Inventaire de production éditoriale pour l'application.
 *
 * Ce fichier ne signale pas les annexes déjà présentes dans le kit : elles
 * sont référencées dans dailySheets.ts et affichées directement dans la fiche.
 * Il signale uniquement ce qu'il faut encore produire ou structurer pour que
 * chaque journée soit réellement autonome dans l'application.
 */
const gaps: ContentGap[] = []

for (const sheet of Object.values(dailySheets)) {
  if (!sheet.assets.length) {
    gaps.push({
      id: `j${sheet.day}-visual-scene`,
      day: sheet.day,
      type: 'visual-scene',
      priority: 'medium',
      title: `Illustration de scène pour J${sheet.day}`,
      detail: `Créer une scène premium pour cette journée. Le texte et la préparation adulte sont prêts, mais aucune image dédiée n'est liée à ce jour.`,
      expectedOutput: 'Une image mobile verticale optimisée pour la dépêche du jour.',
    })
  }

  gaps.push({
    id: `j${sheet.day}-printable-support`,
    day: sheet.day,
    type: 'printable-support',
    priority: sheet.day <= 7 ? 'high' : 'low',
    title: `Support imprimable isolé pour J${sheet.day}`,
    detail: `Le texte de « ${sheet.title} » est disponible dans le kit, mais la fiche ne propose pas encore un fichier imprimable directement exploitable.`,
    expectedOutput: 'Un PDF ou une vue imprimable du mot du jour, sans devoir ouvrir le kit complet.',
  })

  gaps.push({
    id: `j${sheet.day}-material-breakdown`,
    day: sheet.day,
    type: 'material-breakdown',
    priority: sheet.day <= 7 ? 'high' : 'medium',
    title: `Matériel détaillé pour J${sheet.day}`,
    detail: `La préparation adulte de « ${sheet.title} » est encore stockée comme un paragraphe unique.`,
    expectedOutput: 'Une liste d’éléments unitaires à cocher : matériel, aliment, cadeau, décor et précaution.',
  })
}

// Informations qui nécessitent une donnée fournie par la famille, et non une
// création graphique ou éditoriale de notre part.
gaps.push(
  {
    id: 'j23-personalisation-quartier',
    day: 23,
    type: 'personalization',
    priority: 'medium',
    title: 'Nom du quartier pour J23',
    detail: 'Le plan du pigeon lyonnais doit être personnalisé avec le nom du quartier et une flèche.',
    expectedOutput: 'Un champ de personnalisation et un export du plan complété.',
  },
  {
    id: 'j25-photo-entree',
    day: 25,
    type: 'personalization',
    priority: 'medium',
    title: 'Photo de l’entrée pour J25',
    detail: 'La fiche demande une photo du portail, de la porte ou du paillasson de la famille.',
    expectedOutput: 'Un emplacement de photo et une version imprimable du cadre.',
  },
  {
    id: 'j59-61-photo-lutins',
    day: 59,
    type: 'personalization',
    priority: 'low',
    title: 'Photo souvenir des lutins pour J59/J61',
    detail: 'Le kit prévoit une photo des peluches ou l’annexe portrait, au choix de la famille.',
    expectedOutput: 'Un choix entre importer une photo et utiliser le portrait du kit.',
  },
)

export const contentGaps = gaps
export const contentGapByDay = Object.fromEntries(
  gaps.filter((gap) => gap.type === 'visual-scene').map((gap) => [gap.day, gap]),
) as Record<number, ContentGap>

export const contentGapSummary = {
  total: contentGaps.length,
  byType: {
    visualScene: contentGaps.filter((gap) => gap.type === 'visual-scene').length,
    printableSupport: contentGaps.filter((gap) => gap.type === 'printable-support').length,
    materialBreakdown: contentGaps.filter((gap) => gap.type === 'material-breakdown').length,
    personalization: contentGaps.filter((gap) => gap.type === 'personalization').length,
  },
  coveredByKit: {
    dailyTexts: Object.keys(dailySheets).length,
    printableAnnexes: Object.values(dailySheets).reduce((count, sheet) => count + sheet.assets.length, 0),
  },
}
