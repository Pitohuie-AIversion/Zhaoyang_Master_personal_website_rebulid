import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取翻译文件
const zhTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/zh.json'), 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en.json'), 'utf8'));

console.log('=== 学术内容数据完整性检查 ===\n');

// 检查研究区域数据
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

// 检查论文数据
console.log('\n2. 论文数据 (research.publications):');
console.log(`   中文: ${zhTranslations.research?.publications?.length || 0} 篇论文`);
console.log(`   英文: ${enTranslations.research?.publications?.length || 0} 篇论文`);

// 检查专利数据
console.log('\n3. 专利数据 (research.patents):');
console.log(`   中文: ${zhTranslations.research?.patents?.length || 0} 项专利`);
console.log(`   英文: ${enTranslations.research?.patents?.length || 0} 项专利`);

// 检查项目数据
console.log('\n4. 项目数据 (projects.items):');
console.log(`   中文: ${zhTranslations.projects?.items?.length || 0} 个项目`);
console.log(`   英文: ${enTranslations.projects?.items?.length || 0} 个项目`);

// 检查技能数据
console.log('\n5. 技能数据 (skills.categories):');
console.log(`   中文: ${zhTranslations.skills?.categories?.length || 0} 个技能类别`);
console.log(`   英文: ${enTranslations.skills?.categories?.length || 0} 个技能类别`);

// 检查教育背景
console.log('\n6. 教育背景 (about.education):');
console.log(`   中文: ${zhTranslations.about?.education?.length || 0} 条教育经历`);
console.log(`   英文: ${enTranslations.about?.education?.length || 0} 条教育经历`);

// 检查工作经历
console.log('\n7. 工作经历 (about.experience):');
console.log(`   中文: ${zhTranslations.about?.experience?.length || 0} 条工作经历`);
console.log(`   英文: ${enTranslations.about?.experience?.length || 0} 条工作经历`);

// 检查获奖荣誉
console.log('\n8. 获奖荣誉 (research.awards):');
console.log(`   中文: ${zhTranslations.research?.awards?.length || 0} 个奖项`);
console.log(`   英文: ${enTranslations.research?.awards?.length || 0} 个奖项`);

console.log('\n=== 数据一致性检查 ===');

const checkConsistency = (zhData, enData, path) => {
  if (!zhData && !enData) return;
  if (!zhData || !enData) {
    console.log(`⚠️  ${path}: 数据在一种语言中缺失`);
    return;
  }
  if (Array.isArray(zhData) && Array.isArray(enData)) {
    if (zhData.length !== enData.length) {
      console.log(`⚠️  ${path}: 数量不一致 (中文: ${zhData.length}, 英文: ${enData.length})`);
    } else {
      console.log(`✓ ${path}: 数量一致 (${zhData.length} 项)`);
    }
  }
};

checkConsistency(zhResearchAreas, enResearchAreas, 'home.researchAreas.areas');
checkConsistency(zhTranslations.research?.publications, enTranslations.research?.publications, 'research.publications');
checkConsistency(zhTranslations.research?.patents, enTranslations.research?.patents, 'research.patents');
checkConsistency(zhTranslations.projects?.items, enTranslations.projects?.items, 'projects.items');
checkConsistency(zhTranslations.skills?.categories, enTranslations.skills?.categories, 'skills.categories');
checkConsistency(zhTranslations.about?.education, enTranslations.about?.education, 'about.education');
checkConsistency(zhTranslations.about?.experience, enTranslations.about?.experience, 'about.experience');
checkConsistency(zhTranslations.research?.awards, enTranslations.research?.awards, 'research.awards');

console.log('\n=== 关键字段完整性检查 ===');

// 检查论文关键字段
if (zhTranslations.research?.publications) {
  zhTranslations.research.publications.forEach((pub, index) => {
    const missingFields = [];
    if (!pub.title) missingFields.push('title');
    if (!pub.authors) missingFields.push('authors');
    if (!pub.journal) missingFields.push('journal');
    if (!pub.year) missingFields.push('year');
    if (missingFields.length > 0) {
      console.log(`⚠️  中文论文 ${index + 1} 缺少字段: ${missingFields.join(', ')}`);
    }
  });
}

if (enTranslations.research?.publications) {
  enTranslations.research.publications.forEach((pub, index) => {
    const missingFields = [];
    if (!pub.title) missingFields.push('title');
    if (!pub.authors) missingFields.push('authors');
    if (!pub.journal) missingFields.push('journal');
    if (!pub.year) missingFields.push('year');
    if (missingFields.length > 0) {
      console.log(`⚠️  英文论文 ${index + 1} 缺少字段: ${missingFields.join(', ')}`);
    }
  });
}

console.log('\n✅ 学术内容数据完整性检查完成');