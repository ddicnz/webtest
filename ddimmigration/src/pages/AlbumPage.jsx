import { Link } from 'react-router-dom'
import { albumSections } from '../data/albumData.js'

function AlbumPage() {
  return (
    <main className="main-content album-page">
      <h2 className="section-title">企业相册</h2>
      <p className="album-intro">
        展示客户接待、办公环境、高光时刻与新西兰本地风貌，欢迎了解我们的日常。
      </p>

      <div className="album-covers">
        {albumSections.map((section) => {
          const coverSrc = section.cover ?? (section.images && section.images.length > 0 ? section.images[0] : null)
          return (
            <Link
              key={section.id}
              to={`/album/${section.id}`}
              className="album-cover-card"
            >
              <div className="album-cover-frame">
                {coverSrc ? (
                  <img
                    src={coverSrc}
                    alt={section.title}
                    className="album-cover-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="album-cover-placeholder">暂无图片</div>
                )}
              </div>
              <h3 className="album-cover-title">{section.title}</h3>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

export default AlbumPage
