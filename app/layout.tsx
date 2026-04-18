import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./AuthProvider";
import Header from "./Header";

export const metadata: Metadata = {
  title: "Ad Mock Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
