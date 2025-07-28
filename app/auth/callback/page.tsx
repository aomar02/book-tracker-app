'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle both hash fragments and query parameters
    const hash = window.location.hash.substring(1)
    const query = new URLSearchParams(searchParams.toString())
    const hashParams = new URLSearchParams(hash)

    const access_token = hashParams.get('access_token') || query.get('access_token')
    const refresh_token = hashParams.get('refresh_token') || query.get('refresh_token')
    const error = hashParams.get('error') || query.get('error')

    if (error) {
      router.push(`/auth/login?error=${encodeURIComponent(error)}`)
      return
    }

    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token
      }).then(() => {
        router.push('/dashboard')
      })
    } else {
      router.push('/auth/login')
    }
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Processing authentication...</p>
    </div>
  )
}