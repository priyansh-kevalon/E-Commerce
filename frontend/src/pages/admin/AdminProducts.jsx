import { useCallback, useEffect, useState } from 'react';
import { Package, PackagePlus, PackageX, Pencil, RotateCcw, Search, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { fetchProducts, fetchCategories } from '../../services/productService.js';
import { createProduct, updateProduct, deleteProduct } from '../../services/adminService.js';
import {
  formatCurrency,
  getDiscountPercent,
  getEffectivePrice,
  getProductImage,
  getStockInfo,
} from '../../utils/helpers.js';

const LIMIT = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState({ type: '', message: '' });
  const [reloadKey, setReloadKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchProducts({
        search: query || undefined,
        category: category || undefined,
        page,
        limit: LIMIT,
        sort: 'newest',
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, category, page, reloadKey]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        await updateProduct(editing._id, payload);
        setNotice({ type: 'success', message: 'Product updated successfully.' });
      } else {
        await createProduct(payload);
        setNotice({ type: 'success', message: 'Product created successfully.' });
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product._id);
      setNotice({ type: 'success', message: 'Product deleted successfully.' });
      loadProducts();
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  const stockPill = (product) => {
    const info = getStockInfo(product.stock);
    if (info.tone === 'danger') return 'bg-red-50 text-red-600 ring-red-200';
    if (info.tone === 'warning') return 'bg-amber-50 text-amber-700 ring-amber-200';
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pagination.total
              ? `${pagination.total} product${pagination.total === 1 ? '' : 's'} in your catalogue`
              : 'Create, edit and remove catalogue items.'}
          </p>
        </div>
        <Button onClick={openCreate}>
          <PackagePlus size={16} /> New product
        </Button>
      </div>

      {notice.message && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-sm ${
            notice.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              notice.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          {notice.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="w-full max-w-sm">
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </form>

        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by category"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <Loader label="Loading products..." />
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <p className="text-sm text-red-600">{loadError}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <RotateCcw size={15} /> Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={22} />
            </span>
            <p className="text-sm text-slate-400">No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-[720px]">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const discount = getDiscountPercent(product);
                  const stock = getStockInfo(product.stock);
                  return (
                    <tr key={product._id} className="group">
                      <td>
                        <div className="flex items-center gap-3.5">
                          <span className="relative shrink-0">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="h-12 w-12 rounded-xl bg-slate-100 object-cover ring-1 ring-slate-200"
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="line-clamp-1 max-w-[15rem] font-semibold text-slate-800">
                              {product.name}
                            </p>
                            {product.brand && (
                              <p className="text-xs text-slate-400">{product.brand}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {formatCurrency(getEffectivePrice(product))}
                          </span>
                          {discount > 0 && (
                            <>
                              <span className="text-xs text-slate-400 line-through">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-inset ring-emerald-200">
                                -{discount}%
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${stockPill(product)}`}
                        >
                          {product.stock === 0 ? (
                            <><PackageX size={12} /> {stock.label}</>
                          ) : (
                            <><span className={`h-1.5 w-1.5 rounded-full ${stock.tone === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} /> {product.stock} {product.stock === 1 ? 'unit' : 'units'}</>
                          )}
                        </span>
                      </td>
                      <td>
                        {product.isFeatured ? (
                          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 ring-1 ring-inset ring-brand-200">
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(product)}
                            aria-label="Edit"
                            className="admin-btn-icon"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            aria-label="Delete"
                            className="admin-btn-icon danger"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Showing page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit product' : 'New product'}
        subtitle={editing ? 'Update your catalogue item' : 'Add to your catalogue'}
        onClose={() => setModalOpen(false)}
        size="lg"
      >
        <ProductForm
          product={editing}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={saving}
          serverError={formError}
        />
      </Modal>
    </div>
  );
}