-- 安全增强迁移
-- 为上传文件和简历表添加RLS策略

-- 上传文件表安全策略
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- 创建上传文件表的RLS策略
CREATE POLICY "用户只能查看自己的上传文件" ON uploaded_files
  FOR SELECT TO anon
  USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的上传文件" ON uploaded_files  
  FOR INSERT TO anon
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的上传文件" ON uploaded_files
  FOR UPDATE TO anon
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的上传文件" ON uploaded_files
  FOR DELETE TO anon
  USING (auth.uid() = user_id);

-- 简历表安全策略  
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- 创建简历表的RLS策略
CREATE POLICY "用户只能查看自己的简历" ON resumes
  FOR SELECT TO anon
  USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的简历" ON resumes
  FOR INSERT TO anon
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的简历" ON resumes
  FOR UPDATE TO anon
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的简历" ON resumes
  FOR DELETE TO anon
  USING (auth.uid() = user_id);

-- API密钥使用日志表安全策略
ALTER TABLE api_key_usage_logs ENABLE ROW LEVEL SECURITY;

-- API密钥使用日志只允许服务角色查看
CREATE POLICY "仅服务角色可查看API密钥使用日志" ON api_key_usage_logs
  FOR SELECT TO service_role
  USING (true);

CREATE POLICY "仅服务角色可插入API密钥使用日志" ON api_key_usage_logs
  FOR INSERT TO service_role
  WITH CHECK (true);

-- 安全密钥表策略增强
ALTER TABLE secure_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "仅服务角色可管理安全密钥" ON secure_keys
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- 添加安全审计字段
ALTER TABLE uploaded_files 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_uploaded_files_updated_at 
    BEFORE UPDATE ON uploaded_files 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at 
    BEFORE UPDATE ON resumes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();