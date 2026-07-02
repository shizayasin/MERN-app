# StyleHub – MERN E-Commerce Store

StyleHub is a full-stack e-commerce application built with the MERN stack. It includes a modern storefront, cart and checkout flow, secure authentication, favorites, product reviews, and an admin dashboard for managing products, orders, categories, users, and analytics.

## Live Demo

Frontend: https://stylehub-official.netlify.app/

## Features

### Customer Features

- Browse products by category
- Search and filter products
- View product details and reviews
- Add products to cart and favorites
- Secure login and registration
- Complete shipping and checkout flow
- View order history and profile details

### Admin Features

- Admin dashboard overview
- Product management
- Category management
- Order management
- User management
- Sales analytics

### Technical Highlights

- JWT authentication and protected routes
- RESTful API architecture
- MongoDB with Mongoose
- Image upload support
- Responsive UI for desktop and mobile

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, React Router, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer
- Deployment: Netlify for the frontend, Railway or any Node.js hosting platform for the backend

## Prerequisites

- Node.js 18 or later
- MongoDB instance (local or Atlas)

## Installation

```bash
git clone https://github.com/your-username/stylehub.git
cd stylehub
npm install
npm run install-all
```

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Run Locally

Start the full app:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Database Seeding

Seed products only:

```bash
npm run seed:products
```

Seed the full demo dataset:

```bash
npm run seed:all
```

## Build and Test

Build the frontend for production:

```bash
npm run build
```

Run the backend API smoke test:

```bash
npm run test:api
```

## Production Build

Build frontend:

```bash
npm run build
```

Run backend:

```bash
npm start
```

## Deployment

- Frontend build command: `npm run build`
- Frontend publish directory: `frontend/dist`
- Backend start command: `npm start`

Make sure the same environment variables are configured in your deployment platform.

## Project Highlights

- Full MERN stack application
- JWT authentication and authorization
- Redux Toolkit state management
- Responsive UI for mobile and desktop
- Admin dashboard and inventory management
- Complete e-commerce checkout flow
- MongoDB Atlas integration
- Production deployment ready

## Future Improvements

- Stripe payment integration
- JazzCash and Easypaisa support
- Email notifications
- Order tracking timeline
- Product reviews and ratings
- Advanced analytics dashboard

## Author

Shiza Yaseen

Built as a full-stack portfolio project to showcase modern web development skills using React, Node.js, Express, MongoDB, Redux Toolkit, and Tailwind CSS.
