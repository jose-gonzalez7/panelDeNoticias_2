import React from 'react';
import Image from "next/image";
import logo from "../../public/imagenes/logotransparente.png";
import { FaHome, FaUsers, FaTags, FaPowerOff } from "react-icons/fa";

const SideNav = () => {
    return (
        <div className="flex h-full flex-col px-4 py-6 md:px-6 w-full">
            <a href="" className="mb-8 flex h-24 items-center justify-center p-2 md:h-32">
                <div className="w-full flex justify-center text-[#1E3A8A]">
                    {/* Sustituye la opacidad para un estilo claro */}
                    <Image
                        src={logo}
                        alt="Logo"
                        width={200}
                        height={100}
                        className="object-contain"
                    />
                </div>
            </a>
            <div className="flex grow flex-row justify-between md:flex-col md:space-x-0 md:space-y-2 pt-4 border-t border-gray-200 md:pt-8 w-full">
                <a href="/admin/" className="flex h-14 grow items-center justify-center gap-4 p-3 text-[13px] text-[#64748B] font-semibold uppercase tracking-wide hover:bg-gray-100 hover:text-[#10B981] transition-colors md:flex-none md:justify-start md:px-6 cursor-pointer border-l-4 border-[#10B981]">
                    <FaHome className="w-5 h-5" />
                    <p className="hidden md:block">Dashboard</p>
                </a>
                <a href="/admin/usuarios" className="flex h-14 grow items-center justify-center gap-4 p-3 text-[13px] text-[#64748B] font-semibold uppercase tracking-wide hover:bg-gray-100 hover:text-[#3B82F6] transition-colors md:flex-none md:justify-start md:px-6 cursor-pointer border-l-4 border-[#3B82F6]">
                    <FaUsers className="w-5 h-5" />
                    <p className="hidden md:block">Usuarios</p>
                </a>
                <a href="/admin/categorias" className="flex h-14 grow items-center justify-center gap-4 p-3 text-[13px] text-[#64748B] font-semibold uppercase tracking-wide hover:bg-gray-100 hover:text-[#3B82F6] transition-colors md:flex-none md:justify-start md:px-6 cursor-pointer border-l-4 border-[#3B82F6]">
                    <FaTags className="w-5 h-5" />
                    <p className="hidden md:block">Categorias</p>
                </a>
                <div className="hidden h-auto w-full grow md:block"></div>
                <a href="/login" className="flex h-14 grow items-center justify-center gap-4 p-3 text-[13px] text-[#64748B] font-semibold uppercase tracking-wide hover:bg-red-50 hover:text-[#EF4444] transition-colors md:flex-none md:justify-start md:px-6 mt-auto cursor-pointer border-l-4 border-[#EF4444]">
                    <FaPowerOff className="w-5 h-5" />
                    <p className="hidden md:block">Cerrar Sesión</p>
                </a>
            </div>
        </div>
    );
};

export default SideNav;