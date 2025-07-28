// src/components/BookList.tsx
'use client'

import type { Book, BookStatus } from '@/lib/types'
import { FiTrash2, FiChevronDown } from 'react-icons/fi'

export default function BookList({ books, onDelete, onUpdateStatus }: {
  books: Book[]
  onDelete: (id: string) => void
  onUpdateStatus?: (id: string, status: BookStatus) => void
}) {
  const statusColors = {
    wishlist: 'bg-purple-500/10 text-purple-400',
    reading: 'bg-blue-500/10 text-blue-400',
    completed: 'bg-emerald-500/10 text-emerald-400',
  }

  return (
    <div className="divide-y divide-gray-700">
      {books.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          No books added yet. Start by adding your first book!
        </div>
      ) : (
        <ul className="divide-y divide-gray-700">
          {books.map((book) => (
            <li key={book.id} className="hover:bg-gray-750 transition-colors">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{book.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{book.author}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {onUpdateStatus && (
                    <div className="relative">
                      <select
                        value={book.status}
                        onChange={(e) => onUpdateStatus(book.id, e.target.value as BookStatus)}
                        className={`appearance-none pl-3 pr-8 py-1 text-xs rounded-full ${statusColors[book.status]} border border-transparent focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500`}
                      >
                        <option value="wishlist">Wishlist</option>
                        <option value="reading">Reading</option>
                        <option value="completed">Completed</option>
                      </select>
                      <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-current pointer-events-none" />
                    </div>
                  )}
                  
                  <button
                    onClick={() => onDelete(book.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-red-400/10 transition-colors"
                    aria-label="Delete book"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}