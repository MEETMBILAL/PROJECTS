#!/usr/bin/env bash
set -e

echo "Waiting for database..."
python - <<'PY'
import os, time
import dj_database_url
import psycopg2

url = os.environ.get("DATABASE_URL", "")
if url.startswith("postgres"):
    cfg = dj_database_url.parse(url)
    for _ in range(30):
        try:
            psycopg2.connect(
                dbname=cfg["NAME"], user=cfg["USER"], password=cfg["PASSWORD"],
                host=cfg["HOST"], port=cfg["PORT"] or 5432,
            ).close()
            break
        except Exception:
            time.sleep(1)
PY

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

exec "$@"
