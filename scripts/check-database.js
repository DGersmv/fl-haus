const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function checkDatabase(dbPath) {
  // Если путь относительный или без file:, добавляем file:
  if (!dbPath.startsWith('file:') && !path.isAbsolute(dbPath)) {
    dbPath = `file:${dbPath}`;
  } else if (!dbPath.startsWith('file:')) {
    dbPath = `file:${dbPath}`;
  }
  
  // Извлекаем реальный путь для проверки существования
  const realPath = dbPath.replace(/^file:/, '');
  
  console.log(`\n=== Проверка базы данных: ${realPath} ===\n`);
  
  if (!fs.existsSync(realPath)) {
    console.log(`❌ Файл не найден: ${realPath}`);
    return;
  }

  const stats = fs.statSync(realPath);
  console.log(`Размер файла: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`Дата изменения: ${stats.mtime}\n`);

  // Временно меняем DATABASE_URL
  const originalUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = dbPath;

  const prisma = new PrismaClient();

  try {
    // Проверяем таблицы
    console.log('Проверка таблиц...');
    
    // User
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Пользователей: ${userCount}`);
      
      if (userCount > 0) {
        const users = await prisma.user.findMany({
          take: 5,
          select: { id: true, email: true, role: true, status: true }
        });
        console.log('Примеры пользователей:');
        users.forEach(u => {
          console.log(`  - ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Status: ${u.status}`);
        });
      }
    } catch (e) {
      console.log(`❌ Ошибка при проверке User: ${e.message}`);
    }

    // Object
    try {
      const objectCount = await prisma.object.count();
      console.log(`✅ Объектов: ${objectCount}`);
    } catch (e) {
      console.log(`❌ Ошибка при проверке Object: ${e.message}`);
    }

    // Photo
    try {
      const photoCount = await prisma.photo.count();
      console.log(`✅ Фото: ${photoCount}`);
    } catch (e) {
      console.log(`❌ Ошибка при проверке Photo: ${e.message}`);
    }

    // Panorama
    try {
      const panoramaCount = await prisma.panorama.count();
      console.log(`✅ Панорам: ${panoramaCount}`);
    } catch (e) {
      console.log(`❌ Ошибка при проверке Panorama: ${e.message}`);
    }

    // Document
    try {
      const documentCount = await prisma.document.count();
      console.log(`✅ Документов: ${documentCount}`);
    } catch (e) {
      console.log(`❌ Ошибка при проверке Document: ${e.message}`);
    }

  } catch (error) {
    console.error('❌ Ошибка при подключении к базе:', error.message);
  } finally {
    await prisma.$disconnect();
    process.env.DATABASE_URL = originalUrl;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // По умолчанию используем текущую БД из .env
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || '/var/lib/tashi-ani/db/tashi-ani.db';
    console.log(`Использование БД по умолчанию: ${dbPath}\n`);
    await checkDatabase(dbPath);
  } else {
    const dbPath = args[0];
    await checkDatabase(dbPath);
  }
}

main().catch(console.error);

