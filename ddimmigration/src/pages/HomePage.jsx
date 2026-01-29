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
        <button type="button" className="hero-arrow hero-arrow-left" aria-label="上一张">
          ‹
        </button>
        <button type="button" className="hero-arrow hero-arrow-right" aria-label="下一张">
          ›
        </button>
      </section>

      {/* 主体内容：核心业务 */}
      <main className="main-content">
        <h2 className="section-title">核心业务</h2>

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

