import { OFFICE_ADDRESS, OFFICE_MAP_EMBED_URL } from '../data/siteContact.js'

const footerQrItems = [
  { src: '/pic/qrcodevx1.jpg', zh: '签证咨询', en: 'Visa Enquiries' },
  { src: '/pic/qrcodevx2.jpg', zh: '留学咨询', en: 'Study Enquiries' },
  { src: '/pic/qrcodevx3.jpg', zh: '业务合作', en: 'Business Enquiries' },
  { src: '/pic/rednote.jpg', zh: '小红书', en: 'RedNote' },
]

function Footer({ language = 'zh' }) {
  const isEnglish = language === 'en'

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* 左侧：联系信息 */}
        <div className="footer-section footer-contact">
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <span>{isEnglish ? 'Phone' : '电话'}: +64-027-7223339</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">💬</span>
            <span>{isEnglish ? 'WeChat' : '微信号码'}: ddtrip700、ddtrip800、ddtrip999</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <span>{isEnglish ? 'Email' : '客服邮箱'}: dd.icnz@gmail.com</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <span>{isEnglish ? 'Address' : '地址'}: {OFFICE_ADDRESS}</span>
          </div>
        </div>

        {/* 中间：Google Maps 地图（公司地址） */}
        <div className="footer-section footer-map">
          <iframe
            src={OFFICE_MAP_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={isEnglish ? 'DD Immigration office location' : '嘀嘀移民公司位置'}
          />
        </div>

        {/* 右侧：四个二维码 2×2 */}
        <div className="footer-section footer-qrcodes">
          {footerQrItems.map((item) => {
            const label = isEnglish ? item.en : item.zh
            return (
              <div key={item.zh} className="qrcode-item">
                <img
                  src={item.src}
                  alt={isEnglish ? `${label} QR code` : `${label}二维码`}
                  className="qrcode-img"
                />
                <p className="qrcode-label">{label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="footer-copyright">
        <p>Copyright © 2026 DD Immigration Consulting Ltd. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
