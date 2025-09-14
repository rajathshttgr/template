FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies first (cache this layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI app code (volume will override this in dev)
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Default command (can be overridden by docker-compose)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
