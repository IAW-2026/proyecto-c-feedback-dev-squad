import { prisma } from './prisma'

export async function ensureUser(
  userId: string,
  nombre?: string,
  email?: string,
): Promise<{ id: string; nombre: string; role: string }> {
  const existing = await prisma.usuario.findUnique({ where: { id: userId } })
  if (existing) return existing

  return prisma.usuario.create({
    data: {
      id: userId,
      nombre: nombre ?? 'Usuario',
      email: email ?? null,
      role: 'user',
    },
  })
}
