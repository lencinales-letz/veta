"use client";

import { useState } from "react";
import { mockForgotPassword } from "@/lib/mockAuth";
import { Mail, ArrowLeft, Send, Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("ada@example.com");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      await mockForgotPassword({ email });
      setStatus("sent");
      setMessage("Si el correo existe, te enviaremos instrucciones para recuperar tu contraseña.");
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message);
    }
  }

  return (
    <AuthShell title="Recupera tu contraseña" subtitle="Te enviaremos un enlace para restablecerla">
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

        {message && (
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${status === "error" ? "border-red-200/60 bg-red-50/60 text-red-700" : "border-emerald-200/60 bg-emerald-50/60 text-emerald-700"}`}
          >
            {message}
          </div>
        )}

        <div className="flex items-center justify-between">
          <a href="/login" className="inline-flex items-center gap-2 text-sm text-sky-600 hover:underline">
            <ArrowLeft className="size-4" /> Volver a iniciar sesión
          </a>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B63F6] text-white px-5 py-2.5 font-medium shadow hover:bg-[#0955d1] disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Enviando…
            </>
          ) : (
            <>
              Enviar enlace <Send className="size-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}


