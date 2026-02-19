import { useState } from 'react'
import { Link } from 'react-router-dom'
import { casesList } from '../data/casesData.js'
import { makeCaseSlug } from '../utils/caseSlug.js'

const PAGE_SIZE = 5

function CasesPage() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(casesList.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const currentList = casesList.slice(start, start + PAGE_SIZE)

  return (
    <main className="main-content cases-page">
      <h2 className="section-title">成功案例</h2>

      <div className="cases-list">
        {currentList.map((item) => (
          <article key={item.id} className="case-card">
            <div className="case-card-image-wrap">
              <img
                src={item.image}
                alt=""
                className="case-card-image"
                loading="lazy"
              />
            </div>
            <div className="case-card-body">
              <h3 className="case-card-title">{item.title}</h3>
              <p className="case-card-summary">{item.summary}</p>
              <p className="case-card-date">{item.date}</p>
              <Link to={`/cases/${encodeURIComponent(makeCaseSlug(item))}`} className="case-card-link">
                查看更多 &gt;&gt;
              </Link>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="cases-pagination" aria-label="成功案例分页">
          <button
            type="button"
            className="cases-pagination-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            上一页
          </button>
          <span className="cases-pagination-info">
            第 {page} / {totalPages} 页
          </span>
          <button
            type="button"
            className="cases-pagination-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            下一页
          </button>
        </nav>
      )}
    </main>
  )
}

export default CasesPage
