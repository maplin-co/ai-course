# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080
ENV PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the backend code into a subdirectory named 'backend'
# to match the import structure 'from backend.xxx import ...'
COPY . /app/backend/

# Expose the port
EXPOSE 8080

# Command to run the application
# We use 'backend.server:app' because server.py is inside /app/backend/
CMD ["sh", "-c", "uvicorn backend.server:app --host 0.0.0.0 --port ${PORT}"]
