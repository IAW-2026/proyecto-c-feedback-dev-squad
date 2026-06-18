# Setup — Feedback App

## Instalación

```bash
pnpm install
pnpm prisma db seed
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Copiar `.env.example` como `.env.local` y completar los valores.

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de PostgreSQL |
| `CLERK_SECRET_KEY` | Secret key de Clerk |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key de Clerk |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `GEMINI_API_KEY` | API key de Google Gemini |
| `API_KEY_BUYER_APP` | API key para Buyer App |
| `API_KEY_SELLER_APP` | API key para Seller App |
| `API_KEY_CONTROL_PLANE` | API key para Control Plane |
| `API_KEY_ANALYTICS` | API key para Analytics |
| `BUYER_APP_URL` | URL de Buyer App |
| `CRON_SECRET` | Sincronizar DB cada dia mediante Vercel |

## Seed

```bash
pnpm prisma db seed
```

Carga 20 usuarios, 60 reseñas y 16 reportes y sincroniza con Seller App.

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing page |
| `/sign-in` · `/sign-up` | Público | Login / Registro |
| `/explorar` | Autenticado | Explorar reseñas |
| `/explorar/producto/[id]` | Autenticado | Reseñas de producto |
| `/explorar/vendedor/[id]` | Autenticado | Reseñas de vendedor |
| `/dashboard/crear-resena` | Autenticado | Crear reseña |
| `/dashboard/mis-resenas` | Autenticado | Historial de reseñas |
| `/admin/reportes` | Admin | Moderación de reportes |

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Autenticación | Clerk |
| Estilos | Tailwind CSS |
| Base de datos | PostgreSQL + Prisma |
| Lenguaje | TypeScript |
| IA | Google Gemini (gemini-2.5-flash) |
