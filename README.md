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

---

## Funcionalidades

- Crear reseñas de productos y vendedores con calificación de 1 a 5 estrellas
- Ver historial de reseñas propias con búsqueda y filtros
- Panel de administración para gestionar reportes (desestimar o eliminar reseñas)

---

## Instalación

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

Todas en `.env.example`. Las principales:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key de Clerk |
| `CLERK_SECRET_KEY` | Secret key de Clerk |
| `DATABASE_URL` | Connection string de PostgreSQL |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |

---

## Usuarios

### Usuario normal (comprador/vendedor)
Se registra por sí mismo desde `/sign-up`. Puede crear reseñas y ver sus reseñas.

### Administrador
Un usuario normal debe ser promovido a admin en el panel de Clerk:

1. Ir a [Dashboard de Clerk](https://dashboard.clerk.com) → Users
2. Seleccionar el usuario
3. En **Metadata** → **Public metadata**, agregar:
   ```json
   { "role": "admin" }
   ```
4. El usuario ya puede acceder a `/admin/reportes`

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

---

## API endpoints

La Feedback App expone endpoints REST para ser consumidos por las otras apps del ecosistema ZapasYA (Buyer App, Seller App). Están disponibles en `/api/`.

> **Nota:** Todos los endpoints usan formato JSON. Los IDs son UUIDs.

---

### POST /api/reviews/seller

Crear una reseña de vendedor.

**Body:**

```json
{
  "targetId": "uuid-del-vendedor",
  "userId": "uuid-del-comprador",
  "rating": 4,
  "comentario": "Buena atención, respondió rápido"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| targetId | string | sí | ID del vendedor a calificar |
| userId | string | sí | ID del comprador que califica |
| rating | number | sí | Calificación del 1 al 5 |
| comentario | string | sí | Texto de la reseña |

**Response 201:**

```json
{
  "id": "uuid-generado",
  "tipo": "seller",
  "targetId": "uuid-del-vendedor",
  "userId": "uuid-del-comprador",
  "rating": 4,
  "comentario": "Buena atención, respondió rápido",
  "estado": "published",
  "fecha": "2026-05-07T19:30:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos (rating fuera de rango, campos faltantes) |
| 500 | Error interno del servidor |

---

### POST /api/reviews/product

Crear una reseña de producto.

**Body:**

```json
{
  "targetId": "uuid-del-producto",
  "userId": "uuid-del-comprador",
  "rating": 5,
  "comentario": "Excelente producto, tal como se describe"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| targetId | string | sí | ID del producto a calificar |
| userId | string | sí | ID del comprador que califica |
| rating | number | sí | Calificación del 1 al 5 |
| comentario | string | sí | Texto de la reseña |

**Response 201:**

```json
{
  "id": "uuid-generado",
  "tipo": "product",
  "targetId": "uuid-del-producto",
  "userId": "uuid-del-comprador",
  "rating": 5,
  "comentario": "Excelente producto, tal como se describe",
  "estado": "published",
  "fecha": "2026-05-07T19:30:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos (rating fuera de rango, campos faltantes) |
| 500 | Error interno del servidor |

---

### GET /api/reviews/product/[id]

Obtener reseñas de un producto.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|:-------:|-------------|
| page | number | 1 | Número de página |
| limit | number | 10 | Cantidad de reseñas por página |
| search | string | — | Búsqueda por texto en el comentario |

**Response 200:**

```json
{
  "data": [
    {
      "id": "uuid",
      "tipo": "product",
      "targetId": "uuid-del-producto",
      "userId": "uuid-del-comprador",
      "rating": 5,
      "comentario": "Excelente producto",
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

**Errores:**

| Código | Descripción |
|--------|-------------|
| 500 | Error interno del servidor |

---

### GET /api/reviews/seller/[id]

Obtener reseñas de un vendedor.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|:-------:|-------------|
| page | number | 1 | Número de página |
| limit | number | 10 | Cantidad de reseñas por página |
| search | string | — | Búsqueda por texto en el comentario |

**Response 200:**

```json
{
  "data": [
    {
      "id": "uuid",
      "tipo": "seller",
      "targetId": "uuid-del-vendedor",
      "userId": "uuid-del-comprador",
      "rating": 4,
      "comentario": "Buena atención",
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

**Errores:**

| Código | Descripción |
|--------|-------------|
| 500 | Error interno del servidor |

---

### POST /api/reviews/[id]/report

Reportar una reseña específica.

**Body:**

```json
{
  "reporterId": "uuid-del-usuario-que-reporta",
  "razon": "Contenido inapropiado"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| reporterId | string | sí | ID del usuario que reporta |
| razon | string | sí | Motivo del reporte |

**Response 201:**

```json
{
  "id": "uuid-generado",
  "reviewId": "uuid-de-la-review",
  "reporterId": "uuid-del-usuario-que-reporta",
  "razon": "Contenido inapropiado",
  "resuelto": false,
  "fecha": "2026-05-07T19:30:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos (campos faltantes) |
| 404 | Review no encontrada |
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
