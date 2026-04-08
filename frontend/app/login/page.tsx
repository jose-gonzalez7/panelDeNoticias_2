"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { buildErrorUrl, mensajeDesdeCuerpoRespuesta } from "@/app/utils/ManejarError";
import { API_BASE } from "@/lib/api";

const URL = `${API_BASE}/login`;

async function mandarAapi(mail:String, password:String, router: any) {
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
        <div className="relative w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center md:justify-between gap-10 md:gap-16 lg:gap-24">
            
            {/* Texto y composición asimétrica (Lado Izquierdo) */}
            <div className="hidden md:flex flex-col items-start w-full md:w-5/12 relative z-10">
                {/* Elemento decorativo sutil */}
                <div className="absolute -left-8 -top-8 w-24 h-24 border border-white/10 rounded-full blur-[1px] opacity-60"></div>
                
                <span className="text-[#F2A931] text-xs font-bold tracking-[0.2em] uppercase mb-4 opacity-100">Panel de Administración</span>
                
                <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] relative">
                    Bienvenido de <br />
                    <span className="relative inline-block mt-2">
                        nuevo<span className="text-[#F2A931]">.</span>
                        {/* Línea decorativa delgada */}
                        <span className="absolute -bottom-2 lg:-bottom-3 left-0 w-full h-[3px] bg-gradient-to-r from-[#F2A931] to-transparent opacity-80"></span>
                    </span>
                </h1>
                
                <p className="text-slate-400 text-lg lg:text-xl max-w-sm font-light mt-8 leading-relaxed">
                    Accede a tu cuenta para gestionar las últimas noticias, publicaciones y recursos del centro.
                </p>

                <div className="mt-12 flex gap-4 items-center">
                    <div className="w-12 h-[1px] bg-white/20"></div>
                    <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">Portal de Noticias</span>
                </div>
            </div>

            {/* Tarjeta de Formulario (Lado Derecho) */}
            <div className="w-full md:w-6/12 max-w-md relative z-10">
                {/* Sombras y profundidad de campo del Glassmorphism */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1e293b] to-[#F2A931] rounded-[2rem] blur opacity-20 transform -rotate-2"></div>
                
                <div className="bg-[#0a0f1a]/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] relative overflow-hidden">
                    {/* Borde sutil superior en naranja */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2A931] to-transparent opacity-50"></div>
                    
                    <div className="mb-10 block md:hidden text-center">
                        <span className="text-[#F2A931] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Administración</span>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Acceso<span className="text-[#F2A931]">.</span></h2>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        Guardar(router);
                    }} className="flex flex-col space-y-7">
                        
                        <div className="flex flex-col space-y-2 group">
                            <label htmlFor="mail" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#F2A931] transition-colors duration-300 ml-1">Correo Electrónico</label>
                            <input 
                                type="text" 
                                name="" 
                                id="mail" 
                                placeholder="usuario@correo.com" 
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60 focus:bg-[#1e293b]/50 focus:border-[#F2A931]/50 transition-all duration-300 shadow-inner" 
                            />
                        </div>

                        <div className="flex flex-col space-y-2 group">
                            <label htmlFor="contr" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#F2A931] transition-colors duration-300 ml-1">Contraseña</label>
                            <input 
                                type="password" 
                                name="" 
                                id="contr" 
                                placeholder="••••••••" 
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#F2A931]/60 focus:bg-[#1e293b]/50 focus:border-[#F2A931]/50 transition-all duration-300 shadow-inner" 
                            />
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="w-full relative overflow-hidden rounded-2xl bg-[#F2A931] px-6 py-4 text-[#0a0f1a] font-bold tracking-wide shadow-[0_0_20px_rgba(242,169,49,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,169,49,0.3)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#F2A931] focus:ring-offset-2 focus:ring-offset-[#0a0f1a] group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Iniciar Sesión
                                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </span>
                                {/* Elemento de brillo sutil en hover */}
                                <div className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;