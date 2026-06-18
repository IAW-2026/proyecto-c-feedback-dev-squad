import { prisma } from '../lib/prisma'

export async function ensureUser(
  userId: string,
  nombre?: string,
  apellido?: string,
  email?: string,
  isClerkAdmin?: boolean,
): Promise<{ id: string; nombre: string; apellido: string | null; rol: string }> {
  const existing = await prisma.usuario.findUnique({ where: { id: userId } })
  if (existing) {
    if (isClerkAdmin && existing.rol !== 'admin') {
      return prisma.usuario.update({
        where: { id: userId },
        data: { rol: 'admin' },
      })
    }
    return existing
  }

  return prisma.usuario.create({
    data: {
      id: userId,
      nombre: nombre ?? 'Usuario',
      apellido: apellido ?? null,
      email: email ?? null,
      rol: isClerkAdmin ? 'admin' : 'user',
    },
  })
}
