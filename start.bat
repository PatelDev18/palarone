@echo off
echo Starting PolarOne Production Stack...

echo Starting FastAPI Backend...
start cmd /k "cd apps\api && uvicorn main:app --reload --port 8000"

echo Starting Next.js Frontend...
start cmd /k "cd apps\web && npm run dev"

echo PolarOne is launching!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
