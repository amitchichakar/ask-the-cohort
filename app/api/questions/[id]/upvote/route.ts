import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Question ID is required' }, { status: 400 })
  }

  // Fetch current upvotes, then increment
  const { data: existing, error: fetchError } = await supabase
    .from('askthecohort')
    .select('upvotes')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('askthecohort')
    .update({ upvotes: existing.upvotes + 1 })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
