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
      className="max-w-md mx-auto space-y-4"
    >
      <h2 className="text-lg font-bold text-[#0F172A] mb-2">
        Modificar Categoría
      </h2>

      <div className="flex flex-col space-y-1">
        <label
          htmlFor="nombre"
          className="text-sm font-medium text-[#0F172A]"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#1E3A8A] text-white font-medium py-2 rounded-md hover:bg-blue-800 transition-colors cursor-pointer mt-2"
      >
        Guardar Cambios
      </button>

      {mensaje && <p className="text-sm text-[#3B82F6] mt-2 font-medium text-center">{mensaje}</p>}
    </form>
  );
};

export default FormularioModificarCategoria;
