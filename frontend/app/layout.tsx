import { FC, PropsWithChildren } from "react";

import "./ui/globals.css"



const RootLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <html lang="es">
            <body>
                {children}
            </body>
        </html>
    );
};

export default RootLayout;