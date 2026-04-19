'use client';
import React from 'react';

type publicacion = {
  titulo: string;
  cuerpo: string;
  fecha_fin: string;
  fecha_inicio: string;
  etiquetas: string;
  prioridad: string;
};

type prop = {
    pub :publicacion
}

export default function Publicacion({ pub }: prop) {
  return (
    <article className="w-full flex flex-col justify-between bg-white border border-gray-200 rounded-lg p-6 shadow-sm relative h-full">
      
      <header className="flex flex-col gap-3 mb-4">
        <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-bold text-[#0F172A] leading-tight">{pub.titulo}</h3>
            {pub.prioridad && (
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border whitespace-nowrap flex-shrink-0 ${
                    pub.prioridad.toLowerCase() === 'alta' ? 'bg-red-50 text-red-600 border-red-200' :
                    pub.prioridad.toLowerCase() === 'media' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                    pub.prioridad.toLowerCase() === 'baja' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    'bg-gray-100 text-[#64748B] border-gray-200'
                }`}>
                    {pub.prioridad}
                </span>
            )}
        </div>

        {/* Fechas */}
        {(pub.fecha_inicio || pub.fecha_fin) && (
          <div className="flex gap-2 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            {pub.fecha_inicio && (
              <span>{new Date(pub.fecha_inicio).toLocaleDateString()}</span>
            )}
            {pub.fecha_inicio && pub.fecha_fin && <span>-</span>}
            {pub.fecha_fin && (
              <span>{new Date(pub.fecha_fin).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </header>

      <div className="text-sm text-[#0F172A] leading-relaxed mb-6 flex-grow">
        <p className="line-clamp-4">{pub.cuerpo}</p>
      </div>

      {/* Etiquetas */}
      {pub.etiquetas && (
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
          {pub.etiquetas.split(',').map((tag, i) => (
            <span key={i} className="text-[10px] font-bold tracking-widest uppercase bg-gray-100 text-[#64748B] px-2.5 py-1 rounded border border-gray-200">{tag.trim()}</span>
          ))}
        </div>
      )}
    </article>
  );
}
