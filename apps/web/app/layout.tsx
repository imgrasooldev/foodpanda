import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart-context';
import { AuthProvider } from '@/components/auth-context';
import { OrdersProvider } from '@/components/orders-context';
import { AuthModal } from '@/components/auth-modal';
import { PartnerBar } from '@/components/partner-bar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FoodRush — Food delivery, fast',
  description:
    'Order from your favourite restaurants and get it delivered to your door.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <OrdersProvider>
            <CartProvider>
              <PartnerBar />
              <Header />
              {children}
              <Footer />
              <CartDrawer />
              <AuthModal />
            </CartProvider>
          </OrdersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
