'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getUserProfile, createUserProfile, updateUserProfile } from '@/lib/supabase'
import { 
  AuthContextType, 
  AuthState, 
  User, 
  UserProfile, 
  SubscriptionTier, 
  SubscriptionLimits,
  SUBSCRIPTION_LIMITS 
} from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null
  })
  
  const router = useRouter()

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user as User)
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null
          })
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setAuthState(prev => ({ ...prev, session, user: session.user as User }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
        return
      }

      if (session?.user) {
        await loadUserProfile(session.user as User)
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }))
    }
  }

  const loadUserProfile = async (user: User) => {
    try {
      setAuthState(prev => ({ ...prev, user, loading: true }))
      
      const { data: profile, error } = await getUserProfile(user.id)
      
      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error loading user profile:', error)
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return
      }

      // Create profile if it doesn't exist
      if (!profile) {
        const newProfile = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || '',
          subscription_tier: 'free' as SubscriptionTier
        }
        
        const { data: createdProfile, error: createError } = await createUserProfile(newProfile)
        
        if (createError) {
          console.error('Error creating user profile:', createError)
          setAuthState(prev => ({ ...prev, error: createError.message, loading: false }))
          return
        }

        setAuthState(prev => ({ 
          ...prev, 
          profile: createdProfile as UserProfile,
          session: prev.session,
          loading: false,
          error: null
        }))
      } else {
        setAuthState(prev => ({ 
          ...prev, 
          profile: profile as UserProfile,
          session: prev.session,
          loading: false,
          error: null
        }))
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error)
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }))
    }
  }

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
      return { error }
    }

    // loadUserProfile will be called by the auth state change listener
    return { error: null }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {}
      }
    })

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
      return { error }
    }

    // If user is immediately confirmed, load profile
    if (data.user && !data.user.email_confirmed_at) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Please check your email to confirm your account.' 
      }))
    }

    return { error: null }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
      return
    }

    setAuthState({
      user: null,
      profile: null,
      session: null,
      loading: false,
      error: null
    })

    router.push('/auth/login')
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    return { error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user || !authState.profile) {
      return { error: { message: 'No authenticated user' } }
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await updateUserProfile(authState.user.id, updates)
    
    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
      return { error }
    }

    setAuthState(prev => ({ 
      ...prev, 
      profile: data as UserProfile,
      loading: false,
      error: null
    }))
    
    return { error: null }
  }

  const checkFeatureAccess = (feature: string): boolean => {
    if (!authState.profile) return false
    
    const limits = SUBSCRIPTION_LIMITS[authState.profile.subscription_tier]
    return limits.features.includes(feature)
  }

  const getRemainingLimits = (): SubscriptionLimits => {
    if (!authState.profile) return SUBSCRIPTION_LIMITS.free
    
    return SUBSCRIPTION_LIMITS[authState.profile.subscription_tier]
  }

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    checkFeatureAccess,
    getRemainingLimits
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hooks
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.push(redirectTo)
    }
  }, [auth.loading, auth.user, redirectTo, router])

  return auth
}

export function useSubscriptionLimits() {
  const auth = useAuth()
  return auth.getRemainingLimits()
}