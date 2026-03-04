import { studyIntro, studySections, iclPrograms } from '../data/studyData.js'

function StudyPage() {
  const anchorItems = [
    { id: studyIntro.id, label: studyIntro.title },
    ...studySections.map((s) => ({ id: s.id, label: s.title })),
  ]

  return (
    <main className="main-content study-page">
      <h1 className="study-page-title">留学专栏</h1>

      <nav className="study-anchor-nav" aria-label="本页导航">
        {anchorItems.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="study-anchor-link">
            {item.label}
          </a>
        ))}
      </nav>

      <section id={studyIntro.id} className="study-section">
        <h2 className="study-section-title">{studyIntro.title}</h2>
        <div className="study-section-content">
          {studyIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {studySections.map((section) => (
        <section key={section.id} id={section.id} className="study-section">
          <h2 className="study-section-title">{section.title}</h2>
          <div className="study-section-content">
            {section.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {section.id === 'tertiary' && (
              <>
                <p className="study-section-intro">具体费用与入学要求以校方及官网为准，如需申请可联络我们协助。</p>
                <div className="study-program-list">
                  {iclPrograms.map((prog) => (
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
            {section.id === 'secondary' && section.routes && (
              <div className="study-secondary-routes">
                <h3 className="study-secondary-routes-heading">升学路径规划</h3>
                {section.routes.map((route, idx) => (
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

            {section.universities && (
              <ul className="study-university-list">
                {section.universities.map((u, i) => (
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
            )}
          </div>
        </section>
      ))}

      <p className="study-page-cta">
        如需针对个人情况的留学方案与申请协助，欢迎通过本站「联络我们」填写留学意向，或致电/微信联系我们。
      </p>
    </main>
  )
}

export default StudyPage
