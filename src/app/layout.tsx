import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PortDeck — Portfolio CMS',
  description:
    'A modern portfolio project manager. Create, curate, and publish your work with a clean, backend-first CMS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
