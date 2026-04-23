import { useCallback, useEffect, useRef, useState } from 'react'

const CHATBOT_URL =
  'https://fp8pbtb4t9.execute-api.ap-southeast-2.amazonaws.com/default/chatbot'
const STORE_CHAT_URL =
  'https://0cl4deawsa.execute-api.ap-southeast-2.amazonaws.com/default/storeChat'

/** 第二步 AI 优化建议（可选）：在 .env 设置 VITE_ASSESSMENT_AI_URL */
const ASSESSMENT_AI_URL = String(
  import.meta.env.VITE_ASSESSMENT_AI_URL ||
    'https://kgg8jzu048.execute-api.ap-southeast-2.amazonaws.com/default/aiagent',
).trim()

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

async function postAiReply(body) {
  if (!ASSESSMENT_AI_URL) {
    return { aiReply: null }
  }
  const res = await fetch(ASSESSMENT_AI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`AI 接口返回非 JSON（HTTP ${res.status}）`)
  }
  if (!res.ok) {
    const msg = data?.message || data?.error || text || `请求失败 ${res.status}`
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
  return data
}

async function postStoreChat(body) {
  const sanitizeForStore = (value) => {
    if (value == null) return value
    if (Array.isArray(value)) return value.map(sanitizeForStore)
    if (typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, sanitizeForStore(v)]),
      )
    }
    // DynamoDB（boto3）不接受 Python float，先把小数转字符串
    if (typeof value === 'number' && !Number.isInteger(value)) {
      return String(value)
    }
    return value
  }

  const res = await fetch(STORE_CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sanitizeForStore(body)),
  })
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    // store 接口即使不是 json 也不影响主流程
  }
  if (!res.ok) {
    if (import.meta.env.DEV) {
      console.error('storeChat response body:', data)
    }
    const msg =
      data?.detail ||
      data?.message ||
      data?.error ||
      text ||
      `请求失败 ${res.status}`
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
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState(null)
  const composerRef = useRef(null)
  const inputRef = useRef(null)

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
  }, [messages, loading, aiLoading, keepComposerInView])

  // 每次下一题出来后自动聚焦输入框，用户可直接继续输入
  useEffect(() => {
    if (loading || completed) return
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }, [messages, loading, completed])

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
      if (reply && data?.done !== true) appendMessage('bot', reply)
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
        setAiLoading(true)

        const mergedAnswers =
          data.answers != null && typeof data.answers === 'object' ? data.answers : {}
        const wechatVal = String(mergedAnswers.wechat ?? '').trim()
        // 优先使用 chatbot.reply；若后端把最终文案放在 nextQuestion，也作为兜底
        const baseReply = reply || nextQuestion || null

        saveSessionLocally({
          sessionId: data.sessionId || sessionIdRef.current,
          createdAt: new Date().toISOString(),
          answers: mergedAnswers,
          summary: data.summary,
          subType: data.subType,
          intent: data.intent,
          intentMeta: data.intentMeta,
          reply: baseReply,
        })

        const sessionId = data.sessionId || sessionIdRef.current
        const intent = data.intent || 'unknown'
        const subType = data.subType || null
        const summary =
          data.summary != null && typeof data.summary === 'object' ? data.summary : {}
        if (import.meta.env.DEV) {
          console.log('final chatbot result:', data)
          console.log('summary to save:', summary)
        }

        void (async () => {
          let aiReply = null
          let aiSummary = null
          let aiAssessment = null
          let displayedReply = false
          try {
            const aiResult = await postAiReply({
              sessionId,
              intent,
              answers: mergedAnswers,
              summary,
              reply: baseReply,
            })
            if (aiResult?.ok === true) {
              const candidate =
                aiResult?.aiReply ?? aiResult?.reply ?? aiResult?.text ?? null
              if (candidate != null && String(candidate).trim()) {
                aiReply = String(candidate).trim()
                appendMessage('bot', aiReply)
                displayedReply = true
              }
              aiSummary = aiResult?.aiSummary ?? null
              aiAssessment = aiResult?.aiAssessment ?? null
              if (aiSummary != null) {
                const summaryText =
                  typeof aiSummary === 'string'
                    ? aiSummary.trim()
                    : JSON.stringify(aiSummary, null, 2)
                if (summaryText) {
                  appendMessage('bot', summaryText)
                }
              }
            }
          } catch (e) {
            aiReply = null
            aiSummary = null
            aiAssessment = null
            if (import.meta.env.DEV) console.warn('ai reply failed', e)
          }

          if (!displayedReply && baseReply) {
            appendMessage('bot', baseReply)
          }

          try {
            const storePayload = {
              sessionId,
              intent,
              done: true,
              answers: mergedAnswers,
              summary,
              subType,
              reply: baseReply,
              aiReply,
              aiSummary,
              aiAssessment,
              leadStatus: 'new',
            }
            console.log('storeChat payload =', storePayload)
            if (!storePayload.reply) {
              console.warn('storeChat payload reply is empty:', storePayload)
            }
            await postStoreChat(storePayload)
            if (wechatVal) {
              appendMessage('bot', '感谢留下联系方式，我们会尽快与您联系，也可添加微信：ddtrip999 或 ddtrip700（获取完整方案）')
            } else {
              appendMessage('bot', '若想进一步沟通，也可添加微信：ddtrip999 或 ddtrip700（获取完整方案）')
            }
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e)
            if (import.meta.env.DEV) console.warn('storeChat failed', e)
            appendMessage('bot', `评估记录保存失败：${msg}`)
          } finally {
            setAiLoading(false)
          }
        })()
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
    setAiLoading(false)
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
      <h1 className="assessment-page-title">签证条件快速评估</h1>
      <p className="assessment-page-intro">
        通过对话快速了解你的背景与可能路径。回答仅供参考，不构成法律意见；个案请以持牌顾问与移民局为准。
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
          {aiLoading && (
            <div className="assessment-row assessment-row--bot">
              <div className="assessment-bubble assessment-bubble--bot assessment-bubble--muted">
                评估中，请稍候…
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
              ref={inputRef}
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
              disabled={completed}
              readOnly={loading}
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

    </main>
  )
}

export default AssessmentPage
