-- 创建论文表
CREATE TABLE IF NOT EXISTS publications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  journal TEXT,
  year INTEGER,
  doi TEXT,
  abstract TEXT,
  keywords TEXT[],
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'accepted', 'under_review', 'preparing')),
  type TEXT DEFAULT 'journal' CHECK (type IN ('journal', 'conference')),
  citations_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建专利表
CREATE TABLE IF NOT EXISTS patents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  patent_number TEXT,
  applicant TEXT,
  public_date DATE,
  abstract TEXT,
  keywords TEXT[],
  status TEXT DEFAULT 'granted' CHECK (status IN ('granted', 'pending', 'rejected')),
  type TEXT DEFAULT 'invention' CHECK (type IN ('invention', 'utility', 'design')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'ongoing', 'planned')),
  year INTEGER,
  technologies TEXT[],
  highlights TEXT[],
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建奖项表
CREATE TABLE IF NOT EXISTS awards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT,
  award_date DATE,
  level TEXT DEFAULT 'university' CHECK (level IN ('national', 'provincial', 'university')),
  description TEXT,
  certificate_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建联系消息表
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  collaboration_type TEXT,
  budget_range TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全策略
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略 - 允许匿名用户读取学术数据
CREATE POLICY "Allow anonymous read access to publications" ON publications
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access to patents" ON patents
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access to projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access to awards" ON awards
  FOR SELECT USING (true);

-- 联系消息只允许插入，不允许读取（保护隐私）
CREATE POLICY "Allow anonymous insert to contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- 授权给anon和authenticated角色
GRANT SELECT ON publications TO anon;
GRANT SELECT ON patents TO anon;
GRANT SELECT ON projects TO anon;
GRANT SELECT ON awards TO anon;
GRANT INSERT ON contact_messages TO anon;

GRANT ALL PRIVILEGES ON publications TO authenticated;
GRANT ALL PRIVILEGES ON patents TO authenticated;
GRANT ALL PRIVILEGES ON projects TO authenticated;
GRANT ALL PRIVILEGES ON awards TO authenticated;
GRANT ALL PRIVILEGES ON contact_messages TO authenticated;

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表创建更新时间戳触发器
CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patents_updated_at BEFORE UPDATE ON patents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON awards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();