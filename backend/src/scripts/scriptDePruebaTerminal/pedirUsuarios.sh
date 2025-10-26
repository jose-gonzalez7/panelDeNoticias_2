#!/bin/bash

# -------------------------------
# Configuración
# -------------------------------
API_URL="http://localhost:3000/api"
EMAIL="admin@gmail.com"
PASSWORD="12345678"

# -------------------------------
# 1️⃣ Login y obtener token
# -------------------------------
echo "Haciendo login..."
RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

# Extraer el token usando jq (asegúrate de tenerlo instalado)
TOKEN=$(echo $RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Error: no se obtuvo token. Respuesta del servidor:"
  echo $RESPONSE
  exit 1
fi

echo "Token obtenido correctamente."

# -------------------------------
# 2️⃣ Pedir usuarios
# -------------------------------
echo "Solicitando lista de usuarios..."
# curl -s -X GET "$API_URL/usuarios" \
#   -H "Authorization: Bearer $TOKEN" \
#   -H "Content-Type: application/json" \
#   | jq

curl -s -X GET "$API_URL/usuarios/admin" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | jq
