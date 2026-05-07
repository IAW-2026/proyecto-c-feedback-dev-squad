export type ReviewType = 'product' | 'seller'
export type ReviewStatus = 'published' | 'reported' | 'removed'

export interface Review {
  id: string
  tipo: ReviewType
  targetId: string
  userId: string
  rating: number
  comentario: string
  estado: ReviewStatus
  fecha: string
  userName?: string
  targetName?: string
  sellerName?: string
}

export interface Report {
  id: string
  reviewId: string
  reporterId: string
  razon: string
  resuelto: boolean
  fecha: string
  review?: Review
  reporterName?: string
  resolvedBy?: string
  adminComment?: string
}

export interface CreateReviewInput {
  tipo: ReviewType
  targetId: string
  rating: number
  comentario: string
}

export interface CreateReportInput {
  reviewId: string
  razon: string
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  tipo?: ReviewType
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}


