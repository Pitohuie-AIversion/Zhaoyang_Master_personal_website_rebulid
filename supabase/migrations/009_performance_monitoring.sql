-- 性能监控和用户行为追踪数据库表结构
-- 创建时间: 2025-01-19

-- Core Web Vitals 性能指标表
CREATE TABLE performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL,
    page_title TEXT,
    user_session TEXT,
    user_identifier TEXT,
    
    -- Core Web Vitals
    lcp_value DECIMAL(8,2), -- Largest Contentful Paint (ms)
    fcp_value DECIMAL(8,2), -- First Contentful Paint (ms)
    fid_value DECIMAL(8,2), -- First Input Delay (ms)
    cls_value DECIMAL(6,4), -- Cumulative Layout Shift
    ttfb_value DECIMAL(8,2), -- Time to First Byte (ms)
    fcp_score INTEGER CHECK (fcp_score >= 0 AND fcp_score <= 100),
    lcp_score INTEGER CHECK (lcp_score >= 0 AND lcp_score <= 100),
    fid_score INTEGER CHECK (fid_score >= 0 AND fid_score <= 100),
    cls_score INTEGER CHECK (cls_score >= 0 AND cls_score <= 100),
    ttfb_score INTEGER CHECK (ttfb_score >= 0 AND ttfb_score <= 100),
    
    -- 额外性能指标
    dom_content_loaded DECIMAL(8,2), -- DOMContentLoaded (ms)
    load_complete DECIMAL(8,2), -- Load complete (ms)
    resource_count INTEGER, -- 资源加载数量
    resource_size_total BIGINT, -- 总资源大小(bytes)
    javascript_size BIGINT, -- JavaScript文件大小(bytes)
    css_size BIGINT, -- CSS文件大小(bytes)
    image_size BIGINT, -- 图片文件大小(bytes)
    
    -- 设备和网络信息
    device_type TEXT, -- 'desktop', 'mobile', 'tablet'
    browser_name TEXT,
    browser_version TEXT,
    os_name TEXT,
    os_version TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    viewport_width INTEGER,
    viewport_height INTEGER,
    device_pixel_ratio DECIMAL(3,2),
    network_type TEXT, -- '4g', '3g', '2g', 'wifi', 'ethernet'
    network_effective_type TEXT,
    
    -- 地理位置信息
    country TEXT,
    city TEXT,
    timezone TEXT,
    
    -- 性能等级评估
    performance_grade TEXT, -- 'A', 'B', 'C', 'D', 'F'
    accessibility_grade TEXT,
    seo_grade TEXT,
    best_practices_grade TEXT,
    
    -- 错误信息
    has_errors BOOLEAN DEFAULT FALSE,
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 页面加载时间详细分析表
CREATE TABLE page_load_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    performance_metric_id UUID REFERENCES performance_metrics(id) ON DELETE CASCADE,
    
    -- 详细的加载时间线
    navigation_start DECIMAL(8,2),
    unload_event_start DECIMAL(8,2),
    unload_event_end DECIMAL(8,2),
    redirect_start DECIMAL(8,2),
    redirect_end DECIMAL(8,2),
    fetch_start DECIMAL(8,2),
    domain_lookup_start DECIMAL(8,2),
    domain_lookup_end DECIMAL(8,2),
    connect_start DECIMAL(8,2),
    connect_end DECIMAL(8,2),
    secure_connection_start DECIMAL(8,2),
    request_start DECIMAL(8,2),
    response_start DECIMAL(8,2),
    response_end DECIMAL(8,2),
    dom_loading DECIMAL(8,2),
    dom_interactive DECIMAL(8,2),
    dom_content_loaded_event_start DECIMAL(8,2),
    dom_content_loaded_event_end DECIMAL(8,2),
    dom_complete DECIMAL(8,2),
    load_event_start DECIMAL(8,2),
    load_event_end DECIMAL(8,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 资源加载性能表
CREATE TABLE resource_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    performance_metric_id UUID REFERENCES performance_metrics(id) ON DELETE CASCADE,
    
    resource_name TEXT NOT NULL,
    resource_type TEXT NOT NULL, -- 'script', 'stylesheet', 'image', 'font', 'xhr', 'document'
    resource_url TEXT NOT NULL,
    
    -- 资源加载时间
    start_time DECIMAL(8,2),
    duration DECIMAL(8,2),
    fetch_start DECIMAL(8,2),
    fetch_end DECIMAL(8,2),
    domain_lookup_start DECIMAL(8,2),
    domain_lookup_end DECIMAL(8,2),
    connect_start DECIMAL(8,2),
    connect_end DECIMAL(8,2),
    secure_connection_start DECIMAL(8,2),
    request_start DECIMAL(8,2),
    response_start DECIMAL(8,2),
    response_end DECIMAL(8,2),
    
    -- 资源大小信息
    transfer_size BIGINT,
    encoded_body_size BIGINT,
    decoded_body_size BIGINT,
    
    -- 缓存信息
    cache_hit BOOLEAN DEFAULT FALSE,
    from_cache BOOLEAN DEFAULT FALSE,
    from_service_worker BOOLEAN DEFAULT FALSE,
    
    -- 错误信息
    status_code INTEGER,
    has_error BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户会话追踪表
CREATE TABLE user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    user_identifier TEXT,
    
    -- 会话信息
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration INTEGER, -- 会话持续时间(秒)
    
    -- 页面浏览信息
    page_views INTEGER DEFAULT 0,
    unique_pages_viewed INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0,
    
    -- 设备和环境信息
    device_type TEXT,
    browser_name TEXT,
    browser_version TEXT,
    os_name TEXT,
    os_version TEXT,
    screen_resolution TEXT,
    viewport_size TEXT,
    
    -- 地理位置
    country TEXT,
    city TEXT,
    timezone TEXT,
    
    -- 流量来源
    referrer TEXT,
    referrer_type TEXT, -- 'search', 'social', 'direct', 'referral'
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    
    -- 性能指标
    avg_page_load_time DECIMAL(8,2),
    total_errors INTEGER DEFAULT 0,
    total_warnings INTEGER DEFAULT 0,
    
    -- 交互行为
    clicks INTEGER DEFAULT 0,
    scrolls INTEGER DEFAULT 0,
    form_interactions INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 页面浏览事件表
CREATE TABLE page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_identifier TEXT,
    
    page_path TEXT NOT NULL,
    page_title TEXT,
    page_referrer TEXT,
    
    -- 时间信息
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    time_on_page INTEGER, -- 页面停留时间(秒)
    
    -- 滚动行为
    scroll_depth DECIMAL(5,2), -- 滚动深度百分比
    max_scroll_depth DECIMAL(5,2),
    scroll_velocity DECIMAL(8,2),
    
    -- 点击行为
    clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    first_click_time TIMESTAMPTZ,
    last_click_time TIMESTAMPTZ,
    
    -- 表单交互
    form_starts INTEGER DEFAULT 0,
    form_completions INTEGER DEFAULT 0,
    form_abandonments INTEGER DEFAULT 0,
    
    -- 性能指标
    page_load_time DECIMAL(8,2),
    dom_ready_time DECIMAL(8,2),
    first_paint_time DECIMAL(8,2),
    first_contentful_paint DECIMAL(8,2),
    
    -- 错误信息
    js_errors INTEGER DEFAULT 0,
    console_errors TEXT[],
    network_errors INTEGER DEFAULT 0,
    
    -- 退出信息
    exit_intent BOOLEAN DEFAULT FALSE,
    exit_reason TEXT, -- 'timeout', 'navigation', 'close', 'back'
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 错误追踪表
CREATE TABLE error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT,
    user_identifier TEXT,
    page_path TEXT,
    
    error_type TEXT NOT NULL, -- 'javascript', 'network', 'resource', 'promise', 'custom'
    error_message TEXT NOT NULL,
    error_stack TEXT,
    
    -- 错误详情
    error_class TEXT,
    error_code TEXT,
    error_severity TEXT, -- 'low', 'medium', 'high', 'critical'
    
    -- 环境信息
    browser_name TEXT,
    browser_version TEXT,
    os_name TEXT,
    os_version TEXT,
    device_type TEXT,
    
    -- 网络信息
    network_type TEXT,
    network_effective_type TEXT,
    
    -- 资源信息（如果是资源加载错误）
    resource_url TEXT,
    resource_type TEXT,
    status_code INTEGER,
    
    -- 用户行为上下文
    user_action TEXT, -- 用户触发错误时的操作
    form_data JSONB, -- 表单数据（脱敏后）
    
    -- 错误状态
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 自定义事件追踪表
CREATE TABLE custom_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT,
    user_identifier TEXT,
    page_path TEXT,
    
    event_name TEXT NOT NULL,
    event_category TEXT,
    event_action TEXT,
    event_label TEXT,
    
    -- 事件数据
    event_value INTEGER,
    event_data JSONB,
    
    -- 事件时间
    event_time TIMESTAMPTZ DEFAULT NOW(),
    event_duration INTEGER, -- 事件持续时间(毫秒)
    
    -- 用户交互
    element_id TEXT,
    element_class TEXT,
    element_tag TEXT,
    element_text TEXT,
    
    -- 位置信息
    mouse_x INTEGER,
    mouse_y INTEGER,
    viewport_x INTEGER,
    viewport_y INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B测试追踪表
CREATE TABLE ab_test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_name TEXT NOT NULL,
    test_variant TEXT NOT NULL,
    
    session_id TEXT,
    user_identifier TEXT,
    page_path TEXT,
    
    -- 测试结果
    conversion_event TEXT,
    conversion_value DECIMAL(10,2),
    is_converted BOOLEAN DEFAULT FALSE,
    
    -- 测试时间
    test_start_time TIMESTAMPTZ DEFAULT NOW(),
    test_end_time TIMESTAMPTZ,
    test_duration INTEGER, -- 测试持续时间(秒)
    
    -- 用户反馈
    user_feedback JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(test_name, test_variant, session_id)
);

-- 创建索引
CREATE INDEX idx_performance_metrics_page ON performance_metrics(page_path);
CREATE INDEX idx_performance_metrics_session ON performance_metrics(user_session);
CREATE INDEX idx_performance_metrics_created_at ON performance_metrics(created_at DESC);
CREATE INDEX idx_performance_metrics_device ON performance_metrics(device_type);
CREATE INDEX idx_performance_metrics_browser ON performance_metrics(browser_name);
CREATE INDEX idx_performance_metrics_country ON performance_metrics(country);
CREATE INDEX idx_performance_metrics_grade ON performance_metrics(performance_grade);

CREATE INDEX idx_page_load_details_metric ON page_load_details(performance_metric_id);
CREATE INDEX idx_resource_performance_metric ON resource_performance(performance_metric_id);
CREATE INDEX idx_resource_performance_type ON resource_performance(resource_type);
CREATE INDEX idx_resource_performance_url ON resource_performance(resource_url);

CREATE INDEX idx_user_sessions_session ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_identifier);
CREATE INDEX idx_user_sessions_start_time ON user_sessions(start_time DESC);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX idx_user_sessions_referrer ON user_sessions(referrer_type);

CREATE INDEX idx_page_views_session ON page_views(session_id);
CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_start_time ON page_views(start_time DESC);
CREATE INDEX idx_page_views_user ON page_views(user_identifier);

CREATE INDEX idx_error_logs_session ON error_logs(session_id);
CREATE INDEX idx_error_logs_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_severity ON error_logs(error_severity);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_resolved ON error_logs(is_resolved);

CREATE INDEX idx_custom_events_session ON custom_events(session_id);
CREATE INDEX idx_custom_events_name ON custom_events(event_name);
CREATE INDEX idx_custom_events_category ON custom_events(event_category);
CREATE INDEX idx_custom_events_created_at ON custom_events(created_at DESC);

CREATE INDEX idx_ab_test_results_test ON ab_test_results(test_name, test_variant);
CREATE INDEX idx_ab_test_results_session ON ab_test_results(session_id);
CREATE INDEX idx_ab_test_results_converted ON ab_test_results(is_converted);

-- 添加RLS策略
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_load_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户插入性能数据
CREATE POLICY "Allow insert performance metrics" ON performance_metrics
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view performance metrics" ON performance_metrics
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户插入页面加载详情
CREATE POLICY "Allow insert page load details" ON page_load_details
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view page load details" ON page_load_details
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户插入资源性能数据
CREATE POLICY "Allow insert resource performance" ON resource_performance
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view resource performance" ON resource_performance
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户插入用户会话
CREATE POLICY "Allow insert user sessions" ON user_sessions
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow update own sessions" ON user_sessions
    FOR UPDATE
    USING (session_id = current_setting('app.current_session', true));

CREATE POLICY "Allow view sessions" ON user_sessions
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户插入页面浏览
CREATE POLICY "Allow insert page views" ON page_views
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow update own page views" ON page_views
    FOR UPDATE
    USING (session_id = current_setting('app.current_session', true));

CREATE POLICY "Allow view page views" ON page_views
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户插入错误日志
CREATE POLICY "Allow insert error logs" ON error_logs
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view error logs" ON error_logs
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户插入自定义事件
CREATE POLICY "Allow insert custom events" ON custom_events
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view custom events" ON custom_events
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户插入A/B测试结果
CREATE POLICY "Allow insert ab test results" ON ab_test_results
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow view ab test results" ON ab_test_results
    FOR SELECT
    USING (true);

-- 创建聚合函数来更新会话统计
CREATE OR REPLACE FUNCTION update_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'page_views' THEN
        -- 更新会话的页面浏览统计
        UPDATE user_sessions SET
            page_views = (SELECT COUNT(*) FROM page_views WHERE session_id = NEW.session_id),
            unique_pages_viewed = (SELECT COUNT(DISTINCT page_path) FROM page_views WHERE session_id = NEW.session_id),
            avg_time_on_page = (SELECT AVG(time_on_page) FROM page_views WHERE session_id = NEW.session_id AND time_on_page IS NOT NULL),
            updated_at = NOW()
        WHERE session_id = NEW.session_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER trigger_update_session_stats
    AFTER UPDATE ON page_views
    FOR EACH ROW
    EXECUTE FUNCTION update_session_stats();

-- 创建清理过期会话的函数
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- 删除超过30天的过期会话
    DELETE FROM user_sessions 
    WHERE is_active = FALSE 
    AND updated_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 创建定时清理任务（需要pg_cron扩展）
-- SELECT cron.schedule('cleanup-expired-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');

-- 授予权限
GRANT SELECT, INSERT ON performance_metrics TO anon;
GRANT SELECT, INSERT ON page_load_details TO anon;
GRANT SELECT, INSERT ON resource_performance TO anon;
GRANT SELECT, INSERT, UPDATE ON user_sessions TO anon;
GRANT SELECT, INSERT, UPDATE ON page_views TO anon;
GRANT SELECT, INSERT ON error_logs TO anon;
GRANT SELECT, INSERT ON custom_events TO anon;
GRANT SELECT, INSERT ON ab_test_results TO anon;