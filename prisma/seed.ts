import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const usuarios = [
    { id: 'u1', nombre: 'Carlos', apellido: 'Pérez', rol: 'user' },
    { id: 'u2', nombre: 'María', apellido: 'López', rol: 'user' },
    { id: 'u3', nombre: 'Juan', apellido: 'García', rol: 'user' },
    { id: 'u4', nombre: 'Ana', apellido: 'Martínez', rol: 'user' },
    { id: 'u5', nombre: 'Pedro', apellido: 'Rodríguez', rol: 'user' },
    { id: 'u6', nombre: 'Lucía', apellido: 'Fernández', rol: 'user' },
    { id: 'u7', nombre: 'Diego', apellido: 'Gómez', rol: 'user' },
    { id: 'u8', nombre: 'Sofía', apellido: 'Torres', rol: 'user' },
    { id: 'u9', nombre: 'Martín', apellido: 'Díaz', rol: 'user' },
    { id: 'u10', nombre: 'Admin', apellido: null, rol: 'admin' },
    { id: 'u11', nombre: 'Laura', apellido: 'Ruiz', rol: 'user' },
    { id: 'u12', nombre: 'Roberto', apellido: 'Sánchez', rol: 'user' },
    { id: 'u13', nombre: 'Valentina', apellido: 'Ortiz', rol: 'user' },
    { id: 'u14', nombre: 'Andrés', apellido: 'Mendoza', rol: 'user' },
    { id: 'u15', nombre: 'Camila', apellido: 'Ríos', rol: 'user' },
    { id: 'u16', nombre: 'Felipe', apellido: 'Navarro', rol: 'user' },
    { id: 'u17', nombre: 'Gabriela', apellido: 'Torres', rol: 'user' },
    { id: 'u18', nombre: 'Hugo', apellido: 'Delgado', rol: 'user' },
    { id: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', nombre: 'Usuario', apellido: 'Prueba', rol: 'user' },
    { id: 'u19', nombre: 'Sistema', apellido: 'Moderador', rol: 'admin' },
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
    { id: '2', tipo: 'product', targetId: 'p2', userId: 'u2', rating: 4, comentario: 'Muy buenas, solo que el talle viene un poco grande.', estado: 'reported' },
    { id: '3', tipo: 'seller', targetId: 's1', userId: 'u3', rating: 3, comentario: 'El vendedor fue rápido, pero el producto no era exactamente lo que esperaba.', estado: 'reported' },
    { id: '4', tipo: 'product', targetId: 'p3', userId: 'u1', rating: 2, comentario: 'No me gustaron, la suela es muy dura.', estado: 'reported' },
    { id: '5', tipo: 'seller', targetId: 's2', userId: 'u4', rating: 5, comentario: 'Atención excelente, respondieron todas mis dudas y el envío fue súper rápido.', estado: 'reported' },
    { id: '6', tipo: 'product', targetId: 'p4', userId: 'u5', rating: 4, comentario: 'Clásicas y cómodas. Relación precio-calidad excelente.', estado: 'published' },
    { id: '7', tipo: 'product', targetId: 'p1', userId: 'u6', rating: 1, comentario: 'Se rompieron a los dos meses. No las recomiendo.', estado: 'reported' },
    { id: '8', tipo: 'seller', targetId: 's1', userId: 'u7', rating: 4, comentario: 'Buen vendedor, el producto llegó en fecha y bien embalado.', estado: 'reported' },
    { id: '9', tipo: 'product', targetId: 'p5', userId: 'u8', rating: 5, comentario: 'Hermosas, tal cual las fotos. Muy contenta con la compra.', estado: 'reported' },
    { id: '10', tipo: 'seller', targetId: 's3', userId: 'u9', rating: 2, comentario: 'El vendedor tardó mucho en responder y el envío se demoró.', estado: 'reported' },
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
    { id: '21', tipo: 'seller', targetId: 's4', userId: 'u10', rating: 4, comentario: 'Buena atención, el vendedor fue muy cordial.', estado: 'published' },
    { id: '22', tipo: 'product', targetId: 'p6', userId: 'u11', rating: 5, comentario: 'Excelente producto, superó mis expectativas.', estado: 'published' },
    { id: '23', tipo: 'seller', targetId: 's1', userId: 'u12', rating: 3, comentario: 'El envío fue un poco lento pero el producto llegó bien.', estado: 'published' },
    { id: '24', tipo: 'product', targetId: 'p3', userId: 'u13', rating: 4, comentario: 'Muy bonitas y están en oferta, gran compra.', estado: 'published' },
    { id: '25', tipo: 'seller', targetId: 's2', userId: 'u14', rating: 5, comentario: 'Muy recomendable, volvería a comprar sin dudas.', estado: 'published' },
    { id: '26', tipo: 'product', targetId: 'p8', userId: 'u15', rating: 2, comentario: 'No me gustaron, el diseño no es como en la foto.', estado: 'published' },
    { id: '27', tipo: 'seller', targetId: 's3', userId: 'u16', rating: 4, comentario: 'Atención personalizada y rápida, buena experiencia.', estado: 'published' },
    { id: '28', tipo: 'product', targetId: 'p9', userId: 'u17', rating: 3, comentario: 'Cumplen su función, nada del otro mundo.', estado: 'published' },
    { id: '29', tipo: 'seller', targetId: 's4', userId: 'u18', rating: 5, comentario: 'Excelente vendedor, muy profesional.', estado: 'published' },
    { id: '30', tipo: 'product', targetId: 'p10', userId: 'u3', rating: 1, comentario: 'Pésimo producto, se descosió a los pocos días.', estado: 'reported' },
  ]

  await prisma.reseña.createMany({ data: reseñas })

  const reportes = [
    { id: 'r1', reseñaId: '4', reporterId: 'u3', razon: 'Contenido falso, el usuario nunca compró el producto.', resuelto: false },
    { id: 'r2', reseñaId: '10', reporterId: 'u10', razon: 'Lenguaje inapropiado en la reseña.', resuelto: false },
    { id: 'r3', reseñaId: '1', reporterId: 'u11', razon: 'La reseña parece ser un review falso (muy positivo, poca credibilidad).', resuelto: true, resolvedBy: 'u10', comentarioAdmin: 'La reseña parece legítima, el usuario efectivamente compró el producto.' },
    { id: 'r4', reseñaId: '2', reporterId: 'u12', razon: 'La reseña contiene información engañosa sobre el producto.', resuelto: false },
    { id: 'r5', reseñaId: '3', reporterId: 'u13', razon: 'El usuario no especifica detalles reales de la compra.', resuelto: false },
    { id: 'r6', reseñaId: '5', reporterId: 'u14', razon: 'Reseña sospechosamente positiva sin fundamentos.', resuelto: false },
    { id: 'r7', reseñaId: '6', reporterId: 'u15', razon: 'El comentario parece generado o copiado de otro lado.', resuelto: true, resolvedBy: 'u10', comentarioAdmin: 'Se determinó que la reseña es legítima.' },
    { id: 'r8', reseñaId: '7', reporterId: 'u16', razon: 'Lenguaje ofensivo hacia el producto y la tienda.', resuelto: false },
    { id: 'r9', reseñaId: '8', reporterId: 'u17', razon: 'El usuario no verificó la compra antes de reseñar.', resuelto: false },
    { id: 'r10', reseñaId: '9', reporterId: 'u18', razon: 'Reseña duplicada, el mismo usuario ya comentó antes.', resuelto: false },
    { id: 'r11', reseñaId: '21', reporterId: 'u5', razon: 'El usuario admin no debería poder reseñar como vendedor.', resuelto: true, resolvedBy: 'u19', comentarioAdmin: 'El admin puede reseñar como cualquier usuario, no hay impedimento.' },
    { id: 'r12', reseñaId: '26', reporterId: 'u3', razon: 'La reseña contiene información engañosa sobre el producto.', resuelto: true, resolvedBy: 'u19', comentarioAdmin: 'El usuario efectuó la compra y su opinión es válida.' },
    { id: 'r13', reseñaId: '30', reporterId: 'u8', razon: 'Lenguaje inapropiado hacia el producto.', resuelto: false },
  ]

  await prisma.reporte.createMany({ data: reportes })

  console.log('Seed completado: 20 usuarios, 4 vendedores, 10 productos, 30 reseñas y 13 reportes insertados.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
