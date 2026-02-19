import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { newsList } from '../data/newsData.js'
import { makeNewsSlug, parseNewsIdFromSlug } from '../utils/newsSlug.js'

function NewsDetailPage() {
  const navigate = useNavigate()
  const { id: idParam } = useParams()
  const decodedParam = (() => {
    try {
      return decodeURIComponent(idParam || '')
    } catch {
      return idParam || ''
    }
  })()

  const newsId = parseNewsIdFromSlug(decodedParam)
  const newsItem = newsId != null
    ? newsList.find((n) => Number(n.id) === Number(newsId))
    : null

  // 兼容旧链接：/news/10 → 自动跳转到 /news/10-标题
  useEffect(() => {
    if (!newsItem) return
    if (!/^\d+$/.test(String(decodedParam).trim())) return
    navigate(`/news/${encodeURIComponent(makeNewsSlug(newsItem))}`, { replace: true })
  }, [decodedParam, navigate, newsItem])

  if (!newsItem) {
    return (
      <main className="main-content news-detail-page">
        <p>未找到该资讯。</p>
        <Link to="/news" className="case-back-link">返回移民资讯列表</Link>
      </main>
    )
  }

  return (
    <main className="main-content news-detail-page case-detail-page">
      <Link to="/news" className="case-back-link">&lt; 返回移民资讯</Link>

      <article className="case-detail">
        <h1 className="case-detail-title">{newsItem.title}</h1>
        <p className="case-detail-date">{newsItem.date}</p>
        {newsItem.image && (
          <div className="case-detail-images">
            <div className="case-detail-image-wrap">
              <img src={newsItem.image} alt="" className="case-detail-image" loading="lazy" />
            </div>
          </div>
        )}
        <div className="case-detail-content">
          {newsItem.fullContent.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </main>
  )
}

export default NewsDetailPage
