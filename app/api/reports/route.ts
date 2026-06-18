import { NextRequest, NextResponse } from 'next/server'
import { getReports, createReport } from '../../../services/db'
import { validateApiKey } from '../../../services/validateApiKey'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req, ['control-plane'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 10
    const search = url.searchParams.get('search') || ''
    const resolvedParam = url.searchParams.get('resolved')
    const resolved = resolvedParam === 'true' ? true : resolvedParam === 'false' ? false : undefined

    const result = await getReports({ page, limit, search, resolved })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener reportes:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req, ['control-plane', 'buyer-app', 'seller-app'])) {
    return NextResponse.json({ error: 'API key inválida o faltante' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { reseñaId, razon, reporterId, reporterName } = body

    if (!reseñaId || typeof reseñaId !== 'string') {
      return NextResponse.json({ error: 'reseñaId es requerido' }, { status: 400 })
    }
    if (!razon || typeof razon !== 'string' || !razon.trim()) {
      return NextResponse.json({ error: 'razon es requerido' }, { status: 400 })
    }
    if (razon.trim().length < 10) {
      return NextResponse.json({ error: 'razon debe tener al menos 10 caracteres' }, { status: 400 })
    }
    if (!reporterId || typeof reporterId !== 'string') {
      return NextResponse.json({ error: 'reporterId es requerido' }, { status: 400 })
    }

    const report = await createReport({ reseñaId, razon }, reporterId, reporterName ?? 'Usuario')
    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error al crear reporte:', error)
    if (error instanceof Error) {
      if (error.message === 'Review no encontrada') {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      if (error.message === 'Esta reseña ya fue reportada') {
        return NextResponse.json({ error: error.message }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
