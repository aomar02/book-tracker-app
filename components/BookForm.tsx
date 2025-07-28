// src/components/BookForm.tsx
'use client'

import { useState } from 'react'
import type { BookFormData } from '@/lib/types'

export default function BookForm({ onSubmit }: { onSubmit: (data: BookFormData) => void }) {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    status: 'wishlist',
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onSubmit(formData)
      setFormData({ title: '', author: '', status: 'wishlist' })
    }} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="The Great Gatsby"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          required
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition"
          value={formData.author}
          onChange={(e) => setFormData({...formData, author: e.target.value})}
          placeholder="F. Scott Fitzgerald"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white transition"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value as any})}
        >
          <option value="wishlist" className="bg-gray-800">Wishlist</option>
          <option value="reading" className="bg-gray-800">Reading</option>
          <option value="completed" className="bg-gray-800">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        Add Book
      </button>
    </form>
  )
}