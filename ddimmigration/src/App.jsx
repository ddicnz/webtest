import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer.jsx'
import LeftSidebar from './components/LeftSidebar.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CasesPage from './pages/CasesPage.jsx'
import CaseDetailPage from './pages/CaseDetailPage.jsx'
import JobsPage from './pages/JobsPage.jsx'
import AlbumPage from './pages/AlbumPage.jsx'
import AlbumSectionPage from './pages/AlbumSectionPage.jsx'
import NewsPage from './pages/NewsPage.jsx'
import NewsDetailPage from './pages/NewsDetailPage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import ServicesDetailPage from './pages/ServicesDetailPage.jsx'

const navItems = [
  { label: '首页', path: '/' },
  { label: '关于我们', path: '/about' },
  { label: '核心业务', path: '/services' },
  { label: '成功案例', path: '/cases' },
  { label: '招聘信息', path: '/jobs' },
  { label: '企业相册', path: '/album' },
  { label: '移民资讯', path: '/news' },
  { label: '联络我们', path: '/contactus' },
]

function SidebarLayout() {
  return (
    <div className="page-with-sidebar">
      <LeftSidebar />
      <div className="main-area">
        <Outlet />
      </div>
    </div>
  )
}

// 通用布局：除首页外，其它页面上方都有一块半屏宽的大图，下面是侧边栏 + 正文
function HeroSidebarLayout() {
  const location = useLocation()

  // 默认 aboutus 图；企业相册用 xiangce，招聘用 zhaopin，专业团队用 teams，成功案例用 successcases，核心业务用 services，移民资讯用 news，联络我们用 contactus；各页亮度在 App.css 按模块调整
  let heroImage = '/pic/aboutus.jpg'
  let heroClassName = 'about-hero'
  if (location.pathname.startsWith('/album')) {
    heroImage = '/pic/xiangce.jpg'
    heroClassName = 'about-hero about-hero--album'
  } else if (location.pathname === '/jobs') {
    heroImage = '/pic/zhaopin.jpg'
    heroClassName = 'about-hero about-hero--jobs'
  } else if (location.pathname === '/about') {
    heroClassName = 'about-hero about-hero--about'
  } else if (location.pathname.startsWith('/cases')) {
    heroImage = '/pic/successcases.jpg'
    heroClassName = 'about-hero about-hero--cases'
  } else if (location.pathname.startsWith('/services')) {
    heroImage = '/pic/services.jpg'
    heroClassName = 'about-hero about-hero--services'
  } else if (location.pathname === '/news') {
    heroImage = '/pic/news.jpg'
    heroClassName = 'about-hero about-hero--news'
  } else if (location.pathname === '/contactus') {
    heroImage = '/pic/contactus.jpg'
    heroClassName = 'about-hero about-hero--contactus'
  }

  return (
    <>
      {/* 顶部整屏图片：与首页一样，图片上边缘和导航上边缘对齐 */}
      <section className={heroClassName}>
        <div
          className="about-hero-bg"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      </section>

      {/* 图片下面是侧边栏 + 各页面正文 */}
      <div className="page-with-sidebar">
        <LeftSidebar />
        <div className="main-area">
          <Outlet />
        </div>
      </div>
    </>
  )
}

function App() {
  const [navSolid, setNavSolid] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // 只要页面有滚动就加深导航背景
      setNavSolid(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="homepage">
      <div className="header-shell">
        {/* 顶部栏：联系方式（电话 / 邮箱 / 工作时间） */}
        <header className="top-bar">
        <div className="top-bar-inner">
          <div className="top-bar-contact">
            <span className="top-bar-contact-item">电话：+64-027-7223339</span>
            <span className="top-bar-contact-item">邮箱：ddicnz@gmail.com</span>
            <span className="top-bar-contact-item">工作时间：Mon - Fri 10:00 - 18:00</span>
          </div>
        </div>
      </header>

      {/* 导航栏 */}
      <nav className={`nav-bar${navSolid ? ' nav-bar--solid' : ''}${navOpen ? ' nav-bar--menu-open' : ''}`}>
        <div className="nav-menu-btn-wrap">
          <button
            type="button"
            className="nav-menu-btn"
            aria-label="打开菜单"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}
          >
            <span className="nav-menu-btn-line" />
            <span className="nav-menu-btn-line" />
            <span className="nav-menu-btn-line" />
          </button>
          <span className="nav-menu-btn-label">导航</span>
        </div>
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="brand">
              <img
                src="/pic/logo.jpg"
                alt="嘀嘀移民"
                className="logo-img"
              />
              <div className="company-name">
                <h1 className="company-zh">新西兰嘀嘀移民公司</h1>
                <p className="company-en">DD Immigration Consulting Ltd</p>
              </div>
            </div>
          </div>
          <div className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
            <span className="nav-inner-spacer" aria-hidden="true" />
          </div>
        </div>
        <p className="nav-scroll-hint" aria-hidden="true">滑动查看更多</p>
      </nav>

      {navOpen && (
        <>
          <div
            className="nav-mobile-overlay"
            aria-hidden="true"
            onClick={() => setNavOpen(false)}
          />
          <div className="nav-mobile-menu" role="dialog" aria-label="导航菜单">
            <button
              type="button"
              className="nav-mobile-close"
              aria-label="关闭菜单"
              onClick={() => setNavOpen(false)}
            >
              ×
            </button>
            <div className="nav-mobile-links">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-mobile-link${isActive ? ' active' : ''}`
                  }
                  end={item.path === '/'}
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 除首页外的其它页面：上面半屏大图，下面 sidebar + 正文 */}
        <Route element={<HeroSidebarLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:type" element={<ServicesDetailPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/album/:sectionId" element={<AlbumSectionPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contactus" element={<ContactUsPage />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  )
}

export default App
