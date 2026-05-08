import { NextRequest, NextResponse } from 'next/server'

/*
  GET /api/stats/product/[id]
  Obtiene estadísticas de reseñas de un producto (promedio, total, distribución).

  TODO:
  - Extrae el [id] del producto de los params
  - Agrega en DB con prisma.review.aggregate({
      where: { targetId: id, tipo: 'product', estado: 'published' },
      _avg: { rating: true },
      _count: { id: true }
    })
  - Para la distribución de estrellas, ejecuta 5 count queries o usa groupBy:
      prisma.review.groupBy({
        by: ['rating'],
        where: { targetId: id, tipo: 'product', estado: 'published' },
        _count: { id: true }
      })
  - Retorna 200 con ReviewStats: { averageRating, totalReviews, ratingDistribution: { 1: N, ..., 5: N } }
  - Si el producto no tiene reviews → averageRating: 0, totalReviews: 0, distribución vacía
  - Si hay error de DB → 500 { error: mensaje }
*/

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}
