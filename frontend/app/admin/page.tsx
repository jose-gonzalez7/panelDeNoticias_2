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
    <div className="min-h-full p-6 md:p-12">
      <main className="max-w-5xl mx-auto">
        <div className="mb-10">
            <span className="text-[#1E3A8A] text-sm font-semibold uppercase mb-2 block">Panel de Administración</span>
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
            <h3 className="text-sm font-semibold text-[#64748B] mb-4 uppercase tracking-wider">Usuarios</h3>
            <p className="text-5xl font-bold text-[#0F172A]">
              {totalUsuarios !== null ? totalUsuarios : "…"}
            </p>
            <div className="mt-6 flex items-center gap-2">
                <span className="text-xs text-[#64748B] uppercase font-semibold tracking-wider">Personal Registrado</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-md p-8">
            <h3 className="text-sm font-semibold text-[#64748B] mb-4 uppercase tracking-wider">Categorías</h3>
            <p className="text-5xl font-bold text-[#0F172A]">
              {totalCategorias !== null ? totalCategorias : "…"}
            </p>
            <div className="mt-6 flex items-center gap-2">
                <span className="text-xs text-[#64748B] uppercase font-semibold tracking-wider">Categorías Existentes</span>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">Acciones Rápidas</h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <button
            onClick={() => router.push("./admin/usuarios")}
            className="bg-[#1E3A8A] text-white rounded-md p-6 font-semibold flex items-center justify-between hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <span className="text-lg">Añadir usuarios</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>

          <button
            onClick={() => router.push("./admin/categorias")}
            className="bg-white text-[#1E3A8A] border border-gray-200 rounded-md p-6 font-semibold flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="text-lg">Manejar categorías</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
