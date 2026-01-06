"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";

/*
  EliminarUsuarios.tsx
  - Componente que muestra un botón para eliminar un usuario (por email).
  - Al pulsar "Eliminar" muestra confirmación; al confirmar envía DELETE al backend.
  - Usa fetch(..., { credentials: 'include' }) para que el navegador adjunte cookies (útil si la
    autenticación se gestiona con cookie HttpOnly).
  - manejarError gestiona redirecciones a /error si la respuesta HTTP no es OK.
*/

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/usuarios";

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
            manejarError(res, router);

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

        //Botones
        <div className="space-y-2">

            {!confirmado ? (

                //Botón de eliminar
                <button onClick={() => setConfirmado(true)} className="text-red-600 hover:underline text-sm">

                    Eliminar

                </button>

            ) : (

                //Capa de confirmación de eliminación
                <div className="space-x-2 text-sm">

                    <span>¿Confirmas la eliminación?</span>

                    {/* Si */}
                    <button onClick={handleEliminar} className="text-red-600 hover:underline font-medium">

                        Si

                    </button>

                    {/* No */}
                    <button onClick={() => setConfirmado(false)} className="text-gray-600 hover:underline font-medium">

                        No

                    </button>

                </div>

            )}

            {/* Muestra el mensaje*/}
            {mensaje && <p className="text-sm text-gray-600">{mensaje}</p>}

        </div>

    );

};

export default EliminarUsuarios;