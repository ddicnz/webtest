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

  const items = section.items ?? (section.images || []).map((src) => ({ src, caption: null }))
  const hasImages = items.length > 0

  return (
    <main className="main-content album-page album-section-page">
      <div className="album-section-header">
        <Link to="/album" className="album-back-link">← 返回相册</Link>
        <h2 className="section-title">{section.title}</h2>
      </div>

      {hasImages ? (
        <div className="album-section-grid">
          {items.map((item, i) => (
            <div key={i} className="album-section-item">
              <div className="album-section-img-wrap">
                <img
                  src={item.src}
                  alt={item.caption || `${section.title} ${i + 1}`}
                  className="album-section-img"
                  loading="lazy"
                />
              </div>
              {item.caption && <p className="album-section-caption">{item.caption}</p>}
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
