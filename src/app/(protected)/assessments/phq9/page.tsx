'use client'
import { useState } from 'react'

const questions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless',
  'Thoughts that you would be better off dead or of hurting yourself in some way',
]

const options = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
]

function getSeverity(score: number) {
  if (score <= 4) return { level: 'Minimal', color: 'text-green-600', bg: 'bg-green-50', description: 'Minimal depression symptoms.' }
  if (score <= 9) return { level: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-50', description: 'Mild depression symptoms. Consider self-care strategies.' }
  if (score <= 14) return { level: 'Moderate', color: 'text-orange-600', bg: 'bg-orange-50', description: 'Moderate depression symptoms. Consider talking to a healthcare provider.' }
  if (score <= 19) return { level: 'Moderately Severe', color: 'text-red-500', bg: 'bg-red-50', description: 'Moderately severe symptoms. Recommend professional consultation.' }
  return { level: 'Severe', color: 'text-red-700', bg: 'bg-red-100', description: 'Severe depression symptoms. Please seek professional help immediately.' }
}

export default function PHQ9Page() {
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)

  const handleAnswer = (qIdx: number, value: number) => {
    setAnswers(prev => {
      const next = [...prev]
      next[qIdx] = value
      return next
    })
  }

  const handleSubmit = async () => {
    if (answers.some(a => a === -1)) {
      alert('Please answer all questions')
      return
    }
    const total = answers.reduce((sum, a) => sum + a, 0)
    const severity = getSeverity(total)
    setScore(total)
    setSubmitted(true)
    setSaving(true)
    await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'phq9', answers, score: total, severity: severity.level }),
    })
    setSaving(false)
  }

  if (submitted) {
    const severity = getSeverity(score)
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-2xl p-8 text-center ${severity.bg}`}>
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">PHQ-9 Results</h2>
          <p className="text-5xl font-bold mb-2">{score}</p>
          <p className={`text-xl font-semibold ${severity.color} mb-3`}>{severity.level} Depression</p>
          <p className="text-gray-600">{severity.description}</p>
          {saving && <p className="text-sm text-gray-400 mt-3">Saving results...</p>}
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => { setSubmitted(false); setAnswers(new Array(9).fill(-1)) }}
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
        <h1 className="text-2xl font-bold text-gray-800">PHQ-9 Depression Assessment</h1>
        <p className="text-gray-500 text-sm mt-1">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>
      </div>

      {questions.map((q, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="font-medium text-gray-800 mb-4">{idx + 1}. {q}</p>
          <div className="grid grid-cols-2 gap-2">
            {options.map(opt => (
              <label key={opt.value} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                answers[idx] === opt.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
              }`}>
                <input type="radio" name={`q${idx}`} value={opt.value} checked={answers[idx] === opt.value}
                  onChange={() => handleAnswer(idx, opt.value)} className="text-purple-600" />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSubmit}
        className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-medium">
        Submit Assessment
      </button>
    </div>
  )
}
