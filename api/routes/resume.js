import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import PDFResumeProcessor from '../services/pdfProcessor.js';
import ResumeSyncService from '../services/resumeSync.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/resumes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize PDF processor
const pdfProcessor = new PDFResumeProcessor();
const resumeSyncService = new ResumeSyncService();

/**
 * Upload and process PDF resume
 */
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await pdfProcessor.processPDFFile(
      req.file.path,
      req.file.originalname
    );

    // Clean up uploaded file after processing
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json(result);
    
  } catch (error) {
    console.error('Resume upload error:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to process resume',
      error: error.message
    });
  }
});

/**
 * Get complete resume data
 */
router.get('/data', async (req, res) => {
  try {
    const resumeData = await pdfProcessor.getResumeData();
    
    res.json({
      success: true,
      data: resumeData
    });
    
  } catch (error) {
    console.error('Get resume data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume data',
      error: error.message
    });
  }
});

/**
 * Get specific section of resume data
 */
router.get('/data/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const validSections = [
      'personal_info', 'education', 'work_experience', 'research_experience',
      'skills', 'languages', 'certifications', 'professional_activities',
      'publications', 'patents', 'awards'
    ];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name'
      });
    }
    
    // Use Supabase client directly for specific section
    const { data, error } = await pdfProcessor.supabase
      .from(section)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      data: data || []
    });
    
  } catch (error) {
    console.error(`Get ${req.params.section} data error:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve ${req.params.section} data`,
      error: error.message
    });
  }
});

/**
 * Update specific resume section
 */
router.put('/data/:section/:id', async (req, res) => {
  try {
    const { section, id } = req.params;
    const updateData = req.body;
    
    const validSections = [
      'personal_info', 'education', 'work_experience', 'research_experience',
      'skills', 'languages', 'certifications', 'professional_activities'
    ];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name'
      });
    }
    
    // Special handling for personal_info (single record)
    if (section === 'personal_info') {
      const { data, error } = await pdfProcessor.supabase
        .from(section)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      res.json({
        success: true,
        data: data
      });
    } else {
      const { data, error } = await pdfProcessor.supabase
        .from(section)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      res.json({
        success: true,
        data: data
      });
    }
    
  } catch (error) {
    console.error(`Update ${req.params.section} error:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to update ${req.params.section}`,
      error: error.message
    });
  }
});

/**
 * Add new item to resume section
 */
router.post('/data/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const newData = req.body;
    
    const validSections = [
      'education', 'work_experience', 'research_experience',
      'skills', 'languages', 'certifications', 'professional_activities'
    ];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name or section does not support adding'
      });
    }
    
    const { data, error } = await pdfProcessor.supabase
      .from(section)
      .insert(newData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      data: data,
      message: 'Item added successfully'
    });
    
  } catch (error) {
    console.error(`Add to ${req.params.section} error:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to add item to ${req.params.section}`,
      error: error.message
    });
  }
});

/**
 * Delete item from resume section
 */
router.delete('/data/:section/:id', async (req, res) => {
  try {
    const { section, id } = req.params;
    
    const validSections = [
      'education', 'work_experience', 'research_experience',
      'skills', 'languages', 'certifications', 'professional_activities'
    ];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section name or section does not support deletion'
      });
    }
    
    const { error } = await pdfProcessor.supabase
      .from(section)
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
    
  } catch (error) {
    console.error(`Delete from ${req.params.section} error:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to delete item from ${req.params.section}`,
      error: error.message
    });
  }
});

/**
 * Get PDF upload history
 */
router.get('/uploads', async (req, res) => {
  try {
    const { data, error } = await pdfProcessor.supabase
      .from('pdf_uploads')
      .select('*')
      .order('upload_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      data: data || []
    });
    
  } catch (error) {
    console.error('Get upload history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve upload history',
      error: error.message
    });
  }
});

/**
 * Sync resume data with website frontend
 */
router.post('/sync', async (req, res) => {
  try {
    // Validate resume data first
    const resumeData = await pdfProcessor.getResumeData();
    const validation = resumeSyncService.validateResumeData(resumeData);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Resume data validation failed',
        errors: validation.errors
      });
    }
    
    // Sync data with website
    const syncResult = await resumeSyncService.syncWithWebsite();
    
    if (syncResult.success) {
      res.json({
        success: true,
        message: syncResult.message,
        syncedSections: syncResult.syncedSections,
        data: resumeData
      });
    } else {
      res.status(500).json({
        success: false,
        message: syncResult.message,
        error: syncResult.error
      });
    }
    
  } catch (error) {
    console.error('Sync resume data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync resume data',
      error: error.message
    });
  }
});

/**
 * Validate resume data integrity
 */
router.post('/validate', async (req, res) => {
  try {
    const resumeData = await pdfProcessor.getResumeData();
    const validation = resumeSyncService.validateResumeData(resumeData);
    
    res.json({
      success: true,
      isValid: validation.isValid,
      errors: validation.errors,
      dataQuality: {
        personal_info: resumeData.personal_info ? 100 : 0,
        education: resumeData.education?.length || 0,
        work_experience: resumeData.work_experience?.length || 0,
        research_experience: resumeData.research_experience?.length || 0,
        skills: resumeData.skills?.length || 0,
        languages: resumeData.languages?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Validate resume data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate resume data',
      error: error.message
    });
  }
});

export default router;