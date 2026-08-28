"use client";

import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("nav");
  const params = useParams();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const locale = params.locale as string;

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  const currentLang = languages.find((l) => l.code === locale);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="text-2xl font-bold text-indigo-600">
              CoWork
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href={`/${locale}`}
                className="text-gray-900 hover:text-indigo-600 px-3 py-2"
              >
                {t("home")}
              </Link>
              <Link
                href={`/${locale}/restaurants`}
                className="text-gray-900 hover:text-indigo-600 px-3 py-2"
              >
                {t("restaurants")}
              </Link>
              <Link
                href={`/${locale}/restaurants/add`}
                className="text-gray-900 hover:text-indigo-600 px-3 py-2"
              >
                {t("addRestaurant")}
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Globe size={20} />
                <span>{currentLang?.flag}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={switchLocale(lang.code)}
                      onClick={() => setLangMenuOpen(false)}
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/login`}
              className="text-gray-900 hover:text-indigo-600 px-3 py-2"
            >
              {t("login")}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {t("register")}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href={`/${locale}`}
              className="block px-3 py-2 text-gray-900 hover:bg-gray-100"
            >
              {t("home")}
            </Link>
            <Link
              href={`/${locale}/restaurants`}
              className="block px-3 py-2 text-gray-900 hover:bg-gray-100"
            >
              {t("restaurants")}
            </Link>
            <Link
              href={`/${locale}/login`}
              className="block px-3 py-2 text-gray-900 hover:bg-gray-100"
            >
              {t("login")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
