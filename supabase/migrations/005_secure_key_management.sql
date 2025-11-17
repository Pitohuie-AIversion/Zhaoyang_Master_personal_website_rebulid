-- 安全API密钥管理系统（简化版，不使用vault扩展）
-- 创建API密钥存储表（存储预加密的密钥）
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT NOT NULL UNIQUE,
  encrypted_key TEXT NOT NULL, -- 存储应用层加密的密钥
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 创建API密钥使用日志表
CREATE TABLE IF NOT EXISTS api_key_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  session_id TEXT,
  endpoint TEXT,
  method TEXT,
  status_code INTEGER,
  response_time_ms INTEGER,
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage_logs ENABLE ROW LEVEL SECURITY;

-- 创建策略：只允许管理员管理API密钥
CREATE POLICY "Admin users can manage API keys" ON api_keys
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'mzymuzhaoyang@gmail.com'
    )
  );

-- 创建策略：只允许查看活跃的密钥
CREATE POLICY "Users can view active API keys" ON api_keys
  FOR SELECT USING (
    is_active = true AND (
      auth.uid() IS NOT NULL OR
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.email = 'mzymuzhaoyang@gmail.com'
      )
    )
  );

-- 创建策略：API密钥使用日志只能由管理员查看
CREATE POLICY "Admin users can view usage logs" ON api_key_usage_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'mzymuzhaoyang@gmail.com'
    )
  );

-- 创建函数：更新API密钥使用统计
CREATE OR REPLACE FUNCTION update_api_key_usage(
  p_key_name TEXT,
  p_session_id TEXT,
  p_endpoint TEXT,
  p_method TEXT,
  p_status_code INTEGER,
  p_response_time_ms INTEGER DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- 更新密钥使用计数和最后使用时间
  UPDATE api_keys 
  SET 
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE key_name = p_key_name AND is_active = true;

  -- 记录使用日志
  INSERT INTO api_key_usage_logs (
    key_id,
    session_id,
    endpoint,
    method,
    status_code,
    response_time_ms,
    error_message,
    ip_address,
    user_agent
  ) SELECT 
    id,
    p_session_id,
    p_endpoint,
    p_method,
    p_status_code,
    p_response_time_ms,
    p_error_message,
    p_ip_address,
    p_user_agent
  FROM api_keys 
  WHERE key_name = p_key_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：获取API密钥信息
CREATE OR REPLACE FUNCTION get_api_key_info(p_key_name TEXT)
RETURNS TABLE (
  key_exists BOOLEAN,
  is_active BOOLEAN,
  usage_count INTEGER,
  last_used_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true,
    api_keys.is_active,
    api_keys.usage_count,
    api_keys.last_used_at,
    api_keys.metadata
  FROM api_keys
  WHERE api_keys.key_name = p_key_name;
  
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT false, false, 0, NULL, '{}'::jsonb;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：轮换API密钥
CREATE OR REPLACE FUNCTION rotate_api_key(
  p_key_name TEXT,
  p_new_encrypted_key TEXT,
  p_updated_by UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_success BOOLEAN := false;
BEGIN
  UPDATE api_keys 
  SET 
    encrypted_key = p_new_encrypted_key,
    updated_at = NOW(),
    updated_by = p_updated_by
  WHERE key_name = p_key_name
  AND is_active = true;

  IF FOUND THEN
    v_success := true;
  END IF;

  RETURN v_success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_api_keys_key_name ON api_keys(key_name);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_logs_key_id ON api_key_usage_logs(key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_logs_created_at ON api_key_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_logs_session_id ON api_key_usage_logs(session_id);

-- 授予必要的权限
GRANT SELECT ON api_keys TO anon;
GRANT SELECT ON api_keys TO authenticated;
GRANT INSERT, UPDATE, DELETE ON api_keys TO authenticated;
GRANT SELECT ON api_key_usage_logs TO authenticated;
GRANT EXECUTE ON FUNCTION get_api_key_info(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_api_key_info(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_api_key_usage(TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, TEXT, INET, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION update_api_key_usage(TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, TEXT, INET, TEXT) TO authenticated;