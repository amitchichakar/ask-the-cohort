import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('askthecohort')
    .select('*')
    .order('upvotes', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  let body: { name?: string; question_text?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, question_text } = body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  if (
    !question_text ||
    typeof question_text !== 'string' ||
    question_text.trim().length === 0
  ) {
    return NextResponse.json(
      { error: 'Question text is required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('askthecohort')
    .insert({
      name: name.trim(),
      question_text: question_text.trim(),
      upvotes: 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
