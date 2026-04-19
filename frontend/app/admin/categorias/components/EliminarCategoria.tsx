"use client";

import React, { useState } from "react";
import { manejarError } from "../../../utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

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

const URL = `${API_BASE}/categorias`;

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
      await manejarError(res, router);

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
    <div className="space-y-4 text-center">
      {!confirmado ? (
        <button
          onClick={() => setConfirmado(true)}
          className="w-full rounded-md bg-red-50 border border-red-200 px-4 py-2 text-red-600 font-medium hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
        >
          Confirmar Eliminación
        </button>
      ) : (
        <div className="space-y-3 text-left">
          <span className="block text-sm font-medium text-[#0F172A] text-center">¿Estás completamente seguro? Esta acción es irreversible.</span>
          <div className="flex gap-3 justify-center">
             <button
                onClick={handleEliminar}
                className="flex-1 rounded-md bg-[#EF4444] px-4 py-2 text-white font-medium hover:bg-red-600 transition-colors cursor-pointer"
             >
                Sí, Eliminar
             </button>
             <button
                onClick={() => setConfirmado(false)}
                className="flex-1 rounded-md bg-white border border-gray-300 px-4 py-2 text-[#64748B] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
             >
                No, Mantener
             </button>
          </div>
        </div>
      )}
      {mensaje && <p className="text-sm font-medium text-[#EF4444] mt-2">{mensaje}</p>}
    </div>
  );
};

export default EliminarCategoria;
