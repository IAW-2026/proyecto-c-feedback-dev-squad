import { NextRequest, NextResponse } from 'next/server'
import { createReview as dbCreateReview } from '../../../../services/db'
import { validateApiKey } from '../../../../lib/validateApiKey'

function errorStatus(message: string): number {
  if (message.toLowerCase().includes('ya existe')) return 409
  return 400
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req, ['buyer-app'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { targetId, userId, userName, rating, comentario } = body

    const review = await dbCreateReview(
      { tipo: 'product', targetId, rating, comentario },
      userId,
      userName ?? 'Usuario',
    )

    return NextResponse.json({
      id: review.id,
      tipo: review.tipo,
      targetId: review.targetId,
      targetName: review.targetName,
      sellerName: review.sellerName,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      comentario: review.comentario,
      estado: review.estado,
      fecha: review.fecha,
    }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('Error al crear reseña de producto:', error)
    return NextResponse.json({ error: message }, { status: errorStatus(message) })
  }
}
