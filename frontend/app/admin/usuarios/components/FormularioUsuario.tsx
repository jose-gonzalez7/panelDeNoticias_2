"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

const URL = `${API_BASE}/usuarios`;

//Props que recibe el componente que actualiza la lista al crear un usuario
interface Props {

    onCreado?: () => void; //Actualiza la lista al crear un usuario

}

const FormularioUsuario: React.FC<Props> = ({ onCreado}) => {

    const router = useRouter();

    //Estado que almacena los datos del nuevo usuario
    const [formData, setFormData] = useState({

    //Datos del nuevo usuario
    nombre: "",
    email: "",
    contraseña: "",
    rol: "profesor", //Por defecto hace que en el select ponga el rol de profesor

    });

const [mensaje, setMensaje] = useState(""); //Mensaje de estado

//Función que maneja los cambios en los campos del formulario
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

};

//Función que: valida, envía al backend y procesa la respuesta
const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    //Validar contraseña
    if(formData.contraseña.length < 8){

        setMensaje("La contraseña debe tener al menos 8 carácteres.");
        return;

    }

    try{

        //Solicitud al servidor para crear el usuario
        const crearRes = await fetch(URL, {

        method: "POST",
        credentials: "include", //Enviar cookies
        headers: {

        "Content-Type": "application/json",

        },

        body: JSON.stringify(formData),

    });

    //Maneja errores HTTP
    await manejarError(crearRes, router);

    //Respuesta del servidor parseada a JSON
    const crearData = await crearRes.json();

    if(crearData.success) { //Si todo es correcto lo indica

        setMensaje("Usuario creado.");
        setTimeout(() => setMensaje(""), 3000); //Oculta el mensaje al pasar un rato
        if (onCreado) onCreado(); //Actualiza la lista de usuarios
        setFormData({ //Vacia el formulario

            nombre: "",
            email: "",
            contraseña: "",
            rol: "profesor",

    });

    }else{ //Si no muestra el error devuelto por el backend o error genérico

        setMensaje(crearData.message || "Error al crear usuario.");

    }

    }catch(error){ //Error de red u otros

    setMensaje("Error de conexión con el servidor.");

}

};

//Parte visible

return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5 bg-white p-8 rounded-lg border border-gray-200 mb-10">
        <h2 className="text-xl font-bold text-[#0F172A] border-b border-gray-200 pb-4">
            Crear Usuario<span className="text-[#F59E0B]">.</span>
        </h2>

        <div className="flex flex-col space-y-1">
            <label htmlFor="nombre" className="text-sm font-medium text-[#0F172A]">Nombre</label>
            <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400"/>
        </div>

        <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-[#0F172A]">Email Institucional</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400"/>
        </div>

        <div className="flex flex-col space-y-1">
            <label htmlFor="contraseña" className="text-sm font-medium text-[#0F172A]">Contraseña</label>
            <input
                type="password"
                id="contraseña"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400"/>
        </div>

        <div className="flex flex-col space-y-1">
            <label htmlFor="rol" className="text-sm font-medium text-[#0F172A]">Rol en el Centro</label>
            <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer appearance-none">
                <option value="editor">Editor</option>
                <option value="profesor">Profesor</option>
            </select>
        </div>

        <div className="pt-4">
            <button type="submit" className="w-full bg-[#1E3A8A] text-white font-medium py-2.5 rounded-md hover:bg-blue-800 transition-colors cursor-pointer flex justify-center items-center">
                Confirmar Creación
            </button>
        </div>

        {mensaje && (
            <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
                <p className="text-sm font-medium text-[#1E3A8A] text-center">
                    {mensaje}
                </p>
            </div>
        )}
    </form>
);

};

export default FormularioUsuario;
