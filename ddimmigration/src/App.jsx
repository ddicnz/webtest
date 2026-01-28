import './App.css'

const navItems = [
  { label: '首页', active: true },
  { label: '关于我们' },
  { label: '专业团队' },
  { label: '服务收费' },
  { label: '移民常识' },
  { label: '移民资讯' },
  { label: '顾客反馈' },
  { label: '联络我们' },
  { label: 'About Us' },
]

function App() {
  return (
    <div className="homepage">
      {/* 顶部栏：Logo + 公司名 + 电话 */}
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="brand">
            <img
              src="/pic/logo.jpg"
              alt="嘀嘀移民"
              className="logo-img"
            />
            <div className="company-name">
              <h1 className="company-zh">嘀嘀移民公司</h1>
              <p className="company-en">dd immigration consultant ltd</p>
            </div>
          </div>
          <div className="contact">
            <span className="phone-icon">📞</span>
            <a href="tel:+64-9-3033533" className="phone-num">+64-9-3033533</a>
          </div>
        </div>
      </header>

      {/* 导航栏 */}
      <nav className="nav-bar">
        <div className="nav-inner">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`nav-link ${item.active ? 'active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero 大图 / 轮播 */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1578645510447-e020b6462953?w=1920)`,
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
      </main>
    </div>
  )
}

export default App
