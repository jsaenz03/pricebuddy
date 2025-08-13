'use client'

import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext'
import { SignUpForm } from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  const router = useRouter()

  const handleSignUpSuccess = () => {
    // User will be redirected to email verification page
    // This is handled in the SignUpForm component
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <SignUpForm onSuccess={handleSignUpSuccess} />
        </div>
      </div>
    </AuthProvider>
  )
}