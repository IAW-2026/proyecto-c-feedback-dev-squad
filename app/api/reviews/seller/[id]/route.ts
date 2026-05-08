import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { getTargetReviews, getSellerStats } from '../../../../../services/db'
import { generateReviewSummary } from '../../../../../lib/gemini'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // TODO: agregar validateApiKey() cuando se defina con el equipo
  try {
    const { id: targetId } = await params
    if (!targetId) {
      return NextResponse.json({ error: 'targetId es requerido' }, { status: 400 })
    }

    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 10
    const search = url.searchParams.get('search') || ''
    const includeSummary = url.searchParams.get('includeSummary') === 'true'

    const result = await getTargetReviews(targetId, 'seller', { page, limit, search })

    if (includeSummary) {
      const stats = await getSellerStats(targetId)

      const allReviews = await prisma.review.findMany({
        where: { targetId, tipo: 'seller', estado: 'published' },
        take: 50,
        orderBy: { fecha: 'desc' },
      })

      let aiSummary: string | undefined
      if (allReviews.length > 0) {
        const targetName = url.searchParams.get('name') || allReviews[0].targetName || 'el vendedor'
        aiSummary = await generateReviewSummary(targetName, allReviews)
      }

      return NextResponse.json({ ...result, stats, aiSummary })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener reseñas del vendedor:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
