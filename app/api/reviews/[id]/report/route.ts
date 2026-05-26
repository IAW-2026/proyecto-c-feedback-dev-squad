import { NextRequest, NextResponse } from 'next/server'
import { createReport } from '../../../../../services/db'
import { validateApiKey } from '../../../../../lib/validateApiKey'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateApiKey(req, ['buyer-app', 'seller-app'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const { id: reviewId } = await params
    if (!reviewId) {
      return NextResponse.json({ error: 'reviewId es requerido' }, { status: 400 })
    }

    const body = await req.json()
    const { razon, reporterId, reporterName } = body

    if (!razon || typeof razon !== 'string' || !razon.trim()) {
      return NextResponse.json({ error: 'razon es requerido' }, { status: 400 })
    }
    if (razon.trim().length < 10) {
      return NextResponse.json({ error: 'razon debe tener al menos 10 caracteres' }, { status: 400 })
    }
    if (razon.length > 200) {
      return NextResponse.json({ error: 'razon no puede superar los 200 caracteres' }, { status: 400 })
    }
    if (!reporterId || typeof reporterId !== 'string') {
      return NextResponse.json({ error: 'reporterId es requerido' }, { status: 400 })
    }

    const report = await createReport({ reseñaId: reviewId, razon }, reporterId, reporterName)
    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error al reportar reseña:', error)
    if (error instanceof Error) {
      if (error.message === 'Review no encontrada') {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      if (error.message === 'Esta reseña ya fue reportada') {
        return NextResponse.json({ error: error.message }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
