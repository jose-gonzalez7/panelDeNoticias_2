'use client';
import { useState, useEffect } from "react";
import Publicacion from "@/components/Publicacion";

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

  const [noticias, setnoticias] = useState<publicacion[]>([]);
  const [modificador , setmodificador] = useState("nada")

  useEffect(() => {
    let mounted = true;

    const fetcher = async () => {
      const llamada = await mandarAapi();
      if (!mounted) return;
      setnoticias(llamada);
    };

    fetcher()

    const id = setInterval(fetcher, 5000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  function cambiarmod(mod : string) {
    setmodificador(mod);
  }

  //!! aqui tendra que modificar el perez!!
  return (
    <div className="min-h-screen w-full flex items-start justify-center pt-8">
      <div className="grid grid-cols-2 gap-4">
        {/* modificadores */}
        <div className="flex flex-col align-middle w-full gap-5">
            <button onClick={()=>{setmodificador("nada")}} className="px-4 py-2 w-60 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">restablecer</button>
            <button onClick={()=>{setmodificador("alta")}} className="px-4 py-2 w-60 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">prio alta</button>
            <button onClick={()=>{setmodificador("media")}} className="px-4 py-2 w-60 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">prio media</button>
            <button onClick={()=>{setmodificador("baja")}} className="px-4 py-2 w-60 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">prio baja</button>
        </div>

        {/* lista */}
        <div className="grid grid-cols-1 gap-4 bg-amber-300 rounded-lg p-6 text-center">
          {
            noticias.map((publicacion,indice) => (
              (modificador == "nada")?
                <div className="" key={indice}>
                  <Publicacion pub={publicacion}></Publicacion>
                </div>
              :(modificador == "alta" && publicacion.prioridad == "alta")?
                <div className="" key={indice}>
                  <Publicacion pub={publicacion}></Publicacion>
                </div>
              :(modificador == "media" && publicacion.prioridad == "media")?
                <div className="" key={indice}>
                  <Publicacion pub={publicacion}></Publicacion>
                </div>
              :(modificador == "baja" && publicacion.prioridad == "baja")?
                <div className="" key={indice}>
                  <Publicacion pub={publicacion}></Publicacion>
                </div>
              :""
            ))
          }
        </div>

      </div>
    </div>
  );
}