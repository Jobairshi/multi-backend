# Multi-Layered Cache Backend

A NestJS backend application with JWT authentication, Redis caching, and a news management system.

## Features

- 🔐 JWT Authentication (signup, signin, get current user)
- 📰 News Management with CRUD operations
- ⚡ Redis-based caching layer
- 🛡️ Route guards and validation
- 🔄 Multi-layered caching strategy

## Installation

```bash
# Install dependencies
pnpm install
```

## Configuration

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Application
PORT=8080
NODE_ENV=development
CORS_ORIGIN=*

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Cache Configuration
CACHE_TTL=300
```

## Prerequisites

- Node.js >= 18
- Redis server running (for caching)

### Starting Redis

**Windows:**
```bash
# Using Docker
docker run -d -p 6379:6379 redis:latest

# Or install Redis on Windows
# Download from: https://github.com/microsoftarchive/redis/releases
```

**Linux/Mac:**
```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
redis-server
```

## Running the App

```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

## API Endpoints

### Authentication

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-09T00:00:00.000Z"
  }
}
```

#### Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-09T00:00:00.000Z"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-12-09T00:00:00.000Z"
}
```

### News

#### Create News (Protected)
```http
POST /news
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Breaking News",
  "content": "This is the news content",
  "author": "John Doe"
}
```

**Response:**
```json
{
  "id": "456",
  "title": "Breaking News",
  "content": "This is the news content",
  "author": "John Doe",
  "authorId": "123",
  "createdAt": "2025-12-09T00:00:00.000Z",
  "updatedAt": "2025-12-09T00:00:00.000Z",
  "views": 0
}
```

#### Get All News (Cached - 60s)
```http
GET /news
```

**Response:**
```json
[
  {
    "id": "456",
    "title": "Breaking News",
    "content": "This is the news content",
    "author": "John Doe",
    "authorId": "123",
    "createdAt": "2025-12-09T00:00:00.000Z",
    "updatedAt": "2025-12-09T00:00:00.000Z",
    "views": 10
  }
]
```

#### Get Single News (Cached - 30s)
```http
GET /news/:id
```

#### Get My News (Protected)
```http
GET /news/my-news
Authorization: Bearer <jwt-token>
```

#### Update News (Protected)
```http
PATCH /news/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete News (Protected)
```http
DELETE /news/:id
Authorization: Bearer <jwt-token>
```

## Caching Strategy

### Cache Layers

1. **Redis Cache (L1)**: Fast in-memory cache
   - TTL: 60s for list endpoints
   - TTL: 30s for individual items
   - Automatic invalidation on updates

2. **Application Cache (L2)**: In-memory storage
   - Serves as fallback when Redis is unavailable

### Cache Headers

The API includes standard caching headers:
- `Cache-Control`: Controls caching behavior
- `ETag`: Entity tag for cache validation
- `Last-Modified`: Last modification timestamp

### Cache Invalidation

- Automatic invalidation on POST, PATCH, DELETE operations
- Manual cache clearing via Redis commands

## Project Structure

```
src/
├── auth/
│   ├── decorators/
│   │   └── get-user.decorator.ts
│   ├── dto/
│   │   └── auth.dto.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── interfaces/
│   │   └── auth.interface.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── news/
│   ├── dto/
│   │   └── news.dto.ts
│   ├── news.controller.ts
│   ├── news.module.ts
│   └── news.service.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Testing the API

### Using cURL

```bash
# Sign up
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Sign in
curl -X POST http://localhost:8080/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create news (replace TOKEN with your JWT)
curl -X POST http://localhost:8080/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test News","content":"Test content","author":"Test User"}'

# Get all news
curl http://localhost:8080/news
```

## Development Notes

- User data is stored in-memory (replace with a real database in production)
- Redis is required for caching to work properly
- JWT tokens expire based on `JWT_EXPIRES_IN` configuration
- All protected routes require `Authorization: Bearer <token>` header

## Production Considerations

1. Replace in-memory storage with a real database (PostgreSQL, MongoDB, etc.)
2. Use environment-specific configuration files
3. Implement rate limiting
4. Add request logging
5. Set up proper error handling and monitoring
6. Use Redis Cluster for high availability
7. Implement cache warming strategies
8. Add API documentation (Swagger/OpenAPI)

## License

UNLICENSED
