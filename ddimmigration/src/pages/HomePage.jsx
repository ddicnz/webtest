import { Link } from 'react-router-dom'

function HomePage() {
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
        <Link to="/contactus" className="hero-cta-btn">
          <span className="hero-cta-text">开启您的新西兰之路</span>
          <span className="hero-cta-arrow" aria-hidden>→</span>
        </Link>
      </section>

      {/* 主体内容：核心业务 */}
      <main className="main-content">
        <h2 className="section-title">核心业务</h2>

        <section className="home-business-cards" aria-label="核心业务分类">
          <Link to="/services/tourist" className="home-business-card">
            <div
              className="home-business-card-bg"
              style={{ backgroundImage: 'url(/pic/tourist.png)' }}
            />
            <span className="home-business-card-label">旅游签申请</span>
          </Link>
          <Link to="/services/work" className="home-business-card">
            <div
              className="home-business-card-bg"
              style={{ backgroundImage: 'url(/pic/work.png)' }}
            />
            <span className="home-business-card-label">工作签证申请</span>
          </Link>
          <Link to="/services/residence" className="home-business-card">
            <div
              className="home-business-card-bg"
              style={{ backgroundImage: 'url(/pic/residence.png)' }}
            />
            <span className="home-business-card-label">居留签证申请</span>
          </Link>
          <Link to="/services/invest" className="home-business-card">
            <div
              className="home-business-card-bg"
              style={{ backgroundImage: 'url(/pic/invest.png)' }}
            />
            <span className="home-business-card-label">投资移民</span>
          </Link>
          <Link to="/services/skilled" className="home-business-card">
            <div
              className="home-business-card-bg"
              style={{ backgroundImage: 'url(/pic/skilled.png)' }}
            />
            <span className="home-business-card-label">技术移民</span>
          </Link>
          <Link to="/services/study" className="home-business-card">
            <div
              className="home-business-card-bg"
              style={{ backgroundImage: 'url(/pic/study.png)' }}
            />
            <span className="home-business-card-label">留学教育</span>
          </Link>
        </section>

        <section className="advisors" aria-label="持牌移民顾问">
          <h3 className="advisors-title">持牌移民顾问</h3>
          <div className="advisors-grid">
            <div className="advisor-card">
              <img
                className="advisor-avatar"
                src="/pic/eric.jpg"
                alt="Eric"
                loading="lazy"
              />
              <div className="advisor-role">持牌移民顾问</div>
              <div className="advisor-name">Eric</div>
            </div>

            <div className="advisor-card">
              <img
                className="advisor-avatar"
                src="/pic/tsui.jpg"
                alt="Tsui"
                loading="lazy"
              />
              <div className="advisor-role">持牌移民顾问</div>
              <div className="advisor-name">Tsui</div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage

