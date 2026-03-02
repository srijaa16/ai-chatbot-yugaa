'use client'
import { useState } from 'react'

const questions = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
]

const options = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
]

function getSeverity(score: number) {
  if (score <= 4) return { level: 'Minimal', color: 'text-green-600', bg: 'bg-green-50', description: 'Minimal anxiety symptoms.' }
  if (score <= 9) return { level: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-50', description: 'Mild anxiety. Consider relaxation techniques.' }
  if (score <= 14) return { level: 'Moderate', color: 'text-orange-600', bg: 'bg-orange-50', description: 'Moderate anxiety. Consider speaking with a healthcare professional.' }
  return { level: 'Severe', color: 'text-red-700', bg: 'bg-red-100', description: 'Severe anxiety. Please seek professional help.' }
}

export default function GAD7Page() {
  const [answers, setAnswers] = useState<number[]>(new Array(7).fill(-1))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)

  const handleAnswer = (qIdx: number, value: number) => {
    setAnswers(prev => { const next = [...prev]; next[qIdx] = value; return next })
  }

  const handleSubmit = async () => {
    if (answers.some(a => a === -1)) { alert('Please answer all questions'); return }
    const total = answers.reduce((sum, a) => sum + a, 0)
    const severity = getSeverity(total)
    setScore(total)
    setSubmitted(true)
    setSaving(true)
    await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'gad7', answers, score: total, severity: severity.level }),
    })
    setSaving(false)
  }

  if (submitted) {
    const severity = getSeverity(score)
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-2xl p-8 text-center ${severity.bg}`}>
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">GAD-7 Results</h2>
          <p className="text-5xl font-bold mb-2">{score}</p>
          <p className={`text-xl font-semibold ${severity.color} mb-3`}>{severity.level} Anxiety</p>
          <p className="text-gray-600">{severity.description}</p>
          {saving && <p className="text-sm text-gray-400 mt-3">Saving results...</p>}
          <div className="mt-6">
            <button onClick={() => { setSubmitted(false); setAnswers(new Array(7).fill(-1)) }}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium">
              Take Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">GAD-7 Anxiety Assessment</h1>
        <p className="text-gray-500 text-sm mt-1">Over the last 2 weeks, how often have you been bothered by the following?</p>
      </div>
      {questions.map((q, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="font-medium text-gray-800 mb-4">{idx + 1}. {q}</p>
          <div className="grid grid-cols-2 gap-2">
            {options.map(opt => (
              <label key={opt.value} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                answers[idx] === opt.value ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
              }`}>
                <input type="radio" name={`q${idx}`} value={opt.value} checked={answers[idx] === opt.value}
                  onChange={() => handleAnswer(idx, opt.value)} className="text-teal-600" />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit}
        className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition font-medium">
        Submit Assessment
      </button>
    </div>
  )
}
