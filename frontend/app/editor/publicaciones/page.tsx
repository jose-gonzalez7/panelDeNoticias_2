import React from 'react';
import ListaPublicaciones from './components/ListaPublicaciones';

const Publicaciones = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight relative inline-block mb-10">
                PUBLICACIONES<span className="text-[#F2A931]">.</span>
                <div className="absolute -bottom-4 left-0 w-1/3 h-1 bg-gradient-to-r from-[#F2A931] to-transparent"></div>
            </h1>
            <ListaPublicaciones/>
        </div>
    );
};

export default Publicaciones;