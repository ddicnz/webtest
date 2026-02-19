import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { casesList } from '../data/casesData.js'
import { makeCaseSlug, parseCaseIdFromSlug } from '../utils/caseSlug.js'

function CaseDetailPage() {
  const navigate = useNavigate()
  const { id: idParam } = useParams()
  const decodedParam = (() => {
    try {
      return decodeURIComponent(idParam || '')
    } catch {
      return idParam || ''
    }
  })()

  const caseId = parseCaseIdFromSlug(decodedParam)
  const caseItem = caseId != null
    ? casesList.find((c) => Number(c.id) === Number(caseId))
    : null

  // 兼容旧链接：/cases/10 → 自动跳转到 /cases/10-标题
  useEffect(() => {
    if (!caseItem) return
    if (!/^\d+$/.test(String(decodedParam).trim())) return
    navigate(`/cases/${encodeURIComponent(makeCaseSlug(caseItem))}`, { replace: true })
  }, [caseItem, decodedParam, navigate])

  if (!caseItem) {
    return (
      <main className="main-content case-detail-page">
        <p>未找到该案例。</p>
        <Link to="/cases" className="case-back-link">返回成功案例列表</Link>
      </main>
    )
  }

  return (
    <main className="main-content case-detail-page">
      <Link to="/cases" className="case-back-link">&lt; 返回成功案例</Link>

      <article className="case-detail">
        <h1 className="case-detail-title">{caseItem.title}</h1>
        <p className="case-detail-date">{caseItem.date}</p>
        <div className="case-detail-images">
          {(caseItem.images || (caseItem.image ? [caseItem.image] : [])).map((src, i) => (
            <div key={i} className="case-detail-image-wrap">
              <img src={src} alt="" className="case-detail-image" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="case-detail-content">
          {caseItem.fullContent.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </main>
  )
}

export default CaseDetailPage
