'use client'

import { useState } from 'react'
import { Crown, Zap, Check, AlertCircle, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useAuth, useSubscriptionLimits } from '@/contexts/AuthContext'
import { SubscriptionTier, SUBSCRIPTION_LIMITS } from '@/types'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface SubscriptionCardProps {
  className?: string
  showUsage?: boolean
  currentProductCount?: number
  currentSupplierCount?: number
}

const planDetails = {
  free: {
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Check,
    description: 'Perfect for getting started',
    color: 'text-gray-600'
  },
  pro: {
    name: 'Pro',
    price: '$29',
    period: 'month',
    icon: Zap,
    description: 'For growing businesses',
    color: 'text-blue-600'
  },
  enterprise: {
    name: 'Enterprise',
    price: '$99',
    period: 'month',
    icon: Crown,
    description: 'For large organizations',
    color: 'text-purple-600'
  }
}

export function SubscriptionCard({ 
  className, 
  showUsage = true,
  currentProductCount = 0,
  currentSupplierCount = 0
}: SubscriptionCardProps) {
  const [showUpgrade, setShowUpgrade] = useState(false)
  const { profile, updateProfile } = useAuth()
  const limits = useSubscriptionLimits()

  if (!profile) return null

  const currentTier = profile.subscription_tier
  const currentPlan = planDetails[currentTier]
  const CurrentIcon = currentPlan.icon

  const getUsagePercentage = (current: number, max: number): number => {
    if (max === -1) return 0 // unlimited
    return Math.min((current / max) * 100, 100)
  }

  const productUsage = getUsagePercentage(currentProductCount, limits.maxProducts)
  const supplierUsage = getUsagePercentage(currentSupplierCount, limits.maxSuppliers)

  const handleUpgrade = async (tier: SubscriptionTier) => {
    // In a real app, this would integrate with a payment processor
    // For demo purposes, we'll just update the subscription tier
    await updateProfile({ subscription_tier: tier })
    setShowUpgrade(false)
  }

  return (
    <>
      <Card className={cn('', className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', 
                currentTier === 'free' ? 'bg-gray-100' :
                currentTier === 'pro' ? 'bg-blue-100' : 'bg-purple-100'
              )}>
                <CurrentIcon className={cn('h-5 w-5', currentPlan.color)} />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentPlan.name} Plan
                  {currentTier !== 'free' && (
                    <Badge variant="outline" className={cn('text-xs', currentPlan.color)}>
                      {currentPlan.price}/{currentPlan.period}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>{currentPlan.description}</CardDescription>
              </div>
            </div>
            {currentTier === 'free' && (
              <Button size="sm" onClick={() => setShowUpgrade(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            )}
          </div>
        </CardHeader>

        {showUsage && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Products</span>
                  <span className="text-muted-foreground">
                    {currentProductCount} / {limits.maxProducts === -1 ? '∞' : limits.maxProducts}
                  </span>
                </div>
                <Progress value={productUsage} className="h-2" />
                {productUsage > 80 && limits.maxProducts !== -1 && (
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <AlertCircle className="h-3 w-3" />
                    Approaching limit
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Suppliers</span>
                  <span className="text-muted-foreground">
                    {currentSupplierCount} / {limits.maxSuppliers === -1 ? '∞' : limits.maxSuppliers}
                  </span>
                </div>
                <Progress value={supplierUsage} className="h-2" />
                {supplierUsage > 80 && limits.maxSuppliers !== -1 && (
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <AlertCircle className="h-3 w-3" />
                    Approaching limit
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2">Available Features</h4>
              <div className="grid grid-cols-1 gap-2">
                {limits.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-500" />
                    <span className="capitalize">{feature.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Upgrade Your Plan
            </DialogTitle>
            <DialogDescription>
              Choose a plan that fits your needs and unlock more features.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(planDetails).filter(([tier]) => tier !== 'free').map(([tier, plan]) => {
              const Icon = plan.icon
              const isCurrentTier = tier === currentTier
              const tierLimits = SUBSCRIPTION_LIMITS[tier as SubscriptionTier]

              return (
                <Card 
                  key={tier} 
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    isCurrentTier && 'ring-2 ring-primary'
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2 rounded-lg',
                        tier === 'pro' ? 'bg-blue-100' : 'bg-purple-100'
                      )}>
                        <Icon className={cn('h-5 w-5', plan.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold">{plan.price}</span>
                          <span className="text-sm text-muted-foreground">/{plan.period}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Features included:</h4>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2 text-xs">
                          <Check className="h-3 w-3 text-green-500" />
                          {tierLimits.maxProducts === -1 ? 'Unlimited' : tierLimits.maxProducts} products
                        </li>
                        <li className="flex items-center gap-2 text-xs">
                          <Check className="h-3 w-3 text-green-500" />
                          {tierLimits.maxSuppliers === -1 ? 'Unlimited' : tierLimits.maxSuppliers} suppliers
                        </li>
                        {tierLimits.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-xs">
                            <Check className="h-3 w-3 text-green-500" />
                            <span className="capitalize">{feature.replace('_', ' ')}</span>
                          </li>
                        ))}
                        {tierLimits.features.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            +{tierLimits.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <Button 
                      className="w-full" 
                      variant={isCurrentTier ? "outline" : "default"}
                      onClick={() => handleUpgrade(tier as SubscriptionTier)}
                      disabled={isCurrentTier}
                    >
                      {isCurrentTier ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}