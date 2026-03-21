'use client';
import { useState, useEffect } from "react";
import Publicacion from "@/components/Publicacion";
import { DiVim } from "react-icons/di";

type publicacion = {
  titulo: string;
  cuerpo: string;
  fecha_fin: string;
  fecha_inicio: string;
  etiquetas: string;
  prioridad: string;
};

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/publicaciones";

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
  const [prioridad, setprioridad] = useState("nada")
  const [buscador, setbuscador] = useState("")

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
    let titformateado = titulo
    let busformateada = busqueda

    // formatear palabra
    titformateado = titformateado.toLowerCase()
    busformateada = busformateada.toLowerCase()

    // comporvar si el titulo contiene la busqueda
    if (titformateado.includes(busformateada)) {
      comprobar = true
    }

    return comprobar;
  }

  //!! aqui tendra que modificar el perez!!
  return (
    <div className="min-h-screen w-full flex items-start justify-center pt-12 px-4 md:px-8 pb-12 relative animate-fade-in">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Modificadores (Filtros, Izquierda) */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <div className="sticky top-12 space-y-6">
            <div className="bg-[#0a0f1a]/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2A931] to-transparent opacity-40"></div>
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#F2A931]/10 rounded-full blur-2xl pointer-events-none"></div>

              <h2 className="text-2xl font-extrabold text-white tracking-widest uppercase mb-8 flex items-center">
                <span className="w-2 h-8 bg-[#F2A931] rounded-full mr-4 border border-white/20"></span>
                Filtros
              </h2>

              {/* Buscador */}
              <div className="relative mb-8">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1 group-focus-within:text-[#F2A931] transition-colors">Buscar Título</label>
                <input onChange={(e) => { cambiarbuscador(e.target.value) }} type="text" placeholder="Ej. Noticias..." className="w-full rounded-2xl border border-white/10 bg-[#1e293b]/50 px-5 py-4 text-sm text-white shadow-inner transition-all hover:bg-white/5 focus:border-[#F2A931]/50 focus:bg-[#1e293b]/50 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60 placeholder:text-slate-600" />
              </div>

              {/* Prioridad */}
              <div className="flex flex-col gap-3">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Por Prioridad</label>

                <button onClick={() => { setprioridad("alta") }} className={`w-full relative overflow-hidden rounded-xl px-5 py-4 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${prioridad === 'alta' ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-[#1e293b]/50 text-slate-400 border border-white/5 hover:bg-white/5 hover:border-white/20'}`}>
                  Prioridad Alta
                </button>
                <button onClick={() => { setprioridad("media") }} className={`w-full relative overflow-hidden rounded-xl px-5 py-4 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${prioridad === 'media' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-[#1e293b]/50 text-slate-400 border border-white/5 hover:bg-white/5 hover:border-white/20'}`}>
                  Prioridad Media
                </button>
                <button onClick={() => { setprioridad("baja") }} className={`w-full relative overflow-hidden rounded-xl px-5 py-4 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${prioridad === 'baja' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-[#1e293b]/50 text-slate-400 border border-white/5 hover:bg-white/5 hover:border-white/20'}`}>
                  Prioridad Baja
                </button>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <button onClick={() => { resetearParametros() }} className="w-full relative overflow-hidden rounded-xl px-5 py-4 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 bg-white/5 text-white border border-transparent hover:bg-white/10 hover:border-white/20 hover:text-[#F2A931] flex items-center justify-center gap-2 group/btn">
                    Restablecer Filtros
                    <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Publicaciones (Derecha) */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#1e293b]/30 backdrop-blur-md border border-white/5 rounded-[2rem] px-8 py-6 shadow-lg gap-4">
            <p className="text-sm text-slate-300 font-medium">
              Explora las publicaciones disponibles.
            </p>
            <div className="flex flex-wrap gap-3">
              {prioridad !== "nada" && <span className="px-4 py-1.5 bg-[#F2A931]/10 text-[#F2A931] border border-[#F2A931]/20 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-inner"><span className="w-1.5 h-1.5 rounded-full bg-[#F2A931]"></span>Prio: {prioridad}</span>}
              {buscador !== "" && <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-inner"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{buscador}</span>}
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
                  <div key={indice} className="flex h-full animate-fade-in-up" style={{ animationDelay: `${indice * 100}ms` }}>
                    <Publicacion pub={publicacion} />
                  </div>
                ))
            }
          </div>

          {publicaciones.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-20 bg-[#1e293b]/20 backdrop-blur-md rounded-[2rem] border border-white/5">
              <svg className="w-16 h-16 text-slate-500 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">NO HAY RESULTADOS</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}