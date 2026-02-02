import { Routes, Route, NavLink, Outlet } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer.jsx'
import LeftSidebar from './components/LeftSidebar.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import TeamPage from './pages/TeamPage.jsx'
import CasesPage from './pages/CasesPage.jsx'
import CaseDetailPage from './pages/CaseDetailPage.jsx'
import JobsPage from './pages/JobsPage.jsx'
import NewsPage from './pages/NewsPage.jsx'
import FeedbackPage from './pages/FeedbackPage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'

const navItems = [
  { label: '首页', path: '/' },
  { label: '关于我们', path: '/about' },
  { label: '专业团队', path: '/team' },
  { label: '成功案例', path: '/cases' },
  { label: '招聘信息', path: '/jobs' },
  { label: '移民资讯', path: '/news' },
  { label: '顾客反馈', path: '/feedback' },
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
            <a href="tel:+64-9-3033533" className="phone-num">+64-027-7223339</a>
          </div>
        </div>
      </header>

      {/* 导航栏 */}
      <nav className="nav-bar">
        <div className="nav-inner">
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
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<SidebarLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/contactus" element={<ContactUsPage />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  )
}

export default App
