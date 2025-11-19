-- 社交互动系统数据库表结构
-- 创建时间: 2025-01-19

-- 实体点赞表（支持对文章、项目、论文等进行点赞）
CREATE TABLE entity_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'blog_post', 'project', 'publication', 'patent'
    entity_id UUID NOT NULL,
    user_identifier TEXT NOT NULL, -- IP地址或用户标识符
    user_session TEXT, -- 用户会话ID
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id, user_identifier)
);

-- 实体收藏表
CREATE TABLE entity_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'blog_post', 'project', 'publication', 'patent'
    entity_id UUID NOT NULL,
    user_identifier TEXT NOT NULL,
    user_session TEXT,
    title TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id, user_identifier)
);

-- 实体分享表
CREATE TABLE entity_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'blog_post', 'project', 'publication', 'patent'
    entity_id UUID NOT NULL,
    share_platform TEXT NOT NULL, -- 'weibo', 'wechat', 'twitter', 'facebook', 'linkedin', 'copy_link'
    share_url TEXT NOT NULL,
    user_identifier TEXT,
    user_session TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    share_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 页面评分表
CREATE TABLE entity_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'blog_post', 'project', 'publication', 'patent'
    entity_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    user_identifier TEXT NOT NULL,
    user_session TEXT,
    ip_address INET,
    user_agent TEXT,
    review_title TEXT,
    review_content TEXT,
    would_recommend BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id, user_identifier)
);

-- 实体访问统计表
CREATE TABLE entity_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'blog_post', 'project', 'publication', 'patent', 'page'
    entity_id UUID,
    page_path TEXT,
    view_count INTEGER DEFAULT 0,
    unique_view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0, -- 平均停留时间(秒)
    bounce_rate DECIMAL(5,2) DEFAULT 0, -- 跳出率
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id, page_path)
);

-- 用户行为追踪表
CREATE TABLE user_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_identifier TEXT NOT NULL,
    user_session TEXT,
    interaction_type TEXT NOT NULL, -- 'view', 'like', 'bookmark', 'share', 'rate', 'comment', 'download'
    entity_type TEXT, -- 'blog_post', 'project', 'publication', 'patent', 'file'
    entity_id UUID,
    page_path TEXT,
    referrer TEXT,
    ip_address INET,
    user_agent TEXT,
    device_type TEXT, -- 'desktop', 'mobile', 'tablet'
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    interaction_duration INTEGER, -- 交互持续时间(秒)
    additional_data JSONB, -- 存储额外数据
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 热门内容统计表
CREATE TABLE trending_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    title TEXT,
    score DECIMAL(10,2) DEFAULT 0, -- 热度分数
    views_last_24h INTEGER DEFAULT 0,
    views_last_7d INTEGER DEFAULT 0,
    views_last_30d INTEGER DEFAULT 0,
    likes_last_24h INTEGER DEFAULT 0,
    likes_last_7d INTEGER DEFAULT 0,
    likes_last_30d INTEGER DEFAULT 0,
    shares_last_24h INTEGER DEFAULT 0,
    shares_last_7d INTEGER DEFAULT 0,
    shares_last_30d INTEGER DEFAULT 0,
    comments_last_24h INTEGER DEFAULT 0,
    comments_last_7d INTEGER DEFAULT 0,
    comments_last_30d INTEGER DEFAULT 0,
    last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id)
);

-- 通知表（用于用户互动通知）
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_identifier TEXT NOT NULL,
    notification_type TEXT NOT NULL, -- 'like', 'comment', 'share', 'bookmark', 'reply'
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    priority INTEGER DEFAULT 1, -- 1: low, 2: medium, 3: high
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_entity_likes_entity ON entity_likes(entity_type, entity_id);
CREATE INDEX idx_entity_likes_user ON entity_likes(user_identifier);
CREATE INDEX idx_entity_likes_created_at ON entity_likes(created_at DESC);

CREATE INDEX idx_entity_bookmarks_entity ON entity_bookmarks(entity_type, entity_id);
CREATE INDEX idx_entity_bookmarks_user ON entity_bookmarks(user_identifier);
CREATE INDEX idx_entity_bookmarks_created_at ON entity_bookmarks(created_at DESC);

CREATE INDEX idx_entity_shares_entity ON entity_shares(entity_type, entity_id);
CREATE INDEX idx_entity_shares_platform ON entity_shares(share_platform);
CREATE INDEX idx_entity_shares_created_at ON entity_shares(created_at DESC);

CREATE INDEX idx_entity_ratings_entity ON entity_ratings(entity_type, entity_id);
CREATE INDEX idx_entity_ratings_user ON entity_ratings(user_identifier);
CREATE INDEX idx_entity_ratings_rating ON entity_ratings(rating);
CREATE INDEX idx_entity_ratings_created_at ON entity_ratings(created_at DESC);

CREATE INDEX idx_entity_analytics_entity ON entity_analytics(entity_type, entity_id);
CREATE INDEX idx_entity_analytics_page_path ON entity_analytics(page_path);
CREATE INDEX idx_entity_analytics_updated_at ON entity_analytics(updated_at DESC);

CREATE INDEX idx_user_interactions_user ON user_interactions(user_identifier);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_user_interactions_entity ON user_interactions(entity_type, entity_id);
CREATE INDEX idx_user_interactions_created_at ON user_interactions(created_at DESC);
CREATE INDEX idx_user_interactions_session ON user_interactions(user_session);

CREATE INDEX idx_trending_content_entity ON trending_content(entity_type, entity_id);
CREATE INDEX idx_trending_content_score ON trending_content(score DESC);
CREATE INDEX idx_trending_content_last_calculated ON trending_content(last_calculated_at);

CREATE INDEX idx_notifications_user ON notifications(user_identifier);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_priority ON notifications(priority DESC);

-- 添加RLS策略
ALTER TABLE entity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户进行点赞
CREATE POLICY "Allow insert likes" ON entity_likes
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view likes" ON entity_likes
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户进行收藏
CREATE POLICY "Allow insert bookmarks" ON entity_bookmarks
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view own bookmarks" ON entity_bookmarks
    FOR SELECT
    USING (user_identifier = current_setting('app.current_user_id', true) OR 
           user_session = current_setting('app.current_session', true));

-- 创建策略：允许匿名用户进行分享
CREATE POLICY "Allow insert shares" ON entity_shares
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view shares" ON entity_shares
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户进行评分
CREATE POLICY "Allow insert ratings" ON entity_ratings
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view ratings" ON entity_ratings
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户查看分析数据
CREATE POLICY "Allow view analytics" ON entity_analytics
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户记录交互
CREATE POLICY "Allow insert interactions" ON user_interactions
    FOR INSERT
    WITH CHECK (true);

-- 创建策略：允许匿名用户查看热门内容
CREATE POLICY "Allow view trending" ON trending_content
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户接收通知
CREATE POLICY "Allow view notifications" ON notifications
    FOR SELECT
    USING (user_identifier = current_setting('app.current_user_id', true) OR 
           user_identifier = current_setting('app.current_session', true));

CREATE POLICY "Allow update notifications" ON notifications
    FOR UPDATE
    USING (user_identifier = current_setting('app.current_user_id', true) OR 
           user_identifier = current_setting('app.current_session', true));

-- 创建聚合函数和触发器来更新统计信息
CREATE OR REPLACE FUNCTION update_entity_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- 更新实体分析数据
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'entity_likes' THEN
            INSERT INTO entity_analytics (entity_type, entity_id, like_count)
            VALUES (NEW.entity_type, NEW.entity_id, 1)
            ON CONFLICT (entity_type, entity_id, page_path)
            DO UPDATE SET 
                like_count = entity_analytics.like_count + 1,
                updated_at = NOW();
        ELSIF TG_TABLE_NAME = 'entity_bookmarks' THEN
            INSERT INTO entity_analytics (entity_type, entity_id, bookmark_count)
            VALUES (NEW.entity_type, NEW.entity_id, 1)
            ON CONFLICT (entity_type, entity_id, page_path)
            DO UPDATE SET 
                bookmark_count = entity_analytics.bookmark_count + 1,
                updated_at = NOW();
        ELSIF TG_TABLE_NAME = 'entity_shares' THEN
            INSERT INTO entity_analytics (entity_type, entity_id, share_count)
            VALUES (NEW.entity_type, NEW.entity_id, NEW.share_count)
            ON CONFLICT (entity_type, entity_id, page_path)
            DO UPDATE SET 
                share_count = entity_analytics.share_count + NEW.share_count,
                updated_at = NOW();
        ELSIF TG_TABLE_NAME = 'entity_ratings' THEN
            INSERT INTO entity_analytics (entity_type, entity_id, rating_count, rating_average)
            VALUES (NEW.entity_type, NEW.entity_id, 1, NEW.rating)
            ON CONFLICT (entity_type, entity_id, page_path)
            DO UPDATE SET 
                rating_count = entity_analytics.rating_count + 1,
                rating_average = (entity_analytics.rating_average * entity_analytics.rating_count + NEW.rating) / (entity_analytics.rating_count + 1),
                updated_at = NOW();
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER trigger_update_likes_analytics
    AFTER INSERT ON entity_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_entity_analytics();

CREATE TRIGGER trigger_update_bookmarks_analytics
    AFTER INSERT ON entity_bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_entity_analytics();

CREATE TRIGGER trigger_update_shares_analytics
    AFTER INSERT ON entity_shares
    FOR EACH ROW
    EXECUTE FUNCTION update_entity_analytics();

CREATE TRIGGER trigger_update_ratings_analytics
    AFTER INSERT ON entity_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_entity_analytics();

-- 授予权限
GRANT SELECT, INSERT ON entity_likes TO anon;
GRANT SELECT, INSERT ON entity_bookmarks TO anon;
GRANT SELECT, INSERT ON entity_shares TO anon;
GRANT SELECT, INSERT ON entity_ratings TO anon;
GRANT SELECT ON entity_analytics TO anon;
GRANT SELECT, INSERT ON user_interactions TO anon;
GRANT SELECT ON trending_content TO anon;
GRANT SELECT, INSERT, UPDATE ON notifications TO anon;