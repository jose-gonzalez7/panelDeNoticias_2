import React, { FC, PropsWithChildren } from 'react';
import SideNav from "./components/SideNav";
import "../ui/globals.css";

const DashboardLayout: FC<PropsWithChildren> = ({children}) => {
    return (
        <div className="min-h-[100svh] bg-[#0a0f1a] relative overflow-x-hidden isolate">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F2A931]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
                <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-3xl"></div>
            </div>

            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden relative z-10 w-full max-w-full">
                <aside className="w-full flex-none md:w-64 bg-[#1e293b]/30 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-white/5 shadow-2xl relative z-20">
                    <SideNav/>
                </aside>

                <div className="flex-1 overflow-x-hidden md:overflow-y-auto w-full">
                    <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;