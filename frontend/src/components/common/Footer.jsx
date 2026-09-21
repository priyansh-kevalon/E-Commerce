import { Link } from 'react-router-dom';
import { Cpu, Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { APP_NAME } from '../../utils/constants.js';

const COLUMNS = [
  {
    title: 'Get to Know Us',
    links: [
      { label: 'About Velmora', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Careers', to: '/' },
      { label: 'Press Releases', to: '/' },
      { label: 'Corporate Information', to: '/' },
    ],
  },
  {
    title: 'Shop with Us',
    links: [
      { label: 'All Products', to: '/products' },
      { label: "Today's Deals", to: '/deals' },
      { label: 'New Arrivals', to: '/new-arrivals' },
      { label: 'Best Sellers', to: '/best-sellers' },
      { label: 'Your Wishlist', to: '/wishlist' },
    ],
  },
  {
    title: 'Your Account',
    links: [
      { label: 'Your Account', to: '/profile' },
      { label: 'Your Orders', to: '/orders' },
      { label: 'Your Cart', to: '/cart' },
      { label: 'Sign In', to: '/login' },
      { label: 'Create Account', to: '/register' },
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      { label: 'Shipping & Delivery', to: '/deals' },
      { label: 'Returns & Replacements', to: '/orders' },
      { label: 'Payment Methods', to: '/checkout' },
      { label: 'Help Centre', to: '/contact' },
      { label: 'Track Your Order', to: '/orders' },
    ],
  },
];

const SOCIALS = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
];

const PAYMENTS = ['VISA', 'Mastercard', 'RuPay', 'UPI', 'Net Banking', 'COD'];

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="h-1 w-full animate-gradient bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 bg-[length:200%_auto]" />

      <div className="bg-ink text-slate-300">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold text-white">{column.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-slate-300 transition hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-6 py-8 lg:flex-row lg:justify-between">
            <Link to="/" className="flex items-end">
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                {APP_NAME}
              </span>
              <span className="mb-[3px] ml-0.5 text-[11px] font-semibold text-accent-400">.in</span>
            </Link>

            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-slate-300">
              <li className="flex items-center gap-2">
                <MapPin size={14} /> Ahmedabad, India
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} /> +91 90000 00000
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} /> support@velmora.com
              </li>
            </ul>

            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-brand-700 hover:to-brand-900 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1200px] flex-col-reverse items-center gap-4 px-6 py-6 lg:flex-row lg:justify-between">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PAYMENTS.map((payment) => (
                <span
                  key={payment}
                  className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300"
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
