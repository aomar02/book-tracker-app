// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        toast.error('Invalid confirmation link')
        return router.push('/auth/login?error=invalid_link')
      }

      if (data.session) {
        toast.success('Email confirmed!')
        return router.push('/dashboard')
      }

      // Fallback for direct access
      router.push('/auth/login')
    }

    handleAuth()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Verifying your email...</p>
    </div>
  )
}