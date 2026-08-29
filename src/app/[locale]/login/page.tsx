"use client";

import { useState, Suspense } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { UtensilsCrossed, LogIn, Lock, Mail, ArrowRight } from "lucide-react";

function LoginForm() {
  const t = useTranslations("auth");
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || "en";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error === "Configuration"
            ? "Server vaqtincha band. Qayta urinib ko'ring."
            : "Email yoki parol noto'g'ri kiritildi."
        );
      } else {
        router.push(searchParams.get("callbackUrl") || `/${locale}`);
      }
    } catch {
      setError("Tizimga kirishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/70 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
          {/* Brand Icon */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mx-auto mb-4">
              <UtensilsCrossed className="text-white" size={28} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t("loginTitle") || "Hisobga kirish"}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-medium">
              CoWork hisobingiz orqali sevimli maskanlaringizni boshqaring
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t("email") || "Email pochta"}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-medium"
                  placeholder="admin@cowork.uz"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t("password") || "Parol"}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all cursor-pointer text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{t("submit") || "Kirish"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Demo Accounts Notice */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 text-center">
              <span className="font-bold text-slate-700">Test uchun:</span> admin@cowork.uz / admin123
            </div>

            <div className="text-center pt-2">
              <Link
                href={`/${locale}/register`}
                className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition"
              >
                {t("dontHaveAccount") || "Hisobingiz yo'qmi? Ro'yxatdan o'tish"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
