# backend/Dockerfile
FROM node:18

WORKDIR /app

# Копіюємо залежності
COPY package*.json ./
RUN npm install

# Встановлюємо nodemon глобально (опціонально)
RUN npm install -g nodemon

# Відкриваємо порт
EXPOSE 3000

# Запускаємо у dev-режимі
CMD ["npm", "run", "dev"]
