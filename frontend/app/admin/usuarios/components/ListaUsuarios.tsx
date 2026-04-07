"use client";

import React, { useEffect, useState } from "react";
import EliminarUsuarios from "./EliminarUsuarios";
import FormularioModificarUsuario from "./FormularioModificarUsuario";
import FormularioUsuario from "./FormularioUsuario";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/usuarios/admin";

//Interfaz de la estructura del usuario
interface Usuario {

    id: number;
    nombre: string;
    email: string;
    rol: string;

}

/*
  ListaUsuarios
  - Componente que lista usuarios admin.
  - Realiza fetch al endpoint de usuarios usando credentials: 'include' para enviar cookies/session.
  - manejarError redirige a /error si la respuesta HTTP no es OK.
  - Permite abrir formularios para crear, editar y eliminar usuarios.
*/

//Obtiene y muestra la lista de usuarios
const ListaUsuarios = () => {

    const router = useRouter();

    // Estado local
    const [usuarios, setUsuarios] = useState<Usuario[]>([]); //Lista de usuarios
    const [cargando, setCargando] = useState(true); //Indica si se está esperando una respuesta
    const [error, setError] = useState(""); //Almacena los mensajes de error
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null) //Almacena el usuario que está siendo editado
    const [usuarioEliminando, setUsuarioEliminando] = useState<Usuario | null>(null); //Almacena el usuario que está siendo eliminado

//Obtiene la lista de usuarios desde el backend
const fetchUsuarios = async () => {
    setCargando(true);
    setError("");

    try {

        const res = await fetch(URL, {

            method: "GET",
            credentials: "include", //Enviar cookies

        });

        //Manejo de errores HTTP
        manejarError(res, router);

        const data = await res.json();

        // Normalizar distintas formas en que el backend puede devolver la lista
        if (Array.isArray(data)) {
            
            setUsuarios(data);

        } else if (Array.isArray(data.users)) {

            setUsuarios(data.users);

        } else if (Array.isArray(data.usuarios)) {

            setUsuarios(data.usuarios);

        } else {

            // Formato inesperado: vaciar lista y log para depuración
            console.warn("El backend NO devolvió una lista de usuarios:", data);
            setUsuarios([]);

        }

    } catch (error) {

        //Error de red u otros
        setError("Error de conexión con el servidor.");
    
    } finally {

        setCargando(false);

    }
};

//Carga usuarios al montar el componente
useEffect(() => {

    fetchUsuarios();

}, []);

//Parte visible
return (
    <div className="w-full z-10 space-y-12">

        <FormularioUsuario onCreado={fetchUsuarios}/>

        <div>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white tracking-tight flex items-center">
              <span className="w-1.5 h-6 bg-[#F2A931] rounded-full mr-3 border border-white/20"></span>
              Lista de Usuarios
            </h2>

            {cargando && <p className="text-[#F2A931] animate-[pulse_1.5s_ease-in-out_infinite] font-semibold tracking-wide">Cargando usuarios...</p>}
            {error && <div className="p-5 rounded-[1.5rem] bg-red-900/30 border border-red-500/30 text-red-200 backdrop-blur-md shadow-lg font-medium">{error}</div>}

            {!cargando && !error && (
                <div className="relative group/table mb-10">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-[#F2A931] rounded-[2rem] blur opacity-10 group-hover/table:opacity-20 transition-opacity duration-500"></div>
                    <div className="overflow-x-auto rounded-[2rem] border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-[#0a0f1a]/60 backdrop-blur-2xl relative z-10">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F2A931]/5 rounded-full blur-2xl pointer-events-none"></div>
                        <table className="w-full min-w-[600px] table-auto border-collapse relative z-10">
                            <thead>
                                <tr className="bg-[#1e293b]/40 text-left text-[11px] uppercase tracking-[0.2em] text-slate-400 border-b border-white/5">
                                    <th className="px-6 py-5 font-bold">Nombre</th>
                                    <th className="px-6 py-5 font-bold">Email</th>
                                    <th className="px-6 py-5 font-bold">Rol</th>
                                    <th className="px-6 py-5 font-bold text-center">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5">
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="text-sm hover:bg-[#1e293b]/30 transition-colors">
                                        <td className="px-6 py-5 font-semibold text-gray-200 whitespace-nowrap">{usuario.nombre}</td>
                                        <td className="px-6 py-5 font-mono text-slate-400 whitespace-nowrap">{usuario.email}</td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1.5 rounded-full bg-[#1e293b] border border-white/10 text-[#F2A931] text-[10px] font-bold uppercase tracking-widest shadow-inner">
                                                {usuario.rol}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center gap-6">
                                                <button 
                                                    className="text-slate-400 font-bold hover:text-[#F2A931] transition-colors underline-offset-4 hover:underline whitespace-nowrap" 
                                                    onClick={() => setUsuarioEditando(usuario)}
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    className="text-slate-500 font-bold hover:text-red-400 transition-colors underline-offset-4 hover:underline whitespace-nowrap" 
                                                    onClick={() => setUsuarioEliminando(usuario)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {usuarioEditando && (
                <div className="mt-10 mb-10 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-blue-600/30 rounded-[2rem] blur opacity-15"></div>
                    <div className="p-8 rounded-[2rem] bg-[#0a0f1a]/80 border border-white/5 shadow-2xl backdrop-blur-2xl relative z-10">
                        <FormularioModificarUsuario 
                            nombreActual={usuarioEditando.nombre} 
                            email={usuarioEditando.email} 
                            onModificado={() => {
                                fetchUsuarios();
                                setUsuarioEditando(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {usuarioEliminando && (
                <div className="mt-10 mb-10 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-[#F2A931] rounded-[2rem] blur opacity-15"></div>
                    <div className="p-8 rounded-[2rem] bg-[#0a0f1a]/80 border border-red-500/20 shadow-2xl backdrop-blur-2xl relative z-10">
                        <EliminarUsuarios 
                            email={usuarioEliminando.email} 
                            onEliminado={() => {
                                fetchUsuarios();
                                setUsuarioEliminando(null);
                            }}
                        />
                        <button 
                            className="mt-6 w-full text-center py-4 border border-white/10 rounded-2xl bg-white/5 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-sans uppercase tracking-[0.1em]" 
                            onClick={() => setUsuarioEliminando(null)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
);

};

export default ListaUsuarios;
