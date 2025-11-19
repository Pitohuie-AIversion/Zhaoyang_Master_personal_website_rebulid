-- Create comprehensive resume data tables
-- Personal Information Table
CREATE TABLE personal_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    english_name TEXT,
    chinese_name TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    website TEXT,
    linkedin TEXT,
    github TEXT,
    orcid TEXT,
    google_scholar TEXT,
    researchgate TEXT,
    bio TEXT,
    bio_en TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education Table (enhanced from existing)
CREATE TABLE education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    degree TEXT NOT NULL,
    degree_en TEXT,
    major TEXT NOT NULL,
    major_en TEXT,
    school TEXT NOT NULL,
    school_en TEXT,
    start_date DATE,
    end_date DATE,
    expected_graduation DATE,
    gpa REAL,
    gpa_scale REAL,
    rank TEXT,
    description TEXT,
    description_en TEXT,
    thesis_title TEXT,
    thesis_title_en TEXT,
    supervisor TEXT,
    supervisor_en TEXT,
    location TEXT,
    location_en TEXT,
    status TEXT CHECK (status IN ('completed', 'ongoing', 'expected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Experience Table
CREATE TABLE work_experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position TEXT NOT NULL,
    position_en TEXT,
    company TEXT NOT NULL,
    company_en TEXT,
    department TEXT,
    department_en TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    location TEXT,
    location_en TEXT,
    description TEXT,
    description_en TEXT,
    achievements TEXT[],
    achievements_en TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research Experience Table
CREATE TABLE research_experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    role TEXT,
    role_en TEXT,
    institution TEXT NOT NULL,
    institution_en TEXT,
    lab_name TEXT,
    lab_name_en TEXT,
    supervisor TEXT,
    supervisor_en TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    location TEXT,
    location_en TEXT,
    description TEXT,
    description_en TEXT,
    keywords TEXT[],
    keywords_en TEXT[],
    publications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table
CREATE TABLE skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('programming', 'software', 'language', 'research', 'technical', 'soft')),
    skill_name TEXT NOT NULL,
    skill_name_en TEXT,
    proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience REAL,
    description TEXT,
    description_en TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Languages Table
CREATE TABLE languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    language TEXT NOT NULL,
    language_en TEXT,
    proficiency TEXT CHECK (proficiency IN ('basic', 'conversational', 'fluent', 'native')),
    certificates TEXT[],
    test_scores JSONB,
    is_native BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications Table
CREATE TABLE certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    issuing_organization TEXT,
    issuing_organization_en TEXT,
    issue_date DATE,
    expiry_date DATE,
    credential_id TEXT,
    credential_url TEXT,
    description TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professional Activities Table
CREATE TABLE professional_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_type TEXT CHECK (activity_type IN ('conference', 'workshop', 'seminar', 'reviewer', 'member', 'organizer')),
    title TEXT NOT NULL,
    title_en TEXT,
    organization TEXT,
    organization_en TEXT,
    event_name TEXT,
    event_name_en TEXT,
    location TEXT,
    location_en TEXT,
    date DATE,
    end_date DATE,
    description TEXT,
    description_en TEXT,
    is_invited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume Sections Configuration
CREATE TABLE resume_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_name TEXT NOT NULL UNIQUE,
    section_name_en TEXT,
    display_order INTEGER NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    is_collapsible BOOLEAN DEFAULT FALSE,
    icon_name TEXT,
    description TEXT,
    description_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume Templates
CREATE TABLE resume_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name TEXT NOT NULL UNIQUE,
    template_name_en TEXT,
    description TEXT,
    description_en TEXT,
    layout_config JSONB,
    style_config JSONB,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume Versions (for tracking different versions)
CREATE TABLE resume_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version_name TEXT NOT NULL,
    version_name_en TEXT,
    description TEXT,
    description_en TEXT,
    target_audience TEXT,
    target_audience_en TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PDF Upload History
CREATE TABLE pdf_uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_hash TEXT UNIQUE,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    extracted_data JSONB,
    extraction_status TEXT CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_personal_info_name ON personal_info(full_name);
CREATE INDEX idx_education_degree ON education(degree);
CREATE INDEX idx_education_school ON education(school);
CREATE INDEX idx_work_experience_company ON work_experience(company);
CREATE INDEX idx_work_experience_position ON work_experience(position);
CREATE INDEX idx_research_experience_institution ON research_experience(institution);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_name ON skills(skill_name);
CREATE INDEX idx_publications_title ON publications(title);
CREATE INDEX idx_publications_year ON publications(year);
CREATE INDEX idx_patents_title ON patents(title);
CREATE INDEX idx_patents_patent_number ON patents(patent_number);
CREATE INDEX idx_awards_title ON awards(title);
CREATE INDEX idx_awards_level ON awards(level);
CREATE INDEX idx_pdf_uploads_file_hash ON pdf_uploads(file_hash);
CREATE INDEX idx_pdf_uploads_extraction_status ON pdf_uploads(extraction_status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_experience_updated_at BEFORE UPDATE ON work_experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_experience_updated_at BEFORE UPDATE ON research_experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_languages_updated_at BEFORE UPDATE ON languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_activities_updated_at BEFORE UPDATE ON professional_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_sections_updated_at BEFORE UPDATE ON resume_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_templates_updated_at BEFORE UPDATE ON resume_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_versions_updated_at BEFORE UPDATE ON resume_versions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pdf_uploads_updated_at BEFORE UPDATE ON pdf_uploads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default resume sections
INSERT INTO resume_sections (section_name, section_name_en, display_order, is_visible, is_collapsible, icon_name, description, description_en) VALUES
('个人信息', 'Personal Information', 1, true, false, 'user', '基本信息和联系方式', 'Basic information and contact details'),
('教育背景', 'Education', 2, true, true, 'graduation-cap', '教育经历和学术背景', 'Educational background and academic experience'),
('工作经历', 'Work Experience', 3, true, true, 'briefcase', '工作履历和职业发展', 'Work history and career development'),
('研究经历', 'Research Experience', 4, true, true, 'flask', '科研项目和实验室经历', 'Research projects and laboratory experience'),
('技能专长', 'Skills', 5, true, true, 'tools', '技术技能和语言能力', 'Technical skills and language abilities'),
('论文发表', 'Publications', 6, true, true, 'file-text', '学术论文和研究成果', 'Academic papers and research outputs'),
('专利申请', 'Patents', 7, true, true, 'lightbulb', '发明专利和技术创新', 'Invention patents and technological innovation'),
('获奖荣誉', 'Awards', 8, true, true, 'award', '获得的奖项和荣誉', 'Awards and honors received'),
('专业活动', 'Professional Activities', 9, false, true, 'users', '学术会议和专业参与', 'Academic conferences and professional involvement'),
('证书认证', 'Certifications', 10, false, true, 'certificate', '专业证书和资格认证', 'Professional certificates and qualifications');

-- Insert default resume templates
INSERT INTO resume_templates (template_name, template_name_en, description, description_en, layout_config, style_config, is_default, is_active) VALUES
('学术型', 'Academic', '适合学术研究和教育背景的简历模板', 'Resume template suitable for academic research and educational background', 
'{"sections": ["personal_info", "education", "research_experience", "publications", "patents", "awards", "skills"], "layout": "traditional"}', 
'{"color_scheme": "professional", "font_family": "serif", "font_size": "11pt"}', true, true),
('技术型', 'Technical', '适合工程技术和软件开发的简历模板', 'Resume template suitable for engineering technology and software development', 
'{"sections": ["personal_info", "skills", "work_experience", "projects", "education", "certifications"], "layout": "modern"}', 
'{"color_scheme": "tech", "font_family": "sans-serif", "font_size": "10pt"}', false, true),
('综合型', 'Comprehensive', '适合多种职业背景的通用简历模板', 'Universal resume template suitable for various professional backgrounds', 
'{"sections": ["personal_info", "work_experience", "education", "skills", "projects", "awards"], "layout": "hybrid"}', 
'{"color_scheme": "neutral", "font_family": "sans-serif", "font_size": "11pt"}', false, true);

-- Insert default resume version
INSERT INTO resume_versions (version_name, version_name_en, description, description_en, target_audience, target_audience_en, is_current) VALUES
('中文完整版', 'Chinese Complete', '面向国内学术机构的完整中文简历', 'Complete Chinese resume for domestic academic institutions', '国内高校和研究机构', 'Domestic universities and research institutions', true),
('英文国际版', 'English International', '面向国际学术机构的英文简历', 'English resume for international academic institutions', '海外高校和国际会议', 'Overseas universities and international conferences', false),
('简洁专业版', 'Concise Professional', '适用于企业招聘的简洁版本', 'Concise version suitable for corporate recruitment', '科技公司和研发部门', 'Tech companies and R&D departments', false);