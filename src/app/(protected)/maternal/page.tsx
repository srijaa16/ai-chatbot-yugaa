'use client'
import { useEffect, useState } from 'react'

interface UserData {
  pregnancyWeek?: number
  dueDate?: string
  category: string
}

const weeklyTips: Record<number, string> = {
  4: "Your baby is the size of a poppy seed! Start taking prenatal vitamins with folic acid.",
  8: "Your baby's heart is beating! Schedule your first prenatal appointment if you haven't.",
  12: "End of first trimester! Risk of miscarriage drops significantly. Time to share the news!",
  16: "You may start feeling movements soon! Stay hydrated and eat iron-rich foods.",
  20: "Halfway there! Consider scheduling your anatomy scan ultrasound.",
  24: "Viability milestone reached. Practice relaxation techniques for labor.",
  28: "Third trimester begins! Start thinking about your birth plan.",
  32: "Baby is practicing breathing movements. Continue gentle exercise.",
  36: "Almost full term! Pack your hospital bag and finalize your birth plan.",
  40: "Due date week! Rest, stay calm, and watch for labor signs.",
}

const prenatalChecklist = [
  { week: 8, item: 'First prenatal appointment', icon: '🏥' },
  { week: 10, item: 'Genetic testing (if desired)', icon: '🧬' },
  { week: 12, item: 'First trimester screening', icon: '📋' },
  { week: 16, item: 'Quad screen / NIPT results', icon: '🔬' },
  { week: 20, item: 'Anatomy scan ultrasound', icon: '📡' },
  { week: 24, item: 'Glucose tolerance test', icon: '🩺' },
  { week: 28, item: 'Tdap vaccine', icon: '💉' },
  { week: 32, item: 'Group B Strep test', icon: '🔍' },
  { week: 36, item: 'Weekly appointments begin', icon: '📅' },
  { week: 38, item: 'Pack hospital bag', icon: '🎒' },
]

export default function MaternalPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentWeek, setCurrentWeek] = useState(20)

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(data => {
      setUserData(data)
      if (data.pregnancyWeek) setCurrentWeek(data.pregnancyWeek)
    })
  }, [])

  const daysUntilDue = userData?.dueDate
    ? Math.max(0, Math.ceil((new Date(userData.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  const closestTip = Object.keys(weeklyTips)
    .map(Number)
    .reduce((prev, curr) => Math.abs(curr - currentWeek) < Math.abs(prev - currentWeek) ? curr : prev, 4)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Maternal Care</h1>
        <p className="text-gray-500 text-sm">Your pregnancy journey, week by week</p>
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Current Week</p>
            <p className="text-4xl font-bold text-purple-700">Week {currentWeek}</p>
          </div>
          {daysUntilDue !== null && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Days until due date</p>
              <p className="text-4xl font-bold text-pink-600">{daysUntilDue}</p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg p-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Week 1</span>
            <span>Week 40</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all"
              style={{ width: `${(currentWeek / 40) * 100}%` }} />
          </div>
          <p className="text-xs text-center text-gray-400 mt-1">{currentWeek}/40 weeks</p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <label className="text-sm text-gray-600">Update week:</label>
          <input type="number" min="1" max="42" value={currentWeek}
            onChange={e => setCurrentWeek(parseInt(e.target.value) || 1)}
            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
        </div>
      </div>

      {/* Weekly Tip */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">🌟 This Week&apos;s Tip</h2>
        <p className="text-gray-600">{weeklyTips[closestTip] || "Stay connected with your healthcare provider and listen to your body."}</p>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">📋 Prenatal Checklist</h2>
        <div className="space-y-3">
          {prenatalChecklist.map((item, idx) => (
            <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${
              item.week <= currentWeek ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.item}</p>
                <p className="text-xs text-gray-400">Week {item.week}</p>
              </div>
              {item.week <= currentWeek ? (
                <span className="text-green-500 text-xl">✅</span>
              ) : (
                <span className="text-gray-300 text-xl">⭕</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trimester Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`rounded-xl p-4 text-center border-2 ${currentWeek <= 12 ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'}`}>
          <p className={`text-sm font-semibold ${currentWeek <= 12 ? 'text-purple-700' : 'text-gray-500'}`}>First Trimester</p>
          <p className="text-xs text-gray-400">Weeks 1-12</p>
          {currentWeek <= 12 && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mt-1 inline-block">Current</span>}
        </div>
        <div className={`rounded-xl p-4 text-center border-2 ${currentWeek >= 13 && currentWeek <= 26 ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'}`}>
          <p className={`text-sm font-semibold ${currentWeek >= 13 && currentWeek <= 26 ? 'text-purple-700' : 'text-gray-500'}`}>Second Trimester</p>
          <p className="text-xs text-gray-400">Weeks 13-26</p>
          {currentWeek >= 13 && currentWeek <= 26 && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mt-1 inline-block">Current</span>}
        </div>
        <div className={`rounded-xl p-4 text-center border-2 ${currentWeek >= 27 ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'}`}>
          <p className={`text-sm font-semibold ${currentWeek >= 27 ? 'text-purple-700' : 'text-gray-500'}`}>Third Trimester</p>
          <p className="text-xs text-gray-400">Weeks 27-40</p>
          {currentWeek >= 27 && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mt-1 inline-block">Current</span>}
        </div>
      </div>
    </div>
  )
}
