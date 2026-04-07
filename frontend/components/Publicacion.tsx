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
    <article className="w-full flex flex-col justify-between bg-[#0a0f1a]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:border-white/10 transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#F2A931]/5 rounded-bl-full blur-2xl pointer-events-none group-hover:bg-[#F2A931]/10 transition-colors duration-500"></div>
      
      <header className="relative z-10 flex flex-col gap-5 mb-5">
        <div className="flex justify-between items-start gap-4">
            <h3 className="text-2xl font-black text-white leading-tight group-hover:text-[#F2A931] transition-colors">{pub.titulo}</h3>
            {pub.prioridad && (
                <span className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full border whitespace-nowrap shadow-inner flex-shrink-0 ${
                    pub.prioridad.toLowerCase() === 'alta' ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                    pub.prioridad.toLowerCase() === 'media' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                    pub.prioridad.toLowerCase() === 'baja' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/30'
                }`}>
                    Prio {pub.prioridad}
                </span>
            )}
        </div>

        {/* Fechas */}
        {(pub.fecha_inicio || pub.fecha_fin) && (
          <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#1e293b]/50 px-5 py-2.5 rounded-2xl border border-white/5 w-fit shadow-inner">
            {pub.fecha_inicio && (
              <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  {new Date(pub.fecha_inicio).toLocaleDateString()}
              </span>
            )}
            {pub.fecha_inicio && pub.fecha_fin && <span className="opacity-30">|</span>}
            {pub.fecha_fin && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                {new Date(pub.fecha_fin).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </header>

      <div className="relative z-10 text-[15px] text-slate-300 leading-relaxed font-medium mb-8 flex-grow">
        <p className="line-clamp-4 group-hover:text-slate-200 transition-colors">{pub.cuerpo}</p>
      </div>

      {/* Etiquetas */}
      {pub.etiquetas && (
        <div className="relative z-10 flex flex-wrap gap-2 mt-auto pt-5 border-t border-white/5">
          {pub.etiquetas.split(',').map((tag, i) => (
            <span key={i} className="text-[10px] font-black tracking-widest uppercase bg-[#1e293b] text-slate-400 px-4 py-2 rounded-full border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-colors hover:text-[#F2A931] hover:bg-white/5 hover:border-white/10 group-hover:border-white/10">{tag.trim()}</span>
          ))}
        </div>
      )}
    </article>
  );
}
