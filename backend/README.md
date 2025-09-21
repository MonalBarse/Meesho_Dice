# Meesho Certainty Engine - Backend Overview & Architecture

## Project Overview

The Meesho Certainty Engine backend is an intelligent clothing fit prediction system designed to reduce return rates and boost customer confidence in online fashion shopping. The backend provides APIs to manage users, products, measurements, and delivers ML-powered fit predictions to help customers make informed sizing decisions.

### What the Backend Does
- **User Management**: Handles user profiles and body measurements
- **Product Management**: Manages clothing items with detailed measurements and fit categories
- **Fit Prediction**: Uses machine learning models to predict clothing fit based on user and product measurements
- **Data Analytics**: Collects and processes fit feedback for continuous model improvement

### Key Features and Capabilities
- Real-time fit predictions using trained ML models
- Support for multiple clothing categories (upper fitted, upper loose, lower fitted, lower loose, dresses)
- Comprehensive user measurement management
- Product catalog with detailed sizing information
- RESTful API design for easy frontend integration
- Robust error handling and validation

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL (primary data store)
- **ORM**: Prisma (database access and migrations)
- **ML Service**: FastAPI with Python (separate microservice)
- **Caching**: Redis (for performance optimization)

### Key Dependencies
- **@prisma/client**: Database client and type-safe queries
- **axios**: HTTP client for ML service communication
- **express**: Web application framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Development Tools
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library
- **Nodemon**: Development server with auto-reload

## Architecture & Design

### High-Level Design (HLD)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   ML Service    │
│   (React)       │◄──►│   (Node.js)      │◄──►│   (FastAPI)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   PostgreSQL     │
                       │   Database       │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Redis Cache    │
                       │   (Optional)     │
                       └──────────────────┘
```

### Architecture Principles
- **Microservice Architecture**: ML prediction service is separated from main API for scalability
- **RESTful Design**: Clean, predictable API endpoints following REST conventions
- **Database-First Approach**: Prisma schema drives the data model and type safety
- **Stateless Design**: Each request is independent, enabling horizontal scaling
- **Separation of Concerns**: Clear separation between data management and ML inference

### Directory Structure

```
backend/
├── src/
│   └── server.js              # Main Express application and API routes
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # Database migration files
├── ml_fit_service/            # Separate ML prediction service
│   ├── main.py               # FastAPI application for ML predictions
│   ├── train.py              # Model training scripts
│   ├── models/               # Trained ML model files
│   └── requirements.txt      # Python dependencies
├── package.json              # Node.js dependencies and scripts
└── README.md                 # This file
```

### Design Patterns Used
- **Repository Pattern**: Prisma client abstracts database operations
- **Service Layer**: ML predictions handled by separate service
- **Middleware Pattern**: Express middleware for request processing
- **Factory Pattern**: Prisma client instantiation and connection management

### Component Interaction Flow

1. **Frontend Request**: Client sends HTTP request to Express API
2. **Route Handler**: Express router processes request and validates input
3. **Database Layer**: Prisma client queries PostgreSQL database
4. **ML Service Call**: For predictions, API calls FastAPI ML service via HTTP
5. **Response Assembly**: Data is formatted and returned to frontend
6. **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

## Database Information

### Database Choice: PostgreSQL
PostgreSQL was chosen for its:
- **ACID Compliance**: Ensures data integrity for user profiles and measurements
- **JSON Support**: Flexible data storage for future feature extensions
- **Relational Integrity**: Strong foreign key constraints for data consistency
- **Performance**: Excellent query optimization and indexing capabilities
- **Prisma Compatibility**: First-class support with type-safe queries

### Main Entities and Relationships

#### User Entity
- **Purpose**: Stores basic user information
- **Key Fields**: id, email, name, createdAt
- **Relationships**: One-to-one with UserMeasurements

#### UserMeasurements Entity
- **Purpose**: Stores user body measurements for fit predictions
- **Key Fields**: bust, waist, hip measurements in centimeters
- **Relationships**: Belongs to User (foreign key: userId)

#### Products Entity
- **Purpose**: Stores clothing items with measurements and fit categories
- **Key Fields**: name, fitCategory, chest, waist, hip measurements
- **Fit Categories**: upper_fitted, upper_loose, lower_fitted, lower_loose, dresses

### Database Schema Design

```sql
-- Core user information
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User body measurements
CREATE TABLE "UserMeasurements" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE REFERENCES "User"(id),
    bust DOUBLE PRECISION NOT NULL,
    waist DOUBLE PRECISION NOT NULL,
    hip DOUBLE PRECISION NOT NULL
);

-- Product catalog with measurements
CREATE TABLE "Products" (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    "fitCategory" VARCHAR NOT NULL,
    chest DOUBLE PRECISION NOT NULL,
    waist DOUBLE PRECISION NOT NULL,
    hip DOUBLE PRECISION NOT NULL
);
```

### Data Relationships
- **User ↔ UserMeasurements**: One-to-one relationship ensures each user has at most one measurement profile
- **Products**: Independent entity with no direct relationships (normalized design)
- **Future Extensions**: Schema designed to easily add fit feedback and recommendation history tables

## API Overview

The backend provides four main API modules for comprehensive functionality:

### User Management Module
- **Purpose**: Handle user registration, profile management, and authentication
- **Core Operations**: Create, read, update, delete user profiles
- **Key Features**: Email uniqueness validation, profile data management

### Product Management Module
- **Purpose**: Manage clothing inventory with detailed measurements
- **Core Operations**: Product CRUD operations, category management
- **Key Features**: Fit category validation, measurement data storage

### Measurements Module
- **Purpose**: User body measurement management for personalized fit predictions
- **Core Operations**: Store and update user measurements, measurement validation
- **Key Features**: One measurement profile per user, data accuracy validation

### Fit Prediction Module
- **Purpose**: ML-powered clothing fit recommendations
- **Core Operations**: Real-time fit predictions, confidence scoring
- **Key Features**: Multi-category model support, probability distributions

### Authentication & Authorization
Currently, the system operates without authentication to focus on core functionality. Future versions will implement:
- JWT-based authentication
- Role-based access control
- API rate limiting
- User session management

**For complete API endpoint documentation with request/response formats and React integration examples, see [API_GUIDE.md](./API_GUIDE.md)**

## Setup & Development

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **PostgreSQL**: Version 13 or higher
- **Python**: Version 3.8 or higher (for ML service)
- **npm**: Version 8.0 or higher

### Installation Instructions

1. **Clone and Navigate to Backend**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb meesho_certainty_engine
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your database URL
   ```

4. **Database Migration**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **ML Service Setup**
   ```bash
   cd ml_fit_service
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Environment Variables

Create a `.env` file in the backend root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/meesho_certainty_engine"

# ML Service Configuration
ML_API_URL="http://127.0.0.1:8000"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Redis Configuration (Optional)
REDIS_URL="redis://localhost:6379"
```

### Running the Backend

1. **Start ML Service** (Terminal 1)
   ```bash
   cd ml_fit_service
   source venv/bin/activate
   uvicorn main:app --reload --port 8000
   ```

2. **Start API Server** (Terminal 2)
   ```bash
   npm run dev
   # or for production
   npm start
   ```

3. **Verify Setup**
   ```bash
   # Test API server
   curl http://localhost:3000
   
   # Test ML service
   curl http://localhost:8000
   ```

### Development Workflow
- **Database Changes**: Use `npx prisma migrate dev` for schema changes
- **Code Changes**: Nodemon automatically restarts the server on file changes
- **ML Model Updates**: Retrain models using `python train.py` in ml_fit_service
- **Testing**: Run `npm test` for comprehensive test suite

## Deployment

### Production Setup

1. **Environment Configuration**
   - Set `NODE_ENV=production`
   - Use production PostgreSQL instance
   - Configure Redis for caching
   - Set up SSL certificates

2. **Database Migration**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **ML Service Deployment**
   - Deploy FastAPI service using Gunicorn/Uvicorn
   - Ensure model files are available in production
   - Set up health checks for ML service

### Environment Configurations

#### Development
- Local PostgreSQL database
- ML service on localhost:8000
- Debug logging enabled
- CORS enabled for local frontend

#### Staging
- Cloud PostgreSQL instance
- Separate ML service deployment
- Production-like data volumes
- Performance monitoring

#### Production
- High-availability PostgreSQL cluster
- Load-balanced ML service instances
- Redis caching layer
- Comprehensive monitoring and alerting

### Health Checks

The system provides several health check endpoints:

- **API Health**: `GET /` - Basic API server status
- **Database Health**: Connection status via Prisma
- **ML Service Health**: `GET /predict/health` - ML model availability

### Monitoring and Observability
- **Logging**: Structured JSON logs for production
- **Metrics**: Request/response times, error rates
- **Alerts**: Database connection failures, ML service downtime
- **Performance**: Query optimization, response time monitoring

---

*This documentation provides a comprehensive overview of the Meesho Certainty Engine backend architecture. For detailed API integration instructions and frontend development guidance, refer to [API_GUIDE.md](./API_GUIDE.md).*