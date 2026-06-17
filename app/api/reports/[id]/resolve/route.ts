import { NextRequest, NextResponse } from 'next/server'
import { resolveReport } from '../../../../../services/db'
import { validateApiKey } from '../../../../../services/validateApiKey'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateApiKey(req, ['control-plane'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const { id: reportId } = await params
    if (!reportId) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    const body = await req.json()
    const { action, comentarioAdmin, adminId } = body

    if (!action || !['dismiss', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'action debe ser "dismiss" o "remove"' }, { status: 400 })
    }
    if (!adminId || typeof adminId !== 'string') {
      return NextResponse.json({ error: 'adminId es requerido' }, { status: 400 })
    }

    const report = await resolveReport(reportId, {
      adminId,
      action,
      comentarioAdmin: comentarioAdmin ?? undefined,
    })

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 })
    }
    return NextResponse.json(report)
  } catch (error) {
    console.error('Error al resolver reporte:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
