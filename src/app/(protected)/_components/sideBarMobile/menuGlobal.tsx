import * as React from "react";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDimensions } from "@/hooks/use-dimensions";
import { MenuToggle } from "./menuToggle";
import { Navigation } from "./navigation";
import Logo from "@/components/logo";

export const MenuGlobal = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav
      initial={false}
      className="flex h-full w-full items-center justify-between"
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
    >
      <Navigation
        setOpen={toggleOpen}
        className={cn(
          "absolute left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 flex-col overflow-y-auto border-r border-gray-200 bg-white px-4 py-4 text-gray-800 shadow-lg transition-all duration-300",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          },
        )}
      />
      <MenuToggle toggle={() => toggleOpen()} />
      <Logo className="h-8 w-8" />
    </motion.nav>
  );
};
