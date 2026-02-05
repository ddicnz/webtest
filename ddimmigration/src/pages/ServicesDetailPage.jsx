import { useParams, Link } from 'react-router-dom'
import { servicesList } from '../data/servicesData.js'

function ServicesDetailPage() {
  const { type } = useParams()
  const item = servicesList.find((s) => s.id === type)

  if (!item) {
    return (
      <main className="main-content services-detail-page">
        <p>未找到该业务。</p>
        <Link to="/services" className="case-back-link">返回核心业务</Link>
      </main>
    )
  }

  return (
    <main className="main-content services-detail-page">
      <Link to="/services" className="case-back-link">&lt; 返回核心业务</Link>

      <article className="services-detail">
        <h1 className="case-detail-title">{item.title}</h1>
        <div className="case-detail-content services-detail-content">
          {item.fullContent.split('\n\n').map((para, i) => {
            const t = para.trim()
            const sectionTitles = [
      '认证雇主 AEWV 工签',
      '我们能为你做什么',
      'AEWV 项目优势',
      '投资移民项目优势',
      '🎓 热门专业方向',
      '👨‍👩‍👧 家庭同步方案',
      '🧭 留学到移民路线图',
      '📊 英美澳新对比',
    ]
            const isSectionTitle = sectionTitles.includes(t)
            return (
              <p key={i} className={isSectionTitle ? 'services-detail-section-title' : ''}>
                {para}
              </p>
            )
          })}
        </div>
      </article>
    </main>
  )
}

export default ServicesDetailPage
