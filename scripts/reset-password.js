/**
 * Сброс пароля пользователя по email.
 * Пароли в БД хранятся в виде хеша — старый пароль посмотреть нельзя, только задать новый.
 *
 * Запуск из корня проекта:
 *   node scripts/reset-password.js <email> <новый_пароль>
 *
 * Пример:
 *   node scripts/reset-password.js admin@fl-haus.ru MyNewPass123
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
const url = process.env.DATABASE_URL || '';
let dbFile = null;
if (url.startsWith('file:')) {
  const raw = url.slice(5).replace(/\//g, path.sep).replace(/^\.\\?/, '');
  const schemaDir = path.join(projectRoot, 'prisma');
  dbFile = path.isAbsolute(raw) ? raw : path.resolve(schemaDir, raw);
  process.env.DATABASE_URL = 'file:' + dbFile.replace(/\\/g, '/');
}
if (dbFile && !fs.existsSync(dbFile)) {
  console.error('Файл базы не найден:', dbFile);
  console.error('Создайте БД: npx prisma migrate deploy');
  process.exit(1);
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('Использование: node scripts/reset-password.js <email> <новый_пароль>');
    console.log('Пример: node scripts/reset-password.js admin@fl-haus.ru MyNewPass123');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('Пользователь с таким email не найден:', email);
    process.exit(1);
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  console.log('Пароль обновлён для:', email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
