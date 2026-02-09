const teamMembers = [
  {
    id: 1,
    name: 'Eric',
    role: '持牌移民顾问',
    photo: '/pic/eric2.jpg',
    licence: '/pic/eric_licience.jpg',
    licenceNo: '201800151',
    intro: 'Eric为新西兰持牌移民顾问，多年从事移民与留学咨询，熟悉技术移民、投资移民、家庭团聚及各类签证申请，擅长为申请人量身定制方案并全程跟进，确保流程合规、沟通顺畅。',
  },
  {
    id: 2,
    name: 'Tsui',
    nameZh: 'Tsui',
    role: '持牌移民顾问',
    photo: '/pic/tsui.jpg',
    licence: '/pic/dashu_licience.jpg',
    licenceNo: '201400700',
    intro: 'Tsui 为新西兰持牌移民顾问，具备 IAA 全牌资质。长期服务于移民与留学领域，经验丰富，可为客户提供签证申请、政策解读与个案规划等专业服务。',
  },
  {
    id: 3,
    name: 'Sunny Liu',
    role: '团队顾问',
    photo: '/pic/sunny.jpg',
    intro: 'Sunny Liu 深耕新西兰移民与留学市场多年，深谙各类签证政策、移民局审理流程及材料规范，擅长为客户梳理背景、规划路径并全程跟进案头工作。与持牌顾问紧密配合，确保每一份申请材料逻辑清晰、合规完整。服务细致、响应及时，致力于为每一位申请人提供专业、可靠、有温度的一站式体验。',
  },
  {
    id: 4,
    name: 'Leo Liu',
    role: '团队顾问',
    photo: '/pic/leo.JPG',
    intro: 'Leo Liu 拥有美国伊利诺伊大学及新西兰奥克兰大学硕士学历，拥有多年美国与新西兰工作经验，兼具国际视野与本地实操。深谙新西兰技术移民、家庭团聚、工作签证、学生签证等政策脉络，对移民局审理流程、补料逻辑与文件规范把握精准，案头严谨、沟通高效，致力于为每位申请人厘清路径、规避风险、提升获批把握。',
  },
  {
    id: 5,
    name: 'Jane Liu',
    role: '团队顾问',
    photo: '/pic/eric.jpg',
    intro: 'Jane Liu 拥有奥克兰大学硕士文凭，Jane 负责工作签证等各类签证的案头工作，组织审核申请资料与财务材料，纠正疏漏、确保合规，并负责与移民局的一般日常沟通。熟悉技术移民、工作签证、投资移民等政策与文件要求，准确把握移民局审理标准，是团队案头质量与通过率的重要把关者。',
  },
]

function TeamPage() {
  return (
    <main className="main-content team-page">
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
                  className="team-block-photo-img"
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
              {member.nameZh && member.nameZh !== member.name && (
                <p className="team-block-name-zh">{member.nameZh}</p>
              )}
              <p className="team-block-role">{member.role}</p>
              {member.licenceNo && (
                <p className="team-block-licence-no">牌照编号：{member.licenceNo}</p>
              )}
              <div className="team-block-intro-text">{member.intro}</div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default TeamPage
