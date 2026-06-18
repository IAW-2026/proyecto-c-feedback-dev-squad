import { NextRequest, NextResponse } from 'next/server'
import { getReportById } from '../../../../../services/db'
import { getAIOpinion } from '../../../../../lib/gemini'
import { validateApiKey } from '../../../../../services/validateApiKey'

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

    const opinion = await getAIOpinion(report)
    return NextResponse.json({ opinion })
  } catch (error) {
    console.error('Error al obtener opinión IA:', error)
    const message = error instanceof Error ? error.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
