import { useParams, Link } from 'react-router-dom'
import { albumSections } from '../data/albumData.js'

function AlbumSectionPage() {
  const { sectionId } = useParams()
  const section = albumSections.find((s) => s.id === sectionId)

  if (!section) {
    return (
      <main className="main-content album-page">
        <p>未找到该相册。</p>
        <Link to="/album">返回企业相册</Link>
      </main>
    )
  }

  const hasImages = section.images && section.images.length > 0

  return (
    <main className="main-content album-page album-section-page">
      <div className="album-section-header">
        <Link to="/album" className="album-back-link">← 返回相册</Link>
        <h2 className="section-title">{section.title}</h2>
      </div>

      {hasImages ? (
        <div className="album-section-grid">
          {section.images.map((src, i) => (
            <div key={i} className="album-section-item">
              <img
                src={src}
                alt={`${section.title} ${i + 1}`}
                className="album-section-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="album-placeholder">暂无图片，敬请期待</p>
      )}
    </main>
  )
}

export default AlbumSectionPage
