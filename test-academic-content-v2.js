import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取翻译文件
const zhTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/zh.json'), 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en.json'), 'utf8'));

console.log('=== 学术内容数据完整性检查 ===\n');

// 检查研究区域数据 (在home.researchAreas.areas中)
console.log('1. 研究区域 (home.researchAreas.areas):');
const zhResearchAreas = zhTranslations.home?.researchAreas?.areas;
const enResearchAreas = enTranslations.home?.researchAreas?.areas;
console.log(`   中文: ${zhResearchAreas?.length || 0} 个区域`);
console.log(`   英文: ${enResearchAreas?.length || 0} 个区域`);

if (zhResearchAreas) {
  zhResearchAreas.forEach((area, index) => {
    console.log(`   中文区域 ${index + 1}: ${area}`);
  });
}

if (enResearchAreas) {
  enResearchAreas.forEach((area, index) => {
    console.log(`   英文区域 ${index + 1}: ${area}`);
  });
}

// 检查学术内容 (在academic.research.areas中)
console.log('\n2. 学术研究内容 (academic.research.areas):');
const zhAcademicAreas = zhTranslations.academic?.research?.areas;
const enAcademicAreas = enTranslations.academic?.research?.areas;

if (zhAcademicAreas) {
  console.log('   中文学术区域:');
  Object.keys(zhAcademicAreas).forEach(key => {
    const area = zhAcademicAreas[key];
    console.log(`   - ${key}: ${area.title || '无标题'}`);
    if (area.data) {
      const dataKeys = Object.keys(area.data);
      console.log(`     数据项: ${dataKeys.join(', ')}`);
    }
  });
}

if (enAcademicAreas) {
  console.log('   英文学术区域:');
  Object.keys(enAcademicAreas).forEach(key => {
    const area = enAcademicAreas[key];
    console.log(`   - ${key}: ${area.title || '无标题'}`);
    if (area.data) {
      const dataKeys = Object.keys(area.data);
      console.log(`     数据项: ${dataKeys.join(', ')}`);
    }
  });
}

// 检查教育背景 (在about.education中)
console.log('\n3. 教育背景 (about.education):');
const zhEducation = zhTranslations.about?.education;
const enEducation = enTranslations.about?.education;

if (zhEducation) {
  if (typeof zhEducation === 'object' && !Array.isArray(zhEducation)) {
    console.log('   中文教育背景 (对象格式):');
    Object.keys(zhEducation).forEach(key => {
      const edu = zhEducation[key];
      console.log(`   - ${key}: ${edu.title || '无标题'}`);
    });
  } else if (Array.isArray(zhEducation)) {
    console.log(`   中文教育背景: ${zhEducation.length} 条记录`);
  }
}

if (enEducation) {
  if (typeof enEducation === 'object' && !Array.isArray(enEducation)) {
    console.log('   英文教育背景 (对象格式):');
    Object.keys(enEducation).forEach(key => {
      const edu = enEducation[key];
      console.log(`   - ${key}: ${edu.title || '无标题'}`);
    });
  } else if (Array.isArray(enEducation)) {
    console.log(`   英文教育背景: ${enEducation.length} 条记录`);
  }
}

// 检查技能数据 (在skills.categories中)
console.log('\n4. 技能数据 (skills.categories):');
const zhSkills = zhTranslations.skills?.categories;
const enSkills = enTranslations.skills?.categories;

if (zhSkills) {
  if (Array.isArray(zhSkills)) {
    console.log(`   中文技能: ${zhSkills.length} 个类别`);
  } else if (typeof zhSkills === 'object') {
    console.log('   中文技能 (对象格式):');
    Object.keys(zhSkills).forEach(key => {
      console.log(`   - ${key}: ${zhSkills[key].name || '无名称'}`);
    });
  }
}

if (enSkills) {
  if (Array.isArray(enSkills)) {
    console.log(`   英文技能: ${enSkills.length} 个类别`);
  } else if (typeof enSkills === 'object') {
    console.log('   英文技能 (对象格式):');
    Object.keys(enSkills).forEach(key => {
      console.log(`   - ${key}: ${enSkills[key].name || '无名称'}`);
    });
  }
}

console.log('\n=== 数据一致性总结 ===');
console.log(`研究区域: 中文 ${zhResearchAreas?.length || 0} vs 英文 ${enResearchAreas?.length || 0}`);
console.log(`学术区域: 中文 ${Object.keys(zhAcademicAreas || {}).length} vs 英文 ${Object.keys(enAcademicAreas || {}).length}`);

const zhEduCount = typeof zhEducation === 'object' && !Array.isArray(zhEducation) ? Object.keys(zhEducation).length : (Array.isArray(zhEducation) ? zhEducation.length : 0);
const enEduCount = typeof enEducation === 'object' && !Array.isArray(enEducation) ? Object.keys(enEducation).length : (Array.isArray(enEducation) ? enEducation.length : 0);
console.log(`教育背景: 中文 ${zhEduCount} vs 英文 ${enEduCount}`);

const zhSkillsCount = typeof zhSkills === 'object' && !Array.isArray(zhSkills) ? Object.keys(zhSkills).length : (Array.isArray(zhSkills) ? zhSkills.length : 0);
const enSkillsCount = typeof enSkills === 'object' && !Array.isArray(enSkills) ? Object.keys(enSkills).length : (Array.isArray(enSkills) ? enSkills.length : 0);
console.log(`技能类别: 中文 ${zhSkillsCount} vs 英文 ${enSkillsCount}`);

console.log('\n✅ 学术内容数据完整性检查完成');