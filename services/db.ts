import { prisma } from '../lib/prisma'
import type {
  Review,
  Report,
  ReviewStats,
  PaginationParams,
  PaginatedResponse,
  CreateReviewInput,
  UpdateReviewInput,
  CreateReportInput,
} from '../types'

const MAX_COMENTARIO_LENGTH = 500

function sanitizePagination(page: number, limit: number): { page: number; limit: number } {
  return {
    page: Math.max(1, Math.floor(page)),
    limit: Math.min(100, Math.max(1, Math.floor(limit))),
  }
}

interface ResolveOptions {
  adminName: string
  adminComment?: string
  action: 'dismiss' | 'remove'
}

export async function getReviews(params: PaginationParams): Promise<PaginatedResponse<Review>> {
  const { page, limit } = sanitizePagination(params.page, params.limit)
  const where: Record<string, unknown> = {}

  if (params.search) {
    const q = params.search
    where.OR = [
      { comentario: { contains: q, mode: 'insensitive' } },
      { targetName: { contains: q, mode: 'insensitive' } },
      { userName: { contains: q, mode: 'insensitive' } },
    ]
  }

  if (params.tipo) {
    where.tipo = params.tipo
  }

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where }),
  ])

  return {
    data: data as unknown as Review[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getReviewById(id: string): Promise<Review | null> {
  const review = await prisma.review.findUnique({ where: { id } })
  return review as unknown as Review | null
}

export async function getMyReviews(
  userId: string,
  params: PaginationParams,
): Promise<PaginatedResponse<Review>> {
  const { page, limit } = sanitizePagination(params.page, params.limit)
  const where: Record<string, unknown> = { userId }

  if (params.search) {
    const q = params.search
    where.OR = [
      { comentario: { contains: q, mode: 'insensitive' } },
      { targetName: { contains: q, mode: 'insensitive' } },
    ]
  }

  if (params.tipo) {
    where.tipo = params.tipo
  }

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where }),
  ])

  return {
    data: data as unknown as Review[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getTargetReviews(
  targetId: string,
  tipo: 'product' | 'seller',
  params: PaginationParams,
): Promise<PaginatedResponse<Review>> {
  const { page, limit } = sanitizePagination(params.page, params.limit)
  const where: Record<string, unknown> = { targetId, tipo, estado: 'published' }

  if (params.search) {
    const q = params.search
    where.OR = [
      { comentario: { contains: q, mode: 'insensitive' } },
      { userName: { contains: q, mode: 'insensitive' } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where }),
  ])

  return {
    data: data as unknown as Review[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
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

  const existing = await prisma.review.findFirst({
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

  const review = await prisma.review.create({
    data: {
      tipo: input.tipo,
      targetId: input.targetId,
      targetName: input.targetName ?? null,
      sellerName: input.sellerName ?? null,
      userId,
      userName: userName ?? null,
      rating: input.rating,
      comentario: input.comentario,
      estado: 'published',
    },
  })
  return review as unknown as Review
}

export async function updateReview(id: string, input: UpdateReviewInput, userId: string): Promise<Review | null> {
  const existing = await prisma.review.findUnique({ where: { id } })
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

  const review = await prisma.review.update({
    where: { id },
    data: {
      rating: input.rating,
      comentario: input.comentario,
      fecha: new Date(),
    },
  })
  return review as unknown as Review
}

export async function deleteReview(id: string, userId: string): Promise<Review | null> {
  const existing = await prisma.review.findUnique({ where: { id } })
  if (!existing) throw new Error('Reseña no encontrada')
  if (existing.userId !== userId) throw new Error('No autorizado')
  if (existing.estado !== 'published') throw new Error('No se puede eliminar una reseña reportada o eliminada')

  const review = await prisma.review.update({
    where: { id },
    data: { estado: 'removed' },
  })
  return review as unknown as Review
}

export async function getProductStats(targetId: string): Promise<ReviewStats> {
  const where = { targetId, tipo: 'product', estado: 'published' }

  const [aggregate, distribution] = await Promise.all([
    prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { id: true },
    }),
    prisma.review.groupBy({
      by: ['rating'],
      where,
      _count: { id: true },
    }),
  ])

  const ratingDistribution: Record<number, number> = {}
  for (let i = 1; i <= 5; i++) {
    ratingDistribution[i] = 0
  }
  for (const entry of distribution) {
    ratingDistribution[entry.rating] = entry._count.id
  }

  return {
    averageRating: Math.round((aggregate._avg.rating ?? 0) * 10) / 10,
    totalReviews: aggregate._count.id,
    ratingDistribution,
  }
}

export async function getSellerStats(targetId: string): Promise<ReviewStats> {
  const where = { targetId, tipo: 'seller', estado: 'published' }

  const [aggregate, distribution] = await Promise.all([
    prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { id: true },
    }),
    prisma.review.groupBy({
      by: ['rating'],
      where,
      _count: { id: true },
    }),
  ])

  const ratingDistribution: Record<number, number> = {}
  for (let i = 1; i <= 5; i++) {
    ratingDistribution[i] = 0
  }
  for (const entry of distribution) {
    ratingDistribution[entry.rating] = entry._count.id
  }

  return {
    averageRating: Math.round((aggregate._avg.rating ?? 0) * 10) / 10,
    totalReviews: aggregate._count.id,
    ratingDistribution,
  }
}

export async function getReports(params: PaginationParams): Promise<PaginatedResponse<Report>> {
  const { page, limit } = sanitizePagination(params.page, params.limit)
  const where: Record<string, unknown> = {}

  if (params.search) {
    const q = params.search
    where.OR = [
      { razon: { contains: q, mode: 'insensitive' } },
      { review: { comentario: { contains: q, mode: 'insensitive' } } },
      { review: { userName: { contains: q, mode: 'insensitive' } } },
    ]
  }

  if (params.resolved !== undefined) {
    where.resuelto = params.resolved
  }

  const [data, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: { review: true },
      orderBy: { fecha: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.report.count({ where }),
  ])

  return {
    data: data as unknown as Report[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function createReport(
  input: CreateReportInput,
  reporterId: string,
  reporterName: string,
): Promise<Report> {
  if (!input.reviewId || typeof input.reviewId !== 'string') {
    throw new Error('reviewId es requerido')
  }
  if (!input.razon || !input.razon.trim()) {
    throw new Error('razon es requerido')
  }
  if (!reporterId) {
    throw new Error('reporterId es requerido')
  }

  const review = await prisma.review.findUnique({ where: { id: input.reviewId } })
  if (!review) {
    throw new Error('Review no encontrada')
  }
  if (review.estado === 'removed') {
    throw new Error('No se puede reportar una reseña eliminada')
  }
  if (review.estado === 'reported') {
    throw new Error('Esta reseña ya fue reportada')
  }

  const [report] = await Promise.all([
    prisma.report.create({
      data: {
        reviewId: input.reviewId,
        reporterId,
        reporterName: reporterName ?? null,
        razon: input.razon,
      },
      include: { review: true },
    }),
    prisma.review.update({
      where: { id: input.reviewId },
      data: { estado: 'reported' },
    }),
  ])

  return report as unknown as Report
}

export async function getReportById(id: string): Promise<Report | null> {
  const report = await prisma.report.findUnique({
    where: { id },
    include: { review: true },
  })
  return report as unknown as Report | null
}

export async function resolveReport(
  id: string,
  options: ResolveOptions,
): Promise<Report | null> {
  const report = await prisma.report.findUnique({ where: { id } })
  if (!report) return null

  const updateData: Record<string, unknown> = {
    resuelto: true,
    resolvedBy: options.adminName,
    adminComment: options.adminComment ?? null,
  }

  if (options.action === 'remove') {
    await Promise.all([
      prisma.report.update({ where: { id }, data: updateData }),
      prisma.review.update({
        where: { id: report.reviewId },
        data: { estado: 'removed' },
      }),
    ])
  } else {
    await Promise.all([
      prisma.report.update({ where: { id }, data: updateData }),
      prisma.review.update({
        where: { id: report.reviewId },
        data: { estado: 'published' },
      }),
    ])
  }

  const updated = await prisma.report.findUnique({
    where: { id },
    include: { review: true },
  })

  return updated as unknown as Report | null
}
