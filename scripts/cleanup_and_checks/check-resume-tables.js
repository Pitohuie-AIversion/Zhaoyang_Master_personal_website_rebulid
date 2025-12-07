import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkResumeTables() {
  console.log('Checking resume-related tables...');
  
  const tables = ['resume_info', 'resume_education', 'resume_experience', 'resume_skills', 'resume_data'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table '${table}': Not found or error (${error.code})`);
    } else {
      console.log(`Table '${table}': Exists (Rows: ${data.length})`);
      if (data.length > 0) {
        console.log('Sample keys:', Object.keys(data[0]));
      }
    }
  }
}

checkResumeTables();
