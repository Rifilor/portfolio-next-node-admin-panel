# Используем базовый образ с Node.js
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# # Собираем приложение
# RUN npm run build

# Экспонируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "dev"]