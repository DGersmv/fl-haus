/**
 * Создание первого мастер-админа в БД (пользователь с ролью MASTER).
 * Запуск из корня проекта:
 *   node scripts/create-admin.js <email> <пароль> [имя]
 *
 * Пример:
 *   node scripts/create-admin.js admin@fl-haus.ru MySecurePass123 "Админ"
 *
 * После создания добавь в .env.local:
 *   MASTER_ADMIN_EMAIL="admin@fl-haus.ru"
 */
const path = require('path');
const fs = require('fs');

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
const projectRoot = path.join(__dirname, '..');
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/production.db';
}
let url = process.env.DATABASE_URL || '';
let dbFile = null;
if (url.startsWith('file:')) {
  const raw = url.slice(5).replace(/\//g, path.sep).replace(/^\.\\?/, '');
  const schemaDir = path.join(projectRoot, 'prisma');
  dbFile = path.isAbsolute(raw) ? raw : path.resolve(schemaDir, raw);
  process.env.DATABASE_URL = 'file:' + dbFile.replace(/\\/g, '/');
}
if (dbFile && !fs.existsSync(dbFile)) {
  console.error('Файл базы не найден:', dbFile);
  console.error('Сначала: npx prisma migrate deploy');
  process.exit(1);
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || null;

  if (!email || !password) {
    console.log('Использование: node scripts/create-admin.js <email> <пароль> [имя]');
    console.log('Пример: node scripts/create-admin.js admin@fl-haus.ru MyPass123 "Админ"');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role === 'MASTER') {
      console.log('Пользователь уже есть и уже мастер:', email);
      console.log('Сменить пароль: node scripts/reset-password.js', email, '<новый_пароль>');
    } else {
      console.log('Пользователь с таким email уже есть (роль USER). Повысить до MASTER? Обновите вручную в БД или создайте другого админа.');
    }
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      name: name || null,
      password: hashed,
      role: 'MASTER',
      status: 'ACTIVE',
    },
  });

  console.log('Мастер-админ создан:', email);
  console.log('Добавь в .env.local: MASTER_ADMIN_EMAIL="' + email + '"');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
