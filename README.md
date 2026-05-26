# Feedback App — ZapasYA

> Aplicación de reseñas y calificaciones para el marketplace ZapasYA.  
> Los compradores pueden calificar productos y vendedores, y los administradores moderan reportes sobre reseñas.

🔗 **Deploy:** *https://proyecto-c-feedback-dev-squad.vercel.app/*

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Autenticación | Clerk |
| Estilos | Tailwind CSS |
| Base de datos | PostgreSQL + Prisma |
| Lenguaje | TypeScript |
| IA | Google Gemini (gemini-2.5-flash) |

---

## Funcionalidades

- Crear reseñas de productos y vendedores con calificación de 1 a 5 estrellas
- Validación de compras: solo se pueden reseñar productos/sellers que el usuario haya comprado
- Ver historial de reseñas propias con búsqueda y filtros
- Panel de administración para gestionar reportes (desestimar o eliminar reseñas)
- Opinión generada por IA para ayudar al admin a decidir sobre reportes
- Navegación pública de productos y vendedores con búsqueda y filtros
- Estadísticas de reseñas con distribución de puntuaciones
- Resumen de reseñas generado por IA
- Moderación de reseñas por IA

---

## Instalación

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key de Clerk |
| `CLERK_SECRET_KEY` | Secret key de Clerk |
| `DATABASE_URL` | Connection string de PostgreSQL |
| `API_KEY_BUYER_APP` | API key para Buyer App |
| `API_KEY_SELLER_APP` | API key para Seller App |
| `GEMINI_API_KEY` | API key de Google Gemini |
| `BUYER_APP_URL` | URL base de la Buyer App para consultar compras del usuario (Etapa 3) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |

---

## Filtrado por compras

Los usuarios solo pueden reseñar productos que hayan comprado y vendedores de los que hayan adquirido un producto.

Actualmente en **Etapa 2** el sistema devuelve todos los productos/vendedores disponibles (modo mock), por lo que no hay restricción visible.

---

## Usuarios

### Usuario normal (comprador/vendedor)
Se registra por sí mismo desde `/sign-up`. Puede crear reseñas y ver sus reseñas. La primera vez que realiza una acción, su cuenta se sincroniza automáticamente en la base de datos local.

### Administrador
El rol de administrador se gestiona localmente en la base de datos:

1. Obtener el ID del usuario desde Clerk (dashboard o `user.id` en consola)
2. Ejecutar en la base de datos:
   ```sql
   UPDATE "Usuario" SET role = 'admin' WHERE id = 'clerk_user_id';
   ```
3. También se puede hacer desde Prisma Studio:
   ```bash
   pnpm prisma studio
   ```
---

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing page |
| `/sign-in` | Público | Inicio de sesión |
| `/sign-up` | Público | Registro |
| `/dashboard/crear-resena` | Autenticado | Crear reseña |
| `/dashboard/mis-resenas` | Autenticado | Historial de reseñas |
| `/admin/reportes` | Admin | Moderación de reportes |
| `/explorar` | Autenticado | Explorar reseñas (tabs + búsqueda) |
| `/explorar/producto/[id]` | Autenticado | Reseñas de un producto |
| `/explorar/vendedor/[id]` | Autenticado | Reseñas de un vendedor |

---

## API endpoints

La Feedback App expone endpoints REST para ser consumidos por las otras apps del ecosistema ZapasYA (Buyer App, Seller App). Están disponibles en `/api/`.

> **Auth:** Todos los endpoints requieren una API key válida con restricción por servicio:
> - Endpoints de creación (reviews) solo aceptan key de **Buyer App**
> - Endpoints de consulta de reseñas de vendedor solo aceptan key de **Seller App**
> - Endpoints de reportes y estadísticas aceptan ambas keys
>
> Se envía por:
> - **Header:** `Authorization: Bearer <api_key>`
> - **Query param:** `?api_key=<api_key>`

---

### POST /api/reviews/seller

Crear una reseña de vendedor.

**Body:**

```json
{
  "targetId": "uuid-del-vendedor",
  "userId": "uuid-del-comprador",
  "userName": "Juan Pérez",
  "rating": 4,
  "comentario": "Buena atención, respondió rápido"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| targetId | string | sí | ID del vendedor a calificar |
| userId | string | sí | ID del comprador que califica |
| rating | number | sí | Calificación del 1 al 5 |
| comentario | string | sí | Texto de la reseña (mín. 10 caracteres) |
| userName | string | — | Nombre del comprador |

**Response 201:**

```json
{
  "id": "uuid-generado",
  "tipo": "seller",
  "targetId": "uuid-del-vendedor",
  "targetName": "Zapatería Deportiva SRL",
  "userId": "uuid-del-comprador",
  "userName": "Juan Pérez",
  "rating": 4,
  "comentario": "Buena atención, respondió rápido",
  "estado": "published",
  "fecha": "2026-05-07T19:30:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 401 | API key inválida o faltante |
| 400 | Datos inválidos (rating fuera de rango, campos faltantes) |
| 409 | Ya existe una reseña activa para este vendedor |
| 500 | Error interno del servidor |

---

### POST /api/reviews/product

Crear una reseña de producto.

**Body:**

```json
{
  "targetId": "uuid-del-producto",
  "userId": "uuid-del-comprador",
  "userName": "María López",
  "rating": 5,
  "comentario": "Excelente producto, tal como se describe"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| targetId | string | sí | ID del producto a calificar |
| userId | string | sí | ID del comprador que califica |
| rating | number | sí | Calificación del 1 al 5 |
| comentario | string | sí | Texto de la reseña (mín. 10 caracteres) |
| userName | string | — | Nombre del comprador |

**Response 201:**

```json
{
  "id": "uuid-generado",
  "tipo": "product",
  "targetId": "uuid-del-producto",
  "targetName": "Nike Air Max 270",
  "sellerName": "Sneakers Store",
  "userId": "uuid-del-comprador",
  "userName": "María López",
  "rating": 5,
  "comentario": "Excelente producto, tal como se describe",
  "estado": "published",
  "fecha": "2026-05-07T19:30:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 401 | API key inválida o faltante |
| 400 | Datos inválidos (rating fuera de rango, campos faltantes) |
| 409 | Ya existe una reseña activa para este producto |
| 500 | Error interno del servidor |

---

### GET /api/reviews/product/[id]

Obtener reseñas de un producto. Si se incluye `?includeSummary=true` también devuelve estadísticas y un resumen generado por IA.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|:-------:|-------------|
| page | number | 1 | Número de página |
| limit | number | 10 | Cantidad de reseñas por página |
| search | string | — | Búsqueda por texto en el comentario |
| includeSummary | boolean | false | Si es `true`, incluye `stats` y `aiSummary` en la respuesta |
| name | string | — | Nombre del producto (para el resumen de IA; si no se envía, se obtiene de la base de datos) |

**Response 200 (sin IA):**

```json
{
  "data": [
    {
      "id": "uuid",
      "tipo": "product",
      "targetId": "uuid-del-producto",
      "userId": "uuid-del-comprador",
      "userName": "María López",
      "rating": 5,
      "comentario": "Excelente producto",
      "targetName": "Nike Air Max 270",
      "sellerName": "Sneakers Store",
      "estado": "published",
      "fecha": "2026-05-07T19:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

**Response 200 (con `?includeSummary=true`):**

```json
{
  "data": [
    {
      "id": "uuid",
      "tipo": "product",
      "targetId": "uuid-del-producto",
      "userId": "uuid-del-comprador",
      "userName": "María López",
      "rating": 5,
      "comentario": "Excelente producto",
      "targetName": "Nike Air Max 270",
      "sellerName": "Sneakers Store",
      "estado": "published",
      "fecha": "2026-05-07T19:30:00.000Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "stats": {
    "averageRating": 4.2,
    "totalReviews": 3,
    "ratingDistribution": {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 1,
      "5": 2
    }
  },
  "aiSummary": "Los clientes destacan la comodidad y el diseño de Nike Air Max 270. La mayoría lo recomienda, aunque algunos mencionan problemas de durabilidad."
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 401 | API key inválida o faltante |
| 500 | Error interno del servidor |

---

### GET /api/reviews/seller/[id]

Obtener reseñas de un vendedor. Si se incluye `?includeSummary=true` también devuelve estadísticas y un resumen generado por IA.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|:-------:|-------------|
| page | number | 1 | Número de página |
| limit | number | 10 | Cantidad de reseñas por página |
| search | string | — | Búsqueda por texto en el comentario |
| includeSummary | boolean | false | Si es `true`, incluye `stats` y `aiSummary` en la respuesta |
| name | string | — | Nombre del vendedor (para el resumen de IA; si no se envía, se obtiene de la base de datos) |

**Response 200 (sin IA):**

```json
{
  "data": [
    {
      "id": "uuid",
      "tipo": "seller",
      "targetId": "uuid-del-vendedor",
      "userId": "uuid-del-comprador",
      "userName": "Juan García",
      "rating": 4,
      "comentario": "Buena atención",
      "targetName": "Zapatería Deportiva SRL",
      "estado": "published",
      "fecha": "2026-05-07T19:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

**Response 200 (con `?includeSummary=true`):**

```json
{
  "data": [
    {
      "id": "uuid",
      "tipo": "seller",
      "targetId": "uuid-del-vendedor",
      "userId": "uuid-del-comprador",
      "userName": "Juan García",
      "rating": 4,
      "comentario": "Buena atención",
      "targetName": "Zapatería Deportiva SRL",
      "estado": "published",
      "fecha": "2026-05-07T19:30:00.000Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "stats": {
    "averageRating": 3.5,
    "totalReviews": 2,
    "ratingDistribution": {
      "1": 0,
      "2": 0,
      "3": 1,
      "4": 1,
      "5": 0
    }
  },
  "aiSummary": "Los compradores destacan la rapidez en la atención y la comunicación clara con Zapatería Deportiva SRL, aunque algunos esperaban más del producto."
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 401 | API key inválida o faltante |
| 500 | Error interno del servidor |

---

### POST /api/reviews/[id]/report

Reportar una reseña específica.

**Body:**

```json
{
  "reporterId": "uuid-del-usuario-que-reporta",
  "reporterName": "Carlos García",
  "razon": "Contenido inapropiado"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| reporterId | string | sí | ID del usuario que reporta |
| razon | string | sí | Motivo del reporte |
| reporterName | string | — | Nombre del usuario que reporta |

**Response 201:**

```json
{
  "id": "uuid-generado",
  "reseñaId": "uuid-de-la-reseña",
  "reporterId": "uuid-del-usuario-que-reporta",
  "reporterName": "Carlos García",
  "razon": "Contenido inapropiado",
  "resuelto": false,
  "adminComment": null,
  "fecha": "2026-05-07T19:30:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 401 | API key inválida o faltante |
| 400 | Datos inválidos (campos faltantes) |
| 404 | Review no encontrada |
| 409 | Esta reseña ya fue reportada |
| 500 | Error interno del servidor |

---

### GET /api/stats/product/[id]

Obtener estadísticas de reseñas de un producto.

**Response 200:**

```json
{
  "averageRating": 4.2,
  "totalReviews": 15,
  "ratingDistribution": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 5,
    "5": 7
  }
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 401 | API key inválida o faltante |
| 500 | Error interno del servidor |

---

### GET /api/stats/seller/[id]

Obtener estadísticas de reseñas de un vendedor.

**Response 200:**

```json
{
  "averageRating": 4.5,
  "totalReviews": 10,
  "ratingDistribution": {
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 3,
    "5": 6
  }
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 401 | API key inválida o faltante |
| 500 | Error interno del servidor |

---

### Resumen de endpoints

| Método | Endpoint | Descripción |
|:------:|----------|-------------|
| POST | /api/reviews/seller | Crear reseña de vendedor |
| POST | /api/reviews/product | Crear reseña de producto |
| GET | /api/reviews/product/[id] | Obtener reseñas de producto |
| GET | /api/reviews/seller/[id] | Obtener reseñas de vendedor |
| POST | /api/reviews/[id]/report | Reportar una reseña |
| GET | /api/stats/product/[id] | Estadísticas de producto |
| GET | /api/stats/seller/[id] | Estadísticas de vendedor |

---

## Modelo de datos

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `Usuario` | Usuarios sincronizados desde Clerk con rol local (user/admin) |
| `Producto` | Productos replicados desde Seller App |
| `Vendedor` | Vendedores replicados desde Seller App |
| `Reseña` | Reseñas de productos y vendedores |
| `Reporte` | Reportes de reseñas con resolución por admin y comentario opcional del admin |

### Relaciones

- `Reseña.usuarioId` → `Usuario.id`
- `Reporte.reseñaId` → `Reseña.id`
- `Reporte.reporterId` → `Usuario.id`
- `Reporte.resolvedBy` → `Usuario.id` (admin que resuelve)
- `Producto.vendedorId` → `Vendedor.id`
