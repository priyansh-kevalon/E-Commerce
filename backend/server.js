import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(
    import.meta.url));

const app = express();

// -------------------- CORS --------------------
// CLIENT_URL may be a single origin or a comma-separated list (e.g. when the
// frontend is deployed to a different domain, like Render).
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
            return callback(null, false);
        },
        credentials: true,
    })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------- Test route --------------------
app.get('/api/health', (req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1;

    res.status(databaseConnected ? 200 : 503).json({
        success: databaseConnected,
        message: databaseConnected
            ? 'E-Commerce API is running'
            : 'Database is not connected',
        database: databaseConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
});

// -------------------- Root (this is an API, not a website) --------------------
app.get('/', (req, res) => {
    res.status(200).type('html').send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Velmora API</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f0f9ff;font-family:ui-sans-serif,system-ui,sans-serif;color:#0f172a}
  .card{max-width:560px;margin:24px;padding:32px;border-radius:24px;background:#fff;box-shadow:0 30px 70px -35px rgba(15,23,42,.6);text-align:left}
  .badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:#ecfeff;color:#0e7490;font-size:13px;font-weight:700}
  .dot{width:9px;height:9px;border-radius:50%;background:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.18)}
  h1{margin:18px 0 6px;font-size:34px;letter-spacing:-.02em}
  p{margin:0 0 18px;color:#475569;line-height:1.6}
  ul{list-style:none;padding:0;margin:0;display:grid;gap:10px}
  li{display:flex;justify-content:space-between;gap:12px;padding:12px 16px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc;font-size:14px}
  code{color:#0369a1;font-weight:700}
  .muted{color:#94a3b8}
</style>
</head>
<body>
<div class="card">
  <span class="badge"><span class="dot"></span> API online</span>
  <h1>Velmora Backend</h1>
  <p>This is the REST API, not the storefront. The website is served separately (e.g. <code>/</code> of your frontend service).</p>
  <ul>
    <li><span>Health check</span><code>/api/health</code></li>
    <li><span>Products</span><code>/api/products</code></li>
    <li><span>Categories</span><code>/api/categories</code></li>
    <li><span>Auth</span><code>/api/auth</code></li>
    <li class="muted"><span>Database</span><span>${process.env.MONGO_URI ? 'MONGO_URI is set' : 'MONGO_URI missing — set it in Render'}</span></li>
  </ul>
</div>
</body>
</html>`);
});

// -------------------- API routes --------------------
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);

// -------------------- 404 handler --------------------
app.use(notFound);

// -------------------- Central error handler --------------------
app.use(errorHandler);

// -------------------- Start server --------------------
const PORT = process.env.PORT || 5000;

const startServer = async() => {
    try {
        await connectDB();
    } catch (err) {
        // The server still starts so the API can respond; database-backed
        // endpoints will surface connection errors individually.
        console.error('Database not reachable - starting API without database...');
    }

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
};

const isMainModule =
    process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(
        import.meta.url);

if (isMainModule) {
    startServer();
}

export { app, startServer };