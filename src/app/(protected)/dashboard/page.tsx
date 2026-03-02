import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const [assessments, appointments, reminders] = await Promise.all([
    prisma.assessment.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.appointment.findMany({ where: { userId: session.user.id, status: 'scheduled' }, include: { doctor: true }, orderBy: { date: 'asc' }, take: 3 }),
    prisma.reminder.findMany({ where: { userId: session.user.id, active: true }, take: 3 }),
  ])

  const latestPHQ9 = assessments.find(a => a.type === 'phq9')
  const latestGAD7 = assessments.find(a => a.type === 'gad7')

  const quickActions = [
    { href: '/chat', label: 'Chat with AI', icon: '💬', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
    { href: '/assessments/phq9', label: 'PHQ-9 Assessment', icon: '📋', color: 'bg-teal-50 border-teal-200 hover:bg-teal-100' },
    { href: '/assessments/gad7', label: 'GAD-7 Assessment', icon: '📊', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
    { href: '/appointments', label: 'Book Appointment', icon: '📅', color: 'bg-pink-50 border-pink-200 hover:bg-pink-100' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Your Wellness Dashboard</h1>
        <p className="text-gray-500 mt-1">Track your mental health journey and stay connected with care.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">PHQ-9 Score</p>
              <p className="text-2xl font-bold text-gray-800">{latestPHQ9 ? latestPHQ9.score : '—'}</p>
              <p className="text-xs text-gray-400">{latestPHQ9 ? latestPHQ9.severity : 'Not taken yet'}</p>
            </div>
            <span className="text-3xl">🧠</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">GAD-7 Score</p>
              <p className="text-2xl font-bold text-gray-800">{latestGAD7 ? latestGAD7.score : '—'}</p>
              <p className="text-xs text-gray-400">{latestGAD7 ? latestGAD7.severity : 'Not taken yet'}</p>
            </div>
            <span className="text-3xl">😌</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
              <p className="text-xs text-gray-400">Scheduled</p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <Link key={action.href} href={action.href}
              className={`border rounded-xl p-4 text-center transition cursor-pointer ${action.color}`}>
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className="text-sm font-medium text-gray-700">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      {appointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Upcoming Appointments</h2>
          <div className="space-y-3">
            {appointments.map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{apt.doctor.name}</p>
                  <p className="text-sm text-gray-500">{apt.doctor.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-600">{new Date(apt.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">{apt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Reminders */}
      {reminders.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Active Reminders</h2>
          <div className="space-y-2">
            {reminders.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <span className="text-teal-500">⏰</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
