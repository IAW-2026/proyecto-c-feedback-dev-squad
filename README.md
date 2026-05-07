# Feedback App — ZapasYA

> Aplicación de reseñas y calificaciones para el marketplace ZapasYA.  
> Los compradores pueden calificar productos y vendedores, y los administradores moderan reportes sobre reseñas.

🔗 **Deploy:** *pendiente*

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
cp .env.example .env.local
# Completar .env.local con las credenciales de Clerk y la DB
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

| Método | Endpoint                | Descripción                                             | Consumido por              |
|:------:|-------------------------|---------------------------------------------------------|----------------------------|
| POST   | /reviews/seller         | Crear reseña y calificación de un vendedor.            | Buyer App                  |
| POST   | /reviews/product        | Crear reseña y calificación de un producto.            | Buyer App                  |
| GET    | /reviews/product/{id}   | Obtener reseñas de un producto.                        | Buyer App                  |
| GET    | /reviews/seller/{id}    | Obtener reseñas de un vendedor.                        | Seller App                 |
| POST   | /reviews/{id}/report    | Crear un reporte sobre una reseña específica.          | Buyer App / Seller App     |
| GET    | /stats/product/{id}     | Obtener promedio de estrellas de un producto.          | Seller App / Buyer App     |
| GET    | /stats/seller/{id}      | Obtener promedio de estrellas y total de ventas calificadas. | Seller App / Buyer App |

---

### Nota importante

- Todos los endpoints usan formato JSON.  
- La comunicación entre apps es vía HTTP REST.  
- Los IDs son únicos (UUID).  
