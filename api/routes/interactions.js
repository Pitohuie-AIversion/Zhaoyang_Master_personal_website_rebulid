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

const interactionLimit = rateLimit({
    windowMs: 60 * 1000, // 1分钟
    max: 30, // 限制每个IP 30次交互
    message: '交互过于频繁，请稍后再试'
});

// 获取用户标识符（基于IP和User-Agent生成）
function getUserIdentifier(req) {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'unknown';
    const sessionId = req.get('X-Session-ID') || `${ip}-${userAgent.substring(0, 50)}`;
    return Buffer.from(sessionId).toString('base64').substring(0, 32);
}

// 获取用户会话ID
function getUserSession(req) {
    return req.get('X-Session-ID') || getUserIdentifier(req);
}

// 点赞功能
router.post('/like', interactionLimit, [
    body('entityType').isIn(['blog_post', 'project', 'publication', 'patent']).withMessage('实体类型不正确'),
    body('entityId').isUUID().withMessage('实体ID格式不正确')
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

        const { entityType, entityId } = req.body;
        const userIdentifier = getUserIdentifier(req);
        const userSession = getUserSession(req);

        // 检查是否已经点赞
        const { data: existingLike } = await supabase
            .from('entity_likes')
            .select('id')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .eq('user_identifier', userIdentifier)
            .single();

        if (existingLike) {
            // 取消点赞
            const { error: deleteError } = await supabase
                .from('entity_likes')
                .delete()
                .eq('id', existingLike.id);

            if (deleteError) {
                console.error('取消点赞失败:', deleteError);
                return res.status(500).json({ 
                    success: false, 
                    message: '取消点赞失败',
                    error: deleteError.message 
                });
            }

            // 记录用户交互
            await supabase.from('user_interactions').insert({
                user_identifier: userIdentifier,
                user_session: userSession,
                interaction_type: 'unlike',
                entity_type: entityType,
                entity_id: entityId,
                page_path: req.get('Referer') || req.get('Origin'),
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                device_type: req.get('X-Device-Type'),
                browser: req.get('X-Browser-Name'),
                os: req.get('X-OS-Name')
            });

            return res.json({
                success: true,
                message: '已取消点赞',
                data: { liked: false }
            });
        } else {
            // 添加点赞
            const { error: insertError } = await supabase
                .from('entity_likes')
                .insert({
                    entity_type: entityType,
                    entity_id: entityId,
                    user_identifier: userIdentifier,
                    user_session: userSession,
                    ip_address: req.ip,
                    user_agent: req.get('User-Agent')
                });

            if (insertError) {
                console.error('点赞失败:', insertError);
                return res.status(500).json({ 
                    success: false, 
                    message: '点赞失败',
                    error: insertError.message 
                });
            }

            // 记录用户交互
            await supabase.from('user_interactions').insert({
                user_identifier: userIdentifier,
                user_session: userSession,
                interaction_type: 'like',
                entity_type: entityType,
                entity_id: entityId,
                page_path: req.get('Referer') || req.get('Origin'),
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                device_type: req.get('X-Device-Type'),
                browser: req.get('X-Browser-Name'),
                os: req.get('X-OS-Name')
            });

            return res.json({
                success: true,
                message: '点赞成功',
                data: { liked: true }
            });
        }

    } catch (error) {
        console.error('点赞功能错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 收藏功能
router.post('/bookmark', interactionLimit, [
    body('entityType').isIn(['blog_post', 'project', 'publication', 'patent']).withMessage('实体类型不正确'),
    body('entityId').isUUID().withMessage('实体ID格式不正确'),
    body('title').optional().isString().withMessage('标题格式不正确'),
    body('notes').optional().isString().withMessage('备注格式不正确')
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

        const { entityType, entityId, title, notes } = req.body;
        const userIdentifier = getUserIdentifier(req);
        const userSession = getUserSession(req);

        // 检查是否已经收藏
        const { data: existingBookmark } = await supabase
            .from('entity_bookmarks')
            .select('id')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .eq('user_identifier', userIdentifier)
            .single();

        if (existingBookmark) {
            // 取消收藏
            const { error: deleteError } = await supabase
                .from('entity_bookmarks')
                .delete()
                .eq('id', existingBookmark.id);

            if (deleteError) {
                console.error('取消收藏失败:', deleteError);
                return res.status(500).json({ 
                    success: false, 
                    message: '取消收藏失败',
                    error: deleteError.message 
                });
            }

            // 记录用户交互
            await supabase.from('user_interactions').insert({
                user_identifier: userIdentifier,
                user_session: userSession,
                interaction_type: 'unbookmark',
                entity_type: entityType,
                entity_id: entityId,
                page_path: req.get('Referer') || req.get('Origin'),
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                device_type: req.get('X-Device-Type'),
                browser: req.get('X-Browser-Name'),
                os: req.get('X-OS-Name')
            });

            return res.json({
                success: true,
                message: '已取消收藏',
                data: { bookmarked: false }
            });
        } else {
            // 添加收藏
            const { error: insertError } = await supabase
                .from('entity_bookmarks')
                .insert({
                    entity_type: entityType,
                    entity_id: entityId,
                    user_identifier: userIdentifier,
                    user_session: userSession,
                    title: title || null,
                    notes: notes || null
                });

            if (insertError) {
                console.error('收藏失败:', insertError);
                return res.status(500).json({ 
                    success: false, 
                    message: '收藏失败',
                    error: insertError.message 
                });
            }

            // 记录用户交互
            await supabase.from('user_interactions').insert({
                user_identifier: userIdentifier,
                user_session: userSession,
                interaction_type: 'bookmark',
                entity_type: entityType,
                entity_id: entityId,
                page_path: req.get('Referer') || req.get('Origin'),
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                device_type: req.get('X-Device-Type'),
                browser: req.get('X-Browser-Name'),
                os: req.get('X-OS-Name')
            });

            return res.json({
                success: true,
                message: '收藏成功',
                data: { bookmarked: true }
            });
        }

    } catch (error) {
        console.error('收藏功能错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 分享功能
router.post('/share', interactionLimit, [
    body('entityType').isIn(['blog_post', 'project', 'publication', 'patent']).withMessage('实体类型不正确'),
    body('entityId').isUUID().withMessage('实体ID格式不正确'),
    body('platform').isIn(['weibo', 'wechat', 'twitter', 'facebook', 'linkedin', 'copy_link']).withMessage('分享平台不正确'),
    body('shareUrl').isURL().withMessage('分享URL格式不正确')
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

        const { entityType, entityId, platform, shareUrl } = req.body;
        const userIdentifier = getUserIdentifier(req);
        const userSession = getUserSession(req);

        // 记录分享行为
        const { error: insertError } = await supabase
            .from('entity_shares')
            .insert({
                entity_type: entityType,
                entity_id: entityId,
                share_platform: platform,
                share_url: shareUrl,
                user_identifier: userIdentifier,
                user_session: userSession,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                referrer: req.get('Referer') || req.get('Origin')
            });

        if (insertError) {
            console.error('记录分享失败:', insertError);
            return res.status(500).json({ 
                success: false, 
                message: '记录分享失败',
                error: insertError.message 
            });
        }

        // 记录用户交互
        await supabase.from('user_interactions').insert({
            user_identifier: userIdentifier,
            user_session: userSession,
            interaction_type: 'share',
            entity_type: entityType,
            entity_id: entityId,
            page_path: req.get('Referer') || req.get('Origin'),
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            device_type: req.get('X-Device-Type'),
            browser: req.get('X-Browser-Name'),
            os: req.get('X-OS-Name')
        });

        res.json({
            success: true,
            message: '分享记录成功',
            data: { shared: true }
        });

    } catch (error) {
        console.error('分享功能错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 评分功能
router.post('/rate', interactionLimit, [
    body('entityType').isIn(['blog_post', 'project', 'publication', 'patent']).withMessage('实体类型不正确'),
    body('entityId').isUUID().withMessage('实体ID格式不正确'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('评分必须在1-5之间'),
    body('reviewTitle').optional().isString().isLength({ max: 100 }).withMessage('评论标题长度不能超过100字符'),
    body('reviewContent').optional().isString().isLength({ max: 1000 }).withMessage('评论内容长度不能超过1000字符'),
    body('wouldRecommend').optional().isBoolean().withMessage('推荐标识必须是布尔值')
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

        const { entityType, entityId, rating, reviewTitle, reviewContent, wouldRecommend } = req.body;
        const userIdentifier = getUserIdentifier(req);
        const userSession = getUserSession(req);

        // 检查是否已经评分
        const { data: existingRating } = await supabase
            .from('entity_ratings')
            .select('id')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .eq('user_identifier', userIdentifier)
            .single();

        if (existingRating) {
            // 更新评分
            const { error: updateError } = await supabase
                .from('entity_ratings')
                .update({
                    rating: rating,
                    review_title: reviewTitle || null,
                    review_content: reviewContent || null,
                    would_recommend: wouldRecommend !== undefined ? wouldRecommend : null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingRating.id);

            if (updateError) {
                console.error('更新评分失败:', updateError);
                return res.status(500).json({ 
                    success: false, 
                    message: '更新评分失败',
                    error: updateError.message 
                });
            }

            // 记录用户交互
            await supabase.from('user_interactions').insert({
                user_identifier: userIdentifier,
                user_session: userSession,
                interaction_type: 'update_rating',
                entity_type: entityType,
                entity_id: entityId,
                page_path: req.get('Referer') || req.get('Origin'),
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                device_type: req.get('X-Device-Type'),
                browser: req.get('X-Browser-Name'),
                os: req.get('X-OS-Name')
            });

            return res.json({
                success: true,
                message: '评分更新成功',
                data: { rated: true, updated: true }
            });
        } else {
            // 添加评分
            const { error: insertError } = await supabase
                .from('entity_ratings')
                .insert({
                    entity_type: entityType,
                    entity_id: entityId,
                    rating: rating,
                    user_identifier: userIdentifier,
                    user_session: userSession,
                    ip_address: req.ip,
                    user_agent: req.get('User-Agent'),
                    review_title: reviewTitle || null,
                    review_content: reviewContent || null,
                    would_recommend: wouldRecommend !== undefined ? wouldRecommend : null
                });

            if (insertError) {
                console.error('评分失败:', insertError);
                return res.status(500).json({ 
                    success: false, 
                    message: '评分失败',
                    error: insertError.message 
                });
            }

            // 记录用户交互
            await supabase.from('user_interactions').insert({
                user_identifier: userIdentifier,
                user_session: userSession,
                interaction_type: 'rate',
                entity_type: entityType,
                entity_id: entityId,
                page_path: req.get('Referer') || req.get('Origin'),
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                device_type: req.get('X-Device-Type'),
                browser: req.get('X-Browser-Name'),
                os: req.get('X-OS-Name')
            });

            return res.json({
                success: true,
                message: '评分成功',
                data: { rated: true, updated: false }
            });
        }

    } catch (error) {
        console.error('评分功能错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 获取实体统计信息
router.get('/stats/:entityType/:entityId', generalLimit, [
    param('entityType').isIn(['blog_post', 'project', 'publication', 'patent']).withMessage('实体类型不正确'),
    param('entityId').isUUID().withMessage('实体ID格式不正确')
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

        const { entityType, entityId } = req.params;
        const userIdentifier = getUserIdentifier(req);

        // 获取统计信息
        const { data: analyticsData, error: analyticsError } = await supabase
            .from('entity_analytics')
            .select('*')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .single();

        if (analyticsError && analyticsError.code !== 'PGRST116') {
            console.error('获取统计信息失败:', analyticsError);
            return res.status(500).json({ 
                success: false, 
                message: '获取统计信息失败',
                error: analyticsError.message 
            });
        }

        // 获取用户交互状态
        const [likeStatus, bookmarkStatus, ratingStatus] = await Promise.all([
            supabase
                .from('entity_likes')
                .select('id')
                .eq('entity_type', entityType)
                .eq('entity_id', entityId)
                .eq('user_identifier', userIdentifier)
                .single(),
            supabase
                .from('entity_bookmarks')
                .select('id')
                .eq('entity_type', entityType)
                .eq('entity_id', entityId)
                .eq('user_identifier', userIdentifier)
                .single(),
            supabase
                .from('entity_ratings')
                .select('rating, review_title, review_content, would_recommend')
                .eq('entity_type', entityType)
                .eq('entity_id', entityId)
                .eq('user_identifier', userIdentifier)
                .single()
        ]);

        const stats = {
            likes: analyticsData?.like_count || 0,
            bookmarks: analyticsData?.bookmark_count || 0,
            shares: analyticsData?.share_count || 0,
            ratings: {
                count: analyticsData?.rating_count || 0,
                average: analyticsData?.rating_average || 0
            },
            views: analyticsData?.view_count || 0,
            userInteractions: {
                liked: !!likeStatus.data,
                bookmarked: !!bookmarkStatus.data,
                rated: ratingStatus.data ? {
                    rating: ratingStatus.data.rating,
                    reviewTitle: ratingStatus.data.review_title,
                    reviewContent: ratingStatus.data.review_content,
                    wouldRecommend: ratingStatus.data.would_recommend
                } : null
            }
        };

        res.json({
            success: true,
            data: { stats }
        });

    } catch (error) {
        console.error('获取统计信息错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 获取用户收藏列表
router.get('/bookmarks', generalLimit, [
    query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
    query('entityType').optional().isIn(['blog_post', 'project', 'publication', 'patent']).withMessage('实体类型不正确')
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

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const entityType = req.query.entityType;
        const userIdentifier = getUserIdentifier(req);

        let query = supabase
            .from('entity_bookmarks')
            .select('*', { count: 'exact' })
            .eq('user_identifier', userIdentifier)
            .order('created_at', { ascending: false });

        if (entityType) {
            query = query.eq('entity_type', entityType);
        }

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('获取收藏列表失败:', error);
            return res.status(500).json({ 
                success: false, 
                message: '获取收藏列表失败',
                error: error.message 
            });
        }

        const bookmarks = data.map(bookmark => ({
            id: bookmark.id,
            entityType: bookmark.entity_type,
            entityId: bookmark.entity_id,
            title: bookmark.title,
            notes: bookmark.notes,
            createdAt: bookmark.created_at,
            updatedAt: bookmark.updated_at
        }));

        res.json({
            success: true,
            data: {
                bookmarks,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('获取收藏列表错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

module.exports = router;