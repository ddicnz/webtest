function slugifyTitle(title) {
  const input = String(title || '').trim().normalize('NFKD')
  const cleaned = input
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}\s-]+/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return cleaned || 'news'
}

export function makeNewsSlug(newsItem) {
  const id = newsItem?.id
  const title = newsItem?.title
  return `${id}-${slugifyTitle(title)}`
}

export function parseNewsIdFromSlug(idOrSlug) {
  const raw = String(idOrSlug || '').trim()
  if (!raw) return null

  if (/^\d+$/.test(raw)) return Number(raw)

  const m = raw.match(/^(\d+)-/)
  if (m) return Number(m[1])

  return null
}

