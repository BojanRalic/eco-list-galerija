import { kv } from '@vercel/kv'
import { applySelectionUpdate } from '@/lib/selection'

const KEY = 'bio-list-selection'

export async function GET() {
  const ids = await kv.get(KEY) ?? []
  return Response.json(ids)
}

export async function POST(request) {
  const { id, action } = await request.json()
  const ids = await kv.get(KEY) ?? []
  const updated = applySelectionUpdate(ids, id, action)
  await kv.set(KEY, updated)
  return Response.json(updated)
}
