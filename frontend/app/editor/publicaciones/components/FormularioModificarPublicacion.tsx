"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";

/**
 * FormularioModificarPublicacion.tsx
 *
 * Componente para modificar una publicación existente.
 * - Recibe id/título/cuerpo actuales por props.
 * - Envía una petición PUT al endpoint de publicaciones.
 * - Usa credentials: 'include' para enviar cookies (útil si la autenticación se guarda en cookie HttpOnly).
 * - manejarError se encarga de redirigir a /error si la respuesta HTTP no es OK.
 */

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/publicaciones";

// Props que recibe el componente
interface Props {

  idPublicacion: string; // ID de la publicación que está siendo modificada
  tituloActual: string;  // Título actual de la publicación
  cuerpoActual: string;  // Cuerpo actual de la publicación
  onModificado?: () => void; // Actualiza la lista de publicaciones al modificar una publicación

}

const FormularioModificarPublicacion: React.FC<Props> = ({
  idPublicacion,
  tituloActual,
  cuerpoActual,
  onModificado,
}) => {

  const router = useRouter();

  // Estado local para campos del formulario y mensajes
  const [titulo, setTitulo] = useState(tituloActual); // Estado para el nuevo título
  const [cuerpo, setCuerpo] = useState(cuerpoActual); // Estado para el nuevo cuerpo
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito o error

  // Función que realiza la petición de modificado al backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    try {

      // Solicitud al servidor para modificar la publicación
      const response = await fetch(URL, {

        method: "PUT",
        credentials: "include", //Envia cookies
        headers: {

          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          id_publicacion: idPublicacion,
          titulo: titulo,
          cuerpo: cuerpo,
        }),
      });

      // Manejo de errores HTTP
      manejarError(response, router);

      // Obtiene el resultado y lo parsea a JSON
      const result = await response.json();

      // Si todo es correcto lo indica y actualiza la lista
      if (response.ok) {

        setMensaje("Publicación actualizada.");
        
        if (onModificado) onModificado(); // Actualiza la lista al actualizar la publicación
      
      } else {

        // Si no indica que ha habido un error
        setMensaje(result.message || "Error al actualizar la publicación.");
      
      }

    } catch (error) {

      // Si no logra conectarse con el servidor lo indica
      setMensaje("Error de conexión con el servidor.");
    
    }
  };

  //Parte visible

  return (
    // Formulario
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Modificar Publicación
      </h2>

      {/* Campo título */}
      <div>
        <label
          htmlFor="titulo"
          className="block text-sm font-medium text-gray-700"
        >
          Nuevo título
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={titulo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitulo(e.target.value)
          }
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Campo cuerpo */}
      <div>
        <label
          htmlFor="cuerpo"
          className="block text-sm font-medium text-gray-700"
        >
          Nuevo cuerpo
        </label>
        <textarea
          id="cuerpo"
          name="cuerpo"
          value={cuerpo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCuerpo(e.target.value)
          }
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botón de guardar cambios */}
      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 transition"
      >
        Guardar cambios
      </button>

      {/* Muestra el mensaje */}
      {mensaje && <p className="text-sm text-gray-600 mt-2">{mensaje}</p>}
    </form>
  );
};

export default FormularioModificarPublicacion;

