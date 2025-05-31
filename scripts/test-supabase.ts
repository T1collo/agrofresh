import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Log environment variables (without the key for security)
console.log('Checking environment variables...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not Set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('\nTesting Supabase connection...');
    
    // Try to get the current user (should be null if not authenticated)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!authError) {
      console.log('✅ Auth check successful');
      console.log('Current user:', user ? 'Logged in' : 'Not logged in');
    } else {
      console.log('❌ Auth error:', authError.message);
    }

    // Try to list all tables (this is a system table that should always exist)
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('schemaname,tablename')
      .limit(5);
    
    if (!tablesError) {
      console.log('✅ Database query successful');
      console.log('Available tables:', tables);
    } else {
      console.log('❌ Database query error:', tablesError.message);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error instanceof Error ? error.message : error);
  }
}

// Run the test
console.log('Starting connection test...\n');
testSupabaseConnection(); 