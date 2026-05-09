import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const reviews = [
    { id: '1', tipo: 'product', targetId: 'p1', targetName: 'Nike Air Max 270', sellerName: 'Sneakers Store', userId: 'u1', userName: 'Carlos Pérez', rating: 5, comentario: 'Excelente zapatilla, muy cómoda y llegó en perfecto estado.', estado: 'published' },
    { id: '2', tipo: 'product', targetId: 'p2', targetName: 'Adidas Ultraboost 22', sellerName: 'Zapatería Deportiva SRL', userId: 'u2', userName: 'María López', rating: 4, comentario: 'Muy buenas, solo que el talle viene un poco grande.', estado: 'published' },
    { id: '3', tipo: 'seller', targetId: 's1', targetName: 'Zapatería Deportiva SRL', userId: 'u3', userName: 'Juan García', rating: 3, comentario: 'El vendedor fue rápido, pero el producto no era exactamente lo que esperaba.', estado: 'published' },
    { id: '4', tipo: 'product', targetId: 'p3', targetName: 'Puma RS-X', sellerName: 'Urban Kicks', userId: 'u1', userName: 'Carlos Pérez', rating: 2, comentario: 'No me gustaron, la suela es muy dura.', estado: 'published' },
    { id: '5', tipo: 'seller', targetId: 's2', targetName: 'Sneakers Store', userId: 'u4', userName: 'Ana Martínez', rating: 5, comentario: 'Atención excelente, respondieron todas mis dudas y el envío fue súper rápido.', estado: 'published' },
    { id: '6', tipo: 'product', targetId: 'p4', targetName: 'Converse Chuck Taylor', sellerName: 'Sneakers Store', userId: 'u5', userName: 'Pedro Rodríguez', rating: 4, comentario: 'Clásicas y cómodas. Relación precio-calidad excelente.', estado: 'published' },
    { id: '7', tipo: 'product', targetId: 'p1', targetName: 'Nike Air Max 270', sellerName: 'Sneakers Store', userId: 'u6', userName: 'Lucía Fernández', rating: 1, comentario: 'Se rompieron a los dos meses. No las recomiendo.', estado: 'published' },
    { id: '8', tipo: 'seller', targetId: 's1', targetName: 'Zapatería Deportiva SRL', userId: 'u7', userName: 'Diego Gómez', rating: 4, comentario: 'Buen vendedor, el producto llegó en fecha y bien embalado.', estado: 'published' },
    { id: '9', tipo: 'product', targetId: 'p5', targetName: 'Vans Old Skool', sellerName: 'Zapatería Deportiva SRL', userId: 'u8', userName: 'Sofía Torres', rating: 5, comentario: 'Hermosas, tal cual las fotos. Muy contenta con la compra.', estado: 'published' },
    { id: '10', tipo: 'seller', targetId: 's3', targetName: 'Urban Kicks', userId: 'u9', userName: 'Martín Díaz', rating: 2, comentario: 'El vendedor tardó mucho en responder y el envío se demoró.', estado: 'published' },
    { id: '11', tipo: 'product', targetId: 'p6', targetName: 'New Balance 574', sellerName: 'Sneakers Store', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 5, comentario: 'Muy bonitas y cómodas. Llegaron rápido y bien embaladas.', estado: 'published' },
    { id: '12', tipo: 'product', targetId: 'p7', targetName: 'Reebok Classic Leather', sellerName: 'Zapatería Deportiva SRL', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 4, comentario: 'Buen producto, cumple con lo esperado. Relación calidad-precio aceptable.', estado: 'published' },
    { id: '13', tipo: 'seller', targetId: 's4', targetName: 'Fashion Shoes', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 3, comentario: 'El vendedor fue amable pero el envío tardó más de lo indicado.', estado: 'published' },
    { id: '14', tipo: 'product', targetId: 'p8', targetName: 'Skechers Go Walk', sellerName: 'Urban Kicks', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 5, comentario: 'Super cómodas para caminar. Las uso todos los días.', estado: 'published' },
    { id: '15', tipo: 'product', targetId: 'p9', targetName: 'Under Armour HOVR', sellerName: 'Sneakers Store', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 2, comentario: 'No me gustaron, el material se siente de baja calidad.', estado: 'published' },
    { id: '16', tipo: 'seller', targetId: 's3', targetName: 'Urban Kicks', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 4, comentario: 'Buena atención al cliente, respondieron rápido mis consultas.', estado: 'published' },
    { id: '17', tipo: 'product', targetId: 'p10', targetName: 'Fila Disruptor', sellerName: 'Fashion Shoes', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 3, comentario: 'Están bien pero no son tan cómodas como esperaba.', estado: 'published' },
    { id: '18', tipo: 'product', targetId: 'p1', targetName: 'Nike Air Max 270', sellerName: 'Sneakers Store', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 4, comentario: 'Buenas zapatillas, diseño bonito y talle correcto.', estado: 'published' },
    { id: '19', tipo: 'seller', targetId: 's2', targetName: 'Sneakers Store', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 5, comentario: 'Excelente servicio, el envío llegó antes de lo previsto.', estado: 'published' },
    { id: '20', tipo: 'product', targetId: 'p2', targetName: 'Adidas Ultraboost 22', sellerName: 'Zapatería Deportiva SRL', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', userName: 'Usuario Prueba', rating: 4, comentario: 'Muy cómodas para correr. Buena compra en general.', estado: 'published' },
  ]

  const reports = [
    { id: 'r1', reviewId: '4', reporterId: 'u3', reporterName: 'Juan García', razon: 'Contenido falso, el usuario nunca compró el producto.', resuelto: false },
    { id: 'r2', reviewId: '10', reporterId: 'u10', reporterName: 'Admin', razon: 'Lenguaje inapropiado en la reseña.', resuelto: false },
    { id: 'r3', reviewId: '1', reporterId: 'u11', reporterName: 'Laura Ruiz', razon: 'La reseña parece ser un review falso (muy positivo, poca credibilidad).', resuelto: true, resolvedBy: 'Admin Principal', adminComment: 'La reseña parece legítima, el usuario efectivamente compró el producto.' },
    { id: 'r4', reviewId: '2', reporterId: 'u12', reporterName: 'Roberto Sánchez', razon: 'La reseña contiene información engañosa sobre el producto.', resuelto: false },
    { id: 'r5', reviewId: '3', reporterId: 'u13', reporterName: 'Valentina Ortiz', razon: 'El usuario no especifica detalles reales de la compra.', resuelto: false },
    { id: 'r6', reviewId: '5', reporterId: 'u14', reporterName: 'Andrés Mendoza', razon: 'Reseña sospechosamente positiva sin fundamentos.', resuelto: false },
    { id: 'r7', reviewId: '6', reporterId: 'u15', reporterName: 'Camila Ríos', razon: 'El comentario parece generado o copiado de otro lado.', resuelto: true, resolvedBy: 'Admin Principal', adminComment: 'Se determinó que la reseña es legítima.' },
    { id: 'r8', reviewId: '7', reporterId: 'u16', reporterName: 'Felipe Navarro', razon: 'Lenguaje ofensivo hacia el producto y la tienda.', resuelto: false },
    { id: 'r9', reviewId: '8', reporterId: 'u17', reporterName: 'Gabriela Torres', razon: 'El usuario no verificó la compra antes de reseñar.', resuelto: false },
    { id: 'r10', reviewId: '9', reporterId: 'u18', reporterName: 'Hugo Delgado', razon: 'Reseña duplicada, el mismo usuario ya comentó antes.', resuelto: false },
  ]

  await prisma.$transaction([
    prisma.review.createMany({ data: reviews }),
    prisma.report.createMany({ data: reports }),
  ])

  console.log('Seed completado: 20 reviews y 10 reports insertados.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
