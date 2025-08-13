'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { PasswordResetForm } from '@/components/auth/PasswordResetForm'

export default function ForgotPasswordPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <PasswordResetForm />
        </div>
      </div>
    </AuthProvider>
  )
}