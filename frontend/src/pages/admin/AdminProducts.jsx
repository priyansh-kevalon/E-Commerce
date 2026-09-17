import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { fetchProducts, fetchCategories } from '../../services/productService.js';
import { createProduct, updateProduct, deleteProduct } from '../../services/adminService.js';
import { formatCurrency, getEffectivePrice, getProductImage } from '../../utils/helpers.js';

const LIMIT = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
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
      const data = await fetchProducts({ search: query || undefined, page, limit: LIMIT, sort: 'newest' });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, page, reloadKey]);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Create, edit and remove catalogue items.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> New product
        </Button>
      </div>

      {notice.message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.message}
        </div>
      )}

      <form onSubmit={handleSearch} className="max-w-sm">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </form>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
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
          <p className="px-5 py-10 text-center text-sm text-slate-400">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm md:min-w-full">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Category</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="hidden px-5 py-3 font-medium lg:table-cell">Featured</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg bg-slate-100 object-cover"
                        />
                        <span className="line-clamp-1 max-w-[16rem] font-medium text-slate-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3 text-slate-600 md:table-cell">{product.category?.name || '-'}</td>
                    <td className="px-5 py-3 text-slate-600">{formatCurrency(getEffectivePrice(product))}</td>
                    <td className="px-5 py-3">
                      <span className={product.stock === 0 ? 'font-medium text-red-600' : 'text-slate-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3 lg:table-cell">
                      {product.isFeatured ? (
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">Yes</span>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          aria-label="Edit"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          aria-label="Delete"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!pagination.hasPrevPage} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit product' : 'New product'}
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
