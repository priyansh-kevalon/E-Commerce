import { useCallback, useEffect, useState } from 'react';
import { FolderPlus, FolderTree, Layers, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ModalFooter from '../../components/admin/ModalFooter.jsx';
import CategoryForm from '../../components/admin/CategoryForm.jsx';
import { fetchCategories } from '../../services/productService.js';
import { createCategory, updateCategory, deleteCategory } from '../../services/adminService.js';

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
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">
            {categories.length
              ? `${categories.length} categor${categories.length === 1 ? 'y' : 'ies'} organise your catalogue`
              : 'Organise products into browsable groups.'}
          </p>
        </div>
        <Button onClick={openCreate}>
          <FolderPlus size={16} /> New category
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
          <span className={`h-2 w-2 rounded-full ${notice.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {notice.message}
        </div>
      )}

      {loading ? (
        <Loader label="Loading categories..." />
      ) : loadError ? (
        <div className="admin-card flex flex-col items-center gap-3 px-5 py-10 text-center">
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
        <div className="admin-card flex flex-col items-center gap-3 px-5 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <FolderTree size={26} />
          </span>
          <p className="font-display text-base font-bold text-slate-700">No categories yet</p>
          <p className="max-w-sm text-sm text-slate-400">
            Create your first category to start organising products into browsable groups.
          </p>
          <Button onClick={openCreate} className="mt-2">
            <Plus size={16} /> Create category
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category._id}
              className="admin-card admin-card-hover group flex flex-col overflow-hidden"
            >
              <div className="relative h-28 overflow-hidden bg-slate-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500/15 to-brand-700/25">
                    <FolderTree size={34} className="text-brand-400" />
                  </div>
                )}
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset backdrop-blur ${
                    category.status === 'active'
                      ? 'bg-emerald-50/90 text-emerald-700 ring-emerald-200'
                      : 'bg-slate-100/90 text-slate-500 ring-slate-300'
                  }`}
                >
                  {category.status}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-base font-extrabold tracking-tight text-slate-900">
                  {category.name}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">
                  {category.description || 'No description provided yet.'}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    <Layers size={13} className="text-slate-400" />
                    {category.productCount ?? 0} product{category.productCount === 1 ? '' : 's'}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(category)}
                      aria-label={`Edit ${category.name}`}
                      className="admin-btn-icon"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      aria-label={`Delete ${category.name}`}
                      className="admin-btn-icon danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit category' : 'New category'}
        subtitle={editing ? 'Update this browsable group' : 'Organise your catalogue'}
        icon={<FolderTree size={19} />}
        onClose={() => setModalOpen(false)}
        footer={
          <ModalFooter
            formId="category-form"
            submitting={saving}
            submitLabel={editing ? 'Update category' : 'Create category'}
            onCancel={() => setModalOpen(false)}
          />
        }
      >
        <CategoryForm
          category={editing}
          onSubmit={handleSubmit}
          serverError={formError}
        />
      </Modal>
    </div>
  );
}