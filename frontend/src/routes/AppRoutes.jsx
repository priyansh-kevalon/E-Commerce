import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import SellerLayout from '../layouts/SellerLayout.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';

const Home = lazy(() => import('../pages/Home.jsx'));
const Products = lazy(() => import('../pages/Products.jsx'));
const Deals = lazy(() => import('../pages/Deals.jsx'));
const ProductDetails = lazy(() => import('../pages/ProductDetails.jsx'));
const About = lazy(() => import('../pages/About.jsx'));
const Contact = lazy(() => import('../pages/Contact.jsx'));
const Cart = lazy(() => import('../pages/Cart.jsx'));
const Wishlist = lazy(() => import('../pages/Wishlist.jsx'));
const Checkout = lazy(() => import('../pages/Checkout.jsx'));
const MyOrders = lazy(() => import('../pages/MyOrders.jsx'));
const OrderDetails = lazy(() => import('../pages/OrderDetails.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts.jsx'));
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories.jsx'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders.jsx'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers.jsx'));
const AdminCoupons = lazy(() => import('../pages/admin/AdminCoupons.jsx'));
const SellerDashboard = lazy(() => import('../pages/seller/SellerDashboard.jsx'));
const SellerProducts = lazy(() => import('../pages/seller/SellerProducts.jsx'));
const SellerOrders = lazy(() => import('../pages/seller/SellerOrders.jsx'));

function RequireAuth({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Loader fullScreen label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RequireAdmin({ children }) {
  const { user, isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Loader fullScreen label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RequireSeller({ children }) {
  const { user, isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Loader fullScreen label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullScreen label="Loading page..." />}>
      <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/new-arrivals" element={<Products preset="new-arrivals" />} />
        <Route path="/best-sellers" element={<Products preset="best-sellers" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <MyOrders />
            </RequireAuth>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <RequireAuth>
              <OrderDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="coupons" element={<AdminCoupons />} />
      </Route>

      <Route
        path="/seller"
        element={
          <RequireSeller>
            <SellerLayout />
          </RequireSeller>
        }
      >
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="orders" element={<SellerOrders />} />
      </Route>
      </Routes>
    </Suspense>
  );
}
