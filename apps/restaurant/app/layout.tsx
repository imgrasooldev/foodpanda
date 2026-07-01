import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { VendorAuthProvider } from '@/components/auth-context';
import { AuthGate } from '@/components/auth-gate';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FoodRush — Partner Portal',
  description: 'Manage orders and your menu on FoodRush.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <VendorAuthProvider>
          <AuthGate>
            <Sidebar />
            <div className="lg:pl-64">{children}</div>
          </AuthGate>
        </VendorAuthProvider>
      </body>
    </html>
  );
}
