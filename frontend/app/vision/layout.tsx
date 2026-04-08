import { FC, PropsWithChildren } from "react";
import { FaPowerOff } from "react-icons/fa";

const VisionLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="relative isolate min-h-[100svh] overflow-x-hidden bg-[#0a0f1a] text-white">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute top-0 right-0 h-[800px] w-[800px] translate-x-1/3 -translate-y-1/3 rounded-full bg-[#F2A931]/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-blue-900/10 blur-3xl" />
                <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-900/5 blur-3xl" />
            </div>
            <div className="relative z-10 flex min-h-screen flex-col">
                <header className="sticky top-0 z-20 flex justify-end border-b border-white/5 bg-[#0a0f1a]/80 px-4 py-3 backdrop-blur-md md:px-8">
                    <a
                        href="/login"
                        title="Cerrar sesión"
                        className="group relative flex h-12 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-transparent p-3 text-[13px] font-bold tracking-widest text-slate-400 uppercase transition-all duration-300 hover:border hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 md:min-w-[200px] md:justify-start md:px-6"
                    >
                        <span className="absolute inset-0 w-1 -translate-x-full bg-red-500 transition-transform duration-300 group-hover:translate-x-0" />
                        <FaPowerOff className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-red-400" />
                        <p className="hidden md:block">Cerrar Sesión</p>
                    </a>
                </header>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
};

export default VisionLayout;
