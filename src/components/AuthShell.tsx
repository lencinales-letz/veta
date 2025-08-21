import { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  leftTitle?: string;
  leftDescription?: string;
  children: ReactNode;
};

export default function AuthShell({ title, subtitle, leftTitle = "VETA: Conciliación de facturas con IA", leftDescription = "Automatiza la conciliación de facturas a gran escala conectando ERPs y sistemas de facturación. Detecta discrepancias, acelera aprobaciones y audita con IA.", children }: AuthShellProps) {
  return (
    <div className="min-h-[100svh] bg-[linear-gradient(180deg,#f5f7fb_0%,#edf3ff_100%)] dark:bg-[linear-gradient(180deg,#0d0f14_0%,#0a0b0f_100%)] flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-6xl">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-20 -left-16 size-[220px] rounded-[48px] bg-[#9db7ff] opacity-50 blur-[60px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 size-[240px] rounded-[60px] bg-[#b6e3ff] opacity-50 blur-[70px]" />

        {/* Mockup panel */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[28px] bg-white/90 dark:bg-white/5 shadow-[0_30px_80px_-40px_rgba(16,24,40,0.35)] ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
            <div className="h-full p-10 flex flex-col">
              <div className="h-[420px] rounded-[22px] bg-[radial-gradient(120%_110%_at_0%_0%,#a5d8ff_0%,transparent_60%),radial-gradient(110%_110%_at_100%_0%,#c7d2fe_0%,transparent_60%)]" />
              <div className="mt-8">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">{leftTitle}</h2>
                <p className="mt-3 text-gray-600 dark:text-gray-300">{leftDescription}</p>
                <div className="mt-10 flex items-center gap-6 text-sm text-gray-500">
                  <div className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" /> Integración ERP</div>
                  <div className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-indigo-500" /> Detección con IA</div>
                  <div className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-sky-500" /> Automatización</div>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between pt-8 text-sm text-gray-500">
                <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm hover:bg-gray-50">
                  <span>🇪🇸</span> <span>Español</span> <span className="text-gray-400">▾</span>
                </button>
                <div className="flex items-center gap-6">
                  <a href="#" className="hover:underline text-[#0B63F6]">Términos</a>
                  <a href="#" className="hover:underline text-[#0B63F6]">Planes</a>
                  <a href="#" className="hover:underline text-[#0B63F6]">Contáctanos</a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-b from-[#c7d2fe]/60 to-[#93c5fd]/60 blur-2xl opacity-60" />
            <div className="relative rounded-[28px] bg-white shadow-[0_20px_80px_-40px_rgba(16,24,40,0.4)] ring-1 ring-black/5 p-8">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


