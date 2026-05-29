-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "email" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'user',
    "fotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "vendedorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendedor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reseña" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'published',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reseña_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id" TEXT NOT NULL,
    "reseñaId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "razon" TEXT NOT NULL,
    "resuelto" BOOLEAN NOT NULL DEFAULT false,
    "resolvedBy" TEXT,
    "comentarioAdmin" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reseña" ADD CONSTRAINT "Reseña_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_reseñaId_fkey" FOREIGN KEY ("reseñaId") REFERENCES "Reseña"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
