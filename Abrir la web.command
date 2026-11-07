#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR/dist" || {
  echo "No encuentro la carpeta dist. ¿Descomprimiste todo el archivo?"
  read -r _
  exit 1
}
PORT=4173
python3 -m http.server "$PORT" &
PID=$!
sleep 0.7
open "http://127.0.0.1:$PORT/"
echo "La web está abierta en el navegador. Cierra esta ventana para pararla."
wait $PID
