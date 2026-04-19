"use client";

import React, { useEffect, useState } from "react";
import EliminarUsuarios from "./EliminarUsuarios";
import FormularioModificarUsuario from "./FormularioModificarUsuario";
import FormularioUsuario from "./FormularioUsuario";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

const URL = `${API_BASE}/usuarios/admin`;

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
        await manejarError(res, router);

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
    <div className="w-full z-10 space-y-8">

        <FormularioUsuario onCreado={fetchUsuarios}/>

        <div>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#0F172A] tracking-tight flex items-center">
              <span className="w-1.5 h-6 bg-[#1E3A8A] rounded-full mr-3"></span>
              Lista de Usuarios
            </h2>

            {cargando && <p className="text-[#64748B] font-semibold tracking-wide">Cargando usuarios...</p>}
            {error && <div className="p-4 rounded bg-red-100 border border-red-200 text-red-700 font-medium">{error}</div>}

            {!cargando && !error && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto mb-10">
                    <table className="w-full min-w-[600px] table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-left text-xs uppercase tracking-wider text-[#64748B] border-b border-gray-200">
                                <th className="px-6 py-4 font-semibold">Nombre</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Rol</th>
                                <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {usuarios.map((usuario, index) => (
                                <tr
                                    key={usuario.email || `usuario-${usuario.id}-${index}`}
                                    className="text-sm hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-[#0F172A] whitespace-nowrap">{usuario.nombre}</td>
                                    <td className="px-6 py-4 text-[#64748B] whitespace-nowrap">{usuario.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-md bg-[#1E3A8A]/10 text-[#1E3A8A] text-xs font-semibold uppercase tracking-wider">
                                            {usuario.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-4">
                                            <button 
                                                className="text-[#3B82F6] font-medium hover:text-blue-800 transition-colors cursor-pointer" 
                                                onClick={() => setUsuarioEditando(usuario)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="text-[#EF4444] font-medium hover:text-red-800 transition-colors cursor-pointer" 
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
            )}

            {usuarioEditando && (
                <div className="mt-8 mb-8">
                    <div className="p-8 rounded-lg bg-white border border-gray-200">
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
                <div className="mt-8 mb-8">
                    <div className="p-8 rounded-lg bg-white border border-red-200">
                        <EliminarUsuarios 
                            email={usuarioEliminando.email} 
                            onEliminado={() => {
                                fetchUsuarios();
                                setUsuarioEliminando(null);
                            }}
                        />
                        <button 
                            className="mt-4 w-full py-2 border border-gray-300 rounded text-sm font-semibold text-[#64748B] hover:bg-gray-50 transition-colors cursor-pointer" 
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
