"use client";

import React from "react";
import { LayoutGridIcon, ListIcon, PlusIcon } from "lucide-react";
import { AddProjectButton } from "../add-project-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "../../_utils/store";
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
  const { view, setView } = useStore();

  return (
    <div className="p-0">
      <MainHeader name="My Products" onSearch={onSearch}></MainHeader>

      <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
        <h3 className="mr-auto font-medium capitalize">products</h3>
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
              onClick={() => setView(v.value as "list" | "grid")}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          ))}
        </div>
        <Link href="/products/add" passHref>
          <Button className="gap-2 uppercase">
            <PlusIcon size={16} />
            <span>add new product</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default Header;
