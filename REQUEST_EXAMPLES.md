# API Request Examples

Collection of example requests for testing the API.

## Authentication Endpoints

### 1. Sign Up
Create a new user account.

**Request:**
```http
POST http://localhost:8080/auth/signup
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1733702400000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-09T00:00:00.000Z"
  }
}
```

**Error Response (409 - User exists):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

---

### 2. Sign In
Login with existing credentials.

**Request:**
```http
POST http://localhost:8080/auth/signin
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1733702400000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-09T00:00:00.000Z"
  }
}
```

**Error Response (401 - Invalid credentials):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

### 3. Get Current User
Get information about the authenticated user.

**Request:**
```http
GET http://localhost:8080/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "id": "1733702400000",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "createdAt": "2025-12-09T00:00:00.000Z"
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## News Endpoints

### 4. Create News Article (Protected)
Create a new news article. Requires authentication.

**Request:**
```http
POST http://localhost:8080/news
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Breaking News: NestJS is Awesome!",
  "content": "Today we discovered that NestJS provides an amazing framework for building scalable server-side applications. The modular architecture and TypeScript support make it a joy to work with.",
  "author": "John Doe"
}
```

**Success Response (201):**
```json
{
  "id": "1733702500000",
  "title": "Breaking News: NestJS is Awesome!",
  "content": "Today we discovered that NestJS provides an amazing framework...",
  "author": "John Doe",
  "authorId": "1733702400000",
  "createdAt": "2025-12-09T00:00:00.000Z",
  "updatedAt": "2025-12-09T00:00:00.000Z",
  "views": 0
}
```

**Error Response (400 - Validation error):**
```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "title must be a string"
  ],
  "error": "Bad Request"
}
```

---

### 5. Get All News (Public, Cached 60s)
Retrieve all news articles. No authentication required. Cached for 60 seconds.

**Request:**
```http
GET http://localhost:8080/news
```

**Success Response (200):**
```json
[
  {
    "id": "1733702500000",
    "title": "Breaking News: NestJS is Awesome!",
    "content": "Today we discovered that NestJS provides...",
    "author": "John Doe",
    "authorId": "1733702400000",
    "createdAt": "2025-12-09T00:00:00.000Z",
    "updatedAt": "2025-12-09T00:00:00.000Z",
    "views": 5
  },
  {
    "id": "1733702600000",
    "title": "Another Great Article",
    "content": "More amazing content here...",
    "author": "Jane Smith",
    "authorId": "1733702300000",
    "createdAt": "2025-12-09T00:05:00.000Z",
    "updatedAt": "2025-12-09T00:05:00.000Z",
    "views": 10
  }
]
```

---

### 6. Get Single News (Public, Cached 30s)
Retrieve a specific news article by ID. Increments view count.

**Request:**
```http
GET http://localhost:8080/news/1733702500000
```

**Success Response (200):**
```json
{
  "id": "1733702500000",
  "title": "Breaking News: NestJS is Awesome!",
  "content": "Today we discovered that NestJS provides an amazing framework...",
  "author": "John Doe",
  "authorId": "1733702400000",
  "createdAt": "2025-12-09T00:00:00.000Z",
  "updatedAt": "2025-12-09T00:00:00.000Z",
  "views": 6
}
```

**Error Response (404 - Not found):**
```json
{
  "statusCode": 404,
  "message": "News with ID 123456789 not found",
  "error": "Not Found"
}
```

---

### 7. Get My News (Protected)
Get all news articles created by the authenticated user.

**Request:**
```http
GET http://localhost:8080/news/my-news
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
[
  {
    "id": "1733702500000",
    "title": "Breaking News: NestJS is Awesome!",
    "content": "Today we discovered that NestJS provides...",
    "author": "John Doe",
    "authorId": "1733702400000",
    "createdAt": "2025-12-09T00:00:00.000Z",
    "updatedAt": "2025-12-09T00:00:00.000Z",
    "views": 6
  }
]
```

---

### 8. Update News (Protected, Author Only)
Update an existing news article. Only the author can update their articles.

**Request:**
```http
PATCH http://localhost:8080/news/1733702500000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Updated: NestJS is Even More Awesome!",
  "content": "After further exploration, we found even more amazing features..."
}
```

**Success Response (200):**
```json
{
  "id": "1733702500000",
  "title": "Updated: NestJS is Even More Awesome!",
  "content": "After further exploration, we found even more amazing features...",
  "author": "John Doe",
  "authorId": "1733702400000",
  "createdAt": "2025-12-09T00:00:00.000Z",
  "updatedAt": "2025-12-09T00:15:00.000Z",
  "views": 6
}
```

**Error Response (404 - Not author):**
```json
{
  "statusCode": 404,
  "message": "You can only update your own news",
  "error": "Not Found"
}
```

---

### 9. Delete News (Protected, Author Only)
Delete a news article. Only the author can delete their articles.

**Request:**
```http
DELETE http://localhost:8080/news/1733702500000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```
(No content returned)
```

**Error Response (404 - Not author):**
```json
{
  "statusCode": 404,
  "message": "You can only delete your own news",
  "error": "Not Found"
}
```

---

## Testing Workflow

### Complete Flow Example

1. **Sign Up**: Create user account
2. **Sign In**: Get JWT token
3. **Create News**: Post a news article
4. **Get All News**: View all articles (cached)
5. **Get Single News**: View specific article (increments views)
6. **Get My News**: View only your articles
7. **Update News**: Modify your article
8. **Delete News**: Remove your article
9. **Get Current User**: Check your profile

### Cache Testing

1. **Initial Request**: `GET /news` - Fetches from service
2. **Second Request** (within 60s): `GET /news` - Returns cached data
3. **After 60s**: `GET /news` - Fetches fresh data
4. **Create News**: `POST /news` - Invalidates cache
5. **Next Request**: `GET /news` - Fetches fresh data again

---

## PowerShell Examples (Windows)

### Sign Up
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/auth/signup" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### Sign In and Save Token
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/auth/signin" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$token = $response.accessToken
Write-Host "Token: $token"
```

### Create News with Token
```powershell
$body = @{
    title = "My News Article"
    content = "This is the content of my news article"
    author = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/news" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $token" } `
    -Body $body
```

### Get All News
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/news" -Method Get
```

---

## Postman Collection

Import this JSON into Postman for a ready-to-use collection:

```json
{
  "info": {
    "name": "Multi-Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## Notes

- Replace `localhost:8080` with your actual server URL
- Update `Authorization` header with your actual JWT token
- JWT tokens expire after 24 hours (configurable in `.env`)
- Cached endpoints return faster on subsequent requests within TTL
- All timestamps are in ISO 8601 format
