import type { Metadata } from 'next';
import './globals.css';
import { MainHeader } from '@/components/layout/MainHeader';
import { MainFooter } from '@/components/layout/MainFooter';
import { WhatsAppFloatingButton } from '@/components/layout/WhatsAppFloatingButton';
import { MarketingTrackers } from '@/components/marketing/MarketingTrackers';
import { AbandonedCartRecoveryBar } from '@/components/marketing/AbandonedCartRecoveryBar';
import { env } from '@/config/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default:
      'MenteLúdica | Juegos Educativos, Rompecabezas, Juegos de Mesa y Regalos Personalizados en Perú',
    template: '%s | MenteLúdica Perú',
  },
  description:
    'Juega, aprende y crea momentos inolvidables. Tienda especializada en juegos de construcción, rompecabezas de madera y personalizados, juegos de mesa y souvenirs en Arequipa con envíos a todo el Perú.',
  keywords: [
    'juegos educativos Perú',
    'rompecabezas Arequipa',
    'rompecabezas personalizados Perú',
    'juegos de mesa familiares Perú',
    'bloques de construcción Arequipa',
    'regalos personalizados en Perú',
    'souvenirs corporativos Arequipa',
    'MenteLúdica',
  ],
  openGraph: {
    title: 'MenteLúdica – Aprendizaje y Diversión (Arequipa & Perú)',
    description:
      'Juega, aprende y crea momentos inolvidables. Juegos educativos, rompecabezas, juegos de mesa y regalos personalizados en Perú.',
    locale: 'es_PE',
    type: 'website',
    siteName: 'MenteLúdica Perú',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PE">
      <body className="min-h-screen flex flex-col bg-brand-neutral-50 text-brand-navy font-sans">
        <MarketingTrackers />
        <MainHeader />
        <div className="flex-1 flex flex-col">{children}</div>
        <MainFooter />
        <AbandonedCartRecoveryBar />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
