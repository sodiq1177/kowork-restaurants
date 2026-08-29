"use client";

import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Globe,
  Menu,
  X,
  UtensilsCrossed,
  LogIn,
  UserPlus,
  LogOut,
  Shield,
  Heart,
  MapPin,
  PlusCircle,
  User,
  Compass,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const t = useTranslations("nav");
  const params = useParams();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/") || `/${newLocale}`;
  };

  const isActive = (path: string) => {
    if (path === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/60 py-2.5"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 group-hover:shadow-orange-500/30 transition-all duration-300">
                <UtensilsCrossed className="text-white" size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent group-hover:opacity-90 transition">
                  CoWork
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500/80 -mt-1 flex items-center gap-1">
                  Taste & Connect <Sparkles size={10} />
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href={`/${locale}`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(`/${locale}`)
                    ? "bg-orange-50 text-orange-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t("home")}
              </Link>
              <Link
                href={`/${locale}/restaurants`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${
                  isActive(`/${locale}/restaurants`) && !pathname.includes("/restaurants/add")
                    ? "bg-orange-50 text-orange-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Compass size={16} />
                {t("restaurants")}
              </Link>
              <Link
                href={`/${locale}/nearby`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${
                  isActive(`/${locale}/nearby`)
                    ? "bg-orange-50 text-orange-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <MapPin size={16} className="text-orange-500" />
                {t("nearby")}
              </Link>
              <Link
                href={`/${locale}/favorites`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${
                  isActive(`/${locale}/favorites`)
                    ? "bg-orange-50 text-orange-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Heart size={16} className="text-rose-500" />
                {t("favorites")}
              </Link>
              <Link
                href={`/${locale}/restaurants/add`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${
                  isActive(`/${locale}/restaurants/add`)
                    ? "bg-orange-50 text-orange-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <PlusCircle size={16} className="text-emerald-500" />
                {t("addRestaurant")}
              </Link>
              {session?.user?.role === "ADMIN" && (
                <Link
                  href={`/${locale}/admin`}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all duration-200 inline-flex items-center gap-1.5 ${
                    isActive(`/${locale}/admin`)
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-purple-700 bg-purple-50 hover:bg-purple-100"
                  }`}
                >
                  <Shield size={15} />
                  {t("admin")}
                </Link>
              )}
            </nav>
          </div>

          {/* Right Actions: Language & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-sm font-medium transition cursor-pointer"
              >
                <Globe size={16} className="text-slate-500" />
                <span className="text-base leading-none">{currentLang.flag}</span>
                <span className="text-xs font-bold text-slate-800">{currentLang.name}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                    Tilni tanlang / Select Language
                  </div>
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={switchLocale(lang.code)}
                      onClick={() => setLangMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                        lang.code === locale
                          ? "bg-orange-500 text-white font-bold shadow-xs"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                      {lang.code === locale && <span className="text-xs">✓</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {status === "loading" ? (
              <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse" />
            ) : session?.user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/profile`}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-50/70 hover:bg-orange-100/80 border border-orange-200/60 text-slate-800 text-sm font-semibold transition"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center text-xs font-bold">
                    {session.user.name ? session.user.name.charAt(0).toUpperCase() : <User size={12} />}
                  </div>
                  <span className="max-w-[120px] truncate">{session.user.name || t("profile")}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title={t("logout")}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/login`}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition"
                >
                  <LogIn size={16} />
                  {t("login")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:scale-[1.02]"
                >
                  <UserPlus size={16} />
                  {t("register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            <Link
              href={`/${locale}`}
              className={`block px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                isActive(`/${locale}`)
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              href={`/${locale}/restaurants`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                isActive(`/${locale}/restaurants`) && !pathname.includes("/restaurants/add")
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass size={18} className="text-orange-500" />
              {t("restaurants")}
            </Link>
            <Link
              href={`/${locale}/nearby`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                isActive(`/${locale}/nearby`)
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <MapPin size={18} className="text-orange-500" />
              {t("nearby")}
            </Link>
            <Link
              href={`/${locale}/favorites`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                isActive(`/${locale}/favorites`)
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart size={18} className="text-rose-500" />
              {t("favorites")}
            </Link>
            <Link
              href={`/${locale}/restaurants/add`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                isActive(`/${locale}/restaurants/add`)
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <PlusCircle size={18} className="text-emerald-500" />
              {t("addRestaurant")}
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href={`/${locale}/admin`}
                className="flex items-center gap-2 px-4 py-2.5 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl font-bold text-sm transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield size={18} className="text-purple-600" />
                {t("admin")}
              </Link>
            )}
            {session?.user && (
              <Link
                href={`/${locale}/profile`}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-800 hover:bg-orange-50 rounded-xl font-semibold text-sm transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} className="text-orange-500" />
                {session.user.name || t("profile")}
              </Link>
            )}
          </div>

          {/* Languages in mobile drawer */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Til / Language
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <Link
                  key={lang.code}
                  href={switchLocale(lang.code)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
                    lang.code === locale
                      ? "bg-orange-500 text-white font-bold shadow-xs"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth in mobile drawer */}
          <div className="pt-3 border-t border-slate-100">
            {session?.user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  void handleSignOut();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 font-bold text-sm rounded-xl hover:bg-rose-100 transition cursor-pointer"
              >
                <LogOut size={18} />
                <span>{t("logout")}</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/${locale}/login`}
                  className="flex items-center justify-center px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("login")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm rounded-xl hover:from-orange-600 hover:to-rose-600 transition shadow-md shadow-orange-500/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
