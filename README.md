
# StyleHub – MERN E-Commerce Store

🚀 A full-stack MERN e-commerce application featuring customer shopping, secure authentication, order management, admin controls, and a modern responsive UI.

## Live Demo

🌐 Frontend: [https://stylehub-official.netlify.app/](https://stylehub-official.netlify.app/)

## Features

### Customer Features

* Browse products by category
* Product search and filtering
* Product details page
* Add to Cart functionality
* Favorites/Wishlist support
* Secure user authentication
* Shipping and checkout flow
* Review order before placing
* Order history and tracking
* Responsive mobile-friendly design

### Admin Features

* Admin dashboard
* Product management 
* Category management
* Order management
* User management
* Sales analytics overview

### Security & Backend

* JWT Authentication
* Protected Routes
* Role-based Access Control
* MongoDB Database
* RESTful API Architecture
* Image Upload Support
* API Health Monitoring

---

## Tech Stack

### Frontend

* React
* Vite
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer

### Deployment

* Netlify (Frontend)
* Railway (Backend)
* MongoDB Atlas (Database)

---

## Checkout Flow

```text
Cart
 ↓
Shipping
 ↓
Payment
 ↓
Review Order
 ↓
Place Order
 ↓
Order Details
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/stylehub.git
cd stylehub
```

### Install Dependencies

```bash
npm install
npm run install-all
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

## Run Locally

Start frontend and backend together:

```bash
npm run dev
```

Backend:

```bash
http://localhost:5000
```

Frontend:

```bash
http://localhost:5173
```

---

## Database Seeding

Seed products:

```bash
npm run seed:products
```

Seed complete demo data:

```bash
npm run seed:all
```

---

## Production Build

Build frontend:

```bash
npm run build
```

Run backend:

```bash
npm start
```

---

## API Testing

```bash
node backend/testAPI.mjs
```

---

## Project Highlights

✅ Full MERN Stack Application

✅ JWT Authentication & Authorization

✅ Redux Toolkit State Management

✅ Responsive UI for Mobile & Desktop

✅ Admin Dashboard & Inventory Management

✅ Complete E-Commerce Checkout Flow

✅ MongoDB Atlas Integration

✅ Production Deployment Ready

---

## Future Improvements

* Stripe Payment Integration
* JazzCash & Easypaisa Support
* Email Notifications
* Order Tracking Timeline
* Product Reviews & Ratings
* Advanced Analytics Dashboard

---

## Author

**Shiza Yaseen**

Built as a full-stack MERN portfolio project to demonstrate modern web development skills using React, Node.js, Express, MongoDB, Redux Toolkit, and Tailwind CSS.
