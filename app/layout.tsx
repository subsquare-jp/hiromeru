import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./AuthProvider";
import AuthButtons from "./AuthButtons";
import HomeButton from "./HomeButton";

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
          <HomeButton />
          <AuthButtons />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
