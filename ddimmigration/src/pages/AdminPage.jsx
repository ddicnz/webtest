import { useEffect, useMemo, useState } from 'react'

const SHOW_ALL_ANSWER_URL =
  'https://y6imnkbld5.execute-api.ap-southeast-2.amazonaws.com/default/showAllanswer'

const TAB_OPTIONS = [
  { id: 'work_visa', label: '工签' },
  { id: 'student_visa', label: '学签' },
  { id: 'visitor_visa', label: '旅游签' },
]

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

function WorkVisaCard({ item }) {
  const answers = item.answers || {}
  const summary = item.summary || {}
  return (
    <article className="admin-lead-card">
      <header className="admin-lead-header">
        <h3 className="admin-lead-title">{displayValue(item.job)}</h3>
        <p className="admin-lead-time">{formatTime(item.createdAt)}</p>
      </header>
      <div className="admin-lead-grid">
        <p><strong>微信：</strong>{displayValue(item.wechat)}</p>
        <p><strong>地区：</strong>{displayValue(item.location)}</p>
        <p><strong>年龄：</strong>{displayValue(item.age)}</p>
        <p><strong>学历：</strong>{displayValue(item.education)}</p>
        <p><strong>路径：</strong>{displayValue(summary.subTypeLabel) !== '-' ? displayValue(summary.subTypeLabel) : formatWorkSubType(item.subType || summary.subType)}</p>
        <p><strong>可行性：</strong>{displayValue(item.feasibility || summary.feasibility)}</p>
        <p><strong>风险：</strong>{displayValue(item.riskLevel || summary.riskLevel)}</p>
        <p><strong>评分：</strong>{displayValue(item.score || summary.score)}</p>
        <p><strong>职业：</strong>{displayValue(answers.job)}</p>
        <p><strong>24个月材料：</strong>{displayValue(answers.materials_24m)}</p>
        <p><strong>材料明细：</strong>{displayValue(answers.materials_detail)}</p>
        <p><strong>证书：</strong>{displayValue(answers.certificate)}</p>
        <p><strong>拒签史：</strong>{displayValue(answers.refusal_history)}</p>
        <p><strong>犯罪记录：</strong>{displayValue(answers.criminal_history)}</p>
      </div>
      <details className="admin-lead-details">
        <summary>查看原始 answers / summary</summary>
        <pre>{JSON.stringify({ answers: item.answers || {}, summary }, null, 2)}</pre>
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
        <h3 className="admin-lead-title">{displayValue(item.major || summary.major)}</h3>
        <p className="admin-lead-time">{formatTime(item.createdAt)}</p>
      </header>
      <div className="admin-lead-grid">
        <p><strong>微信：</strong>{displayValue(item.wechat)}</p>
        <p><strong>地区：</strong>{displayValue(item.location)}</p>
        <p><strong>年龄：</strong>{displayValue(item.age)}</p>
        <p><strong>学校层级：</strong>{displayValue(item.schoolLevel || summary.schoolLevel)}</p>
        <p><strong>最高学历：</strong>{displayValue(item.highestEducation || summary.highestEducation)}</p>
        <p><strong>推荐路径：</strong>{displayValue(summary.recommendedPathLabel) !== '-' ? displayValue(summary.recommendedPathLabel) : formatRecommendedPath(item.recommendedPath || summary.recommendedPath)}</p>
        <p><strong>资产证明：</strong>{displayValue(item.fundsProof || summary.fundsProof || answers.student_funds_proof)}</p>
        <p><strong>年龄：</strong>{displayValue(answers.student_age)}</p>
        <p><strong>最高学历：</strong>{displayValue(answers.student_highest_education)}</p>
        <p><strong>英语成绩：</strong>{displayValue(answers.student_english)}</p>
        <p><strong>拒签史：</strong>{displayValue(answers.student_refusal_history)}</p>
        <p><strong>专业方向：</strong>{displayValue(answers.student_major)}</p>
        <p><strong>当前所在地：</strong>{displayValue(answers.student_location)}</p>
        <p><strong>犯罪记录：</strong>{displayValue(answers.student_criminal_history)}</p>
        <p><strong>目标学历：</strong>{displayValue(answers.student_school_level)}</p>
      </div>
      <details className="admin-lead-details">
        <summary>查看原始 answers / summary</summary>
        <pre>{JSON.stringify({ answers: item.answers || {}, summary }, null, 2)}</pre>
      </details>
    </article>
  )
}

function VisitorVisaCard({ item }) {
  const answers = item.answers || {}
  const summary = item.summary || {}
  return (
    <article className="admin-lead-card">
      <header className="admin-lead-header">
        <h3 className="admin-lead-title">{displayValue(summary.type || item.intent)}</h3>
        <p className="admin-lead-time">{formatTime(item.createdAt)}</p>
      </header>
      <div className="admin-lead-grid">
        <p><strong>微信：</strong>{displayValue(item.wechat)}</p>
        <p><strong>地区：</strong>{displayValue(item.location || summary.location)}</p>
        <p><strong>资产证明：</strong>{displayValue(summary.assetsProof)}</p>
        <p><strong>资产识别：</strong>{displayValue(summary.assetsProofDetected)}</p>
        <p><strong>拒签史：</strong>{displayValue(summary.refusal)}</p>
        <p><strong>拒签原因：</strong>{displayValue(summary.refusalReason)}</p>
        <p><strong>犯罪原因：</strong>{displayValue(summary.criminalReason)}</p>
        <p><strong>可行性：</strong>{displayValue(summary.feasibility || item.feasibility)}</p>
        <p><strong>风险：</strong>{displayValue(summary.riskLevel || item.riskLevel)}</p>
        <p><strong>评分：</strong>{displayValue(summary.score || item.score)}</p>
        <p><strong>资产证明：</strong>{displayValue(answers.visitor_assets_proof)}</p>
        <p><strong>犯罪记录：</strong>{displayValue(answers.visitor_criminal_history)}</p>
        <p><strong>拒签史：</strong>{displayValue(answers.visitor_refusal_history)}</p>
        <p><strong>当前所在地：</strong>{displayValue(answers.visitor_location)}</p>
      </div>
      <details className="admin-lead-details">
        <summary>查看原始 answers / summary</summary>
        <pre>{JSON.stringify({ answers: item.answers || {}, summary }, null, 2)}</pre>
      </details>
    </article>
  )
}

function renderCard(intent, item) {
  if (intent === 'work_visa') return <WorkVisaCard key={item.sessionId} item={item} />
  if (intent === 'student_visa') return <StudentVisaCard key={item.sessionId} item={item} />
  return <VisitorVisaCard key={item.sessionId} item={item} />
}

function AdminPage() {
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

  useEffect(() => {
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
  }, [])

  const currentItems = useMemo(() => grouped[activeTab] || [], [grouped, activeTab])

  return (
    <main className="main-content admin-page">
      <h1 className="admin-title">后台回答管理</h1>

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
    </main>
  )
}

export default AdminPage
