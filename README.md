<div align="center">
  <h1>Jomoro Koffee</h1>
</div>

<div align="center">
  <a><img src="https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs"></a>
  <a><img src="https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs"></a>
  <a><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript"></a>
  <a><img src="https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma"></a>
  <a><img src="https://img.shields.io/badge/MariaDB-10.x-FA7C38?logo=mariadb"></a>
</div>

## Description

Jomoro Koffee is a rapidly expanding coffee chain company specializing in high-quality beverages such as espresso series, latte blends, non-coffee drinks, and grab-and-go pastries.

## Documentation

- [Getting Started](#getting-started)
- [Endpoints](#endpoints)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) (v22 or higher)
- [npm](https://www.npmjs.com) or [yarn](https://yarnpkg.com) or [pnpm](https://pnpm.io/id)
- [XAMPP](https://www.apachefriends.org/) (v8 or higher)

### Installation

```bash
git clone https://github.com/charcg/jomoro-koffee.git
cd jomoro-koffee/<service-name>

npm install

cp .env.example .env

npx prisma generate
npx prisma migrate dev
```

### Environment Variables

```
NODE_ENV=
PORT=

AUTH_SERVICE_URL=
PRODUCT_SERVICE_URL=
TRANSACTION_SERVICE_URL=

DATABASE_URL=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

JWT_SECRET=
JWT_EXPIRES_IN=
```

### Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Endpoints

All endpoints return responses using the following standardized format:

```json
{
	"success": true,
	"statusCode": 200,
	"message": "...",
	"data": { ... }
}
```

### Auth (`/auth`)

| Method | Endpoint       | Access |
| ------ | -------------- | ------ |
| `POST` | /auth/register | GUEST  |
| `POST` | /auth/login    | GUEST  |

### Products (`/products`)

| Method | Endpoint             | Access                 |
| ------ | -------------------- | ---------------------- |
| `GET`  | /products            | GUEST, CUSTOMER, ADMIN |
| `GET`  | /products/:productId | GUEST, CUSTOMER, ADMIN |

### Categories (`/categories`)

| Method | Endpoint                         | Access                 |
| ------ | -------------------------------- | ---------------------- |
| `GET`  | /categories                      | GUEST, CUSTOMER, ADMIN |
| `GET`  | /categories/:categoryId/products | GUEST, CUSTOMER, ADMIN |

### Admin (`/admin`)

| Method | Endpoint                          | Access |
| ------ | --------------------------------- | ------ |
| `POST` | /admin/products                   | ADMIN  |
| `POST` | /admin/products/:productId/update | ADMIN  |
| `POST` | /admin/products/:productId/reduce | ADMIN  |
| `POST` | /admin/products/:productId/delete | ADMIN  |

### Cart (`/cart`)

| Method | Endpoint                | Access   |
| ------ | ----------------------- | -------- |
| `GET`  | /cart                   | CUSTOMER |
| `POST` | /cart                   | CUSTOMER |
| `POST` | /cart/:productId/update | CUSTOMER |
| `POST` | /cart/:productId/delete | CUSTOMER |
| `POST` | /cart/clear             | CUSTOMER |

### Orders (`/orders`)

| Method | Endpoint         | Access   |
| ------ | ---------------- | -------- |
| `GET`  | /orders          | CUSTOMER |
| `POST` | /orders          | CUSTOMER |
| `POST` | /orders/:orderId | CUSTOMER |

### Profiles (`/profiles`)

| Method | Endpoint  | Access          |
| ------ | --------- | --------------- |
| `GET`  | /profiles | CUSTOMER, ADMIN |
