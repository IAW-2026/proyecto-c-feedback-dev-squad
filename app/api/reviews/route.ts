import { NextRequest, NextResponse } from 'next/server'
import { getAllReviews } from '../../../services/db'
import { validateApiKey } from '../../../services/validateApiKey'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req, ['control-plane', 'analytics'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 10
    const search = url.searchParams.get('search') || ''
    const tipo = url.searchParams.get('tipo') as 'product' | 'seller' | undefined

    const result = await getAllReviews({ page, limit, search, tipo })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener reseñas:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
