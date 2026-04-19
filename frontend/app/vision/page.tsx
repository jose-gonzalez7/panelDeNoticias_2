"use client";
import { useState, useEffect } from "react";
import Publicacion from "@/components/Publicacion";
import { FaPowerOff, FaList, FaRegImage } from "react-icons/fa";
import { API_BASE } from "@/lib/api";

type publicacion = {
  titulo: string;
  cuerpo: string;
  fecha_fin: string;
  fecha_inicio: string;
  etiquetas: string;
  prioridad: string;
};

const URL = `${API_BASE}/publicaciones`;

async function mandarAapi(): Promise<publicacion[]> {
  try {
    // Enviar con fetch a la API
    const response = await fetch(URL, {
      credentials: "include",
    });

    // Intentar obtener el JSON de la respuesta

    const respuestajson = await response.json();
    console.log("Respuesta de la API:", respuestajson);


    const arraypublicaciones: publicacion[] = []
    respuestajson.forEach((element: publicacion) => {
      let publicacionaux: publicacion = {
        titulo: element.titulo,
        cuerpo: element.cuerpo,
        etiquetas: element.etiquetas,
        fecha_fin: element.fecha_fin,
        fecha_inicio: element.fecha_fin,
        prioridad: element.prioridad
      };
      arraypublicaciones.push(publicacionaux);
    });

    return arraypublicaciones;

  } catch (error) {
    // Captura cualquier error 
    return [];
  }
}

export default function Home() {

  const [publicaciones, setpublicaciones] = useState<publicacion[]>([]);
  const [prioridad, setprioridad] = useState("nada");
  const [buscador, setbuscador] = useState("");
  const [sliderIndex, setSliderIndex] = useState(0);
  const [vistaActual, setVistaActual] = useState<"slider" | "lista">("slider");

  function toggleVista() {
    setVistaActual(prev => prev === "slider" ? "lista" : "slider");
  }

  useEffect(() => {
    let mounted = true;

    const fetcher = async () => {
      const llamada = await mandarAapi();
      if (!mounted) return;
      setpublicaciones(llamada);
    };

    fetcher()

    //const id = setInterval(fetcher, 5000);

    return () => {
      mounted = false;
      //clearInterval(id);
    };
  }, []);

  // Slider automático
  useEffect(() => {
    if (publicaciones.length === 0) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % publicaciones.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [publicaciones]);

  function resetearParametros() {
    setbuscador("");
    setprioridad("nada")
  }

  function cambiarbuscador(frase: string) {
    setbuscador(frase)
    console.log(frase)
  }

  function comprobarBusqueda(busqueda: string, titulo: string): boolean {
    let comprobar = false;
    let titformateado = titulo.toLowerCase()
    let busformateada = busqueda.toLowerCase()

    if (titformateado.includes(busformateada)) {
      comprobar = true
    }

    return comprobar;
  }

  return (
    <>
      {/* Botón flotante para cambiar de vista */}
      <button
        onClick={toggleVista}
        title={vistaActual === "slider" ? "Ver Lista con Filtros" : "Ver Slider de Publicaciones"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E3A8A] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#1e40af] active:scale-95 cursor-pointer"
      >
        {vistaActual === "slider" ? <FaList size={22} /> : <FaRegImage size={24} />}
      </button>

      {/* Carrusel / Slider de Noticias */}
      {vistaActual === "slider" && publicaciones.length > 0 && (
        <section className="relative w-full h-[100vh] flex items-center justify-center bg-white overflow-hidden">
          {publicaciones.map((pub, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center p-8 md:p-16 lg:p-24 ${idx === sliderIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              <div className="w-full max-w-7xl flex flex-col items-center text-center">
                <div className="flex justify-center mb-6">
                  <span className={`px-4 py-1.5 rounded-sm text-sm font-bold uppercase tracking-widest ${pub.prioridad.toLowerCase() === 'alta' ? 'bg-red-50 text-red-600 border border-red-200' :
                    pub.prioridad.toLowerCase() === 'media' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      pub.prioridad.toLowerCase() === 'baja' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        'bg-gray-100 text-[#64748B] border border-gray-200'
                    }`}>
                    Prioridad {pub.prioridad}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#0F172A] leading-tight max-w-5xl">
                  {pub.titulo}
                </h1>
                <p className="text-xl md:text-2xl text-[#64748B] max-w-4xl mx-auto mt-8 leading-relaxed line-clamp-4">
                  {pub.cuerpo}
                </p>
                {(pub.fecha_inicio || pub.fecha_fin) && (
                  <div className="text-[#64748B] text-lg mt-10 font-medium">
                    {pub.fecha_inicio && new Date(pub.fecha_inicio).toLocaleDateString()}
                    {pub.fecha_inicio && pub.fecha_fin && " - "}
                    {pub.fecha_fin && new Date(pub.fecha_fin).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Indicadores del Slider */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
            {publicaciones.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSliderIndex(idx)}
                aria-label={`Ver noticia ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === sliderIndex ? "bg-[#1E3A8A] w-8" : "bg-gray-300 hover:bg-gray-400 w-2"
                  }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Contenido Anterior */}
      {vistaActual === "lista" && (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

          <header className="sticky top-0 z-30 flex justify-end border-b border-gray-200 bg-white px-4 py-3 md:px-8 shadow-sm">
            <a
              href="/login"
              title="Cerrar sesión"
              className="flex h-10 items-center justify-center gap-3 rounded-md px-4 py-2 text-sm font-semibold text-[#64748B] transition-colors hover:bg-red-50 hover:text-[#EF4444] md:min-w-[140px] md:justify-start cursor-pointer border border-transparent"
            >
              <FaPowerOff className="h-4 w-4" />
              <p className="hidden md:block">Cerrar Sesión</p>
            </a>
          </header>

          <div className="w-full flex items-start justify-center pt-10 px-4 md:px-8 pb-12">
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Modificadores (Filtros, Izquierda) */}
              <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm relative">

                    <h2 className="text-lg font-bold text-[#0F172A] tracking-wider uppercase mb-6 border-b border-gray-200 pb-3">
                      Filtros
                    </h2>

                    {/* Buscador */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">Buscar Título</label>
                      <input onChange={(e) => { cambiarbuscador(e.target.value) }} type="text" placeholder="Ej. Noticias..." className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400" />
                    </div>

                    {/* Prioridad */}
                    <div className="flex flex-col gap-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">Por Prioridad</label>

                      <button onClick={() => { setprioridad("alta") }} className={`w-full rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border ${prioridad === 'alta' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-[#64748B] border-gray-200 hover:bg-gray-50'}`}>
                        Prioridad Alta
                      </button>
                      <button onClick={() => { setprioridad("media") }} className={`w-full rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border ${prioridad === 'media' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-white text-[#64748B] border-gray-200 hover:bg-gray-50'}`}>
                        Prioridad Media
                      </button>
                      <button onClick={() => { setprioridad("baja") }} className={`w-full rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border ${prioridad === 'baja' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-[#64748B] border-gray-200 hover:bg-gray-50'}`}>
                        Prioridad Baja
                      </button>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button onClick={() => { resetearParametros() }} className="w-full rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer bg-white text-[#64748B] border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2">
                          Restablecer Filtros
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Publicaciones (Derecha) */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-gray-200 rounded-lg px-6 py-4 shadow-sm gap-4">
                  <p className="text-sm text-[#0F172A] font-medium">
                    Explora las publicaciones disponibles.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {prioridad !== "nada" && <span className="px-3 py-1 bg-gray-100 text-[#0F172A] border border-gray-200 rounded text-xs font-semibold uppercase tracking-wide flex items-center gap-2">Prio: {prioridad}</span>}
                    {buscador !== "" && <span className="px-3 py-1 bg-gray-100 text-[#0F172A] border border-gray-200 rounded text-xs font-semibold uppercase tracking-wide flex items-center gap-2">Búsqueda: {buscador}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  {
                    publicaciones.filter(publicacion => {
                      const coincidePrioridad = prioridad === "nada" || prioridad === publicacion.prioridad
                      const coincideBusqueda = buscador === "" || comprobarBusqueda(buscador, publicacion.titulo)
                      return coincidePrioridad && coincideBusqueda
                    })
                      .map((publicacion, indice) => (
                        <div key={indice} className="flex h-full">
                          <Publicacion pub={publicacion} />
                        </div>
                      ))
                  }
                </div>

                {publicaciones.length === 0 && (
                  <div className="w-full flex flex-col items-center justify-center py-20 bg-white shadow-sm rounded-lg border border-gray-200">
                    <p className="text-[#64748B] font-semibold tracking-widest uppercase text-sm">NO HAY RESULTADOS</p>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}