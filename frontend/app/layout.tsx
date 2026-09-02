import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediSA - AI Clinical Triage & Healthcare Platform',
  description: 'AI-powered conversational triage, clinical report governance, and appointment scheduling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
