"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { manejarError } from "../utils/ManejarError";

/*
  Página principal del área "admin".
  - Consulta al backend el total de usuarios y categorías.
  - Usa fetch(..., { credentials: 'include' }) para enviar cookies (útil si auth está en cookie HttpOnly).
  - manejarError centraliza redirecciones a /error cuando la respuesta HTTP no es OK.
*/

const URL_USUARIOS = "https://servidorpanelnoticias-production.up.railway.app/api/usuarios/admin";
const URL_CATEGORIAS = "https://servidorpanelnoticias-production.up.railway.app/api/categorias";

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
      manejarError(resUsuarios, router);

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
      manejarError(resCategorias, router);

      const dataCategorias = await resCategorias.json();
      const listaCategorias = dataCategorias.categorias || dataCategorias || [];

      if (Array.isArray(listaCategorias)) {

        setTotalCategorias(listaCategorias.length);
      
      } else {

        setError("Error al obtener categorías.");
      
      }

    } catch (error) {

      router.push("/error?code=network");

    }
  };

  //Carga los datos al montar el componente
  useEffect(() => {

    cargarDatos();

  }, []);

  //Parte visible
  return (
    <div>
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">DASHBOARD</h1>

        {error && <p className="text-red-600">{error}</p>}

        <h2 className="mb-4 text-xl md:text-1xl">Datos Generales</h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Usuarios</h3>
            <p className="text-3xl font-bold text-gray-900">
              {totalUsuarios !== null ? totalUsuarios : "…"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Usuarios registrados</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">Categorías</h3>
            <p className="text-3xl font-bold text-gray-900">
              {totalCategorias !== null ? totalCategorias : "…"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Categorías activas</p>
          </div>
        </div>

        <h2 className="mb-4 text-xl md:text-1xl">Acciones rápidas</h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <button
            onClick={() => router.push("./admin/usuarios")}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition"
          >
            Añadir usuarios
          </button>

          <button
            onClick={() => router.push("./admin/categorias")}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition"
          >
            Manejar categorías
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
