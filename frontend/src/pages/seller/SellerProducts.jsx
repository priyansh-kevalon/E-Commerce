import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Clock3,
  Package,
  PackagePlus,
  PackageX,
  Pencil,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ModalFooter from '../../components/admin/ModalFooter.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { fetchCategories } from '../../services/productService.js';
import {
  fetchMyProducts,
  createMyProduct,
  updateMyProduct,
  deleteMyProduct,
} from '../../services/sellerService.js';
import { formatCurrency, getProductImage } from '../../utils/helpers.js';

const LIMIT = 10;

const STATUS_META = {
  pending: { label: 'Pending review', className: 'bg-amber-50 text-amber-700 ring-amber-200', icon: Clock3 },
  approved: { label: 'Live', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: ShieldCheck },
  rejected: { label: 'Rejected', className: 'bg-rose-50 text-rose-700 ring-rose-200', icon: PackageX },
};

export default function SellerProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
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
      const data = await fetchMyProducts({
        search: query || undefined,
        status: status || undefined,
        page,
        limit: LIMIT,
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, status, page, reloadKey]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setEditing(null);
      setFormError('');
      setModalOpen(true);
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
        await updateMyProduct(editing._id, payload);
        setNotice({ type: 'success', message: 'Product updated successfully.' });
      } else {
        await createMyProduct(payload);
        setNotice({ type: 'success', message: 'Product submitted. It goes live after admin approval.' });
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
      await deleteMyProduct(product._id);
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
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pagination.total
              ? `${pagination.total} product${pagination.total === 1 ? '' : 's'} in your store`
              : 'List a product and start selling today.'}
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
              placeholder="Search your products..."
              aria-label="Search products"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </form>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending review</option>
          <option value="approved">Live</option>
          <option value="rejected">Rejected</option>
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
            <Link
              to="/seller/products?create=1"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-700 hover:text-brand-800"
            >
              <ArrowUpRight size={15} /> List your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-[720px]">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const meta = STATUS_META[product.status] || STATUS_META.pending;
                  const Icon = meta.icon;
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
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.className}`}
                        >
                          <Icon size={12} /> {meta.label}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold text-slate-800">
                          {formatCurrency(product.discountPrice > 0 ? product.discountPrice : product.price)}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-slate-600">
                          {product.stock} {product.stock === 1 ? 'unit' : 'units'}
                        </span>
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
        subtitle={
          editing
            ? 'Update your listing'
            : 'Your product will go live after admin approval'
        }
        icon={<Package size={19} />}
        onClose={() => setModalOpen(false)}
        size="lg"
        footer={
          <ModalFooter
            formId="product-form"
            submitting={saving}
            submitLabel={editing ? 'Update product' : 'Create product'}
            onCancel={() => setModalOpen(false)}
          />
        }
      >
        <ProductForm
          product={editing}
          categories={categories}
          onSubmit={handleSubmit}
          serverError={formError}
          sellerMode
        />
      </Modal>
    </div>
  );
}