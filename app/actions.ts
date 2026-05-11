'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { isAdmin } from '../services/db'
import { ensureUser } from '../lib/ensureUser'
import type {
  Review,
  Report,
  PaginationParams,
  PaginatedResponse,
  CreateReviewInput,
  UpdateReviewInput,
  CreateReportInput,
} from '../types'

import {
  getMyReviews as dbGetMyReviews,
  createReview as dbCreateReview,
  updateReview as dbUpdateReview,
  deleteReview as dbDeleteReview,
  getReports as dbGetReports,
  resolveReport as dbResolveReport,
  getReportById as dbGetReportById,
} from '../services/db'

import { getAIOpinion } from '../lib/gemini'

export async function getMyReviews(
  userId: string,
  params: PaginationParams,
): Promise<PaginatedResponse<Review>> {
  return dbGetMyReviews(userId, params)
}

export async function createReview(
  input: CreateReviewInput,
  _userId: string,
  userName: string,
): Promise<Review> {
  const { userId } = await auth()
  if (!userId) throw new Error('No autenticado')
  return dbCreateReview(input, userId, userName ?? 'Usuario')
}

export async function updateReview(
  id: string,
  input: UpdateReviewInput,
): Promise<Review | null> {
  const { userId } = await auth()
  if (!userId) throw new Error('No autenticado')
  return dbUpdateReview(id, input, userId)
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
  adminComment?: string
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
  return dbResolveReport(id, { adminId: userId, adminComment: options.adminComment, action: options.action })
}

export async function getAIOpinionAction(reportId: string): Promise<string> {
  const report = await dbGetReportById(reportId)
  if (!report) throw new Error('Reporte no encontrado')
  return getAIOpinion(report)
}

export async function ensureUserAction(): Promise<void> {
  const clerkUser = await currentUser()
  if (!clerkUser) return
  await ensureUser(
    clerkUser.id,
    `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || 'Usuario',
    clerkUser.emailAddresses?.[0]?.emailAddress,
  )
}
