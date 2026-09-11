import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const indexPath = join(__dirname, '..', 'dist', 'index.html')

const html = readFileSync(indexPath, 'utf-8')
const fixed = html.replaceAll('/assets', './assets')
writeFileSync(indexPath, fixed)
