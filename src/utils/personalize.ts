import { adventureStart } from '../data/adventure'
import { adventure } from '../data/adventureStore'
import type { DailySheet } from '../data/dailySheets'

const swap = (text: string, from: string, to: string) => text.split(from).join(to)

/**
 * Interpole les réglages de l'expédition dans les textes du kit :
 * prénoms des enfants, ville, nom(s) des lutins, singulier/pluriel.
 * Les phrases les plus longues sont remplacées en premier.
 */
export function personalize(text: string): string {
  let out = text
  const kids = adventure.prenoms_enfants.filter(Boolean)
  const elf1 = adventure.nom_lutin.trim()
  const elf2 = adventure.nom_second_lutin.trim()
  const duo = adventure.deuxieme_lutin && elf1 && elf2 ? `${elf1} et ${elf2}` : ''

  out = duo
    ? swap(
        swap(swap(swap(swap(out, 'les deux lutins', duo), 'Les deux lutins', duo), 'mes deux lutins', duo), 'Mes deux lutins', duo),
        'le lutin de Nîmes',
        elf2,
      )
    : swap(
        swap(swap(swap(out, 'les deux lutins', 'le lutin'), 'Les deux lutins', 'Le lutin'), 'mes deux lutins', 'mon lutin'),
        'Mes deux lutins',
        'Mon lutin',
      )

  if (elf1) {
    out = swap(swap(swap(swap(out, 'du lutin', `de ${elf1}`), 'Du lutin', `De ${elf1}`), 'le lutin', elf1), 'Le lutin', elf1)
  }

  if (kids.length) out = swap(out, 'Louis', kids.join(' et '))
  if (adventure.ville.trim()) out = swap(out, 'Lyon', adventure.ville.trim())
  return out
}

const DAY_MS = 86_400_000
const dateFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/** La date d'en-tête recalculée : J{n} = date_debut + n-1 */
export function sheetDateLabel(day: number): string {
  return dateFmt.format(new Date(adventureStart.value.getTime() + (day - 1) * DAY_MS)).toUpperCase()
}

/** Une fiche du jour personnalisée : date recalculée + tous les textes interpolés */
export function personalizeSheet(sheet: DailySheet): DailySheet {
  return {
    ...sheet,
    date: sheetDateLabel(sheet.day),
    title: personalize(sheet.title),
    adultPreparation: personalize(sheet.adultPreparation),
    message: personalize(sheet.message),
  }
}
