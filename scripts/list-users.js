/**
 * Локальный просмотр пользователей из БД без Prisma Studio.
 * Запуск из корня проекта: node scripts/list-users.js
 */
const path = require('path');
const fs = require('fs');

// Загружаем .env.local если есть
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const i = line.indexOf('=');
    if (i > 0) {
      const key = line.slice(0, i).trim();
      let val = line.slice(i + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}
if (!process.env.DATABASE_URL) {
  const env = path.join(__dirname, '..', '.env');
  if (fs.existsSync(env)) {
    const content = fs.readFileSync(env, 'utf8');
    content.split('\n').forEach((line) => {
      const i = line.indexOf('=');
      if (i > 0) {
        const key = line.slice(0, i).trim();
        let val = line.slice(i + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
  });
  console.log('Пользователи в БД:\n');
  if (users.length === 0) {
    console.log('  (пусто)');
    return;
  }
  users.forEach((u) => {
    console.log(`  id: ${u.id}  email: ${u.email}  name: ${u.name || '-'}  role: ${u.role}  status: ${u.status}  created: ${u.createdAt.toISOString().slice(0, 10)}`);
  });
  console.log('\nВсего:', users.length);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
