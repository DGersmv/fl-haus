const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    const email = '2277277@bk.ru';
    const newPassword = 'admin123';
    
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ Пользователь не найден');
      console.log('Создаю нового админа...');
      
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'MASTER',
          status: 'ACTIVE'
        }
      });
      
      console.log('✅ Админ создан!');
      console.log(`Email: ${email}`);
      console.log(`Пароль: ${newPassword}`);
      return;
    }
    
    // Обновляем пароль
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword
      }
    });
    
    console.log('✅ Пароль успешно сброшен!');
    console.log(`Email: ${email}`);
    console.log(`Новый пароль: ${newPassword}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();




