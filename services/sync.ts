import { prisma } from '../lib/prisma'

const SELLER_API = 'https://proyecto-c-seller-dev-squad.vercel.app'

interface SellerDTO {
  id: string
  name: string
}

interface ProductDTO {
  id: string
  name: string
  sellerId: string
}

interface ProductResponse {
  data: ProductDTO[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export async function fetchAllSellers(): Promise<SellerDTO[]> {
  const res = await fetch(`${SELLER_API}/api/seller`, {
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Error fetching sellers: ${res.status}`)
  const json = await res.json()
  if (Array.isArray(json)) {
    return json.map((s: any) => ({ id: s.id, name: s.name }))
  }
  if (json.data && Array.isArray(json.data)) {
    return json.data.map((s: any) => ({ id: s.id, name: s.name }))
  }
  throw new Error('Unexpected seller API response format')
}

export async function fetchAllProducts(): Promise<ProductDTO[]> {
  const all: ProductDTO[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const res = await fetch(`${SELLER_API}/api/products?page=${page}&limit=50`, {
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error(`Error fetching products (page ${page}): ${res.status}`)
    const json: ProductResponse = await res.json()
    const items = json.data ?? []
    for (const p of items) {
      all.push({ id: p.id, name: p.name, sellerId: p.sellerId })
    }
    totalPages = json.meta?.totalPages ?? 1
    page++
  }

  return all
}

export async function syncFromSellerApp(): Promise<{ sellers: number; products: number }> {
  const [sellers, products] = await Promise.all([
    fetchAllSellers(),
    fetchAllProducts(),
  ])

  const currentSellerIds = sellers.map(s => s.id)
  const currentProductIds = products.map(p => p.id)

  const oldProductIds = (await prisma.producto.findMany({
    where: { id: { notIn: currentProductIds } },
    select: { id: true },
  })).map(p => p.id)

  const oldSellerIds = (await prisma.vendedor.findMany({
    where: { id: { notIn: currentSellerIds } },
    select: { id: true },
  })).map(v => v.id)

  const oldTargetIds = [...oldProductIds, ...oldSellerIds]

  if (oldTargetIds.length > 0) {
    const oldReviewIds = (await prisma.reseña.findMany({
      where: { targetId: { in: oldTargetIds } },
      select: { id: true },
    })).map(r => r.id)

    await prisma.reporte.deleteMany({ where: { reseñaId: { in: oldReviewIds } } })
    await prisma.reseña.deleteMany({ where: { targetId: { in: oldTargetIds } } })
    await prisma.producto.deleteMany({ where: { id: { in: oldProductIds } } })
    await prisma.vendedor.deleteMany({ where: { id: { in: oldSellerIds } } })
  }

  for (const s of sellers) {
    await prisma.vendedor.upsert({
      where: { id: s.id },
      create: { id: s.id, nombre: s.name },
      update: { nombre: s.name },
    })
  }

  for (const p of products) {
    await prisma.producto.upsert({
      where: { id: p.id },
      create: { id: p.id, nombre: p.name, vendedorId: p.sellerId },
      update: { nombre: p.name, vendedorId: p.sellerId },
    })
  }

  return { sellers: sellers.length, products: products.length }
}
