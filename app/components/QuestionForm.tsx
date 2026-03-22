'use client'

import { useState, useRef } from 'react'
import type { Question } from '@/lib/types'

interface QuestionFormProps {
  onQuestionAdded: (question: Question) => void
}

export default function QuestionForm({ onQuestionAdded }: QuestionFormProps) {
  const [name, setName] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return

    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), question_text: questionText.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      const newQuestion: Question = await response.json()
      setName('')
      setQuestionText('')
      onQuestionAdded(newQuestion)
      nameRef.current?.focus()
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4"
      noValidate
    >
      <h2 className="text-white font-semibold text-lg">Ask a question</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm text-zinc-400 font-medium">
          Your name
        </label>
        <input
          ref={nameRef}
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          disabled={isSubmitting}
          className="
            bg-zinc-900 border border-zinc-700 rounded-lg
            px-3 py-2.5 text-white placeholder-zinc-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          "
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="question" className="text-sm text-zinc-400 font-medium">
          Question
        </label>
        <textarea
          id="question"
          required
          rows={3}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Your question..."
          disabled={isSubmitting}
          className="
            bg-zinc-900 border border-zinc-700 rounded-lg
            px-3 py-2.5 text-white placeholder-zinc-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors resize-none
          "
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !name.trim() || !questionText.trim()}
        className="
          bg-indigo-600 hover:bg-indigo-500 text-white
          font-semibold px-4 py-2.5 rounded-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-150
          flex items-center justify-center gap-2
          self-end
        "
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="28"
                strokeDashoffset="10"
              />
            </svg>
            Submitting…
          </>
        ) : (
          'Submit question'
        )}
      </button>
    </form>
  )
}
