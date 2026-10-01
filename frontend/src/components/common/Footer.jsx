import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { APP_NAME, SUPPORT_CONTACT } from '../../utils/constants.js';

const COLUMNS = [
  {
    title: 'Get to Know Us',
    links: [
      { label: 'About Velmora', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Careers', to: '/' },
      { label: 'Help Centre', to: '/contact' },
    ],
  },
  {
    title: 'Shop with Us',
    links: [
      { label: 'All Products', to: '/products' },
      { label: "Today's Deals", to: '/deals' },
      { label: 'New Arrivals', to: '/new-arrivals' },
      { label: 'Best Sellers', to: '/best-sellers' },
    ],
  },
  {
    title: 'Your Account',
    links: [
      { label: 'Your Orders', to: '/orders' },
      { label: 'Your Cart', to: '/cart' },
      { label: 'Your Wishlist', to: '/wishlist' },
      { label: 'Sign In', to: '/login' },
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      { label: 'Shipping & Delivery', to: '/deals' },
      { label: 'Returns & Replacements', to: '/orders' },
      { label: 'Payment Methods', to: '/checkout' },
      { label: 'Track Your Order', to: '/orders' },
    ],
  },
];

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zm-1.291 19.494h2.039L6.486 3.24H4.298z" />
  </svg>
);

const SOCIALS = [
  {
    icon: FacebookIcon,
    label: 'Facebook',
    href: 'https://www.facebook.com',
    className: 'bg-[#1877F2] hover:bg-[#166FE5]',
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    href: 'https://www.instagram.com',
    className: 'bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf] hover:brightness-110',
  },
  {
    icon: XIcon,
    label: 'X',
    href: 'https://x.com',
    className: 'bg-black hover:bg-neutral-800',
  },
];

const PAYMENTS = ['VISA', 'Mastercard', 'RuPay', 'UPI', 'Net Banking', 'COD'];

export default function Footer() {
  return (
    <footer>
      <div className="h-1 w-full animate-gradient bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 bg-[length:200%_auto]" />

      <div className="bg-soft-promo text-slate-600">
        <div className="mx-auto max-w-[1280px] px-6 py-14">
          <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[1fr_2fr] lg:gap-x-16">
            <div className="flex flex-col gap-7">
              <Link to="/" className="flex items-end w-fit">
                <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
                  {APP_NAME}
                </span>
                <span className="mb-[3px] ml-0.5 text-xs font-semibold text-accent-500">.in</span>
              </Link>

              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2.5">
                  <MapPin size={16} /> Ahmedabad, India
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={16} /> {SUPPORT_CONTACT.phone}
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={16} /> {SUPPORT_CONTACT.email}
                </li>
              </ul>

              <div className="flex items-center gap-3">
                {SOCIALS.map(({ icon: Icon, label, href, className }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md transition duration-300 hover:-translate-y-0.5 ${className}`}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-14 gap-y-10 lg:grid-cols-4">
              {COLUMNS.map((column) => (
                <div key={column.title}>
                  <h3 className="text-sm font-bold text-slate-900">{column.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="text-sm text-slate-600 transition hover:text-brand-600 hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/80">
          <div className="mx-auto flex max-w-[1280px] flex-col-reverse items-center justify-between gap-4 px-6 py-6 lg:flex-row">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PAYMENTS.map((payment) => (
                <span
                  key={payment}
                  className="rounded border border-slate-200/80 bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-600"
                >
                  {payment}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}