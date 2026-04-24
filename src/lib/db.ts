// ============================================================
// Prisma Client Singleton - Prisma 7 + MySQL (MariaDB Adapter)
// ============================================================

import { PrismaClient } from '@/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Parse DATABASE_URL để lấy connection config
const dbUrl = process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/furniture_shop';
const url = new URL(dbUrl.replace('mysql://', 'http://'));

// Tạo adapter kết nối MySQL
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1), // Bỏ dấu / ở đầu
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
