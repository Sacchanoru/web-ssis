# Web Student Information System (Web-SSIS)

A comprehensive web-based Student Information System designed to help educational institutions manage their academic data efficiently. This full-stack application provides a user-friendly interface to view, add, update, and delete records for students, programs, and colleges.

````

## Prerequisites

- **Python 3.13+**
- **Node.js 20+** and npm
- **PostgreSQL 12+**
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sacchanoru/web-ssis.git
cd web-ssis
````

### 2. Backend Setup

```bash
cd back-end

# Install dependencies
pipenv install

# Create a .env file with your database credentials
# (Copy from .flaskenv and add your DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)

# Activate virtual environment
pipenv shell

# Run database migrations (if applicable)
# Set up your PostgreSQL database and tables using table_schema SQL files

# Start the Flask development server
flask run
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd front-end

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port)

## Environment Variables

```
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_RUN_PORT=8000

(use your own credentials)
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=web_ssis

SECRET_KEY=your_secret_key_here
```
