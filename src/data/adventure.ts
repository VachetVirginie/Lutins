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
