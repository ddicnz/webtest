export const englishServices = {
  tourist: {
    title: 'Visitor Visa Applications',
    summary: 'Support for New Zealand visitor visas for tourism, family visits and short business trips.',
    fullContent: `New Zealand Visitor Visas are used for tourism, visiting family, short business trips and other temporary stays. We help applicants organise a clear application that explains the purpose of travel, itinerary, available funds and reasons to return home.

How we can help

• Confirm the appropriate visitor visa pathway and likely evidence requirements
• Prepare a tailored document checklist
• Review travel plans, employment evidence and financial documents
• Lodge the application and respond to requests for further information

Every application is assessed on its own facts. Contact us for an assessment before relying on general information online.

Phone: +64 027 722 3339
WeChat: ddtrip700 / ddtrip800 / ddtrip999`,
  },
  work: {
    title: 'Work Visa Applications',
    summary: 'AEWV and other New Zealand work visa support, from job and document review through to lodgement.',
    fullContent: `Accredited Employer Work Visa (AEWV)

The AEWV is a major New Zealand work visa pathway. Applicants normally need a genuine full-time offer from an accredited employer for a role that meets Immigration New Zealand requirements.

How we can help

• Review the employer, role and Job Check information
• Prepare and lodge the work visa application
• Organise employment, qualification and work-experience evidence
• Plan eligible partner and dependent-child applications
• Discuss possible longer-term residence pathways

Visa conditions, English requirements and permitted length of stay depend on the role and the policy in force when the application is made. We provide individual advice based on current requirements.

Phone: +64 027 722 3339
WeChat: ddtrip700 / ddtrip800 / ddtrip999`,
  },
  residence: {
    title: 'Resident Visa Applications',
    summary: 'Assessment and application support for skilled, Green List and family residence pathways.',
    fullContent: `New Zealand resident visas include skilled, Green List and family pathways. The correct pathway depends on your occupation, qualifications, registration, employment, income and family circumstances.

How we can help

• Identify potentially suitable residence categories
• Assess points, employment and registration requirements
• Prepare qualification, employment and family evidence
• Lodge the application and manage requests for further information
• Support eligible partner, child and parent applications

Residence applications are evidence-heavy and policy settings can change. A personal assessment is recommended before making plans or incurring costs.

Phone: +64 027 722 3339
WeChat: ddtrip700 / ddtrip800 / ddtrip999`,
  },
  invest: {
    title: 'Investor Migration',
    summary: 'Planning support for eligible investors and families considering New Zealand residence pathways.',
    fullContent: `New Zealand investor pathways are designed for applicants who can make qualifying investments and demonstrate that their funds were lawfully earned or acquired.

Our support may include

• Initial pathway and eligibility assessment
• Source-of-funds and ownership-document planning
• Coordination of immigration evidence with appropriate professional advisers
• Visa application preparation and follow-up
• Family and settlement planning

Investment thresholds, acceptable investments, timeframes and residence obligations vary by category and can change. Financial and legal advice should be obtained from appropriately qualified professionals.

Phone: +64 027 722 3339
WeChat: ddtrip700 / ddtrip800 / ddtrip999`,
  },
  skilled: {
    title: 'Skilled Residence',
    summary: 'Individual assessment of skilled residence points, employment, registration and New Zealand experience.',
    fullContent: `Skilled Migrant Category

New Zealand's Skilled Migrant Category uses a points-based framework. Eligibility may depend on qualifications, occupational registration, income, skilled employment or New Zealand skilled work experience, together with English, health and character requirements.

How we can help

• Assess your current points and evidence
• Review qualifications, registration, pay and skilled employment
• Identify evidence gaps and a realistic application timeline
• Prepare and lodge the resident visa application
• Respond to Immigration New Zealand enquiries

The correct calculation depends on the policy in force at the time of application. Contact us for an individual assessment.

Phone: +64 027 722 3339
WeChat: ddtrip700 / ddtrip800 / ddtrip999`,
  },
  study: {
    title: 'Study in New Zealand',
    summary: 'School and programme selection, admission, student visas and longer-term study-to-work planning.',
    fullContent: `Studying in New Zealand can support academic, career and family goals. We assist with primary, intermediate, secondary and tertiary study planning.

Our study services

• Student profile and goal assessment
• School, institution and programme recommendations
• Admission applications and offer follow-up
• Student visa document preparation and lodgement
• Eligible partner and dependent-child planning
• Post-study work and longer-term pathway discussions

We consider programme suitability, entry requirements, cost, location and realistic employment outcomes. Visa and work rights depend on the course and the rules in force at the time.

Phone: +64 027 722 3339
WeChat: ddtrip700 / ddtrip800 / ddtrip999`,
  },
}

export const englishAlbumSections = {
  reception: 'Client Visits',
  office: 'Our Office',
  team: 'Community & Team Activities',
  license: 'Licensed Advisers',
  local: 'Life in New Zealand',
}

export const englishNews = {
  12: ['AEWV English Requirements Extended to Skill Level 3 Roles', 'An overview of the announced English-language requirement changes for selected AEWV roles from 1 June 2026.'],
  11: ['Post-study Work Visa Changes and New Short-term Graduate Visa', 'A summary of announced changes affecting post-study work eligibility and a new short-term pathway for some graduates.'],
  10: ['2026 Skilled Migrant Category and AEWV Changes', 'An introduction to the announced Skilled Migrant Category pathways and related AEWV settings.'],
  9: ['Changes to Open Work Visas from 20 April', 'A short overview of changes affecting selected open work visa holders.'],
  7: ['New Occupations on the National Occupation List and Median Wage Update', 'A summary of occupation-list additions and annual wage-setting changes relevant to immigration applications.'],
  1: ['New Zealand Skilled Residence Policy Update', 'A brief update on New Zealand skilled residence settings.'],
  2: ['Understanding the Six-point Skilled Migrant Category', 'A plain-English introduction to points from qualifications, registration, income and New Zealand skilled work experience.'],
  3: ['Investor Migration: Pathways from NZD 1 Million', 'An overview of announced business and investor pathways for eligible applicants.'],
  8: ['Active Investor Plus Visa: NZD 5 Million and NZD 10 Million Categories', 'A general explanation of the Growth and Balanced investment categories.'],
  4: ['Visitor Visa Extensions and Further Applications', 'General points to consider before applying for a further visitor visa.'],
  5: ['Understanding Green List Residence Pathways', 'An overview of Straight to Residence and Work to Residence pathways for listed occupations.'],
  6: ['Parent Residence Visa Overview', 'A short introduction to parent residence options and the importance of checking current eligibility and queue settings.'],
}

function formatEnglishDate(value) {
  const match = String(value || '').match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/)
  if (!match) return value
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${Number(match[3])} ${monthNames[Number(match[2]) - 1]} ${match[1]}`
}

export function getEnglishNewsItem(item) {
  const [title, summary] = englishNews[item.id] || [`Immigration Update ${item.id}`, 'A New Zealand immigration information update.']
  return {
    ...item,
    title,
    summary,
    date: formatEnglishDate(item.date),
    fullContent: `${summary}\n\nImmigration settings and eligibility criteria can change. This article is general information only and is not immigration advice. Check the current Immigration New Zealand instructions or request an individual assessment before making decisions.`,
  }
}

export function getEnglishCaseItem(item) {
  return {
    ...item,
    title: `Successful Application – Case ${item.id}`,
    summary: 'A successful New Zealand immigration or visa outcome. Open the case to view the approval record.',
    date: formatEnglishDate(item.date),
    fullContent: `This page records a successful outcome for case ${item.id}. The images shown are the supporting approval record published for this case.\n\nEvery application is assessed individually. A previous result does not guarantee the outcome of another application.`,
  }
}

export const englishFaq = {
  100: ['What is an Accredited Employer Work Visa (AEWV)?', 'The AEWV is a work visa linked to a genuine full-time job with an accredited New Zealand employer. The employer, role and applicant must meet the requirements that apply when the application is lodged.'],
  101: ['Do I need English to work in New Zealand?', 'English requirements depend on the visa, role and skill level. Some AEWV roles require formal evidence while others may not. Check the approved Job Check and current Immigration New Zealand instructions.'],
  102: ['What documents are normally required for an AEWV?', 'Common evidence includes a passport, photo, employment agreement, Job Check information, health and character documents where required, and evidence of relevant qualifications or work experience.'],
  1020: ['What pay and leave can an AEWV worker expect?', 'Pay depends on the occupation, experience and employment agreement. New Zealand minimum employment standards apply, including statutory annual and sick leave entitlements where eligible.'],
  103: ['Can an AEWV holder support visas for family members?', 'Some AEWV holders can support work, visitor or student visas for eligible partners and dependent children. Eligibility depends on the worker’s role, income and visa conditions.'],
  104: ['Can my partner and children come with me?', 'Potentially, yes. The visa type available to each family member depends on the main applicant’s visa, occupation, pay and current family-visa rules.'],
  105: ['Is there an age limit for an AEWV?', 'The AEWV does not generally have a fixed upper age limit, but applicants must meet the role, health, character and any other applicable requirements.'],
  106: ['Can I renew an AEWV after five years?', 'AEWV holders may be subject to a maximum continuous stay and a period outside New Zealand before another AEWV. The applicable period depends on the role and current settings.'],
  107: ['What documents are needed for a further work visa?', 'A further application commonly requires updated employment, Job Check, identity, health, character, English and work-experience evidence, depending on the case.'],
  108: ['Can I change employer or job on an AEWV?', 'A change of employer, occupation or location may require a Job Change or other approval before the new work starts. Working outside visa conditions can create immigration risk.'],
  109: ['How can a work visa lead to residence?', 'Possible pathways include the Skilled Migrant Category, Green List and sector pathways. Eligibility depends on occupation, registration, qualifications, pay, experience, age, English, health and character.'],
  110: ['How long does AEWV processing take?', 'Processing times vary and Immigration New Zealand updates them regularly. Allow extra time for medical, police or further-information requests.'],
  111: ['Can I apply for an AEWV while holding a partner work visa?', 'It may be possible to apply onshore if you have a genuine qualifying job with an accredited employer and meet all AEWV requirements.'],
  204: ['Can international students work?', 'Work rights depend on the student visa conditions and programme. Eligible students may work limited hours during study and sometimes full-time during scheduled breaks.'],
  205: ['How much should I budget for rent and living costs?', 'Costs vary significantly by city, accommodation and lifestyle. Use current school, tenancy and Immigration New Zealand figures when preparing a budget.'],
  206: ['How many times can I receive a post-study work visa?', 'A post-study work visa is generally available once. Eligibility, duration and work conditions depend on the qualification and the policy in force when you apply.'],
  201: ['What ages are suitable for primary and secondary study?', 'New Zealand children usually start school at age five. International placement depends on age, prior schooling, English support and the receiving school’s assessment.'],
  202: ['What English level is needed to study in New Zealand?', 'School requirements vary. Many tertiary programmes commonly ask for IELTS 6.0 for undergraduate study or 6.5 for postgraduate study, but programme-specific requirements may be higher.'],
  203: ['What is the study application process?', 'Choose a suitable school and programme, prepare academic and identity documents, apply for admission, then prepare the student visa after receiving an offer.'],
  207: ['How much does study in New Zealand cost?', 'Fees vary by school, year level and programme. International school and tertiary students should also budget for insurance, accommodation, transport and daily living costs.'],
  208: ['Can study and work pathways be planned together?', 'Yes, but outcomes are not guaranteed. Programme choice should be based on genuine study goals while considering lawful post-study work and longer-term options.'],
  401: ['What are the main requirements for the six-point Skilled Migrant Category?', 'Applicants generally need six skilled-residence points, qualifying skilled employment or an offer, and must meet age, English, health and character requirements.'],
  402: ['How are Skilled Migrant Category points calculated?', 'Points may come from one main skill category, such as registration, qualification or income, with eligible New Zealand skilled work experience used to reach six points where allowed.'],
  403: ['What is required for a Green List residence pathway?', 'Tier 1 occupations may qualify for Straight to Residence, while Tier 2 occupations generally require qualifying New Zealand work before a Work to Residence application. Role-specific requirements apply.'],
  404: ['What are the care and transport residence pathways?', 'Specified care and transport workers may qualify after the required period of eligible New Zealand work, provided their occupation, pay, employment and other criteria meet current instructions.'],
  501: ['What investor migration pathways are available?', 'New Zealand has investor and business-investor pathways with different investment, source-of-funds, business, residence and time requirements. Obtain current immigration, legal and financial advice before investing.'],
  503: ['What is the Business Investor Work Visa?', 'This pathway is intended for eligible experienced businesspeople investing in an existing New Zealand business. Investment, ownership, employment, funds, age, English, health and character criteria apply.'],
  309: ['What documents are needed for a Visitor Visa?', 'Common evidence includes identity documents, funds, travel plans, return-travel arrangements, employment or study ties, and health or character documents where requested.'],
  310: ['Can a Visitor Visa holder apply for a work visa?', 'A person in New Zealand may be able to apply for a work visa if they meet all requirements. They must not work until they hold a visa that permits the work.'],
  311: ['Can a Visitor Visa holder apply for a student visa?', 'It may be possible after receiving an acceptable offer of place and meeting funds, health, character and other student visa requirements.'],
  302: ['How much do New Zealand visa applications cost?', 'Application charges vary by visa type, location and applicant circumstances. Check the current Immigration New Zealand fee finder before applying.'],
  301: ['What must I declare when entering New Zealand?', 'Food, plant, animal and other biosecurity-risk goods must be declared. Cash-reporting and restricted-goods rules also apply. Check MPI and New Zealand Customs guidance before travel.'],
  312: ['When is a police certificate required?', 'Police certificate requirements depend on age, nationality, countries lived in, visa type and intended stay. Translation and validity rules also apply.'],
  313: ['How long are immigration medical results valid?', 'Medical and chest X-ray validity depends on when and how the results were submitted and whether Immigration New Zealand requests new evidence. Use an approved panel physician where required.'],
}

export function getEnglishFaqItem(item) {
  const [question, answer] = englishFaq[item.id] || ['Immigration question', 'Requirements depend on individual circumstances and current immigration instructions.']
  return { ...item, question, answer, tableData: null }
}
