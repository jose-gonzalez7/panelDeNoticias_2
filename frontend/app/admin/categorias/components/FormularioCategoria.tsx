"use client";

import React, { useState } from "react";
import { manejarError } from "../../../utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

/**
 * FormularioCategoria.tsx
 *
 * Componente para crear una nueva categoría.
 * - Envía POST a /api/categorias.
 * - Usa credentials: 'include' para que el navegador adjunte cookies de sesión
 *   (útil cuando la autenticación se maneja con cookie HttpOnly).
 * - manejarError centraliza la redirección a /error si la respuesta HTTP no es OK.
 */

const URL = `${API_BASE}/categorias`;

function calcularSiguienteID(items: any[], idKey: string, defaultPrefix: string) {
  if (!items || items.length === 0) return `${defaultPrefix}01`;
  let maxNum = 0;
  let prefix = defaultPrefix;

  for (const item of items) {
    const id = item[idKey] || "";
    const match = id.match(/^(.*?)(\d+)$/);
    if (match) {
      const num = parseInt(match[2], 10);
      if (num > maxNum) {
        maxNum = num;
        prefix = match[1];
      }
    }
  }

  const nextNum = maxNum + 1;
  return `${prefix}${nextNum.toString().padStart(2, '0')}`;
}

// Props que recibe el componente
interface Props {
  categorias?: any[];
  onCreado?: () => void; // Actualiza la lista al crear una categoría
}

const FormularioCategoria: React.FC<Props> = ({ categorias, onCreado }) => {

  const router = useRouter();

  // Estado local que almacena los datos de la nueva categoría
  const [formData, setFormData] = useState({

    id_categoria: "",
    nombre: "",

  });

  const [mensaje, setMensaje] = useState(""); // Mensaje de estado

  // Calcula automáticamente el ID al recibir nuevas categorías
  React.useEffect(() => {
    if (categorias) {
      const nextId = calcularSiguienteID(categorias, "id_categoria", "cat_");
      setFormData((prev) => ({ ...prev, id_categoria: nextId }));
    }
  }, [categorias]);

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
      await manejarError(crearRes, router);

      if (crearRes.ok) {

        // Si todo es correcto lo indica
        setMensaje("Categoría creada.");
        setTimeout(() => setMensaje(""), 3000); // Oculta el mensaje al pasar un rato
        if (onCreado) onCreado(); // Actualiza la lista de categorías
        setFormData(prev => ({
          ...prev,
          nombre: "",
        }));

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
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-5 bg-white p-8 rounded-lg border border-gray-200 mb-10"
    >
      <h2 className="text-xl font-bold text-[#0F172A] border-b border-gray-200 pb-4">
        Crear Categoría<span className="text-[#F59E0B]">.</span>
      </h2>

      <div className="flex flex-col space-y-1">
        <label
          htmlFor="id_categoria"
          className="text-sm font-medium text-[#0F172A]"
        >
          ID Categoría
        </label>
        <input
          type="text"
          id="id_categoria"
          name="id_categoria"
          value={formData.id_categoria}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-[#64748B] focus:outline-none cursor-not-allowed"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label
          htmlFor="nombre"
          className="text-sm font-medium text-[#0F172A]"
        >
          Nombre de la Categoría
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          placeholder="Ej: Tecnología"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-[#1E3A8A] text-white font-medium py-2.5 rounded-md hover:bg-blue-800 transition-colors cursor-pointer flex justify-center items-center"
        >
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

export default FormularioCategoria;

