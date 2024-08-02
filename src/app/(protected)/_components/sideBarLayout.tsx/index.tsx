"use client";
import { useMediaQuery } from "@/hooks/use-mediaQuery";
import React, { ReactNode, useState } from "react";
import SideBarMobile from "../sideBarMobile";
import SideBar from "../sidebar";
import { cn } from "@/lib/utils";

interface SideBarLayoutProps {
  children: ReactNode;
}

function SideBarLayout({ children }: SideBarLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      {isMobile ? (
        <SideBarMobile />
      ) : (
        <SideBar className="flex-shrink-0" onToggle={handleToggle} />
      )}
      <main
        className={cn(
          "flex-grow overflow-auto transition-all duration-300",
          {
            "mt-16 w-full": isMobile, // Ajout de marge en haut pour le mobile
            "w-[calc(100%-4rem)]": !isMobile && isCollapsed,
            "w-[calc(100%-16rem)]": !isMobile && !isCollapsed,
          }
        )}
      >
        <div className="h-full w-full p-4">{children}</div>
      </main>
    </div>
  );
}

export default SideBarLayout;
