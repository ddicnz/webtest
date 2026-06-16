import { useMemo, useState } from 'react'

const yesNoOptions = ['是', '否']
const stayOptions = ['0-6个月', '6-12个月', '12个月以上']

const emptyWork = {
  from: '',
  to: '',
  company: '',
  position: '',
  address: '',
  supervisor: '',
  phone: '',
  email: '',
  proof: '',
}

const emptyEducation = {
  from: '',
  to: '',
  school: '',
  major: '',
  degree: '',
}

const emptyCertificate = {
  date: '',
  name: '',
  authority: '',
}

const emptyFamily = {
  name: '',
  pinyin: '',
  relation: '',
  birthday: '',
  country: '',
  occupation: '',
  maritalStatus: '',
}

const emptyTravel = {
  departure: '',
  returnDate: '',
  country: '',
  airport: '',
  purpose: '',
}

const initialData = {
  personal: {
    name: '',
    passportNo: '',
    birthday: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    idNo: '',
    phone: '',
    email: '',
    maritalStatus: '',
    gender: '',
    birthplace: '',
    nzAddress: '',
    chinaAddress: '',
  },
  currentWork: [{ ...emptyWork }],
  pastWork: [{ ...emptyWork }],
  education: [{ ...emptyEducation }],
  certificates: [{ ...emptyCertificate }],
  spouse: {
    ...emptyFamily,
    birthplace: '',
    passportNote: '',
  },
  parents: [
    { ...emptyFamily, relation: '父亲' },
    { ...emptyFamily, relation: '母亲' },
  ],
  children: [{ ...emptyFamily }],
  siblings: [{ ...emptyFamily }],
  travel: [{ ...emptyTravel }],
  visa: {
    hadNzVisa: '',
    clientNumber: '',
    visaFileNote: '',
    expectedStay: '',
  },
  medical: {
    tb: '',
    dialysis: '',
    hospitalCare: '',
    longTermCare: '',
    plannedStay: '',
    previousMedical: '',
    currentMedical: '',
    medicalNumber: '',
    xray36Months: '',
    healthWorse: '',
  },
  character: {
    convicted: '',
    underInvestigation: '',
    deported: '',
    visaDeclinedOutsideNz: '',
    livedFiveYears: '',
    submittedPoliceCert: '',
    policeCertWithin24Months: '',
    intelligenceOrLaw: '',
    violentGroup: '',
    humanRights: '',
  },
  other: {
    localContact: '',
    localContactDetail: '',
    employerRelative: '',
    sponsorFamilyFuture: '',
    militaryHistory: '',
    militaryDetail: '',
    coApplicants: '',
    declarationName: '',
    declarationDate: '',
  },
}

const steps = [
  { id: 'personal', title: '个人信息', subtitle: '护照、联系方式、地址' },
  { id: 'work', title: '工作信息', subtitle: '当前工作与过去10年经历' },
  { id: 'education', title: '学历证书', subtitle: '最高学历与资格证书' },
  { id: 'family', title: '家庭成员', subtitle: '配偶、父母、子女、兄弟姐妹' },
  { id: 'travel', title: '出入境记录', subtitle: '过去10年海外记录' },
  { id: 'visaMedical', title: '签证与医疗', subtitle: '新西兰签证历史和健康问题' },
  { id: 'character', title: '道德品质', subtitle: '犯罪、拒签、无犯罪等问题' },
  { id: 'other', title: '其他确认', subtitle: '联系人、兵役、随行人和声明' },
  { id: 'review', title: '预览生成', subtitle: '检查后生成PDF' },
]

const reviewQuestionGroups = [
  {
    title: '签证信息',
    group: 'visa',
    items: [
      { key: 'hadNzVisa', label: '是否确认过新西兰签证？' },
      { key: 'clientNumber', label: '如果是“是”，请提供之前签证客户号码 Client number。' },
      { key: 'visaFileNote', label: '如果是“是”，请提供之前签证留底 PDF 文件说明。' },
      { key: 'expectedStay', label: '预计新西兰停留时间？' },
    ],
  },
  {
    title: '新西兰签证申请医疗信息确认',
    group: 'medical',
    items: [
      { key: 'tb', label: '您是否患有结核病（TB）？' },
      { key: 'dialysis', label: '您在新西兰停留期间是否需要进行肾透析？' },
      { key: 'hospitalCare', label: '您是否有需要或可能需要在新西兰接受医院或专科治疗的医疗状况？' },
      { key: 'longTermCare', label: '您在新西兰停留期间是否需要或可能需要接受长期护理？' },
      { key: 'plannedStay', label: '您计划在新西兰停留多久？' },
      { key: 'previousMedical', label: '您之前是否为新西兰签证申请接受过体检？' },
      { key: 'currentMedical', label: '您是否已经为这次签证申请接受了体检？' },
      { key: 'medicalNumber', label: '如果已经体检，请提供体检编号（N000）。' },
      { key: 'xray36Months', label: '您最近的一次体检是否包括在过去36个月内拍摄的胸部X光片？' },
      { key: 'healthWorse', label: '自那次体检之后，您的健康状况是否有恶化？' },
    ],
  },
  {
    title: '道德品质确认',
    group: 'character',
    items: [
      { key: 'convicted', label: '您是否曾因任何罪行被定罪，包括任何交通违法行为？' },
      { key: 'underInvestigation', label: '您目前是否正在接受调查、被通缉、被传唤问话，或在任何国家（包括新西兰）面临指控？' },
      { key: 'deported', label: '您是否曾在任何国家被驱逐、遣返、拒绝入境或被要求离境？' },
      { key: 'visaDeclinedOutsideNz', label: '您是否曾被除新西兰以外的任何国家拒发签证或许可？' },
      { key: 'livedFiveYears', label: '自17岁起，您是否曾在其他任何国家连续居住5年或以上？' },
      { key: 'submittedPoliceCert', label: '您是否在之前的新西兰签证申请中提交过该国的无犯罪证明？' },
      { key: 'policeCertWithin24Months', label: '该无犯罪证明是否是在过去24个月内签发的？' },
      { key: 'intelligenceOrLaw', label: '您是否曾与任何情报机构、组织或执法机构有过关联？' },
      { key: 'violentGroup', label: '您是否曾与任何曾使用或宣扬暴力、或以侵犯人权方式来实现其目标的组织或团体有过关联？' },
      { key: 'humanRights', label: '您是否曾经实施、参与或涉及战争罪、反人类罪或侵犯人权的行为？' },
    ],
  },
  {
    title: '其他相关问题',
    group: 'other',
    items: [
      { key: 'localContact', label: '是否有本地联系人（家人或者朋友）？' },
      { key: 'localContactDetail', label: '如有本地联系人，请填写姓名、生日、地址及电话。' },
      { key: 'employerRelative', label: '雇主是否为您的直系亲属，或是否曾在之前任何签证申请中向移民局提供过其姓名？' },
      { key: 'sponsorFamilyFuture', label: '未来是否有担保小孩和配偶的需要（如适用）？' },
      { key: 'militaryHistory', label: '是否有任何兵役历史？' },
      { key: 'militaryDetail', label: '如有兵役历史，请提供开始和结束时间、部队番号、军衔、具体职位、上级领导名称，并说明退伍证情况。' },
      { key: 'coApplicants', label: '如有其他人随行或一同申请，请在此提供另外申请人姓名，并另行提供其个人信息表格。' },
      { key: 'declarationName', label: '本人确认签字姓名。' },
      { key: 'declarationDate', label: '本人确认日期。' },
    ],
  },
]

function Field({ label, value, onChange, type = 'text', placeholder, textarea }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className="visa-field">
      <span>{label}</span>
      <Tag
        type={textarea ? undefined : type}
        value={value}
        placeholder={placeholder || '请填写'}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 3 : undefined}
      />
    </label>
  )
}

function ChoiceField({ label, value, options, onChange }) {
  return (
    <div className="visa-choice-field">
      <p>{label}</p>
      <div className="visa-choice-options">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`visa-choice${value === option ? ' visa-choice--active' : ''}`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function SectionBlock({ title, note, noteHighlight, children }) {
  return (
    <section className="visa-section-block">
      <div className="visa-section-head">
        <h3>{title}</h3>
        {note && <p className={noteHighlight ? 'visa-section-note--highlight' : undefined}>{note}</p>}
      </div>
      {children}
    </section>
  )
}

function Repeater({ title, note, noteHighlight, items, onAdd, onRemove, renderItem }) {
  return (
    <SectionBlock title={title} note={note} noteHighlight={noteHighlight}>
      <div className="visa-repeat-list">
        {items.map((item, index) => (
          <div className="visa-repeat-card" key={index}>
            <div className="visa-repeat-card-head">
              <strong>{title} {index + 1}</strong>
              {items.length > 1 && (
                <button type="button" className="visa-link-btn" onClick={() => onRemove(index)}>
                  删除
                </button>
              )}
            </div>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      <button type="button" className="visa-secondary-btn" onClick={onAdd}>
        添加一条
      </button>
    </SectionBlock>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="visa-summary-row">
      <span>{label}</span>
      <strong>{value || '未填写'}</strong>
    </div>
  )
}

function SummaryTable({ title, rows, columns }) {
  return (
    <section className="visa-print-section">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key] || ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function PersonalInfoSummary({ data }) {
  const value = (key) => data[key] || '未填写'

  return (
    <section className="visa-print-section">
      <h3>个人信息</h3>
      <div className="visa-personal-table">
        <div className="visa-personal-label">姓名</div>
        <div className="visa-personal-value">{value('name')}</div>
        <div className="visa-personal-label">护照号码</div>
        <div className="visa-personal-value">{value('passportNo')}</div>
        <div className="visa-personal-label">出生日期</div>
        <div className="visa-personal-value">{value('birthday')}</div>

        <div className="visa-personal-label">护照颁发时间</div>
        <div className="visa-personal-value">{value('passportIssueDate')}</div>
        <div className="visa-personal-label">护照到期时间</div>
        <div className="visa-personal-value">{value('passportExpiryDate')}</div>
        <div className="visa-personal-label">身份证号码</div>
        <div className="visa-personal-value">{value('idNo')}</div>

        <div className="visa-personal-label">手机号码</div>
        <div className="visa-personal-value">{value('phone')}</div>
        <div className="visa-personal-label">婚姻状态</div>
        <div className="visa-personal-value">{value('maritalStatus')}</div>
        <div className="visa-personal-label">性别</div>
        <div className="visa-personal-value">{value('gender')}</div>

        <div className="visa-personal-label">电子邮箱</div>
        <div className="visa-personal-value">{value('email')}</div>
        <div className="visa-personal-label">出生地（按户口本填写）</div>
        <div className="visa-personal-value visa-personal-value--wide">{value('birthplace')}</div>

        <div className="visa-personal-label visa-personal-label--address">
          现居住地址<br />（新西兰地址，如适用）
        </div>
        <div className="visa-personal-value visa-personal-value--address">{value('nzAddress')}</div>

        <div className="visa-personal-label">最后一次中国居住地址</div>
        <div className="visa-personal-value visa-personal-value--address">{value('chinaAddress')}</div>
      </div>
    </section>
  )
}

function VisaInfoFormPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState(initialData)

  const progress = useMemo(
    () => Math.round(((activeStep + 1) / steps.length) * 100),
    [activeStep],
  )

  const updateGroup = (group, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }))
  }

  const updateList = (group, index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [group]: prev[group].map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }))
  }

  const addListItem = (group, template) => {
    setFormData((prev) => ({
      ...prev,
      [group]: [...prev[group], { ...template }],
    }))
  }

  const removeListItem = (group, index) => {
    setFormData((prev) => ({
      ...prev,
      [group]: prev[group].filter((_, i) => i !== index),
    }))
  }

  const goNext = () => setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  const goPrev = () => setActiveStep((step) => Math.max(step - 1, 0))
  const currentStep = steps[activeStep]

  const renderWorkFields = (group, item, index) => (
    <div className="visa-grid visa-grid--wide">
      <Field label="从年/月" value={item.from} onChange={(value) => updateList(group, index, 'from', value)} placeholder="例如 2021/03" />
      <Field label="到年/月" value={item.to} onChange={(value) => updateList(group, index, 'to', value)} placeholder="例如 至今" />
      <Field label="工作单位名称" value={item.company} onChange={(value) => updateList(group, index, 'company', value)} />
      <Field label="职位" value={item.position} onChange={(value) => updateList(group, index, 'position', value)} />
      <Field label="工作单位详细地址" value={item.address} onChange={(value) => updateList(group, index, 'address', value)} textarea />
      <Field label="上司名字" value={item.supervisor} onChange={(value) => updateList(group, index, 'supervisor', value)} />
      <Field label="单位电话" value={item.phone} onChange={(value) => updateList(group, index, 'phone', value)} />
      <Field label="Email" value={item.email} onChange={(value) => updateList(group, index, 'email', value)} />
      <Field
        label="是否能提供此工作对应的社保记录+工资入账流水，请如实告知"
        value={item.proof}
        onChange={(value) => updateList(group, index, 'proof', value)}
        placeholder="能否提供，请如实说明"
        textarea
      />
    </div>
  )

  const renderFamilyFields = (group, item, index) => (
    <div className="visa-grid visa-grid--wide">
      <Field label="姓名" value={item.name} onChange={(value) => updateList(group, index, 'name', value)} />
      <Field label="姓名拼音" value={item.pinyin} onChange={(value) => updateList(group, index, 'pinyin', value)} />
      <Field label="亲属关系" value={item.relation} onChange={(value) => updateList(group, index, 'relation', value)} />
      <Field label="出生日期" value={item.birthday} onChange={(value) => updateList(group, index, 'birthday', value)} />
      <Field label="现居住国家" value={item.country} onChange={(value) => updateList(group, index, 'country', value)} />
      <Field label="职业" value={item.occupation} onChange={(value) => updateList(group, index, 'occupation', value)} />
      <Field label="婚姻状况" value={item.maritalStatus} onChange={(value) => updateList(group, index, 'maritalStatus', value)} />
    </div>
  )

  return (
    <main className="main-content visa-form-page">
      <div className="visa-form-heading">
        <p className="visa-eyebrow">DD Immigration Client Intake</p>
        <h1>签证个人信息表</h1>
        <p>
          按签证递交流程分步骤填写，最后检查无误后生成 PDF。信息较敏感，请确认网络环境安全后再提交。
        </p>
      </div>

      <div className="visa-form-shell">
        <aside className="visa-stepper" aria-label="填写步骤">
          <div className="visa-progress">
            <span>完成度</span>
            <strong>{progress}%</strong>
            <div className="visa-progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>
          </div>
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={`visa-step${index === activeStep ? ' visa-step--active' : ''}${index < activeStep ? ' visa-step--done' : ''}`}
              onClick={() => setActiveStep(index)}
            >
              <span>{index + 1}</span>
              <strong>{step.title}</strong>
              <small>{step.subtitle}</small>
            </button>
          ))}
        </aside>

        <form className="visa-form-card" onSubmit={(e) => e.preventDefault()}>
          <div className="visa-current-step">
            <span>第 {activeStep + 1} 步 / 共 {steps.length} 步</span>
            <h2>{currentStep.title}</h2>
            <p>{currentStep.subtitle}</p>
          </div>

          {currentStep.id === 'personal' && (
            <SectionBlock title="申请人基础信息">
              <div className="visa-grid">
                <Field label="姓名" value={formData.personal.name} onChange={(value) => updateGroup('personal', 'name', value)} />
                <Field label="护照号码" value={formData.personal.passportNo} onChange={(value) => updateGroup('personal', 'passportNo', value)} />
                <Field label="出生日期" value={formData.personal.birthday} onChange={(value) => updateGroup('personal', 'birthday', value)} placeholder="年/月/日" />
                <Field label="护照颁发时间" value={formData.personal.passportIssueDate} onChange={(value) => updateGroup('personal', 'passportIssueDate', value)} />
                <Field label="护照到期时间" value={formData.personal.passportExpiryDate} onChange={(value) => updateGroup('personal', 'passportExpiryDate', value)} />
                <Field label="身份证号码" value={formData.personal.idNo} onChange={(value) => updateGroup('personal', 'idNo', value)} />
                <Field label="手机号码" value={formData.personal.phone} onChange={(value) => updateGroup('personal', 'phone', value)} />
                <Field label="电子邮箱" value={formData.personal.email} onChange={(value) => updateGroup('personal', 'email', value)} />
                <Field label="婚姻状态" value={formData.personal.maritalStatus} onChange={(value) => updateGroup('personal', 'maritalStatus', value)} />
                <Field label="性别" value={formData.personal.gender} onChange={(value) => updateGroup('personal', 'gender', value)} />
                <Field label="出生地（按户口本填写）" value={formData.personal.birthplace} onChange={(value) => updateGroup('personal', 'birthplace', value)} />
                <Field label="现居住地址（新西兰地址，如适用）" value={formData.personal.nzAddress} onChange={(value) => updateGroup('personal', 'nzAddress', value)} textarea />
                <Field label="最后一次中国居住地址" value={formData.personal.chinaAddress} onChange={(value) => updateGroup('personal', 'chinaAddress', value)} textarea />
              </div>
            </SectionBlock>
          )}

          {currentStep.id === 'work' && (
            <>
              <Repeater
                title="当前在职工作"
                note="是否能提供此工作对应的社保记录+工资入账流水，请如实告知。"
                noteHighlight
                items={formData.currentWork}
                onAdd={() => addListItem('currentWork', emptyWork)}
                onRemove={(index) => removeListItem('currentWork', index)}
                renderItem={(item, index) => renderWorkFields('currentWork', item, index)}
              />
              <Repeater
                title="过去10年工作经验"
                note="重点填写能提供社保记录+工资入账流水的工作背景。"
                noteHighlight
                items={formData.pastWork}
                onAdd={() => addListItem('pastWork', emptyWork)}
                onRemove={(index) => removeListItem('pastWork', index)}
                renderItem={(item, index) => renderWorkFields('pastWork', item, index)}
              />
            </>
          )}

          {currentStep.id === 'education' && (
            <>
              <Repeater
                title="教育经历"
                note="按原表要求，填写最高学历即可；如有多段也可以添加。"
                items={formData.education}
                onAdd={() => addListItem('education', emptyEducation)}
                onRemove={(index) => removeListItem('education', index)}
                renderItem={(item, index) => (
                  <div className="visa-grid">
                    <Field label="从年/月" value={item.from} onChange={(value) => updateList('education', index, 'from', value)} />
                    <Field label="到年/月" value={item.to} onChange={(value) => updateList('education', index, 'to', value)} />
                    <Field label="学校名称" value={item.school} onChange={(value) => updateList('education', index, 'school', value)} />
                    <Field label="专业" value={item.major} onChange={(value) => updateList('education', index, 'major', value)} />
                    <Field label="学历" value={item.degree} onChange={(value) => updateList('education', index, 'degree', value)} />
                  </div>
                )}
              />
              <Repeater
                title="取得证书"
                note="国内职业资格证书、英文证书、国外技能证书等。"
                items={formData.certificates}
                onAdd={() => addListItem('certificates', emptyCertificate)}
                onRemove={(index) => removeListItem('certificates', index)}
                renderItem={(item, index) => (
                  <div className="visa-grid">
                    <Field label="发证时间" value={item.date} onChange={(value) => updateList('certificates', index, 'date', value)} />
                    <Field label="证书名称" value={item.name} onChange={(value) => updateList('certificates', index, 'name', value)} />
                    <Field label="发证机构" value={item.authority} onChange={(value) => updateList('certificates', index, 'authority', value)} />
                  </div>
                )}
              />
            </>
          )}

          {currentStep.id === 'family' && (
            <>
              <SectionBlock title="配偶信息" note="如配偶有护照，需要提供配偶护照首页。">
                <div className="visa-grid visa-grid--wide">
                  {['name', 'pinyin', 'relation', 'birthday', 'country', 'occupation'].map((key) => (
                    <Field
                      key={key}
                      label={{
                        name: '姓名',
                        pinyin: '姓名拼音',
                        relation: '亲属关系',
                        birthday: '出生日期',
                        country: '现居住国家',
                        occupation: '职业',
                      }[key]}
                      value={formData.spouse[key]}
                      onChange={(value) => setFormData((prev) => ({ ...prev, spouse: { ...prev.spouse, [key]: value } }))}
                    />
                  ))}
                  <Field label="配偶出生地" value={formData.spouse.birthplace} onChange={(value) => setFormData((prev) => ({ ...prev, spouse: { ...prev.spouse, birthplace: value } }))} />
                  <Field label="护照情况说明" value={formData.spouse.passportNote} onChange={(value) => setFormData((prev) => ({ ...prev, spouse: { ...prev.spouse, passportNote: value } }))} textarea />
                </div>
              </SectionBlock>
              <Repeater title="父母" note="包括已故父亲信息，请在名字后面标注“已故”（如适用）。" items={formData.parents} onAdd={() => addListItem('parents', emptyFamily)} onRemove={(index) => removeListItem('parents', index)} renderItem={(item, index) => renderFamilyFields('parents', item, index)} />
              <Repeater title="子女" items={formData.children} onAdd={() => addListItem('children', emptyFamily)} onRemove={(index) => removeListItem('children', index)} renderItem={(item, index) => renderFamilyFields('children', item, index)} />
              <Repeater title="兄弟姐妹" items={formData.siblings} onAdd={() => addListItem('siblings', emptyFamily)} onRemove={(index) => removeListItem('siblings', index)} renderItem={(item, index) => renderFamilyFields('siblings', item, index)} />
            </>
          )}

          {currentStep.id === 'travel' && (
            <Repeater
              title="海外出入境记录"
              note="以中国为基准，填写过去10年信息，时间具体到月份。"
              items={formData.travel}
              onAdd={() => addListItem('travel', emptyTravel)}
              onRemove={(index) => removeListItem('travel', index)}
              renderItem={(item, index) => (
                <div className="visa-grid">
                  <Field label="出境时间" value={item.departure} onChange={(value) => updateList('travel', index, 'departure', value)} />
                  <Field label="回国时间" value={item.returnDate} onChange={(value) => updateList('travel', index, 'returnDate', value)} />
                  <Field label="国家" value={item.country} onChange={(value) => updateList('travel', index, 'country', value)} />
                  <Field label="海外落地机场" value={item.airport} onChange={(value) => updateList('travel', index, 'airport', value)} />
                  <Field label="入境事由" value={item.purpose} onChange={(value) => updateList('travel', index, 'purpose', value)} placeholder="旅游、工作、学习等" />
                </div>
              )}
            />
          )}

          {currentStep.id === 'visaMedical' && (
            <>
              <SectionBlock title="新西兰签证信息">
                <div className="visa-question-grid">
                  <ChoiceField label="是否确认过新西兰签证？" value={formData.visa.hadNzVisa} options={yesNoOptions} onChange={(value) => updateGroup('visa', 'hadNzVisa', value)} />
                  <ChoiceField label="预计新西兰停留时间？" value={formData.visa.expectedStay} options={stayOptions} onChange={(value) => updateGroup('visa', 'expectedStay', value)} />
                </div>
                <div className="visa-grid">
                  <Field label="Client number" value={formData.visa.clientNumber} onChange={(value) => updateGroup('visa', 'clientNumber', value)} />
                  <Field label="签证留底 PDF 文件说明" value={formData.visa.visaFileNote} onChange={(value) => updateGroup('visa', 'visaFileNote', value)} textarea />
                </div>
              </SectionBlock>
              <SectionBlock title="新西兰签证申请医疗信息确认">
                <div className="visa-question-grid">
                  <ChoiceField label="您是否患有结核病（TB）？" value={formData.medical.tb} options={yesNoOptions} onChange={(value) => updateGroup('medical', 'tb', value)} />
                  <ChoiceField label="停留期间是否需要进行肾透析？" value={formData.medical.dialysis} options={yesNoOptions} onChange={(value) => updateGroup('medical', 'dialysis', value)} />
                  <ChoiceField label="是否有需要或可能需要接受医院或专科治疗的医疗状况？" value={formData.medical.hospitalCare} options={yesNoOptions} onChange={(value) => updateGroup('medical', 'hospitalCare', value)} />
                  <ChoiceField label="停留期间是否需要或可能需要接受长期护理？" value={formData.medical.longTermCare} options={yesNoOptions} onChange={(value) => updateGroup('medical', 'longTermCare', value)} />
                  <ChoiceField label="您计划在新西兰停留多久？" value={formData.medical.plannedStay} options={stayOptions} onChange={(value) => updateGroup('medical', 'plannedStay', value)} />
                  <ChoiceField label="之前是否为新西兰签证申请接受过体检？" value={formData.medical.previousMedical} options={yesNoOptions} onChange={(value) => updateGroup('medical', 'previousMedical', value)} />
                  <ChoiceField label="是否已经为这次签证申请接受了体检？" value={formData.medical.currentMedical} options={yesNoOptions} onChange={(value) => updateGroup('medical', 'currentMedical', value)} />
                  <ChoiceField label="最近一次体检是否包括过去36个月内胸部X光片？" value={formData.medical.xray36Months} options={yesNoOptions} onChange={(value) => updateGroup('medical', 'xray36Months', value)} />
                  <ChoiceField label="自那次体检之后，健康状况是否有恶化？" value={formData.medical.healthWorse} options={yesNoOptions} onChange={(value) => updateGroup('medical', 'healthWorse', value)} />
                </div>
                <Field label="医疗体检号码（N000）" value={formData.medical.medicalNumber} onChange={(value) => updateGroup('medical', 'medicalNumber', value)} />
              </SectionBlock>
            </>
          )}

          {currentStep.id === 'character' && (
            <SectionBlock title="道德品质确认">
              <div className="visa-question-grid">
                <ChoiceField label="您是否曾因任何罪行被定罪，包括任何交通违法行为？" value={formData.character.convicted} options={yesNoOptions} onChange={(value) => updateGroup('character', 'convicted', value)} />
                <ChoiceField label="您目前是否正在接受调查、被通缉、被传唤问话，或在任何国家面临指控？" value={formData.character.underInvestigation} options={yesNoOptions} onChange={(value) => updateGroup('character', 'underInvestigation', value)} />
                <ChoiceField label="您是否曾在任何国家被驱逐、遣返、拒绝入境或被要求离境？" value={formData.character.deported} options={yesNoOptions} onChange={(value) => updateGroup('character', 'deported', value)} />
                <ChoiceField label="您是否曾被除新西兰以外的任何国家拒发签证或许可？" value={formData.character.visaDeclinedOutsideNz} options={yesNoOptions} onChange={(value) => updateGroup('character', 'visaDeclinedOutsideNz', value)} />
                <ChoiceField label="自17岁起，是否曾在其他任何国家连续居住5年或以上？" value={formData.character.livedFiveYears} options={yesNoOptions} onChange={(value) => updateGroup('character', 'livedFiveYears', value)} />
                <ChoiceField label="是否在之前的新西兰签证申请中提交过该国无犯罪证明？" value={formData.character.submittedPoliceCert} options={yesNoOptions} onChange={(value) => updateGroup('character', 'submittedPoliceCert', value)} />
                <ChoiceField label="该无犯罪证明是否在过去24个月内签发？" value={formData.character.policeCertWithin24Months} options={yesNoOptions} onChange={(value) => updateGroup('character', 'policeCertWithin24Months', value)} />
                <ChoiceField label="您是否曾与任何情报机构、组织或执法机构有过关联？" value={formData.character.intelligenceOrLaw} options={yesNoOptions} onChange={(value) => updateGroup('character', 'intelligenceOrLaw', value)} />
                <ChoiceField label="是否曾与使用或宣扬暴力、侵犯人权的组织或团体有关联？" value={formData.character.violentGroup} options={yesNoOptions} onChange={(value) => updateGroup('character', 'violentGroup', value)} />
                <ChoiceField label="是否曾实施、参与或涉及战争罪、反人类罪或侵犯人权行为？" value={formData.character.humanRights} options={yesNoOptions} onChange={(value) => updateGroup('character', 'humanRights', value)} />
              </div>
            </SectionBlock>
          )}

          {currentStep.id === 'other' && (
            <SectionBlock title="其他相关问题与本人确认">
              <div className="visa-question-grid">
                <ChoiceField label="是否有本地联系人（家人或朋友）？" value={formData.other.localContact} options={yesNoOptions} onChange={(value) => updateGroup('other', 'localContact', value)} />
                <ChoiceField label="雇主是否为您的直系亲属，或曾在签证申请中提供过其姓名？" value={formData.other.employerRelative} options={yesNoOptions} onChange={(value) => updateGroup('other', 'employerRelative', value)} />
                <ChoiceField label="未来是否有担保小孩和配偶的需要？" value={formData.other.sponsorFamilyFuture} options={yesNoOptions} onChange={(value) => updateGroup('other', 'sponsorFamilyFuture', value)} />
                <ChoiceField label="是否有任何兵役历史？" value={formData.other.militaryHistory} options={yesNoOptions} onChange={(value) => updateGroup('other', 'militaryHistory', value)} />
              </div>
              <div className="visa-grid">
                <Field label="本地联系人详情" value={formData.other.localContactDetail} onChange={(value) => updateGroup('other', 'localContactDetail', value)} placeholder="姓名、生日、地址及电话" textarea />
                <Field label="兵役详情" value={formData.other.militaryDetail} onChange={(value) => updateGroup('other', 'militaryDetail', value)} placeholder="开始/结束时间、部队番号、军衔、职位、上级领导、退伍证说明" textarea />
                <Field label="随行或一同申请人姓名" value={formData.other.coApplicants} onChange={(value) => updateGroup('other', 'coApplicants', value)} textarea />
                <Field label="签字姓名" value={formData.other.declarationName} onChange={(value) => updateGroup('other', 'declarationName', value)} />
                <Field label="日期" value={formData.other.declarationDate} onChange={(value) => updateGroup('other', 'declarationDate', value)} />
              </div>
              <p className="visa-declaration">
                本人承诺：以上信息属实，如有虚假、虚报、瞒报，所导致的任何严重后果，愿承担责任及后果。特此确认。
              </p>
            </SectionBlock>
          )}

          {currentStep.id === 'review' && (
            <div className="visa-review">
              <div className="visa-review-actions">
                <p>请先检查预览内容。点击“生成PDF”后，在系统打印窗口选择“另存为 PDF”。</p>
                <button type="button" className="visa-primary-btn" onClick={() => window.print()}>
                  生成PDF
                </button>
              </div>
              <div className="visa-print-area">
                <h2>签证个人信息表</h2>
                <PersonalInfoSummary data={formData.personal} />
                <SummaryTable title="当前工作" rows={formData.currentWork} columns={[{ key: 'from', label: '从' }, { key: 'to', label: '到' }, { key: 'company', label: '单位' }, { key: 'position', label: '职位' }, { key: 'address', label: '地址' }, { key: 'supervisor', label: '上司' }, { key: 'proof', label: '社保/流水' }]} />
                <SummaryTable title="过去10年工作经验" rows={formData.pastWork} columns={[{ key: 'from', label: '从' }, { key: 'to', label: '到' }, { key: 'company', label: '单位' }, { key: 'position', label: '职位' }, { key: 'address', label: '地址' }, { key: 'supervisor', label: '上司' }, { key: 'proof', label: '社保/流水' }]} />
                <SummaryTable title="教育经历" rows={formData.education} columns={[{ key: 'from', label: '从' }, { key: 'to', label: '到' }, { key: 'school', label: '学校' }, { key: 'major', label: '专业' }, { key: 'degree', label: '学历' }]} />
                <SummaryTable title="证书" rows={formData.certificates} columns={[{ key: 'date', label: '发证时间' }, { key: 'name', label: '证书名称' }, { key: 'authority', label: '发证机构' }]} />
                <SummaryTable title="父母" rows={formData.parents} columns={[{ key: 'name', label: '姓名' }, { key: 'pinyin', label: '拼音' }, { key: 'relation', label: '关系' }, { key: 'birthday', label: '生日' }, { key: 'country', label: '居住国家' }, { key: 'occupation', label: '职业' }]} />
                <SummaryTable title="子女" rows={formData.children} columns={[{ key: 'name', label: '姓名' }, { key: 'pinyin', label: '拼音' }, { key: 'relation', label: '关系' }, { key: 'birthday', label: '生日' }, { key: 'country', label: '居住国家' }, { key: 'occupation', label: '职业' }, { key: 'maritalStatus', label: '婚姻' }]} />
                <SummaryTable title="兄弟姐妹" rows={formData.siblings} columns={[{ key: 'name', label: '姓名' }, { key: 'pinyin', label: '拼音' }, { key: 'relation', label: '关系' }, { key: 'birthday', label: '生日' }, { key: 'country', label: '居住国家' }, { key: 'occupation', label: '职业' }, { key: 'maritalStatus', label: '婚姻' }]} />
                <SummaryTable title="海外出入境记录" rows={formData.travel} columns={[{ key: 'departure', label: '出境' }, { key: 'returnDate', label: '回国' }, { key: 'country', label: '国家' }, { key: 'airport', label: '机场' }, { key: 'purpose', label: '事由' }]} />
                {reviewQuestionGroups.map((questionGroup) => (
                  <section className="visa-print-section" key={questionGroup.title}>
                    <h3>{questionGroup.title}</h3>
                    <div className="visa-summary-grid visa-summary-grid--questions">
                      {questionGroup.items.map((item) => (
                        <SummaryRow
                          key={`${questionGroup.group}.${item.key}`}
                          label={item.label}
                          value={formData[questionGroup.group][item.key]}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}

          <div className="visa-form-nav">
            <button type="button" className="visa-secondary-btn" onClick={goPrev} disabled={activeStep === 0}>
              上一步
            </button>
            <button type="button" className="visa-primary-btn" onClick={goNext} disabled={activeStep === steps.length - 1}>
              下一步
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default VisaInfoFormPage
