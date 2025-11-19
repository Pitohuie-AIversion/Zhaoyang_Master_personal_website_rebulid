const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// 安全配置
router.use(helmet());

// Supabase客户端
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// 速率限制
const performanceLimit = rateLimit({
    windowMs: 60 * 1000, // 1分钟
    max: 50, // 限制每个IP 50次性能数据提交
    message: '性能数据提交过于频繁，请稍后再试'
});

// 获取用户标识符
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

// 记录性能指标
router.post('/metrics', performanceLimit, [
    body('pagePath').isString().isLength({ max: 500 }).withMessage('页面路径格式不正确'),
    body('pageTitle').optional().isString().isLength({ max: 200 }).withMessage('页面标题格式不正确'),
    body('userSession').optional().isString().isLength({ max: 100 }).withMessage('用户会话格式不正确'),
    
    // Core Web Vitals
    body('lcpValue').optional().isFloat({ min: 0, max: 60000 }).withMessage('LCP值必须在0-60000之间'),
    body('fcpValue').optional().isFloat({ min: 0, max: 60000 }).withMessage('FCP值必须在0-60000之间'),
    body('fidValue').optional().isFloat({ min: 0, max: 10000 }).withMessage('FID值必须在0-10000之间'),
    body('clsValue').optional().isFloat({ min: 0, max: 1 }).withMessage('CLS值必须在0-1之间'),
    body('ttfbValue').optional().isFloat({ min: 0, max: 60000 }).withMessage('TTFB值必须在0-60000之间'),
    
    body('fcpScore').optional().isInt({ min: 0, max: 100 }).withMessage('FCP评分必须在0-100之间'),
    body('lcpScore').optional().isInt({ min: 0, max: 100 }).withMessage('LCP评分必须在0-100之间'),
    body('fidScore').optional().isInt({ min: 0, max: 100 }).withMessage('FID评分必须在0-100之间'),
    body('clsScore').optional().isInt({ min: 0, max: 100 }).withMessage('CLS评分必须在0-100之间'),
    body('ttfbScore').optional().isInt({ min: 0, max: 100 }).withMessage('TTFB评分必须在0-100之间'),
    
    // 设备和网络信息
    body('deviceType').optional().isIn(['desktop', 'mobile', 'tablet']).withMessage('设备类型不正确'),
    body('browserName').optional().isString().isLength({ max: 50 }).withMessage('浏览器名称格式不正确'),
    body('browserVersion').optional().isString().isLength({ max: 50 }).withMessage('浏览器版本格式不正确'),
    body('osName').optional().isString().isLength({ max: 50 }).withMessage('操作系统名称格式不正确'),
    body('osVersion').optional().isString().isLength({ max: 50 }).withMessage('操作系统版本格式不正确'),
    body('networkType').optional().isIn(['4g', '3g', '2g', 'wifi', 'ethernet']).withMessage('网络类型不正确')
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

        const {
            pagePath,
            pageTitle,
            userSession,
            lcpValue,
            fcpValue,
            fidValue,
            clsValue,
            ttfbValue,
            fcpScore,
            lcpScore,
            fidScore,
            clsScore,
            ttfbScore,
            deviceType,
            browserName,
            browserVersion,
            osName,
            osVersion,
            networkType
        } = req.body;

        const userIdentifier = getUserIdentifier(req);
        const sessionId = userSession || getUserSession(req);

        // 计算性能等级
        const performanceGrade = calculatePerformanceGrade(fcpScore, lcpScore, fidScore, clsScore, ttfbScore);

        // 插入性能指标
        const { data: metricData, error: metricError } = await supabase
            .from('performance_metrics')
            .insert({
                page_path: pagePath,
                page_title: pageTitle,
                user_session: sessionId,
                user_identifier: userIdentifier,
                lcp_value: lcpValue,
                fcp_value: fcpValue,
                fid_value: fidValue,
                cls_value: clsValue,
                ttfb_value: ttfbValue,
                fcp_score: fcpScore,
                lcp_score: lcpScore,
                fid_score: fidScore,
                cls_score: clsScore,
                ttfb_score: ttfbScore,
                device_type: deviceType,
                browser_name: browserName,
                browser_version: browserVersion,
                os_name: osName,
                os_version: osVersion,
                network_type: networkType,
                performance_grade: performanceGrade
            })
            .select()
            .single();

        if (metricError) {
            console.error('记录性能指标失败:', metricError);
            return res.status(500).json({ 
                success: false, 
                message: '记录性能指标失败',
                error: metricError.message 
            });
        }

        // 记录用户交互
        await supabase.from('user_interactions').insert({
            user_identifier: userIdentifier,
            user_session: sessionId,
            interaction_type: 'performance_metric',
            page_path: pagePath,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            device_type: deviceType,
            browser: browserName,
            os: osName
        });

        res.json({
            success: true,
            message: '性能指标记录成功',
            data: {
                metricId: metricData.id,
                performanceGrade: performanceGrade
            }
        });

    } catch (error) {
        console.error('记录性能指标错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 记录页面加载详情
router.post('/page-load-details', performanceLimit, [
    body('metricId').isUUID().withMessage('性能指标ID格式不正确'),
    body('navigationStart').optional().isFloat({ min: 0 }).withMessage('navigationStart必须是非负数'),
    body('unloadEventStart').optional().isFloat({ min: 0 }).withMessage('unloadEventStart必须是非负数'),
    body('unloadEventEnd').optional().isFloat({ min: 0 }).withMessage('unloadEventEnd必须是非负数'),
    body('redirectStart').optional().isFloat({ min: 0 }).withMessage('redirectStart必须是非负数'),
    body('redirectEnd').optional().isFloat({ min: 0 }).withMessage('redirectEnd必须是非负数'),
    body('fetchStart').optional().isFloat({ min: 0 }).withMessage('fetchStart必须是非负数'),
    body('domainLookupStart').optional().isFloat({ min: 0 }).withMessage('domainLookupStart必须是非负数'),
    body('domainLookupEnd').optional().isFloat({ min: 0 }).withMessage('domainLookupEnd必须是非负数'),
    body('connectStart').optional().isFloat({ min: 0 }).withMessage('connectStart必须是非负数'),
    body('connectEnd').optional().isFloat({ min: 0 }).withMessage('connectEnd必须是非负数'),
    body('secureConnectionStart').optional().isFloat({ min: 0 }).withMessage('secureConnectionStart必须是非负数'),
    body('requestStart').optional().isFloat({ min: 0 }).withMessage('requestStart必须是非负数'),
    body('responseStart').optional().isFloat({ min: 0 }).withMessage('responseStart必须是非负数'),
    body('responseEnd').optional().isFloat({ min: 0 }).withMessage('responseEnd必须是非负数'),
    body('domLoading').optional().isFloat({ min: 0 }).withMessage('domLoading必须是非负数'),
    body('domInteractive').optional().isFloat({ min: 0 }).withMessage('domInteractive必须是非负数'),
    body('domContentLoadedEventStart').optional().isFloat({ min: 0 }).withMessage('domContentLoadedEventStart必须是非负数'),
    body('domContentLoadedEventEnd').optional().isFloat({ min: 0 }).withMessage('domContentLoadedEventEnd必须是非负数'),
    body('domComplete').optional().isFloat({ min: 0 }).withMessage('domComplete必须是非负数'),
    body('loadEventStart').optional().isFloat({ min: 0 }).withMessage('loadEventStart必须是非负数'),
    body('loadEventEnd').optional().isFloat({ min: 0 }).withMessage('loadEventEnd必须是非负数')
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

        const {
            metricId,
            navigationStart,
            unloadEventStart,
            unloadEventEnd,
            redirectStart,
            redirectEnd,
            fetchStart,
            domainLookupStart,
            domainLookupEnd,
            connectStart,
            connectEnd,
            secureConnectionStart,
            requestStart,
            responseStart,
            responseEnd,
            domLoading,
            domInteractive,
            domContentLoadedEventStart,
            domContentLoadedEventEnd,
            domComplete,
            loadEventStart,
            loadEventEnd
        } = req.body;

        // 插入页面加载详情
        const { data: detailData, error: detailError } = await supabase
            .from('page_load_details')
            .insert({
                performance_metric_id: metricId,
                navigation_start: navigationStart,
                unload_event_start: unloadEventStart,
                unload_event_end: unloadEventEnd,
                redirect_start: redirectStart,
                redirect_end: redirectEnd,
                fetch_start: fetchStart,
                domain_lookup_start: domainLookupStart,
                domain_lookup_end: domainLookupEnd,
                connect_start: connectStart,
                connect_end: connectEnd,
                secure_connection_start: secureConnectionStart,
                request_start: requestStart,
                response_start: responseStart,
                response_end: responseEnd,
                dom_loading: domLoading,
                dom_interactive: domInteractive,
                dom_content_loaded_event_start: domContentLoadedEventStart,
                dom_content_loaded_event_end: domContentLoadedEventEnd,
                dom_complete: domComplete,
                load_event_start: loadEventStart,
                load_event_end: loadEventEnd
            })
            .select()
            .single();

        if (detailError) {
            console.error('记录页面加载详情失败:', detailError);
            return res.status(500).json({ 
                success: false, 
                message: '记录页面加载详情失败',
                error: detailError.message 
            });
        }

        res.json({
            success: true,
            message: '页面加载详情记录成功',
            data: { detailId: detailData.id }
        });

    } catch (error) {
        console.error('记录页面加载详情错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '服务器内部错误',
            error: error.message 
        });
    }
});

// 记录资源性能
router.post('/resource-performance', performanceLimit, [
    body('metricId').isUUID().withMessage('性能指标ID格式不正确'),
    body('resources').isArray().withMessage('资源数据必须是数组'),
    body('resources.*.name').isString().isLength({ max: 200 }).withMessage('资源名称格式不正确'),
    body('resources.*.type').isIn(['script', 'stylesheet', 'image', 'font', 'xhr', 'document']).withMessage('资源类型不正确'),
    body('resources.*.url').isURL().withMessage('资源URL格式不正确'),
    body('resources.*.startTime').optional().isFloat({ min: 0 }).withMessage('开始时间必须是非负数'),
    body('resources.*.duration').optional().isFloat({ min: 0 }).withMessage('持续时间必须是非负数')
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

        const { metricId, resources } = req.body;
        const userIdentifier = getUserIdentifier(req);
        const userSession = getUserSession(req);

        // 批量插入资源性能数据
        const resourceData = resources.map(resource => ({
            performance_metric_id: metricId,
            resource_name: resource.name,
            resource_type: resource.type,
            resource_url: resource.url,
            start_time: resource.startTime,
            duration: resource.duration,
            transfer_size: resource.transferSize,
            encoded_body_size: resource.encodedBodySize,
            decoded_body_size: resource.decodedBodySize,
            cache_hit: resource.cacheHit,
            from_cache: resource.fromCache,
            status_code: resource.statusCode,
            has_error: resource.hasError
        }));

        const { data, error } = await supabase
            .from('resource_performance')
            .insert(resourceData)
            .select();

        if (error) {
            console.error('记录资源性能失败:', error);
            return res.status(500).json({ 
                success: false, 
                message: '记录资源性能失败',
                error: error.message 
            });
        }

        // 记录用户交互
        await supabase.from('user_interactions').insert({
            user_identifier: userIdentifier,
            user_session: userSession,
            interaction_type: 'resource_performance',
            page_path: req.get('Referer') || req.get('Origin'),
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
        });

        res.json({
            success: true,
            message: '资源性能记录成功',
            data: { 
                recordedCount: data.length,
                resourceIds