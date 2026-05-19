import { prisma } from '../lib/prisma'
import { ensureUser } from '../lib/ensureUser'
import { getUserPurchases } from './purchases'
import type {
  Review,
  Report,
  ReviewStats,
  HomeStats,
  PaginationParams,
  PaginatedResponse,
  CreateReviewInput,
  UpdateReviewInput,
  CreateReportInput,
} from '../types'

const MAX_COMENTARIO_LENGTH = 200
const MAX_ADMIN_COMMENT_LENGTH = 500

function sanitizePagination(page: number, limit: number): { page: number; limit: number } {
  return {
    page: Math.max(1, Math.floor(page)),
    limit: Math.min(100, Math.max(1, Math.floor(limit))),
  }
}

interface ResolveOptions {
  adminId: string
  adminComment?: string
  action: 'dismiss' | 'remove'
}

export async function resolveTargetName(tipo: string, targetId: string): Promise<{ targetName: string; sellerName?: string }> {
  if (tipo === 'product') {
    const product = await prisma.producto.findUnique({
      where: { id: targetId },
      include: { vendedor: true },
    })
    if (!product) return { targetName: 'Producto' }
    return { targetName: product.nombre, sellerName: product.vendedor?.nombre }
  }
  if (tipo === 'seller') {
    const seller = await prisma.vendedor.findUnique({ where: { id: targetId } })
    return { targetName: seller?.nombre ?? 'Vendedor' }
  }
  return { targetName: 'Desconocido' }
}

async function resolveTargetNames(
  items: { tipo: string; targetId: string }[],
): Promise<Map<string, { targetName: string; sellerName?: string }>> {
  const productIds = [...new Set(items.filter(r => r.tipo === 'product').map(r => r.targetId))]
  const sellerIds = [...new Set(items.filter(r => r.tipo === 'seller').map(r => r.targetId))]

  const [products, sellers] = await Promise.all([
    prisma.producto.findMany({
      where: { id: { in: productIds } },
      include: { vendedor: true },
    }),
    prisma.vendedor.findMany({ where: { id: { in: sellerIds } } }),
  ])

  const productMap = new Map(products.map(p => [p.id, p]))
  const sellerMap = new Map(sellers.map(s => [s.id, s]))
  const result = new Map<string, { targetName: string; sellerName?: string }>()

  for (const item of items) {
    if (result.has(`${item.tipo}:${item.targetId}`)) continue
    if (item.tipo === 'product') {
      const p = productMap.get(item.targetId)
      result.set(`${item.tipo}:${item.targetId}`, {
        targetName: p?.nombre ?? 'Producto',
        sellerName: p?.vendedor?.nombre,
      })
    } else {
      const s = sellerMap.get(item.targetId)
      result.set(`${item.tipo}:${item.targetId}`, {
        targetName: s?.nombre ?? 'Vendedor',
      })
    }
  }
  return result
}

function mapReview(r: any): Review {
  return {
    id: r.id,
    tipo: r.tipo as Review['tipo'],
    targetId: r.targetId,
    userId: r.userId,
    rating: r.rating,
    comentario: r.comentario,
    estado: r.estado as Review['estado'],
    fecha: r.fecha,
    userName: r.usuario?.nombre,
  }
}

function mapReport(r: any): Report {
  return {
    id: r.id,
    reseñaId: r.reseñaId,
    reporterId: r.reporterId,
    razon: r.razon,
    resuelto: r.resuelto,
    fecha: r.fecha,
    review: r.reseña ? mapReview({ ...r.reseña, usuario: r.reseña.usuario }) : undefined,
    reporterName: r.reportero?.nombre,
    resolvedBy: r.resolvedor?.nombre,
    adminComment: r.adminComment ?? undefined,
  }
}

export async function getReviews(params: PaginationParams): Promise<PaginatedResponse<Review>> {
  const { page, limit } = sanitizePagination(params.page, params.limit)
  const where: Record<string, unknown> = {}

  if (params.search) {
    const q = params.search
    where.OR = [
      { comentario: { contains: q, mode: 'insensitive' } },
      { usuario: { nombre: { contains: q, mode: 'insensitive' } } },
    ]
  }

  if (params.tipo) {
    where.tipo = params.tipo
  }

  const [data, total] = await Promise.all([
    prisma.reseña.findMany({
      where,
      include: { usuario: true },
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.reseña.count({ where }),
  ])

  const reviews = data.map(r => mapReview(r))
  const targetMap = await resolveTargetNames(reviews)
  for (const review of reviews) {
    const resolved = targetMap.get(`${review.tipo}:${review.targetId}`)
    if (resolved) {
      review.targetName = resolved.targetName
      review.sellerName = resolved.sellerName
    }
  }

  return { data: reviews, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getReviewById(id: string): Promise<Review | null> {
  const review = await prisma.reseña.findUnique({
    where: { id },
    include: { usuario: true },
  })
  if (!review) return null

  const mapped = mapReview(review)
  const resolved = await resolveTargetName(mapped.tipo, mapped.targetId)
  mapped.targetName = resolved.targetName
  mapped.sellerName = resolved.sellerName
  return mapped
}

export async function getMyReviews(userId: string, params: PaginationParams): Promise<PaginatedResponse<Review>> {
  const { page, limit } = sanitizePagination(params.page, params.limit)
  const where: Record<string, unknown> = { userId }

  if (params.search) {
    const q = params.search
    const [matchingProducts, matchingSellers] = await Promise.all([
      prisma.producto.findMany({
        where: { nombre: { contains: q, mode: 'insensitive' } },
        select: { id: true },
      }),
      prisma.vendedor.findMany({
        where: { nombre: { contains: q, mode: 'insensitive' } },
        select: { id: true },
      }),
    ])

    const productIds = matchingProducts.map(p => p.id)
    const sellerIds = matchingSellers.map(s => s.id)

    where.OR = [
      { tipo: 'product', targetId: { in: productIds } },
      { tipo: 'seller', targetId: { in: sellerIds } },
    ]
  }

  if (params.tipo) {
    where.tipo = params.tipo
  }

  const [data, total] = await Promise.all([
    prisma.reseña.findMany({
      where,
      include: { usuario: true },
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.reseña.count({ where }),
  ])

  const reviews = data.map(r => mapReview(r))
  const targetMap = await resolveTargetNames(reviews)
  for (const review of reviews) {
    const resolved = targetMap.get(`${review.tipo}:${review.targetId}`)
    if (resolved) {
      review.targetName = resolved.targetName
      review.sellerName = resolved.sellerName
    }
  }

  return { data: reviews, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getTargetReviews(targetId: string, tipo: 'product' | 'seller', params: PaginationParams): Promise<PaginatedResponse<Review>> {
  const { page, limit } = sanitizePagination(params.page, params.limit)
  const where: Record<string, unknown> = { targetId, tipo, estado: 'published' }

  if (params.search) {
    const q = params.search
    where.OR = [
      { comentario: { contains: q, mode: 'insensitive' } },
      { usuario: { nombre: { contains: q, mode: 'insensitive' } } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.reseña.findMany({
      where,
      include: { usuario: true },
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.reseña.count({ where }),
  ])

  const reviews = data.map(r => mapReview(r))
  const resolved = await resolveTargetName(tipo, targetId)
  for (const review of reviews) {
    review.targetName = resolved.targetName
    review.sellerName = resolved.sellerName
  }

  return { data: reviews, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function createReview(
  input: CreateReviewInput,
  userId: string,
  userName: string,
): Promise<Review> {
  if (!input.targetId || typeof input.targetId !== 'string') {
    throw new Error('targetId es requerido')
  }
  if (input.tipo !== 'product' && input.tipo !== 'seller') {
    throw new Error('tipo debe ser "product" o "seller"')
  }
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error('rating debe ser un número entero entre 1 y 5')
  }
  if (!input.comentario || input.comentario.trim().length < 10) {
    throw new Error('comentario debe tener al menos 10 caracteres')
  }
  if (input.comentario.length > MAX_COMENTARIO_LENGTH) {
    throw new Error(`comentario no puede superar los ${MAX_COMENTARIO_LENGTH} caracteres`)
  }
  if (!userId) {
    throw new Error('userId es requerido')
  }

  if (input.tipo === 'product') {
    const product = await prisma.producto.findUnique({ where: { id: input.targetId } })
    if (!product) throw new Error('Producto no encontrado')
  } else {
    const seller = await prisma.vendedor.findUnique({ where: { id: input.targetId } })
    if (!seller) throw new Error('Vendedor no encontrado')
  }

  const purchases = await getUserPurchases(userId)
  if (input.tipo === 'product' && !purchases.productIds.includes(input.targetId)) {
    throw new Error('No puedes reseñar un producto que no compraste')
  }
  if (input.tipo === 'seller' && !purchases.sellerIds.includes(input.targetId)) {
    throw new Error('No puedes reseñar un vendedor al que no le compraste')
  }

  await ensureUser(userId, userName)

  const existing = await prisma.reseña.findFirst({
    where: {
      userId,
      tipo: input.tipo,
      targetId: input.targetId,
      estado: { in: ['published', 'reported'] },
    },
  })
  if (existing) {
    throw new Error('Ya existe una reseña activa para este producto/vendedor')
  }

  const review = await prisma.reseña.create({
    data: {
      tipo: input.tipo,
      targetId: input.targetId,
      userId,
      rating: input.rating,
      comentario: input.comentario,
      estado: 'published',
    },
    include: { usuario: true },
  })

  const mapped = mapReview(review)
  const resolved = await resolveTargetName(mapped.tipo, mapped.targetId)
  mapped.targetName = resolved.targetName
  mapped.sellerName = resolved.sellerName
  return mapped
}

export async function updateReview(id: string, input: UpdateReviewInput, userId: string): Promise<Review | null> {
  const existing = await prisma.reseña.findUnique({ where: { id } })
  if (!existing) throw new Error('Reseña no encontrada')
  if (existing.userId !== userId) throw new Error('No autorizado')
  if (existing.estado !== 'published') throw new Error('No se puede modificar una reseña reportada o eliminada')

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error('rating debe ser un número entero entre 1 y 5')
  }
  if (!input.comentario || input.comentario.trim().length < 10) {
    throw new Error('comentario debe tener al menos 10 caracteres')
  }
  if (input.comentario.length > MAX_COMENTARIO_LENGTH) {
    throw new Error(`comentario no puede superar los ${MAX_COMENTARIO_LENGTH} caracteres`)
  }

  const review = await prisma.reseña.update({
    where: { id },
    data: { rating: input.rating, comentario: input.comentario, fecha: new Date() },
    include: { usuario: true },
  })

  const mapped = mapReview(review)
  const resolved = await resolveTargetName(mapped.tipo, mapped.targetId)
  mapped.targetName = resolved.targetName
  mapped.sellerName = resolved.sellerName
  return mapped
}

export async function deleteReview(id: string, userId: string): Promise<Review | null> {
  const existing = await prisma.reseña.findUnique({ where: { id } })
  if (!existing) throw new Error('Reseña no encontrada')
  if (existing.userId !== userId) throw new Error('No autorizado')
  if (existing.estado !== 'published') throw new Error('No se puede eliminar una reseña reportada o eliminada')

  const review = await prisma.reseña.update({
    where: { id },
    data: { estado: 'removed' },
    include: { usuario: true },
  })

  const mapped = mapReview(review)
  const resolved = await resolveTargetName(mapped.tipo, mapped.targetId)
  mapped.targetName = resolved.targetName
  mapped.sellerName = resolved.sellerName
  return mapped
}

export async function getProductStats(targetId: string): Promise<ReviewStats> {
  const where = { targetId, tipo: 'product', estado: 'published' }

  const [aggregate, distribution] = await Promise.all([
    prisma.reseña.aggregate({
      where,
      _avg: { rating: true },
      _count: { id: true },
    }),
    prisma.reseña.groupBy({
      by: ['rating'],
      where,
      _count: { id: true },
    }),
  ])

  const ratingDistribution: Record<number, number> = {}
  for (let i = 1; i <= 5; i++) ratingDistribution[i] = 0
  for (const entry of distribution) ratingDistribution[entry.rating] = entry._count.id

  return {
    averageRating: Math.round((aggregate._avg.rating ?? 0) * 10) / 10,
    totalReviews: aggregate._count.id,
    ratingDistribution,
  }
}

export async function getSellerStats(targetId: string): Promise<ReviewStats> {
  const where = { targetId, tipo: 'seller', estado: 'published' }

  const [aggregate, distribution] = await Promise.all([
    prisma.reseña.aggregate({
      where,
      _avg: { rating: true },
      _count: { id: true },
    }),
    prisma.reseña.groupBy({
      by: ['rating'],
      where,
      _count: { id: true },
    }),
  ])

  const ratingDistribution: Record<number, number> = {}
  for (let i = 1; i <= 5; i++) ratingDistribution[i] = 0
  for (const entry of distribution) ratingDistribution[entry.rating] = entry._count.id

  return {
    averageRating: Math.round((aggregate._avg.rating ?? 0) * 10) / 10,
    totalReviews: aggregate._count.id,
    ratingDistribution,
  }
}

export async function getHomeStats(): Promise<HomeStats> {
  const now = new Date()
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
  const wherePublished = { estado: 'published' as const }

  const [
    totalReviews,
    reviewsThisYear,
    productGroups,
    sellerGroups,
    topReviewedRaw,
    latestReviewRaw,
  ] = await Promise.all([
    prisma.reseña.count({ where: wherePublished }),
    prisma.reseña.count({ where: { ...wherePublished, fecha: { gte: firstDayOfYear } } }),
    prisma.reseña.groupBy({
      by: ['targetId'],
      where: { ...wherePublished, tipo: 'product' },
      _avg: { rating: true },
      _count: { id: true },
      orderBy: { _avg: { rating: 'desc' } },
      take: 10,
    }),
    prisma.reseña.groupBy({
      by: ['targetId'],
      where: { ...wherePublished, tipo: 'seller' },
      _avg: { rating: true },
      _count: { id: true },
      orderBy: { _avg: { rating: 'desc' } },
      take: 10,
    }),
    prisma.reseña.groupBy({
      by: ['targetId'],
      where: { ...wherePublished, tipo: 'product' },
      _count: { id: true },
      _avg: { rating: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    }),
    prisma.reseña.findFirst({
      where: wherePublished,
      orderBy: { fecha: 'desc' },
      include: { usuario: true },
    }),
  ])

  const topProductEntry = productGroups.find(g => g._count.id >= 2) ?? productGroups[0] ?? null
  let topProduct = null
  if (topProductEntry) {
    const product = await prisma.producto.findUnique({ where: { id: topProductEntry.targetId } })
    if (product) {
      topProduct = {
        id: product.id,
        nombre: product.nombre,
        averageRating: Math.round((topProductEntry._avg.rating ?? 0) * 10) / 10,
        totalReviews: topProductEntry._count.id,
      }
    }
  }

  const topSellerEntry = sellerGroups.find(g => g._count.id >= 2) ?? sellerGroups[0] ?? null
  let topSeller = null
  if (topSellerEntry) {
    const seller = await prisma.vendedor.findUnique({ where: { id: topSellerEntry.targetId } })
    if (seller) {
      topSeller = {
        id: seller.id,
        nombre: seller.nombre,
        averageRating: Math.round((topSellerEntry._avg.rating ?? 0) * 10) / 10,
        totalReviews: topSellerEntry._count.id,
      }
    }
  }

  let topReviewed = null
  if (topReviewedRaw.length > 0) {
    const entry = topReviewedRaw[0]
    const product = await prisma.producto.findUnique({ where: { id: entry.targetId } })
    if (product) {
      topReviewed = {
        id: product.id,
        nombre: product.nombre,
        averageRating: Math.round((entry._avg.rating ?? 0) * 10) / 10,
        totalReviews: entry._count.id,
      }
    }
  }

  let latestReview = null
  if (latestReviewRaw) {
    const resolved = await resolveTargetName(latestReviewRaw.tipo, latestReviewRaw.targetId)
    latestReview = {
      id: latestReviewRaw.id,
      tipo: latestReviewRaw.tipo,
      targetName: resolved.targetName,
      rating: latestReviewRaw.rating,
      comentario: latestReviewRaw.comentario,
      userName: latestReviewRaw.usuario?.nombre ?? 'Usuario',
      fecha: latestReviewRaw.fecha.toISOString(),
    }
  }

  return {
    totalReviews,
    reviewsThisYear,
    topProduct,
    topSeller,
    topReviewed,
    latestReview,
  }
}

export async function getReports(params: PaginationParams): Promise<PaginatedResponse<Report>> {
  const { page, limit } = sanitizePagination(params.page, params.limit)
  const where: Record<string, unknown> = {}

  if (params.search) {
    const q = params.search
    where.OR = [
      { razon: { contains: q, mode: 'insensitive' } },
      { reseña: { comentario: { contains: q, mode: 'insensitive' } } },
      { reseña: { usuario: { nombre: { contains: q, mode: 'insensitive' } } } },
    ]
  }

  if (params.resolved !== undefined) {
    where.resuelto = params.resolved
  }

  const [data, total] = await Promise.all([
    prisma.reporte.findMany({
      where,
      include: { reseña: { include: { usuario: true } }, reportero: true, resolvedor: true },
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.reporte.count({ where }),
  ])

  const reports = data.map(r => mapReport(r)).filter(r => r.review)

  const targetMap = await resolveTargetNames(
    reports.map(r => ({ tipo: r.review!.tipo, targetId: r.review!.targetId })),
  )
  for (const report of reports) {
    if (report.review) {
      const resolved = targetMap.get(`${report.review.tipo}:${report.review.targetId}`)
      if (resolved) {
        report.review.targetName = resolved.targetName
        report.review.sellerName = resolved.sellerName
      }
    }
  }

  return { data: reports, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function createReport(input: CreateReportInput, reporterId: string, reporterName: string): Promise<Report> {
  if (!input.reseñaId || typeof input.reseñaId !== 'string') {
    throw new Error('reseñaId es requerido')
  }
  if (!input.razon || !input.razon.trim()) {
    throw new Error('razon es requerido')
  }
  if (input.razon.trim().length < 10) {
    throw new Error('razon debe tener al menos 10 caracteres')
  }
  if (input.razon.length > MAX_COMENTARIO_LENGTH) {
    throw new Error(`razon no puede superar los ${MAX_COMENTARIO_LENGTH} caracteres`)
  }
  if (!reporterId) {
    throw new Error('reporterId es requerido')
  }

  await ensureUser(reporterId, reporterName)

  const review = await prisma.reseña.findUnique({ where: { id: input.reseñaId } })
  if (!review) throw new Error('Review no encontrada')
  if (review.estado === 'removed') throw new Error('No se puede reportar una reseña eliminada')
  if (review.estado === 'reported') throw new Error('Esta reseña ya fue reportada')

  const [report] = await Promise.all([
    prisma.reporte.create({
      data: {
        reseñaId: input.reseñaId,
        reporterId,
        razon: input.razon,
      },
      include: {
        reseña: { include: { usuario: true } },
        reportero: true,
      },
    }),
    prisma.reseña.update({
      where: { id: input.reseñaId },
      data: { estado: 'reported' },
    }),
  ])

  const mapped = mapReport(report)
  if (mapped.review) {
    const resolved = await resolveTargetName(mapped.review.tipo, mapped.review.targetId)
    mapped.review.targetName = resolved.targetName
    mapped.review.sellerName = resolved.sellerName
  }
  return mapped
}

export async function getReportById(id: string): Promise<Report | null> {
  const report = await prisma.reporte.findUnique({
    where: { id },
    include: {
      reseña: { include: { usuario: true } },
      reportero: true,
      resolvedor: true,
    },
  })
  if (!report) return null
  const mapped = mapReport(report)
  if (mapped.review) {
    const resolved = await resolveTargetName(mapped.review.tipo, mapped.review.targetId)
    mapped.review.targetName = resolved.targetName
    mapped.review.sellerName = resolved.sellerName
  }
  return mapped
}

export async function resolveReport(id: string, options: ResolveOptions): Promise<Report | null> {
  const report = await prisma.reporte.findUnique({ where: { id } })
  if (!report) return null

  if (options.adminComment && options.adminComment.length > MAX_ADMIN_COMMENT_LENGTH) {
    throw new Error(`adminComment no puede superar los ${MAX_ADMIN_COMMENT_LENGTH} caracteres`)
  }

  const updateData: Record<string, unknown> = {
    resuelto: true,
    resolvedBy: options.adminId,
    adminComment: options.adminComment ?? null,
  }

  if (options.action === 'remove') {
    await Promise.all([
      prisma.reporte.update({ where: { id }, data: updateData }),
      prisma.reseña.update({
        where: { id: report.reseñaId },
        data: { estado: 'removed' },
      }),
    ])
  } else {
    await Promise.all([
      prisma.reporte.update({ where: { id }, data: updateData }),
      prisma.reseña.update({
        where: { id: report.reseñaId },
        data: { estado: 'published' },
      }),
    ])
  }

  const updated = await prisma.reporte.findUnique({
    where: { id },
    include: {
      reseña: { include: { usuario: true } },
      reportero: true,
      resolvedor: true,
    },
  })

  return updated ? mapReport(updated) : null
}

export async function searchProducts(query: string, page = 1, limit = 10): Promise<{ data: { id: string; nombre: string; vendedorNombre?: string }[]; total: number }> {
  const where = query.trim()
    ? { nombre: { contains: query, mode: 'insensitive' as const } }
    : {}
  const [products, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      include: { vendedor: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { nombre: 'asc' },
    }),
    prisma.producto.count({ where }),
  ])
  return {
    data: products.map(p => ({ id: p.id, nombre: p.nombre, vendedorNombre: p.vendedor?.nombre })),
    total,
  }
}

export async function searchSellers(query: string, page = 1, limit = 10): Promise<{ data: { id: string; nombre: string }[]; total: number }> {
  const where = query.trim()
    ? { nombre: { contains: query, mode: 'insensitive' as const } }
    : {}
  const [sellers, total] = await Promise.all([
    prisma.vendedor.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { nombre: 'asc' },
    }),
    prisma.vendedor.count({ where }),
  ])
  return {
    data: sellers.map(s => ({ id: s.id, nombre: s.nombre })),
    total,
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) return false
  const user = await prisma.usuario.findUnique({ where: { id: userId } })
  return user?.role === 'admin'
}
