import { OFFICE_ADDRESS } from '../data/siteContact.js'

const qrItems = [
  { src: '/pic/qrcodevx1.jpg', zh: '签证咨询', en: 'Visa Enquiries' },
  { src: '/pic/qrcodevx2.jpg', zh: '留学咨询', en: 'Study Enquiries' },
  { src: '/pic/qrcodevx3.jpg', zh: '业务合作', en: 'Business Enquiries' },
]

const wechatIds = ['ddtrip700', 'ddtrip800', 'ddtrip999']

function LeftSidebar({ language = 'zh' }) {
  const isEnglish = language === 'en'

  return (
    <aside className="left-sidebar">
      <div className="sidebar-card">
        <div className="sidebar-cert">
          <p className="sidebar-cert-title">{isEnglish ? 'Credentials' : '资质认证'}</p>
          <img
            src="/pic/iaa.jpg"
            alt={isEnglish ? 'Immigration Advisers Authority credentials' : 'IAA 移民顾问管理局认证'}
            className="sidebar-cert-img"
            loading="lazy"
          />
        </div>
        {qrItems.map((item) => {
          const label = isEnglish ? item.en : item.zh
          return (
            <div key={item.zh} className="sidebar-qr-block">
              <img
                src={item.src}
                alt={isEnglish ? `${label} QR code` : `${label}二维码`}
                className="sidebar-qrcode"
                loading="lazy"
              />
              <div className="sidebar-qrcode-btn">{label}</div>
            </div>
          )
        })}
        <div className="sidebar-contact">
          <div className="sidebar-contact-row">
            <span className="sidebar-contact-label">{isEnglish ? 'WeChat: ' : '微信号码：'}</span>
            <span>{wechatIds.join('、')}</span>
          </div>
          <div className="sidebar-contact-row">
            <span className="sidebar-contact-label">{isEnglish ? 'Email: ' : 'Email：'}</span>
            <span>dd.icnz@gmail.com</span>
          </div>
          <div className="sidebar-contact-row">
            <span className="sidebar-contact-label">{isEnglish ? 'Phone: ' : '电话：'}</span>
            <span>+64-027-7223339</span>
          </div>
          <div className="sidebar-contact-row">
            <span className="sidebar-contact-label">{isEnglish ? 'Address: ' : '地址：'}</span>
            <span>{OFFICE_ADDRESS}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default LeftSidebar
