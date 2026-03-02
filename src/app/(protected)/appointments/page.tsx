'use client'
import { useState, useEffect } from 'react'

interface Doctor {
  id: string
  name: string
  specialty: string
}

interface Appointment {
  id: string
  date: string
  time: string
  type: string
  status: string
  notes?: string
  doctor: Doctor
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ doctorId: '', date: '', time: '', type: 'consultation', notes: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/appointments').then(r => r.json()).then(d => { if (Array.isArray(d)) setAppointments(d) })
    fetch('/api/doctors').then(r => r.json()).then(d => { if (Array.isArray(d)) setDoctors(d) })
  }, [])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setAppointments(prev => [...prev, data])
      setShowForm(false)
      setForm({ doctorId: '', date: '', time: '', type: 'consultation', notes: '' })
    }
    setLoading(false)
  }

  const handleCancel = async (id: string) => {
    const res = await fetch('/api/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'cancelled' }),
    })
    const data = await res.json()
    if (res.ok) {
      setAppointments(prev => prev.map(a => a.id === id ? data : a))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 text-sm">Manage your healthcare appointments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium">
          + Book Appointment
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Book New Appointment</h2>
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select value={form.doctorId} onChange={e => setForm(p => ({...p, doctorId: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                <option value="">Select a doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input type="time" value={form.time} onChange={e => setForm(p => ({...p, time: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="consultation">Consultation</option>
                <option value="follow_up">Follow Up</option>
                <option value="therapy">Therapy Session</option>
                <option value="prenatal">Prenatal Checkup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3} placeholder="Any special notes or concerns..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 text-sm font-medium">
                {loading ? 'Booking...' : 'Book Appointment'}
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
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-gray-500">No appointments yet. Book your first appointment!</p>
          </div>
        ) : (
          appointments.map(apt => (
            <div key={apt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">👨‍⚕️</div>
                  <div>
                    <p className="font-medium text-gray-800">{apt.doctor.name}</p>
                    <p className="text-sm text-gray-500">{apt.doctor.specialty}</p>
                    <p className="text-xs text-gray-400">{apt.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-purple-600">{new Date(apt.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{apt.time}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    apt.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>{apt.status}</span>
                </div>
              </div>
              {apt.status === 'scheduled' && (
                <div className="mt-3 flex justify-end">
                  <button onClick={() => handleCancel(apt.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition">Cancel Appointment</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
