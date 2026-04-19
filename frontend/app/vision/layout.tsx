import { FC, PropsWithChildren } from "react";

const VisionLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="min-h-[100svh] bg-[#F8FAFC]">
            <div className="flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
};

export default VisionLayout;
