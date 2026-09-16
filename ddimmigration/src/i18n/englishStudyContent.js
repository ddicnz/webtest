export const englishStudyIntro = [
  'New Zealand offers internationally recognised primary, secondary, vocational and tertiary education in an English-speaking environment.',
  'We assist with school and programme selection, admission documents, student visas and family planning. Study choices are considered alongside realistic career and longer-term options.',
  'The information below is a starting point only. Entry requirements, fees, places and visa settings can change, so please contact us for an assessment before applying.',
]

export const englishStudySectionLabels = {
  tertiary: 'Universities & Higher Education',
  technical: 'Vocational Study',
  language: 'English Language Courses',
  highschool: 'High Schools',
  middleschool: 'Intermediate Schools',
  primary: 'Primary Schools',
}

const sectionParagraphs = {
  tertiary: [
    'New Zealand has eight public universities, together with institutes of technology and private tertiary providers. Bachelor’s degrees commonly take three years, while postgraduate programmes vary by qualification.',
    'We help students compare academic entry, English requirements, location, tuition, programme structure and likely career outcomes before choosing a course.',
  ],
  technical: [
    'Vocational providers offer certificates, diplomas and degrees in practical fields such as construction, automotive trades, cookery, healthcare, information technology and hospitality.',
    'Programme eligibility and post-study work options depend on the qualification and current immigration settings. We can help you check the course before applying.',
  ],
  language: [
    'English-language options include General English, academic English, IELTS and PTE preparation, and NZCEL qualifications.',
    'We can help select a course that matches your current level, study goal and intended next programme.',
  ],
  highschool: [
    'New Zealand secondary schools generally cover Years 9–13. Most offer NCEA, while selected schools also offer Cambridge or IB programmes.',
    'We assist with school selection, subject planning, homestay arrangements, admission and student visa preparation.',
  ],
  middleschool: [
    'Intermediate schools generally cover Years 7–8 and help students transition from primary to secondary education.',
    'We can assist families with school selection, admission, visa planning and the next step into high school.',
  ],
  primary: [
    'New Zealand primary education usually begins at age five. International enrolment, year placement and available support are assessed by each school.',
    'We help families compare schools, locations, fees and visa arrangements, including options for accompanying parents and eligible dependent children.',
  ],
}

const sectionProspects = {
  tertiary: ['Recognised New Zealand qualification', 'Academic and career-focused programme options', 'Possible post-study work options, subject to eligibility'],
  technical: ['Practical, employment-focused training', 'Certificate, diploma and degree pathways', 'Work and visa options depend on the qualification and current rules'],
  language: ['English development for study, work or testing goals', 'Flexible course levels and delivery options', 'Progression options into further study where eligible'],
  highschool: ['NCEA and selected Cambridge or IB pathways', 'Academic, sporting and cultural opportunities', 'Preparation for New Zealand and overseas tertiary study'],
  middleschool: ['Transition support before secondary school', 'Broad academic and co-curricular learning', 'English-language support may be available'],
  primary: ['English-language immersion', 'Broad academic and co-curricular learning', 'Supportive preparation for later New Zealand schooling'],
}

const highSchoolRoutes = [
  {
    title: 'Pathway 1: Foundation study after Year 12 equivalent',
    tagline: 'A possible option for students who want to prepare for university without completing the Chinese Gaokao.',
    points: ['Foundation programmes commonly take 8–12 months.', 'Successful completion may lead to Year 1 of an eligible bachelor’s degree.', 'Entry and progression requirements vary by provider and degree.'],
  },
  {
    title: 'Pathway 2: International Year One or Diploma',
    tagline: 'A possible option for students seeking a supported transition into degree-level study.',
    points: ['Students complete an approved diploma or International Year One programme.', 'Eligible graduates may progress into a related bachelor’s degree.', 'Credit and progression depend on the provider, programme and results.'],
  },
]

export function getEnglishStudyProgram(program, sectionId) {
  const title = program.titleEn || program.titleZh || 'Study Programme'
  return {
    ...program,
    titleZh: title,
    titleEn: '',
    highlight: `${title} — admission and student visa support`,
    cost: 'Contact us for the latest official tuition and fee information.',
    detailCost: 'Tuition, compulsory fees, insurance and accommodation costs vary by intake and student circumstances. We will confirm the current official fee schedule before an application is submitted.',
    costNote: null,
    detail: `We can help you review ${title}, confirm the current entry requirements and prepare the school and student visa applications. Places and programme details are subject to the education provider’s approval.`,
    schedule: program.schedule ? 'Timetable and delivery arrangements are confirmed by the education provider.' : null,
    languageReq: 'English requirements depend on the programme and the provider’s assessment.',
    academicReq: 'Academic entry and year placement depend on prior study and the provider’s assessment.',
    intakes: 'Intakes and available places must be confirmed with the education provider.',
    prospects: sectionProspects[sectionId] || ['Further study and career options depend on the completed qualification.'],
    galleryCaptions: [],
  }
}

export function getEnglishStudySection(section) {
  return {
    ...section,
    title: englishStudySectionLabels[section.id] || section.title,
    paragraphs: sectionParagraphs[section.id] || [],
    programs: section.programs?.map((program) => getEnglishStudyProgram(program, section.id)),
    routes: section.id === 'highschool' ? highSchoolRoutes : undefined,
    universities: section.universities?.map((university) => ({
      ...university,
      name: university.en,
      en: '',
      qs: university.qs?.replace('：', ': '),
      brief: 'A New Zealand public university offering undergraduate and postgraduate study across a range of disciplines.',
      points: [
        'Programme-specific academic and English entry requirements apply.',
        'Tuition and intake availability should be confirmed before applying.',
      ],
    })),
  }
}
