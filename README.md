# Umuheto Ecommerce Platform

This is a full-stack ecommerce platform built with React (Vite) for both customer-facing and admin dashboards, and Node.js/Express for the backend API.

## Project Structure

```
Ecom/
├── Admin/      # Admin dashboard (React + Vite)
├── backend/    # Backend API (Node.js + Express + MongoDB)
├── frontend/   # Customer-facing frontend (React + Vite)
└── README.md   # Project root README
```

## Features

- **Frontend:** Product browsing, cart, checkout, user authentication, profile, order history, reviews, and more.
- **Admin:** Product/category/type management, order tracking, dashboard analytics, protected routes.
- **Backend:** REST API, JWT authentication, CRUD for products/categories/types/orders/users/reviews, file uploads, and more.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### 1. Backend Setup

```sh
cd Ecom/backend
npm install
# Configure .env with your MongoDB URI and JWT secret
npm start
```

### 2. Frontend Setup

```sh
cd Ecom/frontend
npm install
npm run dev
```

### 3. Admin Setup

```sh
cd Ecom/Admin
npm install
npm run dev
```

### Environment Variables

- **Backend:** See `Ecom/backend/.env` for required variables (e.g., `MONGO_URI`, `JWT_SECRET`, etc.).
- **Frontend/Admin:** See `vite.config.js` for proxy and environment usage.

## Scripts

- `npm run dev` – Start development server (Frontend/Admin)
- `npm start` – Start backend server

## Technologies Used

- **Frontend/Admin:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer
- **Other:** ESLint, PostCSS

## Folder Overview

- `Ecom/frontend/src` – Customer UI components, pages, assets, context
- `Ecom/Admin/src` – Admin dashboard components, pages, assets
- `Ecom/backend` – Express server, controllers, models, routes, middleware

## License

This project is licensed under the MIT License.

---

**Contact:** tresorshingiro26@gmail.com  
**Demo:** _Add deployed links here if available_