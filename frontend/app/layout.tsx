import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Rage Quit Saving",
  description: "Lock it. Hold it. Win it. — A USDC savings pool on Arc Network.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
