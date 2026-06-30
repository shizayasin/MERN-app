# StyleHub MERN Store

A production-ready MERN e-commerce app with customer shopping flow, admin inventory management, authentication, payments, and file uploads.

## What is included

- Customer storefront and product browsing
- Cart, favorites, checkout, and order history
- Admin dashboard for products, categories, orders, and analytics
- JWT authentication and protected routes
- Image upload support and API health checks

## Tech stack

- Frontend: React, Vite, Redux Toolkit, React Router, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- Deployment: Netlify for frontend, Railway or any Node host for backend

## Local development

1. Install dependencies:

```bash
npm install
npm run install-all
```

2. Create a backend `.env` file in the project root with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=super-long-secret-key-at-least-24-chars
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

3. Start both servers:

```bash
npm run dev
```

This runs the backend with `nodemon` and the frontend with Vite.

## Database seeding

- Seed products only:

```bash
npm run seed:products
```

- Seed full demo data (categories, products, users, orders):

```bash
npm run seed:all
```

## Build and test

Build the frontend for production:

```bash
npm run build
```

Run the backend API test script:

```bash
node backend/testAPI.mjs
```

## Deployment

### Backend

- Start command: `npm start`
- This runs `node backend/index.js`
- Set the same environment variables in your host provider

### Frontend

- Build command: `npm run build`
- Publish directory: `frontend/dist`

### Railway

- Build command: `npm run build`
- Start command: `npm start`
- Ensure `MONGO_URI`, `JWT_SECRET`, and any frontend URL/CORS variables are configured in Railway environment settings

## Notes

- The root `npm run dev` command is for local development only.
- Production should use the built frontend assets and the backend start command.
