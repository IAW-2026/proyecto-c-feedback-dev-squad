# API — Feedback App

Autenticación vía `Authorization: Bearer <api_key>` o `?api_key=`.

## Endpoints

| Método | Endpoint | Descripción | Consumido por |
|:------:|----------|-------------|---------------|
| POST | `/api/users` | Sincronizar usuario desde Buyer App | Buyer App |
| PUT | `/api/reviews/[id]` | Editar reseña | Control Plane |
| POST | `/api/reviews/product` | Crear reseña de producto | Buyer App |
| POST | `/api/reviews/seller` | Crear reseña de vendedor | Buyer App |
| GET | `/api/reviews/product/[id]` | Obtener reseñas de producto | Buyer App |
| GET | `/api/reviews/seller/[id]` | Obtener reseñas de vendedor | Seller App |
| GET | `/api/reviews` | Listar todas las reseñas | Control Plane, Analytics |
| GET | `/api/reports` | Listar reportes | Control Plane |
| POST | `/api/reports` | Crear reporte | Control Plane, Buyer App, Seller App |
| GET | `/api/reports/[id]` | Obtener reporte por ID | Control Plane |
| GET | `/api/reports/[id]/ai-opinion` | Obtener opinión generada por IA sobre un reporte | Control Plane |
| POST | `/api/reports/[id]/resolve` | Resolver reporte | Control Plane |
| GET | `/api/stats/product/[id]` | Estadísticas de producto | Buyer App, Seller App |
| GET | `/api/stats/seller/[id]` | Estadísticas de vendedor | Buyer App, Seller App |
| GET | `/api/stats` | Estadísticas globales | Control Plane, Analytics |

## Parámetros de consulta

| Endpoint | Parámetros |
|----------|------------|
| `GET /api/reviews` | `page` (default: 1), `limit` (default: 10), `search`, `tipo` (product\|seller) |
| `GET /api/reports` | `page` (default: 1), `limit` (default: 10), `search`, `resolved` (true\|false) |
| `GET /api/reviews/product/[id]` | `page`, `limit`, `search`, `includeSummary` (true\|false), `name` |
| `GET /api/reviews/seller/[id]` | `page`, `limit`, `search`, `includeSummary` (true\|false), `name` |
