-- 修复contact_messages表结构
-- 添加缺失的字段

ALTER TABLE contact_messages
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT;

-- 更新现有记录的默认值
UPDATE contact_messages 
SET 
  ip_address = 'unknown' WHERE ip_address IS NULL,
  user_agent = 'unknown' WHERE user_agent IS NULL,
  referrer = 'unknown' WHERE referrer IS NULL;

-- 检查表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contact_messages'
ORDER BY ordinal_position;

-- 验证修复
SELECT COUNT(*) as total_records,
       COUNT(ip_address) as has_ip_address,
       COUNT(user_agent) as has_user_agent,
       COUNT(referrer) as has_referrer
FROM contact_messages;