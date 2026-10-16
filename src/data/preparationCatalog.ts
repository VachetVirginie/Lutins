import { dailySheets } from './dailySheets'

export type PreparationCategory = 'print' | 'food' | 'gift' | 'material'

export interface PreparationCatalogItem {
  id: string
  day: number
  title: string
  detail: string
  category: PreparationCategory
  activityId: string
}

const foodWords = /pain d'épices|biscuit|chocolat|marshmallow|bonbon|céréale|collation|lait|ingrédient/i

function activityId(day: number): string {
  const aliases: Record<number, string> = {
    1: 'jour-1-alerte-pole-nord',
    2: 'jour-2-preparation-sac',
    3: 'jour-3-depart-traineau',
    4: 'jour-4-pause-gouter',
  }
  return aliases[day] ?? `jour-${day}`
}

// Découpe la consigne adulte en éléments cochables séparément :
// - phrases séparées par . ! ? ; ou retour à la ligne
// - puis sur les virgules suivies d'un segment d'action (entouré, placé, avec, puis…)
const ACTION_SEGMENT = /^(entour|plac|pos[ée]|accompagn|dispos|à côté|au pied|au bord|avec|puis|et |dans |sur |sous |devant|derrière|autour|près|fixer|accroch|glisser|cacher|ajouter|prévoir|imprimer|préparer|suspendre|déposer)/i

function splitSetup(text: string): string[] {
  const segments: string[] = []
  for (const sentence of text.split(/[.!?]+\s*|\n+|;\s*/)) {
    let buffer = ''
    for (const part of sentence.split(/,\s*/)) {
      if (buffer && ACTION_SEGMENT.test(part)) {
        segments.push(buffer)
        buffer = part
      } else {
        buffer = buffer ? `${buffer}, ${part}` : part
      }
    }
    if (buffer) segments.push(buffer)
  }
  return [...new Set(segments
    .map((s) => s.replace(/^à joindre\s*:?\s*/i, '').replace(/^à\s+/i, '').replace(/\.$/, '').trim())
    .map((s) => {
      const open = (s.match(/\(/g) ?? []).length
      const close = (s.match(/\)/g) ?? []).length
      if (close > open) s = s.replace(/\)+$/, '')
      if (open > close) s += ')'
      return s
    })
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .filter((s) => s.length > 4))]
}

export const preparationCatalog: PreparationCatalogItem[] = Object.values(dailySheets).flatMap((sheet) => [
  ...sheet.assets.map((asset) => ({
    id: `j${sheet.day}-print-${asset.page}`,
    day: sheet.day,
    title: asset.label,
    detail: `Annexe du kit · page ${asset.page}`,
    category: 'print' as const,
    activityId: activityId(sheet.day),
  })),
  ...sheet.gifts.map((gift, index) => ({
    id: `j${sheet.day}-gift-${index}`,
    day: sheet.day,
    title: gift,
    detail: 'À prévoir pour la surprise du jour',
    category: foodWords.test(gift) ? 'food' as const : 'gift' as const,
    activityId: activityId(sheet.day),
  })),
  ...splitSetup(sheet.adultPreparation).map((step, index) => ({
    id: `j${sheet.day}-setup-${index}`,
    day: sheet.day,
    title: step,
    detail: `Mise en place · ${sheet.title}`,
    category: 'material' as const,
    activityId: activityId(sheet.day),
  })),
])
