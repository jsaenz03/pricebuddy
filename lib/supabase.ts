import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Environment variables - these should be set in your environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-project-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Database helpers for user profiles
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const createUserProfile = async (profile: {
  user_id: string
  full_name?: string
  subscription_tier?: 'free' | 'pro' | 'enterprise'
}) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{
      ...profile,
      subscription_tier: profile.subscription_tier || 'free',
      subscription_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: {
  full_name?: string
  avatar_url?: string
  subscription_tier?: 'free' | 'pro' | 'enterprise'
  subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
}) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single()
  
  return { data, error }
}