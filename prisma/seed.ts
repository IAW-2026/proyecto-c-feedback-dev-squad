import { PrismaClient } from '@prisma/client'
import { syncFromSellerApp } from '../services/sync'

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

  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where: { id: u.id },
      create: u,
      update: { nombre: u.nombre, apellido: u.apellido, rol: u.rol },
    })
  }

  let sellerCount: number
  let productCount: number

  try {
    const result = await syncFromSellerApp()
    sellerCount = result.sellers
    productCount = result.products
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.warn(`No se pudo conectar con seller app (${message}), usando datos hardcodeados`)

    const hardcodedVendedores = [
      { id: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7', nombre: 'Bart Simpson' },
      { id: '66417466-0ce0-4e18-b5e3-e228ac390c24', nombre: 'Brian Crowley' },
      { id: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1', nombre: 'Seller Tester' },
      { id: '5c68448c-0c67-4d71-915a-f5e51ddbc259', nombre: 'Lady Gaga' },
    ]

    const hardcodedProductos = [
      { id: 'e9a8aabe-d151-4cac-bfa9-9e2726d32a11', nombre: 'Zapa prueba', vendedorId: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1' },
      { id: 'b80c7c9e-d145-407e-a530-4c2b3fa9abb9', nombre: 'Walter White BB pure lifestyle', vendedorId: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1' },
      { id: 'cd9120b3-1fec-4d34-be2c-f1bb2c78e864', nombre: 'Rick Grimes TWD comfy edition', vendedorId: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1' },
      { id: '5af5c896-970a-4258-bfb6-1196c17c8ea4', nombre: 'Gaga Applause ARTPOP Ultimate', vendedorId: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1' },
      { id: '22c89b68-ee74-4ab3-aab8-b9c3d1f568a7', nombre: 'Simpson Ultimate lifestyle', vendedorId: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1' },
      { id: '5b01cc09-71cb-4ef9-ae54-a4c2002924cb', nombre: 'Gaga running Ultimate edition', vendedorId: '5c68448c-0c67-4d71-915a-f5e51ddbc259' },
      { id: 'ec89fcbc-762d-4490-92ab-ce1ec7e36dfa', nombre: 'Puma Suede Classic', vendedorId: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7' },
      { id: 'faec1fa4-5ca4-40f4-905d-97af6e3dec78', nombre: 'Reebok Classic Leather', vendedorId: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7' },
      { id: '286803d1-f925-4aaf-adbc-8b9aa654dd76', nombre: 'Converse Chuck Taylor All Star', vendedorId: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7' },
      { id: 'd5c6e1d8-775a-4e5f-aae9-a5d160b65038', nombre: 'New Balance 574', vendedorId: '66417466-0ce0-4e18-b5e3-e228ac390c24' },
      { id: '8cd97783-baa6-427c-b03f-61d531e2baa7', nombre: 'Nike Air Max 90', vendedorId: '66417466-0ce0-4e18-b5e3-e228ac390c24' },
      { id: 'a2b9cef0-f598-4069-8dc5-62fdd58a1715', nombre: 'Adidas Ultraboost 23', vendedorId: '66417466-0ce0-4e18-b5e3-e228ac390c24' },
    ]

    for (const v of hardcodedVendedores) {
      await prisma.vendedor.upsert({
        where: { id: v.id },
        create: v,
        update: { nombre: v.nombre },
      })
    }

    for (const p of hardcodedProductos) {
      await prisma.producto.upsert({
        where: { id: p.id },
        create: p,
        update: { nombre: p.nombre, vendedorId: p.vendedorId },
      })
    }

    sellerCount = hardcodedVendedores.length
    productCount = hardcodedProductos.length
  }

  const reviewData = [
    { id: '1', tipo: 'product', targetId: 'e9a8aabe-d151-4cac-bfa9-9e2726d32a11', userId: 'u1', rating: 5, comentario: 'Excelente zapatilla, muy cómoda y llegó en perfecto estado.', estado: 'published' },
    { id: '2', tipo: 'product', targetId: 'b80c7c9e-d145-407e-a530-4c2b3fa9abb9', userId: 'u2', rating: 4, comentario: 'Muy buenas, solo que el talle viene un poco grande.', estado: 'reported' },
    { id: '3', tipo: 'seller', targetId: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7', userId: 'u3', rating: 3, comentario: 'El vendedor fue rápido, pero el producto no era exactamente lo que esperaba.', estado: 'reported' },
    { id: '4', tipo: 'product', targetId: 'cd9120b3-1fec-4d34-be2c-f1bb2c78e864', userId: 'u1', rating: 2, comentario: 'No me gustaron, la suela es muy dura.', estado: 'reported' },
    { id: '5', tipo: 'seller', targetId: '66417466-0ce0-4e18-b5e3-e228ac390c24', userId: 'u4', rating: 5, comentario: 'Atención excelente, respondieron todas mis dudas y el envío fue súper rápido.', estado: 'reported' },
    { id: '6', tipo: 'product', targetId: '5af5c896-970a-4258-bfb6-1196c17c8ea4', userId: 'u5', rating: 4, comentario: 'Clásicas y cómodas. Relación precio-calidad excelente.', estado: 'published' },
    { id: '7', tipo: 'product', targetId: 'e9a8aabe-d151-4cac-bfa9-9e2726d32a11', userId: 'u6', rating: 1, comentario: 'Se rompieron a los dos meses. No las recomiendo.', estado: 'reported' },
    { id: '8', tipo: 'seller', targetId: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1', userId: 'u7', rating: 4, comentario: 'Buen vendedor, el producto llegó en fecha y bien embalado.', estado: 'reported' },
    { id: '9', tipo: 'product', targetId: '22c89b68-ee74-4ab3-aab8-b9c3d1f568a7', userId: 'u8', rating: 5, comentario: 'Hermosas, tal cual las fotos. Muy contenta con la compra.', estado: 'reported' },
    { id: '10', tipo: 'seller', targetId: '5c68448c-0c67-4d71-915a-f5e51ddbc259', userId: 'u9', rating: 2, comentario: 'El vendedor tardó mucho en responder y el envío se demoró.', estado: 'reported' },
    { id: '11', tipo: 'product', targetId: 'd5c6e1d8-775a-4e5f-aae9-a5d160b65038', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 5, comentario: 'Muy bonitas y cómodas. Llegaron rápido y bien embaladas.', estado: 'published' },
    { id: '12', tipo: 'product', targetId: 'faec1fa4-5ca4-40f4-905d-97af6e3dec78', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 4, comentario: 'Buen producto, cumple con lo esperado. Relación calidad-precio aceptable.', estado: 'published' },
    { id: '13', tipo: 'seller', targetId: '5c68448c-0c67-4d71-915a-f5e51ddbc259', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 3, comentario: 'El vendedor fue amable pero el envío tardó más de lo indicado.', estado: 'published' },
    { id: '14', tipo: 'product', targetId: 'ec89fcbc-762d-4490-92ab-ce1ec7e36dfa', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 5, comentario: 'Super cómodas para caminar. Las uso todos los días.', estado: 'published' },
    { id: '15', tipo: 'product', targetId: '286803d1-f925-4aaf-adbc-8b9aa654dd76', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 2, comentario: 'No me gustaron, el material se siente de baja calidad.', estado: 'published' },
    { id: '16', tipo: 'seller', targetId: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 4, comentario: 'Buena atención al cliente, respondieron rápido mis consultas.', estado: 'published' },
    { id: '17', tipo: 'product', targetId: 'a2b9cef0-f598-4069-8dc5-62fdd58a1715', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 3, comentario: 'Están bien pero no son tan cómodas como esperaba.', estado: 'published' },
    { id: '18', tipo: 'product', targetId: 'e9a8aabe-d151-4cac-bfa9-9e2726d32a11', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 4, comentario: 'Buenas zapatillas, diseño bonito y talle correcto.', estado: 'published' },
    { id: '19', tipo: 'seller', targetId: '66417466-0ce0-4e18-b5e3-e228ac390c24', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 5, comentario: 'Excelente servicio, el envío llegó antes de lo previsto.', estado: 'published' },
    { id: '20', tipo: 'product', targetId: 'a2b9cef0-f598-4069-8dc5-62fdd58a1715', userId: 'user_3DK1NXhCR69ixMT496ab2Z4j0cd', rating: 4, comentario: 'Muy cómodas para correr. Buena compra en general.', estado: 'published' },
    { id: '21', tipo: 'seller', targetId: '5c68448c-0c67-4d71-915a-f5e51ddbc259', userId: 'u10', rating: 4, comentario: 'Buena atención, el vendedor fue muy cordial.', estado: 'published' },
    { id: '22', tipo: 'product', targetId: 'd5c6e1d8-775a-4e5f-aae9-a5d160b65038', userId: 'u11', rating: 5, comentario: 'Excelente producto, superó mis expectativas.', estado: 'published' },
    { id: '23', tipo: 'seller', targetId: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1', userId: 'u12', rating: 3, comentario: 'El envío fue un poco lento pero el producto llegó bien.', estado: 'published' },
    { id: '24', tipo: 'product', targetId: 'cd9120b3-1fec-4d34-be2c-f1bb2c78e864', userId: 'u13', rating: 4, comentario: 'Muy bonitas y están en oferta, gran compra.', estado: 'published' },
    { id: '25', tipo: 'seller', targetId: '66417466-0ce0-4e18-b5e3-e228ac390c24', userId: 'u14', rating: 5, comentario: 'Muy recomendable, volvería a comprar sin dudas.', estado: 'published' },
    { id: '26', tipo: 'product', targetId: 'ec89fcbc-762d-4490-92ab-ce1ec7e36dfa', userId: 'u15', rating: 2, comentario: 'No me gustaron, el diseño no es como en la foto.', estado: 'published' },
    { id: '27', tipo: 'seller', targetId: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7', userId: 'u16', rating: 4, comentario: 'Atención personalizada y rápida, buena experiencia.', estado: 'published' },
    { id: '28', tipo: 'product', targetId: '286803d1-f925-4aaf-adbc-8b9aa654dd76', userId: 'u17', rating: 3, comentario: 'Cumplen su función, nada del otro mundo.', estado: 'published' },
    { id: '29', tipo: 'seller', targetId: '5c68448c-0c67-4d71-915a-f5e51ddbc259', userId: 'u18', rating: 5, comentario: 'Excelente vendedor, muy profesional.', estado: 'published' },
    { id: '30', tipo: 'product', targetId: 'a2b9cef0-f598-4069-8dc5-62fdd58a1715', userId: 'u3', rating: 1, comentario: 'Pésimo producto, se descosió a los pocos días.', estado: 'reported' },
    { id: '31', tipo: 'product', targetId: '8cd97783-baa6-427c-b03f-61d531e2baa7', userId: 'u2', rating: 5, comentario: 'Las mejores zapatillas que tuve, súper recomendadas.', estado: 'published' },
    { id: '32', tipo: 'product', targetId: '5b01cc09-71cb-4ef9-ae54-a4c2002924cb', userId: 'u4', rating: 3, comentario: 'Están bien pero esperaba más calidad por el precio.', estado: 'published' },
    { id: '33', tipo: 'seller', targetId: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7', userId: 'u5', rating: 5, comentario: 'Bart Simpson es un genio, atención increíble.', estado: 'reported' },
    { id: '34', tipo: 'product', targetId: 'e9a8aabe-d151-4cac-bfa9-9e2726d32a11', userId: 'u7', rating: 4, comentario: 'Muy lindas y cómodas para el día a día.', estado: 'published' },
    { id: '35', tipo: 'product', targetId: 'b80c7c9e-d145-407e-a530-4c2b3fa9abb9', userId: 'u8', rating: 5, comentario: 'Diseño espectacular, todos me preguntan dónde las compré.', estado: 'published' },
    { id: '36', tipo: 'seller', targetId: '66417466-0ce0-4e18-b5e3-e228ac390c24', userId: 'u9', rating: 4, comentario: 'Brian Crowley muy profesional, envío rápido.', estado: 'published' },
    { id: '37', tipo: 'product', targetId: 'cd9120b3-1fec-4d34-be2c-f1bb2c78e864', userId: 'u11', rating: 5, comentario: 'Los diseños de TWD son lo máximo, muy fan.', estado: 'published' },
    { id: '38', tipo: 'product', targetId: '5af5c896-970a-4258-bfb6-1196c17c8ea4', userId: 'u12', rating: 4, comentario: 'Muy fashion, Lady Gaga inspiró esto seguro.', estado: 'reported' },
    { id: '39', tipo: 'seller', targetId: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1', userId: 'u13', rating: 2, comentario: 'El vendedor no respondió mis consultas a tiempo.', estado: 'reported' },
    { id: '40', tipo: 'product', targetId: '22c89b68-ee74-4ab3-aab8-b9c3d1f568a7', userId: 'u14', rating: 5, comentario: 'Simpson lifestyle es todo, muy originales.', estado: 'published' },
    { id: '41', tipo: 'product', targetId: '5b01cc09-71cb-4ef9-ae54-a4c2002924cb', userId: 'u15', rating: 1, comentario: 'Se me rompieron al primer uso, malísimas.', estado: 'reported' },
    { id: '42', tipo: 'seller', targetId: '5c68448c-0c67-4d71-915a-f5e51ddbc259', userId: 'u16', rating: 5, comentario: 'Lady Gaga vende productos de altísima calidad.', estado: 'published' },
    { id: '43', tipo: 'product', targetId: 'ec89fcbc-762d-4490-92ab-ce1ec7e36dfa', userId: 'u17', rating: 4, comentario: 'Puma clásicas, siempre un acierto.', estado: 'published' },
    { id: '44', tipo: 'product', targetId: 'faec1fa4-5ca4-40f4-905d-97af6e3dec78', userId: 'u18', rating: 3, comentario: 'Reebok cumple, pero hay mejores opciones.', estado: 'published' },
    { id: '45', tipo: 'seller', targetId: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7', userId: 'u6', rating: 4, comentario: 'Muy buena comunicación con el vendedor.', estado: 'published' },
    { id: '46', tipo: 'product', targetId: '286803d1-f925-4aaf-adbc-8b9aa654dd76', userId: 'u2', rating: 5, comentario: 'Las Converse Chuck Taylor son eternas, me encantan.', estado: 'published' },
    { id: '47', tipo: 'product', targetId: 'd5c6e1d8-775a-4e5f-aae9-a5d160b65038', userId: 'u4', rating: 4, comentario: 'New Balance 574, clásicas y cómodas.', estado: 'published' },
    { id: '48', tipo: 'seller', targetId: '66417466-0ce0-4e18-b5e3-e228ac390c24', userId: 'u5', rating: 3, comentario: 'Brian Crowley podría mejorar la comunicación.', estado: 'published' },
    { id: '49', tipo: 'product', targetId: '8cd97783-baa6-427c-b03f-61d531e2baa7', userId: 'u7', rating: 5, comentario: 'Nike Air Max 90, las más cómodas para correr.', estado: 'published' },
    { id: '50', tipo: 'product', targetId: 'a2b9cef0-f598-4069-8dc5-62fdd58a1715', userId: 'u8', rating: 4, comentario: 'Adidas Ultraboost, buena amortiguación.', estado: 'published' },
    { id: '51', tipo: 'seller', targetId: 'e6b0ed62-ae0b-472c-bb90-1d65ebc43be1', userId: 'u9', rating: 1, comentario: 'Pésima experiencia con Seller Tester, no responde.', estado: 'reported' },
    { id: '52', tipo: 'product', targetId: 'e9a8aabe-d151-4cac-bfa9-9e2726d32a11', userId: 'u11', rating: 3, comentario: 'Zapa prueba correctas, nada especial.', estado: 'published' },
    { id: '53', tipo: 'seller', targetId: '5c68448c-0c67-4d71-915a-f5e51ddbc259', userId: 'u12', rating: 5, comentario: 'Lady Gaga es una artista y sus productos lo reflejan.', estado: 'reported' },
    { id: '54', tipo: 'product', targetId: 'b80c7c9e-d145-407e-a530-4c2b3fa9abb9', userId: 'u13', rating: 4, comentario: 'Walter White edition, para los fans de Breaking Bad.', estado: 'published' },
    { id: '55', tipo: 'seller', targetId: 'f0b8dfe4-e78e-46da-9b24-04f2167724b7', userId: 'u14', rating: 5, comentario: 'Bart Simpson vende las mejores zapatillas urbanas.', estado: 'published' },
    { id: '56', tipo: 'product', targetId: 'cd9120b3-1fec-4d34-be2c-f1bb2c78e864', userId: 'u15', rating: 2, comentario: 'No era lo que esperaba, la tela es delgada.', estado: 'published' },
    { id: '57', tipo: 'product', targetId: '5af5c896-970a-4258-bfb6-1196c17c8ea4', userId: 'u16', rating: 5, comentario: 'Espectaculares, ARTPOP vive en estas zapatillas.', estado: 'published' },
    { id: '58', tipo: 'seller', targetId: '66417466-0ce0-4e18-b5e3-e228ac390c24', userId: 'u17', rating: 4, comentario: 'Brian Crowley entrega rápido y bien embalado.', estado: 'published' },
    { id: '59', tipo: 'product', targetId: '22c89b68-ee74-4ab3-aab8-b9c3d1f568a7', userId: 'u18', rating: 3, comentario: 'Simpson lifestyle está bien pero esperaba más.', estado: 'published' },
    { id: '60', tipo: 'product', targetId: '5b01cc09-71cb-4ef9-ae54-a4c2002924cb', userId: 'u1', rating: 5, comentario: 'Gaga running edition, perfectas para correr con estilo.', estado: 'published' },
  ]

  await prisma.reseña.createMany({ data: reviewData, skipDuplicates: true })

  const reportData = [
    { id: 'r1', reseñaId: '4', reporterId: 'u3', razon: 'Contenido falso, el usuario nunca compró el producto.', resuelto: false },
    { id: 'r2', reseñaId: '10', reporterId: 'u10', razon: 'Lenguaje inapropiado en la reseña.', resuelto: false },
    { id: 'r3', reseñaId: '7', reporterId: 'u11', razon: 'La reseña parece ser un review falso (muy positivo, poca credibilidad).', resuelto: true, resolvedBy: 'u10', comentarioAdmin: 'La reseña parece legítima, el usuario efectivamente compró el producto.' },
    { id: 'r4', reseñaId: '2', reporterId: 'u12', razon: 'La reseña contiene información engañosa sobre el producto.', resuelto: false },
    { id: 'r5', reseñaId: '3', reporterId: 'u13', razon: 'El usuario no especifica detalles reales de la compra.', resuelto: false },
    { id: 'r6', reseñaId: '5', reporterId: 'u14', razon: 'Reseña sospechosamente positiva sin fundamentos.', resuelto: false },
    { id: 'r7', reseñaId: '9', reporterId: 'u15', razon: 'El comentario parece generado o copiado de otro lado.', resuelto: true, resolvedBy: 'u10', comentarioAdmin: 'Se determinó que la reseña es legítima.' },
    { id: 'r8', reseñaId: '33', reporterId: 'u16', razon: 'Lenguaje ofensivo hacia el producto y la tienda.', resuelto: false },
    { id: 'r9', reseñaId: '8', reporterId: 'u17', razon: 'El usuario no verificó la compra antes de reseñar.', resuelto: false },
    { id: 'r10', reseñaId: '38', reporterId: 'u18', razon: 'Reseña duplicada, el mismo usuario ya comentó antes.', resuelto: false },
    { id: 'r11', reseñaId: '21', reporterId: 'u5', razon: 'El usuario admin no debería poder reseñar como vendedor.', resuelto: true, resolvedBy: 'u19', comentarioAdmin: 'El admin puede reseñar como cualquier usuario, no hay impedimento.' },
    { id: 'r12', reseñaId: '41', reporterId: 'u3', razon: 'La reseña contiene información engañosa sobre el producto.', resuelto: true, resolvedBy: 'u19', comentarioAdmin: 'El usuario efectuó la compra y su opinión es válida.' },
    { id: 'r13', reseñaId: '30', reporterId: 'u8', razon: 'Lenguaje inapropiado hacia el producto.', resuelto: false },
    { id: 'r14', reseñaId: '39', reporterId: 'u10', razon: 'El vendedor merece una oportunidad de responder.', resuelto: false },
    { id: 'r15', reseñaId: '51', reporterId: 'u11', razon: 'Reseña vengativa por problemas de envío.', resuelto: true, resolvedBy: 'u19', comentarioAdmin: 'Se determinó que la reseña refleja una experiencia real.' },
    { id: 'r16', reseñaId: '53', reporterId: 'u13', razon: 'Comentario excesivamente subjetivo sobre el vendedor.', resuelto: false },
  ]

  await prisma.reporte.createMany({ data: reportData, skipDuplicates: true })

  console.log(`Seed completado: 20 usuarios, ${sellerCount} vendedores, ${productCount} productos, 60 reseñas y 16 reportes insertados.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
