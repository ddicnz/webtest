import { useState } from 'react'
import { trackFormSubmit } from '../utils/analytics'

const FORM_TYPE_GENERAL = 'general'
const FORM_TYPE_STUDY = 'study'

// 联络表单接口：本地开发走 Vite 代理 /api/form-submit 避免 CORS；生产直连
const FORM_API_URL = import.meta.env.DEV
  ? '/api/form-submit'
  : 'https://6gti3uh9lj.execute-api.ap-southeast-2.amazonaws.com/default/form-submit'

function ContactUsPage() {
  const [formType, setFormType] = useState(FORM_TYPE_GENERAL)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    source: '',
    message: '',
    age: '',
    education: '',
    gender: '',
    course: '',
    planDate: '',
    studyNote: '',
    wechat: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitError(null)
  }

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      service: '',
      source: '',
      message: '',
      age: '',
      education: '',
      gender: '',
      course: '',
      planDate: '',
      studyNote: '',
      wechat: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload =
        formType === FORM_TYPE_STUDY
          ? {
              type: 'study',
              name: form.name,
              age: form.age,
              education: form.education,
              gender: form.gender,
              course: form.course,
              planDate: form.planDate,
              studyNote: form.studyNote,
              wechat: form.wechat,
              email: form.email,
            }
          : {
              type: 'general',
              name: form.name,
              email: form.email,
              phone: form.phone,
              service: form.service,
              source: form.source,
              message: form.message,
            }

      const res = await fetch(FORM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (data.ok) {
        trackFormSubmit(formType === FORM_TYPE_STUDY ? 'study' : 'contact')
        alert(formType === FORM_TYPE_STUDY ? '留学意向已提交，我们会尽快与您联系。' : '谢谢您的留言，我们会尽快联系您。')
        resetForm()
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
            <span>8 Andrew Baxter Drive, Māngere, Auckland 2022</span>
          </div>
        </div>

        <p className="contact-form-hint">如需我们主动联系您，请选择下方类型并填写表单。</p>

        <div className="contact-form-type">
          <span className="contact-form-type-label">您要咨询的是：</span>
          <div className="contact-form-type-options">
            <label className="contact-form-type-option">
              <input
                type="radio"
                name="formType"
                value={FORM_TYPE_GENERAL}
                checked={formType === FORM_TYPE_GENERAL}
                onChange={() => setFormType(FORM_TYPE_GENERAL)}
              />
              <span>一般咨询（移民 / 工签 / 其他）</span>
            </label>
            <label className="contact-form-type-option">
              <input
                type="radio"
                name="formType"
                value={FORM_TYPE_STUDY}
                checked={formType === FORM_TYPE_STUDY}
                onChange={() => setFormType(FORM_TYPE_STUDY)}
              />
              <span>留学意向</span>
            </label>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {formType === FORM_TYPE_GENERAL ? (
            <>
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
                  <label htmlFor="phone">电话/微信号</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="手机或微信号"
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
                    placeholder="例如：AEWV 工作签证、技术移民等"
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
            </>
          ) : (
            <>
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
                  <label htmlFor="age">年龄</label>
                  <input
                    id="age"
                    name="age"
                    type="text"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="如：25"
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor="education">最高学历</label>
                  <input
                    id="education"
                    name="education"
                    type="text"
                    value={form.education}
                    onChange={handleChange}
                    placeholder="如：小学、初中、高中、本科、硕士等"
                  />
                </div>
              </div>
              <div className="contact-form-row contact-form-row--three">
                <div className="contact-form-field">
                  <label htmlFor="gender">性别</label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">请选择</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div className="contact-form-field">
                  <label htmlFor="course">意向课程</label>
                  <input
                    id="course"
                    name="course"
                    type="text"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="如：建筑，工程，幼教，商科"
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor="planDate">预计出国时间</label>
                  <input
                    id="planDate"
                    name="planDate"
                    type="text"
                    value={form.planDate}
                    onChange={handleChange}
                    placeholder="如：2026年7月"
                  />
                </div>
              </div>
              <div className="contact-form-row">
                <div className="contact-form-field contact-form-field--full">
                  <label htmlFor="studyNote">其他补充信息</label>
                  <textarea
                    id="studyNote"
                    name="studyNote"
                    rows={3}
                    value={form.studyNote}
                    onChange={handleChange}
                    placeholder="可补充您的背景、目标学校或国家等"
                  />
                </div>
              </div>
              <div className="contact-form-row contact-form-row--three">
                <div className="contact-form-field">
                  <label htmlFor="wechat">微信</label>
                  <input
                    id="wechat"
                    name="wechat"
                    type="text"
                    value={form.wechat}
                    onChange={handleChange}
                    placeholder="微信号"
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
                    placeholder="常用邮箱"
                  />
                </div>
                <div className="contact-form-field" />
              </div>
            </>
          )}

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
