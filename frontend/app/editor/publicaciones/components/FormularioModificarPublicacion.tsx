"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

/**
 * FormularioModificarPublicacion.tsx
 *
 * Componente para modificar una publicación existente.
 * - Recibe id/título/cuerpo actuales por props.
 * - Envía una petición PUT al endpoint de publicaciones.
 * - Usa credentials: 'include' para enviar cookies (útil si la autenticación se guarda en cookie HttpOnly).
 * - manejarError se encarga de redirigir a /error si la respuesta HTTP no es OK.
 */

const URL = `${API_BASE}/publicaciones`;

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
      await manejarError(response, router);

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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-bold text-[#0F172A] mb-4">
        Modificar Publicación
      </h2>

      <div className="flex flex-col space-y-1">
        <label htmlFor="titulo" className="text-sm font-medium text-[#0F172A]">
          Nuevo título
        </label>
        <input type="text" id="titulo" name="titulo" value={titulo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]" />
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="cuerpo" className="text-sm font-medium text-[#0F172A]">
          Nuevo cuerpo
        </label>
        <textarea id="cuerpo" name="cuerpo" value={cuerpo} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCuerpo(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] min-h-[120px] resize-y" />
      </div>

      <button type="submit" className="w-full bg-[#1E3A8A] text-white font-medium py-2 rounded-md hover:bg-blue-800 transition-colors cursor-pointer mt-4">
        Guardar Cambios
      </button>

      {mensaje && <p className="text-sm text-[#3B82F6] mt-4 font-medium text-center">{mensaje}</p>}
    </form>
  );
};

export default FormularioModificarPublicacion;

