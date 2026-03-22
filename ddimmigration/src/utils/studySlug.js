function slugifyTitle(title) {
  const input = String(title || '').trim().normalize('NFKD')
  const cleaned = input
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}\s-]+/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return cleaned || 'program'
}

export function makeStudyProgramSlug(prog) {
  return `${prog?.id}-${slugifyTitle(prog?.titleZh)}`
}

export function parseStudyProgramIdFromSlug(idOrSlug) {
  const raw = String(idOrSlug || '').trim()
  if (!raw) return null
  const m = raw.match(/^([a-z0-9-]+)-/)
  return m ? m[1] : raw
}
