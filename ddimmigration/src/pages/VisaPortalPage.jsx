import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { userPool } from '../auth/cognito.js'

function VisaPortalPage() {
  const navigate = useNavigate()
  const [sessionState, setSessionState] = useState(() => ({
    loading: Boolean(userPool.getCurrentUser()),
    authenticated: false,
    username: '',
    email: '',
  }))

  useEffect(() => {
    const currentUser = userPool.getCurrentUser()
    if (!currentUser) return undefined

    currentUser.getSession((error, session) => {
      if (error || !session?.isValid()) {
        setSessionState((current) => ({ ...current, loading: false }))
        return
      }
      const payload = session.getIdToken().payload || {}
      setSessionState({
        loading: false,
        authenticated: true,
        username: payload['cognito:username'] || currentUser.getUsername(),
        email: payload.email || '',
      })
    })
    return undefined
  }, [])

  const handleLogout = () => {
    userPool.getCurrentUser()?.signOut()
    navigate('/visa-portal/login', { replace: true })
  }

  if (sessionState.loading) {
    return <main className="visa-portal-page"><p className="visa-portal-loading">正在验证登录状态...</p></main>
  }
  if (!sessionState.authenticated) return <Navigate to="/visa-portal/login" replace />

  return (
    <main className="visa-portal-page">
      <section className="visa-portal-dashboard">
        <header className="visa-portal-dashboard-head">
          <div>
            <p className="visa-portal-eyebrow">DD Immigration Client Portal</p>
            <h1>签证客户资料中心</h1>
            <p>您好，{sessionState.username}{sessionState.email ? `（${sessionState.email}）` : ''}</p>
          </div>
          <button type="button" className="visa-portal-secondary-btn" onClick={handleLogout}>退出登录</button>
        </header>
        <div className="visa-portal-dashboard-grid">
          <section className="visa-portal-dashboard-item">
            <h2>个人信息表</h2>
            <p>查看并继续完善您的签证个人信息。</p>
            <span>即将接入</span>
          </section>
          <section className="visa-portal-dashboard-item">
            <h2>签证材料</h2>
            <p>上传护照、工作、学历及家庭相关材料。</p>
            <span>即将开放</span>
          </section>
          <section className="visa-portal-dashboard-item">
            <h2>材料进度</h2>
            <p>查看材料审核状态与顾问补充说明。</p>
            <span>即将开放</span>
          </section>
        </div>
      </section>
    </main>
  )
}

export default VisaPortalPage
