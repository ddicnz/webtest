import { useEffect } from 'react'
import { NavLink, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom'
import { studyIntro, studySections, iclPrograms } from '../data/studyData.js'
import WestlakeGirlsPoster from '../components/WestlakeGirlsPoster.jsx'
import RangitotoPoster from '../components/RangitotoPoster.jsx'
import AucklandSchoolsPoster from '../components/AucklandSchoolsPoster.jsx'
import { makeStudyProgramSlug } from '../utils/studySlug.js'
import { studyListPathForSectionId, studyPathSegmentToSectionId } from '../utils/studySectionPath.js'
import { englishStudyIntro, englishStudySectionLabels, getEnglishStudyProgram, getEnglishStudySection } from '../i18n/englishStudyContent.js'

// 大学留学用 ICL 课程（排除语言班，语言班单独成类）
const iclProgramsNonLanguage = iclPrograms.filter((p) => p.type !== '语言班')
const aucklandSchoolsPosterIds = new Set([
  'auckland-grammar-school',
  'macleans-college',
  'epsom-girls-grammar-school',
  'takapuna-grammar-school',
])

const studyCategories = studySections.map((s) => ({ id: s.id, label: s.title, labelEn: englishStudySectionLabels[s.id] }))
const studySlogan = '新西兰嘀嘀移民是持牌校代免费申请！！！'

function getStudyListPath(sectionId, isEnglish) {
  return `${isEnglish ? '/en' : ''}${studyListPathForSectionId(sectionId)}`
}

function StudyProgramLink({ prog, sectionId, className, children, isEnglish }) {
  const navigate = useNavigate()
  const to = `${isEnglish ? '/en' : ''}/study/program/${encodeURIComponent(makeStudyProgramSlug(prog))}`
  const go = () => navigate(to, { state: { fromSection: sectionId, scrollY: window.scrollY } })
  return (
    <a href={to} className={className} onClick={(e) => { e.preventDefault(); go() }}>
      {children}
    </a>
  )
}

function StudySectionContent({ section, isEnglish }) {
  const sourceSection = studySections.find((s) => s.id === section.id)
  const sec = isEnglish ? getEnglishStudySection(sourceSection) : sourceSection
  if (!sec) return null

  const labels = isEnglish ? {
    currentInfo: 'Fees and entry requirements must be confirmed with the education provider. Contact us for application support.',
    agency: 'DD Immigration can assist with eligible school applications as an authorised education agent.',
    tuition: 'Tuition and fees:',
    requirements: 'Entry requirements:',
    language: 'English: ',
    schedule: 'Timetable:',
    highlights: 'Key points:',
    prospects: 'Possible outcomes:',
    more: 'View details',
    universities: 'New Zealand public universities',
    routes: 'Study pathway planning',
  } : null

  const tertiaryPrograms = isEnglish
    ? iclProgramsNonLanguage.map((program) => getEnglishStudyProgram(program, 'tertiary'))
    : iclProgramsNonLanguage

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
          <p className="study-section-intro">{isEnglish ? labels.currentInfo : '具体费用与入学要求以校方及官网为准，如需申请可联络我们协助。'}<strong>{isEnglish ? ` ${labels.agency}` : '新西兰嘀嘀移民是持牌校代免费申请！！！'}</strong></p>
          <div className="cases-list">
            {tertiaryPrograms.map((prog) => (
              <article key={prog.id} className="case-card case-card--study">
                <div className="case-card-image-wrap">
                  <img src={prog.coverImage || prog.image} alt={prog.titleZh} className="case-card-image" loading="lazy" />
                </div>
                <div className="case-card-body">
                  <h3 className="case-card-title">{prog.titleZh}</h3>
                  <div className="case-card-cost">
                    <strong>{isEnglish ? labels.tuition : '学费：'}</strong>
                    {(prog.cost || '').split('\n').filter(Boolean).map((line, i) => (
                      <p key={i} className="case-card-cost-line">{line}</p>
                    ))}
                  </div>
                  <p className="case-card-requirements"><strong>{isEnglish ? labels.requirements : '基本要求：'}</strong>{isEnglish ? '' : '语言 '}{prog.languageReq}{isEnglish ? ' ' : '；'}{prog.academicReq}</p>
                  {prog.schedule && <p className="case-card-schedule"><strong>{isEnglish ? labels.schedule : '上课时间：'}</strong>{prog.schedule}</p>}
                  <div className="case-card-highlights">
                    <strong>{isEnglish ? labels.highlights : '优势重点：'}</strong>
                    <ul>
                      {prog.prospects.slice(0, 4).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <StudyProgramLink prog={prog} sectionId={sec.id} className="case-card-link" isEnglish={isEnglish}>
                    {isEnglish ? labels.more : '查看更多'} &gt;&gt;
                  </StudyProgramLink>
                </div>
              </article>
            ))}
          </div>
          {sec.universities && (
            <>
              <h3 className="study-section-intro" style={{ marginTop: '28px', marginBottom: '12px' }}>{isEnglish ? labels.universities : '新西兰八所国立大学简介'}</h3>
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
          <p className="study-section-intro">{isEnglish ? labels.currentInfo : '具体费用与入学要求以校方及官网为准，如需申请可联络我们协助。'}<strong>{isEnglish ? ` ${labels.agency}` : '新西兰嘀嘀移民是持牌校代免费申请！！！'}</strong></p>
          <div className="cases-list">
            {sec.programs.map((prog) => (
              <article key={prog.id} className="case-card case-card--study">
                <div className="case-card-image-wrap">
                  <img src={prog.coverImage || prog.image} alt={prog.titleZh} className="case-card-image" loading="lazy" />
                </div>
                <div className="case-card-body">
                  <h3 className="case-card-title">{prog.titleZh}</h3>
                  <div className="case-card-cost">
                    <strong>{isEnglish ? labels.tuition : '学费：'}</strong>
                    {(prog.cost || '').split('\n').filter(Boolean).map((line, i) => (
                      <p key={i} className="case-card-cost-line">{line}</p>
                    ))}
                  </div>
                  <p className="case-card-requirements"><strong>{isEnglish ? labels.requirements : '基本要求：'}</strong>{isEnglish ? '' : '语言 '}{prog.languageReq}{isEnglish ? ' ' : '；'}{prog.academicReq}</p>
                  {prog.prospects && prog.prospects.length > 0 && (
                    <div className="case-card-highlights">
                      <strong>{isEnglish ? labels.prospects : '毕业前景：'}</strong>
                      <ul>
                        {prog.prospects.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <StudyProgramLink prog={prog} sectionId={sec.id} className="case-card-link" isEnglish={isEnglish}>
                    {isEnglish ? labels.more : '查看更多'} &gt;&gt;
                  </StudyProgramLink>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {sec.id === 'language' && sec.programs && (
        <>
          <p className="study-section-intro">{isEnglish ? labels.currentInfo : '具体费用与入学要求以校方及官网为准，如需申请可联络我们协助。'}<strong>{isEnglish ? ` ${labels.agency}` : '新西兰嘀嘀移民是持牌校代免费申请！！！'}</strong></p>
          <div className="cases-list">
            {sec.programs.map((prog) => (
              <article key={prog.id} className="case-card case-card--study">
                <div className="case-card-image-wrap">
                  <img src={prog.coverImage || prog.image} alt={prog.titleZh} className="case-card-image" loading="lazy" />
                </div>
                <div className="case-card-body">
                  <h3 className="case-card-title">{prog.titleZh}</h3>
                  <div className="case-card-cost">
                    <strong>{isEnglish ? labels.tuition : '学费：'}</strong>
                    {(prog.cost || '').split('\n').filter(Boolean).map((line, i) => (
                      <p key={i} className="case-card-cost-line">{line}</p>
                    ))}
                  </div>
                  <p className="case-card-requirements"><strong>{isEnglish ? labels.requirements : '基本要求：'}</strong>{isEnglish ? '' : '语言 '}{prog.languageReq}{isEnglish ? ' ' : '；'}{prog.academicReq}</p>
                  {prog.schedule && <p className="case-card-schedule"><strong>{isEnglish ? labels.schedule : '上课时间：'}</strong>{prog.schedule}</p>}
                  <StudyProgramLink prog={prog} sectionId={sec.id} className="case-card-link" isEnglish={isEnglish}>
                    {isEnglish ? labels.more : '查看更多'} &gt;&gt;
                  </StudyProgramLink>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {sec.id === 'primary' && sec.programs && (
        <>
          <p className="study-section-intro">{isEnglish ? labels.currentInfo : '具体费用与安排以项目说明及当年开课计划为准，如需咨询可联络我们协助。'}<strong>{isEnglish ? ` ${labels.agency}` : '新西兰嘀嘀移民是持牌校代免费申请！！！'}</strong></p>
          <div className="cases-list">
            {sec.programs.map((prog) => (
              <article key={prog.id} className="case-card case-card--study">
                <div className="case-card-image-wrap">
                  <img src={prog.coverImage || prog.image} alt={prog.titleZh} className="case-card-image" loading="lazy" />
                </div>
                <div className="case-card-body">
                  <h3 className="case-card-title">{prog.titleZh}</h3>
                  <div className="case-card-cost">
                    <strong>{isEnglish ? labels.tuition : '费用：'}</strong>
                    {(prog.cost || '').split('\n').filter(Boolean).map((line, i) => (
                      <p key={i} className="case-card-cost-line">{line}</p>
                    ))}
                  </div>
                  {prog.highlight && <p className="case-card-requirements"><strong>{isEnglish ? labels.highlights : '项目亮点：'}</strong>{prog.highlight}</p>}
                  {prog.prospects && prog.prospects.length > 0 && (
                    <div className="case-card-highlights">
                      <strong>{isEnglish ? labels.highlights : '优势重点：'}</strong>
                      <ul>
                        {prog.prospects.slice(0, 4).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <StudyProgramLink prog={prog} sectionId={sec.id} className="case-card-link" isEnglish={isEnglish}>
                    {isEnglish ? labels.more : '查看更多'} &gt;&gt;
                  </StudyProgramLink>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {sec.id === 'highschool' && sec.routes && (
        <div className="study-secondary-routes">
          <h3 className="study-secondary-routes-heading">{isEnglish ? labels.routes : '升学路径规划'}</h3>
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
      {sec.id === 'highschool' && sec.programs && (
        <>
          <p className="study-section-intro" style={{ marginTop: '24px' }}>{isEnglish ? labels.currentInfo : '以下含高中留学方案及合作预科项目，具体费用与入学要求以校方及官网为准。'}<strong>{isEnglish ? ` ${labels.agency}` : '新西兰嘀嘀移民是持牌校代免费申请！！！'}</strong></p>
          <div className="cases-list">
            {sec.programs.map((prog) => (
              <article key={prog.id} className="case-card case-card--study">
                <div className="case-card-image-wrap">
                  {prog.id === 'westlake-girls-high-school'
                    ? <WestlakeGirlsPoster />
                    : prog.id === 'rangitoto-college'
                      ? <RangitotoPoster />
                    : aucklandSchoolsPosterIds.has(prog.id)
                      ? <AucklandSchoolsPoster schoolId={prog.id} />
                    : <img src={prog.coverImage || prog.image} alt={prog.titleZh} className="case-card-image" loading="lazy" />}
                </div>
                <div className="case-card-body">
                  <h3 className="case-card-title">{prog.titleZh}</h3>
                  <div className="case-card-cost">
                    <strong>{isEnglish ? labels.tuition : '学费：'}</strong>
                    {(prog.cost || '').split('\n').filter(Boolean).map((line, i) => (
                      <p key={i} className="case-card-cost-line">{line}</p>
                    ))}
                  </div>
                  <p className="case-card-requirements"><strong>{isEnglish ? labels.requirements : '基本要求：'}</strong>{isEnglish ? '' : '语言 '}{prog.languageReq}{isEnglish ? ' ' : '；'}{prog.academicReq}</p>
                  {prog.prospects && prog.prospects.length > 0 && (
                    <div className="case-card-highlights">
                      <strong>{isEnglish ? labels.highlights : '优势重点：'}</strong>
                      <ul>
                        {prog.prospects.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <StudyProgramLink prog={prog} sectionId={sec.id} className="case-card-link" isEnglish={isEnglish}>
                    {isEnglish ? labels.more : '查看更多'} &gt;&gt;
                  </StudyProgramLink>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {sec.id === 'middleschool' && sec.programs && (
        <>
          <p className="study-section-intro" style={{ marginTop: '24px' }}>{isEnglish ? labels.currentInfo : '以下为初中留学合作学校，具体费用与入学要求以校方及官网为准。'}<strong>{isEnglish ? ` ${labels.agency}` : '新西兰嘀嘀移民是持牌校代免费申请！！！'}</strong></p>
          <div className="cases-list">
            {sec.programs.map((prog) => (
              <article key={prog.id} className="case-card case-card--study">
                <div className="case-card-image-wrap">
                  <img src={prog.coverImage || prog.image} alt={prog.titleZh} className="case-card-image" loading="lazy" />
                </div>
                <div className="case-card-body">
                  <h3 className="case-card-title">{prog.titleZh}</h3>
                  <div className="case-card-cost">
                    <strong>{isEnglish ? labels.tuition : '学费：'}</strong>
                    {(prog.cost || '').split('\n').filter(Boolean).map((line, i) => (
                      <p key={i} className="case-card-cost-line">{line}</p>
                    ))}
                  </div>
                  <p className="case-card-requirements"><strong>{isEnglish ? labels.requirements : '基本要求：'}</strong>{isEnglish ? '' : '语言 '}{prog.languageReq}{isEnglish ? ' ' : '；'}{prog.academicReq}</p>
                  {prog.prospects && prog.prospects.length > 0 && (
                    <div className="case-card-highlights">
                      <strong>{isEnglish ? labels.highlights : '优势重点：'}</strong>
                      <ul>
                        {prog.prospects.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <StudyProgramLink prog={prog} sectionId={sec.id} className="case-card-link" isEnglish={isEnglish}>
                    {isEnglish ? labels.more : '查看更多'} &gt;&gt;
                  </StudyProgramLink>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function StudyPage({ language = 'zh' }) {
  const location = useLocation()
  const { studyPath } = useParams()
  const isEnglish = language === 'en'
  const sectionIdFromUrl = studyPathSegmentToSectionId(studyPath)
  const selectedCategory = sectionIdFromUrl ?? studySections[0].id

  useEffect(() => {
    const scrollY = location.state?.scrollY
    if (typeof scrollY === 'number' && scrollY >= 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.scrollTo(0, scrollY))
      })
    }
  }, [location.state?.scrollY, studyPath])

  if (!sectionIdFromUrl) {
    return <Navigate to={isEnglish ? '/en/study/University' : '/study/University'} replace />
  }

  const sourceSection = studySections.find((s) => s.id === selectedCategory)
  const currentSection = isEnglish ? getEnglishStudySection(sourceSection) : sourceSection

  return (
    <main className="main-content study-page">
      <h1 className="study-page-title">{isEnglish ? 'Study in New Zealand' : '留学专栏'}</h1>

      <div className="study-intro-block">
        {(isEnglish ? englishStudyIntro : studyIntro.paragraphs).map((p, i) => {
          if (isEnglish) return <p key={i}>{p}</p>
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

      <nav className="study-category-nav" aria-label={isEnglish ? 'Study categories' : '留学分类'}>
        {studyCategories.map((cat) => (
          <NavLink
            key={cat.id}
            to={getStudyListPath(cat.id, isEnglish)}
            className={({ isActive }) => `study-category-link${isActive ? ' active' : ''}`}
          >
            {isEnglish ? cat.labelEn : cat.label}
          </NavLink>
        ))}
      </nav>

      {currentSection && (
        <section className="study-section">
          <h2 className="study-section-title">{currentSection.title}</h2>
          <StudySectionContent section={currentSection} isEnglish={isEnglish} />
        </section>
      )}

      <p className="study-page-cta">
        {isEnglish ? 'For an individual study plan and application support, contact us by phone, WeChat or through the Contact page.' : '如需针对个人情况的留学方案与申请协助，欢迎通过本站「联络我们」填写留学意向，或致电/微信联系我们。'}
      </p>
    </main>
  )
}

export default StudyPage
