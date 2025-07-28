# BookTracker 📚
Track your reading in style

check out the project, [CLICK HERE!](https://book-tracker-app-brown.vercel.app/dashboard)

<img width="1287" height="511" alt="Screenshot 2025-07-28 at 1 26 34 PM" src="https://github.com/user-attachments/assets/f97c9b8c-9682-4382-bc6e-3bff509b52de" />

## Features
✅ Secure login/signup

📖 Add, edit, delete books

🔄 Realtime updates

🎨 Dark mode UI

📱 Mobile-friendly

## Tech Stack
Next.js 14 + TypeScript

Supabase (Auth + Database)

Tailwind CSS

# Instalation
## Clone Repo:
```
# Clone the repository
git clone https://github.com/yourusername/booktracker.git
cd booktracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

## Supabase Config:
- Create a new project at Supabase
- Enable Email/Password auth in Authentication → Providers
- Run this SQL in the SQL Editor:
```
-- Create books table with RLS
create table books (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  author text not null,
  status text check (status in ('reading', 'completed', 'wishlist')),
  created_at timestamptz default now()
);

-- Enable realtime
alter publication supabase_realtime add table books;

-- Set up Row Level Security
alter table books enable row level security;
create policy "Users can only manage their own books" 
on books for all using (auth.uid() = user_id);
```
## Environment Variables:
Update .env.local with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Running the App:
```
# Development mode
npm run dev

# Production build
npm run build && npm run start
```
