-- 添加缺失的 get_api_key 函数（简化版）
CREATE OR REPLACE FUNCTION get_api_key(p_key_name TEXT)
RETURNS TABLE (
  key_value TEXT,
  is_active BOOLEAN,
  usage_count INTEGER,
  last_used_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    api_keys.encrypted_key,
    api_keys.is_active,
    api_keys.usage_count,
    api_keys.last_used_at
  FROM api_keys
  WHERE api_keys.key_name = p_key_name;
  
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT NULL::TEXT, false::BOOLEAN, 0::INTEGER, NULL::TIMESTAMP WITH TIME ZONE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 授予执行权限
GRANT EXECUTE ON FUNCTION get_api_key(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_api_key(TEXT) TO authenticated;