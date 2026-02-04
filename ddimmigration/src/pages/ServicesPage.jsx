import { Link } from 'react-router-dom'
import { servicesList } from '../data/servicesData.js'

const cardImages = {
  invest: '/pic/invest.png',
  skilled: '/pic/skilled.png',
  study: '/pic/study.png',
}

function ServicesPage() {
  return (
    <main className="main-content services-page">
      <h2 className="section-title">核心业务</h2>
      <p className="services-intro">
        我们提供投资移民、技术移民与留学教育等一站式咨询与申请服务，由持牌移民顾问全程跟进。
      </p>

      <div className="services-list">
        {servicesList.map((item) => (
          <Link
            key={item.id}
            to={`/services/${item.id}`}
            className="services-card"
          >
            <div
              className="services-card-image-wrap"
              style={{ backgroundImage: `url(${cardImages[item.id] || ''})` }}
            />
            <div className="services-card-body">
              <h3 className="services-card-title">{item.title}</h3>
              <p className="services-card-summary">{item.summary}</p>
              <span className="services-card-link">查看更多 &gt;&gt;</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default ServicesPage
