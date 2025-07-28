'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Book, BookStatus } from '@/lib/types'
import BookForm from '@/components/BookForm'
import BookList from '@/components/BookList'
import toast from 'react-hot-toast'
import { FiLogOut, FiBook, FiPlus, FiLoader } from 'react-icons/fi'


export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // Fetch initial data and setup realtime
  useEffect(() => {
    // 1. Check authentication
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/auth/login')
        return null
      }
      
      setUser(user)
      return user
    }

    // 2. Fetch books
    const fetchBooks = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBooks(data || [])
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load books')
      } finally {
        setLoading(false)
      }
    }

    // 3. Initialize
    const initialize = async () => {
      const user = await fetchUser()
      if (user) await fetchBooks(user.id)
    }

    initialize()

    // 4. Setup realtime subscription
    const channel = supabase
      .channel('realtime_books')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books',
          filter: user ? `user_id=eq.${user.id}` : undefined
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setBooks(prev => [payload.new as Book, ...prev])
              toast.success('Book added')
              break
            case 'UPDATE':
              setBooks(prev => prev.map(book => 
                book.id === payload.new.id ? payload.new as Book : book
              ))
              toast.success('Book updated')
              break
            case 'DELETE':
              setBooks(prev => prev.filter(book => book.id !== payload.old.id))
              toast.success('Book deleted')
              break
          }
        }
      )
      .subscribe()

    // 5. Cleanup
    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  const handleAddBook = async (bookData: Omit<Book, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      const { data, error } = await supabase
        .from('books')
        .insert({
          ...bookData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      // Note: No need to manually setBooks here - realtime will handle it
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add book')
      toast.error('Failed to add book')
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      // Realtime will handle the state update
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete book')
      toast.error('Failed to delete book')
    }
  }

  const handleUpdateStatus = async (id: string, status: BookStatus) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      const { error } = await supabase
        .from('books')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update book')
      toast.error('Failed to update status')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <FiBook className="h-6 w-6 text-indigo-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                BookTracker
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <FiLogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin h-12 w-12 text-indigo-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Add Book Card */}
            <div className="lg:col-span-4">
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-indigo-500/10 mr-3">
                    <FiPlus className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-semibold">Add New Book</h2>
                </div>
                <BookForm onSubmit={handleAddBook} />
              </div>
            </div>

            {/* Book List */}
            <div className="lg:col-span-8">
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-lg font-semibold">My Library</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {books.length} {books.length === 1 ? 'book' : 'books'} in collection
                  </p>
                </div>
                
                {error && (
                  <div className="bg-red-900/30 border-l-4 border-red-500 text-red-100 p-4 mx-6 mt-4 rounded">
                    {error}
                  </div>
                )}

                <BookList 
                  books={books} 
                  onDelete={handleDeleteBook} 
                  onUpdateStatus={handleUpdateStatus} 
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}