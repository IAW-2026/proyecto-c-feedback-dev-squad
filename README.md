# Feedback App — ZapasYA

> Aplicación de reseñas y calificaciones para el marketplace ZapasYA.

🔗 **Deploy:** *https://proyecto-c-feedback-dev-squad.vercel.app/*

---

## Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | `zapasya.clerk@gmail.com` | `ZapasYa11@` |
| Usuario | `userzapasya@proton.me` | `userZapasYa` |

> Admin: `/admin/reportes` · Usuario: crear reseñas, explorar y reportar.

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

- Crear reseñas de productos y vendedores (1–5 estrellas)
- Validación de compras antes de reseñar
- Historial de reseñas propias con búsqueda y filtros
- Panel admin para moderar reportes (desestimar/eliminar)
- Opinión y resumen de reseñas generados por IA (Gemini)
- Moderación automática de contenido inapropiado por IA
- Exploración de productos/vendedores con búsqueda y paginación
- Modo oscuro

---

## Instalación

```bash
pnpm install
pnpm prisma db seed
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

Ver `.env.example` para la lista completa.

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de PostgreSQL |
| `CLERK_SECRET_KEY` | Secret key de Clerk |
| `GEMINI_API_KEY` | API key de Google Gemini |
| `API_KEY_BUYER_APP` | API key para Buyer App |
| `API_KEY_SELLER_APP` | API key para Seller App |

---

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing page |
| `/sign-in` · `/sign-up` | Público | Login / Registro |
| `/explorar` | Autenticado | Explorar reseñas |
| `/dashboard/crear-resena` | Autenticado | Crear reseña |
| `/dashboard/mis-resenas` | Autenticado | Historial de reseñas |
| `/admin/reportes` | Admin | Moderación de reportes |
| `/explorar/producto/[id]` · `/explorar/vendedor/[id]` | Autenticado | Reseñas por target |

---

## API endpoints

Los endpoints son consumidos por Buyer App y Seller App. Autenticación via `Authorization: Bearer <api_key>` o `?api_key=`.

| Método | Endpoint | Descripción |
|:------:|----------|-------------|
| POST | `/api/reviews/seller` | Crear reseña de vendedor |
| POST | `/api/reviews/product` | Crear reseña de producto |
| GET | `/api/reviews/product/[id]` | Obtener reseñas de producto |
| GET | `/api/reviews/seller/[id]` | Obtener reseñas de vendedor |
| POST | `/api/reviews/[id]/report` | Reportar una reseña |
| GET | `/api/stats/product/[id]` | Estadísticas de producto |
| GET | `/api/stats/seller/[id]` | Estadísticas de vendedor |

---

## Seed

```bash
pnpm prisma db seed
```

Carga 19 usuarios, 4 vendedores, 10 productos, 20 reseñas y 10 reportes.
