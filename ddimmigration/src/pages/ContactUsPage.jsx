import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OFFICE_ADDRESS } from '../data/siteContact.js'
import { trackFormSubmit } from '../utils/analytics'

const FORM_TYPE_GENERAL = 'general'
const FORM_TYPE_STUDY = 'study'

// 联络表单接口：本地开发走 Vite 代理 /api/form-submit 避免 CORS；生产直连
const FORM_API_URL = import.meta.env.DEV
  ? '/api/form-submit'
  : 'https://6gti3uh9lj.execute-api.ap-southeast-2.amazonaws.com/default/form-submit'

const ORBIT_PROTECT_PARENT_BOOST_URL = 'https://quoting.orbitprotect.com/parent-boost?referrer=6598'
const ORBIT_PROTECT_PARENT_BOOST_BANNER = 'https://affiliates.orbitprotect.com/api/banner/image/6/300250.png'

const contactCopy = {
  zh: {
    title: '联系我们', phone: '电话：', wechatNumber: '微信号码：', email: '客服邮箱：', address: '地址：',
    adAria: 'Orbit Protect Parent Boost 保险广告',
    hint: '如需我们主动联系您，请选择下方类型并填写表单。', typeLabel: '您要咨询的是：',
    generalType: '一般咨询（移民 / 工签 / 其他）', studyType: '留学意向', visaForm: '签证个人信息表',
    name: '姓名', namePlaceholder: '请输入您的姓名', emailField: '邮箱', emailPlaceholder: '请输入常用邮箱',
    contactMethod: '微信号', contactMethodPlaceholder: '微信号', service: '您想咨询的业务',
    servicePlaceholder: '例如：AEWV 工作签证、技术移民等', source: '您从哪里知道我们？',
    sourcePlaceholder: '例如：朋友推荐、小红书、公众号、官网等', message: '留言板',
    messagePlaceholder: '请简单描述您的情况和问题，我们会根据内容安排合适的顾问联系您。',
    age: '年龄', agePlaceholder: '如：25', education: '最高学历',
    educationPlaceholder: '如：小学、初中、高中、本科、硕士等', gender: '性别', select: '请选择', male: '男', female: '女',
    course: '意向课程', coursePlaceholder: '如：建筑，工程，幼教，商科', planDate: '预计出国时间',
    planDatePlaceholder: '如：2026年7月', studyNote: '其他补充信息',
    studyNotePlaceholder: '可补充您的背景、目标学校或国家等', wechat: '微信', wechatPlaceholder: '微信号',
    studySuccess: '留学意向已提交，我们会尽快与您联系。', generalSuccess: '谢谢您的留言，我们会尽快联系您。',
    submitError: '提交失败，请稍后重试。', networkError: '网络错误，请检查网络后重试。', sending: '发送中…', send: '发送 →',
  },
  en: {
    title: 'Contact Us', phone: 'Phone:', wechatNumber: 'WeChat:', email: 'Email:', address: 'Address:',
    adAria: 'Orbit Protect Parent Boost insurance advertisement',
    hint: 'If you would like us to contact you, select an enquiry type and complete the form below.',
    typeLabel: 'What would you like to discuss?', generalType: 'General enquiry (immigration / work visas / other)',
    studyType: 'Study enquiry', visaForm: 'Visa Information Form', name: 'Name', namePlaceholder: 'Enter your name',
    emailField: 'Email', emailPlaceholder: 'Enter your email address', contactMethod: 'Phone / WeChat',
    contactMethodPlaceholder: 'Enter your phone number or WeChat ID', service: 'Service you are interested in',
    servicePlaceholder: 'e.g. AEWV work visa or skilled residence', source: 'How did you hear about us?',
    sourcePlaceholder: 'e.g. Referral, RedNote, WeChat or our website', message: 'Message',
    messagePlaceholder: 'Briefly describe your circumstances and questions so we can arrange the right adviser to contact you.',
    age: 'Age', agePlaceholder: 'e.g. 25', education: 'Highest qualification',
    educationPlaceholder: 'e.g. High school, bachelor’s degree or master’s degree', gender: 'Gender',
    select: 'Please select', male: 'Male', female: 'Female', course: 'Preferred course',
    coursePlaceholder: 'e.g. Construction, engineering, early childhood education or business',
    planDate: 'Planned start date', planDatePlaceholder: 'e.g. July 2026', studyNote: 'Additional information',
    studyNotePlaceholder: 'Tell us about your background, preferred school, course or destination',
    wechat: 'WeChat', wechatPlaceholder: 'Enter your WeChat ID',
    studySuccess: 'Thank you. Your study enquiry has been submitted and we will contact you soon.',
    generalSuccess: 'Thank you for your message. We will contact you soon.',
    submitError: 'Submission failed. Please try again later.', networkError: 'Network error. Please check your connection and try again.',
    sending: 'Sending…', send: 'Send →',
  },
}

function ContactUsPage({ language = 'zh' }) {
  const copy = contactCopy[language] ?? contactCopy.zh
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
        alert(formType === FORM_TYPE_STUDY ? copy.studySuccess : copy.generalSuccess)
        resetForm()
      } else {
        setSubmitError(data.error || copy.submitError)
      }
    } catch {
      setSubmitError(copy.networkError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="main-content contact-page">
      <section className="contact-right">
        <h1 className="contact-title">{copy.title}</h1>

        <div className="contact-top-row">
          <div className="contact-details">
            <div className="contact-detail-row">
              <span className="contact-detail-label">{copy.phone}</span>
              <span>+64-027-7223339</span>
            </div>
            <div className="contact-detail-row">
              <span className="contact-detail-label">{copy.wechatNumber}</span>
              <span>ddtrip700、ddtrip800、ddtrip999</span>
            </div>
            <div className="contact-detail-row">
              <span className="contact-detail-label">{copy.email}</span>
              <span>dd.icnz@gmail.com</span>
            </div>
            <div className="contact-detail-row">
              <span className="contact-detail-label">{copy.address}</span>
              <span>{OFFICE_ADDRESS}</span>
            </div>
          </div>

          <a
            className="contact-banner-ad"
            href={ORBIT_PROTECT_PARENT_BOOST_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={copy.adAria}
          >
            <img src={ORBIT_PROTECT_PARENT_BOOST_BANNER} alt="Parent Boost" />
          </a>
        </div>

        <p className="contact-form-hint">{copy.hint}</p>

        <div className="contact-form-type">
          <span className="contact-form-type-label">{copy.typeLabel}</span>
          <div className="contact-form-type-options">
            <label className="contact-form-type-option">
              <input
                type="radio"
                name="formType"
                value={FORM_TYPE_GENERAL}
                checked={formType === FORM_TYPE_GENERAL}
                onChange={() => setFormType(FORM_TYPE_GENERAL)}
              />
              <span>{copy.generalType}</span>
            </label>
            <label className="contact-form-type-option">
              <input
                type="radio"
                name="formType"
                value={FORM_TYPE_STUDY}
                checked={formType === FORM_TYPE_STUDY}
                onChange={() => setFormType(FORM_TYPE_STUDY)}
              />
              <span>{copy.studyType}</span>
            </label>
            <Link className="contact-form-type-link" to="/visa-info-form">
              {copy.visaForm}
            </Link>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {formType === FORM_TYPE_GENERAL ? (
            <>
              <div className="contact-form-row contact-form-row--three">
                <div className="contact-form-field">
                  <label htmlFor="name">{copy.name}</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={copy.namePlaceholder}
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor="email">{copy.emailField}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={copy.emailPlaceholder}
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor="phone">{copy.contactMethod}</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={copy.contactMethodPlaceholder}
                  />
                </div>
              </div>
              <div className="contact-form-row">
                <div className="contact-form-field contact-form-field--full">
                  <label htmlFor="service">{copy.service}</label>
                  <input
                    id="service"
                    name="service"
                    type="text"
                    value={form.service}
                    onChange={handleChange}
                    placeholder={copy.servicePlaceholder}
                  />
                </div>
              </div>
              <div className="contact-form-row">
                <div className="contact-form-field contact-form-field--full">
                  <label htmlFor="source">{copy.source}</label>
                  <input
                    id="source"
                    name="source"
                    type="text"
                    value={form.source}
                    onChange={handleChange}
                    placeholder={copy.sourcePlaceholder}
                  />
                </div>
              </div>
              <div className="contact-form-row">
                <div className="contact-form-field contact-form-field--full">
                  <label htmlFor="message">{copy.message}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={copy.messagePlaceholder}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="contact-form-row contact-form-row--three">
                <div className="contact-form-field">
                  <label htmlFor="name">{copy.name}</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={copy.namePlaceholder}
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor="age">{copy.age}</label>
                  <input
                    id="age"
                    name="age"
                    type="text"
                    value={form.age}
                    onChange={handleChange}
                    placeholder={copy.agePlaceholder}
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor="education">{copy.education}</label>
                  <input
                    id="education"
                    name="education"
                    type="text"
                    value={form.education}
                    onChange={handleChange}
                    placeholder={copy.educationPlaceholder}
                  />
                </div>
              </div>
              <div className="contact-form-row contact-form-row--three">
                <div className="contact-form-field">
                  <label htmlFor="gender">{copy.gender}</label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">{copy.select}</option>
                    <option value="男">{copy.male}</option>
                    <option value="女">{copy.female}</option>
                  </select>
                </div>
                <div className="contact-form-field">
                  <label htmlFor="course">{copy.course}</label>
                  <input
                    id="course"
                    name="course"
                    type="text"
                    value={form.course}
                    onChange={handleChange}
                    placeholder={copy.coursePlaceholder}
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor="planDate">{copy.planDate}</label>
                  <input
                    id="planDate"
                    name="planDate"
                    type="text"
                    value={form.planDate}
                    onChange={handleChange}
                    placeholder={copy.planDatePlaceholder}
                  />
                </div>
              </div>
              <div className="contact-form-row">
                <div className="contact-form-field contact-form-field--full">
                  <label htmlFor="studyNote">{copy.studyNote}</label>
                  <textarea
                    id="studyNote"
                    name="studyNote"
                    rows={3}
                    value={form.studyNote}
                    onChange={handleChange}
                    placeholder={copy.studyNotePlaceholder}
                  />
                </div>
              </div>
              <div className="contact-form-row contact-form-row--three">
                <div className="contact-form-field">
                  <label htmlFor="wechat">{copy.wechat}</label>
                  <input
                    id="wechat"
                    name="wechat"
                    type="text"
                    value={form.wechat}
                    onChange={handleChange}
                    placeholder={copy.wechatPlaceholder}
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor="email">{copy.emailField}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={copy.emailPlaceholder}
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
              {submitting ? copy.sending : copy.send}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default ContactUsPage
