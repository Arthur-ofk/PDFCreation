# PDF Template Generation System

This project consists of three main components:
- Frontend (React + TypeScript)
- Backend API (.NET 10)
- SQL Server Database


## QStart

Start the application:
```bash
docker-compose up --build
```

Access the application:
- Frontend: http://localhost:80
- API Swagger: http://localhost:8080/swagger
- Database: localhost,11433

## Project Structure

```
PDFCreation/
├── PDFCreationFrontEnd/    # React frontend application
├── PDFCreationWebApi/      # .NET Web API
├── BLL/                    # Business Logic Layer
├── DAL/                    # Data Access Layer
└── docker-compose.yml      # Docker composition file
```

### Frontend (PDFCreationFrontEnd)
- Built with React + TypeScript + Vite
- Communicates with the API at `/api` endpoints
### Backend (PDFCreationWebApi)
- .NET 10 Web API
- RESTful endpoints for template management
- PDF generation capabilities
### Database
- SQL Server 2022
- Stores templates and related data
- Automatically initialized on first run
## Docker Configuration
The application uses Docker Compose to orchestrate three services:

1. **SQL Server (templatepdf-sql)**
   - Port: 11433:1433
   - Credentials:
     - User: sa
     - Password: Your_strong_password_123

2. **Web API (templatepdf-api)**
   - Port: 8080:8080
   - Dependencies: Requires SQL Server to be healthy
   - Health check endpoint: http://localhost:8080/health

3. **Frontend (templatepdf-frontend)**
   - Port: 80:80
   - Dependencies: Requires Web API to be healthy
   - Served via Nginx


## Docker Commands

```bash
# Start all services
docker-compose up

# Start with rebuild
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs [service_name]

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View running containers
docker-compose ps
```

