import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentCognitoSession, userPool } from '../auth/cognito.js'
import VisaInfoFormPage from './VisaInfoFormPage.jsx'

function VisaPortalInfoFormPage() {
  const [authState, setAuthState] = useState({ loading: true, sub: '' })

  useEffect(() => {
    let cancelled = false

    getCurrentCognitoSession()
      .then((session) => {
        if (cancelled) return
        const payload = session.getIdToken().payload || {}
        setAuthState({ loading: false, sub: payload.sub || '' })
      })
      .catch(() => {
        if (!cancelled) setAuthState({ loading: false, sub: '' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (authState.loading) {
    return <main className="visa-portal-page"><p className="visa-portal-loading">正在读取客户资料...</p></main>
  }

  if (!authState.sub || !userPool.getCurrentUser()) {
    return <Navigate to="/visa-portal/login" replace />
  }

  return <VisaInfoFormPage portalUserSub={authState.sub} />
}

export default VisaPortalInfoFormPage
