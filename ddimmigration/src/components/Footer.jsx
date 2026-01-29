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
            <span>微信号码: ddtrip700</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <span>客服邮箱: dd.icnz@gmail.com</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <span>地址: Auckland, Māngere, Andrew Baxter Dr, NZ 2022</span>
          </div>
        </div>

        {/* 中间：Google Maps 地图 */}
        {/* 
          如何获取正确的地图 embed URL：
          1. 打开 https://www.google.com/maps
          2. 搜索 \"Auckland, Māngere, Andrew Baxter Dr, NZ 2022\"
          3. 点击"分享" -> 选择"嵌入地图"
          4. 复制 iframe 的 src 属性值，替换下面的 URL
        */}
        <div className="footer-section footer-map">
          <iframe
            src="https://www.google.com/maps?q=Auckland,+M%C4%81ngere,+Andrew+Baxter+Dr,+NZ+2022&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="嘀嘀移民公司位置"
          />
        </div>

        {/* 右侧：二维码（仅保留客服微信） */}
        <div className="footer-section footer-qrcodes">
          <div className="qrcode-item">
            <img
              src="/pic/qrcodevx.jpg"
              alt="客服微信号"
              className="qrcode-img"
            />
            <p className="qrcode-label">客服微信号</p>
          </div>
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
