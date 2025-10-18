#!/bin/bash

# Verifica si la base de datos 'noticias' existe
DB_EXIST=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='noticias'")

# Si no existe, la crea
if [ "$DB_EXIST" != "1" ]; then
    echo "Creando base de datos 'noticias'..."
    sudo -u postgres psql -c "CREATE DATABASE noticias"
else
    echo "La base de datos 'noticias' ya existe."
fi

# Ejecuta el script SQL dentro de la base de datos
echo "Ejecutando el script SQL en la base de datos 'noticias'..."
sudo -u postgres psql -d noticias -f script_tablas.sql

