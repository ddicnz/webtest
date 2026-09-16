import { Link } from 'react-router-dom'
import { servicesList } from '../data/servicesData.js'
import { englishServices } from '../i18n/englishContent.js'

const cardImages = {
  tourist: '/pic/tourist.png',
  work: '/pic/work.png',
  residence: '/pic/residence.png',
  invest: '/pic/invest.png',
  skilled: '/pic/skilled.png',
  study: '/pic/study.png',
}

function ServicesPage({ language = 'zh' }) {
  const isEnglish = language === 'en'

  return (
    <main className="main-content services-page">
      <h2 className="section-title">{isEnglish ? 'Our Services' : '核心业务'}</h2>
      <p className="services-intro">
        {isEnglish
          ? 'We provide practical support for New Zealand visas, residence pathways and education planning, with licensed immigration advisers overseeing immigration matters.'
          : '我们提供投资移民、技术移民与留学教育等一站式咨询与申请服务，由持牌移民顾问全程跟进。'}
      </p>

      <div className="services-list">
        {servicesList.map((item) => {
          const displayItem = isEnglish ? { ...item, ...englishServices[item.id] } : item
          return (
            <Link
              key={item.id}
              to={`${isEnglish ? '/en' : ''}/services/${item.id}`}
              className="services-card"
            >
              <div
                className="services-card-image-wrap"
                style={{ backgroundImage: `url(${cardImages[item.id] || ''})` }}
              />
              <div className="services-card-body">
                <h3 className="services-card-title">{displayItem.title}</h3>
                <p className="services-card-summary">{displayItem.summary}</p>
                <span className="services-card-link">{isEnglish ? 'Learn more' : '查看更多'} &gt;&gt;</span>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

export default ServicesPage
