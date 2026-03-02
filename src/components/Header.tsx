'use client'
import { signOut } from 'next-auth/react'

interface HeaderProps {
  userName?: string | null
  category?: string
}

const categoryLabels: Record<string, string> = {
  general_wellness: 'General Wellness',
  maternal: 'Maternal Care',
  new_parent: 'New Parent',
}

const categoryColors: Record<string, string> = {
  general_wellness: 'bg-teal-100 text-teal-700',
  maternal: 'bg-pink-100 text-pink-700',
  new_parent: 'bg-blue-100 text-blue-700',
}

export default function Header({ userName, category = 'general_wellness' }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, {userName || 'Friend'} 👋
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[category] || categoryColors.general_wellness}`}>
          {categoryLabels[category] || category}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="text-sm text-gray-500 hover:text-red-600 transition font-medium"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
