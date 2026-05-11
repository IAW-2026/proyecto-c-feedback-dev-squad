export type ReviewType = 'product' | 'seller'
export type ReviewStatus = 'published' | 'reported' | 'removed'

export interface Usuario {
  id: string
  nombre: string
  email?: string
  role: string
  fotoUrl?: string
}

export interface Producto {
  id: string
  nombre: string
  vendedorId?: string
  sellerName?: string
}

export interface Vendedor {
  id: string
  nombre: string
}

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
  reseñaId: string
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

export interface UpdateReviewInput {
  rating: number
  comentario: string
}

export interface CreateReportInput {
  reseñaId: string
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
  resolved?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
