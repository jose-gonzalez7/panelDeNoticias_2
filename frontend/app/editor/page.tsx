"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { manejarError } from "@/app/utils/ManejarError";
import { API_BASE } from "@/lib/api";

/*
  Página del dashboard para el rol "editor".
  - Carga el número total de publicaciones desde la API.
  - Usa fetch con credentials: 'include' para enviar cookies/session.
  - manejarError hace redirect si la respuesta indica problema de autenticación/permiso.
*/

const URL_PUBLICACIONES = `${API_BASE}/publicaciones`;
const URL_ACTIVIDAD_PANEL = `${API_BASE}/publicaciones/actividad-reciente-panel`;

type ActividadItem = {
  id_actividad: string;
  id_usuario: string;
  nombre_usuario: string;
  actividad: string;
  fecha: string;
};

function formatRelativeTimeEs(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffSec = Math.round((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 0) {
    return date.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
  }
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  if (diffSec < 60) return rtf.format(-Math.max(diffSec, 1), "second");
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return rtf.format(-diffMin, "minute");
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return rtf.format(-diffHour, "hour");
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return rtf.format(-diffDay, "day");
  return date.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
}

const Dashboard = () => {

  const router = useRouter();

  // Estado: total de publicaciones (null mientras no se carga) y mensaje de error
  const [totalPublicaciones, setTotalPublicaciones] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [actividades, setActividades] = useState<ActividadItem[] | null>(null);
  const [errorActividad, setErrorActividad] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function cargarDashboard() {
      setError("");
      setErrorActividad("");
      setActividades(null);

      try {
        const res = await fetch(URL_PUBLICACIONES, {
          method: "GET",
          credentials: "include",
        });
        await manejarError(res, router);
        const data = await res.json();
        const lista = data.publicaciones || data || [];
        if (!cancelled && res.ok && Array.isArray(lista)) {
          setTotalPublicaciones(lista.length);
        } else if (!cancelled) {
          setError("Error al obtener publicaciones.");
        }
      } catch {
        if (!cancelled) {
          setError("Error de conexión con el servidor.");
        }
      }

      try {
        const res = await fetch(`${URL_ACTIVIDAD_PANEL}?limite=15`, {
          method: "GET",
          credentials: "include",
        });
        if (res.status === 404) {
          if (!cancelled) {
            setErrorActividad(
              "El servidor aún no expone actividad reciente. Despliega la última versión del backend."
            );
            setActividades([]);
          }
          return;
        }
        await manejarError(res, router);
        const data = await res.json();
        if (!cancelled && res.ok && Array.isArray(data)) {
          setActividades(data);
        } else if (!cancelled) {
          setErrorActividad("No se pudo cargar la actividad reciente.");
          setActividades([]);
        }
      } catch {
        if (!cancelled) {
          setErrorActividad("Error de conexión al cargar actividad.");
          setActividades([]);
        }
      }
    }

    void cargarDashboard();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Parte visible

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-12">
      <main>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight relative inline-block mb-12">
          DASHBOARD<span className="text-[#F2A931]">.</span>
          <div className="absolute -bottom-4 left-0 w-1/3 h-1 bg-gradient-to-r from-[#F2A931] to-transparent"></div>
        </h1>

        {error && (
            <div className="mb-8 p-5 rounded-[1.5rem] bg-red-900/30 border border-red-500/30 text-red-200 backdrop-blur-md shadow-lg font-medium text-center">
                {error}
            </div>
        )}

        <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-[#F2A931] rounded-full mr-3 border border-white/20"></span>
            Datos Generales
        </h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-[#F2A931] rounded-[2rem] blur opacity-15 group-hover:opacity-25 transition-opacity duration-500"></div>
            <div className="rounded-[2rem] bg-[#0a0f1a]/60 border border-white/5 backdrop-blur-xl p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A931]/5 rounded-full blur-2xl pointer-events-none"></div>
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#F2A931] mb-2">Publicaciones</h3>
              <p className="text-6xl font-black text-white relative z-10">
                {totalPublicaciones !== null ? totalPublicaciones : <span className="text-[#1e293b]">…</span>}
              </p>
              <p className="text-sm text-slate-400 mt-4 font-medium">Publicaciones creadas</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-[#F2A931] rounded-full mr-3 border border-white/20"></span>
            Acciones Rápidas
        </h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 mb-12">
          <button
            onClick={() => router.push("/editor/publicaciones")}
            className="w-full relative overflow-hidden rounded-[2rem] bg-[#F2A931] px-8 py-6 text-[#0a0f1a] font-black tracking-[0.2em] uppercase text-sm shadow-[0_0_20px_rgba(242,169,49,0.15)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(242,169,49,0.4)] hover:-translate-y-1 focus:outline-none group/action"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Manejar publicaciones
              <svg className="w-5 h-5 transition-transform duration-300 group-hover/action:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/action:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-[#F2A931] rounded-full mr-3 border border-white/20"></span>
            Actividad Reciente
          </h2>

          {errorActividad && (
            <div className="mb-4 p-4 rounded-2xl bg-red-900/20 border border-red-500/20 text-red-200 text-sm">
              {errorActividad}
            </div>
          )}

          <div className="space-y-4">
            {actividades === null && !errorActividad && (
              <div className="rounded-2xl border border-white/5 bg-[#1e293b]/30 backdrop-blur-md p-5 text-slate-400 text-sm">
                Cargando actividad…
              </div>
            )}
            {actividades !== null && actividades.length === 0 && !errorActividad && (
              <div className="rounded-2xl border border-white/5 bg-[#1e293b]/30 backdrop-blur-md p-5 text-slate-400 text-sm">
                Aún no hay actividad registrada en el sistema.
              </div>
            )}
            {actividades?.map((item) => (
              <div
                key={item.id_actividad}
                className="rounded-2xl border border-white/5 bg-[#1e293b]/30 backdrop-blur-md p-5 shadow-lg group hover:bg-[#1e293b]/50 transition-colors"
              >
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-white">{item.nombre_usuario}</span>
                  <span className="text-slate-400"> — </span>
                  <span>{item.actividad}</span>
                </p>
                <p className="text-[11px] font-bold text-[#F2A931] uppercase tracking-widest mt-2">
                  {formatRelativeTimeEs(item.fecha)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
