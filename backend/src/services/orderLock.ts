import type { Prisma } from '@prisma/client';

interface OptimisticUpdateOrderParams {
  orderId: string;
  expectedVersion: number;
  data: Prisma.OrderUpdateInput;
}

/**
 * Helper de optimistic lock compartido (Research §6): actualiza la orden solo si
 * `version` coincide con `expectedVersion`. 0 filas afectadas -> conflicto (el caller
 * decide si responde 409 o 422 según el estado actual). Usado por assignTechnician,
 * approve y reject para que "ante transiciones concurrentes solo la primera tenga efecto".
 */
async function optimisticUpdateOrder(
  tx: Prisma.TransactionClient,
  { orderId, expectedVersion, data }: OptimisticUpdateOrderParams,
): Promise<boolean> {
  const result = await tx.order.updateMany({
    where: { id: orderId, version: expectedVersion },
    data: { ...data, version: { increment: 1 } },
  });
  return result.count === 1;
}

module.exports = { optimisticUpdateOrder };
