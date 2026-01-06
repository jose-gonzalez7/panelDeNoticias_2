"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter} from "next/navigation";

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/usuarios";

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
    manejarError(crearRes, router);

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

return ( //Formulario de creación de usuario

    <form onSubmit={handleSubmit} className="max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">

    <h2 className="text-xl font-semibold text-gray-800">Crear Usuario</h2>

    {/* Nombre */}
    <div>

        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>

    </div>

    {/* Email */}
    <div>

        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>

    </div>

    {/* Contraseña */}
    <div>

        <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>

    </div>

    {/* Rol */}
    <div>

        <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
        <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="editor">editor</option>
            <option value="profesor">profesor</option>

        </select>

    </div>

    {/* Botón de crear usuario */}
    <button type="submit" className="w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 transition">

        Crear Usuario

    </button>

    {/*Mensaje*/}
    {mensaje && <p className="text-sm text-gray-600 mt-2">{mensaje}</p>}

    </form>

  );

};

export default FormularioUsuario;
