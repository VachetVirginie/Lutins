// Les visuels sont ordonnés par nom de fichier : le premier illustre J1,
// le deuxième J2, etc. — la date dans le nom n'est qu'un libellé, le
// calendrier réel reste paramétrable depuis le formulaire.
const files = import.meta.glob('../assets/visuels/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const ordered = Object.keys(files)
  .sort()
  .map((path) => files[path])

/** Le visuel de la dépêche J{n} — undefined s'il n'y en a pas (encore) */
export function visualForDay(day: number): string | undefined {
  return ordered[day - 1]
}
