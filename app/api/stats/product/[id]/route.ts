import { NextRequest, NextResponse } from 'next/server'
import { getProductStats } from '../../../../../services/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // TODO: agregar validateApiKey() cuando se defina con el equipo
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
