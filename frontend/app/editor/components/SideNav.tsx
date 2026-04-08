import React from 'react';
import Image from "next/image";
import logo from "../../public/imagenes/logotransparente.png";
import { FaHome, FaUsers, FaTags, FaPowerOff } from "react-icons/fa";

const SideNav = () => {
    return (
        <div className="flex h-full flex-col px-4 py-6 md:px-6 relative z-10 w-full">
            <a href="" className="mb-8 flex h-24 items-center justify-center p-2 md:h-32 transition-transform duration-300 hover:scale-105">
                <div className="text-white w-full flex justify-center">
                    <Image
                        src={logo}
                        alt="Logo"
                        width={200}
                        height={100}
                        className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    />
                </div>
            </a>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-4 pt-4 border-t border-white/10 md:pt-8 w-full">
                <a href="/editor/" className="group flex h-14 grow items-center justify-center gap-4 rounded-2xl bg-transparent p-3 text-[13px] text-slate-400 font-bold uppercase tracking-widest hover:bg-[#1e293b]/50 hover:text-white hover:border hover:border-white/10 transition-all duration-300 md:flex-none md:justify-start md:px-6 overflow-hidden relative">
                    <div className="absolute inset-0 w-1 bg-[#F2A931] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <FaHome className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F2A931]" />
                    <p className="hidden md:block">Dashboard</p>
                </a>
                <a href="/editor/publicaciones" className="group flex h-14 grow items-center justify-center gap-4 rounded-2xl bg-transparent p-3 text-[13px] text-slate-400 font-bold uppercase tracking-widest hover:bg-[#1e293b]/50 hover:text-white hover:border hover:border-white/10 transition-all duration-300 md:flex-none md:justify-start md:px-6 overflow-hidden relative">
                    <div className="absolute inset-0 w-1 bg-[#F2A931] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <FaUsers className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F2A931]" />
                    <p className="hidden md:block">Publicaciones</p>
                </a>
                <div className="hidden h-auto w-full grow md:block"></div>
                <a href="/login" className="group flex h-14 grow items-center justify-center gap-4 rounded-2xl bg-transparent p-3 text-[13px] text-slate-400 font-bold uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 hover:border hover:border-red-500/20 transition-all duration-300 md:flex-none md:justify-start md:px-6 mt-auto overflow-hidden relative">
                    <div className="absolute inset-0 w-1 bg-red-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <FaPowerOff className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-red-400" />
                    <p className="hidden md:block">Cerrar Sesión</p>
                </a>
            </div>
        </div>
    );
};

export default SideNav;