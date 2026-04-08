"use client";

import React, { useState } from "react";
import { manejarError } from "../../../utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

/**
 * FormularioModificarCategoria.tsx
 *
 * Componente para modificar el nombre de una categoría existente.
 * - Recibe idCategoria y nombreActual como props.
 * - Envía PUT a /api/categorias con credentials: 'include' (para enviar cookies de sesión).
 * - Usa manejarError para redirigir a /error si la respuesta HTTP no es OK.
 */

const URL = `${API_BASE}/categorias`;

// Props que recibe el componente
interface Props {

  idCategoria: string; // ID de la categoría que está siendo modificada
  nombreActual: string; // Nombre actual de la categoría
  onModificado?: () => void; // Actualiza la lista de categorías al modificar una categoría

}

const FormularioModificarCategoria: React.FC<Props> = ({

  idCategoria,
  nombreActual,
  onModificado,

}) => {

  const router = useRouter();

  // Estado local para campos del formulario y mensajes
  const [nombre, setNombre] = useState(nombreActual); // Estado para el nuevo nombre
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito o error

  // Función que previene envío por defecto del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    try {

      // Solicitud al servidor para modificar la categoría
      const response = await fetch(URL, {

        method: "PUT",
        credentials: "include", //Enviar cookies

        headers: {

          "Content-Type": "application/json",

        },
        body: JSON.stringify({

          id_categoria: idCategoria,
          nuevoNombre: nombre,

        }),

      });

      // Manejo de errores HTTP
      await manejarError(response, router);

      // Obtiene el resultado y lo parsea a JSON
      const result = await response.json();

      // Si todo es correcto lo indica y actualiza la lista
      if (response.ok) {

        setMensaje("Categoría actualizada.");
        if (onModificado) onModificado(); // Actualiza la lista al actualizar la categoría
      
      } else {

        // Si no indica que ha habido un error
        
        setMensaje(result.message || "Error al actualizar la categoría.");
      }
    } catch (error) { //error de red

      setMensaje("Error de conexión con el servidor.");

    }

  };

  //Parte visible

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6 bg-transparent"
    >
      <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-4">
        Modificar Categoría
      </h2>

      <div className="group">
        <label
          htmlFor="nombre"
          className="block text-[11px] font-bold uppercase tracking-widest text-[#F2A931] mb-2"
        >
          Nuevo nombre
        </label>

        <input
          type="text"
          id="nombre"
          name="nombre"
          value={nombre}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNombre(e.target.value)
          }
          required
          className="w-full rounded-2xl border border-white/10 bg-[#1e293b]/50 px-5 py-4 text-sm text-white shadow-inner transition-all hover:bg-white/5 focus:border-[#F2A931]/50 focus:bg-[#1e293b]/80 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60"
        />
      </div>

      <button
        type="submit"
        className="w-full relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 px-6 py-4 text-white font-bold tracking-widest uppercase text-[11px] transition-all duration-300 hover:bg-[#F2A931] hover:text-[#0a0f1a] hover:border-[#F2A931] hover:-translate-y-1 focus:outline-none group/btn mt-4"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Guardar Cambios
        </span>
      </button>

      {mensaje && <p className="text-sm text-[#F2A931] mt-4 font-bold text-center">{mensaje}</p>}
    </form>
  );
};

export default FormularioModificarCategoria;
