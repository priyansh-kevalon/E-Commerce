import { useCallback, useEffect, useState } from 'react';
import { BadgePercent, CalendarDays, Pencil, Plus, RotateCcw, Tag, Trash2, Truck } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ModalFooter from '../../components/admin/ModalFooter.jsx';
import CouponForm from '../../components/admin/CouponForm.jsx';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/adminService.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

const TYPE_STYLES = {
  percentage: 'bg-brand-50 text-brand-700 ring-brand-200',
  fixed: 'bg-sky-50 text-sky-700 ring-sky-200',
  shipping: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const TYPE_ICONS = {
  percentage: Tag,
  fixed: Tag,
  shipping: Truck,
};

const discountLabel = (coupon) => {
  if (coupon.type === 'percentage') {
    const label = `${coupon.value}% off`;
    return coupon.maxDiscount > 0 ? `${label} (max ${formatCurrency(coupon.maxDiscount)})` : label;
  }
  if (coupon.type === 'fixed') return `${formatCurrency(coupon.value)} off`;
  return 'Free shipping';
};

const statusOf = (coupon) => {
  if (!coupon.isActive) {
    return { label: 'Paused', className: 'bg-slate-100 text-slate-600 ring-slate-300' };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { label: 'Expired', className: 'bg-red-50 text-red-600 ring-red-200' };
  }
  return { label: 'Active', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' };
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState({ type: '', message: '' });
  const [reloadKey, setReloadKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [reloadKey]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        await updateCoupon(editing._id, payload);
        setNotice({ type: 'success', message: 'Coupon updated successfully.' });
      } else {
        await createCoupon(payload);
        setNotice({ type: 'success', message: 'Coupon created successfully.' });
      }
      setModalOpen(false);
      loadCoupons();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon "${coupon.code}"?`)) return;
    try {
      await deleteCoupon(coupon._id);
      setNotice({ type: 'success', message: 'Coupon deleted successfully.' });
      loadCoupons();
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Coupons</h1>
          <p className="mt-1 text-sm text-slate-500">
            {coupons.length
              ? `${coupons.length} coupon${coupons.length === 1 ? '' : 's'} ready to drive sales`
              : 'Create discount codes that shoppers can apply at checkout.'}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> New coupon
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
        <Loader label="Loading coupons..." />
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
      ) : coupons.length === 0 ? (
        <div className="admin-card flex flex-col items-center gap-3 px-5 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <BadgePercent size={26} />
          </span>
          <p className="font-display text-base font-bold text-slate-700">No coupons yet</p>
          <p className="max-w-sm text-sm text-slate-400">
            Create a percentage, fixed-amount or free-shipping coupon and start rewarding your
            customers.
          </p>
          <Button onClick={openCreate} className="mt-2">
            <Plus size={16} /> Create coupon
          </Button>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">Discount</th>
                  <th className="px-6 py-3.5">Min order</th>
                  <th className="px-6 py-3.5">Usage</th>
                  <th className="px-6 py-3.5">Expires</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((coupon) => {
                  const status = statusOf(coupon);
                  const Icon = TYPE_ICONS[coupon.type] || Tag;
                  return (
                    <tr key={coupon._id} className="group transition hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${
                              TYPE_STYLES[coupon.type] || TYPE_STYLES.percentage
                            }`}
                          >
                            <Icon size={15} />
                          </span>
                          <div className="min-w-0">
                            <p className="font-mono text-sm font-extrabold tracking-widest text-slate-900">
                              {coupon.code}
                            </p>
                            {coupon.description && (
                              <p className="max-w-[200px] truncate text-xs text-slate-400">
                                {coupon.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {discountLabel(coupon)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {coupon.minOrder > 0 ? formatCurrency(coupon.minOrder) : 'No minimum'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {coupon.usedCount}
                        <span className="text-slate-400"> / {coupon.usageLimit > 0 ? coupon.usageLimit : '∞'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {coupon.expiresAt ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={13} className="text-slate-400" />
                            {formatDate(coupon.expiresAt)}
                          </span>
                        ) : (
                          <span className="text-slate-400">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(coupon)}
                            aria-label={`Edit ${coupon.code}`}
                            className="admin-btn-icon"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(coupon)}
                            aria-label={`Delete ${coupon.code}`}
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
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit coupon' : 'New coupon'}
        subtitle={editing ? 'Update this offer' : 'Create a discount code'}
        icon={<BadgePercent size={19} />}
        size="lg"
        onClose={() => setModalOpen(false)}
        footer={
          <ModalFooter
            formId="coupon-form"
            submitting={saving}
            submitLabel={editing ? 'Update coupon' : 'Create coupon'}
            onCancel={() => setModalOpen(false)}
          />
        }
      >
        <CouponForm
          coupon={editing}
          onSubmit={handleSubmit}
          serverError={formError}
        />
      </Modal>
    </div>
  );
}