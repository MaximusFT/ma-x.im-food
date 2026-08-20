import type { Metadata, Viewport } from 'next';
import { AppShell } from '@/components/AppShell';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://food.ma-x.im';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Рецепты — ma-x.im',
  description: 'Личная библиотека домашних рецептов и удобный список покупок.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Рецепты — ma-x.im',
    description: 'Выбирайте блюда, меняйте порции и собирайте покупки без ручных подсчётов.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Рецепты ma-x.im',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Рецепты ma-x.im' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Рецепты — ma-x.im',
    description: 'Выбирайте блюда и получайте готовый список покупок.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
