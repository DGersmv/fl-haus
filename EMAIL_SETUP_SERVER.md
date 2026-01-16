# Настройка Email на сервере

## 1. Создайте файл .env.local на сервере:

```bash
# Подключитесь к серверу
ssh root@89.104.67.209

# Перейдите в директорию проекта
cd /var/www/tashi-ani

# Создайте файл .env.local
nano .env.local
```

## 2. Добавьте в .env.local:

```env
# Email настройки для отправки кодов
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT секрет
JWT_SECRET=your-jwt-secret-key-here

# Мастер админ
MASTER_ADMIN_EMAIL=admin@tashi-ani.ru
MASTER_ADMIN_PASSWORD=your-master-password

# База данных
DATABASE_URL="file:./prisma/dev.db"
```

## 3. Настройте Gmail:

1. **Включите 2FA** в вашем Gmail аккаунте
2. **Создайте App Password**:
   - Зайдите в Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Создайте пароль для "Mail"
   - Используйте этот пароль как EMAIL_PASS

## 4. Перезапустите приложение:

```bash
pm2 restart tashi-ani
```

## 5. Проверьте логи:

```bash
pm2 logs tashi-ani
```

## Важно:
- Замените `your-email@gmail.com` на ваш реальный Gmail
- Замените `your-app-password` на App Password из Gmail
- Замените `your-jwt-secret-key-here` на случайную строку
- Замените `your-master-password` на пароль для мастер-админа
