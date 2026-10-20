/**
 * Convertit les illustrations lourdes en WebP et retire les sources.
 * Les PNG/JPG de public/ sont copiés tels quels dans dist/ : tout ce qui
 * reste en lourd y part en production — le script supprime donc l'original.
 *
 *   node scripts/optimize-images.mjs          → convertit tout ce qui manque
 *   node scripts/optimize-images.mjs --keep   → garde les sources originales
 *
 * Les fichiers déjà en .webp et les exclusions ci-dessous sont ignorés.
 */
import { readdir, stat, unlink } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const KEEP = process.argv.includes('--keep')

/** [dossier relatif, qualité webp] — parcours non récursif */
const TARGETS = [
  ['src/assets/visuels', 78],
  ['public/assets/created', 80],
  ['public/assets/visuels/planning', 80],
  ['public/assets/landscapes', 80],
  ['public/assets/printables', 88],
  ['public/assets/imgs', 88],
]

/** Fichiers qui doivent rester en PNG (manifest PWA, icônes…) */
const EXCLUDE = new Set(['public/icons'])

const toWebp = async (file, quality) => {
  const out = file.replace(/\.(jpe?g|png)$/i, '.webp')
  try {
    await stat(out)
    return null // déjà converti
  } catch { /* la cible n'existe pas encore */ }
  const input = await stat(file)
  await sharp(file).webp({ quality }).toFile(out)
  const output = await stat(out)
  if (!KEEP) await unlink(file)
  return { file: basename(file), from: input.size, to: output.size }
}

const results = []
for (const [dir, quality] of TARGETS) {
  const abs = join(ROOT, dir)
  let names = []
  try {
    names = await readdir(abs)
  } catch {
    continue
  }
  for (const name of names) {
    const rel = `${dir}/${name}`
    if ([...EXCLUDE].some((ex) => rel.startsWith(ex))) continue
    if (!/\.(jpe?g|png)$/i.test(name)) continue
    const done = await toWebp(join(abs, name), quality)
    if (done) results.push(done)
  }
}

const before = results.reduce((n, r) => n + r.from, 0)
const after = results.reduce((n, r) => n + r.to, 0)
for (const r of results) {
  console.log(`${r.file.padEnd(34)} ${(r.from / 1024).toFixed(0).padStart(5)} kB → ${(r.to / 1024).toFixed(0).padStart(4)} kB`)
}
console.log(`\n${results.length} fichiers — ${(before / 1e6).toFixed(1)} Mo → ${(after / 1e6).toFixed(1)} Mo (-${Math.round(100 - (after / before) * 100)} %)`)
