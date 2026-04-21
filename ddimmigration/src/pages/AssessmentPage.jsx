import { useCallback, useEffect, useRef, useState } from 'react'

const CHATBOT_URL =
  'https://fp8pbtb4t9.execute-api.ap-southeast-2.amazonaws.com/default/chatbot'

const STORAGE_KEY = 'ddimmigration_assessment_submissions'

function saveSessionLocally(payload) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    list.push(payload)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('assessment local save failed', e)
  }
}

async function postChatbot(body) {
  const res = await fetch(CHATBOT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`接口返回非 JSON（HTTP ${res.status}）`)
  }
  if (!res.ok) {
    const msg = data?.message || data?.error || text || `请求失败 ${res.status}`
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
  return data
}

function AssessmentPage() {
  const sessionIdRef = useRef(
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  )
  const messageKeyRef = useRef(0)
  const initStartedRef = useRef(false)

  const [messages, setMessages] = useState([])
  const [currentNode, setCurrentNode] = useState('start')
  const [answers, setAnswers] = useState({})
  const [input, setInput] = useState('')
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const composerRef = useRef(null)

  const appendMessage = useCallback((sender, text) => {
    const key = ++messageKeyRef.current
    setMessages((prev) => [...prev, { key, sender, text }])
  }, [])

  /** 每次交互后，把发送区稳定到视口约 80% 高度（距底部约 20%） */
  const keepComposerInView = useCallback(() => {
    requestAnimationFrame(() => {
      const composer = composerRef.current
      if (!composer) return
      const rect = composer.getBoundingClientRect()
      const targetY = window.innerHeight * 0.8
      const delta = rect.bottom - targetY
      if (Math.abs(delta) > 6) {
        window.scrollBy({ top: delta, behavior: 'smooth' })
      }
    })
  }, [])

  useEffect(() => {
    keepComposerInView()
  }, [messages, loading, keepComposerInView])

  const applyBotResponse = useCallback(
    (data) => {
      if (import.meta.env.DEV && data?.intentMeta != null) {
        console.debug('[chatbot] intentMeta', data.intentMeta)
      }
      if (data?.sessionId != null && String(data.sessionId)) {
        sessionIdRef.current = String(data.sessionId)
      }
      const reply = data?.reply != null ? String(data.reply).trim() : ''
      const nextQuestion =
        data?.nextQuestion != null ? String(data.nextQuestion).trim() : ''
      if (reply) appendMessage('bot', reply)
      // start → work_job 等节点可能把承接语放在 reply、具体问题放在 nextQuestion，需两条都展示
      if (nextQuestion && nextQuestion !== reply) {
        appendMessage('bot', nextQuestion)
      }

      if (data?.nextNode != null) setCurrentNode(String(data.nextNode))
      if (data?.answers != null && typeof data.answers === 'object') {
        setAnswers(data.answers)
      }

      if (data?.done === true) {
        setCompleted(true)
        appendMessage('bot', '👉 添加微信：NZDDVisa（获取完整方案）')
        saveSessionLocally({
          sessionId: data.sessionId || sessionIdRef.current,
          createdAt: new Date().toISOString(),
          answers: data.answers || {},
          intent: data.intent,
          subType: data.subType,
          intentMeta: data.intentMeta,
        })
      }
    },
    [appendMessage],
  )

  const runRequest = useCallback(
    async ({ node, message, answersSnapshot }) => {
      setError(null)
      setLoading(true)
      try {
        const data = await postChatbot({
          sessionId: sessionIdRef.current,
          currentNode: node,
          message: message ?? '',
          answers: answersSnapshot && typeof answersSnapshot === 'object' ? answersSnapshot : {},
        })
        applyBotResponse(data)
        return data
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setError(msg)
        appendMessage('bot', `暂时无法连接服务，请稍后重试。（${msg}）`)
        throw e
      } finally {
        setLoading(false)
      }
    },
    [applyBotResponse, appendMessage],
  )

  // 第一步：初始化（message 空串、answers 空对象）
  useEffect(() => {
    if (initStartedRef.current) return
    initStartedRef.current = true
    ;(async () => {
      try {
        await runRequest({
          node: 'start',
          message: '',
          answersSnapshot: {},
        })
      } catch {
        /* error 已在 runRequest 中展示 */
      }
    })()
  }, [runRequest])

  const handleSend = async (raw) => {
    if (completed || loading) return
    const text = String(raw ?? '').trim()
    if (!text) return

    appendMessage('user', text)
    setInput('')

    try {
      await runRequest({
        node: currentNode,
        message: text,
        answersSnapshot: answers,
      })
    } catch {
      /* 已展示错误气泡 */
    }
  }

  const handleRetryInit = () => {
    setMessages([])
    setError(null)
    setCompleted(false)
    setCurrentNode('start')
    setAnswers({})
    messageKeyRef.current = 0
    sessionIdRef.current = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    setLoading(true)
    ;(async () => {
      try {
        await runRequest({
          node: 'start',
          message: '',
          answersSnapshot: {},
        })
      } catch {
        /* */
      }
    })()
  }

  return (
    <main className="main-content assessment-page">
      <h1 className="assessment-page-title">工签条件快速评估</h1>
      <p className="assessment-page-intro">
        通过对话快速了解你的背景与可能路径。本工具为状态机问卷，回答仅供参考，不构成法律意见；个案请以持牌顾问与移民局为准。
      </p>

      <div className="assessment-chat">
        <div
          className="assessment-messages"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {loading && messages.length === 0 && (
            <div className="assessment-row assessment-row--bot">
              <div className="assessment-bubble assessment-bubble--bot assessment-bubble--muted">
                正在连接评估…
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.key}
              className={`assessment-row assessment-row--${m.sender}`}
            >
              <div className={`assessment-bubble assessment-bubble--${m.sender}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && messages.length > 0 && (
            <div className="assessment-row assessment-row--bot">
              <div className="assessment-bubble assessment-bubble--bot assessment-bubble--muted">
                …
              </div>
            </div>
          )}
        </div>

        <div ref={composerRef} className="assessment-composer">
          {error && messages.length === 0 && (
            <div className="assessment-error-banner">
              <span>无法开始评估</span>
              <button type="button" className="assessment-retry" onClick={handleRetryInit}>
                重试
              </button>
            </div>
          )}
          <form
            className="assessment-input-row"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void handleSend(input)
            }}
          >
            <input
              type="text"
              className="assessment-input"
              placeholder={
                completed
                  ? '评估已完成'
                  : loading
                    ? '请稍候…'
                    : '输入你的回答…'
              }
              value={input}
              disabled={completed || loading}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              maxLength={500}
            />
            <button
              type="submit"
              className="assessment-send"
              disabled={completed || loading || !input.trim()}
            >
              {loading ? '发送中' : '发送'}
            </button>
          </form>
        </div>
      </div>

      <p className="assessment-page-note">
        对话由云端状态机处理：每次请求会携带 sessionId、currentNode、message、answers；请使用接口返回的
        nextNode 与 answers 继续下一步，直到 done 为 true。流程结束后会在本机保存一条摘要（localStorage 键名{' '}
        <code className="assessment-code">{STORAGE_KEY}</code>
        ），便于后续对接 CRM。
      </p>
    </main>
  )
}

export default AssessmentPage
