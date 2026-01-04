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
    <article className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">{pub.titulo}</h3>
          {/* Fechas */}
          {(pub.fecha_inicio || pub.fecha_fin) && (
            <div className="mt-1 text-xs text-gray-500">
              {pub.fecha_inicio && (
                <span>Inicio: {new Date(pub.fecha_inicio).toLocaleDateString()}</span>
              )}
              {pub.fecha_inicio && pub.fecha_fin && <span className="mx-1">•</span>}
              {pub.fecha_fin && (
                <span>Fin: {new Date(pub.fecha_fin).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>

        {/* Etiquetas */}
        {pub.etiquetas && (
          <div className="flex flex-wrap gap-2">
            {pub.etiquetas.split(',').map((tag, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{tag.trim()}</span>
            ))}
          </div>
        )}
      </header>

      <div className="mt-3 text-sm text-gray-700 leading-relaxed">
        <p className="line-clamp-4">{pub.cuerpo}</p>
      </div>
      
    </article>
  );
}
