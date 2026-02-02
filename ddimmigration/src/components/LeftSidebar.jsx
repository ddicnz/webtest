const qrItems = [
  { src: '/pic/qrcodevx1.jpg', label: '签证咨询', alt: '签证咨询二维码' },
  { src: '/pic/qrcodevx2.jpg', label: '留学咨询', alt: '留学咨询二维码' },
  { src: '/pic/qrcodevx3.jpg', label: '综合咨询', alt: '综合咨询二维码' },
]

const wechatIds = ['ddtrip700', 'ddtrip800', 'ddtrip999']

function LeftSidebar() {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-card">
        <div className="sidebar-cert">
          <p className="sidebar-cert-title">资质认证</p>
          <img
            src="/pic/iaa.jpg"
            alt="IAA 移民顾问管理局认证"
            className="sidebar-cert-img"
            loading="lazy"
          />
        </div>
        {qrItems.map((item) => (
          <div key={item.label} className="sidebar-qr-block">
            <img
              src={item.src}
              alt={item.alt}
              className="sidebar-qrcode"
              loading="lazy"
            />
            <div className="sidebar-qrcode-btn">{item.label}</div>
          </div>
        ))}
        <div className="sidebar-contact">
          <div className="sidebar-contact-row">
            <span className="sidebar-contact-label">微信号码：</span>
            <span>{wechatIds.join('、')}</span>
          </div>
          <div className="sidebar-contact-row">
            <span className="sidebar-contact-label">Email：</span>
            <span>dd.icnz@gmail.com</span>
          </div>
          <div className="sidebar-contact-row">
            <span className="sidebar-contact-label">电话：</span>
            <span>+64-027-7223339</span>
          </div>
          <div className="sidebar-contact-row">
            <span className="sidebar-contact-label">地址：</span>
            <span>Auckland, Māngere, Andrew Baxter Dr, NZ 2022</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default LeftSidebar
