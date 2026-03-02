'use client'
import { useState, useEffect, useRef } from 'react'

interface Doctor {
  id: string
  name: string
  specialty: string
}

interface DoctorMessage {
  id: string
  content: string
  sender: 'user' | 'doctor'
  createdAt: string
}

export default function DoctorChatPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [messages, setMessages] = useState<DoctorMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/doctors').then(r => r.json()).then(d => { if (Array.isArray(d)) setDoctors(d) })
  }, [])

  useEffect(() => {
    if (selectedDoctor) {
      fetch(`/api/doctor-chat?doctorId=${selectedDoctor.id}`).then(r => r.json()).then(d => {
        if (Array.isArray(d)) setMessages(d)
      })
    }
  }, [selectedDoctor])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !selectedDoctor || loading) return
    const content = input.trim()
    setInput('')
    setLoading(true)
    
    const res = await fetch('/api/doctor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId: selectedDoctor.id, content }),
    })
    const data = await res.json()
    if (res.ok) {
      setMessages(prev => [
        ...prev,
        { id: data.message.id, content, sender: 'user', createdAt: new Date().toISOString() },
        { id: Date.now().toString(), content: data.autoReply, sender: 'doctor', createdAt: new Date().toISOString() },
      ])
    }
    setLoading(false)
  }

  if (!selectedDoctor) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doctor Chat</h1>
          <p className="text-gray-500 text-sm">Select a doctor to start a conversation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map(doc => (
            <button key={doc.id} onClick={() => setSelectedDoctor(doc)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-left hover:border-purple-300 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">👨‍⚕️</div>
                <div>
                  <p className="font-semibold text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.specialty}</p>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Available</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setSelectedDoctor(null)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">👨‍⚕️</div>
          <div>
            <p className="font-semibold text-gray-800">{selectedDoctor.name}</p>
            <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>Start your conversation with {selectedDoctor.name}</p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm ${
                msg.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={`Message ${selectedDoctor.name}...`}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50 text-sm font-medium">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
