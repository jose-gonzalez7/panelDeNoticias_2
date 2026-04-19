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
    <div className="w-full max-w-lg">
      <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <span className="text-[#1E3A8A] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
          Panel de noticias
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] leading-tight mb-2">
          {tituloParaCodigo(code)}
        </h1>
        <p className="text-[#64748B] text-sm mb-6 font-medium">
          Código: <span className="text-[#0F172A] font-mono">{code}</span>
        </p>

        {msg ? (
          <div
            className="mb-8 p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium"
            role="alert"
          >
            {msg}
          </div>
        ) : (
          <p className="mb-8 text-[#64748B] text-sm leading-relaxed font-medium">
            No hay un mensaje detallado del servidor. Puedes volver al inicio de sesión o intentar de
            nuevo la acción que falló.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/login"
            className="inline-flex justify-center items-center rounded-md bg-[#1E3A8A] px-6 py-2.5 text-white font-medium transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2"
          >
            Ir al inicio de sesión
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-[#64748B] font-medium transition-colors hover:bg-gray-50 focus:outline-none cursor-pointer"
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
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-10 text-center text-[#64748B] font-medium shadow-sm">
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
