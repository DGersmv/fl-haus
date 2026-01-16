# Настройка базы данных

## 1. Создайте файл .env.local в корне проекта:

```env
# База данных PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/tashi_ani?schema=public"

# Мастер-админ
MASTER_ADMIN_EMAIL=2277277@bk.ru
MASTER_ADMIN_PASSWORD=admin123

# JWT секрет
JWT_SECRET=your-super-secret-jwt-key-here

# Email настройки
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 2. Установите PostgreSQL

### Windows:
1. Скачайте PostgreSQL с https://www.postgresql.org/download/windows/
2. Установите с настройками по умолчанию
3. Запомните пароль для пользователя postgres

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## 3. Создайте базу данных:

```sql
-- Подключитесь к PostgreSQL
psql -U postgres

-- Создайте базу данных
CREATE DATABASE tashi_ani;

-- Создайте пользователя (опционально)
CREATE USER tashi_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE tashi_ani TO tashi_user;
```

## 4. Обновите DATABASE_URL в .env.local:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/tashi_ani?schema=public"
```

## 5. Запустите миграции:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## 6. Создайте мастер-админа:

```bash
npx prisma db seed
```

















