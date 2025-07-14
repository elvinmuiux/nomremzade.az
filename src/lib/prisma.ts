import { PrismaClient } from '@prisma/client';

// Next.js ilə hot-reloading zamanı yeni PrismaClient instansiyalarının
// yaranmasının qarşısını almaq üçün qlobal obyekt istifadə olunur.

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
