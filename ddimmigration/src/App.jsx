import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Outlet, useLocation, Navigate } from 'react-router-dom'
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
import FaqPage from './pages/FaqPage.jsx'
import StudyPage from './pages/StudyPage.jsx'
import StudyProgramDetailPage from './pages/StudyProgramDetailPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import ServicesDetailPage from './pages/ServicesDetailPage.jsx'
import AssessmentPage from './pages/AssessmentPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { studySections } from './data/studyData.js'
import { studyListPathForSectionId } from './utils/studySectionPath.js'

const navItems = [
  { label: '首页', path: '/' },
  { label: '关于我们', path: '/about' },
  { label: '核心业务', path: '/services' },
  { label: '成功案例', path: '/cases' },
  { label: '招聘信息', path: '/jobs' },
  { label: '企业相册', path: '/album' },
  { label: '移民资讯', path: '/news' },
  { label: '留学专栏', path: '/study/University' },
  { label: '联络我们', path: '/contactus' },
  { label: '常见问题', path: '/faq' },
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
  } else if (location.pathname === '/faq') {
    heroImage = '/pic/contactus.jpg'
    heroClassName = 'about-hero about-hero--faq'
  } else if (location.pathname.startsWith('/study')) {
    heroImage = '/pic/pexels-pixabay-267885.jpg'
    heroClassName = 'about-hero about-hero--study'
  } else if (location.pathname.startsWith('/assessment')) {
    heroImage = '/pic/services.jpg'
    heroClassName = 'about-hero about-hero--services'
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
  const [mobileStudyPanelOpen, setMobileStudyPanelOpen] = useState(false)
  const [showPageBackToTop, setShowPageBackToTop] = useState(false)
  const location = useLocation()
  const showBackToTopRoute =
    location.pathname.startsWith('/study') ||
    location.pathname.startsWith('/album') ||
    location.pathname.startsWith('/jobs') ||
    location.pathname.startsWith('/cases') ||
    location.pathname.startsWith('/about') ||
    location.pathname.startsWith('/faq') ||
    location.pathname.startsWith('/assessment')

  // GA4：SPA 路由切换时上报页面浏览
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_location: window.location.origin + location.pathname,
        page_title: document.title || '嘀嘀移民',
      })
    }
  }, [location.pathname])

  useEffect(() => {
    setNavOpen(false)
    setMobileStudyPanelOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!navOpen) setMobileStudyPanelOpen(false)
  }, [navOpen])

  const closeMobileNav = () => {
    setNavOpen(false)
    setMobileStudyPanelOpen(false)
  }

  const onMobileOverlayClick = () => {
    if (mobileStudyPanelOpen) setMobileStudyPanelOpen(false)
    else closeMobileNav()
  }

  useEffect(() => {
    const handleScroll = () => {
      // 只要页面有滚动就加深导航背景
      setNavSolid(window.scrollY > 0)
      setShowPageBackToTop(showBackToTopRoute && window.scrollY > 260)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showBackToTopRoute])

  return (
    <div className="homepage">
      <div className="header-shell">
        {/* 顶部栏：联系方式（电话 / 邮箱 / 工作时间） */}
        <header className="top-bar">
        <div className="top-bar-inner">
          <div className="top-bar-contact">
            <span className="top-bar-contact-item">电话：+64-027-7223339</span>
            <span className="top-bar-contact-item">邮箱：ddicnz@gmail.com</span>
            <span className="top-bar-contact-item">工作时间：Mon - Fri 9:00 - 17:00</span>
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
            {navItems.map((item) =>
              item.label === '留学专栏' ? (
                <div
                  key={item.label}
                  className="nav-item nav-item--dropdown"
                  onMouseLeave={(e) => {
                    const root = e.currentTarget
                    const to = e.relatedTarget
                    if (to && root.contains(to)) return
                    const active = document.activeElement
                    if (active && root.contains(active)) active.blur()
                  }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => {
                      const studyActive =
                        location.pathname.startsWith('/study') &&
                        !location.pathname.startsWith('/study/program')
                      const active = studyActive
                      return `nav-link nav-link--dropdown-trigger${active ? ' active' : ''}`
                    }}
                    end={item.path === '/'}
                  >
                    {item.label}
                    <span className="nav-dropdown-caret" aria-hidden>▾</span>
                  </NavLink>
                  <ul className="nav-dropdown" role="menu" aria-label="留学专栏子菜单">
                    {studySections.map((sec) => (
                      <li key={sec.id} role="none">
                        <NavLink
                          role="menuitem"
                          to={studyListPathForSectionId(sec.id)}
                          className={({ isActive }) => `nav-dropdown-link${isActive ? ' active' : ''}`}
                          onClick={(e) => {
                            const el = e.currentTarget
                            requestAnimationFrame(() => el.blur())
                          }}
                        >
                          {sec.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
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
              ),
            )}
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
            onClick={onMobileOverlayClick}
          />
          <div className="nav-mobile-menu" role="dialog" aria-label="导航菜单">
            <button
              type="button"
              className="nav-mobile-close"
              aria-label="关闭菜单"
              onClick={closeMobileNav}
            >
              ×
            </button>
            <div className="nav-mobile-links">
              {navItems.map((item) =>
                item.label === '留学专栏' ? (
                  <button
                    key={item.label}
                    type="button"
                    className={`nav-mobile-link nav-mobile-study-trigger${
                      location.pathname.startsWith('/study') ? ' active' : ''
                    }`}
                    aria-expanded={mobileStudyPanelOpen}
                    onClick={() => setMobileStudyPanelOpen(true)}
                  >
                    <span>{item.label}</span>
                    <span className="nav-mobile-study-trigger-chevron" aria-hidden="true">
                      ›
                    </span>
                  </button>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-mobile-link${isActive ? ' active' : ''}`
                    }
                    end={item.path === '/'}
                    onClick={closeMobileNav}
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
            </div>
          </div>
          <div
            className={`nav-mobile-subpanel${mobileStudyPanelOpen ? ' nav-mobile-subpanel--open' : ''}`}
            role="dialog"
            aria-label="留学专栏子菜单"
            aria-hidden={!mobileStudyPanelOpen}
          >
            <div className="nav-mobile-subpanel-header">
              <button
                type="button"
                className="nav-mobile-subpanel-back"
                onClick={() => setMobileStudyPanelOpen(false)}
              >
                ‹ 返回
              </button>
              <span className="nav-mobile-subpanel-title">留学专栏</span>
            </div>
            <div className="nav-mobile-subpanel-links">
              {studySections.map((sec) => (
                <NavLink
                  key={sec.id}
                  to={studyListPathForSectionId(sec.id)}
                  className={({ isActive }) =>
                    `nav-mobile-link nav-mobile-subpanel-link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMobileNav}
                >
                  {sec.title}
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
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/assesment" element={<Navigate to="/assessment" replace />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/study/program/:id" element={<StudyProgramDetailPage />} />
          <Route path="/study" element={<Navigate to="/study/University" replace />} />
          <Route path="/study/:studyPath" element={<StudyPage />} />
        </Route>
      </Routes>

      {showBackToTopRoute && showPageBackToTop && (
        <button
          type="button"
          className="page-back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="回到顶部"
        >
          回到顶部
        </button>
      )}

      <Footer />
    </div>
  )
}

export default App
