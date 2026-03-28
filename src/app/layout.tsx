import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Causes.com 3D Tunnel",
  description: "Immersive 3D scrolling experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden m-0 p-0`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
