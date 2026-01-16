# Настройка переменных окружения для собственной почты

## Для локальной разработки (.env.local)

```env
# Собственная почта домена tashi-ani.ru
EMAIL_USER=admin@tashi-ani.ru
EMAIL_PASS=admin123

# Мастер-админ
MASTER_ADMIN_EMAIL=2277277@bk.ru
MASTER_ADMIN_PASSWORD=admin123

# JWT секрет
JWT_SECRET=your-super-secret-jwt-key-here

# База данных
DATABASE_URL="file:./dev.db"
```

## Для сервера (.env.local на сервере)

```env
# Собственная почта домена tashi-ani.ru
EMAIL_USER=admin@tashi-ani.ru
EMAIL_PASS=admin123

# Мастер-админ
MASTER_ADMIN_EMAIL=2277277@bk.ru
MASTER_ADMIN_PASSWORD=admin123

# JWT секрет (должен быть тот же что и на сервере)
JWT_SECRET=your-super-secret-jwt-key-here

# База данных на сервере
DATABASE_URL="file:./prisma/prod.db"
```

## Настройка почты на reg.ru

1. **Заходим в панель управления reg.ru**
2. **Переходим в раздел "Почта"**
3. **Создаем почтовый ящик:**
   - Логин: `admin`
   - Домен: `tashi-ani.ru`
   - Полный адрес: `admin@tashi-ani.ru`
   - Пароль: `admin123`

4. **Настраиваем SMTP:**
   - Хост: `smtp.reg.ru` или `mail.tashi-ani.ru`
   - Порт: `587` (STARTTLS) или `465` (SSL)
   - Логин: `admin@tashi-ani.ru`
   - Пароль: `admin123`

## Альтернатива: Yandex для домена (бесплатно)

Если reg.ru не подходит, можно использовать Yandex:

1. **Заходим на https://pdd.yandex.ru/**
2. **Подключаем домен tashi-ani.ru**
3. **Создаем ящик admin@tashi-ani.ru**
4. **Настраиваем SMTP:**
   - Хост: `smtp.yandex.ru`
   - Порт: `587`
   - Логин: `admin@tashi-ani.ru`
   - Пароль: `admin123`

## Тестирование

После настройки:

1. **Обновляем переменные окружения**
2. **Перезапускаем сервер**
3. **Тестируем отправку кода**
4. **Проверяем логи на ошибки**

## Преимущества собственной почты

✅ **Надежность** - не блокируется как Gmail
✅ **Брендинг** - письма от admin@tashi-ani.ru
✅ **Стабильность** - меньше проблем с VPS
✅ **Контроль** - полный контроль над настройками
