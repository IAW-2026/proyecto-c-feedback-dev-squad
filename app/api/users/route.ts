import { NextRequest, NextResponse } from 'next/server'
import { ensureUser } from '../../../services/ensureUser'
import { validateApiKey } from '../../../services/validateApiKey'

export async function POST(req: NextRequest) {
  if (!validateApiKey(req, ['buyer-app'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }

  const body = await req.json()
  const { id, nombre, apellido, email, isAdmin } = body

  if (!id || !nombre) {
    return NextResponse.json({ error: 'id y nombre son requeridos' }, { status: 400 })
  }

  const user = await ensureUser(id, nombre, apellido, email, isAdmin)
  return NextResponse.json({ ok: true, user })
}
