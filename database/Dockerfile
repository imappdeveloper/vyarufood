FROM mariadb:10.4

ENV MYSQL_DATABASE=tiffin_db \
    MYSQL_USER=tiffin_user \
    MYSQL_PASSWORD=tiffin_pass \
    MYSQL_ROOT_PASSWORD=tiffin_root_pass

COPY backend/database/tiffin_db.sql /docker-entrypoint-initdb.d/01-tiffin_db.sql

EXPOSE 3306
