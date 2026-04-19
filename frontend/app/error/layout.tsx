import { FC, PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error · Panel de noticias",
};

const ErrorLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-[100svh] w-full items-center justify-center p-0 bg-[#F8FAFC]">
      <div className="flex w-full items-center justify-center px-6 py-10">
        {children}
      </div>
    </div>
  );
};

export default ErrorLayout;
