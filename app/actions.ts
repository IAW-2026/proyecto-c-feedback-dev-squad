'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { isAdmin } from '../services/db'
import { ensureUser } from '../services/ensureUser'
import { verifyToken } from '../lib/handoffToken'
import { prisma } from '../lib/prisma'
import type {
  Review,
  ReviewStats,
  Report,
  PaginationParams,
  PaginatedResponse,
  CreateReviewInput,
  UpdateReviewInput,
  CreateReportInput,
} from '../types'

import {
  getMyReviews as dbGetMyReviews,
  getReviewById as dbGetReviewById,
  createReview as dbCreateReview,
  updateReview as dbUpdateReview,
  deleteReview as dbDeleteReview,
  getReports as dbGetReports,
  resolveReport as dbResolveReport,
  getReportById as dbGetReportById,
  getTargetReviews as dbGetTargetReviews,
  getProductStats as dbGetProductStats,
  getSellerStats as dbGetSellerStats,
  createReport as dbCreateReport,
  searchProducts as dbSearchProducts,
  searchSellers as dbSearchSellers,
  searchAll as dbSearchAll,
  resolveTargetName,
} from '../services/db'

import { getAIOpinion, generateReviewSummary, moderateReview } from '../lib/gemini'
import { getUserPurchases as dbGetUserPurchases } from '../services/purchases'

export async function getMyReviews(
  userId: string,
  params: PaginationParams,
): Promise<PaginatedResponse<Review>> {
  const { userId: authUserId } = await auth()
  if (!authUserId || authUserId !== userId) throw new Error('No autorizado')
  return dbGetMyReviews(userId, params)
}

export async function createReview(
  input: CreateReviewInput,
  userName: string,
  handoff?: { value: string; tipo: string },
): Promise<Review & { moderationSkipped?: boolean }> {
  let userId: string | null = null

  const { userId: clerkUserId } = await auth()
  if (clerkUserId) {
    userId = clerkUserId
  } else if (handoff) {
    const secret = handoff.tipo === 'product'
      ? process.env.BUYER_APP_URL!
      : process.env.BUYER_APP_SELLER_KEY!
    const verified = await verifyToken(secret, handoff.value, input.targetId)
    if (verified) {
      userId = verified.userId
      const existing = await prisma.usuario.findUnique({ where: { id: userId } })
      if (!existing) {
        await prisma.usuario.create({
          data: { id: userId, nombre: userName || 'Usuario' },
        })
      }
    }
  }

  if (!userId) throw new Error('No autenticado')

  let moderationSkipped = false
  try {
    const moderation = await moderateReview(input)
    if (!moderation.approved) {
      throw new Error(`No aprobada: ${moderation.reason}`)
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('No aprobada:')) {
      throw e
    }
    console.error('Error en moderación IA, se permite la reseña:', e)
    moderationSkipped = true
  }

  const review = await dbCreateReview(input, userId, userName || 'Usuario')
  return Object.assign(review, { moderationSkipped })
}

export async function updateReview(
  id: string,
  input: UpdateReviewInput,
): Promise<{ review: Review | null; moderationSkipped?: boolean }> {
  const { userId } = await auth()
  if (!userId) throw new Error('No autenticado')

  let moderationSkipped = false
  const existing = await dbGetReviewById(id)
  if (existing) {
    try {
      const moderation = await moderateReview({
        tipo: existing.tipo,
        targetId: existing.targetId,
        rating: input.rating,
        comentario: input.comentario,
      })
      if (!moderation.approved) {
        throw new Error(`No aprobada: ${moderation.reason}`)
      }
    } catch (e) {
      if (e instanceof Error && e.message.startsWith('No aprobada:')) throw e
      console.error('Error en moderación IA al editar, se permite:', e)
      moderationSkipped = true
    }
  }

  const review = await dbUpdateReview(id, input, userId)
  return { review, moderationSkipped }
}

export async function deleteReview(id: string): Promise<Review | null> {
  const { userId } = await auth()
  if (!userId) throw new Error('No autenticado')
  return dbDeleteReview(id, userId)
}

export async function getReports(
  params: PaginationParams & { resolved?: boolean },
): Promise<PaginatedResponse<Report>> {
  const { userId } = await auth()
  if (!userId) throw new Error('No autenticado')
  const admin = await isAdmin(userId)
  if (!admin) throw new Error('No autorizado')
  return dbGetReports(params)
}

interface ResolveOptions {
  comentarioAdmin?: string
  action: 'dismiss' | 'remove'
}

export async function resolveReport(
  id: string,
  options: ResolveOptions,
): Promise<Report | null> {
  const { userId } = await auth()
  if (!userId) throw new Error('No autenticado')
  const admin = await isAdmin(userId)
  if (!admin) throw new Error('No autorizado')
  return dbResolveReport(id, { adminId: userId, comentarioAdmin: options.comentarioAdmin, action: options.action })
}

export async function getAIOpinionAction(reportId: string): Promise<string> {
  const report = await dbGetReportById(reportId)
  if (!report) throw new Error('Reporte no encontrado')
  return getAIOpinion(report)
}

export async function getUserPurchasableTargets(tokenUserId?: string | null) {
  let userId: string | null = null

  const { userId: clerkUserId } = await auth()
  if (clerkUserId) {
    userId = clerkUserId
  } else if (tokenUserId) {
    userId = tokenUserId
  }

  if (!userId) throw new Error('No autenticado')
  return dbGetUserPurchases(userId)
}

export interface SearchResult {
  id: string
  nombre: string
  vendedorNombre?: string
  _tipo: 'product' | 'seller'
}

export async function searchTargets(
  query: string,
  tipo?: 'product' | 'seller',
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<SearchResult>> {
  if (tipo === 'product') {
    const result = await dbSearchProducts(query, page, limit)
    return {
      data: result.data.map(p => ({ ...p, _tipo: 'product' as const })),
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    }
  }
  if (tipo === 'seller') {
    const result = await dbSearchSellers(query, page, limit)
    return {
      data: result.data.map(s => ({ ...s, _tipo: 'seller' as const, vendedorNombre: undefined })),
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    }
  }

  const result = await dbSearchAll(query, page, limit)
  return {
    data: result.data,
    total: result.total,
    page,
    limit,
    totalPages: Math.ceil(result.total / limit),
  }
}

export async function getTargetReviewsAction(
  targetId: string,
  tipo: 'product' | 'seller',
  params: PaginationParams,
): Promise<PaginatedResponse<Review>> {
  return dbGetTargetReviews(targetId, tipo, params)
}

export async function getTargetStatsAction(
  targetId: string,
  tipo: 'product' | 'seller',
): Promise<ReviewStats> {
  return tipo === 'product' ? dbGetProductStats(targetId) : dbGetSellerStats(targetId)
}

export async function getTargetAISummaryAction(
  targetId: string,
  tipo: 'product' | 'seller',
): Promise<string> {
  const { targetName } = await resolveTargetName(tipo, targetId)
  const reviews = await dbGetTargetReviews(targetId, tipo, { page: 1, limit: 50 })
  if (reviews.data.length === 0) return 'No hay suficientes reseñas para generar un resumen.'
  return generateReviewSummary(targetName, reviews.data)
}

export async function reportReviewAction(
  reseñaId: string,
  razon: string,
  handoff?: { value: string; tipo: string },
): Promise<Report> {
  let userId: string | null = null
  let userName = 'Usuario'

  const { userId: clerkUserId } = await auth()
  if (clerkUserId) {
    userId = clerkUserId
    const clerkUser = await currentUser()
    userName = clerkUser ? `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || 'Usuario' : 'Usuario'
  } else if (handoff) {
    const review = await prisma.reseña.findUnique({ where: { id: reseñaId } })
    if (!review) throw new Error('Reseña no encontrada')
    const verified = review.tipo === 'product'
      ? await verifyToken(process.env.BUYER_APP_URL!, handoff.value, review.targetId)
      : (
        await verifyToken(process.env.BUYER_APP_SELLER_KEY!, handoff.value, review.targetId)
        ?? await verifyToken(process.env.API_KEY_SELLER_APP!, handoff.value, review.targetId)
      )
    if (verified) {
      userId = verified.userId
      const existing = await prisma.usuario.findUnique({ where: { id: userId } })
      if (!existing) {
        await prisma.usuario.create({
          data: { id: userId, nombre: userName },
        })
      }
    }
  }

  if (!userId) throw new Error('No autenticado')
  return dbCreateReport({ reseñaId, razon }, userId, userName)
}

export async function getMyReviewedTargetIds(tokenUserId?: string | null): Promise<string[]> {
  let userId: string | null = null

  const { userId: clerkUserId } = await auth()
  if (clerkUserId) {
    userId = clerkUserId
  } else if (tokenUserId) {
    userId = tokenUserId
  }

  if (!userId) throw new Error('No autenticado')

  const reviews = await prisma.reseña.findMany({
    where: {
      userId,
      estado: { in: ['published', 'reported'] },
    },
    select: { tipo: true, targetId: true },
  })
  return reviews.map(r => `${r.tipo}:${r.targetId}`)
}

export async function ensureUserAction(): Promise<void> {
  const clerkUser = await currentUser()
  if (!clerkUser) return
  const isClerkAdmin = (clerkUser.publicMetadata as any)?.role?.toLowerCase() === 'admin'
  await ensureUser(
    clerkUser.id,
    clerkUser.firstName?.trim() || 'Usuario',
    clerkUser.lastName?.trim() || undefined,
    clerkUser.emailAddresses?.[0]?.emailAddress,
    isClerkAdmin,
  )
}
