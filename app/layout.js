import { PulseProvider } from '@/lib/store';
import './globals.css';

export const metadata = {
  title: 'StadiumOPS Command Center',
  description: 'FIFA World Cup 2026 Stadium Operations Command Center. Predict. Coordinate. Protect.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <PulseProvider>
          {children}
        </PulseProvider>
      </body>
    </html>
  );
}

