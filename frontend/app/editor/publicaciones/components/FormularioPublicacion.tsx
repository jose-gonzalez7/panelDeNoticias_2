"use client";

import React, { useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";

/*
  FormularioPublicacion.tsx
  - Componente controlado para crear una nueva publicación.
  - Envía la petición POST al endpoint de publicaciones usando fetch.
  - Usa credentials: 'include' para enviar cookies (útil si la sesión/auth se guarda en cookie HttpOnly).
  - manejarError se encarga de redirigir en caso de respuestas HTTP no autorizadas/u otros errores.
*/

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/publicaciones";

// Props que recibe el componente para actualizar la lista al crear un componente
interface Props {

  onCreado?: () => void; // Actualiza la lista al crear una publicación

}

const FormularioPublicacion: React.FC<Props> = ({ onCreado }) => {

  // Estado que almacena los datos de la nueva publicación
  const [formData, setFormData] = useState({

    id_publicacion: "",
    titulo: "",
    cuerpo: "",
    id_categoria: "",
    fecha_inicio: "",
    fecha_fin: "",
    prioridad: "",
    adjuntos: "",
    etiquetas: "",

  });

  const router = useRouter();

  const [mensaje, setMensaje] = useState(""); // Mensaje de resultado

  // Función que maneja los cambios en los campos del formulario
  const handleChange = (

    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  
  ) => {

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  
  };

  // Solicitud de creación de la publicación al servidor
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      // Solicitud al servidor para crear la publicación
      const crearRes = await fetch(URL, {

        method: "POST",
        credentials: "include", //Enviar cookies
        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify(formData),

      });

      // Maneja errores HTTP
      manejarError(crearRes, router);

      // Respuesta del servidor parseada a JSON
      const crearData = await crearRes.json();

      if (crearRes.ok) { // Éxito: notificar, limpiar formulario y llamar callback si existe

        setMensaje("Publicación creada.");
        setTimeout(() => setMensaje(""), 3000); // Oculta el mensaje al pasar un rato
        if (onCreado) onCreado(); // Actualiza la lista de publicaciones
        setFormData({
          id_publicacion: "",
          titulo: "",
          cuerpo: "",
          id_categoria: "",
          fecha_inicio: "",
          fecha_fin: "",
          prioridad: "",
          adjuntos: "",
          etiquetas: "",
        });

      } else {

        //Muestra mensaje de error
        setMensaje(crearData.message || "Error al crear publicación.");
      
      }

    } catch (error) {

      //Error de red u otros
      setMensaje("Error de conexión con el servidor.");
    
    }
  };

  //Parte visible

  return (
    // Formulario de creación de publicación
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-800">Crear Publicación</h2>

      {/* ID Publicación */}
      <div>
        <label htmlFor="id_publicacion" className="block text-sm font-medium text-gray-700">
          ID Publicación
        </label>
        <input
          type="text"
          id="id_publicacion"
          name="id_publicacion"
          value={formData.id_publicacion}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Título */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cuerpo */}
      <div>
        <label htmlFor="cuerpo" className="block text-sm font-medium text-gray-700">
          Cuerpo
        </label>
        <textarea
          id="cuerpo"
          name="cuerpo"
          value={formData.cuerpo}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="id_categoria" className="block text-sm font-medium text-gray-700">
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

      {/* Fechas */}
      <div>
        <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
          Fecha Inicio
        </label>
        <input
          type="date"
          id="fecha_inicio"
          name="fecha_inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700">
          Fecha Fin
        </label>
        <input
          type="date"
          id="fecha_fin"
          name="fecha_fin"
          value={formData.fecha_fin}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Prioridad */}
      <div>
        <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">
          Prioridad
        </label>
        <select
          id="prioridad"
          name="prioridad"
          value={formData.prioridad}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione prioridad</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      {/* Adjuntos */}
      <div>
        <label htmlFor="adjuntos" className="block text-sm font-medium text-gray-700">
          Adjuntos
        </label>
        <input
          type="text"
          id="adjuntos"
          name="adjuntos"
          value={formData.adjuntos}
          onChange={handleChange}
          placeholder="URLs o nombres de archivos"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Etiquetas */}
      <div>
        <label htmlFor="etiquetas" className="block text-sm font-medium text-gray-700">
          Etiquetas
        </label>
        <input
          type="text"
          id="etiquetas"
          name="etiquetas"
          value={formData.etiquetas}
          onChange={handleChange}
          placeholder="Separadas por comas"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botón de crear publicación */}
      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-500 transition"
      >
        Crear Publicación
      </button>

      {/* Mensaje */}
      {mensaje && <p className="text-sm text-gray-600 mt-2">{mensaje}</p>}
    </form>
  );
};

export default FormularioPublicacion;
