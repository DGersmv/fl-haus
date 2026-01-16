const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('Создание тестовых данных...');

    // Создаем мастер-админа
    const masterAdmin = await prisma.user.upsert({
      where: { email: '2277277@bk.ru' },
      update: {},
      create: {
        email: '2277277@bk.ru',
        name: 'Мастер Админ',
        role: 'MASTER',
        status: 'ACTIVE',
        password: 'admin123' // В реальном проекте должен быть хеширован
      }
    });

    console.log('✅ Мастер-админ создан:', masterAdmin.email);

    // Создаем тестовых пользователей
    const testUsers = [
      {
        email: 'test1@example.com',
        name: 'Иван Петров',
        role: 'USER',
        status: 'ACTIVE'
      },
      {
        email: 'test2@example.com', 
        name: 'Мария Сидорова',
        role: 'USER',
        status: 'ACTIVE'
      }
    ];

    for (const userData of testUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });
      console.log('✅ Пользователь создан:', user.email);

      // Создаем проекты для пользователя
      const projects = [
        {
          title: `Проект 1 - ${user.name}`,
          description: 'Описание проекта 1',
          status: 'IN_PROGRESS',
          userId: user.id
        },
        {
          title: `Проект 2 - ${user.name}`,
          description: 'Описание проекта 2', 
          status: 'COMPLETED',
          userId: user.id
        }
      ];

      for (const projectData of projects) {
        const project = await prisma.project.create({
          data: projectData
        });
        console.log(`✅ Проект создан: ${project.title}`);

        // Создаем сообщения для проекта
        const messages = [
          {
            content: `Привет! Это сообщение для проекта "${project.title}"`,
            projectId: project.id,
            userId: user.id
          },
          {
            content: `Как дела с проектом "${project.title}"?`,
            projectId: project.id,
            userId: user.id
          }
        ];

        for (const messageData of messages) {
          await prisma.message.create({
            data: messageData
          });
        }
        console.log(`✅ Сообщения созданы для проекта: ${project.title}`);
      }
    }

    console.log('🎉 Все тестовые данные созданы успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка создания тестовых данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();