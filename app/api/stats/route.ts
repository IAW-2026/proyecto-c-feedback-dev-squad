import { NextRequest, NextResponse } from 'next/server'
import { getHomeStats } from '../../../services/db'
import { validateApiKey } from '../../../services/validateApiKey'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req, ['control-plane', 'analytics'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const stats = await getHomeStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas globales:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
