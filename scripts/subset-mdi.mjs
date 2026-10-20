import { readFileSync, writeFileSync } from 'node:fs'
import subsetFont from 'subset-font'

const css = readFileSync('src/styles/mdi.css', 'utf8')
const pts = [...new Set([...css.matchAll(/content:.\\F([0-9A-F]+)/g)].map(m => String.fromCodePoint(parseInt('F' + m[1], 16))))].join('')
const src = readFileSync('src/assets/fonts/materialdesignicons-webfont.woff2')
const out = await subsetFont(src, pts, { targetFormat: 'woff2' })
writeFileSync('src/assets/fonts/materialdesignicons-webfont.woff2', out)
console.log(`glyphs: ${pts.length} chars, ${src.length} -> ${out.length} bytes`)
