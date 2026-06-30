import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "./components/layout/Layout";
import Loader from "./components/ui/Loader";

// ======================= PUBLIC PAGES =======================
const Home = lazy(() => import("./pages/public/Home"));
const Shop = lazy(() => import("./pages/public/Shop"));
const Cart = lazy(() => import("./pages/public/Cart"));
const Checkout = lazy(() => import("./pages/public/Checkout"));
const Payment = lazy(() => import("./pages/public/Payment"));
const Shipping = lazy(() => import("./pages/public/Shipping"));
const PlaceOrder = lazy(() => import("./pages/public/PlaceOrder"));
const ProductDetails = lazy(() => import("./pages/public/ProductDetails"));
const Profile = lazy(() => import("./pages/public/Profile"));
const Order = lazy(() => import("./pages/public/MyOrder"));
const OrderHistory = lazy(() => import("./pages/public/OrderHistory"));
const Favorite = lazy(() => import("./pages/public/Favorite"));
const Category = lazy(() => import("./pages/public/Category"));
const PrivacyPolicy = lazy(() => import("./pages/public/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/public/TermsOfService"));
const Support = lazy(() => import("./pages/public/Support"));

// ======================= AUTH PAGES =======================
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));

// ======================= ADMIN PAGES =======================
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const Products = lazy(() => import("./pages/Admin/AllProducts"));
const ProductCreate = lazy(() => import("./pages/Admin/ProductCreate"));
const ProductEdit = lazy(() => import("./pages/Admin/ProductUpdate"));
const CategoryList = lazy(() => import("./pages/Admin/CategoryList"));
const Analytics = lazy(() => import("./pages/Admin/Analytics"));
const Orders = lazy(() => import("./pages/Admin/Orders"));
const Reviews = lazy(() => import("./pages/Admin/Reviews"));
const Users = lazy(() => import("./pages/Admin/Users"));
const UserEdit = lazy(() => import("./pages/Admin/UserEdit"));

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-slate-800 space-y-2">
    <h1 className="text-4xl font-black tracking-tight text-slate-900">
      404
    </h1>
    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
      Page Not Found
    </p>
  </div>
);

// Admin Route Protection
const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/category" element={<Category />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/support" element={<Support />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <Products />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/product/create"
            element={
              <AdminRoute>
                <ProductCreate />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/product/edit/:id"
            element={
              <AdminRoute>
                <ProductEdit />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <Reviews />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <Orders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <AdminRoute>
                <Orders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users/:id/edit"
            element={
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <CategoryList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
