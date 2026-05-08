import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: NextRequest) {
  // TODO: agregar validateApiKey() cuando se defina con el equipo
  try {
    const body = await req.json()
    const { targetId, userId, userName, rating, comentario, targetName } = body

    if (!targetId || typeof targetId !== 'string') {
      return NextResponse.json({ error: 'targetId es requerido' }, { status: 400 })
    }
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 })
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'rating debe ser un número entero entre 1 y 5' }, { status: 400 })
    }
    if (!comentario || typeof comentario !== 'string' || comentario.trim().length < 10) {
      return NextResponse.json({ error: 'comentario debe tener al menos 10 caracteres' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        tipo: 'seller',
        targetId,
        targetName: targetName ?? null,
        userId,
        userName: userName ?? null,
        rating,
        comentario,
        estado: 'published',
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error al crear reseña de vendedor:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
