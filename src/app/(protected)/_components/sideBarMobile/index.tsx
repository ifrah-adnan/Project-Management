import { cn } from "@/lib/utils";
import { MenuGlobal } from "./menuGlobal";

interface SideBarMobileProps {
  className?: string;
}

export function SideBarMobile({
  className,
  ...props
}: SideBarMobileProps): JSX.Element {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4",
        className,
      )}
      {...props}
    >
      <MenuGlobal />
    </nav>
  );
}
