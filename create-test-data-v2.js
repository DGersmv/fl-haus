const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('Создание тестовых данных с новой структурой...');

    // Создаем мастер-админа
    const masterAdmin = await prisma.user.upsert({
      where: { email: '2277277@bk.ru' },
      update: {},
      create: {
        email: '2277277@bk.ru',
        name: 'Мастер Админ',
        role: 'MASTER',
        status: 'ACTIVE',
        password: 'admin123'
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

      // Создаем объекты для пользователя
      const objects = [
        {
          title: `Участок ${user.name} - 1`,
          description: 'Загородный участок 10 соток',
          address: 'Московская область, д. Петрово',
          status: 'ACTIVE',
          userId: user.id
        },
        {
          title: `Дом ${user.name} - 1`,
          description: 'Коттедж 150 кв.м',
          address: 'Московская область, д. Сидорово',
          status: 'ACTIVE',
          userId: user.id
        }
      ];

      for (const objectData of objects) {
        const object = await prisma.object.create({
          data: objectData
        });
        console.log(`✅ Объект создан: ${object.title}`);

        // Создаем проекты для объекта
        const projects = [
          {
            title: `Дизайн-проект ${object.title}`,
            description: 'Ландшафтный дизайн участка',
            status: 'IN_PROGRESS',
            objectId: object.id
          },
          {
            title: `Проект озеленения ${object.title}`,
            description: 'Посадка растений и уход',
            status: 'PLANNING',
            objectId: object.id
          }
        ];

        for (const projectData of projects) {
          const project = await prisma.project.create({
            data: projectData
          });
          console.log(`✅ Проект создан: ${project.title}`);

          // Создаем этапы проекта
          const stages = [
            {
              title: 'Планирование',
              description: 'Создание концепции',
              status: 'COMPLETED',
              orderIndex: 1,
              projectId: project.id
            },
            {
              title: 'Рабочие чертежи',
              description: 'Детальные планы',
              status: 'IN_PROGRESS',
              orderIndex: 2,
              projectId: project.id
            },
            {
              title: 'Реализация',
              description: 'Выполнение работ',
              status: 'PENDING',
              orderIndex: 3,
              projectId: project.id
            }
          ];

          for (const stageData of stages) {
            await prisma.projectStage.create({
              data: stageData
            });
          }
          console.log(`✅ Этапы созданы для проекта: ${project.title}`);

          // Создаем сообщения для проекта
          const messages = [
            {
              content: `Привет! Как дела с проектом "${project.title}"?`,
              projectId: project.id,
              userId: user.id,
              isAdminMessage: false
            },
            {
              content: `Проект "${project.title}" в работе. Ожидайте обновления.`,
              projectId: project.id,
              userId: masterAdmin.id,
              isAdminMessage: true
            }
          ];

          for (const messageData of messages) {
            await prisma.message.create({
              data: messageData
            });
          }
          console.log(`✅ Сообщения созданы для проекта: ${project.title}`);
        }

        // Создаем сообщения для объекта
        const objectMessages = [
          {
            content: `Обсуждение по объекту "${object.title}"`,
            objectId: object.id,
            userId: user.id,
            isAdminMessage: false
          }
        ];

        for (const messageData of objectMessages) {
          await prisma.message.create({
            data: messageData
          });
        }
        console.log(`✅ Сообщения созданы для объекта: ${object.title}`);
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

















