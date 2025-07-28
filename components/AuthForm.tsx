// src/components/AuthForm.tsx
'use client'

import { FiMail, FiLock } from 'react-icons/fi'
import Link from 'next/link'

interface AuthFormProps {
  type: 'login' | 'signup'
  onSubmit: (e: React.FormEvent) => void
  error: string
  loading: boolean
}

export default function AuthForm({ type, onSubmit, error, loading }: AuthFormProps) {
  return (
    <div className="max-w-md w-full mx-auto p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          {type === 'login' ? 'Welcome back' : 'Get started'}
        </h2>
        <p className="mt-2 text-gray-400">
          {type === 'login' 
            ? 'Log in to your BookTracker account' 
            : 'Create your BookTracker account'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-900/30 border-l-4 border-red-500 text-red-100 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Email Field (Single Instance) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={type === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Forgot Password (Login Only) */}
        {type === 'login' && (
          <div className="flex items-center justify-end">
            <Link 
              href="/auth/reset-password" 
              className="text-sm text-indigo-400 hover:text-indigo-300 transition"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 px-4 py-2.5 flex justify-center items-center ${
            loading
              ? 'bg-indigo-700 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          {loading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            type === 'login' ? 'Log in' : 'Sign up'
          )}
        </button>
      </form>

      {/* Auth Toggle Link */}
      <div className="mt-6 text-center text-sm text-gray-400">
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 transition font-medium">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 transition font-medium">
              Log in
            </Link>
          </>
        )}
      </div>
    </div>
  )
}