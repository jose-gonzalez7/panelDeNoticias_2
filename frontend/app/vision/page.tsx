'use client';
import { useState, useEffect } from "react";
import Publicacion from "@/components/Publicacion";

type publicacion = {
  titulo: string;
  cuerpo: string;
};

  // Ejemplo de variable del tipo publicacion
  const ejemplopublicacion: publicacion = {
    titulo: 'publicacion de ejemplo',
    cuerpo: 'Este es el cuerpo de la noticia de ejemplo. Aquí puedes poner un resumen o contenido más largo.'
  };

const URL = "https://servidorpanelnoticias-production.up.railway.app/api/publicaciones";

async function mandarAapi(): Promise<publicacion[]> {
    try {
        // Enviar con fetch a la API
        const response = await fetch(URL, {
          credentials: "include",
        });

        // Si la respuesta no es ok(pruebas !! esto se eliminara)
        if (!response.ok) {
          return [ejemplopublicacion];
        }

        // Intentar obtener el JSON de la respuesta
  
      const respuestajson = await response.json();
      console.log("Respuesta de la API:", respuestajson);


        const arraypublicaciones: publicacion[]= []
        respuestajson.forEach((element: publicacion) => {
          let publicacionaux: publicacion = {
            titulo: element.titulo,
            cuerpo: element.cuerpo
          };
          arraypublicaciones.push(publicacionaux);
        });
        
        return arraypublicaciones;

    } catch (error) {
        // Captura cualquier error 
      return [ejemplopublicacion];
    }
}

export default function Home() {  

  const [noticias, setnoticias] = useState<publicacion[]>([]);

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
  //!! aqui tendra que modificar el perez!!
  return (
    <div className="min-h-screen w-full flex items-start justify-center pt-8">
      <div className="grid grid-cols-1 gap-4 w-4/5 bg-white/5 rounded-lg p-6 text-center">
        {
          noticias.map((publicacion,indice) => (
            <div className="" key={indice}>
              <Publicacion not={publicacion}></Publicacion>
            </div>
          ))
        }
      </div>
      

    </div>
  );
}