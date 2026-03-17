import { useState } from 'react'
import { faqList } from '../data/faqData.js'

const faqCategories = [
  { id: 'work', label: '工签相关' },
  { id: 'study', label: '留学相关' },
  { id: 'visitor', label: '旅游签' },
  { id: 'skilled', label: '技术移民' },
  { id: 'invest', label: '投资移民' },
  { id: 'other', label: '其他' },
]

function FaqPage() {
  const [openId, setOpenId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('work')

  const filteredList = faqList.filter((item) => (item.category || 'other') === selectedCategory)

  return (
    <main className="main-content faq-page">
      <h1 className="faq-title">常见问题</h1>
      <p className="faq-intro">以下是大家常问的工签、留学与家庭规划问题，供您参考。如需一对一咨询，欢迎通过「联络我们」与我们联系。</p>

      <nav className="faq-category-nav" aria-label="问题分类">
        {faqCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`faq-category-link ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(cat.id)
              setOpenId(null)
            }}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <div className="faq-list">
        {filteredList.map((item) => (
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
              <div className="faq-answer">
                {item.tableData ? (
                  <>
                    <p className="faq-answer-title">新西兰常见签证费用一览（2026 参考）</p>
                    <div className="faq-fee-table-wrap">
                      <table className="faq-fee-table">
                        <thead>
                          <tr>
                            <th>分类</th>
                            <th>签证/项目</th>
                            <th>费用</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.tableData.map((group, i) =>
                            group.rows.map((row, j) => (
                              <tr key={`${i}-${j}`}>
                                {j === 0 ? (
                                  <td rowSpan={group.rows.length} className="faq-fee-category">{group.category}</td>
                                ) : null}
                                <td>{row.name}</td>
                                <td>{row.fee}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="faq-answer-note">{item.answer}</p>
                  </>
                ) : (
                  item.answer
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default FaqPage
