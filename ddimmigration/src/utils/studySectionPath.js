/** 留学专栏：内部 section id ↔ URL 路径段（与 studySections 顺序一致） */

export const STUDY_SECTION_PATH_SEGMENTS = {
  tertiary: 'University',
  technical: 'skill',
  language: 'language',
  secondary: 'secondary',
  primary: 'primary',
}

const PATH_TO_ID = {
  University: 'tertiary',
  skill: 'technical',
  language: 'language',
  secondary: 'secondary',
  primary: 'primary',
}

/** 默认落地页：大学留学 */
export const STUDY_DEFAULT_LIST_PATH = '/study/University'

export function studySectionIdToPathSegment(sectionId) {
  return STUDY_SECTION_PATH_SEGMENTS[sectionId] ?? 'University'
}

export function studyListPathForSectionId(sectionId) {
  return `/study/${studySectionIdToPathSegment(sectionId)}`
}

/**
 * 将 URL 中的 :studyPath 转为 studySections 的 id；无法识别时返回 null
 */
export function studyPathSegmentToSectionId(rawSegment) {
  const s = String(rawSegment || '').trim()
  if (!s) return null
  if (PATH_TO_ID[s]) return PATH_TO_ID[s]
  const lower = s.toLowerCase()
  if (lower === 'university') return 'tertiary'
  if (lower === 'skill') return 'technical'
  if (lower === 'language') return 'language'
  if (lower === 'secondary') return 'secondary'
  if (lower === 'primary') return 'primary'
  return null
}
