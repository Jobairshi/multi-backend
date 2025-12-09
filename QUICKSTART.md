# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` (already done) and update if needed:
```bash
cp .env.example .env
```

### 3. Start Redis (Required for caching)

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

**Option B: Local Redis**
- Download and install Redis from https://redis.io/download
- Start Redis server: `redis-server`

### 4. Run the Application
```bash
# Development mode with hot reload
pnpm run start:dev
```

The API will be available at `http://localhost:8080`

---

## 📝 Quick API Test

### 1. Sign Up
```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"name\":\"Test User\"}"
```

Save the `accessToken` from the response.

### 2. Create News (Use token from step 1)
```bash
curl -X POST http://localhost:8080/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"title\":\"My First News\",\"content\":\"This is my first news article\",\"author\":\"Test User\"}"
```

### 3. Get All News (Cached)
```bash
curl http://localhost:8080/news
```

### 4. Get Current User
```bash
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📦 What's Included

✅ **Authentication Module**
- JWT-based authentication
- Sign up, sign in, get current user endpoints
- Password hashing with bcrypt
- Protected routes with guards

✅ **News Module**
- CRUD operations for news articles
- User-specific news filtering
- View counter
- Authentication required for create/update/delete

✅ **Caching Layer**
- Redis-based caching
- Automatic cache invalidation
- Configurable TTL
- Cache interceptors

✅ **Validation**
- DTO validation with class-validator
- Request transformation
- Whitelist and forbid non-whitelisted properties

✅ **Security**
- CORS enabled
- JWT token validation
- Route guards

---

## 🔧 Troubleshooting

### Redis Connection Error
If you see Redis connection errors, make sure Redis is running:
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### Port Already in Use
If port 8080 is already in use, change it in `.env`:
```
PORT=3000
```

### Module Not Found Errors
Run:
```bash
pnpm install
```

---

## 📚 Next Steps

1. Read `API_DOCUMENTATION.md` for detailed API reference
2. Check `README.md` for production considerations
3. Implement a real database (PostgreSQL, MongoDB)
4. Add Swagger/OpenAPI documentation
5. Set up logging and monitoring

---

## 🎯 Available Scripts

```bash
# Development
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod

# Tests
pnpm run test
pnpm run test:e2e
pnpm run test:cov

# Linting
pnpm run lint
```

Happy coding! 🚀
