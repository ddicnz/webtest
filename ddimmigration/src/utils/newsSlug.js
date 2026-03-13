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
  if (newsItem?.slug) return newsItem.slug
  const id = newsItem?.id
  const title = newsItem?.title
  return `${id}-${slugifyTitle(title)}`
}

export function findNewsBySlugOrId(param, newsList) {
  const raw = String(param || '').trim()
  if (!raw || !newsList?.length) return null
  const bySlug = newsList.find((n) => n.slug === raw)
  if (bySlug) return bySlug
  const id = parseNewsIdFromSlug(raw)
  if (id != null) return newsList.find((n) => Number(n.id) === Number(id)) || null
  return null
}

export function parseNewsIdFromSlug(idOrSlug) {
  const raw = String(idOrSlug || '').trim()
  if (!raw) return null

  if (/^\d+$/.test(raw)) return Number(raw)

  const m = raw.match(/^(\d+)-/)
  if (m) return Number(m[1])

  return null
}

