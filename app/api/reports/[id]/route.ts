import { NextRequest, NextResponse } from 'next/server'
import { getReportById } from '../../../../services/db'
import { validateApiKey } from '../../../../services/validateApiKey'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateApiKey(req, ['control-plane'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    const report = await getReportById(id)
    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 })
    }
    return NextResponse.json(report)
  } catch (error) {
    console.error('Error al obtener reporte:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
