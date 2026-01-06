"use client";

import React, { useEffect, useState } from "react";
import EliminarCategoria from "./EliminarCategoria";
import FormularioModificarCategoria from "./FormularioModificarCategoria";
import FormularioCategoria from "./FormularioCategoria";
import { manejarError } from '../../../utils/ManejarError';
import { useRouter } from "next/navigation";

/*
  ListaCategorias.tsx
  - Componente que muestra la lista de categorías y permite crear, editar y eliminar.
  - Todas las peticiones fetch usan credentials: 'include' para enviar cookies de sesión
    (útil cuando la autenticación se maneja con cookies HttpOnly).
  - manejarError centraliza la redirección a /error cuando la respuesta HTTP no es OK.
*/

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/categorias";

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
        manejarError(res, router);

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
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow border border-gray-200">
      {/* Formulario para crear una nueva categoría */}
      <FormularioCategoria onCreado={fetchCategorias} />

      {/* Lista de categorías */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Lista de Categorías
      </h2>

      {/* Muestra el estado */}
      {cargando && <p className="text-gray-600">Cargando categorías...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Genera la tabla al terminar de cargar y si no hay errores */}
      {!cargando && !error && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-700">
              <th className="p-2 border">ID Categoría</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr
                key={categoria.id_categoria}
                className="text-sm text-gray-800 hover:bg-gray-50"
              >
                <td className="p-2 border">{categoria.id_categoria}</td>
                <td className="p-2 border">{categoria.nombre}</td>
                <td className="p-2 border">
                  {/* BOTONES EDITAR Y ELIMINAR */}
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => setCategoriaEditando(categoria)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => setCategoriaEliminando(categoria)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {categoriaEditando && (
        <div className="mt-6">
          <FormularioModificarCategoria
            idCategoria={categoriaEditando.id_categoria}
            nombreActual={categoriaEditando.nombre}
            onModificado={() => {
              fetchCategorias(); // Actualiza la lista
              setCategoriaEditando(null); // Cierra el formulario
            }}
          />
        </div>
      )}

      {categoriaEliminando && (
        <div className="mt-6">
          <EliminarCategoria
            idCategoria={categoriaEliminando.id_categoria}
            onEliminado={() => {
              fetchCategorias(); // Actualiza la lista
              setCategoriaEliminando(null); // Oculta la confirmación
            }}
          />

          <button
            className="text-sm text-gray-500 hover:underline mt-2"
            onClick={() => setCategoriaEliminando(null)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default ListaCategorias;
