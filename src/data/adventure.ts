import { computed, reactive } from 'vue'
import { adventure } from './adventureStore'
import { dailySheets } from './dailySheets'

const DAY_MS = 86_400_000

/** Défauts du kit Louis — écrasés dès que le formulaire de l'expédition est rempli */
const DEFAULT_START = new Date(2026, 9, 17) // samedi 17 octobre 2026
const DEFAULT_END = new Date(2026, 11, 25) // 25 décembre 2026

const parseDate = (iso: string): Date | null => {
  const d = iso ? new Date(`${iso}T00:00:00`) : null
  return d && !Number.isNaN(+d) ? d : null
}

const todayAtZero = () => {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return t
}

const daysBetween = (from: Date, to: Date) => Math.round((to.getTime() - from.getTime()) / DAY_MS)

/** J1 : la date choisie par les parents, ou le samedi du kit par défaut */
export const adventureStart = computed(() => parseDate(adventure.date_debut) ?? DEFAULT_START)
/** Le dernier jour : la date de fin choisie, ou Noël */
export const christmasDay = computed(() => parseDate(adventure.date_fin) ?? DEFAULT_END)

/**
 * Durée réelle du trajet : la fenêtre complète fait 70 jours (17 oct → 25 déc).
 * Si l'aventure démarre avec moins de jours disponibles, le parcours
 * se compresse proportionnellement (jalons rééchelonnés).
 */
export const totalDays = computed(() =>
  Math.max(1, Math.min(70, daysBetween(adventureStart.value, christmasDay.value) + 1)),
)

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

const milestoneSource = [
  { day: 1, title: 'Alerte du Pôle Nord', detail: 'Le voyage commence par un courrier essentiel.', phase: 'voyage' },
  { day: 30, title: 'Arrivée du premier lutin', detail: 'La rencontre lance les farces quotidiennes.', phase: 'arrivee' },
  { day: 46, title: 'Arrivée du second lutin', detail: 'Un nouveau personnage rejoint l’aventure.', phase: 'farce' },
  { day: 60, title: 'Départ du second lutin', detail: 'Une transition importante dans le récit.', phase: 'depart' },
  { day: 70, title: 'Lettre finale du Père Noël', detail: 'La conclusion de l’aventure.', phase: 'conclusion' },
] as const

/** Jalons repositionnés sur la durée réelle — sans le second lutin si l'interrupteur est off */
export const journeyMilestones = computed(() => {
  const scale = totalDays.value / 70
  return milestoneSource
    .filter((m) => adventure.deuxieme_lutin || (m.day !== 46 && m.day !== 60))
    .map((m) => {
      const day = Math.max(1, Math.min(totalDays.value, Math.round(m.day * scale)))
      return { ...m, day, status: (day < currentDay.value ? 'done' : day === currentDay.value ? 'active' : 'upcoming') as 'done' | 'active' | 'upcoming' }
    })
})

/** Rétrocompatibilité : positions canoniques du récit (70 jours) */
export const narrativeMilestones = journeyMilestones

/**
 * Chapitre courant : le récit se lit en actes délimités par les jalons.
 * Sans second lutin, les jalons J46/J60 n'existent pas et le chapitre III est sauté.
 */
const CHAPTERS = [
  { roman: 'I', label: 'Le voyage', heroA: 'Le voyage', heroEm: 'commence.', tagline: 'Le premier chapitre s’ouvre aujourd’hui.' },
  { roman: 'II', label: 'Un lutin parmi vous', heroA: 'Le lutin', heroEm: 'est arrivé.', tagline: 'Un nouvel habitant veille sur la maison.' },
  { roman: 'III', label: 'Les deux lutins', heroA: 'Deux lutins', heroEm: 'en farce.', tagline: 'Deux complices en embuscade.' },
  { roman: 'IV', label: 'Le dernier voyage', heroA: 'Le dernier', heroEm: 'voyage.', tagline: 'Les adieux se préparent en douceur.' },
  { roman: 'V', label: 'La lettre du Père Noël', heroA: 'Noël', heroEm: 'est là.', tagline: 'Le dernier chapitre s’écrit à Noël.' },
] as const

const chapterIndex = computed(() =>
  journeyMilestones.value.reduce((idx, m, i) => (currentDay.value >= m.day ? i : idx), 0),
)

/**
 * Vue courante de l'aventure : objet réactif à getters —
 * les consommateurs lisent `currentAdventure.currentDay` comme avant,
 * mais la valeur suit désormais les réglages de l'expédition en direct.
 */
export const currentAdventure = reactive({
  get currentDay() {
    return currentDay.value
  },
  get totalDays() {
    return totalDays.value
  },
  get chapter() {
    return CHAPTERS[Math.min(chapterIndex.value, CHAPTERS.length - 1)]
  },
  currentPhase: 'voyage' as const,
  get currentTitle() {
    return dailySheets[currentDay.value]?.title ?? 'Alerte du Pôle Nord'
  },
  currentCategory: 'courrier' as const,
  currentImportance: 'essential' as const,
  get currentDescription() {
    return journeyMilestones.value.find((m) => m.status === 'active')?.detail ?? 'Un premier courrier donne le signal du départ.'
  },
})
