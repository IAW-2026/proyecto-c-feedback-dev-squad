import { NextRequest, NextResponse } from 'next/server'

/*
  POST /api/reviews/product
  Crea una reseña de producto.

  TODO:
  - Parsea el body como JSON
  - Valida los campos: targetId (string), rating (number 1-5), comentario (string no vacío)
  - Crea la Review en DB con prisma.review.create({
      data: {
        tipo: 'product',
        targetId,
        userId, // idealmente vendría del body o se asigna según quién llama
        rating,
        comentario,
        estado: 'published'
      }
    })
  - Retorna 201 con la review creada
  - Si faltan campos o rating es inválido → 400 { error: mensaje }
  - Si hay error de DB → 500 { error: mensaje }
*/

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}
