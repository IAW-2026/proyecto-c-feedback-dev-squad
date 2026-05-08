import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const reviews = [
    { id: '1', tipo: 'product', targetId: 'p1', targetName: 'Nike Air Max 270', sellerName: 'Sneakers Store', userId: 'u1', userName: 'Carlos Pérez', rating: 5, comentario: 'Excelente zapatilla, muy cómoda y llegó en perfecto estado.', estado: 'published' },
    { id: '2', tipo: 'product', targetId: 'p2', targetName: 'Adidas Ultraboost 22', sellerName: 'Zapatería Deportiva SRL', userId: 'u2', userName: 'María López', rating: 4, comentario: 'Muy buenas, solo que el talle viene un poco grande.', estado: 'published' },
    { id: '3', tipo: 'seller', targetId: 's1', targetName: 'Zapatería Deportiva SRL', userId: 'u3', userName: 'Juan García', rating: 3, comentario: 'El vendedor fue rápido, pero el producto no era exactamente lo que esperaba.', estado: 'published' },
    { id: '4', tipo: 'product', targetId: 'p3', targetName: 'Puma RS-X', sellerName: 'Urban Kicks', userId: 'u1', userName: 'Carlos Pérez', rating: 2, comentario: 'No me gustaron, la suela es muy dura.', estado: 'reported' },
    { id: '5', tipo: 'seller', targetId: 's2', targetName: 'Sneakers Store', userId: 'u4', userName: 'Ana Martínez', rating: 5, comentario: 'Atención excelente, respondieron todas mis dudas y el envío fue súper rápido.', estado: 'published' },
    { id: '6', tipo: 'product', targetId: 'p4', targetName: 'Converse Chuck Taylor', sellerName: 'Sneakers Store', userId: 'u5', userName: 'Pedro Rodríguez', rating: 4, comentario: 'Clásicas y cómodas. Relación precio-calidad excelente.', estado: 'published' },
    { id: '7', tipo: 'product', targetId: 'p1', targetName: 'Nike Air Max 270', sellerName: 'Sneakers Store', userId: 'u6', userName: 'Lucía Fernández', rating: 1, comentario: 'Se rompieron a los dos meses. No las recomiendo.', estado: 'published' },
    { id: '8', tipo: 'seller', targetId: 's1', targetName: 'Zapatería Deportiva SRL', userId: 'u7', userName: 'Diego Gómez', rating: 4, comentario: 'Buen vendedor, el producto llegó en fecha y bien embalado.', estado: 'published' },
    { id: '9', tipo: 'product', targetId: 'p5', targetName: 'Vans Old Skool', sellerName: 'Zapatería Deportiva SRL', userId: 'u8', userName: 'Sofía Torres', rating: 5, comentario: 'Hermosas, tal cual las fotos. Muy contenta con la compra.', estado: 'published' },
    { id: '10', tipo: 'seller', targetId: 's3', targetName: 'Urban Kicks', userId: 'u9', userName: 'Martín Díaz', rating: 2, comentario: 'El vendedor tardó mucho en responder y el envío se demoró.', estado: 'reported' },
  ]

  const reports = [
    { id: 'r1', reviewId: '4', reporterId: 'u3', reporterName: 'Juan García', razon: 'Contenido falso, el usuario nunca compró el producto.', resuelto: false },
    { id: 'r2', reviewId: '10', reporterId: 'u10', reporterName: 'Admin', razon: 'Lenguaje inapropiado en la reseña.', resuelto: false },
    { id: 'r3', reviewId: '1', reporterId: 'u11', reporterName: 'Laura Ruiz', razon: 'La reseña parece ser un review falso (muy positivo, poca credibilidad).', resuelto: true, resolvedBy: 'Admin Principal', adminComment: 'La reseña parece legítima, el usuario efectivamente compró el producto.' },
  ]

  await prisma.$transaction([
    prisma.review.createMany({ data: reviews }),
    prisma.report.createMany({ data: reports }),
  ])

  console.log('Seed completado: 10 reviews y 3 reports insertados.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
