# API — Feedback App

Autenticación vía `Authorization: Bearer <api_key>` o `?api_key=`.

## Endpoints

| Método | Endpoint | Descripción | Consumido por |
|:------:|----------|-------------|---------------|
| POST | `/api/reviews/seller` | Crear reseña de vendedor | Buyer App |
| POST | `/api/reviews/product` | Crear reseña de producto | Buyer App |
| GET | `/api/reviews/product/[id]` | Obtener reseñas de producto | Buyer App |
| GET | `/api/reviews/seller/[id]` | Obtener reseñas de vendedor | Seller App |
| POST | `/api/reviews/[id]/report` | Reportar una reseña | Buyer App, Seller App |
| GET | `/api/stats/product/[id]` | Estadísticas de producto | Buyer App, Seller App |
| GET | `/api/stats/seller/[id]` | Estadísticas de vendedor | Buyer App, Seller App |
