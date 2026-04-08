import { FC, PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "login🔒",
};

const LoginLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="relative flex min-h-[100svh] w-full items-center justify-center p-0">
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] h-[50vw] max-h-[800px] w-[50vw] max-w-[800px] rounded-full bg-[#1e293b] opacity-40 blur-[100px]" />
                <div className="absolute top-[20%] right-[-15%] h-[40vw] max-h-[600px] w-[40vw] max-w-[600px] rounded-full bg-[#F2A931] opacity-10 blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[20%] h-[30vw] max-h-[400px] w-[30vw] max-w-[400px] rounded-full bg-[#1e3a5f] opacity-15 blur-[120px]" />
            </div>
            <div className="relative z-10 flex w-full items-center justify-center py-6">
                {children}
            </div>
        </div>
    );
};

export default LoginLayout;
