'use client';
import React from 'react';

type noticia = {
    titulo : string
    cuerpo : string
}

type prop = {
    not :noticia
}

export default function Publicacion({ not }: prop) {
  return (
    <article className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <header className="flex items-start justify-between gap-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">{not.titulo}</h3>
      </header>

      <div className="mt-3 text-sm text-gray-700 leading-relaxed">
        <p>{not.cuerpo}</p>
      </div>
      
    </article>
  );
}
