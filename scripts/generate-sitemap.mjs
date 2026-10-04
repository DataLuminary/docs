#!/usr/bin/env node
import { readdirSync, writeFileSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DOCS_ROOT = join(__dirname, '..', 'docs')
const PUBLIC_DIR = join(DOCS_ROOT, 'public')
const BASE = 'https://docs.dataluminary.dev'

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'public' || name === 'styles' || name.startsWith('.')) continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (name.endsWith('.md') || name.endsWith('.mdx')) out.push(full)
  }
  return out
}

function toUrl(file) {
  const relFile = relative(DOCS_ROOT, file).replace(/\\/g, '/')
  const isIndex = /(?:^|\/)index\.mdx?$/.test(relFile)
  let rel = relFile.replace(/\.mdx?$/, '')
  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length)
  if (rel === 'index' || rel === '') return `${BASE}/`
  if (isIndex) return `${BASE}/${rel}/`
  return `${BASE}/${rel}`
}

function priorityFor(loc) {
  if (loc === `${BASE}/`) return '1.0'
  if (loc.includes('/product') || loc.includes('/start')) return '0.9'
  if (loc.includes('/guide')) return '0.8'
  return '0.7'
}

const files = walk(DOCS_ROOT).filter((f) => !relative(DOCS_ROOT, f).startsWith('legal/'))
const urls = [...new Set(files.map(toUrl))].sort((a, b) => a.length - b.length || a.localeCompare(b))
const lastmod = new Date().toISOString().slice(0, 10)
const body = urls
  .map((loc) => {
    const priority = priorityFor(loc)
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), xml)
console.log(`Wrote sitemap.xml with ${urls.length} URLs`)
