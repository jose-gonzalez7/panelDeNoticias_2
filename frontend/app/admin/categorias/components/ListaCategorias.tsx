"use client";

import React, { useEffect, useState } from "react";
import EliminarCategoria from "./EliminarCategoria";
import FormularioModificarCategoria from "./FormularioModificarCategoria";
import FormularioCategoria from "./FormularioCategoria";
import { manejarError } from "../../../utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

/*
  ListaCategorias.tsx
  - Componente que muestra la lista de categorías y permite crear, editar y eliminar.
  - Todas las peticiones fetch usan credentials: 'include' para enviar cookies de sesión
    (útil cuando la autenticación se maneja con cookies HttpOnly).
  - manejarError centraliza la redirección a /error cuando la respuesta HTTP no es OK.
*/

const URL = `${API_BASE}/categorias`;

// Interfaz de la estructura de la categoría
interface Categoria {

  id_categoria: string;
  nombre: string;

}

// Componente principal 
const ListaCategorias = () => {

  const router = useRouter();

  //Estado local
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Lista de categorías
  const [cargando, setCargando] = useState(true); // Indica si se está esperando una respuesta
  const [error, setError] = useState(""); // Almacena los mensajes de error
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(
    null
  ); // Almacena la categoría que está siendo editada
  const [categoriaEliminando, setCategoriaEliminando] =
    useState<Categoria | null>(null); // Almacena la categoría que está siendo eliminada

  // Obtiene la lista de categorias
  const fetchCategorias = async () => {

    setCargando(true);
    setError("");

    try {

      // Solicitud al servidor para obtener las categorías
      const res = await fetch(URL, {

            method: "GET",
            credentials: "include", //Enviar cookies

        });

        // Manejo de errores HTTP
        await manejarError(res, router);

      // Obtiene las categorías y las parsea a JSON
      const data = await res.json();

      // Verifica que las categorías se hayan obtenido correctamente
      if (res.ok && Array.isArray(data)) {

        setCategorias(data);

      } else {

        setError("Error al obtener categorías.");

      }

    } catch (error) { //Error de red u otros

      setError("Error de conexión con el servidor.");

    } finally {

      // Finaliza la carga
      setCargando(false);

    }
  };

  //Carga las categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Parte visible

  return (
    <div className="w-full z-10 space-y-12">
      
      {/* Formulario para crear una nueva categoría */}
      <FormularioCategoria onCreado={fetchCategorias} />

      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-white tracking-tight flex items-center">
          <span className="w-1.5 h-6 bg-[#F2A931] rounded-full mr-3 border border-white/20"></span>
          Lista de Categorías
        </h2>

        {cargando && <p className="text-[#F2A931] animate-[pulse_1.5s_ease-in-out_infinite] font-semibold tracking-wide">Cargando categorías...</p>}
        {error && <div className="p-5 rounded-[1.5rem] bg-red-900/30 border border-red-500/30 text-red-200 backdrop-blur-md shadow-lg font-medium">{error}</div>}

        {!cargando && !error && (
          <div className="relative group/table mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-[#F2A931] rounded-[2rem] blur opacity-10 group-hover/table:opacity-20 transition-opacity duration-500"></div>
            <div className="overflow-x-auto rounded-[2rem] border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-[#0a0f1a]/60 backdrop-blur-2xl relative z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A931]/5 rounded-full blur-2xl pointer-events-none"></div>
              <table className="w-full min-w-[500px] table-auto border-collapse relative z-10">
                <thead>
                  <tr className="bg-[#1e293b]/40 text-left text-[11px] uppercase tracking-[0.2em] text-slate-400 border-b border-white/5">
                    <th className="px-6 py-5 font-bold">ID Categoría</th>
                    <th className="px-6 py-5 font-bold">Nombre</th>
                    <th className="px-6 py-5 font-bold text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {categorias.map((categoria) => (
                    <tr
                      key={categoria.id_categoria}
                      className="text-sm hover:bg-[#1e293b]/30 transition-colors"
                    >
                      <td className="px-6 py-5 font-mono font-bold text-[#F2A931] whitespace-nowrap">
                        {categoria.id_categoria}
                      </td>
                      <td className="px-6 py-5 font-semibold text-gray-200 whitespace-nowrap">
                        {categoria.nombre}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center gap-6">
                          <button
                            className="text-slate-400 font-bold hover:text-[#F2A931] transition-colors underline-offset-4 hover:underline whitespace-nowrap"
                            onClick={() => setCategoriaEditando(categoria)}
                          >
                            Editar
                          </button>
                          <button
                            className="text-slate-500 font-bold hover:text-red-400 transition-colors underline-offset-4 hover:underline whitespace-nowrap"
                            onClick={() => setCategoriaEliminando(categoria)}
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

        {categoriaEditando && (
          <div className="mt-10 mb-10 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-blue-600/30 rounded-[2rem] blur opacity-15"></div>
            <div className="p-8 rounded-[2rem] bg-[#0a0f1a]/80 border border-white/5 shadow-2xl backdrop-blur-2xl relative z-10">
              <FormularioModificarCategoria
                idCategoria={categoriaEditando.id_categoria}
                nombreActual={categoriaEditando.nombre}
                onModificado={() => {
                  fetchCategorias(); 
                  setCategoriaEditando(null); 
                }}
              />
            </div>
          </div>
        )}

        {categoriaEliminando && (
          <div className="mt-10 mb-10 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-[#F2A931] rounded-[2rem] blur opacity-15"></div>
            <div className="p-8 rounded-[2rem] bg-[#0a0f1a]/80 border border-red-500/20 shadow-2xl backdrop-blur-2xl relative z-10">
              <EliminarCategoria
                idCategoria={categoriaEliminando.id_categoria}
                onEliminado={() => {
                  fetchCategorias();
                  setCategoriaEliminando(null);
                }}
              />

              <button
                className="mt-6 w-full text-center py-4 border border-white/10 rounded-2xl bg-white/5 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-sans uppercase tracking-[0.1em]"
                onClick={() => setCategoriaEliminando(null)}
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

export default ListaCategorias;
