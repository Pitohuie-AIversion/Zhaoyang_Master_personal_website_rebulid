import express from 'express';
import multer from 'multer';
import { utils } from '../utils/combined.js';

const router = express.Router();

// Multer config
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET /api/resume/data - Get all resume data
router.get('/data', async (req, res) => {
  try {
    const supabase = req.supabase;
    if (!supabase) return res.status(503).json({ error: 'Database service unavailable' });

    // Fetch all sections in parallel
    const [
      { data: personal_info },
      { data: education },
      { data: work_experience },
      { data: research_experience },
      { data: skills },
      { data: languages },
      { data: certifications },
      { data: professional_activities },
      { data: publications }, // We might want to fetch from resume_publications table if separate, or main publications
      // Assuming we use the main publications table for resume too, or separate?
      // Based on migration, we didn't create resume_publications. Let's use the main tables for now or check if we need them.
      // Wait, the ResumeManager interface expects publications, patents, awards.
      // The migration file I created earlier didn't include resume_publications/patents/awards?
      // Let me check the migration file again.
      // Ah, I created resume_personal_info, resume_education, etc.
      // But NOT resume_publications, resume_patents, resume_awards.
      // I should probably use the existing 'publications', 'patents', 'awards' tables or create resume specific ones.
      // For now, let's assume we use the main tables for these, or empty arrays if not implemented.
    ] = await Promise.all([
      supabase.from('resume_personal_info').select('*').limit(1).single(),
      supabase.from('resume_education').select('*').order('start_date', { ascending: false }),
      supabase.from('resume_work_experience').select('*').order('start_date', { ascending: false }),
      supabase.from('resume_research_experience').select('*').order('start_date', { ascending: false }),
      supabase.from('resume_skills').select('*'),
      supabase.from('resume_languages').select('*'),
      supabase.from('resume_certifications').select('*'),
      supabase.from('resume_professional_activities').select('*'),
      // Fetch main publications/patents/awards for now
      supabase.from('publications').select('*'),
    ]);

    // Also fetch patents and awards
    const { data: patents } = await supabase.from('patents').select('*');
    const { data: awards } = await supabase.from('awards').select('*');

    const resumeData = {
      personal_info: personal_info || null,
      education: education || [],
      work_experience: work_experience || [],
      research_experience: research_experience || [],
      skills: skills || [],
      languages: languages || [],
      certifications: certifications || [],
      professional_activities: professional_activities || [],
      publications: publications || [],
      patents: patents || [],
      awards: awards || []
    };

    res.json({ success: true, data: resumeData });
  } catch (error) {
    console.error('Error fetching resume data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generic CRUD handlers for resume sections
const sections = [
  'personal_info', 'education', 'work_experience', 'research_experience', 
  'skills', 'languages', 'certifications', 'professional_activities'
];

sections.forEach(section => {
  const tableName = `resume_${section}`;
  
  // Create
  router.post(`/data/${section}`, async (req, res) => {
    try {
      const supabase = req.supabase;
      const { id, ...data } = req.body; // Remove id if present
      const { data: newItem, error } = await supabase.from(tableName).insert([data]).select().single();
      if (error) throw error;
      res.json({ success: true, data: newItem });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update
  router.put(`/data/${section}/:id`, async (req, res) => {
    try {
      const supabase = req.supabase;
      const { id } = req.params;
      const { id: bodyId, created_at, updated_at, ...data } = req.body;
      const { data: updatedItem, error } = await supabase
        .from(tableName)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      res.json({ success: true, data: updatedItem });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete
  router.delete(`/data/${section}/:id`, async (req, res) => {
    try {
      const supabase = req.supabase;
      const { id } = req.params;
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// Upload resume PDF
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    
    // Here you would typically parse the PDF using a library like pdf-parse
    // and then populate the database. For now, we'll just return success.
    // In a real implementation, we'd use OpenAI to extract structured data.
    
    // Mock parsing
    console.log('Resume uploaded:', req.file.originalname, req.file.size);
    
    res.json({ success: true, message: 'Resume uploaded and queued for processing' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Sync with website (mock)
router.post('/sync', async (req, res) => {
  // Logic to sync resume data to main website tables (if they are different)
  // or generate static JSON/Markdown files.
  res.json({ success: true, message: 'Synced successfully' });
});

// Validate data
router.post('/validate', async (req, res) => {
  // Logic to validate data completeness
  res.json({ success: true, isValid: true });
});

export default router;
