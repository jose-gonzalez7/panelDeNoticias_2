"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

/*
  FormularioModificarUsuario.tsx
  - Componente para modificar el nombre de un usuario existente.
  - Recibe el nombre y email actuales por props y un callback opcional onModificado.
  - Envía una petición PUT a /api/usuarios con credentials: 'include' para que el navegador
    adjunte las cookies (útil si la autenticación se maneja con cookie HttpOnly).
  - Usa manejarError para redirigir a la página de error si la respuesta HTTP no es OK.
*/

const URL = `${API_BASE}/usuarios`;

//Props que recibe el componente
interface Props {

    nombreActual: string; //Nombre actual del usuario que está siendo modificado
    email: string; //Email del usuario que está siendo modificado
    onModificado?: () => void; //Actualiza la lista de usuarios al modificar un usuario

}

const FormularioModificarUsuario: React.FC<Props> = ({ nombreActual, email, onModificado }) => {

    const router = useRouter();

    //Estado local
    const [nombre, setNombre] = useState(nombreActual); //Estado para el nuevo nombre
    const [mensaje, setMensaje] = useState(""); //Mensaje de exito o error

    //Función que realiza la petición de modificado al backend
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    try {

        //Solicitud al servidor para modificar el usuario
        const response = await fetch(URL, {

        method: "PUT",
        credentials: "include", //Enviar cookies

        headers: {

            "Content-Type": "application/json",

        },

        body: JSON.stringify({
            
            email: email,
            nuevoNombre: nombre 
        }),

    });

    //Maneja errores HTTP
    await manejarError(response, router);

    //Obtiene el resultado y lo parsea a JSON
    const result = await response.json();

    //Si todo es correcto lo indica y actualiza la lista
    if (result.success) {

        setMensaje("Nombre actualizado.");
        if (onModificado) onModificado(); //Actualiza la lista al actualizar el nombre

    }else{ //Si no indica que ha habido un error

        setMensaje("Error al actualizar el nombre.");

    }

}catch(error){ //Error de red

    setMensaje("Error de conexión con el servidor.");

    }
};

//Parte visible

return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A] mb-2">Modificar Nombre</h2>
        <div className="flex flex-col space-y-1">
            <label htmlFor="nombre" className="text-sm font-medium text-[#0F172A]">
            Nuevo nombre
            </label>
        <input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
        />
        </div>
        <button type="submit" className="w-full bg-[#1E3A8A] text-white font-medium py-2 rounded-md hover:bg-blue-800 transition-colors cursor-pointer mt-2">
            Guardar cambios
        </button>
        {mensaje && <p className="text-sm text-[#3B82F6] mt-2 font-medium text-center">{mensaje}</p>}
    </form>
    );
  
};

export default FormularioModificarUsuario;
