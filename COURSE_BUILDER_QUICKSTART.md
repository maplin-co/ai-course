# 🎓 AI Course Builder - Quick Start Guide

## 📋 What You Have

A complete FastAPI backend with PostgreSQL database for managing AI-powered courses.

## 🚀 Getting Started

### 1. Start the Services

```bash
docker-compose up --build
```

This will:

- Start PostgreSQL database on port 5432
- Initialize the `courses` table with sample data
- Start the FastAPI backend on port 8080

### 2. Test the API

Once running, visit:

- **API Docs**: <http://localhost:8080/docs>
- **Alternative Docs**: <http://localhost:8080/redoc>

## 📡 API Endpoints

### Get All Courses

```bash
GET http://localhost:8080/api/courses/
```

### Get Single Course

```bash
GET http://localhost:8080/api/courses/1
```

### Create a Course

```bash
POST http://localhost:8080/api/courses/
Content-Type: application/json

{
  "title": "Advanced Python Programming",
  "description": "Master Python with real-world projects",
  "modules": [
    {"id": 1, "title": "Decorators", "type": "video"},
    {"id": 2, "title": "Async/Await", "type": "text"}
  ]
}
```

### Update a Course

```bash
PUT http://localhost:8080/api/courses/1
Content-Type: application/json

{
  "title": "Updated Course Title",
  "description": "New description"
}
```

### Delete a Course

```bash
DELETE http://localhost:8080/api/courses/1
```

## 🗄️ Database Access

Connect to PostgreSQL directly:

```bash
docker exec -it course-builder-db psql -U admin -d course_builder_db
```

View courses:

```sql
SELECT * FROM courses;
```

## 📁 Project Structure

```
backend/
├── server.py           # Main FastAPI application
├── db_config.py        # Database connection
├── course_model.py     # SQLAlchemy ORM model
├── schemas.py          # Pydantic models
├── crud.py             # Database operations
└── routers/
    └── courses.py      # Course API endpoints

db/
└── init.sql            # Database initialization

docker-compose.yml      # Container orchestration
.env                    # Environment variables
```

## 🔧 Development

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f app
```

### Rebuild After Changes

```bash
docker-compose up --build
```

## ✅ What's Working

- ✅ PostgreSQL database with JSONB support
- ✅ Async SQLAlchemy ORM
- ✅ Full CRUD operations for courses
- ✅ RESTful API with FastAPI
- ✅ Auto-generated API documentation
- ✅ Docker containerization
- ✅ Persistent data storage

## 🎯 Next Steps

1. Test the API endpoints using the Swagger UI
2. Create your first course via the API
3. Integrate with your frontend
4. Add authentication (JWT already available in the project)
5. Implement AI course generation features

---

**Your course builder backend is ready! 🚀**
