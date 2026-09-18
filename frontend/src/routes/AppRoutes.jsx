import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import Loader from '../components/common/Loader.jsx';
import Home from '../pages/Home.jsx';
import Products from '../pages/Products.jsx';
import ProductDetails from '../pages/ProductDetails.jsx';
import About from '../pages/About.jsx';
import Contact from '../pages/Contact.jsx';
import Cart from '../pages/Cart.jsx';
import Wishlist from '../pages/Wishlist.jsx';
import Checkout from '../pages/Checkout.jsx';
import MyOrders from '../pages/MyOrders.jsx';
import OrderDetails from '../pages/OrderDetails.jsx';
import Profile from '../pages/Profile.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import NotFound from '../pages/NotFound.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminProducts from '../pages/admin/AdminProducts.jsx';
import AdminCategories from '../pages/admin/AdminCategories.jsx';
import AdminOrders from '../pages/admin/AdminOrders.jsx';
import AdminUsers from '../pages/admin/AdminUsers.jsx';
import { useAuth } from '../hooks/useAuth.js';

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

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/deals" element={<Products preset="deals" />} />
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
      </Route>
    </Routes>
  );
}
