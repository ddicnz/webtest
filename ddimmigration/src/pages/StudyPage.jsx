import { useState } from 'react'
import { studyIntro, studySections, iclPrograms } from '../data/studyData.js'

// 大学留学用 ICL 课程（排除语言班，语言班单独成类）
const iclProgramsNonLanguage = iclPrograms.filter((p) => p.type !== '语言班')

const studyCategories = studySections.map((s) => ({ id: s.id, label: s.title }))
const studySlogan = '新西兰嘀嘀移民是持牌校代免费申请！！！'

function StudySectionContent({ section }) {
  const sec = studySections.find((s) => s.id === section.id)
  if (!sec) return null

  return (
    <div className="study-section-content">
      {sec.paragraphs.map((p, i) => {
        const isLast = i === sec.paragraphs.length - 1
        if (isLast && p.includes(studySlogan)) {
          const baseText = p.replace(studySlogan, '').trim()
          return (
            <p key={i}>
              {baseText} <strong>{studySlogan}</strong>
            </p>
          )
        }
        return <p key={i}>{p}</p>
      })}
      {sec.id === 'tertiary' && (
        <>
          <p className="study-section-intro">具体费用与入学要求以校方及官网为准，如需申请可联络我们协助。<strong>新西兰嘀嘀移民是持牌校代免费申请！！！</strong></p>
          <div className="study-program-list">
            {iclProgramsNonLanguage.map((prog) => (
              <article key={prog.id} className="study-program-card">
                <div className="study-program-card-image-wrap">
                  <img src={prog.image} alt={prog.titleZh} className="study-program-card-image" />
                  <span className="study-program-card-type">{prog.type}</span>
                </div>
                <div className="study-program-card-body">
                  <h3 className="study-program-card-title">{prog.titleZh}</h3>
                  <p className="study-program-card-title-en">{prog.titleEn}</p>
                  {prog.highlight && (
                    <p className="study-program-card-highlight">{prog.highlight}</p>
                  )}
                  <p className="study-program-card-cost">{prog.cost}</p>
                  {prog.costNote && (
                    <p className="study-program-card-cost-note">{prog.costNote}</p>
                  )}
                  {prog.detail && (
                    <p className="study-program-card-detail">{prog.detail}</p>
                  )}
                  <dl className="study-program-card-meta">
                    <dt>语言要求</dt>
                    <dd>{prog.languageReq}</dd>
                    <dt>学术要求</dt>
                    <dd>{prog.academicReq}</dd>
                    <dt>入学时间</dt>
                    <dd>{prog.intakes}</dd>
                  </dl>
                  <div className="study-program-card-prospects">
                    <strong>毕业前景</strong>
                    <ul>
                      {prog.prospects.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {sec.universities && (
            <>
              <h3 className="study-section-intro" style={{ marginTop: '28px', marginBottom: '12px' }}>新西兰八所国立大学简介</h3>
              <ul className="study-university-list">
                {sec.universities.map((u, i) => (
                  <li key={i} className="study-university-item">
                    <div className="study-university-header">
                      <span className="study-university-name">{u.name}</span>
                      {u.qs && <span className="study-university-qs">{u.qs}</span>}
                    </div>
                    <span className="study-university-en">{u.en}</span>
                    <p className="study-university-brief">{u.brief}</p>
                    {u.points && (
                      <ul className="study-university-points">
                        {u.points.map((text, idx) => (
                          <li key={idx}>{text}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
      {sec.id === 'technical' && sec.programs && (
        <>
          <p className="study-section-intro">具体费用与入学要求以校方及官网为准，如需申请可联络我们协助。<strong>新西兰嘀嘀移民是持牌校代免费申请！！！</strong></p>
          <div className="study-program-list">
            {sec.programs.map((prog) => (
              <article key={prog.id} className="study-program-card">
                <div className="study-program-card-image-wrap">
                  <img src={prog.image} alt={prog.titleZh} className="study-program-card-image" />
                  <span className="study-program-card-type">{prog.type}</span>
                </div>
                <div className="study-program-card-body">
                  <h3 className="study-program-card-title">{prog.titleZh}</h3>
                  <p className="study-program-card-title-en">{prog.titleEn}</p>
                  {prog.highlight && (
                    <p className="study-program-card-highlight">{prog.highlight}</p>
                  )}
                  <p className="study-program-card-cost">{prog.cost}</p>
                  {prog.costNote && (
                    <p className="study-program-card-cost-note">{prog.costNote}</p>
                  )}
                  {prog.detail && (
                    <p className="study-program-card-detail">{prog.detail}</p>
                  )}
                  <dl className="study-program-card-meta">
                    <dt>语言要求</dt>
                    <dd>{prog.languageReq}</dd>
                    <dt>学术要求</dt>
                    <dd>{prog.academicReq}</dd>
                    <dt>入学时间</dt>
                    <dd>{prog.intakes}</dd>
                  </dl>
                  <div className="study-program-card-prospects">
                    <strong>毕业前景</strong>
                    <ul>
                      {prog.prospects.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {sec.id === 'language' && sec.programs && (
        <>
          <p className="study-section-intro">具体费用与入学要求以校方及官网为准，如需申请可联络我们协助。<strong>新西兰嘀嘀移民是持牌校代免费申请！！！</strong></p>
          <div className="study-program-list study-program-list--language">
            {sec.programs.map((prog) => (
              <article key={prog.id} className="study-program-card">
                <div className={`study-program-card-image-wrap${prog.image2 ? ' study-program-card-image-wrap--dual' : ''}`}>
                  <img src={prog.image} alt={prog.titleZh} className="study-program-card-image" />
                  {prog.image2 && (
                    <img src={prog.image2} alt={`${prog.titleZh} 费用`} className="study-program-card-image" />
                  )}
                  <span className="study-program-card-type">{prog.type}</span>
                </div>
                <div className="study-program-card-body">
                  <h3 className="study-program-card-title">{prog.titleZh}</h3>
                  <p className="study-program-card-title-en">{prog.titleEn}</p>
                  {prog.highlight && (
                    <p className="study-program-card-highlight">{prog.highlight}</p>
                  )}
                  <p className="study-program-card-cost">{prog.cost}</p>
                  {prog.costNote && (
                    <p className="study-program-card-cost-note">{prog.costNote}</p>
                  )}
                  {prog.detail && (
                    <p className="study-program-card-detail">{prog.detail}</p>
                  )}
                  <dl className="study-program-card-meta">
                    {prog.schedule && (
                      <>
                        <dt>上课时间</dt>
                        <dd>{prog.schedule}</dd>
                      </>
                    )}
                    <dt>语言要求</dt>
                    <dd>{prog.languageReq}</dd>
                    <dt>学术要求</dt>
                    <dd>{prog.academicReq}</dd>
                    <dt>入学时间</dt>
                    <dd>{prog.intakes}</dd>
                  </dl>
                  <div className="study-program-card-prospects">
                    <strong>毕业前景</strong>
                    <ul>
                      {prog.prospects.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {sec.id === 'secondary' && sec.routes && (
        <div className="study-secondary-routes">
          <h3 className="study-secondary-routes-heading">升学路径规划</h3>
          {sec.routes.map((route, idx) => (
            <article key={idx} className="study-secondary-route">
              <h3 className="study-secondary-route-title">{route.title}</h3>
              {route.tagline && (
                <p className="study-secondary-route-tagline">{route.tagline}</p>
              )}
              {route.points && (
                <ul className="study-secondary-route-points">
                  {route.points.map((text, i2) => (
                    <li key={i2}>{text}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function StudyPage() {
  const [selectedCategory, setSelectedCategory] = useState(studySections[0].id)

  const currentSection = studySections.find((s) => s.id === selectedCategory)

  return (
    <main className="main-content study-page">
      <h1 className="study-page-title">留学专栏</h1>

      <div className="study-intro-block">
        {studyIntro.paragraphs.map((p, i) => {
          if (i === studyIntro.paragraphs.length - 1) {
            const slogan = '新西兰持牌中介免费申请学校！'
            const baseText = p.replace(slogan, '').trim()
            return (
              <p key={i}>
                {baseText} <strong>{slogan}</strong>
              </p>
            )
          }
          return <p key={i}>{p}</p>
        })}
      </div>

      <nav className="study-category-nav" aria-label="留学分类">
        {studyCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`study-category-link ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {currentSection && (
        <section className="study-section">
          <h2 className="study-section-title">{currentSection.title}</h2>
          <StudySectionContent section={currentSection} />
        </section>
      )}

      <p className="study-page-cta">
        如需针对个人情况的留学方案与申请协助，欢迎通过本站「联络我们」填写留学意向，或致电/微信联系我们。
      </p>
    </main>
  )
}

export default StudyPage
