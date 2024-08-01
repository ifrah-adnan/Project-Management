"use client";
import { useMediaQuery } from "@/hooks/use-mediaQuery";
import React, { ReactNode, useState } from "react";
import { SideBarMobile } from "../sideBarMobile";
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

  if (isMobile) {
    return <SideBarMobile></SideBarMobile>;
  }

  return (
    <div className="flex h-full w-full">
      <SideBar className="flex-shrink-0" onToggle={handleToggle} />
      <main
        className={cn("flex-grow overflow-auto transition-all duration-300", {
          "w-[calc(100%-4rem)]": isCollapsed, // 4rem est la largeur de la barre latérale réduite
          "w-[calc(100%-16rem)]": !isCollapsed, // 16rem est la largeur de la barre latérale étendue
        })}
      >
        <div className="h-full w-full p-4">{children}</div>
      </main>
    </div>
  );
}

export default SideBarLayout;
