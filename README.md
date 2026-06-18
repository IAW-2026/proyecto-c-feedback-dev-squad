# Feedback App — ZapasYA

🔗 **Deploy:** *https://proyecto-c-feedback-dev-squad.vercel.app/*

---

## Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | `admin+clerk_test@iaw.com` | `iawuser#` |
| Usuario | `user+clerk_test@iaw.com` | `iawuser#` |

---

## Instrucciones para evaluar

### Sitio deployado
1. Ingresá a la URL del deploy e iniciá sesión con cualquiera de las cuentas de prueba.
2. **Como usuario**: explorá productos y vendedores en `/explorar`, creá reseñas desde `/dashboard/crear-resena`, revisá tu historial en `/dashboard/mis-resenas`, y reportá reseñas inapropiadas.
3. **Como administrador**: ingresá a `/admin/reportes` para moderar reportes (desestimar o eliminar la reseña reportada).

### Entorno local
```bash
pnpm install
pnpm prisma db seed
pnpm dev
```
Abrir [http://localhost:3000](http://localhost:3000). Requiere variables de entorno (ver `.env.example` y [`docs/SETUP.md`](docs/SETUP.md)).

---

## Descripción del proyecto

Feedback App es un sistema de reseñas y calificaciones integrado al marketplace ZapasYA, un ecommerce de zapatillas. Permite a los usuarios crear reseñas (1–5 estrellas con comentario) para productos y vendedores, explorar reseñas existentes con búsqueda y paginación, y visualizar estadísticas agregadas como promedio y distribución de calificaciones. También incluye un panel de administración para moderar reportes de contenido inapropiado.

La aplicación ofrece una API con autenticación por API key que permite a sistemas externos (Buyer App y Seller App) crear reseñas, consultar estadísticas y reportar contenido, funcionando como un microservicio de reseñas dentro del ecosistema de ZapasYA.

El proyecto está construido con Next.js 16 (App Router), TypeScript, Clerk para autenticación, PostgreSQL con Prisma ORM, y Tailwind CSS para estilos. Incorpora Google Gemini (gemini-2.5-flash) para moderación automática de contenido, generación de resúmenes de reseñas por producto/vendedor, y opinión asistida por IA en el panel de reportes.

Las reseñas usan soft delete (cambio de estado a `removed`), la moderación por IA se aplica al crear o editar una reseña con fallback graceful si Gemini no está disponible, y las compras están mockeadas — cualquier usuario autenticado puede reseñar cualquier producto o vendedor (Se modifica en Etapa 3, se usará una api de buyerapp para identificar productos asociados a compradores).

---

## Notas para la corrección

### Decisiones de diseño
- **Arquitectura híbrida**: server components para contenido SEO (landing con stats), client components para interactividad (búsqueda, filtros, paginación, modales).
- **Server Actions** para todas las mutaciones, con verificación de autenticación y roles antes de cada operación.
- **API key externa** para endpoints consumidos por Buyer App y Seller App, usando middleware de validación.
- **Modo oscuro** con `next-themes` y persistencia de preferencia.
- **Seguridad**: prevención de auto-reporte de reseñas propias.

### Limitaciones conocidas
- **Moderación por IA best-effort**: si Gemini falla, la reseña se crea igual con una advertencia (`moderationSkipped`).
- **Sin carga de imágenes** en las reseñas.

### Funcionalidades destacadas
- La **moderación automática por IA** analiza el comentario de cada reseña nueva o editada y rechaza contenido inapropiado antes de persistirlo.
- El **resumen por IA** genera un texto descriptivo con las opiniones principales de los reseñadores para cada producto y vendedor.
- La **opinión por IA en reportes** brinda una recomendación al administrador (a favor o en contra de eliminar la reseña reportada), agilizando la moderación.
- Los **estados de reseña** (`published`, `reported`, `removed`) permiten un flujo de moderación completo sin pérdida de datos.

---

> Documentación adicional: [`docs/SETUP.md`](docs/SETUP.md) (instalación, variables de entorno, rutas, stack) · [`docs/API.md`](docs/API.md) (endpoints de la API)
