import { NextRequest } from 'next/server'

const API_KEYS: Record<string, string> = {
  'buyer-app': process.env.API_KEY_BUYER_APP ?? '',
  'seller-app': process.env.API_KEY_SELLER_APP ?? '',
}

export function validateApiKey(req: NextRequest, allowedServices: string[]): boolean {
  const fromHeader = req.headers.get('authorization')?.replace('Bearer ', '')
  const fromQuery = req.nextUrl.searchParams.get('api_key')
  const key = fromHeader || fromQuery
  return allowedServices.some(service => key === API_KEYS[service])
}
