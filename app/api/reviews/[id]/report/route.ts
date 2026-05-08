import { NextRequest, NextResponse } from 'next/server'

/*
  POST /api/reviews/[id]/report
  Reporta una reseña específica.

  TODO:
  - Extrae el [id] de la review de los params
  - Parsea el body como JSON
  - Valida los campos: razon (string no vacío), reporterId (string)
  - Verifica que la review existe con prisma.review.findUnique({ where: { id } })
    - Si no existe → 404 { error: 'Review no encontrada' }
  - Crea el Report en DB con prisma.report.create({
      data: {
        reviewId: id,
        reporterId,
        razon,
        resuelto: false
      }
    })
  - Actualiza el estado de la review a 'reported' con prisma.review.update({
      where: { id },
      data: { estado: 'reported' }
    })
  - Retorna 201 con el report creado
  - Si faltan campos → 400 { error: mensaje }
  - Si hay error de DB → 500 { error: mensaje }
*/

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}
