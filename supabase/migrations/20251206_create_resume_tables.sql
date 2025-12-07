-- Create resume related tables

-- Personal Info
CREATE TABLE IF NOT EXISTS resume_personal_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  english_name TEXT,
  chinese_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  linkedin TEXT,
  github TEXT,
  bio TEXT,
  bio_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education
CREATE TABLE IF NOT EXISTS resume_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree TEXT NOT NULL,
  degree_en TEXT,
  major TEXT NOT NULL,
  major_en TEXT,
  school TEXT NOT NULL,
  school_en TEXT,
  start_date TEXT,
  end_date TEXT,
  gpa NUMERIC,
  description TEXT,
  description_en TEXT,
  supervisor TEXT,
  location TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Experience
CREATE TABLE IF NOT EXISTS resume_work_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position TEXT NOT NULL,
  position_en TEXT,
  company TEXT NOT NULL,
  company_en TEXT,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  location TEXT,
  description TEXT,
  description_en TEXT,
  achievements TEXT[], -- Array of strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research Experience
CREATE TABLE IF NOT EXISTS resume_research_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_en TEXT,
  institution TEXT NOT NULL,
  institution_en TEXT,
  lab_name TEXT,
  supervisor TEXT,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  description_en TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS resume_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  skill_name_en TEXT,
  proficiency_level TEXT,
  years_of_experience NUMERIC,
  description TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Languages
CREATE TABLE IF NOT EXISTS resume_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language TEXT NOT NULL,
  language_en TEXT,
  proficiency TEXT,
  is_native BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications
CREATE TABLE IF NOT EXISTS resume_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT,
  issuing_organization TEXT,
  issue_date TEXT,
  credential_id TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professional Activities
CREATE TABLE IF NOT EXISTS resume_professional_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT,
  organization TEXT,
  date TEXT,
  description TEXT,
  is_invited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for all tables
ALTER TABLE resume_personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_research_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_professional_activities ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for now for development, or authenticated)
-- For simplicity in this dev environment, we allow public read/write if not in production
-- But better to be safe. We will allow service_role to do everything, and anon to read.
-- Assuming the backend uses service_role key, it bypasses RLS anyway.
-- But for client-side access (if any), we need policies.
-- Let's create a policy that allows everything for now to avoid permission issues during dev.

CREATE POLICY "Enable all access for all users" ON resume_personal_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON resume_education FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON resume_work_experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON resume_research_experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON resume_skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON resume_languages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON resume_certifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON resume_professional_activities FOR ALL USING (true) WITH CHECK (true);
