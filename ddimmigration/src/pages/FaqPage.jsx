import { useState } from 'react'
import { faqList } from '../data/faqData.js'

function FaqPage() {
  const [openId, setOpenId] = useState(null)

  return (
    <main className="main-content faq-page">
      <h1 className="faq-title">常见问题</h1>
      <p className="faq-intro">以下是大家常问的工签、留学与家庭规划问题，供您参考。如需一对一咨询，欢迎通过「联络我们」与我们联系。</p>
      <div className="faq-list">
        {faqList.map((item) => (
          <div
            key={item.id}
            className={`faq-item${openId === item.id ? ' faq-item--open' : ''}`}
          >
            <button
              type="button"
              className="faq-question"
              aria-expanded={openId === item.id}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              <span className="faq-question-text">{item.question}</span>
              <span className="faq-question-icon" aria-hidden>+</span>
            </button>
            <div className="faq-answer-wrap">
              <div className="faq-answer">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default FaqPage
