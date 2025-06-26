# 🗒️ Todo App — FastAPI × React

Учебное тестовое задание: «Список задач» с регистрацией, JWT-аутентификацией и CRUD-операциями.

## ⚙️ Стек

| Уровень   | Технологии |
|-----------|------------|
| Backend   | **FastAPI** · SQLModel · SQLite (по-умолчанию) · Pydantic · PyJWT |
| Frontend  | **React 18** · Vite · TypeScript · React Router v6 · @tanstack/react-query · MUI v5 · Framer Motion |
---

## 🚀 Быстрый старт (Windows 10+)

> ⚠ Python ≥ 3.10 и Node ≥ 18 должны быть в PATH.

```powershell
# 1. Клонируем
git clone https://github.com/your-nick/todo_app.git
cd todo_app

# 2. Backend ──────────────────────────────────────────────
python -m venv venv
.\venv\Scripts\activate              # source venv/bin/activate  (Linux/Mac)
pip install -r requirements.txt

# 3. Frontend ─────────────────────────────────────────────
cd frontend
npm install
cd ..

# 4. Запуск (два терминала)
# ─ backend
uvicorn backend.app.main:app --reload --port 8000
# ─ frontend
cd frontend && npm run dev
