"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

/*
  EliminarUsuarios.tsx
  - Componente que muestra un botón para eliminar un usuario (por email).
  - Al pulsar "Eliminar" muestra confirmación; al confirmar envía DELETE al backend.
  - Usa fetch(..., { credentials: 'include' }) para que el navegador adjunte cookies (útil si la
    autenticación se gestiona con cookie HttpOnly).
  - manejarError gestiona redirecciones a /error si la respuesta HTTP no es OK.
*/

const URL = `${API_BASE}/usuarios`;

//Props que recibe el componente
interface Props{

    email: string; //Email del usuario eliminado
    onEliminado?: () => void; //Actualiza la lista al eliminar a un usuario

}

const EliminarUsuarios: React.FC<Props> = ({email, onEliminado }) => {

    const router = useRouter();

    //Estado local
    const [mensaje, setMensaje] = useState(""); //Mensaje de exito o error
    const [confirmado, setConfirmado] = useState(false); //Estado de confirmación

    //Función que realiza la petición DELETE al backend
    const handleEliminar = async () => {

        try{

            //Solicitud al servidor para eliminar al usuario
            const res = await fetch(URL, {

                method: "DELETE",
                credentials: "include",
                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({ email }),

            });

            //Maneja errores HTTP
            await manejarError(res, router);

            //Obtiene el resultado y lo parsea a JSON
            const result = await res.json();

            //Si la respuesta es correcta y se elimina al usuario se muestra por pantalla
            if(result.success){

                setMensaje("Usuario eliminado.");
                if(onEliminado) onEliminado(); //Refresca la lista al eliminar el usuario

            }else{ //Si no indica el error

                setMensaje("Error al eliminar al usuario.");

            }

        }catch(error){ //Error de red u otros

            setMensaje("Error al conectar con el servidor.");

        }

    };

    //Parte visible

    return (
        <div className="space-y-6 text-center">
            {!confirmado ? (
                <button onClick={() => setConfirmado(true)} className="w-full rounded-2xl bg-red-600/20 border border-red-500/50 px-6 py-4 text-red-400 font-bold uppercase tracking-widest text-[11px] hover:bg-red-600 hover:text-white transition-all shadow-lg">
                    Confirmar Eliminación
                </button>
            ) : (
                <div className="space-y-4 text-left">
                    <span className="block text-sm font-bold text-white mb-4 text-center">¿Estás completamente seguro? Esta acción es irreversible.</span>
                    <div className="flex gap-4 justify-center">
                        <button onClick={handleEliminar} className="flex-1 rounded-2xl bg-red-600 px-6 py-4 text-white font-bold uppercase tracking-widest text-[11px] hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            Sí, Eliminar
                        </button>
                        <button onClick={() => setConfirmado(false)} className="flex-1 rounded-2xl bg-[#1e293b]/50 border border-white/10 px-6 py-4 text-slate-300 font-bold uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all">
                            No, Mantener
                        </button>
                    </div>
                </div>
            )}
            {mensaje && <p className="text-sm font-bold text-[#F2A931] mt-4">{mensaje}</p>}
        </div>
    );

};

export default EliminarUsuarios;