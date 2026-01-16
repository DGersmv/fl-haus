# PowerShell скрипт для обновления сервера
$password = "RzOFp5upP4a6MyDi"
$server = "root@89.104.67.209"

Write-Host "Обновляем код на сервере..."

# Создаем команды для выполнения на сервере
$commands = @"
cd /var/www/tashi-ani
git pull origin master
pm2 restart tashi-ani
echo "Код обновлен и приложение перезапущено"
"@

# Выполняем команды на сервере
ssh $server $commands
