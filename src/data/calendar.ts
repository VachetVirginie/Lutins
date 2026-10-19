import { computed } from 'vue'
import { adventure } from './adventureStore'

export const DAY_MS = 86_400_000

/** Défauts du kit Louis — écrasés dès que le formulaire de l'expédition est rempli */
export const DEFAULT_START = new Date(2026, 9, 17) // samedi 17 octobre 2026
export const DEFAULT_END = new Date(2026, 11, 25) // 25 décembre 2026
const DEFAULT_ARRIVAL_DAY = 29 // le lutin frappe à la porte en fin de voyage

export const parseDate = (iso: string): Date | null => {
  const d = iso ? new Date(`${iso}T00:00:00`) : null
  return d && !Number.isNaN(+d) ? d : null
}

export const todayAtZero = () => {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return t
}

export const daysBetween = (from: Date, to: Date) => Math.round((to.getTime() - from.getTime()) / DAY_MS)

/** J1 : la date choisie par les parents, ou le samedi du kit par défaut */
export const adventureStart = computed(() => parseDate(adventure.date_debut) ?? DEFAULT_START)
/** Le dernier jour : la date de fin choisie, ou Noël */
export const christmasDay = computed(() => parseDate(adventure.date_fin) ?? DEFAULT_END)

/** Durée réelle : plafonnée à 70 jours (le récit en compte 70) */
export const totalDays = computed(() =>
  Math.max(1, Math.min(70, daysBetween(adventureStart.value, christmasDay.value) + 1)),
)

/**
 * Le jour où le lutin frappe à la porte : la date d'arrivée saisie dans le
 * formulaire, sinon J29. Toujours dans [2, totalDays-2] pour laisser au moins
 * la veille et la finale respirer.
 */
export const arrivalDay = computed(() => {
  const parsed = parseDate(adventure.arrivee_lutin)
  if (parsed) {
    return Math.max(2, Math.min(totalDays.value - 2, daysBetween(adventureStart.value, parsed) + 1))
  }
  return Math.max(2, Math.min(DEFAULT_ARRIVAL_DAY, totalDays.value - 2))
})

/** Jours qu'il reste à vivre, aujourd'hui inclus (0 après le dernier jour) */
export const remainingDays = computed(() =>
  Math.max(0, Math.min(totalDays.value, daysBetween(todayAtZero(), christmasDay.value) + 1)),
)

/** Jour courant calculé depuis la date réelle — 1 avant le départ, plafonné à totalDays */
export const currentDay = computed(() =>
  Math.max(1, Math.min(totalDays.value, totalDays.value - remainingDays.value + 1)),
)

export const hasStarted = computed(() => daysBetween(adventureStart.value, todayAtZero()) >= 0)
export const isOver = computed(() => remainingDays.value === 0)
