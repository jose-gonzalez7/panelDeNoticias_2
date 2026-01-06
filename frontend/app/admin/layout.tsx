import React, { FC, PropsWithChildren } from 'react'
import SideNav from "./components/SideNav";
import "../ui/globals.css";

const DashboardLayout: FC<PropsWithChildren> = ({children}) => {

    return (

        <div>

            {/*CAPA CONTENEDORA*/}

            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">

                {/*CAPA IZQUIERDA */}

                <aside className="w-full flex-none md:w-64 bg-slate-700">
            
                    <SideNav/>
            
                </aside>

                <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>

            </div>

        </div>

    );

};

export default DashboardLayout;