import { supabase } from '@/lib/supabase'
import type { Question } from '@/lib/types'
import CohortBoard from './components/CohortBoard'

async function getInitialQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('askthecohort')
    .select('*')
    .order('upvotes', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return data ?? []
}

export default async function HomePage() {
  const initialQuestions = await getInitialQuestions()

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Ask the Cohort
        </h1>
        <p className="mt-1.5 text-zinc-400 text-sm">
          Ask questions. Upvote the ones that matter most.
        </p>
      </header>

      {/* Board */}
      <CohortBoard initialQuestions={initialQuestions} />
    </main>
  )
}
