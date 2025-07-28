// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      
      if (access_token && refresh_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token
        }).then(() => {
          router.push('/dashboard')
        })
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Confirming your email... Please wait.</p>
    </div>
  )
}