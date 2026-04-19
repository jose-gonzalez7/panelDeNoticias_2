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
    <div className="w-full z-10 space-y-8">
      
      {/* Formulario para crear una nueva categoría */}
      <FormularioCategoria categorias={categorias} onCreado={fetchCategorias} />

      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#0F172A] tracking-tight flex items-center">
          <span className="w-1.5 h-6 bg-[#1E3A8A] rounded-full mr-3"></span>
          Lista de Categorías
        </h2>

        {cargando && <p className="text-[#64748B] font-semibold tracking-wide">Cargando categorías...</p>}
        {error && <div className="p-4 rounded bg-red-100 border border-red-200 text-red-700 font-medium">{error}</div>}

        {!cargando && !error && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto mb-10">
            <table className="w-full min-w-[500px] table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase tracking-wider text-[#64748B] border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold">ID Categoría</th>
                  <th className="px-6 py-4 font-semibold">Nombre</th>
                  <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {categorias.map((categoria) => (
                  <tr
                    key={categoria.id_categoria}
                    className="text-sm hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#1E3A8A] whitespace-nowrap">
                      {categoria.id_categoria}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0F172A] whitespace-nowrap">
                      {categoria.nombre}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          className="text-[#3B82F6] font-medium hover:text-blue-800 transition-colors cursor-pointer"
                          onClick={() => setCategoriaEditando(categoria)}
                        >
                          Editar
                        </button>
                        <button
                          className="text-[#EF4444] font-medium hover:text-red-800 transition-colors cursor-pointer"
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
        )}

        {categoriaEditando && (
          <div className="mt-8 mb-8">
            <div className="p-8 rounded-lg bg-white border border-gray-200">
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
          <div className="mt-8 mb-8">
            <div className="p-8 rounded-lg bg-white border border-red-200">
              <EliminarCategoria
                idCategoria={categoriaEliminando.id_categoria}
                onEliminado={() => {
                  fetchCategorias();
                  setCategoriaEliminando(null);
                }}
              />

              <button
                className="mt-4 w-full py-2 border border-gray-300 rounded text-sm font-semibold text-[#64748B] hover:bg-gray-50 transition-colors cursor-pointer"
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
