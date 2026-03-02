'use client'
import { useState, useEffect } from 'react'

const milestones = [
  { age: 1, label: '1 Month', items: ['Follows objects with eyes', 'Responds to sounds', 'Holds head up briefly'] },
  { age: 2, label: '2 Months', items: ['Social smile', 'Coos and makes sounds', 'Holds head steady'] },
  { age: 4, label: '4 Months', items: ['Laughs', 'Rolls from tummy to back', 'Reaches for objects'] },
  { age: 6, label: '6 Months', items: ['Sits with support', 'Babbles', 'Recognizes familiar faces'] },
  { age: 9, label: '9 Months', items: ['Crawls', 'Says mama/dada', 'Plays peek-a-boo'] },
  { age: 12, label: '12 Months', items: ['First words', 'Stands alone', 'Waves bye-bye'] },
  { age: 18, label: '18 Months', items: ['Walks independently', 'Says 10+ words', 'Points to objects'] },
  { age: 24, label: '24 Months', items: ['Runs', 'Uses 2-word phrases', 'Follows 2-step instructions'] },
]

interface FeedingLog {
  time: string
  type: string
  amount: string
  note: string
}

export default function ChildCarePage() {
  const [childBirthDate, setChildBirthDate] = useState<string>('')
  const [ageMonths, setAgeMonths] = useState(0)
  const [feedingLog, setFeedingLog] = useState<FeedingLog[]>([])
  const [newFeeding, setNewFeeding] = useState({ type: 'breast', amount: '', note: '' })

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(data => {
      if (data.childBirthDate) {
        setChildBirthDate(data.childBirthDate)
        const months = Math.floor((Date.now() - new Date(data.childBirthDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
        setAgeMonths(months)
      }
    })
  }, [])

  const currentMilestones = milestones.filter(m => m.age <= ageMonths + 1)
  const upcomingMilestone = milestones.find(m => m.age > ageMonths)

  const addFeeding = () => {
    const log: FeedingLog = {
      time: new Date().toLocaleTimeString(),
      type: newFeeding.type,
      amount: newFeeding.amount,
      note: newFeeding.note,
    }
    setFeedingLog(prev => [log, ...prev.slice(0, 9)])
    setNewFeeding({ type: 'breast', amount: '', note: '' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Child Care</h1>
        <p className="text-gray-500 text-sm">Track your baby&apos;s growth and milestones</p>
      </div>

      {/* Age Card */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Baby&apos;s Age</p>
            <p className="text-4xl font-bold text-blue-700">{ageMonths} months</p>
            {childBirthDate && (
              <p className="text-sm text-gray-500 mt-1">Born: {new Date(childBirthDate).toLocaleDateString()}</p>
            )}
          </div>
          <span className="text-6xl">👶</span>
        </div>
        {!childBirthDate && (
          <div className="mt-4">
            <label className="text-sm text-gray-600">Enter birth date:</label>
            <input type="date" onChange={e => {
              const months = Math.floor((Date.now() - new Date(e.target.value).getTime()) / (1000 * 60 * 60 * 24 * 30))
              setAgeMonths(months)
              setChildBirthDate(e.target.value)
            }} className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        )}
      </div>

      {/* Upcoming Milestone */}
      {upcomingMilestone && (
        <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">🎯 Upcoming Milestone</h2>
          <p className="font-medium text-teal-700 mb-2">{upcomingMilestone.label}</p>
          <ul className="space-y-1">
            {upcomingMilestone.items.map((item, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-teal-400">•</span>{item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Milestones Achieved */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🏆 Milestones</h2>
        <div className="space-y-3">
          {currentMilestones.map((m, idx) => (
            <div key={idx} className="bg-green-50 rounded-lg p-3">
              <p className="font-medium text-green-700 text-sm mb-1">✅ {m.label}</p>
              <ul className="space-y-0.5">
                {m.items.map((item, i) => <li key={i} className="text-xs text-gray-600">• {item}</li>)}
              </ul>
            </div>
          ))}
          {currentMilestones.length === 0 && (
            <p className="text-gray-400 text-sm">Milestones will appear as your baby grows!</p>
          )}
        </div>
      </div>

      {/* Feeding Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🍼 Feeding Log</h2>
        <div className="flex gap-3 mb-4">
          <select value={newFeeding.type} onChange={e => setNewFeeding(p => ({...p, type: e.target.value}))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="breast">Breastfeeding</option>
            <option value="formula">Formula</option>
            <option value="solids">Solid Food</option>
          </select>
          <input placeholder="Amount/duration" value={newFeeding.amount}
            onChange={e => setNewFeeding(p => ({...p, amount: e.target.value}))}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <button onClick={addFeeding}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm font-medium">
            Log
          </button>
        </div>
        <div className="space-y-2">
          {feedingLog.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No feedings logged today</p>
          ) : (
            feedingLog.map((log, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm">
                <span>{log.type === 'breast' ? '🤱' : log.type === 'formula' ? '🍼' : '🥣'}</span>
                <span className="text-gray-600 capitalize">{log.type}</span>
                {log.amount && <span className="text-gray-500">— {log.amount}</span>}
                <span className="ml-auto text-gray-400 text-xs">{log.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
