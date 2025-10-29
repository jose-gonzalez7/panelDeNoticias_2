import { FC, PropsWithChildren } from "react";

import "../ui/globals.css"

const RootLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <html lang="es">
            <title>admin</title>
            <body className="">
                {children}
            </body>
        </html>
    );
};

export default RootLayout;