import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { AdminAuthProvider } from '@/components/auth-context';
import { AuthGate } from '@/components/auth-gate';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FoodRush — Admin Console',
  description: 'Operations dashboard for the FoodRush platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AdminAuthProvider>
          <AuthGate>
            <Sidebar />
            <div className="lg:pl-64">{children}</div>
          </AuthGate>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
