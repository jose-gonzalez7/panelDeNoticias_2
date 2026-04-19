"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

/*
  Componente: EliminarPublicacion
  - Muestra un botón para eliminar una publicación.
  - Al hacer clic muestra confirmación; al confirmar envía DELETE al backend.
  - Usa credentials: 'include' para enviar cookies (session/auth).
  - manejarError gestionará redirecciones si la respuesta indica falta de permiso/autenticación.
*/

const URL = `${API_BASE}/publicaciones`;

// Props que recibe el componente
interface Props {

  idPublicacion: string; // ID de la publicación eliminada
  onEliminado?: () => void; // Actualiza la lista al eliminar la publicación

}

const EliminarPublicacion: React.FC<Props> = ({ idPublicacion, onEliminado }) => {

  const router = useRouter();

  // Estado local:
  // mensaje: muestra resultado / errores al usuario
  // confirmado: controla la UI de confirmación
  const [mensaje, setMensaje] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  // handleEliminar:
  // 1) Envía petición DELETE con body { id_publicacion }
  // 2) Llama a manejarError para manejo centralizado (p. ej. redirecciones)
  // 3) Intenta parsear JSON de la respuesta (puede no venir)
  // 4) Si OK, muestra mensaje y llama al callback onEliminado
  // 5) Maneja errores de red o mensajes devueltos por el backend

  const handleEliminar = async () => {

    try {

      // Solicitud al servidor para eliminar la publicación
      const res = await fetch(URL, {

        method: "DELETE",
        credentials: "include", // enviar cookies/session
        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({ id_publicacion: idPublicacion }),

      });

      // Manejo centralizado de errores
      await manejarError(res, router);

      // Cutrada para manejar respuestas sin JSON
      let result = null;
      try {

        result = await res.json();

      } catch {

        // El backend no devolvió JSON, y está bien

      }

      // Si la respuesta es correcta y se elimina la publicación se muestra por pantalla
      if (res.ok) {
        
        //Eliminación correcta
        setMensaje("Publicación eliminada.");
        if (onEliminado) onEliminado();
        return;

      }else {

        // Si no indica el error
        setMensaje(result.message || "Error al eliminar la publicación.");
      
      }
    } catch (error) {

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
      {mensaje && <p className="text-sm font-medium text-[#EF4444] mt-2 text-center">{mensaje}</p>}
    </div>
  );
};

export default EliminarPublicacion;
