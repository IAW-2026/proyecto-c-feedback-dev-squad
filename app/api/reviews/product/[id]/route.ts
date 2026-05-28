import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { getTargetReviews, getProductStats } from '../../../../../services/db'
import { generateReviewSummary } from '../../../../../lib/gemini'
import { validateApiKey } from '../../../../../services/validateApiKey'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateApiKey(req, ['buyer-app'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
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

    const result = await getTargetReviews(targetId, 'product', { page, limit, search })

    if (includeSummary) {
      const stats = await getProductStats(targetId)

      const allReviews = await prisma.reseña.findMany({
        where: { targetId, tipo: 'product', estado: 'published' },
        include: { usuario: true },
        take: 50,
        orderBy: { fecha: 'desc' },
      })

      let aiSummary: string | undefined
      if (allReviews.length > 0) {
        const product = await prisma.producto.findUnique({ where: { id: targetId } })
        const targetName = url.searchParams.get('name') || product?.nombre || 'el producto'
        aiSummary = await generateReviewSummary(targetName, allReviews)
      }

      return NextResponse.json({ ...result, stats, aiSummary })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener reseñas del producto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
