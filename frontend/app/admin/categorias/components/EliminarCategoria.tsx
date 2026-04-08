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
    <div className="space-y-6 text-center">
      {!confirmado ? (
        <button
          onClick={() => setConfirmado(true)}
          className="w-full rounded-2xl bg-red-600/20 border border-red-500/50 px-6 py-4 text-red-400 font-bold uppercase tracking-widest text-[11px] hover:bg-red-600 hover:text-white transition-all shadow-lg"
        >
          Confirmar Eliminación
        </button>
      ) : (
        <div className="space-y-4 text-left">
          <span className="block text-sm font-bold text-white mb-4 text-center">¿Estás completamente seguro? Esta acción es irreversible.</span>
          <div className="flex gap-4 justify-center">
             <button
                onClick={handleEliminar}
                className="flex-1 rounded-2xl bg-red-600 px-6 py-4 text-white font-bold uppercase tracking-widest text-[11px] hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
             >
                Sí, Eliminar
             </button>
             <button
                onClick={() => setConfirmado(false)}
                className="flex-1 rounded-2xl bg-[#1e293b]/50 border border-white/10 px-6 py-4 text-slate-300 font-bold uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all"
             >
                No, Mantener
             </button>
          </div>
        </div>
      )}
      {mensaje && <p className="text-sm font-bold text-[#F2A931] mt-4">{mensaje}</p>}
    </div>
  );
};

export default EliminarCategoria;
