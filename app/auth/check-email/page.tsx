'use client'

import { FiMail } from 'react-icons/fi'
import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="max-w-md w-full mx-auto p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 text-center">
      <div className="mb-6 flex justify-center">
        <FiMail className="h-12 w-12 text-indigo-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
      <p className="text-gray-400 mb-6">
        We've sent a confirmation link to your email address.
      </p>
      <div className="text-sm text-gray-400">
        Didn't receive it? <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300">Try again</Link>
      </div>
    </div>
  )
}