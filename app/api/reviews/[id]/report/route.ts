import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // TODO: agregar validateApiKey() cuando se defina con el equipo
  try {
    const { id: reviewId } = await params
    if (!reviewId) {
      return NextResponse.json({ error: 'reviewId es requerido' }, { status: 400 })
    }

    const review = await prisma.review.findUnique({ where: { id: reviewId } })
    if (!review) {
      return NextResponse.json({ error: 'Review no encontrada' }, { status: 404 })
    }

    const body = await req.json()
    const { razon, reporterId, reporterName } = body

    if (!razon || typeof razon !== 'string' || !razon.trim()) {
      return NextResponse.json({ error: 'razon es requerido' }, { status: 400 })
    }
    if (!reporterId || typeof reporterId !== 'string') {
      return NextResponse.json({ error: 'reporterId es requerido' }, { status: 400 })
    }

    const [report] = await Promise.all([
      prisma.report.create({
        data: {
          reviewId,
          reporterId,
          reporterName: reporterName ?? null,
          razon,
        },
        include: { review: true },
      }),
      prisma.review.update({
        where: { id: reviewId },
        data: { estado: 'reported' },
      }),
    ])

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error al reportar reseña:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
