"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function tituloParaCodigo(code: string): string {
  const lower = code.toLowerCase();
  if (lower === "network") return "Error de conexión";
  if (lower === "auth") return "No se pudo iniciar sesión";
  if (lower === "rol") return "Cuenta no válida para este panel";
  const n = Number.parseInt(code, 10);
  if (Number.isNaN(n)) return "Algo salió mal";
  if (n === 400) return "Solicitud incorrecta";
  if (n === 401) return "Sesión requerida o no válida";
  if (n === 403) return "Acceso denegado";
  if (n === 404) return "No encontrado";
  if (n === 409) return "Conflicto";
  if (n === 422) return "Datos no válidos";
  if (n >= 500) return "Error en el servidor";
  return "Error en la petición";
}

function ContenidoError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "—";
  const msg = searchParams.get("msg")?.trim() ?? "";

  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-[#F2A931] rounded-[2rem] blur opacity-20 transform -rotate-1 pointer-events-none" />
      <div className="relative bg-[#0a0f1a]/70 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2A931] to-transparent opacity-50" />

        <span className="text-[#F2A931] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
          Panel de noticias
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-2">
          {tituloParaCodigo(code)}
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Código: <span className="text-slate-300 font-mono">{code}</span>
        </p>

        {msg ? (
          <div
            className="mb-8 p-5 rounded-2xl bg-red-900/25 border border-red-500/35 text-red-100/95 backdrop-blur-md text-sm leading-relaxed whitespace-pre-wrap break-words"
            role="alert"
          >
            {msg}
          </div>
        ) : (
          <p className="mb-8 text-slate-400 text-sm leading-relaxed">
            No hay un mensaje detallado del servidor. Puedes volver al inicio de sesión o intentar de
            nuevo la acción que falló.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/login"
            className="inline-flex justify-center items-center rounded-2xl bg-[#F2A931] px-6 py-3.5 text-[#0a0f1a] font-bold tracking-wide shadow-[0_0_20px_rgba(242,169,49,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,169,49,0.3)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#F2A931] focus:ring-offset-2 focus:ring-offset-[#0a0f1a]"
          >
            Ir al inicio de sesión
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex justify-center items-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

function CargandoError() {
  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0a0f1a]/50 p-10 text-center text-slate-400">
      Cargando…
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<CargandoError />}>
      <ContenidoError />
    </Suspense>
  );
}
