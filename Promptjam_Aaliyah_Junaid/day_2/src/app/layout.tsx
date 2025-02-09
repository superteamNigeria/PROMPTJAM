import './globals.css';
import { Inter } from 'next/font/google';
import { WalletConnectionProvider } from '../components/WalletConnectionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Solana Token Manager',
  description: 'Create and airdrop Solana tokens',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConnectionProvider>{children}</WalletConnectionProvider>
      </body>
    </html>
  );
}
