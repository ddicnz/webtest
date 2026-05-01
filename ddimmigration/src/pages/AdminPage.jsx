import { useEffect, useMemo, useState } from 'react'

const SHOW_ALL_ANSWER_URL =
  'https://y6imnkbld5.execute-api.ap-southeast-2.amazonaws.com/default/showAllanswer'
const SHOW_SURVEY_URL =
  'https://m0swbhpph9.execute-api.ap-southeast-2.amazonaws.com/default/showSurvey'
const ADMIN_PASSWORD = 'Ddtrip800'
const ADMIN_UNLOCK_KEY = 'ddimmigration_admin_unlocked'
const SURVEY_PAGE_SIZE = 20

const TAB_OPTIONS = [
  { id: 'work_visa', label: '工签' },
  { id: 'student_visa', label: '学签' },
  { id: 'visitor_visa', label: '旅游签' },
]

function buildPageItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const items = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push('ellipsis-left')
  for (let i = start; i <= end; i += 1) items.push(i)
  if (end < total - 1) items.push('ellipsis-right')
  items.push(total)
  return items
}

function displayValue(value) {
  if (value == null || value === '') return '-'
  if (typeof value === 'boolean') return value ? '是' : '否'
  return String(value)
}

function formatTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString('zh-CN', { hour12: false })
}

function formatRecommendedPath(value) {
  const raw = displayValue(value)
  const map = {
    master_with_language: '硕士+语言班路径',
    master_direct: '硕士直录路径',
    bachelor_pathway: '本科路径',
    diploma_pathway: '大专文凭路径',
    language_only: '纯语言课程路径',
  }
  return map[raw] || raw
}

function formatWorkSubType(value) {
  const raw = displayValue(value)
  const map = {
    chef_pathway: '厨师路径',
    welder_pathway: '焊工路径',
    carpenter_pathway: '木工路径',
    automotive_pathway: '汽修路径',
    construction_pathway: '建筑路径',
    care_pathway: '护理路径',
    electrician_pathway: '电工路径',
    plumber_pathway: '水工路径',
    general_work_visa: '通用工签路径',
  }
  return map[raw] || raw
}

function getRiskToneClass(value) {
  const raw = String(value || '').trim()
  if (raw === '高') return 'admin-level admin-level--risk-high'
  if (raw === '中') return 'admin-level admin-level--risk-mid'
  if (raw === '低') return 'admin-level admin-level--risk-low'
  return 'admin-level'
}

function getFeasibilityToneClass(value) {
  const raw = String(value || '').trim()
  if (raw === '高') return 'admin-level admin-level--feas-high'
  if (raw === '中') return 'admin-level admin-level--feas-mid'
  if (raw === '低') return 'admin-level admin-level--feas-low'
  return 'admin-level'
}

function buildChatbotResult(item) {
  return {
    sessionId: item.sessionId ?? null,
    intent: item.intent ?? null,
    done: true,
    reply: item.reply ?? null,
    answers: item.answers || {},
    summary: item.summary || {},
    subType: item.subType ?? null,
  }
}

function WorkVisaCard({ item }) {
  const answers = item.answers || {}
  const summary = item.summary || {}
  const feasibility = displayValue(item.feasibility || summary.feasibility)
  const riskLevel = displayValue(item.riskLevel || summary.riskLevel)
  const refusalReason = displayValue(summary.refusalReason || answers.refusal_reason)
  return (
    <article className="admin-lead-card">
      <header className="admin-lead-header">
        <h3 className="admin-lead-title">微信号：{displayValue(item.wechat)}</h3>
        <p className="admin-lead-time">{formatTime(item.createdAt)}</p>
      </header>
      <div className="admin-lead-grid">
        <p><strong>微信：</strong>{displayValue(item.wechat)}</p>
        <p><strong>地区：</strong>{displayValue(item.location)}</p>
        <p><strong>年龄：</strong>{displayValue(item.age)}</p>
        <p><strong>学历：</strong>{displayValue(item.education || summary.education || answers.education)}</p>
        <p><strong>职业：</strong>{displayValue(item.job || summary.job || answers.job)}</p>
        <p><strong>路径：</strong>{displayValue(summary.subTypeLabel) !== '-' ? displayValue(summary.subTypeLabel) : formatWorkSubType(item.subType || summary.subType)}</p>
        <p><strong>24个月材料：</strong>{displayValue(answers.materials_24m)}</p>
        <p><strong>材料明细：</strong>{displayValue(answers.materials_detail)}</p>
        <p><strong>证书：</strong>{displayValue(answers.certificate)}</p>
        <p><strong>拒签史：</strong>{displayValue(answers.refusal_history)}</p>
        <p><strong>拒签原因：</strong>{refusalReason}</p>
        <p><strong>犯罪记录：</strong>{displayValue(answers.criminal_history)}</p>
        <p><strong>评分：</strong>{displayValue(item.score || summary.score)}</p>
        <p><strong>风险：</strong><span className={getRiskToneClass(riskLevel)}>{riskLevel}</span></p>
        <p><strong>可行性：</strong><span className={getFeasibilityToneClass(feasibility)}>{feasibility}</span></p>
        <p className="admin-advice admin-advice--base"><strong>基础建议：</strong>{displayValue(item.reply)}</p>
        <p className="admin-advice admin-advice--ai"><strong>AI优化建议：</strong>{displayValue(item.aiReply)}</p>
      </div>
      <details className="admin-lead-details">
        <summary>查看原始 answers / summary</summary>
        <pre>
          {JSON.stringify(
            {
              chatbotResult: buildChatbotResult(item),
              answers: item.answers || {},
              summary,
            },
            null,
            2,
          )}
        </pre>
      </details>
    </article>
  )
}

function StudentVisaCard({ item }) {
  const answers = item.answers || {}
  const summary = item.summary || {}
  return (
    <article className="admin-lead-card">
      <header className="admin-lead-header">
        <h3 className="admin-lead-title">微信号：{displayValue(item.wechat)}</h3>
        <p className="admin-lead-time">{formatTime(item.createdAt)}</p>
      </header>
      <div className="admin-lead-grid">
        <p><strong>微信：</strong>{displayValue(item.wechat)}</p>
        <p><strong>当前所在地：</strong>{displayValue(item.location || summary.location || answers.student_location)}</p>
        <p><strong>年龄：</strong>{displayValue(item.age || answers.student_age)}</p>
        <p><strong>最高学历：</strong>{displayValue(item.highestEducation || summary.highestEducation || answers.student_highest_education)}</p>
        <p><strong>目标学历：</strong>{displayValue(item.schoolLevel || summary.schoolLevel || answers.student_school_level)}</p>
        <p><strong>申请专业：</strong>{displayValue(item.major || summary.major || answers.student_major)}</p>
        <p><strong>英语成绩：</strong>{displayValue(answers.student_english)}</p>
        <p><strong>资产证明：</strong>{displayValue(item.fundsProof || summary.fundsProof || answers.student_funds_proof)}</p>
        <p><strong>拒签史：</strong>{displayValue(answers.student_refusal_history)}</p>
        <p><strong>犯罪记录：</strong>{displayValue(answers.student_criminal_history)}</p>
        <p><strong>推荐路径：</strong>{displayValue(summary.recommendedPathLabel) !== '-' ? displayValue(summary.recommendedPathLabel) : formatRecommendedPath(item.recommendedPath || summary.recommendedPath)}</p>
        <p className="admin-advice admin-advice--base"><strong>基础建议：</strong>{displayValue(item.reply)}</p>
        <p className="admin-advice admin-advice--ai"><strong>AI优化建议：</strong>{displayValue(item.aiReply)}</p>
      </div>
      <details className="admin-lead-details">
        <summary>查看原始 answers / summary</summary>
        <pre>
          {JSON.stringify(
            {
              chatbotResult: buildChatbotResult(item),
              answers: item.answers || {},
              summary,
            },
            null,
            2,
          )}
        </pre>
      </details>
    </article>
  )
}

function yesNoDetected(value) {
  if (value === true || value === 'true' || value === 1) return '有'
  if (value === false || value === 'false' || value === 0) return '无'
  if (value == null || value === '') return '-'
  return String(value)
}

function VisitorVisaCard({ item }) {
  const answers = item.answers || {}
  const summary = item.summary || {}
  const feasibility = displayValue(summary.feasibility || item.feasibility)
  const riskLevel = displayValue(summary.riskLevel || item.riskLevel)
  const criminalHistory = displayValue(answers.visitor_criminal_history)
  const criminalReason = displayValue(summary.criminalReason)

  const bankProof = displayValue(item.bankProof || answers.visitor_bank_proof)
  const depositProof = displayValue(item.depositProof || answers.visitor_deposit_proof)
  const assetsProof = displayValue(
    item.assetsProof || answers.visitor_assets_proof || summary.assetsProof,
  )
  const bankDetected = yesNoDetected(
    item.bankProofDetected ?? summary.bankProofDetected,
  )
  const depositDetected = yesNoDetected(
    item.depositProofDetected ?? summary.depositProofDetected,
  )
  const assetsDetected = yesNoDetected(
    item.assetsProofDetected ?? summary.assetsProofDetected,
  )

  return (
    <article className="admin-lead-card">
      <header className="admin-lead-header">
        <h3 className="admin-lead-title">微信号：{displayValue(item.wechat)}</h3>
        <p className="admin-lead-time">{formatTime(item.createdAt)}</p>
      </header>
      <div className="admin-lead-grid">
        <p><strong>微信：</strong>{displayValue(item.wechat)}</p>
        <p><strong>地区：</strong>{displayValue(item.location || summary.location)}</p>
        <p><strong>银行流水/工资：</strong>{bankProof}</p>
        <p><strong>流水是否有：</strong>{bankDetected}</p>
        <p><strong>存款证明：</strong>{depositProof}</p>
        <p><strong>存款是否有：</strong>{depositDetected}</p>
        <p><strong>资产（房车）：</strong>{assetsProof}</p>
        <p><strong>资产是否有：</strong>{assetsDetected}</p>
        <p><strong>拒签史：</strong>{displayValue(summary.refusal)}</p>
        <p><strong>拒签原因：</strong>{displayValue(summary.refusalReason)}</p>
        <p><strong>犯罪记录：</strong>{criminalHistory}</p>
        <p><strong>犯罪原因：</strong>{criminalReason}</p>
        <p><strong>当前所在地：</strong>{displayValue(answers.visitor_location)}</p>
        <p><strong>评分：</strong>{displayValue(summary.score || item.score)}</p>
        <p><strong>风险：</strong><span className={getRiskToneClass(riskLevel)}>{riskLevel}</span></p>
        <p><strong>可行性：</strong><span className={getFeasibilityToneClass(feasibility)}>{feasibility}</span></p>
        <p className="admin-advice admin-advice--base"><strong>基础建议：</strong>{displayValue(item.reply)}</p>
        <p className="admin-advice admin-advice--ai"><strong>AI优化建议：</strong>{displayValue(item.aiReply)}</p>
      </div>
      <details className="admin-lead-details">
        <summary>查看原始 answers / summary</summary>
        <pre>
          {JSON.stringify(
            {
              chatbotResult: buildChatbotResult(item),
              answers: item.answers || {},
              summary,
            },
            null,
            2,
          )}
        </pre>
      </details>
    </article>
  )
}

function renderCard(intent, item) {
  if (intent === 'work_visa') return <WorkVisaCard key={item.sessionId} item={item} />
  if (intent === 'student_visa') return <StudentVisaCard key={item.sessionId} item={item} />
  return <VisitorVisaCard key={item.sessionId} item={item} />
}

function SurveyCard({ item }) {
  return (
    <article className="admin-lead-card">
      <header className="admin-lead-header">
        <h3 className="admin-lead-title">姓名：{displayValue(item.name)}</h3>
        <p className="admin-lead-time">{formatTime(item.createdAt)}</p>
      </header>
      <div className="admin-lead-grid">
        <p><strong>姓名：</strong>{displayValue(item.name)}</p>
        <p><strong>邮箱：</strong>{displayValue(item.email)}</p>
        <p><strong>微信号：</strong>{displayValue(item.phone)}</p>
        <p><strong>业务：</strong>{displayValue(item.service)}</p>
        <p><strong>来源：</strong>{displayValue(item.source)}</p>
        <p><strong>时间：</strong>{formatTime(item.createdAt)}</p>
        <p className="admin-advice admin-advice--base"><strong>留言：</strong>{displayValue(item.message)}</p>
      </div>
    </article>
  )
}

function AdminPage() {
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [authorized, setAuthorized] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_UNLOCK_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [activeView, setActiveView] = useState('answers')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('work_visa')
  const [grouped, setGrouped] = useState({
    work_visa: [],
    student_visa: [],
    visitor_visa: [],
  })
  const [counts, setCounts] = useState({
    work_visa: 0,
    student_visa: 0,
    visitor_visa: 0,
  })
  const [surveyItems, setSurveyItems] = useState([])
  const [surveyLastKey, setSurveyLastKey] = useState(null)
  const [surveyLoading, setSurveyLoading] = useState(false)
  const [surveyError, setSurveyError] = useState('')
  const [surveyLoaded, setSurveyLoaded] = useState(false)
  const [surveyPage, setSurveyPage] = useState(1)

  useEffect(() => {
    if (!authorized) return
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(SHOW_ALL_ANSWER_URL)
        const data = await res.json()
        if (!res.ok || data?.ok !== true) {
          throw new Error(data?.detail || data?.error || `HTTP ${res.status}`)
        }
        setGrouped({
          work_visa: data?.grouped?.work_visa || [],
          student_visa: data?.grouped?.student_visa || [],
          visitor_visa: data?.grouped?.visitor_visa || [],
        })
        setCounts({
          work_visa: data?.counts?.work_visa || 0,
          student_visa: data?.counts?.student_visa || 0,
          visitor_visa: data?.counts?.visitor_visa || 0,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [authorized])

  const loadSurvey = async (lastKey = null, append = false) => {
    setSurveyLoading(true)
    setSurveyError('')
    try {
      const url = new URL(SHOW_SURVEY_URL)
      if (lastKey && typeof lastKey === 'object') {
        url.searchParams.set('lastKey', JSON.stringify(lastKey))
      }
      const res = await fetch(url.toString())
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.detail || data?.error || `HTTP ${res.status}`)
      }
      const nextItems = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
      const nextKey =
        !Array.isArray(data) &&
        data?.lastKey &&
        typeof data.lastKey === 'object' &&
        Object.keys(data.lastKey).length > 0
          ? data.lastKey
          : null
      setSurveyItems((prev) => (append ? [...prev, ...nextItems] : nextItems))
      setSurveyLastKey(nextKey)
      setSurveyLoaded(true)
      if (!append) setSurveyPage(1)
    } catch (e) {
      setSurveyError(e instanceof Error ? e.message : String(e))
    } finally {
      setSurveyLoading(false)
    }
  }

  useEffect(() => {
    if (!authorized || activeView !== 'survey' || surveyLoaded) return
    void loadSurvey(null, false)
  }, [authorized, activeView, surveyLoaded])

  const currentItems = useMemo(() => grouped[activeTab] || [], [grouped, activeTab])
  const visibleSurveyItems = useMemo(
    () => surveyItems.slice((surveyPage - 1) * SURVEY_PAGE_SIZE, surveyPage * SURVEY_PAGE_SIZE),
    [surveyItems, surveyPage],
  )
  const totalSurveyPages = Math.max(1, Math.ceil(surveyItems.length / SURVEY_PAGE_SIZE))
  const hasLocalNextPage = surveyPage < totalSurveyPages

  const goSurveyPage = async (targetPage) => {
    if (targetPage < 1) return
    if (targetPage <= totalSurveyPages) {
      setSurveyPage(targetPage)
      return
    }
    if (targetPage === totalSurveyPages + 1 && surveyLastKey && !surveyLoading) {
      await loadSurvey(surveyLastKey, true)
      setSurveyPage(targetPage)
    }
  }

  const handleAuth = (e) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthorized(true)
      setAuthError('')
      try {
        sessionStorage.setItem(ADMIN_UNLOCK_KEY, 'true')
      } catch {
        // ignore
      }
      return
    }
    setAuthError('密码错误，请重试。')
  }

  if (!authorized) {
    return (
      <main className="main-content admin-page">
        <h1 className="admin-title">后台回答管理</h1>
        <form className="admin-auth-form" onSubmit={handleAuth}>
          <label htmlFor="admin-password" className="admin-auth-label">请输入管理密码</label>
          <input
            id="admin-password"
            type="password"
            className="admin-auth-input"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            autoComplete="off"
            placeholder="请输入密码"
          />
          <button type="submit" className="admin-auth-btn">进入后台</button>
          {authError ? <p className="admin-error">{authError}</p> : null}
        </form>
      </main>
    )
  }

  return (
    <main className="main-content admin-page">
      <h1 className="admin-title">后台回答管理</h1>
      <nav className="admin-tabs" aria-label="后台模块">
        <button
          type="button"
          className={`admin-tab-btn${activeView === 'answers' ? ' active' : ''}`}
          onClick={() => setActiveView('answers')}
        >
          后台回答管理
        </button>
        <button
          type="button"
          className={`admin-tab-btn${activeView === 'survey' ? ' active' : ''}`}
          onClick={() => setActiveView('survey')}
        >
          Survey 数据
        </button>
      </nav>

      {activeView === 'answers' ? (
        <>
          <section className="admin-stats">
            <article className="admin-stat-card">
              <h2>工签</h2>
              <p>{counts.work_visa}</p>
            </article>
            <article className="admin-stat-card">
              <h2>学签</h2>
              <p>{counts.student_visa}</p>
            </article>
            <article className="admin-stat-card">
              <h2>旅游签</h2>
              <p>{counts.visitor_visa}</p>
            </article>
          </section>

          <nav className="admin-tabs" aria-label="回答分类">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`admin-tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {loading && <p className="admin-loading">加载中...</p>}
          {!loading && error && <p className="admin-error">加载失败：{error}</p>}

          {!loading && !error && (
            <section className="admin-list">
              {currentItems.length === 0 ? (
                <p className="admin-empty">当前分类暂无数据。</p>
              ) : (
                currentItems.map((item) => renderCard(activeTab, item))
              )}
            </section>
          )}
        </>
      ) : (
        <>
          {surveyLoading && surveyItems.length === 0 && <p className="admin-loading">加载中...</p>}
          {!surveyLoading && surveyError && <p className="admin-error">加载失败：{surveyError}</p>}
          {!surveyLoading && !surveyError && (
            <section className="admin-list">
              {visibleSurveyItems.length === 0 ? (
                <p className="admin-empty">当前暂无 Survey 数据。</p>
              ) : (
                visibleSurveyItems.map((item, idx) => (
                  <SurveyCard key={`${item.createdAt || 'survey'}-${idx}`} item={item} />
                ))
              )}
            </section>
          )}
          <div className="admin-survey-actions">
            <nav className="cases-pagination" aria-label="Survey 分页">
              <button
                type="button"
                className="cases-pagination-nav"
                disabled={surveyLoading || surveyPage <= 1}
                onClick={() => void goSurveyPage(surveyPage - 1)}
              >
                上一页
              </button>

              {buildPageItems(surveyPage, totalSurveyPages).map((item) =>
                typeof item === 'number' ? (
                  <button
                    key={item}
                    type="button"
                    className={`cases-pagination-page${item === surveyPage ? ' active' : ''}`}
                    onClick={() => void goSurveyPage(item)}
                    aria-current={item === surveyPage ? 'page' : undefined}
                    disabled={surveyLoading}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="cases-pagination-ellipsis" aria-hidden="true">
                    ...
                  </span>
                ),
              )}

              <button
                type="button"
                className="cases-pagination-nav"
                disabled={surveyLoading || (!hasLocalNextPage && !surveyLastKey)}
                onClick={() => void goSurveyPage(surveyPage + 1)}
              >
                下一页
              </button>
            </nav>
          </div>
        </>
      )}
    </main>
  )
}

export default AdminPage
