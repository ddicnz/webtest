import { Link } from 'react-router-dom'
import { casesList } from '../data/casesData.js'

function CasesPage() {
  return (
    <main className="main-content cases-page">
      <h2 className="section-title">成功案例</h2>

      <div className="cases-list">
        {casesList.map((item) => (
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
              <Link to={`/cases/${item.id}`} className="case-card-link">
                查看更多 &gt;&gt;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default CasesPage
