"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { buildErrorUrl, mensajeDesdeCuerpoRespuesta } from "@/app/utils/ManejarError";
import { API_BASE } from "@/lib/api";

const URL = `${API_BASE}/login`;

async function mandarAapi(mail: String, password: String, router: any) {
    try {
        const data = {
            email: mail,
            password: password
        };

        // Enviar con fetch a la API
        console.log(JSON.stringify(data));
        const response = await fetch(URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        // Si la respuesta no es ok
        if (!response.ok) {
            const texto = await response.text();
            const detalle = mensajeDesdeCuerpoRespuesta(texto);
            router.push(buildErrorUrl(response.status, detalle || undefined));
            return;
        }

        // Intentar obtener el JSON de la respuesta
        const respuestajson = await response.json();
        console.log("Respuesta de la API:", respuestajson);

        // Verificar si la respuesta fue exitosa
        if (respuestajson && respuestajson.success) {
            // switch para segun que usuario
            const tipousuario = respuestajson.user.rol;
            switch (tipousuario) {
                case "administrador":
                    router.push("/admin");

                    break;
                case "editor":
                    router.push("/editor");
                    break;
                case "profesor":
                    router.push("/vision");
                    break;

                default:
                    router.push(buildErrorUrl("rol", "El rol de usuario no tiene acceso asignado en este panel."));
                    break;
            }
        } else {
            const detalle =
                (typeof respuestajson?.message === "string" && respuestajson.message) ||
                (typeof respuestajson?.error === "string" && respuestajson.error) ||
                "";
            router.push(buildErrorUrl("auth", detalle || "Credenciales incorrectas o sesión no válida."));
        }
    } catch (error) {
        // Captura cualquier error 
        router.push(buildErrorUrl("network", "No se pudo conectar con el servidor."));
    }
}

function Guardar(router: any) {
    const mail = document.getElementById("mail") as HTMLInputElement | null;
    let mailv = "";
    if (mail) {
        mailv = mail.value;
        console.log(mailv);
    }

    const contrasena = document.getElementById("contr") as HTMLInputElement | null;
    let contrasenav = "";
    if (contrasena) {
        contrasenav = contrasena.value;
        console.log(contrasenav);
    }

    //mandar a api
    mandarAapi(mailv, contrasenav, router);
}

const Home = () => {
    const router = useRouter();

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-12">
            
            {/* Texto y composición asimétrica (Lado Izquierdo) */}
            <div className="w-full md:w-1/2 flex flex-col">
                <span className="text-[#1E3A8A] text-sm font-semibold uppercase mb-2">Panel de Administración</span>
                
                <h1 className="text-4xl text-[#0F172A] font-bold leading-tight mb-4">
                    Bienvenido de nuevo<span className="text-[#F59E0B]">.</span>
                </h1>
                
                <p className="text-[#64748B] text-base">
                    Accede a tu cuenta para gestionar las últimas noticias, publicaciones y recursos del centro.
                </p>

                <div className="mt-8">
                    <span className="text-[#64748B] text-xs uppercase tracking-wide">Portal de Noticias</span>
                </div>
            </div>

            {/* Tarjeta de Formulario (Lado Derecho) */}
            <div className="w-full md:w-1/2 max-w-sm">
                <div className="bg-white border border-gray-200 p-8 rounded-lg">
                    <div className="mb-6 block md:hidden">
                        <span className="text-[#1E3A8A] text-xs font-semibold uppercase mb-1 block">Administración</span>
                        <h2 className="text-2xl font-bold text-[#0F172A]">Acceso<span className="text-[#F59E0B]">.</span></h2>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        Guardar(router);
                    }} className="flex flex-col space-y-5">
                        
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="mail" className="text-sm font-medium text-[#0F172A]">Correo Electrónico</label>
                            <input 
                                type="text" 
                                name="" 
                                id="mail" 
                                placeholder="usuario@correo.com" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]" 
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="contr" className="text-sm font-medium text-[#0F172A]">Contraseña</label>
                            <input 
                                type="password" 
                                name="" 
                                id="contr" 
                                placeholder="••••••••" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]" 
                            />
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="w-full bg-[#1E3A8A] text-white font-medium py-2.5 rounded-md hover:bg-blue-800 transition-colors cursor-pointer flex justify-center items-center"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;