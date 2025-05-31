import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "AgroFresh - Farm Fresh Produce",
  description: "Get fresh, locally-grown produce delivered to your doorstep",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
} 