import { Oswald, DM_Sans } from 'next/font/google';
import { PulseProvider } from '@/lib/store';
import './globals.css';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'PULSE — Stadium Operations Platform',
  description: 'Multi-agent AI coordination layer for FIFA World Cup 2026 stadium operations. The stadium\'s heartbeat — sensed everywhere, felt everywhere.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${oswald.variable} ${dmSans.variable}`}>
      <body>
        <PulseProvider>
          {children}
        </PulseProvider>
      </body>
    </html>
  );
}

