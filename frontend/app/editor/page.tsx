"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { manejarError } from "@/app/utils/ManejarError";

/*
  Página del dashboard para el rol "editor".
  - Carga el número total de publicaciones desde la API.
  - Usa fetch con credentials: 'include' para enviar cookies/session.
  - manejarError hace redirect si la respuesta indica problema de autenticación/permiso.
*/

const URL_PUBLICACIONES = "https://servidorpanelnoticias-production.up.railway.app/api/publicaciones";

const Dashboard = () => {

  const router = useRouter();

  // Estado: total de publicaciones (null mientras no se carga) y mensaje de error
  const [totalPublicaciones, setTotalPublicaciones] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Función que solicita la lista de publicaciones al backend
  const cargarPublicaciones = async () => {

    try {

      const res = await fetch(URL_PUBLICACIONES, {

        method: "GET",
        credentials: "include", // enviar cookies

      });

      // Manejo centralizado de errores/respuestas
      manejarError(res, router);

      const data = await res.json();

      // El backend puede devolver directamente un array o envolver en 'publicaciones'
      const lista = data.publicaciones || data || [];

      if (res.ok && Array.isArray(lista)) {

        setTotalPublicaciones(lista.length); // Guardar cantidad de publicaciones

      } else {

        setError("Error al obtener publicaciones.");

      }
    } catch (err) { // Error de red u otros

      setError("Error de conexión con el servidor.");

    }

  };

  useEffect(() => { // Al montar el componente, cargar publicaciones
    cargarPublicaciones();

  }, []);

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

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-[#1e293b]/30 backdrop-blur-md p-5 shadow-lg group hover:bg-[#1e293b]/50 transition-colors">
              <p className="text-sm text-slate-300">
                <span className="font-bold text-white">Roberto</span> añadió una publicación.
              </p>
              <p className="text-[11px] font-bold text-[#F2A931] uppercase tracking-widest mt-2">Hace 2 minutos</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#1e293b]/30 backdrop-blur-md p-5 shadow-lg group hover:bg-[#1e293b]/50 transition-colors">
              <p className="text-sm text-slate-300">
                Se actualizaron las <span className="font-bold text-white">publicaciones</span> del sistema.
              </p>
              <p className="text-[11px] font-bold text-[#F2A931] uppercase tracking-widest mt-2">Hace 10 minutos</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#1e293b]/30 backdrop-blur-md p-5 shadow-lg group hover:bg-[#1e293b]/50 transition-colors">
              <p className="text-sm text-slate-300">
                <span className="font-bold text-white">Roberto</span> eliminó una publicación.
              </p>
              <p className="text-[11px] font-bold text-[#F2A931] uppercase tracking-widest mt-2">Hoy a las 11:45</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
