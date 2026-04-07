"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";

/*
  Componente: EliminarPublicacion
  - Muestra un botón para eliminar una publicación.
  - Al hacer clic muestra confirmación; al confirmar envía DELETE al backend.
  - Usa credentials: 'include' para enviar cookies (session/auth).
  - manejarError gestionará redirecciones si la respuesta indica falta de permiso/autenticación.
*/

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/publicaciones";

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
      manejarError(res, router);

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

export default EliminarPublicacion;
