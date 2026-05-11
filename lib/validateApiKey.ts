import { NextRequest } from 'next/server'

export function validateApiKey(req: NextRequest): boolean {
  const fromHeader = req.headers.get('authorization')?.replace('Bearer ', '')
  const fromQuery = req.nextUrl.searchParams.get('api_key')
  const key = fromHeader || fromQuery
  return key === (process.env.API_SECRET_KEY ?? '')
}
