# Easy Buy Backend API Documentation

A comprehensive REST API backend for an e-commerce platform built with Express.js, TypeScript, and MongoDB.

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication APIs](#authentication-apis)
  - [Product APIs](#product-apis)
  - [Shop APIs](#shop-apis)
  - [Cart APIs](#cart-apis)
  - [Transaction APIs](#transaction-apis)
  - [Address APIs](#address-apis)
  - [Chat APIs](#chat-apis)
  - [Review APIs](#review-apis)
- [WebSocket Events](#websocket-events)
- [Error Handling](#error-handling)

## Base URL

All API endpoints are prefixed with `/api`

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using session-based authentication. After login, a session is created and a JWT token is returned. For protected routes, include the session cookie in your requests.

### Token Validation

Some endpoints use JWT token validation. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## API Endpoints

### Authentication APIs

#### Register User

Create a new user account.

**Endpoint:** `POST /api/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "string (min 3 characters, unique)",
  "email": "string (valid email, unique)",
  "password": "string (min 3 characters)"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

#### Login

Authenticate user and create session.

**Endpoint:** `POST /api/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    ...
  },
  "message": "Login successfull",
  "token": "jwt_token_string",
  "session": {}
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

---

#### Logout

Logout user and clear session.

**Endpoint:** `GET /api/logout`

**Authentication:** Not required (but token should be provided)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "You are logged out"
}
```

---

#### Validate Token

Validate JWT token and refresh session.

**Endpoint:** `GET /api/validate-token`

**Authentication:** Required (JWT token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    ...
  }
}
```

---

### Product APIs

#### Create Product

Create a new product (requires shop ownership).

**Endpoint:** `POST /api/product`

**Authentication:** Required

**Request Body:**
```json
{
  "product": {
    "name": "string",
    "description": "string",
    "category": "string",
    "images": ["string"],
    ...
  },
  "productVariants": [
    {
      "name": "string",
      "price": "number",
      "stock": "number",
      "images": ["string"],
      ...
    }
  ]
}
```

**Response:**
```json
{
  "product": {
    "_id": "string",
    "name": "string",
    ...
  },
  "message": "Product inserted"
}
```

---

#### Update Product

Update an existing product.

**Endpoint:** `PUT /api/product/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Product ID

**Request Body:**
```json
{
  "product": {
    "name": "string",
    "description": "string",
    "category": "string",
    ...
  },
  "productVariants": [
    {
      "name": "string",
      "price": "number",
      "stock": "number",
      ...
    }
  ]
}
```

**Response:**
```json
{
  "product": {
    "_id": "string",
    "name": "string",
    ...
  },
  "message": "Product updated"
}
```

---

#### Delete Product

Delete a product.

**Endpoint:** `DELETE /api/product/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Product ID

**Response:**
```json
{
  "product": {},
  "message": "Product deleted"
}
```

---

#### Get Latest Products

Get the latest products.

**Endpoint:** `GET /api/product/latest-product`

**Authentication:** Not required

**Response:**
```json
{
  "products": [
    {
      "_id": "string",
      "name": "string",
      ...
    }
  ]
}
```

---

#### Search Products

Search products by query string.

**Endpoint:** `GET /api/product/search`

**Authentication:** Not required

**Query Parameters:**
- `query` (required) - Search query string

**Response:**
```json
{
  "products": [
    {
      "_id": "string",
      "name": "string",
      ...
    }
  ]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/product/search?query=laptop"
```

---

#### Get Related Products

Get products by category ID.

**Endpoint:** `GET /api/product/category/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` - Category ID

**Response:**
```json
{
  "products": [
    {
      "_id": "string",
      "name": "string",
      ...
    }
  ]
}
```

---

#### Get All Products

Get paginated list of all products.

**Endpoint:** `GET /api/product`

**Authentication:** Not required

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10, max: 100)
- `search` (optional) - Search term

**Response:**
```json
{
  "products": [
    {
      "_id": "string",
      "name": "string",
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

**Example:**
```bash
curl "http://localhost:3000/api/product?page=1&limit=20&search=laptop"
```

---

#### Get Product Detail

Get detailed information about a specific product.

**Endpoint:** `GET /api/product/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` - Product ID

**Response:**
```json
{
  "product": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "variants": [...],
    ...
  }
}
```

---

### Shop APIs

#### Get User Shop

Get the shop associated with the authenticated user.

**Endpoint:** `GET /api/shop`

**Authentication:** Required

**Response:**
```json
{
  "shop": {
    "_id": "string",
    "name": "string",
    "description": "string",
    ...
  }
}
```

---

#### Create Shop

Create a new shop for the authenticated user.

**Endpoint:** `POST /api/shop`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  ...
}
```

**Response:**
```json
{
  "message": "Shop has been registered",
  "shop": {
    "_id": "string",
    "name": "string",
    ...
  }
}
```

---

#### Get Products by Shop

Get all products from a specific shop.

**Endpoint:** `GET /api/shop/:shopId/products`

**Authentication:** Required

**URL Parameters:**
- `shopId` - Shop ID

**Response:**
```json
{
  "products": [
    {
      "_id": "string",
      "name": "string",
      ...
    }
  ]
}
```

---

#### Get My Shop Products

Get all products from the authenticated user's shop.

**Endpoint:** `GET /api/shop/products`

**Authentication:** Required

**Response:**
```json
{
  "products": [
    {
      "_id": "string",
      "name": "string",
      ...
    }
  ]
}
```

---

### Cart APIs

#### Get Cart

Get the shopping cart for the authenticated user.

**Endpoint:** `GET /api/cart`

**Authentication:** Required

**Response:**
```json
{
  "carts": [
    {
      "_id": "string",
      "shop": {},
      "items": [
        {
          "_id": "string",
          "variant": {},
          "quantity": "number"
        }
      ]
    }
  ]
}
```

---

#### Add to Cart

Add a product variant to the cart.

**Endpoint:** `POST /api/cart/add-to-cart`

**Authentication:** Required

**Request Body:**
```json
{
  "variantId": "string",
  "shopId": "string",
  "quantity": "number (must be > 0, must not exceed stock)"
}
```

**Response:**
```json
{
  "cart": {
    "_id": "string",
    "items": [...]
  },
  "message": "Product has been added to cart"
}
```

---

#### Update Cart Quantity

Update the quantity of a cart item.

**Endpoint:** `PUT /api/cart/update-quantity`

**Authentication:** Required

**Request Body:**
```json
{
  "cartItemId": "string",
  "quantity": "number (must be > 0, must not exceed stock)"
}
```

**Response:**
```json
{
  "cart": {
    "_id": "string",
    "items": [...]
  }
}
```

---

#### Increment Cart Quantity

Increment the quantity of a cart item by 1.

**Endpoint:** `PUT /api/cart/:cartItemId/increment-quantity`

**Authentication:** Required

**URL Parameters:**
- `cartItemId` - Cart item ID

**Response:**
```json
{
  "cart": {
    "_id": "string",
    "items": [...]
  }
}
```

---

#### Decrement Cart Quantity

Decrement the quantity of a cart item by 1.

**Endpoint:** `PUT /api/cart/:cartItemId/decrement-quantity`

**Authentication:** Required

**URL Parameters:**
- `cartItemId` - Cart item ID

**Response:**
```json
{
  "cart": {
    "_id": "string",
    "items": [...]
  }
}
```

---

#### Delete Cart Item

Remove a single item from the cart.

**Endpoint:** `DELETE /api/cart/:cartItemId`

**Authentication:** Required

**URL Parameters:**
- `cartItemId` - Cart item ID

**Response:**
```json
{
  "message": "Cart has been removed"
}
```

---

#### Delete Multiple Cart Items

Remove multiple items from the cart.

**Endpoint:** `DELETE /api/carts`

**Authentication:** Required

**Request Body:**
```json
{
  "cartItemIds": ["string", "string", ...]
}
```

**Response:**
```json
{
  "message": "Cart has been removed"
}
```

---

### Transaction APIs

#### Create Transaction

Create a new transaction from selected cart items.

**Endpoint:** `POST /api/transaction`

**Authentication:** Required

**Request Body:**
```json
{
  "cartIds": ["string", "string", ...]
}
```

**Response:**
```json
{
  "transactions": [
    {
      "_id": "string",
      "user": {},
      "shop": {},
      "details": [...],
      ...
    }
  ],
  "message": "Transaction has successfully been made"
}
```

---

#### Get Transactions by Shop

Get all transactions for the authenticated user's shop.

**Endpoint:** `GET /api/transaction/shop`

**Authentication:** Required

**Response:**
```json
{
  "transactions": [
    {
      "_id": "string",
      "user": {},
      "details": [...],
      ...
    }
  ]
}
```

---

#### Get Transactions by User

Get all transactions for the authenticated user.

**Endpoint:** `GET /api/transaction`

**Authentication:** Required

**Response:**
```json
{
  "transactions": [
    {
      "_id": "string",
      "shop": {},
      "details": [...],
      ...
    }
  ]
}
```

---

#### Get Transactions with No Review

Get transactions that haven't been reviewed yet.

**Endpoint:** `GET /api/transaction/no-review`

**Authentication:** Required

**Response:**
```json
{
  "transactions": [
    {
      "_id": "string",
      "shop": {},
      "details": [...],
      ...
    }
  ]
}
```

---

#### Get Transactions with Review

Get transactions that have been reviewed.

**Endpoint:** `GET /api/transaction/review`

**Authentication:** Required

**Response:**
```json
{
  "transactions": [
    {
      "_id": "string",
      "shop": {},
      "details": [...],
      "review": {...},
      ...
    }
  ]
}
```

---

### Address APIs

#### Get User Addresses

Get all addresses for the authenticated user.

**Endpoint:** `GET /api/address`

**Authentication:** Required

**Response:**
```json
{
  "addresses": [
    {
      "_id": "string",
      "street": "string",
      "city": "string",
      "postalCode": "string",
      ...
    }
  ]
}
```

---

#### Create Address

Create a new address for the authenticated user.

**Endpoint:** `POST /api/address`

**Authentication:** Required

**Request Body:**
```json
{
  "address": {
    "street": "string",
    "city": "string",
    "postalCode": "string",
    "country": "string",
    ...
  }
}
```

**Response:**
```json
{
  "address": {
    "_id": "string",
    "street": "string",
    ...
  },
  "message": "Address successfully inserted"
}
```

---

#### Update Address

Update an existing address.

**Endpoint:** `PUT /api/address`

**Authentication:** Required

**Request Body:**
```json
{
  "address": {
    "_id": "string",
    "street": "string",
    "city": "string",
    "postalCode": "string",
    ...
  }
}
```

**Response:**
```json
{
  "address": {
    "_id": "string",
    "street": "string",
    ...
  },
  "message": "Address updated"
}
```

---

#### Delete Address

Delete an address.

**Endpoint:** `DELETE /api/address/:addressId`

**Authentication:** Required

**URL Parameters:**
- `addressId` - Address ID

**Response:**
```json
{
  "address": {},
  "message": "Address deleted"
}
```

---

### Chat APIs

#### Get User Chat Rooms

Get all chat rooms for the authenticated user.

**Endpoint:** `GET /api/user-chat-room`

**Authentication:** Required

**Response:**
```json
{
  "chatRooms": [
    {
      "_id": "string",
      "user": {},
      "shop": {},
      ...
    }
  ]
}
```

---

#### Get Shop Chat Rooms

Get all chat rooms for the authenticated user's shop.

**Endpoint:** `GET /api/shop-chat-room`

**Authentication:** Required

**Response:**
```json
{
  "chatRooms": [
    {
      "_id": "string",
      "user": {},
      "shop": {},
      ...
    }
  ]
}
```

---

#### Create Chat Room

Create a new chat room or get existing one.

**Endpoint:** `POST /api/chat-room`

**Authentication:** Required

**Request Body:**
```json
{
  "shopId": "string"
}
```

**Response:**
```json
{
  "chatRoom": {
    "_id": "string",
    "user": {},
    "shop": {},
    ...
  }
}
```

---

#### Get Chat Messages

Get all messages in a chat room.

**Endpoint:** `GET /api/chat/:chatRoomId`

**Authentication:** Required

**URL Parameters:**
- `chatRoomId` - Chat room ID

**Response:**
```json
{
  "chats": [
    {
      "_id": "string",
      "text": "string",
      "sender": {},
      "type": "string",
      ...
    }
  ]
}
```

---

#### Create Chat Message

Send a message in a chat room (also emits WebSocket event).

**Endpoint:** `POST /api/chat`

**Authentication:** Required

**Request Body:**
```json
{
  "text": "string",
  "senderId": "string",
  "chatRoomId": "string",
  "type": "string"
}
```

**Response:**
```json
{
  "chat": ""
}
```

---

### Review APIs

#### Create Review

Create a review for a product.

**Endpoint:** `POST /api/review`

**Authentication:** Required

**Request Body:**
```json
{
  "rating": "number",
  "text": "string",
  "product": "string (product ID)",
  "productVariant": "string (variant ID)",
  "transactionDetail": "string (transaction detail ID)"
}
```

**Response:**
```json
{
  "review": {
    "_id": "string",
    "rating": "number",
    "text": "string",
    ...
  },
  "message": "Review has been submitted"
}
```

---

#### Get Reviews by Product

Get all reviews for a specific product.

**Endpoint:** `GET /api/review/product/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` - Product ID

**Response:**
```json
{
  "reviews": [
    {
      "_id": "string",
      "rating": "number",
      "text": "string",
      "creator": {},
      ...
    }
  ]
}
```

---

#### Get Review Rating

Get average rating and review count for a product.

**Endpoint:** `GET /api/review/rating/product/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` - Product ID

**Response:**
```json
{
  "averageRating": "number",
  "userCount": "number"
}
```

---

## WebSocket Events

The application uses Socket.IO for real-time chat functionality.

### Connection

Connect to the WebSocket server:

```javascript
const socket = io('http://localhost:3000');
```

### Events

#### Receive Message

Emitted when a new message is received in a chat room.

**Event:** `receive_message`

**Data:**
```json
{
  "_id": "string",
  "text": "string",
  "sender": {},
  "chatRoom": "string",
  "type": "string",
  "createdAt": "date"
}
```

**Example:**
```javascript
socket.on('receive_message', (chat) => {
  console.log('New message:', chat);
});
```

---

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

Error responses follow this format:

```json
{
  "message": "Error message description"
}
```

---

## Notes

- All endpoints that require authentication use session-based authentication
- JWT tokens are used for token validation endpoints
- File uploads support up to 50MB
- Pagination defaults: page 1, limit 10 (max 100)
- Session expires after 20 minutes
- WebSocket connections are used for real-time chat functionality

---

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=27017
DB_NAME=your_database_name
SECRET_KEY=your_secret_key
ORIGIN=http://localhost:3000
```

3. Run the application:
```bash
npm run dev
```

4. Seed the database (optional):
```bash
npm run seed
```

---

## License

ISC

