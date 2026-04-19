"use client";

import React, { useEffect, useState } from "react";
import { manejarError } from "@/app/utils/ManejarError";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

/*
  FormularioPublicacion.tsx
  - Componente controlado para crear una nueva publicación.
  - Envía la petición POST al endpoint de publicaciones usando fetch.
  - Usa credentials: 'include' para enviar cookies (útil si la sesión/auth se guarda en cookie HttpOnly).
  - manejarError se encarga de redirigir en caso de respuestas HTTP no autorizadas/u otros errores.
*/

const URL = `${API_BASE}/publicaciones`;
const URL_CATEGORIAS = `${API_BASE}/categorias`;

type Categoria = { id_categoria: string; nombre: string };

function calcularSiguienteID(items: any[], idKey: string, defaultPrefix: string) {
    if (!items || items.length === 0) return `${defaultPrefix}001`;
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
    return `${prefix}${nextNum.toString().padStart(3, '0')}`;
}

interface Props {
  publicaciones?: any[];
  onCreado?: () => void; // Actualiza la lista al crear una publicación
}

const FormularioPublicacion: React.FC<Props> = ({ publicaciones, onCreado }) => {

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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);

  // Calcula automáticamente el ID al recibir nuevas publicaciones
  useEffect(() => {
    if (publicaciones) {
      const nextId = calcularSiguienteID(publicaciones, "id_publicacion", "pub_");
      setFormData((prev) => ({ ...prev, id_publicacion: nextId }));
    }
  }, [publicaciones]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(URL_CATEGORIAS, {
          method: "GET",
          credentials: "include",
        });
        if (res.status === 401 || res.status === 403) {
          manejarError(res, router);
          return;
        }
        const data = await res.json();
        if (!cancel && Array.isArray(data)) {
          setCategorias(data);
        }
      } catch {
        if (!cancel) {
          setMensaje("No se pudieron cargar las categorías. Recarga la página.");
        }
      } finally {
        if (!cancel) setCargandoCategorias(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [router]);

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

      if (crearRes.status === 401 || crearRes.status === 403) {
        manejarError(crearRes, router);
      }

      const crearData = await crearRes.json();

      if (crearRes.ok) { // Éxito: notificar, limpiar formulario y llamar callback si existe

        setMensaje("Publicación creada.");
        setTimeout(() => setMensaje(""), 3000); // Oculta el mensaje al pasar un rato
        if (onCreado) onCreado(); // Actualiza la lista de publicaciones
        setFormData(prev => ({
          ...prev,
          titulo: "",
          cuerpo: "",
          id_categoria: "",
          fecha_inicio: "",
          fecha_fin: "",
          prioridad: "",
          adjuntos: "",
          etiquetas: "",
        }));

      } else {

        setMensaje(
          crearData.error || crearData.message || "Error al crear publicación."
        );
      
      }

    } catch {

      setMensaje("Error de conexión con el servidor.");
    
    }
  };

  //Parte visible

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-5 bg-white p-8 rounded-lg border border-gray-200 mb-10">
        <h2 className="text-xl font-bold text-[#0F172A] border-b border-gray-200 pb-4">
            Crear Publicación<span className="text-[#F59E0B]">.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
                <label htmlFor="id_publicacion" className="text-sm font-medium text-[#0F172A]">ID Publicación</label>
                <input type="text" id="id_publicacion" name="id_publicacion" value={formData.id_publicacion} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-[#64748B] focus:outline-none cursor-not-allowed"/>
            </div>

            <div className="flex flex-col space-y-1">
                <label htmlFor="id_categoria" className="text-sm font-medium text-[#0F172A]">Categoría</label>
                <select
                    id="id_categoria"
                    name="id_categoria"
                    value={formData.id_categoria}
                    onChange={handleChange}
                    required
                    disabled={cargandoCategorias || categorias.length === 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer appearance-none disabled:opacity-50"
                >
                    <option value="">
                        {cargandoCategorias
                            ? "Cargando categorías…"
                            : categorias.length === 0
                            ? "No hay categorías (créalas en Administración)"
                            : "Seleccione una categoría"}
                    </option>
                    {categorias.map((c) => (
                        <option key={c.id_categoria} value={c.id_categoria}>
                            {c.nombre} ({c.id_categoria})
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="flex flex-col space-y-1 md:col-span-2">
                <label htmlFor="titulo" className="text-sm font-medium text-[#0F172A]">Título</label>
                <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400"/>
            </div>

            <div className="flex flex-col space-y-1 md:col-span-2">
                <label htmlFor="cuerpo" className="text-sm font-medium text-[#0F172A]">Cuerpo</label>
                <textarea id="cuerpo" name="cuerpo" value={formData.cuerpo} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400 min-h-[120px] resize-y"/>
            </div>

            <div className="flex flex-col space-y-1">
                <label htmlFor="fecha_inicio" className="text-sm font-medium text-[#0F172A]">Fecha Inicio</label>
                <input type="date" id="fecha_inicio" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400"/>
            </div>

            <div className="flex flex-col space-y-1">
                <label htmlFor="fecha_fin" className="text-sm font-medium text-[#0F172A]">Fecha Fin</label>
                <input type="date" id="fecha_fin" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400"/>
            </div>

            <div className="flex flex-col space-y-1">
                <label htmlFor="prioridad" className="text-sm font-medium text-[#0F172A]">Prioridad</label>
                <select id="prioridad" name="prioridad" value={formData.prioridad} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer appearance-none">
                    <option value="">Seleccione prioridad</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                </select>
            </div>

            <div className="flex flex-col space-y-1">
                <label htmlFor="adjuntos" className="text-sm font-medium text-[#0F172A]">Adjuntos (Opcional)</label>
                <input type="text" id="adjuntos" name="adjuntos" value={formData.adjuntos} onChange={handleChange} placeholder="URLs o nombres" className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400"/>
            </div>

            <div className="flex flex-col space-y-1 md:col-span-2">
                <label htmlFor="etiquetas" className="text-sm font-medium text-[#0F172A]">Etiquetas</label>
                <input type="text" id="etiquetas" name="etiquetas" value={formData.etiquetas} onChange={handleChange} placeholder="Separadas por comas" className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400"/>
            </div>
        </div>

        <div className="pt-4">
            <button type="submit" className="w-full bg-[#1E3A8A] text-white font-medium py-2.5 rounded-md hover:bg-blue-800 transition-colors cursor-pointer flex justify-center items-center">
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

export default FormularioPublicacion;
