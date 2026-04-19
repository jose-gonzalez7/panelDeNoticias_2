import React, { FC, PropsWithChildren } from "react";
import SideNav from "./components/SideNav";

const DashboardLayout: FC<PropsWithChildren> = ({children}) => {
    return (
        <div className="min-h-[100svh] bg-[#F8FAFC]">
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden w-full max-w-full">
                <aside className="w-full flex-none md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200">
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