import React, { FC, PropsWithChildren } from "react";
import SideNav from "./components/SideNav";

const DashboardLayout: FC<PropsWithChildren> = ({children}) => {
    return (
        <div className="min-h-[100svh] bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden w-full max-w-full">
                <aside className="w-full flex-none md:w-72 bg-white border-b md:border-b-0 md:border-r border-gray-200 z-20">
                    <SideNav/>
                </aside>
                <div className="flex-1 overflow-x-hidden md:overflow-y-auto w-full scrollbar-hide">
                    {children}
                </div>
            </div>
        </div>
    );
};
/**
 * prueba
 */
export default DashboardLayout;