"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildErrorUrl, manejarError } from "../utils/ManejarError";
import { API_BASE } from "@/lib/api";

/*
  Página principal del área "admin".
  - Consulta al backend el total de usuarios y categorías.
  - Usa fetch(..., { credentials: 'include' }) para enviar cookies (útil si auth está en cookie HttpOnly).
  - manejarError centraliza redirecciones a /error cuando la respuesta HTTP no es OK.
*/

const URL_USUARIOS = `${API_BASE}/usuarios/admin`;
const URL_CATEGORIAS = `${API_BASE}/categorias`;

const Dashboard = () => {

  const router = useRouter();

  // Estados para mostrar totales y errores
  const [totalUsuarios, setTotalUsuarios] = useState<number | null>(null);
  const [totalCategorias, setTotalCategorias] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Función que carga los datos desde el backend
  const cargarDatos = async () => {
    try {

      // --- Obtener usuarios ---
      const resUsuarios = await fetch(URL_USUARIOS, {
        
        method: "GET",
        credentials: "include",

      });

      // Manejar errores HTTP
      await manejarError(resUsuarios, router);

      // Normalizar distintas formas de respuesta (users, usuarios o array directo)
      const dataUsuarios = await resUsuarios.json();
      const listaUsuarios = dataUsuarios.users || dataUsuarios.usuarios || [];
      setTotalUsuarios(listaUsuarios.length);

      // --- Obtener categorías ---
      const resCategorias = await fetch(URL_CATEGORIAS, {
        
        method: "GET",
        credentials: "include", //Enviar cookies

      });

      // Manejar errores HTTP
      await manejarError(resCategorias, router);

      const dataCategorias = await resCategorias.json();
      const listaCategorias = dataCategorias.categorias || dataCategorias || [];

      if (Array.isArray(listaCategorias)) {

        setTotalCategorias(listaCategorias.length);
      
      } else {

        setError("Error al obtener categorías.");
      
      }

    } catch (error) {

      router.push(buildErrorUrl("network", "No se pudo conectar con el servidor."));

    }
  };

  //Carga los datos al montar el componente
  useEffect(() => {

    cargarDatos();

  }, []);

  //Parte visible
return (
    <div className="min-h-full p-6 md:p-12 text-gray-100 font-sans relative">
      <main className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
            <span className="text-[#F2A931] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Panel de Administración</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight relative inline-block">
                Dashboard<span className="text-[#F2A931]">.</span>
                <span className="absolute -bottom-2 left-0 w-1/3 h-[3px] bg-gradient-to-r from-[#F2A931] to-transparent opacity-80"></span>
            </h1>
        </div>

        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-900/30 border border-red-500/30 text-red-200 backdrop-blur-md shadow-lg font-medium">
            {error}
          </div>
        )}

        <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 ml-1">Datos Generales</h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-[#F2A931] rounded-[2rem] blur opacity-15 group-hover:opacity-25 transition-opacity duration-500"></div>
            <div className="rounded-[2rem] bg-[#0a0f1a]/60 border border-white/5 backdrop-blur-xl p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A931]/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <h3 className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Usuarios</h3>
                <p className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                {totalUsuarios !== null ? totalUsuarios : "…"}
                </p>
                <div className="mt-8 flex items-center">
                    <div className="w-8 h-[1px] bg-[#F2A931]/50 mr-3"></div>
                    <p className="text-xs text-[#F2A931] uppercase tracking-wider font-bold">Personal Registrado</p>
                </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-[#F2A931] rounded-[2rem] blur opacity-15 group-hover:opacity-25 transition-opacity duration-500"></div>
            <div className="rounded-[2rem] bg-[#0a0f1a]/60 border border-white/5 backdrop-blur-xl p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-300">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#1e293b] rounded-full blur-2xl -mr-16 -mb-16"></div>
                <h3 className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Categorías</h3>
                <p className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                {totalCategorias !== null ? totalCategorias : "…"}
                </p>
                <div className="mt-8 flex items-center">
                    <div className="w-8 h-[1px] bg-slate-500 mr-3"></div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Categorías Existentes</p>
                </div>
            </div>
          </div>
        </div>

        <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 ml-1">Acciones Rápidas</h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <button
            onClick={() => router.push("./admin/usuarios")}
            className="group relative overflow-hidden rounded-[2rem] bg-[#F2A931] px-8 py-6 text-[#0a0f1a] font-bold tracking-wide shadow-[0_0_20px_rgba(242,169,49,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,169,49,0.3)] hover:-translate-y-1 focus:outline-none flex items-center justify-between"
          >
            <span className="relative z-10 text-lg">Añadir usuarios</span>
            <svg className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            <div className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>
          </button>

          <button
            onClick={() => router.push("./admin/categorias")}
            className="group relative overflow-hidden rounded-[2rem] bg-[#1e293b]/50 border border-white/5 backdrop-blur-xl px-8 py-6 text-white font-bold tracking-wide shadow-lg transition-all duration-300 hover:bg-[#1e293b]/80 hover:shadow-xl hover:border-white/10 hover:-translate-y-1 focus:outline-none flex items-center justify-between"
          >
            <span className="relative z-10 text-lg">Manejar categorías</span>
            <svg className="w-6 h-6 relative z-10 text-slate-400 transition-transform duration-300 group-hover:translate-x-2 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
