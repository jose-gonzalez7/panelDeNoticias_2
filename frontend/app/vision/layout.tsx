import { FC, PropsWithChildren } from "react";

import "../ui/globals.css"

const RootLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <html lang="es">
            <body className="bg-[#0a0f1a] min-h-[100svh] text-white overflow-x-hidden isolate relative">
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F2A931]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
                    <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
};

export default RootLayout;