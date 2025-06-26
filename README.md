# 🗒️ Todo App — FastAPI × React

Тестовое задание: «Список задач» с регистрацией, JWT-аутентификацией и CRUD-операциями.

## ⚙️ Стек

| Уровень  | Технологии                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------- |
| Backend  | **FastAPI** · SQLModel · SQLite (по-умолчанию) · Pydantic · PyJWT                                   |
| Frontend | **React 18** · Vite · TypeScript · React Router v6 · @tanstack/react-query · MUI v5 · Framer Motion |

---

## 🚀 Быстрый старт (Windows 10+)

> ⚠ Для работы необходимы:
> Python ≥ 3.10 https://www.python.org/downloads/
> Node ≥ 18 https://nodejs.org/en/download
> И то и то должно быть прописано в переменных среды (PATH)

**1. Скачать или склонировать репозиторий и открыть в терминале папку todo_app
```powershell
git clone https://github.com/VeeElEl/todo_app.git
cd todo_app
```

**2.** **Настроить Бэкенд** 
Из корневой папки (todo_app) установить все зависимости
```powershell
python -m venv venv
.\venv\Scripts\activate              # source venv/bin/activate  (Linux/Mac)
pip install -r requirements.txt
```

**2.** **Настроить Фронтенд** 
Из папки todo_app/fronted установить все зависимости
```powershell
cd frontend
npm install
cd ..
```

**4. Запустить Бэкенд** 
Из папки todo_app в терминале прописать:
```PowerShell
uvicorn backend.app.main:app --reload --port 8000
```
Для проверки запуска, в браузере можно перейти на https://127.0.0.1:8000/docs
Если все ок, то должна открыться Swagger-документация.

**5. Запустить Фронт** 
Из папки todo_app/frontend в терминале запустить с помощью команду npm
```PowerShell
cd frontend 
npm run dev
```
Для проверки запуска, в браузере можно перейти http://localhost:5173/
Если все ок, то откроется страница входа.

## ✅Булетпоинты
Веб приложение "Список задач".
	Регистрации
	Аутентификация
	Управление задачами

**Backend (API):**
- Выбрать бэкенд фреймворк для API 
		Выбран FastAPI	
- Реализовать REST API:
	 https://github.com/VeeElEl/todo_app/blob/master/backend/app/routers/tasks.py
	 http://localhost:8000/docs#/ 



	
	
			
		Свагер документация тут (tasks):
			
	Реализовать функцию регистрации:
		Реализовано тут (register):
			https://github.com/VeeElEl/todo_app/blob/master/backend/app/routers/auth.py
		Свагер тут (auth/register(POST)):	
			http://127.0.0.1:8000/docs#/
	Реализовать функцию аутентификации (JWT-токен): 
		Аутентификация через JWT тут (login через create_access_token):
			https://github.com/VeeElEl/todo_app/blob/master/backend/app/routers/auth.py
		Работа с JWT происходит тут:
			https://github.com/VeeElEl/todo_app/blob/master/backend/app/core/security.py
		Свагер тут(auth/login(POST))
	CRUD-операции для задач:
		Реализовано тут: 
			https://github.com/VeeElEl/todo_app/blob/master/backend/app/routers/tasks.py
		Свагер документация тут (tasks):
			http://localhost:8000/docs#/ 
	Задачи должны содержать заголовок, описание, статус (todo/done), дату создания:
		Реализовано тут:
			https://github.com/VeeElEl/todo_app/blob/master/backend/app/models.py
	Должна проводиться валидация и обработка ошибок:
		