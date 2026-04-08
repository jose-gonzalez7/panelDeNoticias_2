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

      <FormularioPublicacion onCreado={fetchPublicaciones} />

      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-white tracking-tight flex items-center">
            <span className="w-1.5 h-6 bg-[#F2A931] rounded-full mr-3 border border-white/20"></span>
            Lista de Publicaciones
        </h2>

        {cargando && <p className="text-[#F2A931] animate-[pulse_1.5s_ease-in-out_infinite] font-semibold tracking-wide">Cargando publicaciones...</p>}
        {error && <div className="p-5 rounded-[1.5rem] bg-red-900/30 border border-red-500/30 text-red-200 backdrop-blur-md shadow-lg font-medium">{error}</div>}

        {!cargando && !error && (
            <div className="relative group/table mb-10">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-[#F2A931] rounded-[2rem] blur opacity-10 group-hover/table:opacity-20 transition-opacity duration-500"></div>
                <div className="overflow-x-auto rounded-[2rem] border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-[#0a0f1a]/60 backdrop-blur-2xl relative z-10">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#F2A931]/5 rounded-full blur-2xl pointer-events-none"></div>
                    <table className="w-full min-w-[800px] table-auto border-collapse relative z-10">
                        <thead>
                            <tr className="bg-[#1e293b]/40 text-left text-[11px] uppercase tracking-[0.2em] text-slate-400 border-b border-white/5">
                            <th className="px-5 py-4 font-bold">ID</th>
                            <th className="px-5 py-4 font-bold">Título</th>
                            <th className="px-5 py-4 font-bold">Cuerpo</th>
                            <th className="px-5 py-4 font-bold">Categoría</th>
                            <th className="px-5 py-4 font-bold">Fechas</th>
                            <th className="px-5 py-4 font-bold">Prioridad</th>
                            <th className="px-5 py-4 font-bold">Etiquetas</th>
                            <th className="px-5 py-4 font-bold">Adjuntos</th>
                            <th className="px-5 py-4 font-bold text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {publicaciones.map((pub) => (
                            <tr
                                key={pub.id_publicacion}
                                className="text-sm hover:bg-[#1e293b]/30 transition-colors"
                            >
                                <td className="px-5 py-4 font-mono text-slate-400 whitespace-nowrap">{pub.id_publicacion}</td>
                                <td className="px-5 py-4 font-semibold text-gray-200 whitespace-nowrap">{pub.titulo}</td>
                                <td className="px-5 py-4 text-slate-400 truncate max-w-xs">{pub.cuerpo}</td>
                                <td className="px-5 py-4 text-slate-400">{pub.id_categoria}</td>
                                <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                                  {formatearFecha(pub.fecha_inicio)}<br/>
                                  <span className="text-xs text-slate-500">- {formatearFecha(pub.fecha_fin)}</span>
                                </td>
                                <td className="px-5 py-4">
                                  <span className="px-3 py-1.5 rounded-full bg-[#1e293b] border border-white/10 text-[#F2A931] text-[10px] font-bold uppercase tracking-widest shadow-inner">
                                    {pub.prioridad}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-slate-400">
                                  {pub.etiquetas?.split(',').map((tag, i) => (
                                      <span key={i} className="inline-block px-2 py-1 bg-white/5 rounded text-[10px] text-slate-300 mr-1 mb-1 border border-white/5">{tag.trim()}</span>
                                  ))}
                                </td>
                                <td className="px-5 py-4">
                                {pub.adjuntos ? (
                                    <a
                                    href={`${API_ORIGIN}/uploads/${pub.adjuntos}`}
                                    target="_blank"
                                    className="text-[#F2A931] hover:underline hover:text-white transition-colors text-xs font-bold"
                                    >
                                    Ver archivo
                                    </a>
                                ) : (
                                    <span className="text-slate-600">—</span>
                                )}
                                </td>

                                <td className="px-5 py-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button
                                            className="text-slate-400 font-bold hover:text-[#F2A931] transition-colors underline-offset-4 hover:underline whitespace-nowrap"
                                            onClick={() => setPublicacionEditando(pub)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="text-slate-500 font-bold hover:text-red-400 transition-colors underline-offset-4 hover:underline whitespace-nowrap"
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
        <div className="mt-10 mb-10 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-blue-600/30 rounded-[2rem] blur opacity-15"></div>
          <div className="p-8 rounded-[2rem] bg-[#0a0f1a]/80 border border-white/5 shadow-2xl backdrop-blur-2xl relative z-10">
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
        <div className="mt-10 mb-10 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-[#F2A931] rounded-[2rem] blur opacity-15"></div>
          <div className="p-8 rounded-[2rem] bg-[#0a0f1a]/80 border border-red-500/20 shadow-2xl backdrop-blur-2xl relative z-10">
            <EliminarPublicacion
                idPublicacion={publicacionEliminando.id_publicacion}
                onEliminado={() => {
                fetchPublicaciones(); // Actualiza la lista
                setPublicacionEliminando(null); // Oculta la confirmación
                }}
            />

            <button
                className="mt-6 w-full text-center py-4 border border-white/10 rounded-2xl bg-white/5 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-sans uppercase tracking-[0.1em]"
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
