// Chaque fichier illustre une dépêche :
// - `jour-XX.webp` → explicitement le jour XX (recommandé pour les farces)
// - tout autre nom → comble les jours restants dans l'ordre alphabétique
const files = import.meta.glob('../assets/visuels/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const byDay = new Map<number, string>()
const unassigned: string[] = []

for (const [path, url] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
  const match = /jour-?(\d+)/i.exec(path)
  if (match) byDay.set(Number(match[1]), url)
  else unassigned.push(url)
}

for (let day = 1; day <= 70 && unassigned.length; day++) {
  if (!byDay.has(day)) byDay.set(day, unassigned.shift()!)
}

/** Le visuel de la dépêche J{n} — undefined s'il n'y en a pas (encore) */
export function visualForDay(day: number): string | undefined {
  return byDay.get(day)
}
