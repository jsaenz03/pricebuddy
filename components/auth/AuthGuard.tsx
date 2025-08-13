'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Loader, Shield, AlertCircle } from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { SubscriptionTier } from '@/types'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireTier?: SubscriptionTier
  fallbackPath?: string
  loadingComponent?: ReactNode
  unauthorizedComponent?: ReactNode
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireTier,
  fallbackPath = '/auth/login',
  loadingComponent,
  unauthorizedComponent
}: AuthGuardProps) {
  const { user, profile, loading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Check if authentication is required and user is not logged in
      if (requireAuth && !user) {
        router.push(fallbackPath)
        return
      }

      // Check subscription tier requirements
      if (requireTier && profile) {
        const tierHierarchy: Record<SubscriptionTier, number> = {
          free: 1,
          pro: 2,
          enterprise: 3
        }

        const userTierLevel = tierHierarchy[profile.subscription_tier]
        const requiredTierLevel = tierHierarchy[requireTier]

        if (userTierLevel < requiredTierLevel) {
          // User doesn't have the required subscription tier
          return
        }
      }
    }
  }, [user, profile, loading, requireAuth, requireTier, fallbackPath, router])

  // Show loading state
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-center text-muted-foreground">
              Loading your account...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="text-center">
              <h3 className="font-semibold mb-2">Authentication Error</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => router.push(fallbackPath)}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    // This will be handled by the useEffect above, but we return loading state just in case
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Check subscription tier requirement
  if (requireTier && profile) {
    const tierHierarchy: Record<SubscriptionTier, number> = {
      free: 1,
      pro: 2,
      enterprise: 3
    }

    const userTierLevel = tierHierarchy[profile.subscription_tier]
    const requiredTierLevel = tierHierarchy[requireTier]

    if (userTierLevel < requiredTierLevel) {
      if (unauthorizedComponent) {
        return <>{unauthorizedComponent}</>
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center space-y-4 pt-6">
              <Shield className="h-8 w-8 text-orange-500" />
              <div className="text-center">
                <h3 className="font-semibold mb-2">Upgrade Required</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This feature requires a {requireTier} subscription or higher.
                  Your current plan: {profile.subscription_tier}
                </p>
                <div className="space-y-2">
                  <Button onClick={() => router.push('/settings/billing')}>
                    Upgrade Now
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard')}
                    className="w-full"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  // All checks passed, render children
  return <>{children}</>
}

// Convenience components for common use cases
export function RequireAuth({ children, ...props }: Omit<AuthGuardProps, 'requireAuth'>) {
  return (
    <AuthGuard requireAuth={true} {...props}>
      {children}
    </AuthGuard>
  )
}

export function RequireProTier({ children, ...props }: Omit<AuthGuardProps, 'requireTier'>) {
  return (
    <AuthGuard requireTier="pro" {...props}>
      {children}
    </AuthGuard>
  )
}

export function RequireEnterpriseTier({ children, ...props }: Omit<AuthGuardProps, 'requireTier'>) {
  return (
    <AuthGuard requireTier="enterprise" {...props}>
      {children}
    </AuthGuard>
  )
}

// Feature gate component for conditional rendering
interface FeatureGateProps {
  children: ReactNode
  feature: string
  fallback?: ReactNode
  showUpgrade?: boolean
}

export function FeatureGate({ 
  children, 
  feature, 
  fallback,
  showUpgrade = true 
}: FeatureGateProps) {
  const { profile, checkFeatureAccess } = useAuth()
  const router = useRouter()

  if (!profile) {
    return null
  }

  const hasAccess = checkFeatureAccess(feature)

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (showUpgrade) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>This feature requires a higher subscription tier.</span>
          <Button size="sm" onClick={() => router.push('/settings/billing')}>
            Upgrade
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}