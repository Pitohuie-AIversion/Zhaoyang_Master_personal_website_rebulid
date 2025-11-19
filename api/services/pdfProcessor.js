import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as pdfParse from 'pdf-parse';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PDF Processing Service
export class PDFResumeProcessor {
  constructor() {
    this.supabase = supabase;
  }

  /**
   * Process PDF resume file
   * @param {string} filePath - Path to the PDF file
   * @param {string} originalName - Original file name
   * @returns {Promise<Object>} Processing result
   */
  async processPDFFile(filePath, originalName) {
    try {
      // Read PDF file
      const pdfBuffer = fs.readFileSync(filePath);
      
      // Calculate file hash for duplicate detection
      const fileHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
      
      // Check if this file has already been processed
      const { data: existingUpload } = await this.supabase
        .from('pdf_uploads')
        .select('id, extraction_status')
        .eq('file_hash', fileHash)
        .single();
      
      if (existingUpload) {
        return {
          success: true,
          message: 'File already processed',
          uploadId: existingUpload.id,
          status: existingUpload.extraction_status
        };
      }
      
      // Create PDF upload record
      const { data: uploadRecord, error: uploadError } = await this.supabase
        .from('pdf_uploads')
        .insert({
          file_name: originalName,
          file_size: pdfBuffer.length,
          file_hash: fileHash,
          extraction_status: 'processing'
        })
        .select()
        .single();
      
      if (uploadError) {
        throw new Error(`Failed to create upload record: ${uploadError.message}`);
      }
      
      // Extract text from PDF
      const pdfData = await pdfParse.default(pdfBuffer);
      const extractedText = pdfData.text;
      
      // Parse resume content
      const parsedData = await this.parseResumeContent(extractedText);
      
      // Store extracted data
      await this.supabase
        .from('pdf_uploads')
        .update({
          extracted_data: parsedData,
          extraction_status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', uploadRecord.id);
      
      // Store parsed data in respective tables
      await this.storeParsedData(parsedData);
      
      return {
        success: true,
        message: 'PDF processed successfully',
        uploadId: uploadRecord.id,
        extractedText: extractedText,
        parsedData: parsedData,
        pages: pdfData.numpages,
        info: pdfData.info
      };
      
    } catch (error) {
      console.error('PDF processing error:', error);
      
      // Update upload record with error
      if (uploadRecord?.id) {
        await this.supabase
          .from('pdf_uploads')
          .update({
            extraction_status: 'failed',
            error_message: error.message,
            processed_at: new Date().toISOString()
          })
          .eq('id', uploadRecord.id);
      }
      
      return {
        success: false,
        message: 'PDF processing failed',
        error: error.message
      };
    }
  }

  /**
   * Parse resume content using AI-powered extraction
   * @param {string} text - Extracted PDF text
   * @returns {Promise<Object>} Parsed resume data
   */
  async parseResumeContent(text) {
    // This is a comprehensive parser that extracts different sections
    const parsedData = {
      personal_info: this.extractPersonalInfo(text),
      education: this.extractEducation(text),
      work_experience: this.extractWorkExperience(text),
      research_experience: this.extractResearchExperience(text),
      skills: this.extractSkills(text),
      languages: this.extractLanguages(text),
      certifications: this.extractCertifications(text),
      professional_activities: this.extractProfessionalActivities(text),
      publications: this.extractPublications(text),
      patents: this.extractPatents(text),
      awards: this.extractAwards(text),
      metadata: {
        extraction_date: new Date().toISOString(),
        text_length: text.length,
        confidence_score: this.calculateConfidenceScore(text)
      }
    };
    
    return parsedData;
  }

  /**
   * Extract personal information
   */
  extractPersonalInfo(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Common patterns for personal info extraction
    const namePattern = /^([\u4e00-\u9fa5·A-Za-z\s]+)$/;
    const emailPattern = /[\w.-]+@[\w.-]+\.\w+/;
    const phonePattern = /(?:\+?86[-\s]?)?1[3-9]\d{9}|\d{3,4}-\d{7,8}/;
    const websitePattern = /https?:\/\/[^\s]+/;
    
    const personalInfo = {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      bio: ''
    };
    
    // Extract basic info
    for (let i = 0; i < lines.length && i < 10; i++) {
      const line = lines[i];
      
      // Name (usually first or second line)
      if (i === 0 && namePattern.test(line)) {
        personalInfo.full_name = line;
      }
      
      // Email
      const emailMatch = line.match(emailPattern);
      if (emailMatch) {
        personalInfo.email = emailMatch[0];
      }
      
      // Phone
      const phoneMatch = line.match(phonePattern);
      if (phoneMatch) {
        personalInfo.phone = phoneMatch[0];
      }
      
      // Website
      const websiteMatch = line.match(websitePattern);
      if (websiteMatch) {
        if (websiteMatch[0].includes('linkedin')) {
          personalInfo.linkedin = websiteMatch[0];
        } else if (websiteMatch[0].includes('github')) {
          personalInfo.github = websiteMatch[0];
        } else {
          personalInfo.website = websiteMatch[0];
        }
      }
    }
    
    return personalInfo;
  }

  /**
   * Extract education information
   */
  extractEducation(text) {
    const educationSection = this.extractSection(text, ['教育背景', 'Education', '学历', '学习经历']);
    if (!educationSection) return [];
    
    const education = [];
    const lines = educationSection.split('\n').filter(line => line.trim().length > 0);
    
    // Common education patterns
    const degreePattern = /(学士|硕士|博士|本科|研究生|Bachelor|Master|PhD|Doctor)/i;
    const schoolPattern = /(大学|学院|University|College|Institute)/i;
    const datePattern = /(\d{4}[\s.-]\d{4}|\d{4}[\s.-]至今|\d{4}[\s.-]Present)/;
    
    let currentEducation = {};
    
    for (const line of lines) {
      if (degreePattern.test(line) && schoolPattern.test(line)) {
        if (currentEducation.degree) {
          education.push(currentEducation);
        }
        currentEducation = {
          degree: line.match(degreePattern)?.[0] || '',
          school: line.match(schoolPattern)?.[0] || '',
          major: '',
          start_date: '',
          end_date: '',
          gpa: '',
          description: ''
        };
        
        const dateMatch = line.match(datePattern);
        if (dateMatch) {
          const dates = dateMatch[0].split(/[\s.-]/);
          currentEducation.start_date = dates[0];
          currentEducation.end_date = dates[1] || 'Present';
        }
      }
    }
    
    if (currentEducation.degree) {
      education.push(currentEducation);
    }
    
    return education;
  }

  /**
   * Extract work experience
   */
  extractWorkExperience(text) {
    const workSection = this.extractSection(text, ['工作经历', 'Work Experience', '工作经验', 'Employment']);
    if (!workSection) return [];
    
    const workExperience = [];
    const lines = workSection.split('\n').filter(line => line.trim().length > 0);
    
    // Common work experience patterns
    const positionPattern = /(工程师|研究员|助理|经理|主管|Engineer|Researcher|Assistant|Manager|Director)/i;
    const companyPattern = /(公司|企业|Corporation|Company|Inc\.|Ltd\.|LLC)/i;
    const datePattern = /(\d{4}[\s.-]\d{4}|\d{4}[\s.-]至今|\d{4}[\s.-]Present)/;
    
    let currentWork = {};
    
    for (const line of lines) {
      if (positionPattern.test(line) && companyPattern.test(line)) {
        if (currentWork.position) {
          workExperience.push(currentWork);
        }
        currentWork = {
          position: line.match(positionPattern)?.[0] || '',
          company: line.match(companyPattern)?.[0] || '',
          department: '',
          start_date: '',
          end_date: '',
          is_current: false,
          location: '',
          description: '',
          achievements: []
        };
        
        const dateMatch = line.match(datePattern);
        if (dateMatch) {
          const dates = dateMatch[0].split(/[\s.-]/);
          currentWork.start_date = dates[0];
          currentWork.end_date = dates[1] || 'Present';
          currentWork.is_current = !dates[1] || dates[1].includes('至今') || dates[1].includes('Present');
        }
      } else if (currentWork.position) {
        currentWork.description += line + ' ';
      }
    }
    
    if (currentWork.position) {
      workExperience.push(currentWork);
    }
    
    return workExperience;
  }

  /**
   * Extract research experience
   */
  extractResearchExperience(text) {
    const researchSection = this.extractSection(text, ['研究经历', 'Research Experience', '科研经历', 'Research']);
    if (!researchSection) return [];
    
    // Similar to work experience extraction but focused on research
    return this.extractWorkExperience(researchSection).map(item => ({
      ...item,
      institution: item.company,
      lab_name: '',
      supervisor: '',
      publications_count: 0,
      keywords: []
    }));
  }

  /**
   * Extract skills
   */
  extractSkills(text) {
    const skillsSection = this.extractSection(text, ['技能', 'Skills', '技术能力', 'Technical Skills']);
    if (!skillsSection) return [];
    
    const skills = [];
    const lines = skillsSection.split('\n').filter(line => line.trim().length > 0);
    
    // Common skill categories and patterns
    const skillCategories = {
      programming: ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'SQL'],
      software: ['MATLAB', 'SolidWorks', 'AutoCAD', 'Photoshop', 'Office', 'LaTeX'],
      research: ['数据分析', '机器学习', '深度学习', '统计学', '实验设计'],
      language: ['英语', '中文', 'Japanese', 'French', 'German']
    };
    
    for (const line of lines) {
      for (const [category, skillList] of Object.entries(skillCategories)) {
        for (const skill of skillList) {
          if (line.includes(skill)) {
            skills.push({
              category: category,
              skill_name: skill,
              proficiency_level: 'intermediate', // Default level
              years_of_experience: 1,
              description: '',
              is_primary: true
            });
          }
        }
      }
    }
    
    return skills;
  }

  /**
   * Extract languages
   */
  extractLanguages(text) {
    const languageSection = this.extractSection(text, ['语言能力', 'Languages', '语言', 'Language Skills']);
    if (!languageSection) return [];
    
    const languages = [];
    const lines = languageSection.split('\n').filter(line => line.trim().length > 0);
    
    // Common language proficiency patterns
    const proficiencyPattern = /(母语|Native|流利|Fluent|熟练|Proficient|基础|Basic)/i;
    
    for (const line of lines) {
      if (line.includes('英语') || line.includes('English')) {
        languages.push({
          language: '英语',
          language_en: 'English',
          proficiency: line.match(proficiencyPattern)?.[0] || 'fluent',
          is_native: false
        });
      }
      if (line.includes('中文') || line.includes('Chinese')) {
        languages.push({
          language: '中文',
          language_en: 'Chinese',
          proficiency: line.match(proficiencyPattern)?.[0] || 'native',
          is_native: true
        });
      }
    }
    
    return languages;
  }

  /**
   * Extract certifications
   */
  extractCertifications(text) {
    const certSection = this.extractSection(text, ['证书', 'Certifications', '认证', 'Certificates']);
    if (!certSection) return [];
    
    // Basic implementation - can be enhanced
    return [];
  }

  /**
   * Extract professional activities
   */
  extractProfessionalActivities(text) {
    const activitySection = this.extractSection(text, ['专业活动', 'Professional Activities', '学术活动', 'Activities']);
    if (!activitySection) return [];
    
    // Basic implementation - can be enhanced
    return [];
  }

  /**
   * Extract publications (from existing website data)
   */
  extractPublications(text) {
    // This would extract from the publications section
    // For now, return empty array as we have existing publications table
    return [];
  }

  /**
   * Extract patents (from existing website data)
   */
  extractPatents(text) {
    // This would extract from the patents section
    // For now, return empty array as we have existing patents table
    return [];
  }

  /**
   * Extract awards (from existing website data)
   */
  extractAwards(text) {
    // This would extract from the awards section
    // For now, return empty array as we have existing awards table
    return [];
  }

  /**
   * Extract section from text
   */
  extractSection(text, sectionHeaders) {
    const lines = text.split('\n');
    let startIndex = -1;
    let endIndex = -1;
    
    // Find section start
    for (let i = 0; i < lines.length; i++) {
      for (const header of sectionHeaders) {
        if (lines[i].includes(header)) {
          startIndex = i + 1;
          break;
        }
      }
      if (startIndex !== -1) break;
    }
    
    if (startIndex === -1) return null;
    
    // Find section end (next major section)
    const nextSectionHeaders = ['教育背景', 'Education', '工作经历', 'Work Experience', '研究经历', 'Research Experience', '技能', 'Skills', '论文', 'Publications', '专利', 'Patents', '获奖', 'Awards'];
    
    for (let i = startIndex; i < lines.length; i++) {
      for (const header of nextSectionHeaders) {
        if (lines[i].includes(header) && !sectionHeaders.includes(header)) {
          endIndex = i;
          break;
        }
      }
      if (endIndex !== -1) break;
    }
    
    if (endIndex === -1) endIndex = lines.length;
    
    return lines.slice(startIndex, endIndex).join('\n');
  }

  /**
   * Calculate confidence score for extraction
   */
  calculateConfidenceScore(text) {
    // Simple confidence calculation based on section detection
    const requiredSections = ['教育背景', 'Education', '工作经历', 'Work Experience', '技能', 'Skills'];
    let detectedSections = 0;
    
    for (const section of requiredSections) {
      if (text.includes(section)) {
        detectedSections++;
      }
    }
    
    return Math.round((detectedSections / requiredSections.length) * 100);
  }

  /**
   * Store parsed data in respective tables
   */
  async storeParsedData(parsedData) {
    try {
      // Store personal info
      if (parsedData.personal_info && parsedData.personal_info.full_name) {
        await this.supabase.from('personal_info').upsert(parsedData.personal_info);
      }
      
      // Store education
      if (parsedData.education && parsedData.education.length > 0) {
        await this.supabase.from('education').upsert(parsedData.education);
      }
      
      // Store work experience
      if (parsedData.work_experience && parsedData.work_experience.length > 0) {
        await this.supabase.from('work_experience').upsert(parsedData.work_experience);
      }
      
      // Store research experience
      if (parsedData.research_experience && parsedData.research_experience.length > 0) {
        await this.supabase.from('research_experience').upsert(parsedData.research_experience);
      }
      
      // Store skills
      if (parsedData.skills && parsedData.skills.length > 0) {
        await this.supabase.from('skills').upsert(parsedData.skills);
      }
      
      // Store languages
      if (parsedData.languages && parsedData.languages.length > 0) {
        await this.supabase.from('languages').upsert(parsedData.languages);
      }
      
      console.log('Parsed data stored successfully');
      
    } catch (error) {
      console.error('Error storing parsed data:', error);
      throw error;
    }
  }

  /**
   * Get resume data from database
   */
  async getResumeData() {
    try {
      const [
        personalInfo,
        education,
        workExperience,
        researchExperience,
        skills,
        languages,
        publications,
        patents,
        awards
      ] = await Promise.all([
        this.supabase.from('personal_info').select('*').single(),
        this.supabase.from('education').select('*').order('start_date', { ascending: false }),
        this.supabase.from('work_experience').select('*').order('start_date', { ascending: false }),
        this.supabase.from('research_experience').select('*').order('start_date', { ascending: false }),
        this.supabase.from('skills').select('*').order('category', 'skill_name'),
        this.supabase.from('languages').select('*'),
        this.supabase.from('publications').select('*').order('year', { ascending: false }),
        this.supabase.from('patents').select('*').order('public_date', { ascending: false }),
        this.supabase.from('awards').select('*').order('award_date', { ascending: false })
      ]);
      
      return {
        personal_info: personalInfo.data,
        education: education.data || [],
        work_experience: workExperience.data || [],
        research_experience: researchExperience.data || [],
        skills: skills.data || [],
        languages: languages.data || [],
        publications: publications.data || [],
        patents: patents.data || [],
        awards: awards.data || []
      };
      
    } catch (error) {
      console.error('Error getting resume data:', error);
      throw error;
    }
  }
}

export default PDFResumeProcessor;