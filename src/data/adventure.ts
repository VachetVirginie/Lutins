export const currentAdventure = {
  currentDay: 1,
  totalDays: 70,
  currentPhase: 'voyage' as const,
  currentTitle: 'Alerte du Pôle Nord',
  currentCategory: 'courrier' as const,
  currentImportance: 'essential' as const,
  currentDescription: 'Un premier courrier donne le signal du départ.',
}

export const narrativeMilestones = [
  { day: 1, title: 'Alerte du Pôle Nord', detail: 'Le voyage commence par un courrier essentiel.', phase: 'voyage', status: 'active' },
  { day: 30, title: 'Arrivée du premier lutin', detail: 'La rencontre lance les farces quotidiennes.', phase: 'arrivee', status: 'upcoming' },
  { day: 46, title: 'Arrivée du second lutin', detail: 'Un nouveau personnage rejoint l’aventure.', phase: 'farce', status: 'upcoming' },
  { day: 60, title: 'Départ du second lutin', detail: 'Une transition importante dans le récit.', phase: 'depart', status: 'upcoming' },
  { day: 70, title: 'Lettre finale du Père Noël', detail: 'La conclusion de l’aventure.', phase: 'conclusion', status: 'upcoming' },
] as const

export const upcomingJourneyActivities = [
  { id: 'jour-1-alerte-pole-nord', day: 'J1', title: 'Alerte du Pôle Nord', detail: 'Courrier essentiel · aujourd’hui' },
  { id: 'jour-2-preparation-sac', day: 'J2', title: 'Préparation du sac', detail: 'Carte et petit élément de voyage' },
  { id: 'jour-3-depart-traineau', day: 'J3', title: 'Départ en traîneau', detail: 'Carte et coloriage' },
  { id: 'jour-4-pause-gouter', day: 'J4', title: 'Première pause goûter', detail: 'Courrier' },
] as const

export type PreparationKind = 'print' | 'buy' | 'gather'

/**
 * Source unique de la préparation à court terme.
 * Une ligne correspond à quelque chose que le parent peut réellement préparer,
 * pas à une activité entière. Les jours 5 à 7 n'ont actuellement aucun besoin
 * matériel documenté : ils ne sont donc pas artificiellement remplis.
 */
export const preparationNext7Days = [
  { id: 'j1-courrier', day: 'J1', due: "Aujourd’hui", title: 'Courrier du Pôle Nord', kind: 'print', activityId: 'jour-1-alerte-pole-nord' as const },
  { id: 'j1-enveloppe', day: 'J1', due: "Aujourd’hui", title: 'Enveloppe', kind: 'gather', activityId: 'jour-1-alerte-pole-nord' as const },
  { id: 'j1-cachet', day: 'J1', due: "Aujourd’hui", title: 'Cachet ou autocollant doré', kind: 'gather', activityId: 'jour-1-alerte-pole-nord' as const },
  { id: 'j2-carte', day: 'J2', due: 'Demain', title: 'Carte du voyage', kind: 'print', activityId: 'jour-2-preparation-sac' as const },
  { id: 'j2-indice', day: 'J2', due: 'Demain', title: 'Bouton ou fil doré', kind: 'gather', activityId: 'jour-2-preparation-sac' as const },
  { id: 'j3-suivi', day: 'J3', due: 'Dans 2 jours', title: 'Carte de suivi', kind: 'print', activityId: 'jour-3-depart-traineau' as const },
  { id: 'j3-coloriage', day: 'J3', due: 'Dans 2 jours', title: 'Coloriage du traîneau', kind: 'print', activityId: 'jour-3-depart-traineau' as const },
  { id: 'j3-crayons', day: 'J3', due: 'Dans 2 jours', title: 'Crayons de couleur', kind: 'gather', activityId: 'jour-3-depart-traineau' as const },
  { id: 'j4-mot', day: 'J4', due: 'Dans 3 jours', title: 'Mot du lutin', kind: 'print', activityId: 'jour-4-pause-gouter' as const },
  { id: 'j4-enveloppe', day: 'J4', due: 'Dans 3 jours', title: 'Enveloppe', kind: 'gather', activityId: 'jour-4-pause-gouter' as const },
] as const
