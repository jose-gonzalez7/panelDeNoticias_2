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
    <div className="min-h-full p-6 md:p-12">
      <main className="max-w-5xl mx-auto">
        <div className="mb-10">
            <span className="text-[#1E3A8A] text-sm font-semibold uppercase mb-2 block">Panel de Editor</span>
            <h1 className="text-4xl text-[#0F172A] font-bold leading-tight">
                Dashboard<span className="text-[#F59E0B]">.</span>
            </h1>
        </div>

        {error && (
            <div className="mb-8 p-4 rounded bg-red-100 border border-red-200 text-red-700 font-medium">
                {error}
            </div>
        )}

        <h2 className="mb-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">Datos Generales</h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 mb-12">
          <div className="bg-white border border-gray-200 rounded-md p-8">
            <h3 className="text-sm font-semibold text-[#64748B] mb-4 uppercase tracking-wider">Publicaciones</h3>
            <p className="text-5xl font-bold text-[#0F172A]">
              {totalPublicaciones !== null ? totalPublicaciones : "…"}
            </p>
            <div className="mt-6 flex items-center gap-2">
                <span className="text-xs text-[#64748B] uppercase font-semibold tracking-wider">Publicaciones creadas</span>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">Acciones Rápidas</h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 mb-12">
          <button
            onClick={() => router.push("/editor/publicaciones")}
            className="bg-[#1E3A8A] text-white rounded-md p-6 font-semibold flex items-center justify-between hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <span className="text-lg">Manejar publicaciones</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">Actividad Reciente</h2>

          {errorActividad && (
            <div className="mb-4 p-4 rounded bg-red-100 border border-red-200 text-red-700 text-sm font-medium">
              {errorActividad}
            </div>
          )}

          <div className="space-y-4">
            {actividades === null && !errorActividad && (
              <div className="p-6 bg-white border border-gray-200 rounded-md text-[#64748B] text-sm">
                Cargando actividad…
              </div>
            )}
            {actividades !== null && actividades.length === 0 && !errorActividad && (
              <div className="p-6 bg-white border border-gray-200 rounded-md text-[#64748B] text-sm">
                Aún no hay actividad registrada en el sistema.
              </div>
            )}
            {actividades?.map((item) => (
              <div
                key={item.id_actividad}
                className="p-6 bg-white border border-gray-200 rounded-md"
              >
                <p className="text-sm text-[#64748B]">
                  <span className="font-semibold text-[#0F172A]">{item.nombre_usuario}</span>
                  <span className="mx-2">—</span>
                  <span>{item.actividad}</span>
                </p>
                <p className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider mt-2">
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
