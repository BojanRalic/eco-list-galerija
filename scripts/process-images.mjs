import sharp from 'sharp'
import { readdir, writeFile } from 'fs/promises'
import { join } from 'path'

const SRC_DIR = 'public/images/jpg'
const OUT_DIR = 'public/images'
const LOGO_PATH = 'public/images/logo.png'
const MAX_DIM = 1980
const QUALITY = 80
const MAX_BYTES = 1_000_000
const LOGO_WIDTH = 180
const MARGIN = 30

const logoBuffer = await sharp(LOGO_PATH).resize(LOGO_WIDTH).toBuffer()
const logoMeta = await sharp(logoBuffer).metadata()

const files = (await readdir(SRC_DIR))
  .filter(f => /\.(jpg|jpeg)$/i.test(f))
  .sort()

const entries = []

for (let i = 0; i < files.length; i++) {
  const num = String(i + 1).padStart(2, '0')
  const outName = `eco-${num}.webp`
  const outPath = join(OUT_DIR, outName)
  const srcPath = join(SRC_DIR, files[i])

  const meta = await sharp(srcPath).metadata()
  const isLandscape = meta.width >= meta.height
  const resizeOpts = isLandscape
    ? { width: MAX_DIM, withoutEnlargement: true }
    : { height: MAX_DIM, withoutEnlargement: true }

  const resizedBuf = await sharp(srcPath).resize(resizeOpts).toBuffer()
  const resizedMeta = await sharp(resizedBuf).metadata()
  const rw = resizedMeta.width
  const rh = resizedMeta.height

  const left = rw - logoMeta.width - MARGIN
  const top = rh - logoMeta.height - MARGIN

  let quality = QUALITY
  let output

  while (quality >= 50) {
    output = await sharp(resizedBuf)
      .composite([{ input: logoBuffer, left, top, blend: 'over' }])
      .webp({ quality })
      .toBuffer()

    if (output.length <= MAX_BYTES) break
    quality -= 5
  }

  await writeFile(outPath, output)

  const kb = Math.round(output.length / 1024)
  console.log(`[${i + 1}/${files.length}] ${outName} — ${kb}KB (q${quality})`)

  entries.push({ id: `eco-${num}`, src: `/images/${outName}`, alt: `Eco List ${num}` })
}

const imagesJs = `export const images = [\n${entries.map(e =>
  `  { id: '${e.id}', src: '${e.src}', alt: '${e.alt}' },`
).join('\n')}\n]\n`

await writeFile('lib/images.js', imagesJs)
console.log(`\nDone. ${files.length} images processed. lib/images.js updated.`)
