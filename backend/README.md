# Qbot: Ask Questions

## Project Setup

Follow these steps to clone and set up the Qbot backend project.

---

### 1. Clone the Repository

```bash
git clone https://github.com/rajathshttgr/template.git
cd template/backend
```

---

### 2. Configure Environment Variables

Copy the example environment file and update secrets as needed:

```bash
cp .env.example .env
```

---

## Quick Start (Docker Compose)

**Requirements:** Docker & Docker Compose

1. **Build and run services:**

   ```bash
   docker-compose up -d --build
   ```

2. **Check logs:**

   ```bash
   docker-compose logs -f
   ```

3. **Access FastAPI:**
   - API: [http://localhost:8000](http://localhost:8000)
   - Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Manual Setup

**Requirements:** Python 3.11+, PostgreSQL 15+

### 1. PostgreSQL Setup

Connect to PostgreSQL and run:

```bash
docker run -d --name template-container -e POSTGRES_PASSWORD=admin123 -p 5432:5432 postgres:15

docker exec -it template psql -U postgres
```

```sql
CREATE USER newuser WITH PASSWORD 'admin123';
CREATE DATABASE templatedb OWNER newuser;
GRANT ALL PRIVILEGES ON DATABASE templatedb TO newuser;
```

### 2. Create Python Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate      # Linux / macOS
venv\Scripts\activate         # Windows PowerShell
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Migrations

```bash
alembic revision --autogenerate -m "Intial Update"
alembic upgrade head
```

### 5. Start FastAPI

```bash
uvicorn app.main:app --reload
```
