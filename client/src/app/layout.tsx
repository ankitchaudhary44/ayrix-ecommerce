import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConditionalLayout } from '@/components/ConditionalLayout';

export const metadata: Metadata = {
  title: 'AYRIX | AI-Powered Fashion Fit & Return Prevention Engine',
  description: 'Production fashion fit confidence engine and return risk reduction platform combining physical body geometry, garment tolerances, stretch physics, and AI synthesis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans" suppressHydrationWarning>
        <GoogleOAuthProvider clientId="1002027739205-r7k13ltcb9t59fjr7u9mngnviutpujgm.apps.googleusercontent.com">
          <ThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <AuthProvider>
                  <ConditionalLayout>
                    {children}
                  </ConditionalLayout>
                </AuthProvider>
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
