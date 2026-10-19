import { computed, reactive } from 'vue'
import { adventure } from './adventureStore'
import { PHASES } from './chapters'
import { sheetForDay } from './farces'
import {
  arrivalDay,
  currentDay,
  daysBetween,
  hasStarted,
  isOver,
  remainingDays,
  todayAtZero,
  totalDays,
  adventureStart,
  christmasDay,
  parseDate,
  DAY_MS,
} from './calendar'

// Rétrocompatibilité des exports historiques
export {
  arrivalDay,
  adventureStart,
  christmasDay,
  currentDay,
  daysBetween,
  hasStarted,
  isOver,
  parseDate,
  remainingDays,
  todayAtZero,
  totalDays,
  DAY_MS,
}

/**
 * Jalons ancrés au récit réel : l'arrivée est paramétrable, le second lutin
 * suit à +16 jours et repart à +30 (fenêtre duo de 15 jours).
 */
export const journeyMilestones = computed(() => {
  const total = totalDays.value
  const arrival = arrivalDay.value
  const source = [
    { day: 1, title: 'Alerte du Pôle Nord', detail: 'Le voyage commence par un courrier essentiel.', phase: 'voyage' },
    { day: arrival, title: 'Arrivée du premier lutin', detail: 'La rencontre lance les farces quotidiennes.', phase: 'arrivee' },
    { day: arrival + 16, title: 'Arrivée du second lutin', detail: 'Un nouveau personnage rejoint l’aventure.', phase: 'farce' },
    { day: arrival + 30, title: 'Départ du second lutin', detail: 'Une transition importante dans le récit.', phase: 'depart' },
    { day: total, title: 'Lettre finale du Père Noël', detail: 'La conclusion de l’aventure.', phase: 'conclusion' },
  ]
  return source
    .filter((m) => (adventure.deuxieme_lutin || (m.phase !== 'farce' && m.phase !== 'depart')) && m.day <= total)
    .map((m) => ({
      ...m,
      status: (m.day < currentDay.value ? 'done' : m.day === currentDay.value ? 'active' : 'upcoming') as 'done' | 'active' | 'upcoming',
    }))
})

/** Rétrocompatibilité : positions canoniques du récit (70 jours) */
export const narrativeMilestones = journeyMilestones

/**
 * Chapitre courant : le récit se lit en actes délimités par les jalons.
 * Sans second lutin, les jalons J46/J60 n'existent pas et le chapitre III est sauté.
 */
const CHAPTERS = [
  { roman: 'I', label: PHASES.voyage.label, heroA: 'Le voyage', heroEm: 'commence.', tagline: 'Le premier chapitre s’ouvre aujourd’hui.' },
  { roman: 'II', label: PHASES.arrivee.label, heroA: 'Le lutin', heroEm: 'est arrivé.', tagline: 'Un nouvel habitant veille sur la maison.' },
  { roman: 'III', label: PHASES.farce.label, heroA: 'Deux lutins', heroEm: 'en farce.', tagline: 'Deux complices en embuscade.' },
  { roman: 'IV', label: PHASES.depart.label, heroA: 'Le dernier', heroEm: 'voyage.', tagline: 'Les adieux se préparent en douceur.' },
  { roman: 'V', label: PHASES.conclusion.label, heroA: 'Noël', heroEm: 'est là.', tagline: 'Le dernier chapitre s’écrit à Noël.' },
] as const

/** Le chapitre suit la phase du jalon courant — pas sa position dans la liste */
const PHASE_CHAPTER: Record<string, number> = { voyage: 0, arrivee: 1, farce: 2, depart: 3, conclusion: 4 }

const chapterIndex = computed(() => {
  const active = [...journeyMilestones.value].reverse().find((m) => currentDay.value >= m.day)
  return active ? (PHASE_CHAPTER[active.phase] ?? 0) : 0
})

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
    return sheetForDay(currentDay.value)?.title ?? 'Alerte du Pôle Nord'
  },
  currentCategory: 'courrier' as const,
  currentImportance: 'essential' as const,
  get currentDescription() {
    return journeyMilestones.value.find((m) => m.status === 'active')?.detail ?? 'Un premier courrier donne le signal du départ.'
  },
})
