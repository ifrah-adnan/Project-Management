"use client";

import React from "react";
import { useStore } from "../../_utils/store";
import { cn } from "@/lib/utils";
import {
  FolderCheck,
  FolderKanban,
  FolderOpen,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
} from "lucide-react";
import { AddProjectButton } from "@/app/(protected)/projects/_components/add-project-button";
import { useSession } from "@/components/session-provider";
import MainHeader from "@/app/(protected)/_components/Header";

const views = [
  {
    value: "list",
    label: "list view",
    icon: <ListIcon size={16} />,
  },
  {
    value: "grid",
    label: "grid view",
    icon: <LayoutGridIcon size={16} />,
  },
];
interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { view, toggleView } = useStore();
  const { session } = useSession();
  const user = session?.user;

  const toggle = (v: string) => {
    if (v === view) return;
    toggleView();
  };

  return (
    <div className="p-0">
      <MainHeader name="My Projects" onSearch={onSearch}></MainHeader>
      <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
        <h3 className="mr-auto font-medium capitalize">
          {/* <FolderOpen /> */}
        </h3>
        <div className="mr-auto flex ">
          {views.map((v) => (
            <button
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-2 font-medium capitalize transition-colors",
                {
                  "border-transparent opacity-50 hover:opacity-75":
                    view !== v.value,
                  " border-foreground": view === v.value,
                },
              )}
              key={v.value}
              onClick={() => toggle(v.value)}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          ))}
        </div>
        {(user?.role === "ADMIN" || user?.role === "SYS_ADMIN") && (
          <AddProjectButton className="gap-2 uppercase">
            <PlusIcon size={16} />
            <span className="hidden md:flex">add new project</span>
          </AddProjectButton>
        )}
      </div>
    </div>
  );
};
export default Header;
