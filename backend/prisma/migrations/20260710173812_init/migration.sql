-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('cliente', 'tecnico', 'dispatcher', 'supervisor');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('sin_asignar', 'pendiente_de_revision', 'aprobada', 'rechazada');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('crear', 'asignar', 'reasignar', 'desactivar_tecnico_reasigna', 'enviar_ejecucion', 'aprobar', 'rechazar', 'conflicto_concurrente');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevokedRefreshToken" (
    "jti" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevokedRefreshToken_pkey" PRIMARY KEY ("jti")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'sin_asignar',
    "clientId" TEXT NOT NULL,
    "technicianId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    "rejectionReason" TEXT,
    "resolvedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutionRecord" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExecutionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidencePhoto" (
    "id" TEXT NOT NULL,
    "executionRecordId" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "storageKey" TEXT,
    "sizeBytes" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retentionExpiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvidencePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLogEntry" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,
    "retentionExpiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RevokedRefreshToken_expiresAt_idx" ON "RevokedRefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "Order_clientId_idx" ON "Order"("clientId");

-- CreateIndex
CREATE INDEX "Order_technicianId_idx" ON "Order"("technicianId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionRecord_orderId_key" ON "ExecutionRecord"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionRecord_idempotencyKey_key" ON "ExecutionRecord"("idempotencyKey");

-- CreateIndex
CREATE INDEX "EvidencePhoto_executionRecordId_idx" ON "EvidencePhoto"("executionRecordId");

-- CreateIndex
CREATE INDEX "EvidencePhoto_retentionExpiresAt_idx" ON "EvidencePhoto"("retentionExpiresAt");

-- CreateIndex
CREATE INDEX "AuditLogEntry_orderId_idx" ON "AuditLogEntry"("orderId");

-- CreateIndex
CREATE INDEX "AuditLogEntry_retentionExpiresAt_idx" ON "AuditLogEntry"("retentionExpiresAt");

-- AddForeignKey
ALTER TABLE "RevokedRefreshToken" ADD CONSTRAINT "RevokedRefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutionRecord" ADD CONSTRAINT "ExecutionRecord_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutionRecord" ADD CONSTRAINT "ExecutionRecord_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidencePhoto" ADD CONSTRAINT "EvidencePhoto_executionRecordId_fkey" FOREIGN KEY ("executionRecordId") REFERENCES "ExecutionRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogEntry" ADD CONSTRAINT "AuditLogEntry_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogEntry" ADD CONSTRAINT "AuditLogEntry_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
