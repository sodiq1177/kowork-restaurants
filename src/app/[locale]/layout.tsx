import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CoWork - Restaurant Reviews",
  description: "Discover and review restaurants in Uzbekistan",
};

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>&copy; 2026 CoWork Restaurant Reviews</p>
      </footer>
    </NextIntlClientProvider>
  );
}
