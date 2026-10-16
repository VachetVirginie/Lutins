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
  {
    id: `j${sheet.day}-setup`,
    day: sheet.day,
    title: sheet.title,
    detail: sheet.adultPreparation,
    category: 'material' as const,
    activityId: activityId(sheet.day),
  },
])
