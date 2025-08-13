'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { RequireAuth } from '@/components/auth/AuthGuard'
import { SubscriptionCard } from '@/components/auth/SubscriptionCard'
import PriceComparisonApp from './price-comparison-app'

// This component wraps the main app with authentication
export default function AppWithAuth() {
  return (
    <AuthProvider>
      <RequireAuth fallbackPath="/auth/login">
        <div className="min-h-screen bg-gray-50">
          {/* Subscription Status Bar - Only show for free users */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <SubscriptionCard 
                showUsage={true}
                currentProductCount={5} // This would come from actual data
                currentSupplierCount={3} // This would come from actual data
              />
            </div>
          </div>
          
          {/* Main App */}
          <PriceComparisonApp />
        </div>
      </RequireAuth>
    </AuthProvider>
  )
}