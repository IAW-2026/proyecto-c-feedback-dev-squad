'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
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
  const user = await currentUser()
  const role = user?.publicMetadata?.role as string | undefined
  if (role !== 'admin') throw new Error('No autorizado')
  return dbGetReports(params)
}

interface ResolveOptions {
  adminName: string
  adminComment?: string
  action: 'dismiss' | 'remove'
}

export async function resolveReport(
  id: string,
  options: ResolveOptions,
): Promise<Report | null> {
  const user = await currentUser()
  const role = user?.publicMetadata?.role as string | undefined
  if (role !== 'admin') throw new Error('No autorizado')
  return dbResolveReport(id, options)
}

export async function getAIOpinionAction(reportId: string): Promise<string> {
  const report = await dbGetReportById(reportId)
  if (!report) throw new Error('Reporte no encontrado')
  return getAIOpinion(report)
}
