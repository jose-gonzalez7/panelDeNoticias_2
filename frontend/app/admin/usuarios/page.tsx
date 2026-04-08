import React from 'react';
import ListaUsuarios from './components/ListaUsuarios';

const Usuarios = () => {

    return (
        <div className="min-h-full p-6 text-gray-100 font-sans relative">
            <div className="mb-12">
                <span className="text-[#F2A931] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Panel de Administración</span>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight relative inline-block">
                    Usuarios<span className="text-[#F2A931]">.</span>
                    <span className="absolute -bottom-2 left-0 w-1/3 h-[3px] bg-gradient-to-r from-[#F2A931] to-transparent opacity-80"></span>
                </h1>
            </div>
            <ListaUsuarios/>
        </div>
    );

};

export default Usuarios;