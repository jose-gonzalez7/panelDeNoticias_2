import { FC, PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
};

const LoginLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC]">
            {children}
        </div>
    );
};

export default LoginLayout;
