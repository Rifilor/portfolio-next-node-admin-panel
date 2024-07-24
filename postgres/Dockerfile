FROM postgres:16

# Копіюємо скрипти для ініціалізації та дамп бази даних
COPY init-db.sh /docker-entrypoint-initdb.d/
COPY backup.dump /docker-entrypoint-initdb.d/

# Задаємо права на виконання для скриптів
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh