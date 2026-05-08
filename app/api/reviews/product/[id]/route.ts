import { NextRequest, NextResponse } from 'next/server'

/*
  GET /api/reviews/product/[id]
  Obtiene reseñas de un producto.

  TODO:
  - Extrae el [id] de los params (req.nextUrl.pathname o params)
  - Lee query params opcionales: page (default 1), limit (default 10), search
  - Busca en DB con prisma.review.findMany({
      where: { targetId: id, tipo: 'product', estado: 'published' },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { fecha: 'desc' }
    })
  - También cuenta el total con prisma.review.count({ where: ... })
  - Retorna 200 con PaginatedResponse: { data, total, page, limit, totalPages }
  - Si no encuentra reviews → 200 con data vacío (no 404)
  - Si hay error de DB → 500 { error: mensaje }
*/

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}
