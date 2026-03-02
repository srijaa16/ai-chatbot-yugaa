'use client'
import { useState, useEffect } from 'react'

interface Reminder {
  id: string
  title: string
  description?: string
  time: string
  days: string
  active: boolean
  type: string
}

const reminderTypes = [
  { value: 'medication', label: 'Medication', icon: '💊' },
  { value: 'appointment', label: 'Appointment', icon: '📅' },
  { value: 'exercise', label: 'Exercise', icon: '🏃' },
  { value: 'sleep', label: 'Sleep', icon: '😴' },
  { value: 'water', label: 'Hydration', icon: '💧' },
  { value: 'meditation', label: 'Meditation', icon: '🧘' },
  { value: 'prenatal', label: 'Prenatal Vitamin', icon: '🌿' },
  { value: 'custom', label: 'Custom', icon: '⭐' },
]

const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', time: '08:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], type: 'custom'
  })

  useEffect(() => {
    fetch('/api/reminders').then(r => r.json()).then(d => { if (Array.isArray(d)) setReminders(d) })
  }, [])

  const toggleDay = (day: string) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setReminders(prev => [data, ...prev])
      setShowForm(false)
      setForm({ title: '', description: '', time: '08:00', days: ['Mon','Tue','Wed','Thu','Fri'], type: 'custom' })
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    const res = await fetch('/api/reminders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active }),
    })
    const data = await res.json()
    if (res.ok) setReminders(prev => prev.map(r => r.id === id ? data : r))
  }

  const deleteReminder = async (id: string) => {
    const res = await fetch(`/api/reminders?id=${id}`, { method: 'DELETE' })
    if (res.ok) setReminders(prev => prev.filter(r => r.id !== id))
  }

  const getTypeIcon = (type: string) => reminderTypes.find(t => t.value === type)?.icon || '⭐'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reminders</h1>
          <p className="text-gray-500 text-sm">Stay on top of your wellness routine</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium">
          + Add Reminder
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">New Reminder</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <div className="grid grid-cols-4 gap-2">
                {reminderTypes.map(rt => (
                  <button key={rt.value} type="button"
                    onClick={() => setForm(p => ({...p, type: rt.value}))}
                    className={`p-2 rounded-lg border text-center text-xs transition ${
                      form.type === rt.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <div className="text-xl mb-1">{rt.icon}</div>
                    {rt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="Reminder title" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <input value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="Optional notes" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" value={form.time} onChange={e => setForm(p => ({...p, time: e.target.value}))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
              <div className="flex gap-2">
                {dayOptions.map(day => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      form.days.includes(day) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                Create Reminder
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">⏰</div>
            <p className="text-gray-500">No reminders yet. Add one to stay on track!</p>
          </div>
        ) : (
          reminders.map(r => {
            const days = (() => { try { return JSON.parse(r.days) } catch { return [] } })()
            return (
              <div key={r.id} className={`bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4 ${
                r.active ? 'border-gray-100' : 'border-gray-100 opacity-60'
              }`}>
                <div className="text-2xl">{getTypeIcon(r.type)}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{r.title}</p>
                  {r.description && <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-purple-600">⏰ {r.time}</span>
                    <span className="text-xs text-gray-400">{Array.isArray(days) ? days.join(', ') : r.days}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(r.id, r.active)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${r.active ? 'bg-purple-600' : 'bg-gray-300'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                      r.active ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                  <button onClick={() => deleteReminder(r.id)} className="text-red-400 hover:text-red-600 transition text-sm">🗑️</button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
