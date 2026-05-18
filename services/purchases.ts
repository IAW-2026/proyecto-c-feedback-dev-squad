import { prisma } from '../lib/prisma'

export interface PurchaseInfo {
  productIds: string[]
  sellerIds: string[]
}

export async function getUserPurchases(userId: string): Promise<PurchaseInfo> {
  // ETAPA 2 — Mock: devuelve TODO (sin restricción), esto se implementa via api en la etapa 3
  const allProducts = await prisma.producto.findMany({ select: { id: true, vendedorId: true } })
  return {
    productIds: allProducts.map(p => p.id),
    sellerIds: [...new Set(allProducts.filter(p => p.vendedorId).map(p => p.vendedorId!))],
  }
}
