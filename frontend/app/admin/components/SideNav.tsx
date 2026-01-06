import React from 'react';
import Image from "next/image";
import { FaHome, FaUsers, FaTags, FaPowerOff } from "react-icons/fa";

const SideNav = () => {

    return (

        <div className="flex h-full flex-col px-3 py-4 md:px-2">

            {/*LOGO */}
                
            <a href="" className="mb-2 flex h-20 items-end justify-start bg-slate-900 p-4 md:h-40">

                <div className="w-32 text-white md:w-40">

                    <Image
                        src="/imagenes/logo.png"
                        alt="Logo"
                        width={160}
                        height={80}
                        className="object-contain"
                        />


                </div>

            </a>

            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">

                {/* DASHBOARD */}

                <a href="/admin/" className="flex h-12 grow items-center justify-center gap-2 rounded-md 
                bg-slate-500 p-3 text-lg text-white font-bold hover:bg-slate-400 hover:text-white 
                md:flex-none md:justify-start md:p-2 md:px-3">

                    <FaHome className="w-6"/>
                    <p className="hidden md:block">Dashboard</p>

                </a>

                {/* USUARIOS */}

                <a href="/admin/usuarios" className="flex h-12 grow items-center justify-center gap-2 rounded-md 
                bg-slate-500 p-3 text-lg text-white font-bold hover:bg-slate-400 hover:text-white 
                md:flex-none md:justify-start md:p-2 md:px-3">

                    <FaUsers className="w-6" />
                    <p className="hidden md:block">Usuarios</p>

                </a>

                {/* CATEGORIAS */}

                <a href="/admin/categorias" className="flex h-12 grow items-center justify-center gap-2 rounded-md 
                bg-slate-500 p-3 text-lg text-white font-bold hover:bg-slate-400 hover:text-white 
                md:flex-none md:justify-start md:p-2 md:px-3">

                    <FaTags className="w-6" />
                    <p className="hidden md:block">Categorias</p>

                </a>

                        {/* CERRAR SESIÓN */}

                <a href="/login" className="flex h-12 grow items-center justify-center gap-2 rounded-md 
                bg-slate-500 p-3 text-lg text-white font-bold hover:bg-slate-400 hover:text-white 
                md:flex-none md:justify-start md:p-2 md:px-3">

                    <FaPowerOff className="w-6" />
                    <p className="hidden md:block">Cerrar Sesión</p>

                </a>

                <div className="hidden h-auto w-full grow md:block"></div>

                    </div>
                
                </div>

    );

};

export default SideNav;