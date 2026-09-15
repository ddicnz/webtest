import { Link } from 'react-router-dom'

const homeCopy = {
  zh: {
    primaryCta: '开启您的新西兰之路',
    assessmentCta: '免费评估',
    scrollHint: '滑动查看更多',
    businessTitle: '核心业务',
    businessAria: '核心业务分类',
    businessCards: [
      ['tourist', '旅游签申请', '/pic/tourist.png'],
      ['work', '工作签证申请', '/pic/work.png'],
      ['residence', '居留签证申请', '/pic/residence.png'],
      ['invest', '投资移民', '/pic/invest.png'],
      ['skilled', '技术移民', '/pic/skilled.png'],
      ['study', '留学教育', '/pic/study.png'],
    ],
    advisorsTitle: '持牌移民顾问',
    advisorRole: '持牌移民顾问',
  },
  en: {
    primaryCta: 'Start Your New Zealand Journey',
    assessmentCta: 'Free Assessment',
    scrollHint: 'Scroll to explore',
    businessTitle: 'Our Services',
    businessAria: 'Immigration and education services',
    businessCards: [
      ['tourist', 'Visitor Visas', '/pic/tourist.png'],
      ['work', 'Work Visas', '/pic/work.png'],
      ['residence', 'Resident Visas', '/pic/residence.png'],
      ['invest', 'Investor Visas', '/pic/invest.png'],
      ['skilled', 'Skilled Residence', '/pic/skilled.png'],
      ['study', 'Study in New Zealand', '/pic/study.png'],
    ],
    advisorsTitle: 'Licensed Immigration Advisers',
    advisorRole: 'Licensed Immigration Adviser',
  },
}

function HomePage({ language = 'zh' }) {
  const copy = homeCopy[language] ?? homeCopy.zh
  const contactPath = language === 'en' ? '/en/contactus' : '/contactus'

  return (
    <>
      {/* Hero 大图 / 轮播 */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url(/pic/auckland.jpg)`,
          }}
        />
        <div className="hero-cta-stack">
          <Link to={contactPath} className="hero-cta-btn">
            <span className="hero-cta-text">{copy.primaryCta}</span>
            <span className="hero-cta-arrow" aria-hidden>→</span>
          </Link>
          <Link to="/assessment/" className="hero-cta-btn hero-cta-btn--compact">
            <span className="hero-cta-text">{copy.assessmentCta}</span>
            <span className="hero-cta-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <p className="home-scroll-hint" aria-hidden="true">{copy.scrollHint}</p>

      {/* 主体内容：核心业务 */}
      <main className="main-content">
        <h2 className="section-title">{copy.businessTitle}</h2>

        <section className="home-business-cards" aria-label={copy.businessAria}>
          {copy.businessCards.map(([type, label, image]) => (
            <Link key={type} to={`/services/${type}`} className="home-business-card">
              <div
                className="home-business-card-bg"
                style={{ backgroundImage: `url(${image})` }}
              />
              <span className="home-business-card-label">{label}</span>
            </Link>
          ))}
        </section>

        <section className="advisors" aria-label={copy.advisorsTitle}>
          <h3 className="advisors-title">{copy.advisorsTitle}</h3>
          <div className="advisors-grid">
            <div className="advisor-card">
              <img
                className="advisor-avatar"
                src="/pic/eric.jpg"
                alt="Eric"
                loading="lazy"
              />
              <div className="advisor-role">{copy.advisorRole}</div>
              <div className="advisor-name">Eric</div>
            </div>

            <div className="advisor-card">
              <img
                className="advisor-avatar advisor-avatar--tsui"
                src="/pic/tsui.jpg"
                alt="Tsui"
                loading="lazy"
              />
              <div className="advisor-role">{copy.advisorRole}</div>
              <div className="advisor-name">Tsui</div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage
