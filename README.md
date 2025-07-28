BookTracker 📚
Track your reading in style

https://./screenshot.png

Features
✅ Secure login/signup

📖 Add, edit, delete books

🔄 Realtime updates

🎨 Dark mode UI

📱 Mobile-friendly

Tech Stack
Next.js 14 + TypeScript

Supabase (Auth + Database)

Tailwind CSS

Quick Start
Set up Supabase

Create books table with RLS (see SQL below)

Enable Email auth

Run locally

bash
git clone https://github.com/yourusername/booktracker.git
cd booktracker
npm install
npm run dev
Deploy
https://vercel.com/button

SQL Setup
sql
create table books (
  id uuid primary key,
  user_id uuid references auth.users,
  title text not null,
  author text not null,
  status text check (status in ('reading', 'completed', 'wishlist'))
);

alter publication supabase_realtime add table books;
Env Variables
env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
