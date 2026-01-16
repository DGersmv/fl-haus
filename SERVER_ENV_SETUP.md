# Настройка .env.local на сервере

## Выполните на сервере:

```bash
# 1. Подключитесь к серверу
ssh root@89.104.67.209

# 2. Перейдите в директорию проекта
cd /var/www/tashi-ani

# 3. Создайте файл .env.local
nano .env.local
```

## 4. Скопируйте и вставьте в файл:

### Вариант 1: Собственная почта домена (РЕКОМЕНДУЕТСЯ)
```env
DATABASE_URL="file:./dev.db"
MASTER_ADMIN_EMAIL="2277277@bk.ru"
MASTER_ADMIN_PASSWORD="admin123"
JWT_SECRET="your-secret-key-here"
EMAIL_USER="admin@tashi-ani.ru"
EMAIL_PASS="admin123"
```

### Вариант 2: Yandex почта (если собственная не работает)
```env
DATABASE_URL="file:./dev.db"
MASTER_ADMIN_EMAIL="2277277@bk.ru"
MASTER_ADMIN_PASSWORD="admin123"
JWT_SECRET="your-secret-key-here"
EMAIL_USER="admin@tashi-ani.ru"
EMAIL_PASS="admin123"
```

### Вариант 3: Gmail (если ничего не работает)
```env
DATABASE_URL="file:./dev.db"
MASTER_ADMIN_EMAIL="2277277@bk.ru"
MASTER_ADMIN_PASSWORD="admin123"
JWT_SECRET="your-secret-key-here"
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-app-password"
```

## 5. Сохраните файл:
- Нажмите `Ctrl + X`
- Нажмите `Y` для подтверждения
- Нажмите `Enter`

## 6. Перезапустите приложение:
```bash
pm2 restart tashi-ani
```

## 7. Проверьте логи:
```bash
pm2 logs tashi-ani
```

## 8. Проверьте работу:
- Откройте сайт https://tashi-ani.ru
- Попробуйте отправить код на email
- Проверьте, приходит ли письмо
