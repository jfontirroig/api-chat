# Install

cd /home/paradigma/api-chat/
sudo npm run build
sudo pm2 delete api-chat
sudo API_CONFIG=/home/paradigma/api/config-api-chat.json pm2 start node lib/index.js --name "api-chat"
sudo pm2 save
sudo systemctl restart nginx

---------------------------------------------------
Más Detalles ver README.md de app-paradigma-website
---------------------------------------------------

OJO:
Edit /etc/nginx/nginx.conf and add the following line inside http block:
client_max_body_size 50M;
Then restart Nginx with sudo service nginx restart
