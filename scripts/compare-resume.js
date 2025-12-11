import fs from 'fs/promises'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const _pdf = require('pdf-parse')
const pdf = _pdf.default || _pdf

const pdfPath = path.resolve('docs/resume_archive/me_所有资料_compressed.pdf')
const zhPath = path.resolve('src/locales/zh.json')
const enPath = path.resolve('src/locales/en.json')

const readJson = async p => JSON.parse(await fs.readFile(p, 'utf-8'))

const extract = async buffer => {
  const data = await pdf(buffer)
  return data.text
}

const pick = (obj, keys) => keys.reduce((acc, k) => (acc[k] = obj[k], acc), {})

const normalize = s => s.replace(/\s+/g, ' ').trim()

const find = (text, regex) => {
  const m = text.match(regex)
  return m ? m[0] : ''
}

const run = async () => {
  const [pdfBuf, zh, en] = await Promise.all([
    fs.readFile(pdfPath),
    readJson(zhPath),
    readJson(enPath)
  ])
  const text = await extract(pdfBuf)

  const pdfPersonal = {
    name: find(text, /牟昭阳|Zhaoyang\s+Mu/),
    email: find(text, /[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/),
    phone: find(text, /\+?86\s?1[3-9]\d{9}|1[3-9]\d{9}/),
    location: find(text, /杭州|大连|Hangzhou|Dalian/)
  }

  const sitePersonalZh = {
    email: zh.contact.info.email,
    phone: zh.contact.info.phone,
    location: zh.contact.info.location
  }

  const pdfEducation = {
    master: find(text, /大连海事大学[\s\S]*?2023\.?08\s?-\s?2025\.?06/),
    visiting: find(text, /西湖大学[\s\S]*?2024\.?06\s?-\s?至今/),
    bachelor: find(text, /大连海事大学[\s\S]*?2019\.?09\s?-\s?2023\.?06/),
    gpa: find(text, /GPA\s*3\.2\s*\/\s*4\.0|82\s*\/\s*100/),
    rank: find(text, /7\s*\/\s*100/)
  }

  const siteEducationZh = zh.research.education

  const pdfPublications = {
    damformer: find(text, /Generalizing\s+morphologies\s+in\s+dam\s+break[\s\S]*?10\.1063\/5\.0187644|DamFormer/),
    rsModCubes: find(text, /Rs-?ModCubes[\s\S]*?IEEE|Rs-?modcubes/),
    nanoEnergy: find(text, /triboelectric\s+whisker[\s\S]*?Nano\s+Energy|近场感知|在线状态估计/),
    admt: find(text, /Whisker\s+Sensor\s+Array[\s\S]*?Advanced\s+Materials\s+Technologies/)
  }

  const sitePublicationsZh = zh.publications

  const pdfPatents = {
    cn119509546a: find(text, /CN119509546A/),
    cn119434765a: find(text, /CN119434765A/),
    cn119434766a: find(text, /CN119434766A/),
    cn117775366a: find(text, /CN117775366A/),
    cn117775365a: find(text, /CN117775365A/),
    cn306962132s: find(text, /CN306962132S/),
    cn306962133s: find(text, /CN306962133S/),
    cn306962134s: find(text, /CN306962134S/)
  }

  const sitePatentsZh = zh.research.patents

  const diff = []

  const add = (category, field, pdfVal, siteVal, ref) => {
    const pdfN = normalize(pdfVal || '')
    const siteN = normalize(siteVal || '')
    if (!pdfN && siteN) diff.push({ category, field, type: '文档缺失或未识别', pdf: pdfVal || '', site: siteVal || '', location: ref })
    else if (pdfN && !siteN) diff.push({ category, field, type: '网站缺失', pdf: pdfVal || '', site: siteVal || '', location: ref })
    else if (pdfN && siteN && pdfN !== siteN) diff.push({ category, field, type: '表述差异', pdf: pdfVal || '', site: siteVal || '', location: ref })
  }

  add('个人信息', '邮箱', pdfPersonal.email, sitePersonalZh.email, 'src/locales/zh.json:1299')
  add('个人信息', '电话', pdfPersonal.phone, sitePersonalZh.phone, 'src/locales/zh.json:1300')
  add('个人信息', '位置', pdfPersonal.location, sitePersonalZh.location, 'src/locales/zh.json:1301')

  add('教育背景', '硕士时间', pdfEducation.master, siteEducationZh.master.period, 'src/locales/zh.json:768')
  add('教育背景', '访问时间', pdfEducation.visiting, siteEducationZh.visiting.period, 'src/locales/zh.json:776')
  add('教育背景', '本科时间', pdfEducation.bachelor, siteEducationZh.bachelor.period, 'src/locales/zh.json:783')
  add('教育背景', 'GPA/成绩', pdfEducation.gpa, siteEducationZh.bachelor.description, 'src/locales/zh.json:782')
  add('教育背景', '排名', pdfEducation.rank, siteEducationZh.bachelor.description, 'src/locales/zh.json:782')

  add('论文', 'DamFormer', pdfPublications.damformer, sitePublicationsZh.damformer.doi, 'src/locales/zh.json:1392')
  add('论文', 'Rs-ModCubes', pdfPublications.rsModCubes, sitePublicationsZh.rsModCubes.doi, 'src/locales/zh.json:1399')
  add('论文', 'Nano Energy', pdfPublications.nanoEnergy, sitePublicationsZh.whiskerSensor.doi, 'src/locales/zh.json:1413')
  add('论文', 'AMT', pdfPublications.admt, sitePublicationsZh.whiskerSensorArray.doi, 'src/locales/zh.json:1406')

  add('专利', 'CN119509546A', pdfPatents.cn119509546a, sitePatentsZh.underwaterNavigation.number, 'src/locales/zh.json:925')
  add('专利', 'CN119434765A', pdfPatents.cn119434765a, sitePatentsZh.vectorThruster.number, 'src/locales/zh.json:932')
  add('专利', 'CN119434766A', pdfPatents.cn119434766a, sitePatentsZh.undulatingFin.number, 'src/locales/zh.json:939')
  add('专利', 'CN117775366A', pdfPatents.cn117775366a, sitePatentsZh.flexibleFin.number, 'src/locales/zh.json:946')
  add('专利', 'CN117775365A', pdfPatents.cn117775365a, sitePatentsZh.smartShip.number, 'src/locales/zh.json:953')
  add('专利', 'CN306962132S', pdfPatents.cn306962132s, sitePatentsZh.mobileBuoy.number, 'src/locales/zh.json:960')
  add('专利', 'CN306962133S', pdfPatents.cn306962133s, sitePatentsZh.underwaterRobot.number, 'src/locales/zh.json:967')
  add('专利', 'CN306962134S', pdfPatents.cn306962134s, sitePatentsZh.underwaterDetection.number, 'src/locales/zh.json:974')

  const crossMismatch = []
  const scholarDoiRs = '10.1109/LRA.2025.1234567'
  const siteDoiRs = zh.publications.rsModCubes.doi
  if (scholarDoiRs && siteDoiRs && normalize(scholarDoiRs) !== normalize(siteDoiRs)) {
    crossMismatch.push({ category: '数据源一致性', field: 'Rs-ModCubes DOI', type: '站点与服务不一致', pdf: '', site: siteDoiRs, service: scholarDoiRs, location: 'src/services/googleScholarService.ts:126' })
  }

  const report = { summary: { extracted: Boolean(text && text.length), counts: { diffs: diff.length, crossMismatch: crossMismatch.length } }, diff, crossMismatch }
  const outPath = path.resolve('docs/compare_report.json')
  await fs.writeFile(outPath, JSON.stringify(report, null, 2), 'utf-8')
  console.log(outPath)
}

run().catch(e => { console.error(e); process.exit(1) })
