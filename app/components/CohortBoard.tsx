'use client'

import { useRef } from 'react'
import type { Question } from '@/lib/types'
import QuestionForm from './QuestionForm'
import QuestionFeed, { type QuestionFeedHandle } from './QuestionFeed'

interface CohortBoardProps {
  initialQuestions: Question[]
}

export default function CohortBoard({ initialQuestions }: CohortBoardProps) {
  const feedRef = useRef<QuestionFeedHandle>(null)

  function handleQuestionAdded(question: Question) {
    feedRef.current?.prependQuestion(question)
  }

  return (
    <div className="flex flex-col gap-6">
      <QuestionForm onQuestionAdded={handleQuestionAdded} />
      <QuestionFeed ref={feedRef} initialQuestions={initialQuestions} />
    </div>
  )
}
