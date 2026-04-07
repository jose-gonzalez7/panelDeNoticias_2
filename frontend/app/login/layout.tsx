import { FC, PropsWithChildren } from "react";

import "../ui/globals.css"

const RootLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <html lang="es">
            <title>login🔒</title>
            <body className="min-h-[100svh] bg-[#0a0f1a] text-gray-100 font-sans antialiased selection:bg-[#F2A931] selection:text-[#0a0f1a] relative flex items-center justify-center m-0 p-0 w-full">
                {/* Contenedor fijo para evitar desbordamiento y scroll innecesario */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#1e293b] rounded-full blur-[100px] opacity-40"></div>
                    <div className="absolute top-[20%] right-[-15%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#F2A931] rounded-full blur-[120px] opacity-10"></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-[#1e3a5f] rounded-full blur-[120px] opacity-15"></div>
                </div>
                
                <div className="relative z-10 w-full flex items-center justify-center py-6">
                    {children}
                </div>
            </body>
        </html>
    );
};

export default RootLayout;