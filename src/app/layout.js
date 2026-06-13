import "./globals.css";
import Navbar from "@/components/Navbar";
import { WalletProvider } from "@/context/WalletContext";

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>

        <WalletProvider>

          <Navbar />

          {children}

        </WalletProvider>

      </body>
    </html>
  );
}