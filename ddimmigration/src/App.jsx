import { useEffect, useState } from 'react'
import { Routes, Route, Link, NavLink, Outlet, useLocation, Navigate } from 'react-router-dom'
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
import PromoterPage from './pages/PromoterPage.jsx'
import PromoterRegisterPage from './pages/PromoterRegisterPage.jsx'
import StudyPage from './pages/StudyPage.jsx'
import StudyProgramDetailPage from './pages/StudyProgramDetailPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import ServicesDetailPage from './pages/ServicesDetailPage.jsx'
import AssessmentPage from './pages/AssessmentPage.jsx'
import VisaInfoFormPage from './pages/VisaInfoFormPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import VisaPortalLoginPage from './pages/VisaPortalLoginPage.jsx'
import VisaPortalPage from './pages/VisaPortalPage.jsx'
import VisaPortalInfoFormPage from './pages/VisaPortalInfoFormPage.jsx'
import VisaPortalMaterialsPage from './pages/VisaPortalMaterialsPage.jsx'
import { studySections } from './data/studyData.js'
import { studyListPathForSectionId } from './utils/studySectionPath.js'

const navItems = [
  { id: 'home', label: '首页', labelEn: 'Home', path: '/', pathEn: '/en' },
  { id: 'about', label: '关于我们', labelEn: 'About Us', path: '/about', pathEn: '/en/about' },
  { id: 'services', label: '核心业务', labelEn: 'Services', path: '/services', pathEn: '/en/services' },
  { id: 'cases', label: '成功案例', labelEn: 'Success Stories', path: '/cases', pathEn: '/en/cases' },
  { id: 'jobs', label: '招聘信息', labelEn: 'Jobs', path: '/jobs', pathEn: '/en/jobs' },
  { id: 'album', label: '企业相册', labelEn: 'Gallery', path: '/album', pathEn: '/en/album' },
  { id: 'news', label: '移民资讯', labelEn: 'News', path: '/news', pathEn: '/en/news' },
  { id: 'study', label: '留学专栏', labelEn: 'Study in NZ', path: '/study/University', pathEn: '/en/study/University' },
  { id: 'contact', label: '联络我们', labelEn: 'Contact', path: '/contactus', pathEn: '/en/contactus' },
  { id: 'promoter', label: '成为推广员', labelEn: 'Partners', path: '/promoter', pathEn: '/en/promoter' },
  { id: 'faq', label: '常见问题', labelEn: 'FAQs', path: '/faq', pathEn: '/en/faq' },
]

const studySectionLabelsEn = {
  tertiary: 'Universities',
  technical: 'Vocational Study',
  language: 'English Language',
  highschool: 'High Schools',
  middleschool: 'Intermediate Schools',
  primary: 'Primary Schools',
}

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
  const isEnglish = location.pathname.startsWith('/en/')
  const routePath = isEnglish ? location.pathname.slice(3) || '/' : location.pathname

  // 默认 aboutus 图；企业相册用 xiangce，招聘用 zhaopin，专业团队用 teams，成功案例用 successcases，核心业务用 services，移民资讯用 news，联络我们用 contactus；各页亮度在 App.css 按模块调整
  let heroImage = '/pic/aboutus.jpg'
  let heroClassName = 'about-hero'
  if (routePath.startsWith('/album')) {
    heroImage = '/pic/xiangce.jpg'
    heroClassName = 'about-hero about-hero--album'
  } else if (routePath === '/jobs') {
    heroImage = '/pic/zhaopin.jpg'
    heroClassName = 'about-hero about-hero--jobs'
  } else if (routePath === '/about') {
    heroClassName = 'about-hero about-hero--about'
  } else if (routePath.startsWith('/cases')) {
    heroImage = '/pic/successcases.jpg'
    heroClassName = 'about-hero about-hero--cases'
  } else if (routePath.startsWith('/services')) {
    heroImage = '/pic/services.jpg'
    heroClassName = 'about-hero about-hero--services'
  } else if (routePath.startsWith('/news')) {
    heroImage = '/pic/news.jpg'
    heroClassName = 'about-hero about-hero--news'
  } else if (routePath === '/contactus') {
    heroImage = '/pic/contactus.jpg'
    heroClassName = 'about-hero about-hero--contactus'
  } else if (routePath === '/faq') {
    heroImage = '/pic/contactus.jpg'
    heroClassName = 'about-hero about-hero--faq'
  } else if (routePath === '/promoter') {
    heroImage = '/pic/services.jpg'
    heroClassName = 'about-hero about-hero--promoter'
  } else if (routePath.startsWith('/study')) {
    heroImage = '/pic/pexels-pixabay-267885.jpg'
    heroClassName = 'about-hero about-hero--study'
  } else if (routePath.startsWith('/assessment')) {
    heroImage = '/pic/services.jpg'
    heroClassName = 'about-hero about-hero--services'
  } else if (routePath.startsWith('/visa-info-form')) {
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
        <LeftSidebar language={isEnglish ? 'en' : 'zh'} />
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
  const isEnglish = location.pathname === '/en' || location.pathname.startsWith('/en/')
  const currentNavItems = navItems.map((item) => ({
    ...item,
    label: isEnglish ? item.labelEn : item.label,
    path: isEnglish && item.pathEn ? item.pathEn : item.path,
  }))
  const englishRoutePrefixes = ['/about', '/services', '/cases', '/jobs', '/album', '/news', '/study', '/contactus', '/promoter', '/faq']
  const hasEnglishCounterpart = englishRoutePrefixes.some((prefix) =>
    location.pathname === prefix || location.pathname.startsWith(`${prefix}/`),
  )
  const languageSwitchPath = isEnglish
    ? location.pathname.replace(/^\/en/, '') || '/'
    : hasEnglishCounterpart ? `/en${location.pathname}` : '/en'
  const isVisaPortalRoute =
    location.pathname.startsWith('/visa-portal') ||
    location.pathname === '/promoter-register' ||
    location.pathname === '/admin'
  const showBackToTopRoute =
    ['/study', '/album', '/jobs', '/cases', '/about', '/faq', '/promoter', '/assessment', '/visa-info-form']
      .some((prefix) => location.pathname.startsWith(prefix) || location.pathname.startsWith(`/en${prefix}`))

  // GA4：SPA 路由切换时上报页面浏览
  useEffect(() => {
    document.documentElement.lang = isEnglish ? 'en-NZ' : 'zh-CN'
    const englishTitles = [
      ['/en/contactus', 'Contact DD Immigration Consulting | Auckland, New Zealand'],
      ['/en/about', 'About DD Immigration Consulting | New Zealand'],
      ['/en/services', 'New Zealand Immigration & Education Services | DD Immigration'],
      ['/en/cases', 'Success Stories | DD Immigration Consulting'],
      ['/en/jobs', 'New Zealand Job Opportunities | DD Immigration'],
      ['/en/album', 'Company Gallery | DD Immigration Consulting'],
      ['/en/news', 'New Zealand Immigration News | DD Immigration'],
      ['/en/study', 'Study in New Zealand | DD Immigration Consulting'],
      ['/en/promoter', 'Become a Referral Partner | DD Immigration'],
      ['/en/faq', 'New Zealand Immigration FAQs | DD Immigration'],
    ]
    const matchingTitle = englishTitles.find(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))?.[1]
    document.title = matchingTitle || (isEnglish
      ? 'DD Immigration Consulting | New Zealand Immigration & Education'
      : '新西兰嘀嘀移民公司| 移民 | 签证 |留学')

    const routeDescriptions = isEnglish
      ? [
          ['/en', 'DD Immigration Consulting provides New Zealand immigration, visa and education services. Explore our services, study options and contact our Auckland team.'],
          ['/en/about', 'Learn about DD Immigration Consulting and our New Zealand immigration and education services.'],
          ['/en/services', 'Explore New Zealand visa, immigration and education application support from DD Immigration Consulting.'],
          ['/en/cases', 'Read New Zealand visa and immigration client stories shared by DD Immigration Consulting.'],
          ['/en/jobs', 'Browse job opportunities in New Zealand listed by DD Immigration Consulting.'],
          ['/en/album', 'View the DD Immigration Consulting office, team and client gallery.'],
          ['/en/news', 'Read New Zealand immigration and visa updates from DD Immigration Consulting. Check official sources for current requirements.'],
          ['/en/study', 'Explore New Zealand universities, schools and study programmes with DD Immigration Consulting.'],
          ['/en/contactus', 'Contact DD Immigration Consulting in Auckland about New Zealand immigration, visas or study options.'],
          ['/en/faq', 'Find answers to common questions about New Zealand immigration, visas and study.'],
          ['/en/promoter', 'Learn about referring clients to DD Immigration Consulting as a business partner.'],
        ]
      : [
          ['/', '嘀嘀移民提供新西兰签证、移民及留学咨询服务，位于奥克兰。了解服务内容、成功案例与新西兰留学项目。'],
          ['/about', '了解新西兰嘀嘀移民的团队、服务范围及联系方式。'],
          ['/services', '查看新西兰旅游签、工作签、居民签及留学申请等咨询服务。具体资格以新西兰移民局及院校要求为准。'],
          ['/cases', '查看嘀嘀移民分享的新西兰签证与移民服务案例。个案结果不代表其他申请结果。'],
          ['/jobs', '查看新西兰招聘信息及相关岗位介绍。'],
          ['/album', '浏览嘀嘀移民办公室、团队与活动相册。'],
          ['/news', '阅读新西兰签证与移民资讯。政策可能变化，请以新西兰移民局官方信息为准。'],
          ['/study', '了解新西兰大学、中小学、预科及职业课程，获取留学申请与择校信息。'],
          ['/contactus', '联系奥克兰嘀嘀移民，咨询新西兰签证、移民或留学服务。'],
          ['/faq', '查看有关新西兰签证、移民和留学申请的常见问题。'],
          ['/promoter', '了解如何成为嘀嘀移民业务推广合作伙伴。'],
          ['/assessment', '提交新西兰签证或移民情况评估意向，了解后续咨询方式。'],
        ]
    const matchingDescription = routeDescriptions.find(([path]) =>
      path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`),
    )?.[1] || (isEnglish
      ? 'DD Immigration Consulting provides New Zealand immigration, visa and education information and support.'
      : '嘀嘀移民提供新西兰签证、移民及留学信息与咨询服务。')
    const isPrivateRoute = ['/visa-portal', '/admin'].some((path) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
    ) || location.pathname === '/promoter-register'
    const setMeta = (selector, attributes, content) => {
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }
    setMeta('meta[name="description"]', { name: 'description' }, matchingDescription)
    setMeta('meta[name="robots"]', { name: 'robots' }, isPrivateRoute ? 'noindex, nofollow' : 'index, follow')
    setMeta('meta[property="og:title"]', { property: 'og:title' }, document.title)
    setMeta('meta[property="og:description"]', { property: 'og:description' }, matchingDescription)
    setMeta('meta[property="og:url"]', { property: 'og:url' }, `${window.location.origin}${location.pathname}`)
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `${window.location.origin}${location.pathname}`)
  }, [isEnglish, location.pathname])

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
            <span className="top-bar-contact-item">{isEnglish ? 'Phone: +64-027-7223339' : '电话：+64-027-7223339'}</span>
            <span className="top-bar-contact-item">{isEnglish ? 'Email: ddicnz@gmail.com' : '邮箱：ddicnz@gmail.com'}</span>
            <span className="top-bar-contact-item">{isEnglish ? 'Hours: Mon - Fri 9:00 - 17:00' : '工作时间：Mon - Fri 9:00 - 17:00'}</span>
          </div>
          <Link to={languageSwitchPath} className="top-bar-language-switch">
            {isEnglish ? '中文' : 'EN'}
          </Link>
        </div>
      </header>

      {/* 导航栏 */}
      <nav className={`nav-bar${navSolid ? ' nav-bar--solid' : ''}${isVisaPortalRoute ? ' nav-bar--portal' : ''}${navOpen ? ' nav-bar--menu-open' : ''}`}>
        <div className="nav-menu-btn-wrap">
          <button
            type="button"
            className="nav-menu-btn"
            aria-label={isEnglish ? 'Open menu' : '打开菜单'}
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}
          >
            <span className="nav-menu-btn-line" />
            <span className="nav-menu-btn-line" />
            <span className="nav-menu-btn-line" />
          </button>
          <span className="nav-menu-btn-label">{isEnglish ? 'Menu' : '导航'}</span>
        </div>
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="brand">
              <img
                src="/pic/logo.jpg"
                alt="DD Immigration"
                className="logo-img"
              />
              <div className="company-name">
                <h1 className="company-zh">
                  {isEnglish ? 'DD Immigration' : '新西兰嘀嘀移民公司'}
                </h1>
                <p className="company-en">
                  {isEnglish ? 'New Zealand Immigration & Education' : 'DD Immigration Consulting Ltd'}
                </p>
              </div>
            </div>
          </div>
          <div className="nav-links">
            {currentNavItems.map((item) =>
              item.id === 'study' ? (
                <div
                  key={item.id}
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
                    className={() => {
                      const studyActive =
                        (location.pathname.startsWith('/study') || location.pathname.startsWith('/en/study')) &&
                        !location.pathname.includes('/study/program')
                      const active = studyActive
                      return `nav-link nav-link--dropdown-trigger${active ? ' active' : ''}`
                    }}
                    end={item.path === '/'}
                  >
                    {item.label}
                    <span className="nav-dropdown-caret" aria-hidden>▾</span>
                  </NavLink>
                  <ul className="nav-dropdown" role="menu" aria-label={isEnglish ? 'Study in New Zealand submenu' : '留学专栏子菜单'}>
                    {studySections.map((sec) => (
                      <li key={sec.id} role="none">
                        <NavLink
                          role="menuitem"
                          to={`${isEnglish ? '/en' : ''}${studyListPathForSectionId(sec.id)}`}
                          className={({ isActive }) => `nav-dropdown-link${isActive ? ' active' : ''}`}
                          onClick={(e) => {
                            const el = e.currentTarget
                            requestAnimationFrame(() => el.blur())
                          }}
                        >
                          {isEnglish ? studySectionLabelsEn[sec.id] ?? sec.title : sec.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <NavLink
                  key={item.id}
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
        <p className="nav-scroll-hint" aria-hidden="true">{isEnglish ? 'Scroll to explore' : '滑动查看更多'}</p>
        <Link to={languageSwitchPath} className="nav-language-switch nav-language-switch--mobile">
          {isEnglish ? '中文' : 'EN'}
        </Link>
      </nav>

      {navOpen && (
        <>
          <div
            className="nav-mobile-overlay"
            aria-hidden="true"
            onClick={onMobileOverlayClick}
          />
          <div className="nav-mobile-menu" role="dialog" aria-label={isEnglish ? 'Navigation menu' : '导航菜单'}>
            <button
              type="button"
              className="nav-mobile-close"
              aria-label={isEnglish ? 'Close menu' : '关闭菜单'}
              onClick={closeMobileNav}
            >
              ×
            </button>
            <div className="nav-mobile-links">
              {currentNavItems.map((item) =>
                item.id === 'study' ? (
                  <button
                    key={item.id}
                    type="button"
                    className={`nav-mobile-link nav-mobile-study-trigger${
                      location.pathname.includes('/study') ? ' active' : ''
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
                    key={item.id}
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
              <Link
                to={languageSwitchPath}
                className="nav-mobile-link nav-mobile-language-switch"
                onClick={closeMobileNav}
              >
                {isEnglish ? '中文' : 'English'}
              </Link>
            </div>
          </div>
          <div
            className={`nav-mobile-subpanel${mobileStudyPanelOpen ? ' nav-mobile-subpanel--open' : ''}`}
            role="dialog"
            aria-label={isEnglish ? 'Study in New Zealand submenu' : '留学专栏子菜单'}
            aria-hidden={!mobileStudyPanelOpen}
          >
            <div className="nav-mobile-subpanel-header">
              <button
                type="button"
                className="nav-mobile-subpanel-back"
                onClick={() => setMobileStudyPanelOpen(false)}
              >
                ‹ {isEnglish ? 'Back' : '返回'}
              </button>
              <span className="nav-mobile-subpanel-title">{isEnglish ? 'Study in New Zealand' : '留学专栏'}</span>
            </div>
            <div className="nav-mobile-subpanel-links">
              {studySections.map((sec) => (
                <NavLink
                  key={sec.id}
                  to={`${isEnglish ? '/en' : ''}${studyListPathForSectionId(sec.id)}`}
                  className={({ isActive }) =>
                    `nav-mobile-link nav-mobile-subpanel-link${isActive ? ' active' : ''}`
                  }
                  onClick={closeMobileNav}
                >
                  {isEnglish ? studySectionLabelsEn[sec.id] ?? sec.title : sec.title}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/en" element={<HomePage language="en" />} />
        <Route path="/admin/login" element={<VisaPortalLoginPage />} />
        <Route path="/visa-portal/login" element={<VisaPortalLoginPage />} />
        <Route path="/visa-portal/auth/callback" element={<Navigate to="/visa-portal/login" replace />} />
        <Route path="/visa-portal" element={<VisaPortalPage />} />
        <Route path="/promoter-register" element={<PromoterRegisterPage />} />
        <Route path="/visa-portal/info-form" element={<VisaPortalInfoFormPage />} />
        <Route path="/visa-portal/materials" element={<VisaPortalMaterialsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* 除首页外的其它页面：上面半屏大图，下面 sidebar + 正文 */}
        <Route element={<HeroSidebarLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/en/about" element={<AboutPage language="en" />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/en/services" element={<ServicesPage language="en" />} />
          <Route path="/services/:type" element={<ServicesDetailPage />} />
          <Route path="/en/services/:type" element={<ServicesDetailPage language="en" />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/en/cases" element={<CasesPage language="en" />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/en/cases/:id" element={<CaseDetailPage language="en" />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/en/jobs" element={<JobsPage language="en" />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/en/album" element={<AlbumPage language="en" />} />
          <Route path="/album/:sectionId" element={<AlbumSectionPage />} />
          <Route path="/en/album/:sectionId" element={<AlbumSectionPage language="en" />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/en/news/:id" element={<NewsDetailPage language="en" />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/en/news" element={<NewsPage language="en" />} />
          <Route path="/contactus" element={<ContactUsPage />} />
          <Route path="/en/contactus" element={<ContactUsPage language="en" />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/en/faq" element={<FaqPage language="en" />} />
          <Route path="/promoter" element={<PromoterPage />} />
          <Route path="/en/promoter" element={<PromoterPage language="en" />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/visa-info-form" element={<VisaInfoFormPage />} />
          <Route path="/assesment" element={<Navigate to="/assessment" replace />} />
          <Route path="/study/program/:id" element={<StudyProgramDetailPage />} />
          <Route path="/en/study/program/:id" element={<StudyProgramDetailPage language="en" />} />
          <Route path="/study" element={<Navigate to="/study/University" replace />} />
          <Route path="/en/study" element={<Navigate to="/en/study/University" replace />} />
          <Route path="/study/:studyPath" element={<StudyPage />} />
          <Route path="/en/study/:studyPath" element={<StudyPage language="en" />} />
        </Route>
      </Routes>

      {showBackToTopRoute && showPageBackToTop && (
        <button
          type="button"
          className="page-back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={isEnglish ? 'Back to top' : '回到顶部'}
        >
          {isEnglish ? 'Back to top' : '回到顶部'}
        </button>
      )}

      <Footer language={isEnglish ? 'en' : 'zh'} />
    </div>
  )
}

export default App
