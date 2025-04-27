import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This route is called by Supabase Auth after email confirmation
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);
      // Redirect to login page on success
      return NextResponse.redirect(new URL('/auth/login', request.url));
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      // Redirect to error page on failure
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }
  }
  
  // Redirect to home page if no code
  return NextResponse.redirect(new URL('/', request.url));
} 