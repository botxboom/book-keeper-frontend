import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookVault - Library Management System",
  description:
    "A comprehensive book and author management system with GraphQL integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ApolloWrapper>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="pb-12">{children}</main>
            </div>
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
