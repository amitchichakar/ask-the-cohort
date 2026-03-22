'use client'

import { useState } from 'react'
import type { Question } from '@/lib/types'
import { formatTimeAgo } from '@/lib/formatTimeAgo'

interface QuestionCardProps {
  question: Question
  onUpvote: (id: string) => void
}

export default function QuestionCard({ question, onUpvote }: QuestionCardProps) {
  const [isUpvoting, setIsUpvoting] = useState(false)

  async function handleUpvote() {
    if (isUpvoting) return
    setIsUpvoting(true)
    onUpvote(question.id)

    try {
      await fetch(`/api/questions/${question.id}/upvote`, { method: 'PATCH' })
    } finally {
      setTimeout(() => setIsUpvoting(false), 800)
    }
  }

  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex gap-4">
      {/* Upvote column */}
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
        <button
          onClick={handleUpvote}
          disabled={isUpvoting}
          aria-label="Upvote this question"
          className={`
            flex flex-col items-center gap-1 px-3 py-2 rounded-lg
            transition-colors duration-150
            ${isUpvoting
              ? 'bg-indigo-600 text-white cursor-not-allowed'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white active:bg-indigo-600 active:text-white'
            }
          `}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 3L14 10H2L8 3Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-sm font-semibold tabular-nums leading-none">
            {question.upvotes}
          </span>
        </button>
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-base font-medium leading-snug break-words">
          {question.question_text}
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
          <span className="font-medium">{question.name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={question.created_at}>
            {formatTimeAgo(question.created_at)}
          </time>
        </div>
      </div>
    </article>
  )
}
