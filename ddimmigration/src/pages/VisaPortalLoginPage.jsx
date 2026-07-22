import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { userPool } from '../auth/cognito.js'

const initialStatus = { type: '', message: '' }

function VisaPortalLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const requestedReturnTo = new URLSearchParams(location.search).get('returnTo')
  const postLoginPath = requestedReturnTo === '/admin' ? '/admin' : '/visa-portal'
  const isAdminLogin = postLoginPath === '/admin'
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [challengeUser, setChallengeUser] = useState(null)
  const [challengeAttributes, setChallengeAttributes] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(initialStatus)

  useEffect(() => {
    const currentUser = userPool.getCurrentUser()
    if (!currentUser) return
    currentUser.getSession((error, session) => {
      if (!error && session?.isValid()) navigate(postLoginPath, { replace: true })
    })
  }, [navigate, postLoginPath])

  const resetStatus = () => setStatus(initialStatus)

  const openMode = (nextMode) => {
    setMode(nextMode)
    setPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setVerificationCode('')
    setChallengeUser(null)
    setChallengeAttributes({})
    resetStatus()
  }

  const authCallbacks = (cognitoUser) => ({
    onSuccess: () => {
      setSubmitting(false)
      navigate(postLoginPath, { replace: true })
    },
    onFailure: (error) => {
      setSubmitting(false)
      setStatus({ type: 'error', message: error?.message || '登录失败，请检查用户名和密码。' })
    },
    newPasswordRequired: (userAttributes) => {
      const attributes = { ...userAttributes }
      delete attributes.email
      delete attributes.email_verified
      setSubmitting(false)
      setChallengeUser(cognitoUser)
      setChallengeAttributes(attributes)
      setMode('new-password')
      setStatus({ type: 'info', message: '这是首次登录，请设置一个新的正式密码。' })
    },
  })

  const handleLogin = (event) => {
    event.preventDefault()
    resetStatus()
    const loginName = username.trim()
    if (!loginName || !password) {
      setStatus({ type: 'error', message: '请输入用户名和密码。' })
      return
    }

    setSubmitting(true)
    const cognitoUser = new CognitoUser({ Username: loginName, Pool: userPool })
    const authenticationDetails = new AuthenticationDetails({
      Username: loginName,
      Password: password,
    })
    cognitoUser.authenticateUser(authenticationDetails, authCallbacks(cognitoUser))
  }

  const handleNewPassword = (event) => {
    event.preventDefault()
    resetStatus()
    if (!challengeUser) {
      openMode('login')
      return
    }
    if (newPassword.length < 8) {
      setStatus({ type: 'error', message: '新密码至少需要 8 位。' })
      return
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: '两次输入的新密码不一致。' })
      return
    }

    setSubmitting(true)
    challengeUser.completeNewPasswordChallenge(
      newPassword,
      challengeAttributes,
      authCallbacks(challengeUser),
    )
  }

  const handleSignUp = (event) => {
    event.preventDefault()
    resetStatus()
    const loginName = username.trim()
    if (!loginName) {
      setStatus({ type: 'error', message: '请输入用户名。' })
      return
    }
    if (!email.trim()) {
      setStatus({ type: 'error', message: '请输入用于找回密码的邮箱。' })
      return
    }
    if (password.length < 8) {
      setStatus({ type: 'error', message: '密码至少需要 8 位。' })
      return
    }
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: '两次输入的密码不一致。' })
      return
    }

    setSubmitting(true)
    const attributes = [new CognitoUserAttribute({ Name: 'email', Value: email.trim() })]
    userPool.signUp(loginName, password, attributes, null, (error, result) => {
      setSubmitting(false)
      if (error) {
        setStatus({ type: 'error', message: error.message || '注册失败，请稍后重试。' })
        return
      }
      if (!result?.userConfirmed) {
        setStatus({ type: 'error', message: '账号尚未自动确认，请联系顾问检查 Cognito 设置。' })
        return
      }
      setMode('login')
      setPassword('')
      setConfirmPassword('')
      setStatus({ type: 'success', message: '注册成功，请使用刚才设置的用户名和密码登录。' })
    })
  }

  const handleForgotPassword = (event) => {
    event.preventDefault()
    resetStatus()
    const loginName = username.trim()
    if (!loginName) {
      setStatus({ type: 'error', message: '请输入用户名。' })
      return
    }

    setSubmitting(true)
    const cognitoUser = new CognitoUser({ Username: loginName, Pool: userPool })
    cognitoUser.forgotPassword({
      onSuccess: () => setSubmitting(false),
      onFailure: (error) => {
        setSubmitting(false)
        setStatus({ type: 'error', message: error?.message || '验证码发送失败，请稍后重试。' })
      },
      inputVerificationCode: () => {
        setSubmitting(false)
        setChallengeUser(cognitoUser)
        setMode('reset-password')
        setStatus({ type: 'info', message: '验证码已发送到注册时填写的邮箱。' })
      },
    })
  }

  const handleResetPassword = (event) => {
    event.preventDefault()
    resetStatus()
    if (!challengeUser) {
      openMode('forgot-password')
      return
    }
    if (!verificationCode.trim()) {
      setStatus({ type: 'error', message: '请输入邮箱收到的验证码。' })
      return
    }
    if (newPassword.length < 8 || newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: '请确认新密码至少 8 位，并且两次输入一致。' })
      return
    }

    setSubmitting(true)
    challengeUser.confirmPassword(verificationCode.trim(), newPassword, {
      onSuccess: () => {
        setSubmitting(false)
        setMode('login')
        setPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setVerificationCode('')
        setStatus({ type: 'success', message: '密码已更新，请使用新密码登录。' })
      },
      onFailure: (error) => {
        setSubmitting(false)
        setStatus({ type: 'error', message: error?.message || '密码重置失败，请检查验证码。' })
      },
    })
  }

  const passwordType = showPassword ? 'text' : 'password'

  return (
    <main className="visa-portal-page">
      <section className="visa-portal-login-shell" aria-labelledby="visa-portal-title">
        <div className="visa-portal-login-intro">
          <img src="/pic/logo.jpg" alt="嘀嘀移民" className="visa-portal-logo" />
          <p className="visa-portal-eyebrow">DD Immigration Client Portal</p>
          <h1 id="visa-portal-title">签证客户资料中心</h1>
          <p>登录后可继续填写个人信息，并查看后续签证材料与处理进度。</p>
          <div className="visa-portal-security-note">
            请自行设置用户名、邮箱和密码。邮箱仅用于忘记密码时找回账号。
          </div>
        </div>

        <div className="visa-portal-login-card">
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="visa-portal-form-head">
                <h2>{isAdminLogin ? '管理员登录' : '客户登录'}</h2>
                <p>{isAdminLogin ? '使用已加入管理员组的账号登录。' : '使用您注册时设置的用户名和密码登录。'}</p>
              </div>
              <label className="visa-portal-field">
                <span>用户名</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  placeholder="请输入用户名"
                />
              </label>
              <label className="visa-portal-field">
                <span>密码</span>
                <input
                  type={passwordType}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="请输入密码"
                />
              </label>
              <label className="visa-portal-show-password">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                />
                <span>显示密码</span>
              </label>
              {status.message && <p className={`visa-portal-status visa-portal-status--${status.type}`}>{status.message}</p>}
              <button type="submit" className="visa-portal-primary-btn" disabled={submitting}>
                {submitting ? '正在登录...' : '登录'}
              </button>
              <div className="visa-portal-link-actions">
                {!isAdminLogin && <button type="button" className="visa-portal-text-btn" onClick={() => openMode('sign-up')}>注册账号</button>}
                <button type="button" className="visa-portal-text-btn" onClick={() => openMode('forgot-password')}>忘记密码</button>
              </div>
            </form>
          )}

          {mode === 'sign-up' && (
            <form onSubmit={handleSignUp}>
              <div className="visa-portal-form-head">
                <h2>注册账号</h2>
                <p>设置用户名和密码，注册完成后即可登录。</p>
              </div>
              <label className="visa-portal-field">
                <span>用户名</span>
                <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="请设置用户名" />
              </label>
              <label className="visa-portal-field">
                <span>邮箱</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="用于忘记密码时找回" />
              </label>
              <label className="visa-portal-field">
                <span>密码</span>
                <input type={passwordType} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="请设置密码" />
              </label>
              <label className="visa-portal-field">
                <span>确认密码</span>
                <input type={passwordType} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder="请再次输入密码" />
              </label>
              <label className="visa-portal-show-password">
                <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
                <span>显示密码</span>
              </label>
              {status.message && <p className={`visa-portal-status visa-portal-status--${status.type}`}>{status.message}</p>}
              <button type="submit" className="visa-portal-primary-btn" disabled={submitting}>{submitting ? '正在注册...' : '注册'}</button>
              <button type="button" className="visa-portal-text-btn" onClick={() => openMode('login')}>返回登录</button>
            </form>
          )}

          {mode === 'new-password' && (
            <form onSubmit={handleNewPassword}>
              <div className="visa-portal-form-head">
                <h2>设置正式密码</h2>
                <p>临时密码只能使用一次，请设置您的新密码。</p>
              </div>
              <label className="visa-portal-field">
                <span>新密码</span>
                <input type={passwordType} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" />
              </label>
              <label className="visa-portal-field">
                <span>确认新密码</span>
                <input type={passwordType} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
              </label>
              <label className="visa-portal-show-password">
                <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
                <span>显示密码</span>
              </label>
              {status.message && <p className={`visa-portal-status visa-portal-status--${status.type}`}>{status.message}</p>}
              <button type="submit" className="visa-portal-primary-btn" disabled={submitting}>{submitting ? '正在保存...' : '设置密码并登录'}</button>
              <button type="button" className="visa-portal-text-btn" onClick={() => openMode('login')}>返回登录</button>
            </form>
          )}

          {mode === 'forgot-password' && (
            <form onSubmit={handleForgotPassword}>
              <div className="visa-portal-form-head">
                <h2>找回密码</h2>
                <p>验证码将发送到注册时填写的邮箱。</p>
              </div>
              <label className="visa-portal-field">
                <span>用户名</span>
                <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="请输入用户名" />
              </label>
              {status.message && <p className={`visa-portal-status visa-portal-status--${status.type}`}>{status.message}</p>}
              <button type="submit" className="visa-portal-primary-btn" disabled={submitting}>{submitting ? '正在发送...' : '发送找回验证码'}</button>
              <button type="button" className="visa-portal-text-btn" onClick={() => openMode('login')}>返回登录</button>
            </form>
          )}

          {mode === 'reset-password' && (
            <form onSubmit={handleResetPassword}>
              <div className="visa-portal-form-head">
                <h2>设置新密码</h2>
                <p>输入邮箱收到的验证码并设置新密码。</p>
              </div>
              <label className="visa-portal-field">
                <span>验证码</span>
                <input type="text" inputMode="numeric" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} autoComplete="one-time-code" placeholder="请输入验证码" />
              </label>
              <label className="visa-portal-field">
                <span>新密码</span>
                <input type={passwordType} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" />
              </label>
              <label className="visa-portal-field">
                <span>确认新密码</span>
                <input type={passwordType} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
              </label>
              {status.message && <p className={`visa-portal-status visa-portal-status--${status.type}`}>{status.message}</p>}
              <button type="submit" className="visa-portal-primary-btn" disabled={submitting}>{submitting ? '正在更新...' : '确认新密码'}</button>
              <button type="button" className="visa-portal-text-btn" onClick={() => openMode('login')}>返回登录</button>
            </form>
          )}

        </div>
      </section>
    </main>
  )
}

export default VisaPortalLoginPage
