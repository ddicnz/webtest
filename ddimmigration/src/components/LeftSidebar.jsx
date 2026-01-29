function LeftSidebar() {
  return (
    <aside className="left-sidebar">
      <div className="sidebar-card">
        <img
          src="/pic/qrcodevx.jpg"
          alt="客服微信号二维码"
          className="sidebar-qrcode"
          loading="lazy"
        />
        <div className="sidebar-qrcode-btn">客服微信号</div>
        <div className="sidebar-contact">
          <div className="sidebar-contact-row">
            <span className="sidebar-contact-label">微信：</span>
            <span>ddtrip700</span>
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
