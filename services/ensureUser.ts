import { prisma } from '../lib/prisma'

export async function ensureUser(
  userId: string,
  nombre?: string,
  apellido?: string,
  email?: string,
): Promise<{ id: string; nombre: string; apellido: string | null; rol: string }> {
  const existing = await prisma.usuario.findUnique({ where: { id: userId } })
  if (existing) return existing

  return prisma.usuario.create({
    data: {
      id: userId,
      nombre: nombre ?? 'Usuario',
      apellido: apellido ?? null,
      email: email ?? null,
      rol: 'user',
    },
  })
}
