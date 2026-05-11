import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { ensureUser } from '../../../../lib/ensureUser'
import { resolveTargetName } from '../../../../services/db'
import { validateApiKey } from '../../../../lib/validateApiKey'

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { targetId, userId, userName, rating, comentario } = body

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
    if (comentario.length > 500) {
      return NextResponse.json({ error: 'comentario no puede superar los 500 caracteres' }, { status: 400 })
    }

    await ensureUser(userId, userName)

    const existing = await prisma.reseña.findFirst({
      where: {
        userId,
        tipo: 'seller',
        targetId,
        estado: { in: ['published', 'reported'] },
      },
    })
    if (existing) {
      return NextResponse.json({ error: 'Ya existe una reseña activa para este vendedor' }, { status: 409 })
    }

    const review = await prisma.reseña.create({
      data: {
        tipo: 'seller',
        targetId,
        userId,
        rating,
        comentario,
        estado: 'published',
      },
      include: { usuario: true },
    })

    const resolved = await resolveTargetName('seller', targetId)
    const result = {
      id: review.id,
      tipo: review.tipo,
      targetId: review.targetId,
      userId: review.userId,
      rating: review.rating,
      comentario: review.comentario,
      estado: review.estado,
      fecha: review.fecha,
      userName: review.usuario.nombre,
      targetName: resolved.targetName,
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error al crear reseña de vendedor:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
