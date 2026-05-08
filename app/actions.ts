'use server'

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
  userId: string,
  userName: string,
): Promise<Review> {
  return dbCreateReview(input, userId, userName)
}

export async function updateReview(
  id: string,
  input: UpdateReviewInput,
): Promise<Review | null> {
  return dbUpdateReview(id, input)
}

export async function deleteReview(id: string): Promise<Review | null> {
  return dbDeleteReview(id)
}

export async function getReports(
  params: PaginationParams & { resolved?: boolean },
): Promise<PaginatedResponse<Report>> {
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
  return dbResolveReport(id, options)
}

export async function getAIOpinionAction(reportId: string): Promise<string> {
  const report = await dbGetReportById(reportId)
  if (!report) throw new Error('Reporte no encontrado')
  return getAIOpinion(report)
}
