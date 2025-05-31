'use client'

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { User } from '@/types';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
// Session refresh interval (4 minutes)
const SESSION_REFRESH_INTERVAL = 4 * 60 * 1000;

interface CachedUser {
  data: User;
  timestamp: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const getUserFromCache = useCallback((): User | null => {
    try {
      const cached = sessionStorage.getItem('user');
      if (!cached) return null;

      const { data, timestamp }: CachedUser = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        sessionStorage.removeItem('user');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      sessionStorage.removeItem('user');
      return null;
    }
  }, []);

  const setUserWithCache = useCallback((userData: User | null) => {
    try {
      setUser(userData);
      if (userData) {
        const cacheData: CachedUser = {
          data: userData,
          timestamp: Date.now()
        };
        sessionStorage.setItem('user', JSON.stringify(cacheData));
      } else {
        sessionStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error updating cache:', error);
      setUser(userData); // Still update user state even if cache fails
    }
  }, []);

  // Check session and fetch user data in a single operation
  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError.message);
        throw sessionError;
      }

      if (session) {
        // Check if session is about to expire (within 5 minutes)
        const expiresAt = new Date(session.expires_at! * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();

        if (timeUntilExpiry < 5 * 60 * 1000) { // Less than 5 minutes until expiry
          console.log('Session about to expire, refreshing...');
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('Session refresh error:', refreshError.message);
            throw refreshError;
          }
        }

        // Try to get user from cache first
        const cachedUser = getUserFromCache();
        if (cachedUser) {
          setUser(cachedUser);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('User fetch error:', userError.message);
          throw userError;
        }

        if (!userData) {
          console.error('No user data found for session');
          throw new Error('User profile not found');
        }

        setUserWithCache(userData);
      } else {
        setUserWithCache(null);
      }
    } catch (error: any) {
      console.error('Error checking session:', error?.message || 'Unknown error');
      setUserWithCache(null);
      if (error?.message !== 'User profile not found') {
        toast.error('Your session has expired. Please log in again.');
        router.push('/auth');
      }
    } finally {
      setLoading(false);
    }
  }, [supabase, getUserFromCache, setUserWithCache, router]);

  useEffect(() => {
    checkSession();

    // Set up periodic session refresh
    const refreshInterval = setInterval(() => {
      checkSession();
    }, SESSION_REFRESH_INTERVAL);

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (event === 'SIGNED_OUT') {
          setUserWithCache(null);
          router.push('/auth');
        } else {
          // Session was refreshed, update the user data
          await checkSession();
        }
        return;
      }

      if (session) {
        try {
          // Try cache first
          const cachedUser = getUserFromCache();
          if (cachedUser) {
            setUser(cachedUser);
            return;
          }

          // Fetch if not in cache
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Auth state change - User fetch error:', userError.message);
            throw userError;
          }

          if (!userData) {
            console.error('Auth state change - No user data found');
            throw new Error('User profile not found');
          }

          setUserWithCache(userData);
        } catch (error: any) {
          console.error('Auth state change error:', error?.message || 'Unknown error');
          setUserWithCache(null);
          if (error?.message !== 'User profile not found') {
            toast.error('Error updating authentication status');
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [supabase, checkSession, getUserFromCache, setUserWithCache, router]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.refresh();
      toast.success('Logged in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  const signUp = useCallback(async (email: string, password: string, name: string, phone?: string) => {
    try {
      setLoading(true);
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'CUSTOMER',
          },
        },
      });

      if (signUpError) throw signUpError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          email,
          name,
          role: 'CUSTOMER',
          phone,
          is_active: true,
        });

      if (profileError) throw profileError;

      router.refresh();
      toast.success('Account created successfully. Please check your email to verify your account.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUserWithCache(null);
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, [supabase, router, setUserWithCache]);

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
} 