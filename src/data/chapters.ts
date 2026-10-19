/**
 * Le récit en actes — registre unique des phases de l'aventure.
 * Chaque phase porte son libellé (home, planning, atlas), l'icône du
 * jalon mobile, la gravure de la carte postale et le paysage desktop.
 */
export interface PhaseMeta {
  label: string
  icon: string
  visual: string
  scene: string
}

export const PHASES: Record<string, PhaseMeta> = {
  voyage: {
    label: 'Le voyage',
    icon: 'mdi-mailbox-open-outline',
    visual: '/assets/visuels/planning/01-voyage.png',
    scene: '/assets/created/scene-foret.jpg',
  },
  arrivee: {
    label: 'Un lutin parmi vous',
    icon: 'mdi-door-open',
    visual: '/assets/visuels/planning/02-arrivee.png',
    scene: '/assets/created/scene-voyage.jpg',
  },
  farce: {
    label: 'Les deux lutins',
    icon: 'mdi-emoticon-wink-outline',
    visual: '/assets/visuels/planning/03-farces.png',
    scene: '/assets/created/scene-village.jpg',
  },
  depart: {
    label: 'Le dernier voyage',
    icon: 'mdi-exit-to-app',
    visual: '/assets/visuels/planning/04-depart.png',
    scene: '/assets/created/scene-lyon.jpg',
  },
  conclusion: {
    label: 'La lettre du Père Noël',
    icon: 'mdi-ornament',
    visual: '/assets/visuels/planning/05-conclusion.png',
    scene: '/assets/created/scene-lyon.jpg',
  },
}

export const ROMANS = ['I', 'II', 'III', 'IV', 'V'] as const
