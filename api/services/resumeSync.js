import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class ResumeSyncService {
  constructor() {
    this.supabase = supabase;
  }

  /**
   * Sync resume data with website frontend files
   */
  async syncWithWebsite() {
    try {
      // Fetch all resume data
      const resumeData = await this.getResumeData();
      
      // Sync personal info with about page
      await this.syncPersonalInfo(resumeData.personal_info);
      
      // Sync education data
      await this.syncEducation(resumeData.education);
      
      // Sync work experience
      await this.syncWorkExperience(resumeData.work_experience);
      
      // Sync research experience
      await this.syncResearchExperience(resumeData.research_experience);
      
      // Sync skills
      await this.syncSkills(resumeData.skills);
      
      // Sync languages
      await this.syncLanguages(resumeData.languages);
      
      // Sync publications, patents, awards (these are already managed separately)
      
      return {
        success: true,
        message: 'Resume data synchronized with website successfully',
        syncedSections: [
          'personal_info',
          'education', 
          'work_experience',
          'research_experience',
          'skills',
          'languages'
        ]
      };
      
    } catch (error) {
      console.error('Resume sync error:', error);
      return {
        success: false,
        message: 'Failed to sync resume data',
        error: error.message
      };
    }
  }

  /**
   * Get complete resume data from database
   */
  async getResumeData() {
    const [
      personalInfo,
      education,
      workExperience,
      researchExperience,
      skills,
      languages
    ] = await Promise.all([
      this.supabase.from('personal_info').select('*').single(),
      this.supabase.from('education').select('*').order('start_date', { ascending: false }),
      this.supabase.from('work_experience').select('*').order('start_date', { ascending: false }),
      this.supabase.from('research_experience').select('*').order('start_date', { ascending: false }),
      this.supabase.from('skills').select('*').order('category', 'skill_name'),
      this.supabase.from('languages').select('*')
    ]);
    
    return {
      personal_info: personalInfo.data,
      education: education.data || [],
      work_experience: workExperience.data || [],
      research_experience: researchExperience.data || [],
      skills: skills.data || [],
      languages: languages.data || []
    };
  }

  /**
   * Sync personal info with about page data
   */
  async syncPersonalInfo(personalInfo) {
    if (!personalInfo) return;

    try {
      // Read current about page data
      const aboutDataPath = path.join(process.cwd(), 'src/data/aboutData.ts');
      
      if (fs.existsSync(aboutDataPath)) {
        let aboutData = fs.readFileSync(aboutDataPath, 'utf8');
        
        // Update personal information
        const updatedData = this.updateAboutData(aboutData, personalInfo);
        
        // Write back to file
        fs.writeFileSync(aboutDataPath, updatedData);
        
        console.log('Personal info synced with about page');
      }
      
      // Update translation files with personal info
      await this.updateTranslationFiles('personal', personalInfo);
      
    } catch (error) {
      console.error('Error syncing personal info:', error);
      throw error;
    }
  }

  /**
   * Sync education data
   */
  async syncEducation(education) {
    if (!education || education.length === 0) return;

    try {
      // Convert to website format
      const educationData = education.map(edu => ({
        id: edu.id,
        degree: edu.degree,
        degreeEn: edu.degree_en,
        major: edu.major,
        majorEn: edu.major_en,
        school: edu.school,
        schoolEn: edu.school_en,
        startDate: edu.start_date,
        endDate: edu.end_date,
        gpa: edu.gpa,
        description: edu.description,
        descriptionEn: edu.description_en,
        location: edu.location,
        status: edu.status
      }));

      // Update education data file
      const educationPath = path.join(process.cwd(), 'src/data/education.ts');
      const educationContent = `export const educationData = ${JSON.stringify(educationData, null, 2)};`;
      fs.writeFileSync(educationPath, educationContent);
      
      console.log('Education data synced');
      
    } catch (error) {
      console.error('Error syncing education:', error);
      throw error;
    }
  }

  /**
   * Sync work experience
   */
  async syncWorkExperience(workExperience) {
    if (!workExperience || workExperience.length === 0) return;

    try {
      // Convert to website format
      const workData = workExperience.map(work => ({
        id: work.id,
        position: work.position,
        positionEn: work.position_en,
        company: work.company,
        companyEn: work.company_en,
        startDate: work.start_date,
        endDate: work.end_date,
        isCurrent: work.is_current,
        location: work.location,
        description: work.description,
        descriptionEn: work.description_en,
        achievements: work.achievements || []
      }));

      // Update work experience data file
      const workPath = path.join(process.cwd(), 'src/data/workExperience.ts');
      const workContent = `export const workExperienceData = ${JSON.stringify(workData, null, 2)};`;
      fs.writeFileSync(workPath, workContent);
      
      console.log('Work experience data synced');
      
    } catch (error) {
      console.error('Error syncing work experience:', error);
      throw error;
    }
  }

  /**
   * Sync research experience
   */
  async syncResearchExperience(researchExperience) {
    if (!researchExperience || researchExperience.length === 0) return;

    try {
      // Convert to website format
      const researchData = researchExperience.map(research => ({
        id: research.id,
        title: research.title,
        titleEn: research.title_en,
        institution: research.institution,
        institutionEn: research.institution_en,
        labName: research.lab_name,
        supervisor: research.supervisor,
        startDate: research.start_date,
        endDate: research.end_date,
        isCurrent: research.is_current,
        description: research.description,
        descriptionEn: research.description_en,
        keywords: research.keywords || []
      }));

      // Update research experience data file
      const researchPath = path.join(process.cwd(), 'src/data/researchExperience.ts');
      const researchContent = `export const researchExperienceData = ${JSON.stringify(researchData, null, 2)};`;
      fs.writeFileSync(researchPath, researchContent);
      
      console.log('Research experience data synced');
      
    } catch (error) {
      console.error('Error syncing research experience:', error);
      throw error;
    }
  }

  /**
   * Sync skills
   */
  async syncSkills(skills) {
    if (!skills || skills.length === 0) return;

    try {
      // Convert to website format
      const skillsData = skills.map(skill => ({
        id: skill.id,
        category: skill.category,
        skillName: skill.skill_name,
        skillNameEn: skill.skill_name_en,
        proficiencyLevel: skill.proficiency_level,
        yearsOfExperience: skill.years_of_experience,
        description: skill.description,
        isPrimary: skill.is_primary
      }));

      // Update skills data file
      const skillsPath = path.join(process.cwd(), 'src/data/skills.ts');
      const skillsContent = `export const skillsData = ${JSON.stringify(skillsData, null, 2)};`;
      fs.writeFileSync(skillsPath, skillsContent);
      
      console.log('Skills data synced');
      
    } catch (error) {
      console.error('Error syncing skills:', error);
      throw error;
    }
  }

  /**
   * Sync languages
   */
  async syncLanguages(languages) {
    if (!languages || languages.length === 0) return;

    try {
      // Convert to website format
      const languagesData = languages.map(lang => ({
        id: lang.id,
        language: lang.language,
        languageEn: lang.language_en,
        proficiency: lang.proficiency,
        isNative: lang.is_native
      }));

      // Update languages data file
      const languagesPath = path.join(process.cwd(), 'src/data/languages.ts');
      const languagesContent = `export const languagesData = ${JSON.stringify(languagesData, null, 2)};`;
      fs.writeFileSync(languagesPath, languagesContent);
      
      console.log('Languages data synced');
      
    } catch (error) {
      console.error('Error syncing languages:', error);
      throw error;
    }
  }

  /**
   * Update about page data with personal info
   */
  updateAboutData(aboutData, personalInfo) {
    // This is a simplified implementation
    // In a real scenario, you would parse the TypeScript file and update specific fields
    
    // For now, we'll create a new about data structure
    const updatedAbout = {
      name: personalInfo.full_name,
      englishName: personalInfo.english_name,
      chineseName: personalInfo.chinese_name,
      email: personalInfo.email,
      phone: personalInfo.phone,
      location: personalInfo.location,
      website: personalInfo.website,
      linkedin: personalInfo.linkedin,
      github: personalInfo.github,
      orcid: personalInfo.orcid,
      googleScholar: personalInfo.google_scholar,
      bio: personalInfo.bio,
      bioEn: personalInfo.bio_en
    };

    return `export const aboutData = ${JSON.stringify(updatedAbout, null, 2)};`;
  }

  /**
   * Update translation files with resume data
   */
  async updateTranslationFiles(section, data) {
    // This would update the translation files with new data
    // For now, this is a placeholder for future implementation
    console.log(`Translation files update for ${section} - placeholder`);
  }

  /**
   * Validate resume data integrity
   */
  validateResumeData(resumeData) {
    const errors = [];
    
    // Validate personal info
    if (resumeData.personal_info) {
      if (!resumeData.personal_info.full_name) {
        errors.push('Personal info: Full name is required');
      }
      if (resumeData.personal_info.email && !this.isValidEmail(resumeData.personal_info.email)) {
        errors.push('Personal info: Invalid email format');
      }
    }
    
    // Validate education
    resumeData.education?.forEach((edu, index) => {
      if (!edu.degree || !edu.school) {
        errors.push(`Education item ${index + 1}: Degree and school are required`);
      }
    });
    
    // Validate work experience
    resumeData.work_experience?.forEach((work, index) => {
      if (!work.position || !work.company) {
        errors.push(`Work experience item ${index + 1}: Position and company are required`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default ResumeSyncService;