import { supabase } from '../lib/supabase';

async function testConnection() {
  try {
    // Test auth connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('Auth connection test:', authError ? 'Failed' : 'Success');
    if (authError) console.error('Auth error:', authError);

    // Test database connection
    const { data: dbData, error: dbError } = await supabase
      .from('User')
      .select('count')
      .limit(1);
    
    console.log('Database connection test:', dbError ? 'Failed' : 'Success');
    if (dbError) console.error('Database error:', dbError);

  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection(); 