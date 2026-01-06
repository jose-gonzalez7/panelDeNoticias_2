"use client";

import React, { useState } from "react";
import { manejarError } from '../../../utils/ManejarError';
import { useRouter } from "next/navigation";

/**
 * FormularioCategoria.tsx
 *
 * Componente para crear una nueva categoría.
 * - Envía POST a /api/categorias.
 * - Usa credentials: 'include' para que el navegador adjunte cookies de sesión
 *   (útil cuando la autenticación se maneja con cookie HttpOnly).
 * - manejarError centraliza la redirección a /error si la respuesta HTTP no es OK.
 */

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/categorias";

// Props que recibe el componente
interface Props {

  onCreado?: () => void; // Actualiza la lista al crear una categoría

}

const FormularioCategoria: React.FC<Props> = ({ onCreado }) => {

  const router = useRouter();

  // Estado local que almacena los datos de la nueva categoría
  const [formData, setFormData] = useState({

    id_categoria: "",
    nombre: "",

  });

  const [mensaje, setMensaje] = useState(""); // Mensaje de estado

  // Función que maneja los cambios en los campos del formulario
  const handleChange = (

    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>

  ) => {

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  };

  // Función que previene envío por defecto del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    try {

      // Solicitud al servidor para crear la categoría
      const crearRes = await fetch(URL, {

        method: "POST",
        credentials: "include", //Enviar cookies
        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify(formData),

      });

      // Manejo de errores HTTP
      manejarError(crearRes, router);

      if (crearRes.ok) {

        // Si todo es correcto lo indica
        setMensaje("Categoría creada.");
        setTimeout(() => setMensaje(""), 3000); // Oculta el mensaje al pasar un rato
        if (onCreado) onCreado(); // Actualiza la lista de categorías
        setFormData({

          id_categoria: "",
          nombre: "",

        });

      } else {

        // Si no muestra el error
        setMensaje("Error al crear categoría.");
      }
    } catch (error) {

      // Si no logra conectarse con el servidor lo indica
      setMensaje("Error de conexión con el servidor.");

    }

  };

  //Parte visible
  return (
    // Formulario de creación de categoría
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-800">Crear Categoría</h2>

      {/* ID Categoría */}
      <div>
        <label
          htmlFor="id_categoria"
          className="block text-sm font-medium text-gray-700"
        >
          ID Categoría
        </label>
        <input
          type="text"
          id="id_categoria"
          name="id_categoria"
          value={formData.id_categoria}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botón de crear categoría */}
      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 transition"
      >
        Crear Categoría
      </button>

      {/* Mensaje */}
      {mensaje && <p className="text-sm text-gray-600 mt-2">{mensaje}</p>}
    </form>
  );
};

export default FormularioCategoria;

