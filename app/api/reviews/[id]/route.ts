import { NextRequest, NextResponse } from 'next/server'
import { adminUpdateReview } from '../../../../services/db'
import { validateApiKey } from '../../../../services/validateApiKey'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateApiKey(req, ['control-plane'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }

  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    const body = await req.json()
    const review = await adminUpdateReview(id, {
      rating: body.rating,
      comentario: body.comentario,
      estado: body.estado,
    })

    return NextResponse.json(review)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
