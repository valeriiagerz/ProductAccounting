# Приложение для учета товаров

Полнофункциональное приложение для управления товарами с backend API и frontend интерфейсом.

## Технологии

### Backend
- Node.js 18
- TypeORM
- PostgreSQL
- Express
- TypeScript

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS

## Быстрый старт

### Требования
- **Docker** (версия 20.10 или выше)
- **Docker Compose** (версия 2.0 или выше)

Проверьте установку:
```bash
docker --version
docker-compose --version
```

Если Docker не установлен, скачайте с [docker.com](https://www.docker.com/get-started)

### Установка зависимостей и запуск

**Важно:** При использовании Docker зависимости устанавливаются **автоматически** при сборке образов. Вам не нужно вручную устанавливать npm пакеты!

#### Шаг 1: Перейдите в директорию проекта
```bash
cd test_task
```

#### Шаг 2: Запустите все сервисы одной командой
```bash
docker-compose up
```

При первом запуске Docker:
- Скачает необходимые образы (Node.js, PostgreSQL)
- Установит все зависимости для backend и frontend (автоматически выполнит `npm install`)
- Соберет приложения
- Создаст базу данных PostgreSQL
- Запустит все сервисы

**Время первого запуска:** ~2-5 минут (зависит от скорости интернета)

#### Шаг 3: Дождитесь сообщений о готовности
Вы увидите в консоли:
```
Database connected successfully
Server is running on port 3000
```

#### Шаг 4: Откройте приложение в браузере
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **PostgreSQL:** localhost:5432

При первом запуске автоматически добавятся 10 тестовых товаров.

### Остановка приложения

Остановить все сервисы:
```bash
docker-compose down
```

Остановить и удалить все данные (включая базу данных):
```bash
docker-compose down -v
```

### Перезапуск после изменений

Если вы внесли изменения в код:
```bash
docker-compose up --build
```

Флаг `--build` пересоберет образы с новым кодом.

## Структура проекта

```
.
├── backend/              # Backend приложение
│   ├── src/
│   │   ├── entity/      # TypeORM сущности
│   │   ├── routes/      # API маршруты
│   │   └── index.ts     # Точка входа
│   ├── Dockerfile
│   └── package.json
├── frontend/            # Frontend приложение
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── types.ts     # TypeScript типы
│   │   └── App.tsx      # Главный компонент
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml   # Конфигурация Docker Compose
└── README.md
```

## API Endpoints

### GET /products
Получить список товаров с пагинацией

**Параметры запроса:**
- `page` (number, по умолчанию: 1) - номер страницы
- `limit` (number, по умолчанию: 50) - количество товаров на странице

**Ответ:**
```json
{
  "data": [...],
  "total": 50
}
```

### POST /products
Создать новый товар

**Тело запроса:**
```json
{
  "article": "NB-001",
  "name": "Хлеб",
  "price": 899.00,
  "quantity": 5
}
```

### PUT /products/:id
Обновить товар

**Тело запроса:**
```json
{
  "name": "Новое название",
  "price": 1000.00,
  "quantity": 10
}
```

### DELETE /products/:id
Удалить товар



