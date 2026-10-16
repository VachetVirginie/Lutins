import { dailySheets } from './dailySheets'

export interface ContentGap {
  day: number
  category: 'visual'
  title: string
  detail: string
}

/**
 * Inventaire de production pour les éléments qui ne sont pas encore des
 * visuels de scène dans l'application. Les annexes imprimables du kit sont
 * déjà référencées dans chaque fiche ; ce fichier ne les duplique pas.
 */
export const contentGaps: ContentGap[] = Object.values(dailySheets)
  .filter((sheet) => sheet.assets.length === 0)
  .map((sheet) => ({
    day: sheet.day,
    category: 'visual',
    title: `Visuel de scène pour J${sheet.day}`,
    detail: `Créer une image premium cohérente avec « ${sheet.title} ». Le kit fournit déjà le texte et la préparation adulte.`,
  }))

export const contentGapByDay = Object.fromEntries(contentGaps.map((gap) => [gap.day, gap])) as Record<number, ContentGap>
