import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const usuarios = [
    { id: 'u1', nombre: 'Carlos Pérez', role: 'user' },
    { id: 'u2', nombre: 'María López', role: 'user' },
    { id: 'u3', nombre: 'Juan García', role: 'user' },
    { id: 'u4', nombre: 'Ana Martínez', role: 'user' },
    { id: 'u5', nombre: 'Pedro Rodríguez', role: 'user' },
    { id: 'u6', nombre: 'Lucía Fernández', role: 'user' },
    { id: 'u7', nombre: 'Diego Gómez', role: 'user' },
    { id: 'u8', nombre: 'Sofía Torres', role: 'user' },
    { id: 'u9', nombre: 'Martín Díaz', role: 'user' },
    { id: 'u10', nombre: 'Admin', role: 'admin' },
    { id: 'u11', nombre: 'Laura Ruiz', role: 'user' },
    { id: 'u12', nombre: 'Roberto Sánchez', role: 'user' },
    { id: 'u13', nombre: 'Valentina Ortiz', role: 'user' },
    { id: 'u14', nombre: 'Andrés Mendoza', role: 'user' },
    { id: 'u15', nombre: 'Camila Ríos', role: 'user' },
    { id: 'u16', nombre: 'Felipe Navarro', role: 'user' },
    { id: 'u17', nombre: 'Gabriela Torres', role: 'user' },
    { id: 'u18', nombre: 'Hugo Delgado', role: 'user' },
    { id: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', nombre: 'Usuario Prueba', role: 'user' },
  ]

  const vendedores = [
    { id: 's1', nombre: 'Zapatería Deportiva SRL' },
    { id: 's2', nombre: 'Sneakers Store' },
    { id: 's3', nombre: 'Urban Kicks' },
    { id: 's4', nombre: 'Fashion Shoes' },
  ]

  const productos = [
    { id: 'p1', nombre: 'Nike Air Max 270', vendedorId: 's2' },
    { id: 'p2', nombre: 'Adidas Ultraboost 22', vendedorId: 's1' },
    { id: 'p3', nombre: 'Puma RS-X', vendedorId: 's3' },
    { id: 'p4', nombre: 'Converse Chuck Taylor', vendedorId: 's2' },
    { id: 'p5', nombre: 'Vans Old Skool', vendedorId: 's1' },
    { id: 'p6', nombre: 'New Balance 574', vendedorId: 's2' },
    { id: 'p7', nombre: 'Reebok Classic Leather', vendedorId: 's1' },
    { id: 'p8', nombre: 'Skechers Go Walk', vendedorId: 's3' },
    { id: 'p9', nombre: 'Under Armour HOVR', vendedorId: 's2' },
    { id: 'p10', nombre: 'Fila Disruptor', vendedorId: 's4' },
  ]

  await prisma.$transaction([
    prisma.usuario.createMany({ data: usuarios }),
    prisma.vendedor.createMany({ data: vendedores }),
    prisma.producto.createMany({ data: productos }),
  ])

  const reseñas = [
    { id: '1', tipo: 'product', targetId: 'p1', userId: 'u1', rating: 5, comentario: 'Excelente zapatilla, muy cómoda y llegó en perfecto estado.', estado: 'published' },
    { id: '2', tipo: 'product', targetId: 'p2', userId: 'u2', rating: 4, comentario: 'Muy buenas, solo que el talle viene un poco grande.', estado: 'published' },
    { id: '3', tipo: 'seller', targetId: 's1', userId: 'u3', rating: 3, comentario: 'El vendedor fue rápido, pero el producto no era exactamente lo que esperaba.', estado: 'published' },
    { id: '4', tipo: 'product', targetId: 'p3', userId: 'u1', rating: 2, comentario: 'No me gustaron, la suela es muy dura.', estado: 'published' },
    { id: '5', tipo: 'seller', targetId: 's2', userId: 'u4', rating: 5, comentario: 'Atención excelente, respondieron todas mis dudas y el envío fue súper rápido.', estado: 'published' },
    { id: '6', tipo: 'product', targetId: 'p4', userId: 'u5', rating: 4, comentario: 'Clásicas y cómodas. Relación precio-calidad excelente.', estado: 'published' },
    { id: '7', tipo: 'product', targetId: 'p1', userId: 'u6', rating: 1, comentario: 'Se rompieron a los dos meses. No las recomiendo.', estado: 'published' },
    { id: '8', tipo: 'seller', targetId: 's1', userId: 'u7', rating: 4, comentario: 'Buen vendedor, el producto llegó en fecha y bien embalado.', estado: 'published' },
    { id: '9', tipo: 'product', targetId: 'p5', userId: 'u8', rating: 5, comentario: 'Hermosas, tal cual las fotos. Muy contenta con la compra.', estado: 'published' },
    { id: '10', tipo: 'seller', targetId: 's3', userId: 'u9', rating: 2, comentario: 'El vendedor tardó mucho en responder y el envío se demoró.', estado: 'published' },
    { id: '11', tipo: 'product', targetId: 'p6', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 5, comentario: 'Muy bonitas y cómodas. Llegaron rápido y bien embaladas.', estado: 'published' },
    { id: '12', tipo: 'product', targetId: 'p7', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 4, comentario: 'Buen producto, cumple con lo esperado. Relación calidad-precio aceptable.', estado: 'published' },
    { id: '13', tipo: 'seller', targetId: 's4', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 3, comentario: 'El vendedor fue amable pero el envío tardó más de lo indicado.', estado: 'published' },
    { id: '14', tipo: 'product', targetId: 'p8', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 5, comentario: 'Super cómodas para caminar. Las uso todos los días.', estado: 'published' },
    { id: '15', tipo: 'product', targetId: 'p9', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 2, comentario: 'No me gustaron, el material se siente de baja calidad.', estado: 'published' },
    { id: '16', tipo: 'seller', targetId: 's3', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 4, comentario: 'Buena atención al cliente, respondieron rápido mis consultas.', estado: 'published' },
    { id: '17', tipo: 'product', targetId: 'p10', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 3, comentario: 'Están bien pero no son tan cómodas como esperaba.', estado: 'published' },
    { id: '18', tipo: 'product', targetId: 'p1', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 4, comentario: 'Buenas zapatillas, diseño bonito y talle correcto.', estado: 'published' },
    { id: '19', tipo: 'seller', targetId: 's2', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 5, comentario: 'Excelente servicio, el envío llegó antes de lo previsto.', estado: 'published' },
    { id: '20', tipo: 'product', targetId: 'p2', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 4, comentario: 'Muy cómodas para correr. Buena compra en general.', estado: 'published' },
  ]

  await prisma.reseña.createMany({ data: reseñas })

  const reportes = [
    { id: 'r1', reseñaId: '4', reporterId: 'u3', razon: 'Contenido falso, el usuario nunca compró el producto.', resuelto: false },
    { id: 'r2', reseñaId: '10', reporterId: 'u10', razon: 'Lenguaje inapropiado en la reseña.', resuelto: false },
    { id: 'r3', reseñaId: '1', reporterId: 'u11', razon: 'La reseña parece ser un review falso (muy positivo, poca credibilidad).', resuelto: true, resolvedBy: 'u10', adminComment: 'La reseña parece legítima, el usuario efectivamente compró el producto.' },
    { id: 'r4', reseñaId: '2', reporterId: 'u12', razon: 'La reseña contiene información engañosa sobre el producto.', resuelto: false },
    { id: 'r5', reseñaId: '3', reporterId: 'u13', razon: 'El usuario no especifica detalles reales de la compra.', resuelto: false },
    { id: 'r6', reseñaId: '5', reporterId: 'u14', razon: 'Reseña sospechosamente positiva sin fundamentos.', resuelto: false },
    { id: 'r7', reseñaId: '6', reporterId: 'u15', razon: 'El comentario parece generado o copiado de otro lado.', resuelto: true, resolvedBy: 'u10', adminComment: 'Se determinó que la reseña es legítima.' },
    { id: 'r8', reseñaId: '7', reporterId: 'u16', razon: 'Lenguaje ofensivo hacia el producto y la tienda.', resuelto: false },
    { id: 'r9', reseñaId: '8', reporterId: 'u17', razon: 'El usuario no verificó la compra antes de reseñar.', resuelto: false },
    { id: 'r10', reseñaId: '9', reporterId: 'u18', razon: 'Reseña duplicada, el mismo usuario ya comentó antes.', resuelto: false },
  ]

  await prisma.reporte.createMany({ data: reportes })

  console.log('Seed completado: 19 usuarios, 4 vendedores, 10 productos, 20 reseñas y 10 reportes insertados.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
