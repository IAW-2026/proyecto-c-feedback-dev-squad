import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { ensureUser } from '../../../../../lib/ensureUser'
import { validateApiKey } from '../../../../../lib/validateApiKey'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const { id: reviewId } = await params
    if (!reviewId) {
      return NextResponse.json({ error: 'reviewId es requerido' }, { status: 400 })
    }

    const review = await prisma.reseña.findUnique({ where: { id: reviewId } })
    if (!review) {
      return NextResponse.json({ error: 'Review no encontrada' }, { status: 404 })
    }
    if (review.estado === 'removed') {
      return NextResponse.json({ error: 'No se puede reportar una reseña eliminada' }, { status: 400 })
    }
    if (review.estado === 'reported') {
      return NextResponse.json({ error: 'Esta reseña ya fue reportada' }, { status: 409 })
    }

    const body = await req.json()
    const { razon, reporterId, reporterName } = body

    if (!razon || typeof razon !== 'string' || !razon.trim()) {
      return NextResponse.json({ error: 'razon es requerido' }, { status: 400 })
    }
    if (!reporterId || typeof reporterId !== 'string') {
      return NextResponse.json({ error: 'reporterId es requerido' }, { status: 400 })
    }

    await ensureUser(reporterId, reporterName)

    const [report] = await Promise.all([
      prisma.reporte.create({
        data: {
          reseñaId: reviewId,
          reporterId,
          razon,
        },
        include: {
          reseña: { include: { usuario: true } },
          reportero: true,
        },
      }),
      prisma.reseña.update({
        where: { id: reviewId },
        data: { estado: 'reported' },
      }),
    ])

    const result = {
      id: report.id,
      reseñaId: report.reseñaId,
      reporterId: report.reporterId,
      razon: report.razon,
      resuelto: report.resuelto,
      fecha: report.fecha,
      review: report.reseña ? {
        id: report.reseña.id,
        tipo: report.reseña.tipo,
        targetId: report.reseña.targetId,
        userId: report.reseña.userId,
        rating: report.reseña.rating,
        comentario: report.reseña.comentario,
        estado: report.reseña.estado,
        fecha: report.reseña.fecha,
        userName: report.reseña.usuario?.nombre,
      } : undefined,
      reporterName: report.reportero?.nombre,
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error al reportar reseña:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
