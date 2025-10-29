import { FC, PropsWithChildren } from "react";

import "../ui/globals.css"

const RootLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <html lang="es">
            <title>login🔒</title>
            <body className="flex items-center justify-center w-screen h-screen bg-linear-to-br from-gray-500 via-gray-800 to-gray-700">
                {children}
            </body>
        </html>
    );
};

export default RootLayout;