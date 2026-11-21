import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MultiCloud Solution Studio',
  description: 'Estúdio visual multicloud para construir, explicar e apresentar arquiteturas tecnológicas ao vivo.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
