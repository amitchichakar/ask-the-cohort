'use client'

import { useState, useImperativeHandle, forwardRef } from 'react'
import type { Question } from '@/lib/types'
import QuestionCard from './QuestionCard'

interface QuestionFeedProps {
  initialQuestions: Question[]
}

export interface QuestionFeedHandle {
  prependQuestion: (question: Question) => void
}

const QuestionFeed = forwardRef<QuestionFeedHandle, QuestionFeedProps>(
  function QuestionFeed({ initialQuestions }, ref) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions)

    useImperativeHandle(ref, () => ({
      prependQuestion(question: Question) {
        setQuestions((prev) => {
          const updated = [question, ...prev]
          return updated.slice().sort((a, b) => b.upvotes - a.upvotes)
        })
      },
    }))

    function handleUpvote(id: string) {
      setQuestions((prev) => {
        const updated = prev.map((q) =>
          q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q
        )
        return updated.slice().sort((a, b) => b.upvotes - a.upvotes)
      })
    }

    if (questions.length === 0) {
      return (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg">No questions yet.</p>
          <p className="text-sm mt-1">Be the first to ask one above.</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onUpvote={handleUpvote}
          />
        ))}
      </div>
    )
  }
)

export default QuestionFeed
