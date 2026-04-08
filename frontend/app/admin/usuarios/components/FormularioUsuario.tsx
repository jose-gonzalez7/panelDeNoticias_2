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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-7 bg-[#0a0f1a]/60 p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl relative overflow-hidden group/form mb-12">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2A931] to-transparent opacity-40"></div>
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#F2A931]/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight border-b border-white/10 pb-5">
            Crear Usuario<span className="text-[#F2A931]">.</span>
        </h2>

        <div className="flex flex-col space-y-2 group">
            <label htmlFor="nombre" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#F2A931] transition-colors duration-300 ml-1">Nombre</label>
            <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#1e293b]/30 px-5 py-4 text-sm text-white shadow-inner transition-all hover:bg-white/5 focus:border-[#F2A931]/50 focus:bg-[#1e293b]/50 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60 placeholder:text-slate-600"/>
        </div>

        <div className="flex flex-col space-y-2 group">
            <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#F2A931] transition-colors duration-300 ml-1">Email Institucional</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#1e293b]/30 px-5 py-4 text-sm text-white shadow-inner transition-all hover:bg-white/5 focus:border-[#F2A931]/50 focus:bg-[#1e293b]/50 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60 placeholder:text-slate-600"/>
        </div>

        <div className="flex flex-col space-y-2 group">
            <label htmlFor="contraseña" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#F2A931] transition-colors duration-300 ml-1">Contraseña</label>
            <input
                type="password"
                id="contraseña"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#1e293b]/30 px-5 py-4 text-sm text-white shadow-inner transition-all hover:bg-white/5 focus:border-[#F2A931]/50 focus:bg-[#1e293b]/50 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60 placeholder:text-slate-600"/>
        </div>

        <div className="flex flex-col space-y-2 group">
            <label htmlFor="rol" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#F2A931] transition-colors duration-300 ml-1">Rol en el Centro</label>
            <div className="relative">
                <select
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#1e293b]/30 px-5 py-4 text-sm text-white shadow-inner transition-all hover:bg-white/5 focus:border-[#F2A931]/50 focus:bg-[#1e293b]/50 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60 appearance-none cursor-pointer">
                    <option value="editor" className="bg-[#1e293b] text-white">Editor</option>
                    <option value="profesor" className="bg-[#1e293b] text-white">Profesor</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>

        <div className="pt-2">
            <button type="submit" className="w-full relative overflow-hidden rounded-2xl bg-[#F2A931] px-6 py-4 text-[#0a0f1a] font-bold tracking-widest uppercase text-[11px] shadow-[0_0_20px_rgba(242,169,49,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,169,49,0.3)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#F2A931] focus:ring-offset-2 focus:ring-offset-[#0a0f1a] group/btn">
                <span className="relative z-10 flex items-center justify-center gap-2">
                    Confirmar Creación
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
                <div className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>
            </button>
        </div>

        {mensaje && (
            <div className="mt-6 p-4 rounded-xl bg-[#1e293b]/60 border border-[#F2A931]/30 backdrop-blur-md">
                <p className="text-sm font-bold text-[#F2A931] animate-[pulse_2s_ease-in-out_infinite] text-center tracking-wide">
                    {mensaje}
                </p>
            </div>
        )}
    </form>
);

};

export default FormularioUsuario;
