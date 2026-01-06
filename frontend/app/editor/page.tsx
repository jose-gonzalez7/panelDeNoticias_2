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
    <div>
      <main>
        <h1 className="mb-4 text-xl md:text-2xl">DASHBOARD</h1>

        {error && <p className="text-red-600">{error}</p>}

        <h2 className="mb-4 text-xl md:text-1xl">Datos Generales</h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {/* Tarjeta de Publicaciones */}
          <div className="rounded-lg bg-white p-6 shadow-md border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Publicaciones</h3>
            <p className="text-3xl font-bold text-gray-900">
              {totalPublicaciones !== null ? totalPublicaciones : "…"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Publicaciones creadas</p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <h2 className="mb-4 text-xl md:text-1xl">Acciones rápidas</h2>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <button
            onClick={() => router.push("/editor/publicaciones")}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition"
          >
            Manejar publicaciones
          </button>
        </div>

        {/* Actividad reciente (ficticia está habra que cambiarla) */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Actividad Reciente</h2>

          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">Roberto</span> añadió una publicación.
              </p>
              <p className="text-xs text-gray-400 mt-1">Hace 2 minutos</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                Se actualizaron las <span className="font-medium text-indigo-600">publicaciones</span> del sistema.
              </p>
              <p className="text-xs text-gray-400 mt-1">Hace 10 minutos</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-green-600">Roberto</span> eliminó una publicación.
              </p>
              <p className="text-xs text-gray-400 mt-1">Hoy a las 11:45</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
