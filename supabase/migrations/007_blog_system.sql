-- 博客系统数据库表结构
-- 创建时间: 2025-01-19

-- 博客文章表
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_zh TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_zh TEXT NOT NULL,
    content_en TEXT NOT NULL,
    excerpt_zh TEXT,
    excerpt_en TEXT,
    slug TEXT UNIQUE NOT NULL,
    cover_image TEXT,
    author_name TEXT DEFAULT '牟昭阳',
    author_email TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
    featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0, -- 预计阅读时间(分钟)
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 博客分类表
CREATE TABLE blog_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description_zh TEXT,
    description_en TEXT,
    color TEXT DEFAULT '#3B82F6',
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 博客标签表
CREATE TABLE blog_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#6B7280',
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 文章-标签关联表
CREATE TABLE blog_post_tags (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, tag_id)
);

-- 博客评论表
CREATE TABLE blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE, -- 支持嵌套评论
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    author_website TEXT,
    content TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, spam
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 博客文章版本历史表
CREATE TABLE blog_post_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    title_zh TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_zh TEXT NOT NULL,
    content_en TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);

CREATE INDEX idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX idx_blog_post_tags_tag_id ON blog_post_tags(tag_id);

CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX idx_blog_comments_status ON blog_comments(status);
CREATE INDEX idx_blog_comments_created_at ON blog_comments(created_at DESC);

CREATE INDEX idx_blog_post_versions_post_id ON blog_post_versions(post_id);
CREATE INDEX idx_blog_post_versions_version_number ON blog_post_versions(version_number DESC);

-- 创建全文搜索索引
ALTER TABLE blog_posts ADD COLUMN search_vector_zh tsvector;
ALTER TABLE blog_posts ADD COLUMN search_vector_en tsvector;

-- 创建触发器函数来更新搜索向量
CREATE OR REPLACE FUNCTION update_blog_search_vectors()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector_zh := to_tsvector('simple', COALESCE(NEW.title_zh, '') || ' ' || COALESCE(NEW.content_zh, ''));
    NEW.search_vector_en := to_tsvector('simple', COALESCE(NEW.title_en, '') || ' ' || COALESCE(NEW.content_en, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER trigger_update_blog_search_vectors
    BEFORE INSERT OR UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_search_vectors();

-- 创建GIN索引用于全文搜索
CREATE INDEX idx_blog_search_zh ON blog_posts USING GIN(search_vector_zh);
CREATE INDEX idx_blog_search_en ON blog_posts USING GIN(search_vector_en);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为相关表添加更新时间触发器
CREATE TRIGGER trigger_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_blog_categories_updated_at
    BEFORE UPDATE ON blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_blog_comments_updated_at
    BEFORE UPDATE ON blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 添加RLS策略
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_versions ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户查看已发布的文章
CREATE POLICY "Allow view published posts" ON blog_posts
    FOR SELECT
    USING (status = 'published' AND published_at <= NOW());

-- 创建策略：允许匿名用户查看分类和标签
CREATE POLICY "Allow view categories" ON blog_categories
    FOR SELECT
    USING (true);

CREATE POLICY "Allow view tags" ON blog_tags
    FOR SELECT
    USING (true);

-- 创建策略：允许匿名用户查看已批准的评论
CREATE POLICY "Allow view approved comments" ON blog_comments
    FOR SELECT
    USING (status = 'approved');

-- 创建策略：允许匿名用户添加评论
CREATE POLICY "Allow add comments" ON blog_comments
    FOR INSERT
    WITH CHECK (true);

-- 创建策略：允许匿名用户查看文章标签关联
CREATE POLICY "Allow view post tags" ON blog_post_tags
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM blog_posts 
        WHERE blog_posts.id = post_id AND blog_posts.status = 'published'
    ));

-- 插入默认分类数据
INSERT INTO blog_categories (name_zh, name_en, slug, description_zh, description_en, color) VALUES
    ('学术研究', 'Academic Research', 'academic-research', '关于学术研究的博客文章', 'Blog posts about academic research', '#3B82F6'),
    ('技术分享', 'Technology Sharing', 'technology-sharing', '技术相关的分享文章', 'Technology sharing articles', '#10B981'),
    ('项目经验', 'Project Experience', 'project-experience', '项目开发经验和总结', 'Project development experience and summary', '#F59E0B'),
    ('学习笔记', 'Learning Notes', 'learning-notes', '学习过程中的笔记和思考', 'Notes and thoughts during learning', '#8B5CF6'),
    ('生活感悟', 'Life Reflections', 'life-reflections', '生活中的感悟和思考', 'Reflections and thoughts on life', '#EF4444');

-- 插入默认标签数据
INSERT INTO blog_tags (name_zh, name_en, slug, color) VALUES
    ('人工智能', 'AI', 'ai', '#3B82F6'),
    ('机器学习', 'Machine Learning', 'machine-learning', '#10B981'),
    ('深度学习', 'Deep Learning', 'deep-learning', '#8B5CF6'),
    ('计算机视觉', 'Computer Vision', 'computer-vision', '#F59E0B'),
    ('自然语言处理', 'NLP', 'nlp', '#EF4444'),
    ('数据科学', 'Data Science', 'data-science', '#06B6D4'),
    ('算法', 'Algorithm', 'algorithm', '#84CC16'),
    ('编程', 'Programming', 'programming', '#F97316'),
    ('研究', 'Research', 'research', '#6366F1'),
    ('论文', 'Paper', 'paper', '#EC4899');

-- 授予权限
GRANT SELECT ON blog_posts TO anon;
GRANT SELECT ON blog_categories TO anon;
GRANT SELECT ON blog_tags TO anon;
GRANT SELECT ON blog_post_tags TO anon;
GRANT SELECT, INSERT ON blog_comments TO anon;
GRANT SELECT ON blog_post_versions TO anon;