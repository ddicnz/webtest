import { useState } from 'react'

// 联络表单接口：本地开发走 Vite 代理 /api/form-submit 避免 CORS；生产直连
const FORM_API_URL = import.meta.env.DEV
  ? '/api/form-submit'
  : 'https://6gti3uh9lj.execute-api.ap-southeast-2.amazonaws.com/default/form-submit'

function ContactUsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    source: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch(FORM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          source: form.source,
          message: form.message,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.ok) {
        alert('谢谢您的留言，我们会尽快联系您。')
        setForm({ name: '', email: '', phone: '', service: '', source: '', message: '' })
      } else {
        setSubmitError(data.error || '提交失败，请稍后重试。')
      }
    } catch (err) {
      setSubmitError('网络错误，请检查网络后重试。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="main-content contact-page">
      <section className="contact-right">
        <h1 className="contact-title">联系我们</h1>

        <div className="contact-details">
          <div className="contact-detail-row">
            <span className="contact-detail-label">电话：</span>
            <span>+64-027-7223339</span>
          </div>
          <div className="contact-detail-row">
            <span className="contact-detail-label">微信号码：</span>
            <span>ddtrip700、ddtrip800、ddtrip999</span>
          </div>
          <div className="contact-detail-row">
            <span className="contact-detail-label">客服邮箱：</span>
            <span>dd.icnz@gmail.com</span>
          </div>
          <div className="contact-detail-row">
            <span className="contact-detail-label">地址：</span>
            <span>Auckland, Māngere, Andrew Baxter Dr, NZ 2022</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-row contact-form-row--three">
            <div className="contact-form-field">
              <label htmlFor="name">姓名</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="请输入您的姓名"
              />
            </div>
            <div className="contact-form-field">
              <label htmlFor="email">邮箱</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="请输入常用邮箱"
              />
            </div>
            <div className="contact-form-field">
              <label htmlFor="phone">微信号</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                placeholder="请输入微信号"
              />
            </div>
          </div>

          <div className="contact-form-row">
            <div className="contact-form-field contact-form-field--full">
              <label htmlFor="service">您想咨询的业务</label>
              <input
                id="service"
                name="service"
                type="text"
                value={form.service}
                onChange={handleChange}
                placeholder="例如：AEWV 工作签证、技术移民、留学规划等"
              />
            </div>
          </div>

          <div className="contact-form-row">
            <div className="contact-form-field contact-form-field--full">
              <label htmlFor="source">您从哪里知道我们？</label>
              <input
                id="source"
                name="source"
                type="text"
                value={form.source}
                onChange={handleChange}
                placeholder="例如：朋友推荐、小红书、公众号、官网等"
              />
            </div>
          </div>

          <div className="contact-form-row">
            <div className="contact-form-field contact-form-field--full">
              <label htmlFor="message">留言板</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="请简单描述您的情况和问题，我们会根据内容安排合适的顾问联系您。"
              />
            </div>
          </div>

          {submitError && (
            <p className="contact-form-error" role="alert">
              {submitError}
            </p>
          )}
          <div className="contact-form-actions">
            <button
              type="submit"
              className="contact-form-submit"
              disabled={submitting}
            >
              {submitting ? '发送中…' : '发送 →'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default ContactUsPage

