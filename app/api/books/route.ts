import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Book, BookStatus } from '@/lib/types'

export async function GET(request: Request) {
  // Verify JWT
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jwt = authHeader.split(' ')[1]
  const { data: user, error: userError } = await supabase.auth.getUser(jwt)

  if (userError || !user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch user's books
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(books)
}

export async function POST(request: Request) {
  // Verify JWT
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jwt = authHeader.split(' ')[1]
  const { data: user, error: userError } = await supabase.auth.getUser(jwt)

  if (userError || !user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate request body
  let bookData: Omit<Book, 'id' | 'user_id' | 'created_at'>
  try {
    bookData = await request.json()
    if (!bookData.title || !bookData.author || !bookData.status) {
      throw new Error('Missing required fields')
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  // Create book
  const { data: book, error } = await supabase
    .from('books')
    .insert({
      ...bookData,
      user_id: user.user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(book, { status: 201 })
}

export async function DELETE(request: Request) {
  // Verify JWT
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jwt = authHeader.split(' ')[1]
  const { data: user, error: userError } = await supabase.auth.getUser(jwt)

  if (userError || !user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get book ID from URL
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
  }

  // Delete book (only if it belongs to the user)
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
    .eq('user_id', user.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request) {
  // Verify JWT
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jwt = authHeader.split(' ')[1]
  const { data: user, error: userError } = await supabase.auth.getUser(jwt)

  if (userError || !user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get book ID from URL
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
  }

  // Validate request body
  let updateData: { status?: BookStatus }
  try {
    updateData = await request.json()
    if (!updateData.status) {
      throw new Error('Status is required')
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  // Update book (only if it belongs to the user)
  const { data: book, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(book)
}