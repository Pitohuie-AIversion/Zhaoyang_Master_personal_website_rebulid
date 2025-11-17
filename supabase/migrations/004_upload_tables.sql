-- 文件上传相关表
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_name TEXT NOT NULL,
  file_name TEXT NOT NULL UNIQUE,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT,
  tags TEXT[],
  uploaded_by TEXT,
  upload_status TEXT DEFAULT 'completed' CHECK (upload_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 简历管理表
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language VARCHAR(10) NOT NULL CHECK (language IN ('zh', 'en')),
  version TEXT DEFAULT 'current',
  original_name TEXT NOT NULL,
  file_name TEXT NOT NULL UNIQUE,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_uploaded_files_category ON uploaded_files(category);
CREATE INDEX idx_uploaded_files_created_at ON uploaded_files(created_at DESC);
CREATE INDEX idx_uploaded_files_file_type ON uploaded_files(file_type);
CREATE INDEX idx_resumes_language ON resumes(language);
CREATE INDEX idx_resumes_is_active ON resumes(is_active);
CREATE INDEX idx_resumes_created_at ON resumes(created_at DESC);

-- 启用行级安全策略
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户上传和查看文件
CREATE POLICY "Allow anonymous file uploads" ON uploaded_files
  FOR ALL USING (true);

CREATE POLICY "Allow anonymous resume management" ON resumes
  FOR ALL USING (true);

-- 授权给anon和authenticated角色
GRANT ALL PRIVILEGES ON uploaded_files TO anon;
GRANT ALL PRIVILEGES ON uploaded_files TO authenticated;
GRANT ALL PRIVILEGES ON resumes TO anon;
GRANT ALL PRIVILEGES ON resumes TO authenticated;

-- 创建自动更新时间戳触发器
CREATE TRIGGER update_uploaded_files_updated_at BEFORE UPDATE ON uploaded_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();