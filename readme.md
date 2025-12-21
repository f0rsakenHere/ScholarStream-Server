# ScholarStream Server API Documentation

## Overview

Backend API for ScholarStream - A scholarship management platform with role-based access control (Admin, Moderator, Student).

**Base URL:** `https://scholar-stream-server-omega.vercel.app/api`

**Tech Stack:** Node.js, Express.js, MongoDB, JWT Authentication

---

## Authentication

### Generate JWT Token

**Endpoint:** `POST /auth/jwt`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token Usage:** Include in headers for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

---

## User Management

### Create User

**Endpoint:** `POST /users`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://example.com/photo.jpg",
  "role": "student"
}
```

**Roles:** `admin`, `moderator`, `student`

### Get All Users

**Endpoint:** `GET /users`

### Get User by ID

**Endpoint:** `GET /users/:id`

### Update User

**Endpoint:** `PUT /users/:id`

### Delete User

**Endpoint:** `DELETE /users/:id`

---

## Scholarships

### Create Scholarship (Admin/Moderator Only)

**Endpoint:** `POST /scholarships`

**Auth Required:** ✅ (Admin or Moderator)

**Request Body:**

```json
{
  "scholarshipName": "MIT Engineering Scholarship",
  "universityName": "Massachusetts Institute of Technology",
  "universityImage": "https://example.com/mit.jpg",
  "universityCountry": "USA",
  "universityCity": "Cambridge",
  "universityWorldRank": 1,
  "subjectCategory": "Engineering",
  "scholarshipCategory": "Merit-based",
  "degree": "Bachelor",
  "tuitionFees": 53790,
  "applicationFees": 75,
  "serviceCharge": 25,
  "applicationDeadline": "2025-12-31",
  "postedUserEmail": "admin@example.com"
}
```

### Get All Scholarships (with Search, Filter, Sort)

**Endpoint:** `GET /scholarships/all-scholarships`

**Query Parameters:**

- `search` - Searches in scholarship name, university name, degree (case-insensitive)
- `country` - Filter by university country
- `category` - Filter by scholarship category
- `degree` - Filter by degree (Bachelor, Masters, Diploma)
- `sort` - Sort results:
  - `fees_asc` - Application fees low to high
  - `fees_desc` - Application fees high to low
  - `date_asc` - Oldest first
  - `date_desc` - Newest first

**Example:**

```
GET /scholarships/all-scholarships?search=engineering&country=USA&sort=fees_asc
```

### Get All Scholarships (Basic)

**Endpoint:** `GET /scholarships`

### Get Scholarship by ID

**Endpoint:** `GET /scholarships/:id`

### Update Scholarship

**Endpoint:** `PUT /scholarships/:id`

### Delete Scholarship

**Endpoint:** `DELETE /scholarships/:id`

---

## Applications

### Submit Application (Student)

**Endpoint:** `POST /applications`

**Auth Required:** ✅

**Request Body:**

```json
{
  "scholarshipId": "507f1f77bcf86cd799439011",
  "universityName": "MIT",
  "scholarshipCategory": "Merit-based",
  "degree": "Bachelor",
  "applicationFees": 75,
  "serviceCharge": 25,
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "transactionId": "txn_1234567890"
}
```

**Auto-set fields:**

- `applicationStatus: "pending"`
- `paymentStatus: "paid"`

**Validation:** Prevents duplicate applications (same scholarshipId + applicantEmail)

### Get All Applications (Moderator/Admin Only)

**Endpoint:** `GET /applications`

**Auth Required:** ✅ (Moderator or Admin)

### Get My Applications (Student)

**Endpoint:** `GET /applications/user/:email`

**Auth Required:** ✅ (Must match token email)

**Security:** Users can only see their own applications

### Get Application by ID

**Endpoint:** `GET /applications/:id`

**Auth Required:** ✅

### Filter Applications

**Endpoint:** `GET /applications/filter`

**Auth Required:** ✅

**Query Parameters:**

- `userId` - Filter by user ID
- `scholarshipId` - Filter by scholarship ID
- `status` - Filter by application status
- `paymentStatus` - Filter by payment status

### Update Application (Student - Own Pending Only)

**Endpoint:** `PUT /applications/:id`

**Auth Required:** ✅

**Rules:**

- Can only edit own applications
- Can only edit if status is "pending"
- Cannot change `applicationStatus` or `paymentStatus`

### Update Application Status (Moderator Only)

**Endpoint:** `PATCH /applications/:id/status`

**Auth Required:** ✅ (Moderator)

**Request Body:**

```json
{
  "applicationStatus": "processing",
  "feedback": "Your application is under review"
}
```

**Status Options:** `pending`, `processing`, `completed`, `rejected`

### Delete Application (Student - Own Pending Only)

**Endpoint:** `DELETE /applications/:id`

**Auth Required:** ✅

**Rules:**

- Can only delete own applications
- Can only delete if status is "pending"

---

## Reviews

### Create Review

**Endpoint:** `POST /reviews`

**Request Body:**

```json
{
  "scholarshipId": "507f1f77bcf86cd799439011",
  "universityName": "MIT",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userImage": "https://example.com/user.jpg",
  "ratingPoint": 5,
  "reviewComment": "Excellent scholarship program!"
}
```

**Rating:** Must be between 1-5

### Get All Reviews

**Endpoint:** `GET /reviews`

### Get Reviews by Scholarship

**Endpoint:** `GET /reviews/scholarship/:scholarshipId`

**Response includes average rating:**

```json
{
  "total": 10,
  "averageRating": "4.50",
  "reviews": [...]
}
```

### Filter Reviews

**Endpoint:** `GET /reviews/filter`

**Query Parameters:**

- `scholarshipId` - Filter by scholarship
- `universityName` - Search by university name
- `minRating` - Minimum rating (1-5)
- `userEmail` - Filter by user email

### Get Review by ID

**Endpoint:** `GET /reviews/:id`

### Update Review

**Endpoint:** `PUT /reviews/:id`

### Delete Review

**Endpoint:** `DELETE /reviews/:id`

---

## Payments (Stripe Integration)

### Create Payment Intent

**Endpoint:** `POST /payments/create-payment-intent`

**Auth Required:** ✅

**Request Body:**

```json
{
  "price": 100.0
}
```

**Response:**

```json
{
  "clientSecret": "pi_1234_secret_5678"
}
```

**Note:** Use clientSecret with Stripe.js on frontend

---

## Admin Dashboard

### Get Admin Statistics

**Endpoint:** `GET /admin/admin-stats`

**Auth Required:** ✅ (Admin Only)

**Response:**

```json
{
  "totalUsers": 150,
  "totalScholarships": 45,
  "totalApplications": 320,
  "totalRevenue": 16000,
  "chartData": [
    { "_id": "Engineering", "count": 85 },
    { "_id": "Medical", "count": 72 },
    { "_id": "Business", "count": 63 }
  ]
}
```

---

## Role-Based Access Control

### Roles

- **Admin:** Full access to all resources
- **Moderator:** Can manage scholarships and application statuses
- **Student:** Can view scholarships, apply, manage own applications

### Protected Routes Summary

| Endpoint                       | Method           | Access Level |
| ------------------------------ | ---------------- | ------------ |
| POST /scholarships             | Admin/Moderator  |
| GET /applications              | Moderator/Admin  |
| PATCH /applications/:id/status | Moderator        |
| GET /admin/admin-stats         | Admin            |
| GET /applications/user/:email  | Own data only    |
| PUT /applications/:id          | Own pending only |
| DELETE /applications/:id       | Own pending only |

---

## Error Handling

### Common Error Responses

**400 Bad Request:**

```json
{
  "error": "Missing required fields"
}
```

**401 Unauthorized:**

```json
{
  "error": "No token provided"
}
```

**403 Forbidden:**

```json
{
  "message": "Forbidden access"
}
```

**404 Not Found:**

```json
{
  "error": "Resource not found"
}
```

**409 Conflict:**

```json
{
  "error": "You have already applied for this scholarship"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Error message details"
}
```

---

## Data Models

### User Schema

```javascript
{
  name: String,
  email: String (unique),
  photoURL: String,
  role: String, // "admin" | "moderator" | "student"
  createdAt: Date,
  updatedAt: Date
}
```

### Scholarship Schema

```javascript
{
  scholarshipName: String,
  universityName: String,
  universityImage: String,
  universityCountry: String,
  universityCity: String,
  universityWorldRank: Number,
  subjectCategory: String,
  scholarshipCategory: String,
  degree: String, // "Diploma" | "Bachelor" | "Masters"
  tuitionFees: Number,
  applicationFees: Number,
  serviceCharge: Number,
  applicationDeadline: String (date),
  scholarshipPostDate: Date,
  postedUserEmail: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Application Schema

```javascript
{
  scholarshipId: String,
  universityName: String,
  scholarshipCategory: String,
  degree: String,
  applicationFees: Number,
  serviceCharge: Number,
  applicantName: String,
  applicantEmail: String,
  transactionId: String,
  applicationStatus: String, // "pending" | "processing" | "completed" | "rejected"
  paymentStatus: String, // "paid" | "unpaid"
  applicationDate: Date,
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Review Schema

```javascript
{
  scholarshipId: String,
  universityName: String,
  userName: String,
  userEmail: String,
  userImage: String,
  ratingPoint: Number, // 1-5
  reviewComment: String,
  reviewDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Variables Required

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## Frontend Development Tips

### 1. Authentication Flow

```javascript
// Login and store token
const response = await fetch("/api/auth/jwt", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: userEmail }),
});
const { token } = await response.json();
localStorage.setItem("token", token);

// Use token in subsequent requests
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
};
```

### 2. Decode JWT to Get User Role

```javascript
import { jwtDecode } from "jwt-decode";
const decoded = jwtDecode(token);
const userEmail = decoded.email;
```

### 3. Scholarship Search/Filter/Sort

```javascript
const params = new URLSearchParams({
  search: "engineering",
  country: "USA",
  sort: "fees_asc",
});
const response = await fetch(`/api/scholarships/all-scholarships?${params}`);
```

### 4. Protected Routes (React Router)

Check user role before rendering admin/moderator pages

### 5. Payment Integration

Use Stripe Elements with the clientSecret from `/payments/create-payment-intent`

---

## Testing the API

### Health Check

```bash
GET http://localhost:5000/health
```

### Test Authentication

```bash
# Generate token
POST http://localhost:5000/api/auth/jwt
Body: { "email": "admin@example.com" }

# Use token
GET http://localhost:5000/api/applications
Headers: Authorization: Bearer <your_token>
```

---

## Support & Contact

For backend issues or questions, refer to the error messages in the response or check server logs.

**Server Status Endpoint:** `GET /health`
