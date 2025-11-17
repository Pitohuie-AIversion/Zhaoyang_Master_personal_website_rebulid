import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// 上传限流配置
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 每IP最多5次上传
  message: {
    error: 'Too many upload requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 初始化Supabase客户端
let supabase = null;
try {
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log('✅ Upload Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Upload Supabase client:', error.message);
}

// 配置文件上传（使用内存存储）
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB限制（降低文件大小限制）
    files: 3 // 最多3个文件（减少同时上传数量）
  },
  fileFilter: (req, file, cb) => {
    // 严格限制文件类型 - 仅允许最安全的类型
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型。仅支持 PDF、JPG、PNG 文件。'), false);
    }
  }
});

// 创建上传目录
const ensureUploadDir = async () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// 生成唯一文件名
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '_');
  return `${timestamp}_${randomString}_${name}${ext}`;
};

// 文件上传接口 - 应用限流保护
router.post('/files', uploadRateLimit, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: '没有上传文件'
      });
    }
    
    const { category = 'general', description = '', tags = '' } = req.body;
    const uploadDir = await ensureUploadDir();
    
    const uploadedFiles = [];
    
    for (const file of req.files) {
      const uniqueFilename = generateUniqueFilename(file.originalname);
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // 保存文件到磁盘
      await fs.writeFile(filePath, file.buffer);
      
      // 生成文件URL
      const fileUrl = `/uploads/${uniqueFilename}`;
      
      // 保存文件信息到数据库
      const { data: fileRecord, error } = await supabase
        .from('uploaded_files')
        .insert({
          original_name: file.originalname,
          file_name: uniqueFilename,
          file_path: filePath,
          file_url: fileUrl,
          file_size: file.size,
          file_type: file.mimetype,
          category: category,
          description: description,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          uploaded_by: req.ip || 'anonymous',
          upload_status: 'completed'
        })
        .select()
        .single();
      
      if (error) {
        // 如果数据库保存失败，删除已上传的文件
        await fs.unlink(filePath).catch(console.error);
        throw error;
      }
      
      uploadedFiles.push({
        id: fileRecord.id,
        originalName: file.originalname,
        fileName: uniqueFilename,
        fileUrl: fileUrl,
        fileSize: file.size,
        fileType: file.mimetype,
        uploadedAt: fileRecord.created_at
      });
    }
    
    res.json({
      message: '文件上传成功',
      files: uploadedFiles,
      totalFiles: uploadedFiles.length
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    
    // 清理已上传的文件
    if (req.files) {
      for (const file of req.files) {
        const uploadDir = await ensureUploadDir();
        const uniqueFilename = generateUniqueFilename(file.originalname);
        const filePath = path.join(uploadDir, uniqueFilename);
        await fs.unlink(filePath).catch(console.error);
      }
    }
    
    res.status(500).json({
      error: '文件上传失败',
      details: error.message
    });
  }
});

// 简历上传专用接口
router.post('/resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: '没有上传简历文件'
      });
    }
    
    const { language = 'zh', version = 'current' } = req.body;
    const uploadDir = await ensureUploadDir();
    
    // 检查文件类型
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: '简历必须是PDF格式'
      });
    }
    
    const uniqueFilename = `resume_${language}_${version}_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // 保存文件
    await fs.writeFile(filePath, req.file.buffer);
    
    const fileUrl = `/uploads/${uniqueFilename}`;
    
    // 保存简历信息
    const { data: resumeRecord, error } = await supabase
      .from('resumes')
      .insert({
        language: language,
        version: version,
        original_name: req.file.originalname,
        file_name: uniqueFilename,
        file_path: filePath,
        file_url: fileUrl,
        file_size: req.file.size,
        is_active: version === 'current',
        uploaded_by: req.ip || 'anonymous'
      })
      .select()
      .single();
    
    if (error) {
      await fs.unlink(filePath).catch(console.error);
      throw error;
    }
    
    // 如果是当前版本，将其他同语言版本设为非活跃
    if (version === 'current') {
      await supabase
        .from('resumes')
        .update({ is_active: false })
        .eq('language', language)
        .neq('id', resumeRecord.id);
    }
    
    res.json({
      message: '简历上传成功',
      resume: {
        id: resumeRecord.id,
        language: resumeRecord.language,
        version: resumeRecord.version,
        fileUrl: fileUrl,
        fileSize: req.file.size,
        uploadedAt: resumeRecord.created_at
      }
    });
    
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      error: '简历上传失败',
      details: error.message
    });
  }
});

// 获取文件列表
router.get('/files', async (req, res) => {
  try {
    const { 
      category, 
      page = 1, 
      limit = 20, 
      search = '' 
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = supabase
      .from('uploaded_files')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.or(`original_name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1);
    
    if (error) {
      throw error;
    }
    
    res.json({
      files: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / parseInt(limit))
      },
      filters: { category, search }
    });
    
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      error: '获取文件列表失败',
      details: error.message
    });
  }
});

// 获取简历列表
router.get('/resumes', async (req, res) => {
  try {
    const { language, isActive, page = 1, limit = 10 } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = supabase
      .from('resumes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (language) {
      query = query.eq('language', language);
    }
    
    if (isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }
    
    const { data, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1);
    
    if (error) {
      throw error;
    }
    
    res.json({
      resumes: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / parseInt(limit))
      },
      filters: { language, isActive }
    });
    
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      error: '获取简历列表失败',
      details: error.message
    });
  }
});

// 删除文件
router.delete('/files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 获取文件信息
    const { data: file, error: getError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError) {
      throw getError;
    }
    
    if (!file) {
      return res.status(404).json({
        error: '文件未找到'
      });
    }
    
    // 删除物理文件
    try {
      await fs.unlink(file.file_path);
    } catch (unlinkError) {
      console.error('删除物理文件失败:', unlinkError);
    }
    
    // 删除数据库记录
    const { error: deleteError } = await supabase
      .from('uploaded_files')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    res.json({
      message: '文件删除成功',
      fileId: id
    });
    
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      error: '删除文件失败',
      details: error.message
    });
  }
});

// 删除简历
router.delete('/resumes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 获取简历信息
    const { data: resume, error: getError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError) {
      throw getError;
    }
    
    if (!resume) {
      return res.status(404).json({
        error: '简历未找到'
      });
    }
    
    // 删除物理文件
    try {
      await fs.unlink(resume.file_path);
    } catch (unlinkError) {
      console.error('删除简历文件失败:', unlinkError);
    }
    
    // 删除数据库记录
    const { error: deleteError } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    res.json({
      message: '简历删除成功',
      resumeId: id
    });
    
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      error: '删除简历失败',
      details: error.message
    });
  }
});

// 获取上传统计
router.get('/stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    // 获取文件统计
    const [
      { data: files, error: filesError },
      { data: resumes, error: resumesError },
      { data: recentFiles, error: recentFilesError }
    ] = await Promise.all([
      supabase.from('uploaded_files').select('category, file_size, created_at'),
      supabase.from('resumes').select('language, is_active, created_at'),
      supabase.from('uploaded_files').select('file_size').gte('created_at', cutoffDate.toISOString())
    ]);
    
    if (filesError || resumesError || recentFilesError) {
      throw new Error('Failed to fetch upload statistics');
    }
    
    const stats = {
      totalFiles: files.length,
      totalResumes: resumes.length,
      totalStorage: files.reduce((sum, f) => sum + (f.file_size || 0), 0),
      recentUploads: recentFiles.length,
      recentStorage: recentFiles.reduce((sum, f) => sum + (f.file_size || 0), 0),
      byCategory: {},
      byLanguage: {},
      activeResumes: resumes.filter(r => r.is_active).length
    };
    
    // 按类别统计
    files.forEach(file => {
      stats.byCategory[file.category] = (stats.byCategory[file.category] || 0) + 1;
    });
    
    // 按语言统计简历
    resumes.forEach(resume => {
      stats.byLanguage[resume.language] = (stats.byLanguage[resume.language] || 0) + 1;
    });
    
    res.json({
      stats,
      timeframe: `${days} days`,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({
      error: '获取上传统计失败',
      details: error.message
    });
  }
});

export default router;