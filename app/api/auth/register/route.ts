import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name, phone } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'CUSTOMER',
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Error creating user' },
        { status: 500 }
      );
    }

    // Create user profile in public.users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: 'CUSTOMER',
        phone,
        is_active: true,
      });

    if (profileError) {
      // If profile creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Error creating user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: {
        id: authData.user.id,
        email,
        name,
        role: 'CUSTOMER',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 