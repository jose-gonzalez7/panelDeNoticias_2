"use client";

import React, { useState } from "react";
import { manejarError } from '../../../utils/ManejarError';
import { useRouter } from "next/navigation";

/**
 * FormularioModificarCategoria.tsx
 *
 * Componente para modificar el nombre de una categoría existente.
 * - Recibe idCategoria y nombreActual como props.
 * - Envía PUT a /api/categorias con credentials: 'include' (para enviar cookies de sesión).
 * - Usa manejarError para redirigir a /error si la respuesta HTTP no es OK.
 */


const URL = "https://servidorpanelnoticias-production.up.railway.app/api/categorias";

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
      manejarError(response, router);

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
    // Formulario
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Modificar Categoría
      </h2>

      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-gray-700"
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

export default FormularioModificarCategoria;
