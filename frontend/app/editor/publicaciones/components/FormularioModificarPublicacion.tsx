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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 bg-transparent">
      <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-4">
        Modificar Publicación
      </h2>

      <div className="group">
        <label htmlFor="titulo" className="block text-[11px] font-bold uppercase tracking-widest text-[#F2A931] mb-2">
          Nuevo título
        </label>
        <input type="text" id="titulo" name="titulo" value={titulo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)} required className="w-full rounded-2xl border border-white/10 bg-[#1e293b]/50 px-5 py-4 text-sm text-white shadow-inner transition-all hover:bg-white/5 focus:border-[#F2A931]/50 focus:bg-[#1e293b]/80 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60" />
      </div>

      <div className="group">
        <label htmlFor="cuerpo" className="block text-[11px] font-bold uppercase tracking-widest text-[#F2A931] mb-2">
          Nuevo cuerpo
        </label>
        <textarea id="cuerpo" name="cuerpo" value={cuerpo} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCuerpo(e.target.value)} required className="w-full rounded-2xl border border-white/10 bg-[#1e293b]/50 px-5 py-4 text-sm text-white shadow-inner transition-all hover:bg-white/5 focus:border-[#F2A931]/50 focus:bg-[#1e293b]/80 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60 min-h-[120px] resize-y" />
      </div>

      <button type="submit" className="w-full relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 px-6 py-4 text-white font-bold tracking-widest uppercase text-[11px] transition-all duration-300 hover:bg-[#F2A931] hover:text-[#0a0f1a] hover:border-[#F2A931] hover:-translate-y-1 focus:outline-none group/btn mt-4">
        <span className="relative z-10 flex items-center justify-center gap-2">
          Guardar Cambios
        </span>
      </button>

      {mensaje && <p className="text-sm text-[#F2A931] mt-4 font-bold text-center">{mensaje}</p>}
    </form>
  );
};

export default FormularioModificarPublicacion;

