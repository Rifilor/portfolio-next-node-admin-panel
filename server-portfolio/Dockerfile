# Используем базовый образ с Node.js
FROM node:16-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Экспонируем порт
EXPOSE 8080

# Запускаем сервер
CMD ["npm", "run", "start"]