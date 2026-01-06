"use client";

import React, { useState } from "react";
import { manejarError } from '../../../utils/ManejarError';
import { useRouter } from "next/navigation";

/**
 * EliminarCategoria.tsx
 *
 * Componente para eliminar una categoría por id.
 * - Muestra un botón "Eliminar" que abre una confirmación.
 * - Si el usuario confirma, envía DELETE a /api/categorias con { id_categoria } en el body.
 * - Usa credentials: 'include' para que el navegador adjunte cookies de sesión (útil si la autenticación
 *   se gestiona con cookie HttpOnly).
 * - llamar manejarError(res, router) para redirigir a /error si la respuesta HTTP no es OK.
 */

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/categorias";

// Props que recibe el componente
interface Props {
  idCategoria: string; // ID de la categoría eliminada
  onEliminado?: () => void; // Actualiza la lista al eliminar la categoría
}

const EliminarCategoria: React.FC<Props> = ({ idCategoria, onEliminado }) => {

  const router = useRouter();

  // Estado local
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito o error
  const [confirmado, setConfirmado] = useState(false); // Estado de confirmación

  // Función que realiza la petición DELETE al backend
  const handleEliminar = async () => {

    try {
      // Solicitud al servidor para eliminar la categoría
      const res = await fetch(URL, {

        method: "DELETE",
        credentials: "include", // enviar cookies

          headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({ id_categoria: idCategoria }),

      });

      // Maneja errores HTTP
      manejarError(res, router);

      // Obtiene el resultado
      const result = await res.json();

      // Si la respuesta es correcta y se elimina la categoría se muestra por pantalla
      if (res.ok) {

        setMensaje("Categoría eliminada.");

        if (onEliminado) onEliminado(); // Refresca la lista al eliminar la categoría
      
      } else {

        // Si no indica el error
        setMensaje(result.message || "Error al eliminar la categoría.");
      
      }

    } catch (error) { //Error de red

      // Si no logra conectarse da error al conectarse con el servidor
      setMensaje("Error al conectar con el servidor.");

    }

  };

  //Parte visible

  return (
    // Botones
    <div className="space-y-2">
      {!confirmado ? (
        // Botón de eliminar
        <button
          onClick={() => setConfirmado(true)}
          className="text-red-600 hover:underline text-sm"
        >
          Eliminar
        </button>
      ) : (
        // Capa de confirmación de eliminación
        <div className="space-x-2 text-sm">
          <span>¿Confirmas la eliminación?</span>

          {/* Sí */}
          <button
            onClick={handleEliminar}
            className="text-red-600 hover:underline font-medium"
          >
            Sí
          </button>

          {/* No */}
          <button
            onClick={() => setConfirmado(false)}
            className="text-gray-600 hover:underline font-medium"
          >
            No
          </button>
        </div>
      )}

      {/* Muestra el mensaje */}
      {mensaje && <p className="text-sm text-gray-600">{mensaje}</p>}
    </div>
  );
};

export default EliminarCategoria;
