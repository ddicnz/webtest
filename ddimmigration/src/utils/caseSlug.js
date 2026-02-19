function slugifyTitle(title) {
  const input = String(title || '').trim().normalize('NFKD')
  // 保留：中文、字母、数字、空格、连字符；其余剔除（含大部分标点/emoji）
  const cleaned = input
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}\s-]+/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return cleaned || 'case'
}

export function makeCaseSlug(caseItem) {
  const id = caseItem?.id
  const title = caseItem?.title
  return `${id}-${slugifyTitle(title)}`
}

export function parseCaseIdFromSlug(idOrSlug) {
  const raw = String(idOrSlug || '').trim()
  if (!raw) return null

  // 兼容旧链接：/cases/10
  if (/^\d+$/.test(raw)) return Number(raw)

  // 新链接：/cases/10-xxx
  const m = raw.match(/^(\d+)-/)
  if (m) return Number(m[1])

  return null
}

