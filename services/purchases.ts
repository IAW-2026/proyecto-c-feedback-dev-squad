import { prisma } from '../lib/prisma'

export interface PurchaseInfo {
  productIds: string[]
  sellerIds: string[]
  products: { id: string; name: string; sellerName: string }[]
  sellers: { id: string; name: string }[]
}

async function buildFromLocal(productIds: string[] | undefined): Promise<PurchaseInfo> {
  const allProducts = await prisma.producto.findMany({
    where: productIds ? { id: { in: productIds } } : undefined,
    include: { vendedor: true },
  })

  const products = allProducts.map(p => ({
    id: p.id,
    name: p.nombre,
    sellerName: p.vendedor?.nombre ?? '',
  }))

  const sellerMap = new Map<string, string>()
  for (const p of allProducts) {
    if (p.vendedorId && !sellerMap.has(p.vendedorId)) {
      sellerMap.set(p.vendedorId, p.vendedor?.nombre ?? '')
    }
  }

  const sellers = Array.from(sellerMap.entries()).map(([id, name]) => ({ id, name }))

  return {
    productIds: products.map(p => p.id),
    sellerIds: sellers.map(s => s.id),
    products,
    sellers,
  }
}

const BUYER_API_URL = 'https://zapasya.vercel.app'

export async function getUserPurchases(userId: string): Promise<PurchaseInfo> {
  const buyerKey = process.env.BUYER_APP_URL

  if (buyerKey) {
    try {
      const res = await fetch(
        `${BUYER_API_URL}/api/orders?status=DELIVERED&page=1&limit=100`,
        { headers: { 'buyer-key': buyerKey } },
      )
      if (!res.ok) return buildFromLocal([])

      const json = await res.json()
      const orders = json.data ?? []
      const productIds = [
        ...new Set(
          orders.flatMap((o: any) => o.items?.map((i: any) => i.productId) ?? []),
        ),
      ] as string[]

      return buildFromLocal(productIds)
    } catch {
      return buildFromLocal([])
    }
  }

  return buildFromLocal(undefined)
}
