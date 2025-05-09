'use client';

import { supabase } from '@/lib/supabase';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface UserData {
  id: string;
  email: string;
  username: string;
}

class AuthService {
  async login({ email, password }: LoginRequest): Promise<boolean> {
    try {
      // Check if we're in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Using mock authentication');
        
        // Mock login for development
        // Only allow test@example.com with password "password" for testing
        if (email === 'test@example.com' && password === 'password') {
          const userData: UserData = {
            id: 'mock-user-id',
            email: email,
            username: email.split('@')[0],
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          return true;
        }
        
        // Any other credentials fail in development mode
        return false;
      }
      
      // Normal Supabase login for production
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      // Store user profile if available
      if (data?.user) {
        // Get profile data from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError.message);
        }

        // Save user data to localStorage
        const userData: UserData = {
          id: data.user.id,
          email: data.user.email || '',
          username: profileData?.username || email.split('@')[0],
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async register({ email, password, username }: RegisterRequest): Promise<boolean> {
    try {
      // Check if we're in development mode without proper Supabase setup
      if (process.env.NODE_ENV === 'development' && 
          (process.env.NEXT_PUBLIC_SUPABASE_URL === 'YOUR_SUPABASE_URL' || 
           !process.env.NEXT_PUBLIC_SUPABASE_URL)) {
        
        console.log('Development mode: Using mock registration');
        
        // Mock successful registration for development
        const userData: UserData = {
          id: 'mock-user-id',
          email: email,
          username: username,
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }

      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          // Skip email confirmation
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        console.error('Registration error:', error.message);
        return false;
      }

      // Auto-sign in after registration
      if (data?.user) {
        console.log("Registration successful, user ID:", data.user.id);
        
        // Save user data to localStorage
        const userData: UserData = {
          id: data.user.id,
          email: data.user.email || '',
          username: username,
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Create profile immediately
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              username: username,
              email: email,
              created_at: new Date().toISOString(),
            });
            
          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        } catch (profileError) {
          console.error("Error with profile setup:", profileError);
          // Continue anyway - registration was still successful
        }
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  logout(): void {
    try {
      if (process.env.NODE_ENV !== 'development' || 
          (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
           process.env.NEXT_PUBLIC_SUPABASE_URL)) {
        // Only attempt to sign out if we have a proper Supabase setup
        supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
    }
  }

  getCurrentUser(): UserData | null {
    if (typeof window === 'undefined') return null;
    
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    // In development with mock auth, check localStorage directly
    if (process.env.NODE_ENV === 'development' && 
        (process.env.NEXT_PUBLIC_SUPABASE_URL === 'YOUR_SUPABASE_URL' || 
         !process.env.NEXT_PUBLIC_SUPABASE_URL)) {
      return !!this.getCurrentUser();
    }
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        return false;
      }
      
      return !!data.session;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }
}

export default new AuthService(); 