import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/admin/Modal.jsx';
import CategoryForm from '../../components/admin/CategoryForm.jsx';
import { fetchCategories } from '../../services/productService.js';
import { createCategory, updateCategory, deleteCategory } from '../../services/adminService.js';
import { getProductImage } from '../../utils/helpers.js';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState({ type: '', message: '' });
  const [reloadKey, setReloadKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchCategories({ withCount: true });
      setCategories(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [reloadKey]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        await updateCategory(editing._id, payload);
        setNotice({ type: 'success', message: 'Category updated successfully.' });
      } else {
        await createCategory(payload);
        setNotice({ type: 'success', message: 'Category created successfully.' });
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await deleteCategory(category._id);
      setNotice({ type: 'success', message: 'Category deleted successfully.' });
      loadCategories();
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">Organise products into browsable groups.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> New category
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

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        {loading ? (
          <Loader label="Loading categories..." />
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
        ) : categories.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">No categories yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm md:min-w-full">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Description</th>
                  <th className="px-5 py-3 font-medium">Products</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={category.image || getProductImage(null)}
                          alt={category.name}
                          className="h-10 w-10 rounded-lg bg-slate-100 object-cover"
                        />
                        <span className="font-medium text-slate-800">{category.name}</span>
                      </div>
                    </td>
                    <td className="hidden max-w-[18rem] px-5 py-3 md:table-cell">
                      <span className="line-clamp-1 text-slate-600">{category.description || '-'}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{category.productCount ?? '-'}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          category.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          aria-label="Edit"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
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

      <Modal open={modalOpen} title={editing ? 'Edit category' : 'New category'} onClose={() => setModalOpen(false)}>
        <CategoryForm
          category={editing}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={saving}
          serverError={formError}
        />
      </Modal>
    </div>
  );
}
