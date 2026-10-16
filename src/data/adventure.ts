import { dailySheets } from './dailySheets'

const DAY_MS = 86_400_000

/** J1 : samedi 17 octobre 2026 — le premier courrier arrive */
export const adventureStart = new Date(2026, 9, 17)
/** J70 : 25 décembre 2026 — la lettre finale du Père Noël */
export const christmasDay = new Date(2026, 11, 25)

const today = new Date()
today.setHours(0, 0, 0, 0)

const daysBetween = (from: Date, to: Date) => Math.round((to.getTime() - from.getTime()) / DAY_MS)

/**
 * Durée réelle du trajet : la fenêtre complète fait 70 jours (17 oct → 25 déc).
 * Si l'aventure démarre avec moins de jours disponibles avant Noël, le parcours
 * se compresse proportionnellement (jalons rééchelonnés, cf. journeyMilestones).
 */
export const totalDays = Math.max(1, Math.min(70, daysBetween(adventureStart, christmasDay) + 1))

/** Jours qu'il reste à vivre, aujourd'hui inclus (0 après Noël) */
export const remainingDays = Math.max(0, Math.min(totalDays, daysBetween(today, christmasDay) + 1))

/** Jour courant calculé depuis la date réelle — 1 avant le départ, plafonné à totalDays */
export const currentDay = Math.max(1, Math.min(totalDays, totalDays - remainingDays + 1))

export const hasStarted = daysBetween(adventureStart, today) >= 0
export const isOver = remainingDays === 0

/** Le trajet s'adapte au nombre de jours réellement disponibles avant Noël */
const milestoneScale = totalDays / 70

const milestoneSource = [
  { day: 1, title: 'Alerte du Pôle Nord', detail: 'Le voyage commence par un courrier essentiel.', phase: 'voyage' },
  { day: 30, title: 'Arrivée du premier lutin', detail: 'La rencontre lance les farces quotidiennes.', phase: 'arrivee' },
  { day: 46, title: 'Arrivée du second lutin', detail: 'Un nouveau personnage rejoint l’aventure.', phase: 'farce' },
  { day: 60, title: 'Départ du second lutin', detail: 'Une transition importante dans le récit.', phase: 'depart' },
  { day: 70, title: 'Lettre finale du Père Noël', detail: 'La conclusion de l’aventure.', phase: 'conclusion' },
] as const

/** Jalons repositionnés sur la durée réelle, avec statut passé/actuel/futur */
export const journeyMilestones = milestoneSource.map((m) => {
  const day = Math.max(1, Math.min(totalDays, Math.round(m.day * milestoneScale)))
  return { ...m, day, status: (day < currentDay ? 'done' : day === currentDay ? 'active' : 'upcoming') as 'done' | 'active' | 'upcoming' }
})

/** Rétrocompatibilité : positions canoniques du récit (70 jours) */
export const narrativeMilestones = journeyMilestones

export const currentAdventure = {
  currentDay,
  totalDays,
  currentPhase: 'voyage' as const,
  currentTitle: dailySheets[currentDay]?.title ?? 'Alerte du Pôle Nord',
  currentCategory: 'courrier' as const,
  currentImportance: 'essential' as const,
  currentDescription: journeyMilestones.find((m) => m.status === 'active')?.detail ?? 'Un premier courrier donne le signal du départ.',
}


