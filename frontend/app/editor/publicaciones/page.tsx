import React from 'react';
import ListaPublicaciones from './components/ListaPublicaciones';

const Publicaciones = () => {
    return (
        <div className="min-h-full p-6 md:p-12">
            <div className="mb-10">
                <span className="text-[#1E3A8A] text-sm font-semibold uppercase mb-2 block">Panel de Editor</span>
                <h1 className="text-4xl text-[#0F172A] font-bold leading-tight">
                    Publicaciones<span className="text-[#F59E0B]">.</span>
                </h1>
            </div>
            <ListaPublicaciones/>
        </div>
    );
};

export default Publicaciones;