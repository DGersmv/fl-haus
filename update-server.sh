#!/bin/bash
echo "Обновляем код на сервере..."
sshpass -p "RzOFp5upP4a6MyDi" ssh root@89.104.67.209 << 'EOF'
cd /var/www/tashi-ani
git pull origin master
pm2 restart tashi-ani
echo "Код обновлен и приложение перезапущено"
EOF
