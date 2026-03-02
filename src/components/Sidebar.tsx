'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  category?: string
}

export default function Sidebar({ category }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/chat', label: 'AI Chat', icon: '💬' },
    { href: '/assessments/phq9', label: 'PHQ-9 Assessment', icon: '📋' },
    { href: '/assessments/gad7', label: 'GAD-7 Assessment', icon: '📊' },
    { href: '/appointments', label: 'Appointments', icon: '📅' },
    { href: '/doctor-chat', label: 'Doctor Chat', icon: '👨‍⚕️' },
    ...(category === 'maternal' ? [{ href: '/maternal', label: 'Maternal Care', icon: '🤰' }] : []),
    ...(category === 'new_parent' ? [
      { href: '/maternal', label: 'Maternal Care', icon: '🤰' },
      { href: '/child-care', label: 'Child Care', icon: '👶' },
    ] : []),
    { href: '/reminders', label: 'Reminders', icon: '⏰' },
  ]

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="text-xl font-bold text-purple-700">Yugaa</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Mental Wellness Platform</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
