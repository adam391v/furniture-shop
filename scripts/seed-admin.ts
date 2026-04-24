// ============================================================
// Seed Admin User - Tạo tài khoản admin mặc định
// Chạy: npx tsx scripts/seed-admin.ts
// ============================================================

import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';

const dbUrl = process.env.DATABASE_URL || 'mysql://furniture_shop_user:123456@localhost:3306/furniture_shop';
const url = new URL(dbUrl.replace('mysql://', 'http://'));
const adapter = new PrismaMariaDb({
  host: url.hostname, port: parseInt(url.port) || 3306,
  user: decodeURIComponent(url.username), password: decodeURIComponent(url.password),
  database: url.pathname.slice(1), connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Bắt đầu seed admin user...');

  const adminEmail = 'admin@furniture.com';
  const adminPassword = '123456';

  // Kiểm tra đã tồn tại chưa
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('✅ Admin user đã tồn tại:', adminEmail);
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Tạo admin user
  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'System',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      gender: 'other',
    },
  });

  console.log('✅ Đã tạo admin user:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   ID: ${admin.id}`);
  console.log('');
  console.log('⚠️  Hãy đổi mật khẩu sau khi đăng nhập lần đầu!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
