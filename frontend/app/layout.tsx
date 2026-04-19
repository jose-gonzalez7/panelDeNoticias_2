import { FC, PropsWithChildren } from "react";

import "./ui/globals.css";

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <html lang="es">
            <body className="min-h-[100svh] bg-[#0a0f1a] m-0 text-gray-100 font-sans antialiased selection:bg-[#F2A931] selection:text-[#0a0f1a]">
                {children}
            </body>
        </html>
    );
};

export default RootLayout;
