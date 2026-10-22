const assetBase = '/pic/study/auckland-schools/'

const posters = {
  'auckland-grammar-school': {
    name: 'Auckland Grammar School',
    subtitle: '奥克兰公立男校 · Year 9–13',
    logo: 'AGS_Logo_Crest-Mono_RGB_September-2016.png',
    hero: 'auckland-grammar.jpg',
    points: ['NCEA / Cambridge', '学术与升学', '体育与艺术', '国际生支持'],
    feeLabel: '2027年国际生费用',
    fee: 'NZ$26,250',
    feeNote: 'Homestay NZ$440/周 · 其他费用另计',
    photos: [
      'International-Department_int-student-profiles-1536x1024.jpg',
      'International-Department_2026-1536x1024.jpg',
      'Group-photo-2-1536x1024.jpg',
    ],
    footer: '在 AUCKLAND GRAMMAR SCHOOL，开启升学之路',
  },
  'macleans-college': {
    name: 'Macleans College',
    subtitle: '奥克兰东区公立男女混校 · Year 9–13',
    monogram: 'M',
    hero: 'macleans-college.jpg',
    points: ['NCEA / Cambridge', '学院制学习', '体育与艺术', '国际生支持'],
    feeLabel: '2027 国际学生年度学费',
    fee: 'NZ$26,000',
    feeNote: 'Homestay NZ$400/周 · 其他费用另计',
    photos: [
      'macleans-college-senior-students-amphitheatre-26-001.jpg',
      'macleans-college-students-laptops-classroom-26-001.jpg',
      'macleans-college-campus-aerial-auckland-26.png',
    ],
    footer: '在 MACLEANS COLLEGE，探索多元学习机会',
  },
  'epsom-girls-grammar-school': {
    name: 'Epsom Girls Grammar School',
    subtitle: '奥克兰 Epsom 公立女校 · Year 9–13',
    logo: '6b1fc6a66d6a8af7f802bbd8f6395eb3.svg',
    hero: 'epsom-girls.jpg',
    points: ['NCEA 课程', '学术与升学', '艺术与体育', '学生关怀'],
    feeLabel: '2027 国际学生年度学费',
    fee: 'NZ$25,000',
    feeNote: 'Homestay NZ$430/周 · 其他费用另计',
    photos: [
      'IMG_2866__FillWzYzMCw0NTBd.jpg',
      'IMG_2804-1__FillWzYzMCw0NTBd.jpg',
      'IMG_6433__FillWzYzMCw0NTBd.JPG',
    ],
    footer: '在 EPSOM GIRLS GRAMMAR SCHOOL，拓展未来',
  },
  'takapuna-grammar-school': {
    name: 'Takapuna Grammar School',
    subtitle: '奥克兰北岸公立男女混校 · Year 9–13',
    monogram: 'TGS',
    hero: 'takapuna-grammar.jpg',
    points: ['NCEA / IB 双路径', '学术与升学', '艺术与体育', '国际生支持'],
    feeLabel: '2027 国际学生年度学费',
    fee: 'NZ$20,000',
    feeNote: 'IB 另收 NZ$2,000/年 · 其他费用另计',
    photos: ['aug31st_031.jpg', 'school-shot.png', 'tgs2017_150.jpg'],
    footer: '在 TAKAPUNA GRAMMAR SCHOOL，开启学习之旅',
  },
}

function AucklandSchoolsPoster({ schoolId }) {
  const poster = posters[schoolId]

  return (
    <div className={`westlake-girls-poster auckland-schools-poster auckland-schools-poster--${schoolId}`} role="img" aria-label={`${poster.name} 介绍海报，${poster.feeLabel} ${poster.fee} 纽币`}>
      <div className="westlake-girls-poster-hero">
        <img src={`${assetBase}${poster.hero}`} alt="" loading="lazy" />
        <div className="westlake-girls-poster-brand auckland-schools-poster-brand">
          {poster.logo && <img src={`${assetBase}${poster.logo}`} alt="" loading="lazy" />}
          {poster.monogram && <b className="auckland-schools-poster-monogram" aria-hidden="true">{poster.monogram}</b>}
          <span>{poster.name}</span>
        </div>
        <div className="westlake-girls-poster-heading">
          <strong>{poster.name}</strong>
          <span>{poster.subtitle}</span>
        </div>
      </div>
      <div className="westlake-girls-poster-points">
        {poster.points.map((point) => <span key={point}>{point}</span>)}
      </div>
      <div className="westlake-girls-poster-fee">
        <span>{poster.feeLabel}</span>
        <strong>{poster.fee}<small>/年</small></strong>
        <small>{poster.feeNote}</small>
      </div>
      <div className="westlake-girls-poster-photos">
        {poster.photos.map((photo) => <img key={photo} src={`${assetBase}${photo}`} alt="" loading="lazy" />)}
      </div>
      <div className="westlake-girls-poster-footer">{poster.footer}</div>
    </div>
  )
}

export default AucklandSchoolsPoster
