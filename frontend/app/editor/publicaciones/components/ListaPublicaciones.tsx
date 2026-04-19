"use client";

import React, { useEffect, useState } from "react";
import EliminarPublicacion from "./EliminarPublicacion";
import FormularioModificarPublicacion from "./FormularioModificarPublicacion";
import FormularioPublicacion from "./FormularioPublicacion";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE, API_ORIGIN } from "@/lib/api";

/*
  ListaPublicaciones.tsx
  - Componente que muestra, crea, edita y elimina publicaciones.
  - Usa fetch con credentials: 'include' para enviar cookies/session al backend.
  - manejarError redirige a /error si la respuesta HTTP no es OK.
*/

const URL = `${API_BASE}/publicaciones`;

// Interfaz de la estructura de la publicación
interface Publicacion {
  id_publicacion: string;
  titulo: string;
  cuerpo: string;
  id_categoria: string;
  fecha_inicio: string;
  fecha_fin: string;
  prioridad: string;
  adjuntos: string;
  etiquetas: string;
}

// Formatea una fecha ISO a dd/mm/aaaa para mostrar en la tabla
function formatearFecha(fecha: string) {

  const d = new Date(fecha);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const año = d.getFullYear();
  return `${dia}/${mes}/${año}`;

}

/*
  Componente principal:
  - carga la lista de publicaciones al montarse.
  - muestra estado de carga/errores.
  - permite abrir formularios de creación y modificación y confirmar eliminación.
*/

// Obtiene y muestra la lista de publicaciones
const ListaPublicaciones = () => {

  const router = useRouter();

  // Estado local
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]); // Lista de publicaciones
  const [cargando, setCargando] = useState(true); // Indica si se está esperando una respuesta
  const [error, setError] = useState(""); // Almacena los mensajes de error
  const [publicacionEditando, setPublicacionEditando] = useState<Publicacion | null>(null); // Publicación que está siendo editada
  const [publicacionEliminando, setPublicacionEliminando] = useState<Publicacion | null>(null); // Publicación que está siendo eliminada

  // Solicita la lista de publicaciones al servidor
  const fetchPublicaciones = async () => {

    setCargando(true);
    setError("");

    try {

      // Solicitud al servidor para obtener las publicaciones
      const res = await fetch(URL, {

        method: "GET",
        credentials: "include", // enviar cookies
      
      });

      // Maneja errores HTTP
      await manejarError(res, router);

      // Obtiene las publicaciones y las cambia a json
      const data = await res.json();
      console.log("DATA RAW:", data);

      // Verifica que las publicaciones se hayan obtenido correctamente
      if (res.ok) {

        // Normalizar distintas estructuras de respuesta
        const lista = data.publicaciones || data || [];

      if (Array.isArray(lista)) {

      setPublicaciones(lista);

      } else { //Da error por formato inesperado

      setError("Formato de datos inesperado.");

    }
    } else {

      setError("Error al obtener publicaciones.");

    }

    } catch (error) { //Error de red o excepción al cambiar a JSON

      setError("Error de conexión con el servidor.");

    } finally {

      setCargando(false);

    }

  };

  // Carga la lista de publicaciones al montarse el componente
  useEffect(() => {

    fetchPublicaciones();

  }, []);

  //Parte visible

  return (
    <div className="w-full z-10 space-y-12">

      <FormularioPublicacion publicaciones={publicaciones} onCreado={fetchPublicaciones} />

      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#0F172A] flex items-center">
            Lista de Publicaciones
        </h2>

        {cargando && <p className="text-[#3B82F6] font-semibold">Cargando publicaciones...</p>}
        {error && <div className="p-4 rounded bg-red-100 border border-red-200 text-red-700 font-medium mb-4">{error}</div>}

        {!cargando && !error && (
            <div className="mb-10 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[800px] text-sm text-left table-auto">
                        <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold uppercase tracking-wider text-xs border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Cuerpo</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Fechas</th>
                                <th className="px-6 py-4">Prioridad</th>
                                <th className="px-6 py-4">Etiquetas</th>
                                <th className="px-6 py-4">Adjuntos</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {publicaciones.map((pub) => (
                            <tr
                                key={pub.id_publicacion}
                                className="hover:bg-gray-50 transition-colors text-[#0F172A]"
                            >
                                <td className="px-6 py-4 font-mono text-[#64748B] whitespace-nowrap">{pub.id_publicacion}</td>
                                <td className="px-6 py-4 font-semibold whitespace-nowrap">{pub.titulo}</td>
                                <td className="px-6 py-4 text-[#64748B] truncate max-w-xs">{pub.cuerpo}</td>
                                <td className="px-6 py-4 text-[#64748B]">{pub.id_categoria}</td>
                                <td className="px-6 py-4 text-[#64748B] whitespace-nowrap">
                                  {formatearFecha(pub.fecha_inicio)}<br/>
                                  <span className="text-xs text-gray-500">- {formatearFecha(pub.fecha_fin)}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-[#0F172A]">
                                    {pub.prioridad}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-[#64748B]">
                                  {pub.etiquetas?.split(',').map((tag, i) => (
                                      <span key={i} className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-[#0F172A] mr-1 mb-1 border border-gray-200">{tag.trim()}</span>
                                  ))}
                                </td>
                                <td className="px-6 py-4">
                                {pub.adjuntos ? (
                                    <a
                                    href={`${API_ORIGIN}/uploads/${pub.adjuntos}`}
                                    target="_blank"
                                    className="text-[#3B82F6] hover:underline font-semibold whitespace-nowrap"
                                    >
                                    Ver archivo
                                    </a>
                                ) : (
                                    <span className="text-[#64748B]">—</span>
                                )}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button
                                            className="text-[#3B82F6] font-semibold hover:underline cursor-pointer"
                                            onClick={() => setPublicacionEditando(pub)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="text-[#EF4444] font-semibold hover:underline cursor-pointer"
                                            onClick={() => setPublicacionEliminando(pub)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
      )}

      {publicacionEditando && (
        <div className="mt-10 mb-10">
          <div className="p-8 rounded-lg bg-white border border-gray-200 shadow-sm relative z-10">
            <FormularioModificarPublicacion
                idPublicacion={publicacionEditando.id_publicacion}
                tituloActual={publicacionEditando.titulo}
                cuerpoActual={publicacionEditando.cuerpo}
                onModificado={() => {
                fetchPublicaciones(); // Actualiza la lista
                setPublicacionEditando(null); // Cierra el formulario
                }}
            />
          </div>
        </div>
      )}

      {publicacionEliminando && (
        <div className="mt-10 mb-10">
          <div className="p-8 rounded-lg bg-white border border-red-200 shadow-sm relative z-10">
            <EliminarPublicacion
                idPublicacion={publicacionEliminando.id_publicacion}
                onEliminado={() => {
                fetchPublicaciones(); // Actualiza la lista
                setPublicacionEliminando(null); // Oculta la confirmación
                }}
            />

            <button
                className="mt-4 w-full text-center py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-[#64748B] hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setPublicacionEliminando(null)}
            >
                Cancelar
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ListaPublicaciones;
