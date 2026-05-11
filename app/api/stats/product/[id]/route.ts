import { NextRequest, NextResponse } from 'next/server'
import { getProductStats } from '../../../../../services/db'
import { validateApiKey } from '../../../../../lib/validateApiKey'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const { id: targetId } = await params
    if (!targetId) {
      return NextResponse.json({ error: 'targetId es requerido' }, { status: 400 })
    }

    const stats = await getProductStats(targetId)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas del producto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
