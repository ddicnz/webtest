import { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { getStudyProgramById } from '../data/studyData.js'
import { parseStudyProgramIdFromSlug } from '../utils/studySlug.js'
import { studyListPathForSectionId } from '../utils/studySectionPath.js'

function StudyProgramDetailPage() {
  const { id: idParam } = useParams()
  const location = useLocation()
  const decodedParam = (() => {
    try {
      return decodeURIComponent(idParam || '')
    } catch {
      return idParam || ''
    }
  })()

  const programId = parseStudyProgramIdFromSlug(decodedParam)
  const prog = programId ? getStudyProgramById(programId) : null
  const fromSection = location.state?.fromSection || prog?.sectionId || 'tertiary'
  const scrollY = location.state?.scrollY
  const backStudyListPath = studyListPathForSectionId(fromSection)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (prog && typeof document !== 'undefined') {
      document.title = `${prog.titleZh} - 留学专栏 - 嘀嘀移民`
    }
  }, [prog])

  if (!prog) {
    return (
      <main className="main-content case-detail-page">
        <p>未找到该项目。</p>
        <Link to="/study/University" state={{ fromSection: 'tertiary', scrollY: 0 }} className="case-back-link">返回留学专栏</Link>
      </main>
    )
  }

  const detailImages = Array.isArray(prog.detailImages)
    ? prog.detailImages.filter(Boolean)
    : [prog.image, prog.image2, prog.image3].filter(Boolean)

  return (
    <main className="main-content case-detail-page">
      <Link to={backStudyListPath} state={{ fromSection, scrollY }} className="case-back-link">&lt; 返回留学专栏</Link>

      <article className="case-detail">
        <h1 className="case-detail-title">{prog.titleZh}</h1>
        <p className="case-detail-date">{prog.titleEn}</p>
        <div className="case-detail-images">
          {detailImages.map((src, i) => (
            <div key={i} className="case-detail-image-wrap">
              <img src={src} alt={i === 0 ? prog.titleZh : `${prog.titleZh} 费用`} className="case-detail-image" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="case-detail-content">
          {prog.highlight && <p><strong>{prog.highlight}</strong></p>}
          <div className="case-detail-cost">
          <strong>学费：</strong>
          {(prog.cost || '').split('\n').filter(Boolean).map((line, i) => (
            <p key={i} className="case-detail-cost-line">{line}</p>
          ))}
        </div>
          {prog.costNote && <p>{prog.costNote}</p>}
          {prog.detail && <p>{prog.detail}</p>}
          {prog.schedule && <p><strong>上课时间：</strong>{prog.schedule}</p>}
          <p><strong>语言要求：</strong>{prog.languageReq}</p>
          <p><strong>学术要求：</strong>{prog.academicReq}</p>
          <p><strong>入学时间：</strong>{prog.intakes}</p>
          <p><strong>毕业前景：</strong></p>
          <ul>
            {prog.prospects.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </article>
    </main>
  )
}

export default StudyProgramDetailPage
