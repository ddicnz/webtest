import { useNavigate } from 'react-router-dom'

function PromoterPage({ language = 'zh' }) {
  const navigate = useNavigate()
  const isEnglish = language === 'en'
  const copy = isEnglish ? {
    kicker: 'Business Partnership Programme',
    title: 'Become a DD Immigration Referral Partner',
    lead: 'Know someone considering New Zealand study, work visas or immigration planning? Refer genuine clients to our team and receive an agreed referral commission after a successful engagement.',
    tags: ['Education Referrals', 'Work Visa Referrals', 'Immigration Planning', 'Visa Services'],
    button: 'Apply to Become a Partner',
    qrAlt: 'Business partnership QR code',
    qrTitle: 'Scan to get started',
    qrText: 'Add our partnership WeChat and tell us about your referral channel.',
    suitableTitle: 'Suitable referrals',
    cards: [
      ['Study clients', 'People considering New Zealand schools, English courses, university, secondary education or parent-and-child study plans.'],
      ['Work visa clients', 'People seeking information about AEWV, partner work visas, post-study work visas or changes of employment conditions.'],
      ['Immigration planning', 'People who need coordinated planning across study, work, family visas and possible residence pathways.'],
      ['Other visa services', 'People considering visitor, partnership, parent or other New Zealand visa applications.'],
    ],
    zeroCost: 'There is no joining fee. You introduce genuine prospective clients, and our New Zealand-based team handles the consultation, planning and document support. Referral commission is paid under the agreed partnership terms after a successful engagement.',
    processTitle: 'Partnership process',
    process: [
      ['Contact us', 'Add our partnership WeChat and confirm your partner details.'],
      ['Register the referral', 'Share the client’s basic needs so the referral can be recorded.'],
      ['Client engagement', 'The client confirms the service and works with our team.'],
      ['Commission settlement', 'Referral commission is settled under the agreed partnership terms.'],
    ],
  } : null

  return (
    <main className="promoter-page">
      <section className="promoter-hero">
        <div className="promoter-hero-inner">
          <div className="promoter-hero-copy">
            <p className="promoter-kicker">{isEnglish ? copy.kicker : '业务合作招募'}</p>
            <h1 className="promoter-title">{isEnglish ? copy.title : '成为新西兰嘀嘀移民业务推广员'}</h1>
            <p className="promoter-lead">
              {isEnglish ? copy.lead : '身边有朋友想来新西兰留学、办理工签或做签证规划？扫码联系我们，推荐真实客户成功合作后，可按项目获得推广返佣。'}
            </p>
            <div className="promoter-tags">
              {(isEnglish ? copy.tags : ['留学推荐', '出国劳务', '移民规划', '签证办理']).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <button
              type="button"
              className="promoter-hero-btn"
              onClick={() => navigate(isEnglish ? '/en/contactus' : '/promoter-register')}
            >
              {isEnglish ? copy.button : '申请成为推广员'}
            </button>
          </div>

          <div className="promoter-qr-card">
            <img src="/pic/qrcodevx1.jpg" alt={isEnglish ? copy.qrAlt : '业务合作二维码'} />
            <h2>{isEnglish ? copy.qrTitle : '扫码成为推广员'}</h2>
            <p>{isEnglish ? copy.qrText : '添加业务合作微信，说明推荐渠道与客户情况。'}</p>
          </div>
        </div>
      </section>

      <section className="promoter-section">
        <h2>{isEnglish ? copy.suitableTitle : '适合哪些推荐'}</h2>
        <div className="promoter-grid">
          {(isEnglish ? copy.cards : [
            ['留学客户', '推荐计划申请新西兰学校、语言课程、大学、初高中或亲子留学的客户。'],
            ['工签客户', '推荐想了解 AEWV、配偶工签、学后工签、换雇主 VOC 等办理方向的客户。'],
            ['移民规划用户', '推荐需要结合学习、工作、家庭随行或后续移民路径做整体规划的客户。'],
            ['其他签证办理', '推荐需要办理旅游签、配偶签、父母团聚、访问签或其他新西兰签证的客户。'],
          ]).map(([title, text]) => (
            <article key={title}><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
        <p className="promoter-zero-cost">
          {isEnglish ? copy.zeroCost : '0成本加入推广合作。只要您身边有真实想了解新西兰留学、出国劳务、签证办理或移民规划的朋友，把客户推荐给我们，后续咨询、方案沟通和材料服务由新西兰嘀嘀移民的专业团队负责，成功后会有返佣。'}
        </p>
      </section>

      <section className="promoter-process">
        <h2>{isEnglish ? copy.processTitle : '合作流程'}</h2>
        <ol>
          {(isEnglish ? copy.process : [
            ['扫码联系', '添加业务合作微信，确认推广员身份。'],
            ['登记推荐', '提交客户基础需求，避免重复归属。'],
            ['客户成交', '客户与我们确认服务并完成合作。'],
            ['结算返佣', '按双方确认的合作方案结算推广返佣。'],
          ]).map(([title, text]) => (
            <li key={title}><strong>{title}</strong><span>{text}</span></li>
          ))}
        </ol>
      </section>
    </main>
  )
}

export default PromoterPage
