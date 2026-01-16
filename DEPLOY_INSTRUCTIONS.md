   e7a4653..b174c28  master -> master
PS E:\tashi-ani> git add .
PS E:\tashi-ani> git commit -m "Chaged prisma"
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
PS E:\tashi-ani> # Инструкции по деплою на reg.ru

## 1. Подготовка проекта

### Сборка для продакшна
```bash
npm run build
```

### Создание архива
```bash
# Создаем архив без node_modules и .next
tar -czf tashi-ani-production.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=*.log \
  --exclude=.env.local \
  --exclude=prisma/dev.db \
  .
```

## 2. Настройка сервера на reg.ru

### Установка Node.js
```bash
# Проверяем версию Node.js
node --version
npm --version

# Если нужно обновить Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Установка PostgreSQL
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Создание базы данных
```bash
sudo -u postgres psql
CREATE DATABASE tashi_ani_prod;
CREATE USER tashi_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE tashi_ani_prod TO tashi_user;
\q
```

## 3. Загрузка проекта

### Загрузка файлов
1. Загрузите архив `tashi-ani-production.tar.gz` на сервер
2. Распакуйте в директорию `/var/www/html/` или `/home/user/`
```bash
cd /var/www/html/
tar -xzf tashi-ani-production.tar.gz
cd tashi-ani
```

### Установка зависимостей
```bash
npm install
```

## 4. Настройка переменных окружения

Создайте файл `.env.local`:
```bash
nano .env.local
```

Содержимое:
```
DATABASE_URL="postgresql://tashi_user:your_secure_password@localhost:5432/tashi_ani_prod"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://yourdomain.ru"

# Email configuration
EMAIL_HOST="smtp.reg.ru"
EMAIL_PORT=587
EMAIL_USER="your-email@yourdomain.ru"
EMAIL_PASS="your-email-password"

# Admin credentials
MASTER_ADMIN_EMAIL="admin@yourdomain.ru"
MASTER_ADMIN_PASSWORD="your-secure-password"
```

## 5. Настройка базы данных

### Применение миграций
```bash
npx prisma migrate deploy
```

### Создание директории для загрузок
```bash
mkdir -p public/uploads/objects
mkdir -p public/uploads/projects
chmod 755 public/uploads
```

## 6. Настройка PM2 для автозапуска

### Установка PM2
```bash
npm install -g pm2
```

### Создание конфигурации PM2
```bash
nano ecosystem.config.js
```

Содержимое:
```javascript
module.exports = {
  apps: [{
    name: 'tashi-ani',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/html/tashi-ani',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### Запуск приложения
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 7. Настройка Nginx (если нужен)

### Установка Nginx
```bash
sudo apt install nginx
```

### Конфигурация Nginx
```bash
sudo nano /etc/nginx/sites-available/tashi-ani
```

Содержимое:
```nginx
server {
    listen 80;
    server_name yourdomain.ru www.yourdomain.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Активация конфигурации
```bash
sudo ln -s /etc/nginx/sites-available/tashi-ani /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. Настройка SSL (рекомендуется)

### Установка Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### Получение SSL сертификата
```bash
sudo certbot --nginx -d yourdomain.ru -d www.yourdomain.ru
```

## 9. Проверка работы

1. Откройте браузер и перейдите на `https://yourdomain.ru`
2. Проверьте все функции:
   - Главная страница
   - Авторизация
   - Админ-панель
   - Загрузка файлов
   - PDF просмотр

## 10. Мониторинг

### Просмотр логов
```bash
pm2 logs tashi-ani
```

### Статус приложения
```bash
pm2 status
```

### Перезапуск при необходимости
```bash
pm2 restart tashi-ani
```

## Важные замечания

1. **Безопасность**: Смените все пароли по умолчанию
2. **Резервное копирование**: Настройте регулярные бэкапы базы данных
3. **Мониторинг**: Используйте PM2 для мониторинга приложения
4. **Обновления**: Регулярно обновляйте зависимости

## 11. Обновление с исправлениями безопасности

### Быстрое обновление
```bash
cd /var/www/tashi-ani
git pull origin master
npm install
npm run build
pm2 restart tashi-ani
```

### Проверка безопасности после обновления
```bash
# Проверьте логи на подозрительную активность
pm2 logs tashi-ani --lines 100 | grep -E "SECURITY ALERT"

# Проверьте процессы на наличие подозрительных
ps aux | grep -E "(boatnet|yamaha|broncano)"

# Проверьте файловую систему
find /var/www/tashi-ani -name "*.x86_64" -o -name "*boatnet*"

# Проверьте сетевые соединения
netstat -tulpn | grep -E "50\.6\.248\.160"
```

### Блокировка подозрительных IP
```bash
# Заблокировать IP через ufw
sudo ufw deny from 50.6.248.160

# Или через iptables
sudo iptables -A INPUT -s 50.6.248.160 -j DROP
```

## Поддержка

При возникновении проблем:
1. Проверьте логи: `pm2 logs tashi-ani`
2. Проверьте статус: `pm2 status`
3. Проверьте конфигурацию Nginx: `sudo nginx -t`
4. Проверьте безопасность: см. раздел "Проверка безопасности"

