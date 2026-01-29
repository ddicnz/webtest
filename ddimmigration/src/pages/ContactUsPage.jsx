function ContactUsPage() {
  return (
    <main className="main-content contact-page">
      <section className="contact-right">
        <h1 className="contact-title">联系我们</h1>

        <div className="contact-details">
          <div className="contact-detail-row">
            <span className="contact-detail-label">微信：</span>
            <span>ddtrip700</span>
          </div>
          <div className="contact-detail-row">
            <span className="contact-detail-label">Email：</span>
            <span>dd.icnz@gmail.com</span>
          </div>
          <div className="contact-detail-row">
            <span className="contact-detail-label">电话：</span>
            <span>+64-027-7223339</span>
          </div>
          <div className="contact-detail-row">
            <span className="contact-detail-label">地址：</span>
            <span>Auckland, Māngere, Andrew Baxter Dr, NZ 2022</span>
          </div>
        </div>

        <div className="contact-advisors">
          <div className="contact-advisors-title">持牌移民顾问：</div>
          <ul className="contact-advisors-list">
            <li>Eric</li>
            <li>Tsui</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default ContactUsPage

