"use client";

import React, { useEffect, useState } from "react";
import EliminarPublicacion from "./EliminarPublicacion";
import FormularioModificarPublicacion from "./FormularioModificarPublicacion";
import FormularioPublicacion from "./FormularioPublicacion";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";

/*
  ListaPublicaciones.tsx
  - Componente que muestra, crea, edita y elimina publicaciones.
  - Usa fetch con credentials: 'include' para enviar cookies/session al backend.
  - manejarError redirige a /error si la respuesta HTTP no es OK.
*/

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/publicaciones";

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
      manejarError(res, router);

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
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-white rounded shadow border border-gray-200">
      {/* Formulario para crear una nueva publicación */}
      <FormularioPublicacion onCreado={fetchPublicaciones} />

      {/* Lista de publicaciones */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Lista de Publicaciones
      </h2>

      {/* Muestra el estado */}
      {cargando && <p className="text-gray-600">Cargando publicaciones...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Genera la tabla al terminar de cargar y si no hay errores */}
      {!cargando && !error && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-700">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Título</th>
              <th className="p-2 border">Cuerpo</th>
              <th className="p-2 border">Categoría</th>
              <th className="p-2 border">Fechas</th>
              <th className="p-2 border">Prioridad</th>
              <th className="p-2 border">Etiquetas</th>
              <th className="p-2 border">Adjuntos</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {publicaciones.map((pub) => (
              <tr
                key={pub.id_publicacion}
                className="text-sm text-gray-800 hover:bg-gray-50"
              >
                <td className="p-2 border">{pub.id_publicacion}</td>
                <td className="p-2 border">{pub.titulo}</td>
                <td className="p-2 border">{pub.cuerpo}</td>
                <td className="p-2 border">{pub.id_categoria}</td>
                <td className="p-2 border">
                  {formatearFecha(pub.fecha_inicio)} - {formatearFecha(pub.fecha_fin)}
                </td>
                <td className="p-2 border capitalize">{pub.prioridad}</td>
                <td className="p-2 border">{pub.etiquetas}</td>
                <td className="p-2 border">
                  {pub.adjuntos ? (
                    <a
                      href={`https://servidorpanelnoticias-production.up.railway.app/uploads/${pub.adjuntos}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      {pub.adjuntos}
                    </a>
                  ) : (
                    "—"
                  )}
                  </td>

                <td className="p-2 border">
                  {/* BOTONES EDITAR Y ELIMINAR */}
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => setPublicacionEditando(pub)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => setPublicacionEliminando(pub)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {publicacionEditando && (
        <div className="mt-6">
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
      )}

      {publicacionEliminando && (
        <div className="mt-6">
          <EliminarPublicacion
            idPublicacion={publicacionEliminando.id_publicacion}
            onEliminado={() => {
              fetchPublicaciones(); // Actualiza la lista
              setPublicacionEliminando(null); // Oculta la confirmación
            }}
          />

          <button
            className="text-sm text-gray-500 hover:underline mt-2"
            onClick={() => setPublicacionEliminando(null)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default ListaPublicaciones;
