import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not Set',
    directUrl: process.env.DIRECT_URL ? 'Set' : 'Not Set',
  });
} 