import path from 'path';

// Обязательно ДО импорта PrismaClient: Prisma читает DATABASE_URL при загрузке клиента.
// В dev (Turbopack) .env иногда не подхватывается — подставляем/нормализуем только в dev.
// В production никогда не трогаем DATABASE_URL из .env — иначе сломаем работающий сервер.
if (typeof process !== 'undefined') {
  if (!process.env.DATABASE_URL) {
    const dbPath = path.join(process.cwd(), 'prisma', 'prisma', 'production.db');
    process.env.DATABASE_URL = 'file:' + dbPath.replace(/\\/g, '/');
  } else if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL.startsWith('file:')) {
    const raw = process.env.DATABASE_URL.slice(5).replace(/\//g, path.sep).replace(/^\.\\?/, '');
    if (!path.isAbsolute(raw)) {
      const schemaDir = path.join(process.cwd(), 'prisma');
      const absolute = path.resolve(schemaDir, raw);
      process.env.DATABASE_URL = 'file:' + absolute.replace(/\\/g, '/');
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

type GlobalPrisma = {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

const globalForPrisma = globalThis as unknown as GlobalPrisma;

function createPrismaClient() {
  const client = new PrismaClient();

  if (process.env.NODE_ENV === 'production') {
    client.$connect().catch((error) => {
      console.error('Не удалось подключиться к базе Prisma:', error);
    });
  }

  return client;
}

const prismaClient =
  process.env.NODE_ENV === 'production'
    ? globalForPrisma.prisma ?? createPrismaClient()
    : globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());

if (process.env.NODE_ENV === 'production' && !globalForPrisma.prisma) {
  globalForPrisma.prisma = prismaClient;
}

export const prisma = prismaClient;


