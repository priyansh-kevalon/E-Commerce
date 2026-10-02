import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { app } from './server.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Notification from './models/Notification.js';
import Order from './models/Order.js';

dotenv.config({ path: '.env' });

const PORT = 5099;
const BASE = `http://127.0.0.1:${PORT}`;
const marker = 'ZZTMP-statustoggle';
const server = app.listen(PORT);
await connectDB();

let pass = 0;
let fail = 0;
const ok = (label, cond, extra = '') => {
  if (cond) {
    pass += 1;
    console.log(`  PASS  ${label}`);
  } else {
    fail += 1;
    console.log(`  FAIL  ${label} ${extra}`);
  }
};

const made = { users: [], products: [] };
const tok = (id) => jwt.sign({ id, tv: 0 }, process.env.JWT_SECRET, { expiresIn: '1d' });

const call = async (method, path, token, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let json = null;
  try { json = await res.json(); } catch { json = null; }
  return { status: res.status, body: json };
};

try {
  const password = await bcrypt.hash('Tmp!Pass123', 10);
  const admin = await User.create({
    name: `Tmp ${marker} admin`, email: `${marker}-admin@example.com`, password, role: 'admin',
  });
  made.users.push(admin._id);
  const seller = await User.create({
    name: `Tmp ${marker} seller`, email: `${marker}-seller@example.com`, password, role: 'seller',
  });
  made.users.push(seller._id);
  const adminToken = tok(admin._id);
  const category = await Category.findOne();

  const mkProduct = async (status) => {
    const p = await Product.create({
      name: `${marker} Widget ${Math.random().toString(36).slice(2, 7)}`,
      description: 'temp product for status toggle verification',
      price: 999,
      category: category._id,
      images: [],
      stock: 5,
      status,
      seller: seller._id,
    });
    made.products.push(p._id);
    return p;
  };

  console.log('\n1. status validation (the 500 -> 400 fix)');
  const victim = await mkProduct('pending');
  const bogus = await call('PUT', `/api/products/${victim._id}`, adminToken, { status: 'banana' });
  ok('invalid status rejected with 400', bogus.status === 400, `got ${bogus.status}`);
  ok('error message is helpful', /pending, approved, rejected/.test(bogus.body?.message || ''), JSON.stringify(bogus.body?.message));
  const afterBogus = await Product.findById(victim._id).lean();
  ok('product status untouched after bad request', afterBogus.status === 'pending', `status=${afterBogus.status}`);

  const emptyStatus = await call('PUT', `/api/products/${victim._id}`, adminToken, { status: '' });
  ok('empty status rejected with 400', emptyStatus.status === 400, `got ${emptyStatus.status}`);
  const nullStatus = await call('PUT', `/api/products/${victim._id}`, adminToken, { status: null });
  ok('null status rejected with 400', nullStatus.status === 400, `got ${nullStatus.status}`);

  console.log('\n2. pending -> approved (the "Live" button)');
  await new Promise((r) => setTimeout(r, 300));
  const approve = await call('PUT', `/api/products/${victim._id}`, adminToken, { status: 'approved' });
  ok('approve accepted (200)', approve.status === 200, `got ${approve.status} ${JSON.stringify(approve.body?.message)}`);
  ok('response echoes new status', approve.body?.data?.product?.status === 'approved');
  await new Promise((r) => setTimeout(r, 400));
  const live = await Product.findById(victim._id).lean();
  ok('persisted as approved', live.status === 'approved');
  const sellerLive = await Notification.findOne({ user: seller._id, type: 'product_status', body: new RegExp(marker) });
  ok('seller told product is live', Boolean(sellerLive), sellerLive?.body);
  const publicList = await call('GET', '/api/products?limit=100', null);
  ok('approved product visible on storefront', (publicList.body?.data?.products || []).some((p) => p._id === String(victim._id)));

  console.log('\n3. approved -> rejected (the "Reject" button)');
  const reject = await call('PUT', `/api/products/${victim._id}`, adminToken, { status: 'rejected' });
  ok('reject accepted (200)', reject.status === 200, `got ${reject.status}`);
  await new Promise((r) => setTimeout(r, 400));
  const dead = await Product.findById(victim._id).lean();
  ok('persisted as rejected', dead.status === 'rejected');
  const sellerRej = await Notification.findOne({ user: seller._id, type: 'product_status', body: new RegExp(marker) });
  ok('seller told product was rejected', Boolean(sellerRej), sellerRej?.body);
  const afterReject = await call('GET', '/api/products?limit=100', null);
  ok('rejected product hidden from storefront', !(afterReject.body?.data?.products || []).some((p) => p._id === String(victim._id)));
  const adminList = await call('GET', '/api/products?limit=100&status=rejected', adminToken);
  ok('admin still sees rejected product', (adminList.body?.data?.products || []).some((p) => p._id === String(victim._id)));

  console.log('\n4. rejected -> approved (reversible, no duplicate alerts)');
  const restore = await call('PUT', `/api/products/${victim._id}`, adminToken, { status: 'approved' });
  ok('re-approve accepted (200)', restore.status === 200, `got ${restore.status}`);
  await new Promise((r) => setTimeout(r, 400));
  const relive = await Product.findById(victim._id).lean();
  ok('back to approved', relive.status === 'approved');
  const again = await call('GET', '/api/products?limit=100', null);
  ok('visible on storefront again', (again.body?.data?.products || []).some((p) => p._id === String(victim._id)));

  console.log('\n5. idempotence: setting the same status again is a no-op');
  const before = (await Notification.find({ type: 'product_status', user: seller._id }).length);
  const same = await call('PUT', `/api/products/${victim._id}`, adminToken, { status: 'approved' });
  ok('same-status update accepted (200)', same.status === 200, `got ${same.status}`);
  await new Promise((r) => setTimeout(r, 400));
  const after2 = (await Notification.find({ type: 'product_status', user: seller._id }).length);
  ok('no duplicate seller notification', after2 === before, `${before} -> ${after2}`);

  console.log('\n6. admin-only guard still holds');
  const asSeller = await call('PUT', `/api/products/${victim._id}`, tok(seller._id), { status: 'rejected' });
  ok('seller cannot change status (403)', asSeller.status === 403, `got ${asSeller.status}`);

  console.log('\n7. store product (no seller) rejection does not 500');
  const storeProduct = await mkProduct('approved');
  storeProduct.seller = undefined;
  await storeProduct.save();
  const storeReject = await call('PUT', `/api/products/${storeProduct._id}`, adminToken, { status: 'rejected' });
  ok('store product reject accepted (200)', storeReject.status === 200, `got ${storeReject.status} ${JSON.stringify(storeReject.body?.message)}`);
  const storeDead = await Product.findById(storeProduct._id).lean();
  ok('store product persisted as rejected', storeDead.status === 'rejected');
} catch (e) {
  fail += 1;
  console.log('  ERROR', e.message);
} finally {
  console.log('\nCLEANUP');
  await Product.deleteMany({ _id: { $in: made.products } });
  const removed = await Notification.deleteMany({ $or: [{ title: new RegExp(marker, 'i') }, { body: new RegExp(marker, 'i') }] });
  await User.deleteMany({ _id: { $in: made.users } });
  const liveUsers = (await User.find().select('_id')).map((u) => u._id);
  const orphan = await Notification.deleteMany({ user: { $nin: liveUsers } });
  console.log(`  products removed: ${made.products.length}`);
  console.log(`  notifications removed: ${removed.deletedCount + orphan.deletedCount}`);
  console.log(`  users: ${await User.countDocuments()}`);
  console.log(`  products: ${await Product.countDocuments()}`);
  console.log(`  orders: ${await Order.countDocuments()}`);
  console.log(`  notifications: ${await Notification.countDocuments()}`);
  server.close();
  await mongoose.connection.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
