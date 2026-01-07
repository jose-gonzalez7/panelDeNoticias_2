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


      const arraypublicaciones: publicacion[]= []
      respuestajson.forEach((element: publicacion) => {
        let publicacionaux: publicacion = {
          titulo: element.titulo,
          cuerpo: element.cuerpo,
          etiquetas : element.etiquetas,
          fecha_fin : element.fecha_fin,
          fecha_inicio : element.fecha_fin,
          prioridad : element.prioridad
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
  const [prioridad , setprioridad] = useState("nada")
  const [buscador , setbuscador] = useState("")

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

  function cambiarbuscador(frase:string) {
    setbuscador(frase)
    console.log(frase)
  }

  function comprobarBusqueda(busqueda:string,titulo:string) : boolean{
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
    <div className="min-h-screen w-full flex items-start justify-center pt-8">
      <div className="grid grid-cols-2 gap-4">
        {/* modificadores */}
        <div className="flex flex-col align-middle w-full gap-5">
            {/* buscador */}
            <div className="w-60">
              <div className="relative">
                <input onChange={(e)=>{cambiarbuscador(e.target.value)}} type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm"/>
              </div>
            </div>
            {/* prioridad */}
            <button onClick={()=>{resetearParametros()}} className="px-4 py-2 w-60 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">restablecer</button>
            <button onClick={()=>{setprioridad("alta")}} className="px-4 py-2 w-60 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">prio alta</button>
            <button onClick={()=>{setprioridad("media")}} className="px-4 py-2 w-60 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">prio media</button>
            <button onClick={()=>{setprioridad("baja")}} className="px-4 py-2 w-60 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">prio baja</button>
        </div>

        {/* lista */}
        <div className="grid grid-cols-1 gap-4 bg-amber-300 rounded-lg p-6 text-center">
          <p className="text-start"><strong className="bg-amber-100">Modificadores activos:</strong> <strong className="bg-green-500">{(prioridad != "nada")?"Prioridad":""}</strong>  <strong className="bg-green-500">{(buscador != "")?"Buscador":""}</strong></p>
          {
            publicaciones.filter(publicacion => {
              {/*filtrar solo las publicacioes que cumplen las siguientes condiciones*/}
              const coincidePrioridad = prioridad === "nada" || prioridad === publicacion.prioridad
              
              const coincideBusqueda = buscador === "" || comprobarBusqueda(buscador, publicacion.titulo)

              return coincidePrioridad && coincideBusqueda
            })
            .map((publicacion,indice) => (
              <div key={indice}>
                <Publicacion pub={publicacion} />
              </div>
            ))
          }
        </div>

      </div>
    </div>
  );
}