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

const URL = "https://cambiarelenpoint";

async function mandarAapi(tok: string): Promise<publicacion[]> {
    try {
        const data = {
          token: tok
        };

        // Enviar con fetch a la API
        console.log(JSON.stringify(data));
        const response = await fetch(URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        // Si la respuesta no es ok(pruebas !! esto se eliminara)
        if (!response.ok) {
          return [ejemplopublicacion];
        }

        // Intentar obtener el JSON de la respuesta
  
        const respuestajson = await response.json();
        console.log("Respuesta de la API:", respuestajson);

        if (respuestajson && respuestajson.success && Array.isArray(respuestajson.data)) {
          
          // !!! aqui tengo que modificar para trasformar el json que me venga , en un array valido !!!
          return respuestajson.data;
        }

        // esto seguramente se borre
        if (Array.isArray(respuestajson)) {
          return respuestajson;
        }

        // esto es para que el typescript no me de dolor de cabeza
        return [ejemplopublicacion];

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
      const llamada = await mandarAapi("ttt");
      if (!mounted) return;
      setnoticias(llamada);
    };

    const id = setInterval(fetcher, 5000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);
  
  return (
    <div className="min-h-screen w-full flex items-start justify-center pt-8">
      <div className="grid grid-cols-2 gap-4 w-4/5 bg-white/5 rounded-lg p-6 text-center">
      {
        noticias.map((publicacion,indice) => (
          <div className="" key={indice}>
            <Publicacion not={publicacion}></Publicacion>
          </div>
        ))
      }
      
      <Publicacion not={ejemplopublicacion}></Publicacion>
      <Publicacion not={ejemplopublicacion}></Publicacion>
      <Publicacion not={ejemplopublicacion}></Publicacion>
      <Publicacion not={ejemplopublicacion}></Publicacion>
      <Publicacion not={ejemplopublicacion}></Publicacion>
      <Publicacion not={ejemplopublicacion}></Publicacion>
      <Publicacion not={ejemplopublicacion}></Publicacion>
      <Publicacion not={ejemplopublicacion}></Publicacion>


      </div>
      

    </div>
  );
}