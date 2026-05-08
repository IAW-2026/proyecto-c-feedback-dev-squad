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

interface ResolveOptions {
  adminName: string
  adminComment?: string
  action: 'dismiss' | 'remove'
}

const reviews: Review[] = [
  {
    id: '1',
    tipo: 'product',
    targetId: 'p1',
    targetName: 'Nike Air Max 270',
    sellerName: 'Sneakers Store',
    userId: 'u1',
    userName: 'Carlos Pérez',
    rating: 5,
    comentario: 'Excelente zapatilla, muy cómoda y llegó en perfecto estado.',
    estado: 'published',
    fecha: '2026-04-15T10:30:00Z',
  },
  {
    id: '2',
    tipo: 'product',
    targetId: 'p2',
    targetName: 'Adidas Ultraboost 22',
    sellerName: 'Zapatería Deportiva SRL',
    userId: 'u2',
    userName: 'María López',
    rating: 4,
    comentario: 'Muy buenas, solo que el talle viene un poco grande.',
    estado: 'published',
    fecha: '2026-04-14T14:20:00Z',
  },
  {
    id: '3',
    tipo: 'seller',
    targetId: 's1',
    targetName: 'Zapatería Deportiva SRL',
    userId: 'u3',
    userName: 'Juan García',
    rating: 3,
    comentario: 'El vendedor fue rápido, pero el producto no era exactamente lo que esperaba.',
    estado: 'published',
    fecha: '2026-04-13T09:15:00Z',
  },
  {
    id: '4',
    tipo: 'product',
    targetId: 'p3',
    targetName: 'Puma RS-X',
    sellerName: 'Urban Kicks',
    userId: 'u1',
    userName: 'Carlos Pérez',
    rating: 2,
    comentario: 'No me gustaron, la suela es muy dura.',
    estado: 'reported',
    fecha: '2026-04-12T18:00:00Z',
  },
  {
    id: '5',
    tipo: 'seller',
    targetId: 's2',
    targetName: 'Sneakers Store',
    userId: 'u4',
    userName: 'Ana Martínez',
    rating: 5,
    comentario: 'Atención excelente, respondieron todas mis dudas y el envío fue súper rápido.',
    estado: 'published',
    fecha: '2026-04-11T11:45:00Z',
  },
  {
    id: '6',
    tipo: 'product',
    targetId: 'p4',
    targetName: 'Converse Chuck Taylor',
    sellerName: 'Sneakers Store',
    userId: 'u5',
    userName: 'Pedro Rodríguez',
    rating: 4,
    comentario: 'Clásicas y cómodas. Relación precio-calidad excelente.',
    estado: 'published',
    fecha: '2026-04-10T08:30:00Z',
  },
  {
    id: '7',
    tipo: 'product',
    targetId: 'p1',
    targetName: 'Nike Air Max 270',
    sellerName: 'Sneakers Store',
    userId: 'u6',
    userName: 'Lucía Fernández',
    rating: 1,
    comentario: 'Se rompieron a los dos meses. No las recomiendo.',
    estado: 'published',
    fecha: '2026-04-09T16:20:00Z',
  },
  {
    id: '8',
    tipo: 'seller',
    targetId: 's1',
    targetName: 'Zapatería Deportiva SRL',
    userId: 'u7',
    userName: 'Diego Gómez',
    rating: 4,
    comentario: 'Buen vendedor, el producto llegó en fecha y bien embalado.',
    estado: 'published',
    fecha: '2026-04-08T13:10:00Z',
  },
  {
    id: '9',
    tipo: 'product',
    targetId: 'p5',
    targetName: 'Vans Old Skool',
    sellerName: 'Zapatería Deportiva SRL',
    userId: 'u8',
    userName: 'Sofía Torres',
    rating: 5,
    comentario: 'Hermosas, tal cual las fotos. Muy contenta con la compra.',
    estado: 'published',
    fecha: '2026-04-07T10:00:00Z',
  },
  {
    id: '10',
    tipo: 'seller',
    targetId: 's3',
    targetName: 'Urban Kicks',
    userId: 'u9',
    userName: 'Martín Díaz',
    rating: 2,
    comentario: 'El vendedor tardó mucho en responder y el envío se demoró.',
    estado: 'reported',
    fecha: '2026-04-06T15:40:00Z',
  },
]

const reports: Report[] = [
  {
    id: 'r1',
    reviewId: '4',
    reporterId: 'u3',
    reporterName: 'Juan García',
    razon: 'Contenido falso, el usuario nunca compró el producto.',
    resuelto: false,
    fecha: '2026-04-13T19:00:00Z',
    review: reviews[3],
  },
  {
    id: 'r2',
    reviewId: '10',
    reporterId: 'u10',
    reporterName: 'Admin',
    razon: 'Lenguaje inapropiado en la reseña.',
    resuelto: false,
    fecha: '2026-04-07T16:00:00Z',
    review: reviews[9],
  },
  {
    id: 'r3',
    reviewId: '1',
    reporterId: 'u11',
    reporterName: 'Laura Ruiz',
    razon: 'La reseña parece ser un review falso (muy positivo, poca credibilidad).',
    resuelto: true,
    fecha: '2026-04-16T08:00:00Z',
    resolvedBy: 'Admin Principal',
    adminComment: 'La reseña parece legítima, el usuario efectivamente compró el producto.',
    review: reviews[0],
  },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getReviews(params: PaginationParams): Promise<PaginatedResponse<Review>> {
  await delay(300)
  let filtered = [...reviews]

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(
      r =>
        r.comentario.toLowerCase().includes(q) ||
        r.targetName?.toLowerCase().includes(q) ||
        r.userName?.toLowerCase().includes(q),
    )
  }

  if (params.tipo) {
    filtered = filtered.filter(r => r.tipo === params.tipo)
  }

  filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  const total = filtered.length
  const totalPages = Math.ceil(total / params.limit)
  const start = (params.page - 1) * params.limit
  const data = filtered.slice(start, start + params.limit)

  return { data, total, page: params.page, limit: params.limit, totalPages }
}

export async function getReviewById(id: string): Promise<Review | null> {
  await delay(200)
  return reviews.find(r => r.id === id) ?? null
}

export async function getMyReviews(
  userId: string,
  params: PaginationParams,
): Promise<PaginatedResponse<Review>> {
  await delay(300)
  let filtered = reviews.filter(r => r.userId === userId)

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(
      r =>
        r.comentario.toLowerCase().includes(q) ||
        r.targetName?.toLowerCase().includes(q),
    )
  }

  if (params.tipo) {
    filtered = filtered.filter(r => r.tipo === params.tipo)
  }

  filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  const total = filtered.length
  const totalPages = Math.ceil(total / params.limit)
  const start = (params.page - 1) * params.limit
  const data = filtered.slice(start, start + params.limit)

  return { data, total, page: params.page, limit: params.limit, totalPages }
}

export async function createReview(input: CreateReviewInput, userId: string, userName: string): Promise<Review> {
  await delay(300)
  const newReview: Review = {
    id: String(reviews.length + 1),
    tipo: input.tipo,
    targetId: input.targetId,
    targetName: input.targetName ?? (input.tipo === 'product' ? 'Producto #' + input.targetId : 'Vendedor #' + input.targetId),
    sellerName: input.sellerName,
    userId,
    userName,
    rating: input.rating,
    comentario: input.comentario,
    estado: 'published',
    fecha: new Date().toISOString(),
  }
  reviews.unshift(newReview)
  return newReview
}

export async function updateReview(id: string, input: UpdateReviewInput): Promise<Review | null> {
  await delay(200)
  const review = reviews.find(r => r.id === id)
  if (!review) return null
  review.rating = input.rating
  review.comentario = input.comentario
  review.fecha = new Date().toISOString()
  return review
}

export async function getProductStats(targetId: string): Promise<ReviewStats> {
  await delay(200)
  const productReviews = reviews.filter(r => r.tipo === 'product' && r.targetId === targetId)
  return computeStats(productReviews)
}

export async function getSellerStats(targetId: string): Promise<ReviewStats> {
  await delay(200)
  const sellerReviews = reviews.filter(r => r.tipo === 'seller' && r.targetId === targetId)
  return computeStats(sellerReviews)
}

function computeStats(items: Review[]): ReviewStats {
  if (items.length === 0) {
    return { averageRating: 0, totalReviews: 0, ratingDistribution: {} }
  }
  const total = items.length
  const sum = items.reduce((acc, r) => acc + r.rating, 0)
  const distribution: Record<number, number> = {}
  for (let i = 1; i <= 5; i++) {
    distribution[i] = items.filter(r => r.rating === i).length
  }
  return {
    averageRating: Math.round((sum / total) * 10) / 10,
    totalReviews: total,
    ratingDistribution: distribution,
  }
}

export async function getReports(params: PaginationParams): Promise<PaginatedResponse<Report>> {
  await delay(300)
  let filtered = [...reports]

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(
      r =>
        r.razon.toLowerCase().includes(q) ||
        r.review?.comentario.toLowerCase().includes(q) ||
        r.review?.userName?.toLowerCase().includes(q),
    )
  }

  filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  const total = filtered.length
  const totalPages = Math.ceil(total / params.limit)
  const start = (params.page - 1) * params.limit
  const data = filtered.slice(start, start + params.limit)

  return { data, total, page: params.page, limit: params.limit, totalPages }
}

export async function createReport(input: CreateReportInput, reporterId: string, reporterName: string): Promise<Report> {
  await delay(300)
  const review = reviews.find(r => r.id === input.reviewId) ?? null
  const newReport: Report = {
    id: 'r' + String(reports.length + 1),
    reviewId: input.reviewId,
    reporterId,
    reporterName,
    razon: input.razon,
    resuelto: false,
    fecha: new Date().toISOString(),
    review: review ?? undefined,
  }
  reports.unshift(newReport)
  if (review) {
    review.estado = 'reported'
  }
  return newReport
}

export async function resolveReport(id: string, options: ResolveOptions): Promise<Report | null> {
  await delay(200)
  const report = reports.find(r => r.id === id)
  if (!report) return null
  report.resuelto = true
  report.resolvedBy = options.adminName
  report.adminComment = options.adminComment ?? ''
  if (options.action === 'remove' && report.review) {
    report.review.estado = 'removed'
  }
  return report
}
