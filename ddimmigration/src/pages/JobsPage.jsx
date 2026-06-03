import { useState } from 'react'

const JOB_LEVEL3_PREFIX = ['岗位等级：3级', '英语要求：雅思 4.0 或 PTE 29']
const JOB_LEVEL2_PREFIX = ['岗位等级：2级', '不需要英语']

function normalizeJob(job) {
  const prefix = job.skillLevel === 2 ? JOB_LEVEL2_PREFIX : JOB_LEVEL3_PREFIX
  return { ...job, requirements: [...prefix, ...job.requirements] }
}

function JobsPage() {
  const [selectedCategory, setSelectedCategory] = useState('auto')

  const categories = [
    { id: 'auto', label: '汽车类' },
    { id: 'construction', label: '建筑类' },
    { id: 'catering', label: '餐饮类' },
    { id: 'factory', label: '工厂类' },
    { id: 'other', label: '其他类' },
  ]

  const jobsByCategory = {
    auto: [
      {
        id: 101,
        title: '汽车贴膜技师',
        requirements: [
          '工作地点：奥克兰',
          '工作时间：约 50 小时/周',
          '男性，工作态度认真，熟练贴窗膜、车衣、改色膜，能独立完成施工',
          '急单愿意配合加班',
        ],
        salary: '税前25-28 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满一年 4 周带薪年假，10天带薪病假',
      },
      {
        id: 102,
        title: '汽车喷漆师傅',
        requirements: [
          '能独立完成腻子、喷漆',
          '会钣金更佳，有 4S 店经验优先',
        ],
        salary: '税前28 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满一年 4 周带薪年假，10天带薪病假',
      },
      {
        id: 103,
        title: '汽车钣金工',
        requirements: [
          '熟练凹陷修复、无损修复，铝合金钣金、切割经验',
          '不需要腻子修复',
          '45 岁以下，男性',
          '有 4S 店工作经验最佳',
        ],
        salary: '税前28 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满一年 4 周带薪年假，10天带薪病假',
      },
      {
        id: 104,
        title: '汽车维修',
        requirements: [
          '4S 店机修或大型汽修厂经验',
          '熟悉日系、德系车',
        ],
        salary: '税前28 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满一年 4 周带薪年假，10天带薪病假',
      },
      {
        id: 105,
        title: '汽车美容',
        requirements: ['汽车美容、清洁、护理等相关经验', '工时 40 小时/周起'],
        salary: '税前25 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满一年 4 周带薪年假，10天带薪病假',
      },
    ],
    construction: [
      {
        id: 33,
        skillLevel: 2,
        title: '建筑助理',
        requirements: ['协助现场施工协调、材料与进度跟进等相关经验', '每周约 50 小时'],
        salary: '28 纽币/小时税前起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 34,
        skillLevel: 2,
        title: '项目管理员',
        requirements: ['建筑或工程项目协调、资料与进度管理经验', '每周约 50 小时'],
        salary: '28 纽币/小时税前起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 35,
        skillLevel: 2,
        title: '项目协调员',
        requirements: ['工程项目现场协调、沟通对接相关经验', '每周约 50 小时'],
        salary: '28 纽币/小时税前起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 1,
        title: '木工',
        requirements: [
          '有日本工作经验的木工，能吃苦',
          '石膏板、吊顶、轻钢龙骨、建筑外墙框架',
          '每周 50 小时左右',
          '内装或外墙框架木工都可以招',
        ],
        salary: '27 纽币/小时税前，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 30,
        title: '钢筋工',
        requirements: ['钢筋下料、绑扎、安装等施工经验', '每周约 50 小时'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 32,
        title: '砌砖工',
        requirements: ['砌砖、砌墙、砂浆调配等施工经验', '每周约 50 小时'],
        salary: '28 纽币/小时税前',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 2,
        title: '瓷砖工',
        requirements: [
          '地面、墙面、切砖，熟练瓷砖技术、会做防水',
          '每周 50 小时左右',
        ],
        salary: '27 纽币/小时税前，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 5,
        title: '石膏板工',
        requirements: ['石膏板安装、抹灰、接缝处理，能独立完成墙面与吊顶石膏板施工', '每周约 50 小时'],
        salary: '27 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 6,
        title: '地板/地毯工',
        requirements: ['地板铺设（木地板、复合地板、地毯等）', '熟练裁切、拼接、收边', '每周约 50 小时'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 7,
        title: '油漆工',
        requirements: ['室内外油漆、批灰、打磨', '能独立完成墙面与木工油漆', '每周约 50 小时'],
        salary: '27 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 8,
        title: '橱柜安装工',
        requirements: ['厨房、衣柜等橱柜现场测量与安装', '熟悉五金与收口', '每周约 50 小时'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 9,
        title: '屋顶工',
        requirements: ['屋面铺设、防水、排水', '瓦片或金属屋面经验', '每周约 50 小时'],
        salary: '27 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 10,
        title: '挖掘机司机',
        requirements: ['持证或熟练操作挖掘机', '土方、平整、配合建筑施工', '每周约 55 小时'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 11,
        title: '花园木工',
        requirements: ['户外木结构、围栏、露台、花架等', '能吃苦、适应户外作业', '每周约 50 小时'],
        salary: '27 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 12,
        title: '批灰工',
        requirements: ['墙面批灰、抹灰、打磨', '能独立完成内装批灰施工', '工时 40–60 小时/周'],
        salary: '28 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 13,
        title: '框架木工',
        requirements: ['建筑框架、木结构施工', '能吃苦、有相关经验', '每周 50 小时起'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 14,
        title: '防水工人',
        requirements: ['建筑防水施工经验', '屋面、地下室、卫生间等防水处理', '每周 60 小时以上'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
    ],
    catering: [
      {
        id: 37,
        skillLevel: 2,
        title: '主厨',
        requirements: ['有餐厅主厨或厨房管理经验', '能独立负责出餐与厨房运作', '每周约 50 小时'],
        salary: '28 纽币/小时税前起',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 38,
        skillLevel: 2,
        title: '饭店经理',
        requirements: ['餐饮门店运营管理经验', '人员协调、前台与楼面管理', '每周约 50 小时'],
        salary: '28 纽币/小时税前起',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 25,
        title: '寿司师傅',
        requirements: [
          '熟悉寿司制作，有日料/寿司店经验优先',
          '随时面试，随时递交申请',
        ],
        salary: '每周税后 1000 纽币起，看能力定',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 26,
        title: '江浙菜厨师',
        requirements: [
          '熟悉江浙菜系，有相关厨房经验',
          '随时面试，随时递交申请',
        ],
        salary: '每周税后 1000 纽币起，看能力定',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 3,
        title: '西点师',
        requirements: [
          '女士优先，工作地点在基督城',
          '会做简单的午餐、三明治、可颂、小餐包等面包，熟悉烘焙技术，可以独立完成工作',
          '最好有丰富的面包店工作经验或者星级酒店饼房工作经验',
        ],
        salary: '25 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 31,
        title: '裱花师',
        requirements: [
          '熟悉奶油裱花、蛋糕抹面与基础翻糖装饰，有西点/甜品店经验优先',
          '能独立完成生日蛋糕与常规节日款式出品',
        ],
        salary: '25 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '吃住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 4,
        title: '广式面点师',
        requirements: [
          '年龄 30–45 岁',
          '熟悉广东早茶，各式点心制作',
        ],
        salary: '每周税后 1000 纽币起',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '满年有带薪休假，做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 5,
        title: '面点师',
        requirements: [
          '45 岁以内，专业面点师傅',
          '会天津狗不理包子或粤式点心、各式包点、点心、酥饼、小笼包、生煎等',
          '提供工作餐',
        ],
        salary: '每周税后 1000 纽币',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 6,
        title: '厨师',
        requirements: [
          '会炒菜、速度快，配菜都可以做，技术全面，没有大厨架子',
          '40 岁以下，东北菜（大连籍、哈尔滨优先）或川菜（四川、重庆、云南、贵州籍贯）',
          '每周 6 天，每天 10 个小时',
        ],
        salary: '税后 1000 看能力',
        visa: 'AEWV 5年工签',
        living: '工作 2 餐，住自理',
        leave: '面议',
      },
      {
        id: 7,
        title: '广东籍厨师 / 潮州厨师',
        requirements: [
          '工作地点：奥克兰、惠灵顿、基督城',
          '工作时间：6 天班，每周休息一天',
          '要求：会广东话、广东籍、丰富厨房经验的厨师，工作态度认真、勤快、有团队意识',
          '年龄 40 岁以下，技术好可以适当放宽',
        ],
        salary: '工资 1000 税后',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 8,
        title: '日料店后厨',
        requirements: [
          '熟悉日本拉面操作，有日本拉面经验最好',
          '有日料拉面厨房工作经验',
          '女士能吃苦优先考虑',
        ],
        salary: '每周税后 1000 纽币起',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '面议',
      },
      {
        id: 9,
        title: '拉面师',
        requirements: ['熟悉日式拉面制作，有相关经验优先'],
        salary: '每周税后 1000 纽币起',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '面议',
      },
      {
        id: 10,
        title: '融合菜厨师',
        requirements: ['会炒锅、出菜速度快、会备料，综合能力强'],
        salary: '每周税后 1000 纽币起',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '面议',
      },
      {
        id: 11,
        title: '西餐厨师',
        requirements: ['西餐厨房经验，能独立出餐'],
        salary: '每周税后 1000 纽币起',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 12,
        title: '烧腊厨师',
        requirements: ['熟悉烧腊制作，有粤式烧腊经验'],
        salary: '每周税后 1000 纽币起',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 24,
        title: '配菜工',
        requirements: [
          '刀工好、速度快',
          '最好年龄 35 岁以下',
          '厨师、配菜工随时面试',
        ],
        salary: '每周税后 900 纽币起，看能力定',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 22,
        title: '餐厅前台',
        requirements: [
          '负责顾客接待、点餐、收银等前台工作',
          '英文沟通顺畅，有餐饮或服务行业经验优先',
        ],
        salary: '每周税后 1000 纽币起',
        visa: 'AEWV 5年工签',
        living: '工作餐、住自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
    ],
    factory: [
      {
        id: 13,
        title: '铝合金门窗厂工人',
        requirements: [
          '包含铝合金设备操作员、组装、玻璃安装等工人',
        ],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 14,
        title: '橱柜厂木工',
        requirements: [
          '包含橱柜厂设备操作员、组装、细木工造型制作、橱柜安装等工人',
        ],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 15,
        title: '喷漆工人',
        requirements: ['主要以橱柜面板喷漆技能为主的工人'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 16,
        title: '石材台面工人',
        requirements: [
          '包含石材厂设备操作员（桥切机/加工中心/水刀）、切割打磨、制作 45 度下挂加厚以及现场安装为主',
        ],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 17,
        title: '不锈钢厂制作工人',
        requirements: ['主要以不锈钢裁剪、折弯、焊接为主的技术工人'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 18,
        title: '电焊工',
        requirements: ['主要以不锈钢氩弧焊为主的技术工人'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 27,
        title: '钢结构厂：铆工',
        requirements: [
          '钢结构厂铆工，能看懂图纸、放样下料、打孔铆接',
          '有钢结构、金属加工或铆焊相关经验',
        ],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 19,
        title: '机器操作员',
        requirements: ['以上各类工厂的设备操作员'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 20,
        title: '建筑木工 / 瓦工',
        requirements: ['有建筑工地木工或瓦工经验'],
        salary: '28 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 29,
        title: '叉车工',
        requirements: ['有3年以上叉车操作经验，持证上岗', '工时 40 小时/周起'],
        salary: '25 纽币/小时税前起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
    ],
    other: [
      {
        id: 36,
        skillLevel: 2,
        title: '农业技术员',
        requirements: ['农业种植、农技或农场技术相关经验', '工时 40 小时/周起'],
        salary: '28 纽币/小时税前起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 28,
        title: '英文好的前台',
        requirements: [
          '英文沟通顺畅，可接待来访、接听电话及日常行政协助',
          '形象谈吐良好，服务意识强',
        ],
        salary: '25 纽币/小时税前起，看能力定薪',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 23,
        skillLevel: 2,
        title: '按摩师',
        requirements: ['有按摩、理疗相关经验', '工时 40 小时/周起', '有提成'],
        salary: '25 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
      {
        id: 24,
        title: '农业工',
        requirements: ['有农业、种植或采摘相关经验', '工时 40 小时/周起'],
        salary: '25 纽币/小时起',
        visa: 'AEWV 5年工签',
        living: '食宿自理',
        leave: '做满 1 年有 4 周带薪年假，10天带薪病假',
      },
    ],
  }

  const currentJobs = (jobsByCategory[selectedCategory] || []).map(normalizeJob)
  const currentLabel = categories.find((c) => c.id === selectedCategory)?.label || ''

  return (
    <main className="main-content jobs-page">
      <h1 className="jobs-title">招聘信息</h1>

      <nav className="jobs-category-nav" aria-label="招聘分类">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`jobs-category-link ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <section className="jobs-category-section">
        <h2 className="jobs-category-title">{currentLabel}</h2>
        <div className="jobs-list">
          {currentJobs.map((job) => (
            <article key={job.id} className="job-card">
              <div className="job-card-header">
                <h3 className="job-card-title">{job.title}</h3>
              </div>
              <div className="job-card-body">
                <h4 className="job-section-label">岗位要求</h4>
                <ul className="job-requirements">
                  {job.requirements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <div className="job-benefits">
                  <p><strong>薪资：</strong>{job.salary}</p>
                  <p><strong>工签：</strong>{job.visa}</p>
                  <p><strong>食宿：</strong>{job.living}</p>
                  <p><strong>年假：</strong>{job.leave}</p>
                  <p><strong>福利：</strong>可以担保配偶 open 工签、18 周岁以下孩子公立学校免费学签</p>
                </div>
                <p className="job-contact">
                  <strong>咨询/投递：</strong>
                  微信 ddtrip700 或邮箱 dd.icnz@gmail.com
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="jobs-footer-note">
        暂无合适岗位？也可将简历发至 dd.icnz@gmail.com，我们有人力需求时会优先联系您。
      </p>
    </main>
  )
}

export default JobsPage
