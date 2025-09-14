### ⚡ **FastAPI**

- A modern, high-performance web framework for building APIs with Python.
- Uses Python type hints for automatic validation and documentation.
- Great for asynchronous programming and integrates seamlessly with tools like Pydantic and SQLAlchemy.

---

### 🚀 **Uvicorn**

- An ASGI (Asynchronous Server Gateway Interface) server used to run FastAPI apps.
- Extremely fast and lightweight, built on `uvloop` and `httptools`.
- Supports WebSockets and HTTP/2 (planned), making it ideal for real-time applications.

---

### 🛠️ **SQLAlchemy**

- A powerful SQL toolkit and Object Relational Mapper (ORM).
- Lets you interact with databases using Python classes and objects instead of raw SQL.
- Supports multiple databases like PostgreSQL, MySQL, SQLite, etc.

---

### 🐘 **psycopg2-binary**

- A PostgreSQL database adapter for Python.
- The `-binary` version includes precompiled C libraries for faster installation and performance.
- Used by SQLAlchemy to connect to PostgreSQL databases.

---

### 🔐 **python-jose**

- A library for handling JSON Web Tokens (JWT) and other JOSE standards.
- Commonly used for authentication and authorization in FastAPI apps.
- Supports encryption, signing, and verification of tokens.

---

### 🔑 **passlib[bcrypt]**

- A password hashing library that supports many algorithms, including `bcrypt`.
- `bcrypt` is a secure hashing algorithm ideal for storing passwords.
- Ensures user credentials are safely encrypted before storing in the database.

---

### 🌱 **python-dotenv**

- Loads environment variables from a `.env` file into your Python app.
- Keeps sensitive data like database URLs, secret keys, and API tokens out of your codebase.
- Essential for configuration management in development and production.

---

### 🔄 **Alembic**

- A lightweight database migration tool for SQLAlchemy.
- Tracks changes to your database schema and applies them incrementally.
- Helps manage version control for your database structure.

---

### 📦 **Pydantic**

- Provides data validation and settings management using Python type annotations.
- Automatically parses and validates data (e.g., from requests) into Python objects.
- Powers FastAPI’s request/response models and ensures type safety.
