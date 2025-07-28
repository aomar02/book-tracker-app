// app/auth/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AuthForm from '@/components/AuthForm'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (email: string, password: string) => {
    setLoading(true)
    setError('')

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        }
      })

      if (signupError) throw signupError

      toast.success('Confirmation email sent!')
      router.push('/auth/check-email')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed')
      toast.error('Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <AuthForm 
        type="signup" 
        onSubmit={handleSignup} 
        error={error} 
        loading={loading} 
      />
    </div>
  )
}