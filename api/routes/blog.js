const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, param, query, validationResult } = require('express-validator');

const router = express.Router();

// 安全配置
router.use(helmet());

// Supabase客户端
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// 速率限制
const generalLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 100次请求
    message: '请求过于频繁，请稍后再试'
});

const commentLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 10, // 限制每个IP 10次评论
    message: '评论过于频繁，请稍后再试'
});

// 获取博客文章列表
router.get('/posts', generalLimit, [
    query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
    query('category').optional().isString().withMessage('分类格式不正确'),
    query('tag').optional().isString().withMessage('标签格式不正确'),
    query('search').optional().isString().withMessage('搜索关键词格式不正确'),
    query('lang').optional().isIn(['zh', 'en']).withMessage('语言参数必须是zh或en')
], async (req, res) => {
    try {
        // 验证输入
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: '输入参数验证失败',
                errors: errors.array() 
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const category = req.query.category;
        const tag = req.query.tag;
        const search = req.query.search;
        const lang = req.query.lang || 'zh';

        let query = supabase
            .from('blog_posts')
            .select(`
                *,
                blog_categories!inner(name_zh, name_en, slug, color),
                blog_post_tags!inner(blog_tags!inner(name_zh, name_en, slug, color))
            `, { count: 'exact' })
            .eq('status', 'published')
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false });

        // 分类筛选
        if (category) {
            query = query.eq('category', category);
        }

        // 标签筛选
        if (tag) {
            query = query.eq('blog_post_tags.blog_tags.slug', tag);
        }

        // 搜索功能
        if (search) {
            const searchVector = lang === 'zh' ? 'search_vector_zh' : 'search_vector_en';
            query = query.textSearch(searchVector, search);
        }

        // 分页
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('获取博客文章失败:', error);
            return res.status(500).json({ 
                success: false, 
                message: '获取博客文章失败',
                error: error.message 
            });
        }

        // 格式化数据
        const posts = data.map(post => ({
            id: post.id,
            title: lang === 'zh' ? post.title_zh : post.title_en,
            excerpt: lang === 'zh' ? post.excerpt_zh : post.excerpt_en,
            slug: post.slug,
            coverImage: post.cover_image,
            author: post.author_name,
            category: {
                name: lang === 'zh' ? post.blog_categories.name_zh : post.blog_categories.name_en,
                slug: post.blog_categories.slug,
                color: post.blog_categories.color
            },
            tags: post.blog_post_tags.map(pt => ({
                name: lang === 'zh' ? pt.blog_tags.name_zh : pt.blog_tags.name_en,
                slug: pt.blog_tags.slug,
                color: pt.blog_tags.color
            })),
            featured: post.featured,
            viewCount: post.view_count,
            readingTime: post.reading_time,
            publishedAt: post.published_at,
            createdAt: post.created_at
        }));

        res.json({
            success: true,
            data: {
                posts,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('获取博客文章列表错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 获取单篇博客文章
router.get('/posts/:slug', generalLimit, [
    param('slug').isString().withMessage('文章slug格式不正确'),
    query('lang').optional().isIn(['zh', 'en']).withMessage('语言参数必须是zh或en')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: '输入参数验证失败',
                errors: errors.array() 
            });
        }

        const { slug } = req.params;
        const lang = req.query.lang || 'zh';

        // 获取文章详情
        const { data: postData, error: postError } = await supabase
            .from('blog_posts')
            .select(`
                *,
                blog_categories!inner(name_zh, name_en, slug, color),
                blog_post_tags!inner(blog_tags!inner(name_zh, name_en, slug, color))
            `)
            .eq('slug', slug)
            .eq('status', 'published')
            .lte('published_at', new Date().toISOString())
            .single();

        if (postError || !postData) {
            return res.status(404).json({ 
                success: false, 
                message: '文章未找到' 
            });
        }

        // 增加浏览次数
        await supabase
            .from('blog_posts')
            .update({ view_count: postData.view_count + 1 })
            .eq('id', postData.id);

        // 获取相关评论
        const { data: commentsData, error: commentsError } = await supabase
            .from('blog_comments')
            .select('*')
            .eq('post_id', postData.id)
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        // 格式化文章数据
        const post = {
            id: postData.id,
            title: lang === 'zh' ? postData.title_zh : postData.title_en,
            content: lang === 'zh' ? postData.content_zh : postData.content_en,
            excerpt: lang === 'zh' ? postData.excerpt_zh : postData.excerpt_en,
            slug: postData.slug,
            coverImage: postData.cover_image,
            author: {
                name: postData.author_name,
                email: postData.author_email
            },
            category: {
                name: lang === 'zh' ? postData.blog_categories.name_zh : postData.blog_categories.name_en,
                slug: postData.blog_categories.slug,
                color: postData.blog_categories.color
            },
            tags: postData.blog_post_tags.map(pt => ({
                name: lang === 'zh' ? pt.blog_tags.name_zh : pt.blog_tags.name_en,
                slug: pt.blog_tags.slug,
                color: pt.blog_tags.color
            })),
            featured: postData.featured,
            viewCount: postData.view_count + 1, // 已经增加了浏览次数
            readingTime: postData.reading_time,
            publishedAt: postData.published_at,
            createdAt: postData.created_at,
            updatedAt: postData.updated_at
        };

        // 格式化评论数据
        const comments = commentsData ? commentsData.map(comment => ({
            id: comment.id,
            authorName: comment.author_name,
            authorEmail: comment.author_email,
            authorWebsite: comment.author_website,
            content: comment.content,
            parentId: comment.parent_id,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at
        })) : [];

        res.json({
            success: true,
            data: {
                post,
                comments,
                commentCount: comments.length
            }
        });

    } catch (error) {
        console.error('获取博客文章错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 获取博客分类列表
router.get('/categories', generalLimit, [
    query('lang').optional().isIn(['zh', 'en']).withMessage('语言参数必须是zh或en')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: '输入参数验证失败',
                errors: errors.array() 
            });
        }

        const lang = req.query.lang || 'zh';

        const { data, error } = await supabase
            .from('blog_categories')
            .select('*')
            .order('name_zh', { ascending: true });

        if (error) {
            console.error('获取分类失败:', error);
            return res.status(500).json({ 
                success: false, 
                message: '获取分类失败',
                error: error.message 
            });
        }

        const categories = data.map(category => ({
            id: category.id,
            name: lang === 'zh' ? category.name_zh : category.name_en,
            slug: category.slug,
            description: lang === 'zh' ? category.description_zh : category.description_en,
            color: category.color,
            postCount: category.post_count
        }));

        res.json({
            success: true,
            data: { categories }
        });

    } catch (error) {
        console.error('获取分类列表错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 获取博客标签列表
router.get('/tags', generalLimit, [
    query('lang').optional().isIn(['zh', 'en']).withMessage('语言参数必须是zh或en')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: '输入参数验证失败',
                errors: errors.array() 
            });
        }

        const lang = req.query.lang || 'zh';

        const { data, error } = await supabase
            .from('blog_tags')
            .select('*')
            .order('name_zh', { ascending: true });

        if (error) {
            console.error('获取标签失败:', error);
            return res.status(500).json({ 
                success: false, 
                message: '获取标签失败',
                error: error.message 
            });
        }

        const tags = data.map(tag => ({
            id: tag.id,
            name: lang === 'zh' ? tag.name_zh : tag.name_en,
            slug: tag.slug,
            color: tag.color,
            postCount: tag.post_count
        }));

        res.json({
            success: true,
            data: { tags }
        });

    } catch (error) {
        console.error('获取标签列表错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 添加博客评论
router.post('/posts/:slug/comments', commentLimit, [
    param('slug').isString().withMessage('文章slug格式不正确'),
    body('authorName').trim().isLength({ min: 1, max: 50 }).withMessage('姓名长度必须在1-50字符之间'),
    body('authorEmail').isEmail().withMessage('邮箱格式不正确'),
    body('authorWebsite').optional().isURL().withMessage('网站URL格式不正确'),
    body('content').trim().isLength({ min: 2, max: 1000 }).withMessage('评论内容长度必须在2-1000字符之间'),
    body('parentId').optional().isUUID().withMessage('父评论ID格式不正确')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: '输入参数验证失败',
                errors: errors.array() 
            });
        }

        const { slug } = req.params;
        const { authorName, authorEmail, authorWebsite, content, parentId } = req.body;

        // 获取文章ID
        const { data: postData, error: postError } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (postError || !postData) {
            return res.status(404).json({ 
                success: false, 
                message: '文章未找到' 
            });
        }

        // 检查父评论是否存在
        if (parentId) {
            const { data: parentComment } = await supabase
                .from('blog_comments')
                .select('id')
                .eq('id', parentId)
                .eq('post_id', postData.id)
                .single();

            if (!parentComment) {
                return res.status(400).json({ 
                    success: false, 
                    message: '父评论不存在' 
                });
            }
        }

        // 插入评论
        const { data: commentData, error: commentError } = await supabase
            .from('blog_comments')
            .insert({
                post_id: postData.id,
                parent_id: parentId || null,
                author_name: authorName,
                author_email: authorEmail,
                author_website: authorWebsite || null,
                content: content,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                status: 'pending' // 默认待审核状态
            })
            .select()
            .single();

        if (commentError) {
            console.error('添加评论失败:', commentError);
            return res.status(500).json({ 
                success: false, 
                message: '添加评论失败',
                error: commentError.message 
            });
        }

        res.json({
            success: true,
            message: '评论提交成功，待审核后显示',
            data: {
                id: commentData.id,
                authorName: commentData.author_name,
                authorEmail: commentData.author_email,
                authorWebsite: commentData.author_website,
                content: commentData.content,
                parentId: commentData.parent_id,
                status: commentData.status,
                createdAt: commentData.created_at
            }
        });

    } catch (error) {
        console.error('添加评论错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 获取热门文章
router.get('/trending', generalLimit, [
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('数量必须在1-20之间'),
    query('period').optional().isIn(['day', 'week', 'month']).withMessage('时间周期必须是day、week或month'),
    query('lang').optional().isIn(['zh', 'en']).withMessage('语言参数必须是zh或en')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: '输入参数验证失败',
                errors: errors.array() 
            });
        }

        const limit = parseInt(req.query.limit) || 5;
        const period = req.query.period || 'week';
        const lang = req.query.lang || 'zh';

        // 根据时间周期计算日期范围
        let startDate;
        const now = new Date();
        switch (period) {
            case 'day':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
        }

        // 获取热门文章（基于浏览量）
        const { data, error } = await supabase
            .from('blog_posts')
            .select(`
                *,
                blog_categories!inner(name_zh, name_en, slug, color),
                blog_post_tags!inner(blog_tags!inner(name_zh, name_en, slug, color))
            `)
            .eq('status', 'published')
            .gte('published_at', startDate.toISOString())
            .lte('published_at', now.toISOString())
            .order('view_count', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('获取热门文章失败:', error);
            return res.status(500).json({ 
                success: false, 
                message: '获取热门文章失败',
                error: error.message 
            });
        }

        const trendingPosts = data.map(post => ({
            id: post.id,
            title: lang === 'zh' ? post.title_zh : post.title_en,
            excerpt: lang === 'zh' ? post.excerpt_zh : post.excerpt_en,
            slug: post.slug,
            coverImage: post.cover_image,
            category: {
                name: lang === 'zh' ? post.blog_categories.name_zh : post.blog_categories.name_en,
                slug: post.blog_categories.slug,
                color: post.blog_categories.color
            },
            tags: post.blog_post_tags.map(pt => ({
                name: lang === 'zh' ? pt.blog_tags.name_zh : pt.blog_tags.name_en,
                slug: pt.blog_tags.slug,
                color: pt.blog_tags.color
            })),
            viewCount: post.view_count,
            readingTime: post.reading_time,
            publishedAt: post.published_at
        }));

        res.json({
            success: true,
            data: {
                trendingPosts,
                period,
                generatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('获取热门文章错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

module.exports = router;