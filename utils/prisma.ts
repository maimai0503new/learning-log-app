import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Next.js開発環境で接続が増えすぎないようにするためのグローバル変数
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma 7の新しい接続方式：Pool（通信の通り道）とAdapter（翻訳機）を用意します
// utils/prisma.ts の抜粋
const createPrismaClient = () => {
  const pool = new Pool({ 
    // 💡 執事さん（アプリ）には、案内係（6543）を使わせる！
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;