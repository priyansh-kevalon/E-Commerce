import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { APP_NAME } from '../../utils/constants.js';

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

const SOCIALS = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
];

const PAYMENTS = ['VISA', 'Mastercard', 'RuPay', 'UPI', 'Net Banking', 'COD'];

export default function Footer() {
  return (
    <footer>
      <div className="h-1 w-full animate-gradient bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 bg-[length:200%_auto]" />

      <div className="bg-ink text-slate-300">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-end w-fit">
              <span className="font-display text-lg font-extrabold tracking-tight text-white">
                {APP_NAME}
              </span>
              <span className="mb-[3px] ml-0.5 text-[11px] font-semibold text-accent-400">.in</span>
            </Link>

            <ul className="space-y-2 text-xs text-slate-300">
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
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-brand-700 hover:to-brand-900 hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-[13px] font-bold text-white">{column.title}</h3>
                <ul className="mt-2 space-y-1.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-xs text-slate-300 transition hover:text-white hover:underline"
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

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1200px] flex-col-reverse items-center gap-3 px-6 py-4 lg:flex-row lg:justify-between">
            <p className="text-[11px] text-slate-400">
              &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {PAYMENTS.map((payment) => (
                <span
                  key={payment}
                  className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300"
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