const footerQrItems = [
  { src: '/pic/qrcodevx1.jpg', label: '签证咨询', alt: '签证咨询二维码' },
  { src: '/pic/qrcodevx2.jpg', label: '留学咨询', alt: '留学咨询二维码' },
  { src: '/pic/qrcodevx3.jpg', label: '业务合作', alt: '业务合作二维码' },
  { src: '/pic/rednote.jpg', label: '小红书', alt: '小红书二维码' },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* 左侧：联系信息 */}
        <div className="footer-section footer-contact">
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <span>电话: +64-027-7223339</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">💬</span>
            <span>微信号码: ddtrip700、ddtrip800、ddtrip999</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <span>客服邮箱: dd.icnz@gmail.com</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <span>地址: 8 Andrew Baxter Drive, Māngere, Auckland 2022</span>
          </div>
        </div>

        {/* 中间：Google Maps 地图 */}
        <div className="footer-section footer-map">
          <iframe
            src="https://www.google.com/maps?q=8+Andrew+Baxter+Drive,+M%C4%81ngere,+Auckland+2022&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="嘀嘀移民公司位置"
          />
        </div>

        {/* 右侧：四个二维码 2×2 */}
        <div className="footer-section footer-qrcodes">
          {footerQrItems.map((item) => (
            <div key={item.label} className="qrcode-item">
              <img
                src={item.src}
                alt={item.alt}
                className="qrcode-img"
              />
              <p className="qrcode-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="footer-copyright">
        <p>Copyright © 2026 DD Immigration Consultant Ltd. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
