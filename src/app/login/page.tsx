"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockLogin } from "@/lib/mockAuth";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import GoogleIcon from "@/components/icons/GoogleIcon";
import AppleIcon from "@/components/icons/AppleIcon";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ada@example.com");
  const [password, setPassword] = useState("secret123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await mockLogin({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Inicia sesión" subtitle="Accede a VETA para conciliar facturas con IA">
      <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium">Correo</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 focus-within:ring-2 ring-sky-400">
                    <Mail className="size-4 opacity-60" />
                    <input
                      type="email"
                className="w-full bg-transparent outline-none placeholder:text-black/40"
            placeholder="correo@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Contraseña</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 focus-within:ring-2 ring-sky-400">
                    <Lock className="size-4 opacity-60" />
                    <input
                      type="password"
                className="w-full bg-transparent outline-none placeholder:text-black/40"
                placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </label>

                {error && (
                  <div className="rounded-lg border border-red-200/60 bg-red-50/60 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <a href="/forgot-password" className="text-sm text-sky-600 hover:underline">¿Olvidaste tu contraseña?</a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B63F6] text-white px-5 py-2.5 font-medium shadow hover:bg-[#0955d1] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Ingresando…
                    </>
                  ) : (
                    <>
                      Ingresar
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
        <div className="flex items-center gap-3 pt-2 text-sm text-gray-500">
          <div className="h-px flex-1 bg-gray-200" />
          or with
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
            <GoogleIcon /> Sign in with Google
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
            <AppleIcon /> Sign in with Apple
          </button>
        </div>
      </form>
    </AuthShell>
  );
}


