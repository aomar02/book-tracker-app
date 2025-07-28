// src/lib/types.ts

// Status enum - ensures only valid values are used
export type BookStatus = 'reading' | 'completed' | 'wishlist'

// Base book interface matching your table structure
export interface Book {
  id: string // uuid
  user_id: string // references auth.users.id
  title: string
  author: string
  status: BookStatus
  created_at: string // ISO date string
}

// For creating new books (omits auto-generated fields)
export interface BookFormData {
  title: string
  author: string
  status: BookStatus
}

// For API responses (success/error)
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

// For pagination if you implement it later
export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
}