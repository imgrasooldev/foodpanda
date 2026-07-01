import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Apple,
  Play,
} from 'lucide-react';

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: 'FoodRush',
    links: ['About Us', 'Careers', 'Blog', 'Newsroom', 'Investor Relations'],
  },
  {
    title: 'Get Help',
    links: ['Help Center', 'Restaurants Near You', 'FAQs', 'Contact Us', 'Track Your Order'],
  },
  {
    title: 'Partner With Us',
    links: ['Become a Rider', 'Add Your Restaurant', 'Business Account', 'Advertise With Us'],
  },
  {
    title: 'Legal',
    links: ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Refund Policy'],
  },
];

// Wire the links we have real pages for; the rest are placeholders.
const LINK_HREF: Record<string, string> = {
  'Help Center': '/help',
  FAQs: '/help',
  'Contact Us': '/help',
  'Track Your Order': '/orders',
  'Restaurants Near You': '/',
  'Terms & Conditions': '/terms',
  'Privacy Policy': '/privacy',
  'Refund Policy': '/terms',
};
const hrefFor = (label: string) => LINK_HREF[label] ?? '#';

const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot', 'Gujranwala', 'Bahawalpur',
];

const SOCIALS = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Linkedin, label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand + apps */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lg">
                🛵
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                Food<span className="text-brand">Rush</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-muted">
              Pakistan&apos;s favourite food delivery — order from the best
              restaurants near you, delivered fast.
            </p>

            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-gray-400">
              Get the app
            </p>
            <div className="mt-2 flex gap-2">
              <button className="flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90">
                <Apple className="h-4 w-4" /> App Store
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90">
                <Play className="h-4 w-4" /> Google Play
              </button>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-bold">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={hrefFor(link)}
                      className="text-sm text-ink-muted transition hover:text-brand"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cities */}
        <div className="mt-10 border-t border-gray-100 pt-6">
          <h3 className="mb-3 text-sm font-bold">We deliver in</h3>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {CITIES.map((city) => (
              <Link
                key={city}
                href="#"
                className="text-sm text-ink-muted transition hover:text-brand"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-sm text-ink-muted">
            © {new Date().getFullYear()} FoodRush Technologies (Pvt) Ltd. All
            rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <Link
                key={label}
                href="#"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-brand hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
