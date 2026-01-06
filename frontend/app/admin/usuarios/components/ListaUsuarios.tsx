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
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow border border-gray-200">

        {/* Formulario para crear un nuevo usuario */}
        <FormularioUsuario onCreado={fetchUsuarios}/>

        {/*Lista de usuarios*/}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Usuarios</h2>

        {/*Muestra el estado*/}
        {cargando && <p className="text-gray-600">Cargando usuarios...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Genera la tabla al terminar de cargar y si no hay errores*/}
        {!cargando && !error && (

        <table className="w-full table-auto border-collapse">

            <thead>

                <tr className="bg-gray-100 text-left text-sm text-gray-700">

                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Rol</th>
                <th className="p-2 border">Acciones</th>

                </tr>

            </thead>

            <tbody>

                {usuarios.map((usuario) => (

                <tr key={usuario.id} className="text-sm text-gray-800 hover:bg-gray-50">

                    <td className="p-2 border">{usuario.nombre}</td>
                    <td className="p-2 border">{usuario.email}</td>
                    <td className="p-2 border capitalize">{usuario.rol}</td>
                    <td className="p-2 border">

                    {/* BOTONES EDITAR Y ELIMINAR */}
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => setUsuarioEditando(usuario)}>

                        Editar

                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => setUsuarioEliminando(usuario)}>

                        Eliminar

                    </button>


                    </td>

                </tr>

            ))}

            </tbody>

        </table>

    )}

    {usuarioEditando && (

        <div className="mt-6">

            <FormularioModificarUsuario nombreActual={usuarioEditando.nombre} email={usuarioEditando.email} 
            onModificado={() => {
            fetchUsuarios(); //Actualiza la lista
            setUsuarioEditando(null); //Cierra el formulario
            }}
            />

        </div>

    )}

    {usuarioEliminando && (

        <div className="mt-6">

            <EliminarUsuarios email={usuarioEliminando.email} 
            onEliminado={() => {
            fetchUsuarios(); //Actualiza la lista
            setUsuarioEliminando(null); //Oculta la confirmación
            }}
            />

            <button className="text-sm text-gray-500 hover:underline mt-2" onClick={() => setUsuarioEliminando(null)}>

                Cancelar

            </button>

        </div>

    )}

    </div>

);

};

export default ListaUsuarios;
