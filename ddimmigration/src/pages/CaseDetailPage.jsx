import { useParams, Link } from 'react-router-dom'
import { casesList } from '../data/casesData.js'

function CaseDetailPage() {
  const { id } = useParams()
  const caseItem = casesList.find((c) => String(c.id) === id)

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
