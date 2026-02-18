const teamMembers = [
  {
    id: 1,
    name: 'Eric',
    role: '持牌移民顾问',
    photo: '/pic/eric2.jpg',
    licence: '/pic/eric_licience.jpg',
    licenceNo: '201800151',
    intro: 'Eric 从业多年，累计成功获批案例超过1000份。专注留学、技术移民、商业移民及各类工作签证申请，实操经验丰富。擅长处理复杂及高难度案件，包括身份转换、历史签证瑕疵、拒签翻案等问题，成功协助大量客户顺利获批。',
  },
  {
    id: 2,
    name: 'Tsui',
    role: '持牌移民顾问',
    photo: '/pic/tsui.jpg',
    licence: '/pic/dashu_licience.jpg',
    licenceNo: '201400700',
    intro: 'Tsui 资深移民顾问，10年以上从业经验，累计数千份成功获批案例，涵盖留学签证、工作签证及各类移民类别。拥有New Zealand Ministry of Justice（新西兰司法部）工作背景，熟悉新西兰法律体系及政策逻辑。以严谨逻辑为基础，制定稳健、合规的新西兰工作 留学 移民路径。',
  },
  {
    id: 3,
    name: 'Sunny',
    role: '执行总监 高级咨询顾问 业务合作',
    photo: '/pic/sunny.jpg',
    intro: 'Sunny 深耕新西兰移民与留学市场多年，深谙各类签证政策、移民局审理流程及材料规范，擅长为客户梳理背景、规划路径并全程跟进案头工作。与持牌顾问紧密配合，确保每一份申请材料逻辑清晰、合规完整。服务细致、响应及时，致力于为每一位申请人提供专业、可靠、有温度的一站式体验。',
  },
  {
    id: 4,
    name: 'Leo',
    role: '留学咨询',
    photo: '/pic/leo.JPG',
    intro: 'Leo 拥有美国伊利诺伊大学及新西兰奥克兰大学硕士学历，拥有多年美国与新西兰工作经验，兼具国际视野与本地实操。深谙新西兰技术移民、家庭团聚、工作签证、学生签证等政策脉络，负责留学政策、留学咨询、新西兰小初高及本科研究生的学校申请、学校推荐。',
  },
  {
    id: 5,
    name: 'Jane',
    role: '签证咨询',
    photo: '/pic/logo.jpg',
    intro: 'Jane 拥有奥克兰大学硕士文凭，负责工作签证、配偶签证、旅游签证等各类签证的咨询，材料收集、整理。',
  },
]

function AboutPage() {
  return (
    <main className="main-content about-page team-page">
      <h2 className="section-title">关于我们</h2>
      <article className="about-content">
        <p>
          我们是一家立足新西兰本地的综合签证与留学规划机构，专注于认证雇主 AEWV 工签、岗位匹配、VOC 变更、留学规划及家庭同步方案，为客户提供从「来新西兰」到「长期发展」的一站式服务。
        </p>
        <p>
          自 2016 年成立至今，我们已陪伴众多客户实现赴新工作、留学与家庭规划的理想，用专业与务实赢得信任。
        </p>
        <p>
          团队长期深耕新西兰劳动力市场，与多家本地认证雇主保持稳定合作，覆盖汽修、建筑、西厨、制造、酒店服务等多个紧缺行业。我们更擅长为普通背景客户设计可落地路径，通过真实岗位 + 合规材料 + 清晰规划，帮助客户稳步推进工签与后续发展。
        </p>
        <p>
          除工签业务外，我们同步提供新西兰中小学、本科及硕士留学服务，并结合 AEWV 与绿色清单岗位，为家庭客户设计「留学 + 工作 + 子女教育」的整体方案，让一个人的选择，带动全家规划。
        </p>
        <p>
          在移民方面，无论是技术移民（SMC）还是投资移民（如 Investor 1/2 类别），我们均可根据您的学历、工作经历与资产情况，为您梳理分数、规划时间线并协助准备全套申请材料。技术移民侧重分数评估与补料策略，投资移民侧重资金证明与投资结构解读，从评估到递交全程跟进，助力您稳妥迈出定居新西兰的一步。
        </p>
        <p className="about-values-title">我们始终坚持：</p>
        <ul className="about-values-list">
          <li>真实岗位对接</li>
          <li>清晰签证路径</li>
          <li>全流程跟进服务</li>
          <li>本地实操经验支持</li>
        </ul>
        <p>
          无论你是计划来新西兰工作、留学，还是希望为家庭寻找更好的长期发展方向，我们都将为你提供务实、可执行的解决方案。
        </p>
        <p>
          欢迎联系我们，开启属于你的新西兰之路。
        </p>
      </article>

      <section className="about-team-section" aria-label="专业团队">
        <h2 className="section-title">专业团队</h2>
        <p className="team-intro">我们的持牌移民顾问均具备新西兰移民顾问管理局（IAA）注册资质，为您提供专业、合规的移民与留学服务。</p>
        <div className="team-blocks">
          {teamMembers.map((member) => (
            <article key={member.id} className="team-block">
              <div className="team-block-photo">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className={`team-block-photo-img${member.name === 'Tsui' ? ' team-block-photo-img--tsui' : ''}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="team-block-photo-placeholder" aria-hidden>暂无照片</div>
                )}
              </div>
              {member.licenceNo && (
                <div className="team-block-licence">
                  <img
                    src={member.licence}
                    alt={`${member.name} 牌照`}
                    className="team-block-licence-img"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="team-block-intro">
                <h3 className="team-block-name">{member.name}</h3>
                <p className="team-block-role">{member.role}</p>
                {member.licenceNo && (
                  <p className="team-block-licence-no">牌照编号：{member.licenceNo}</p>
                )}
                <div className="team-block-intro-text">{member.intro}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default AboutPage

