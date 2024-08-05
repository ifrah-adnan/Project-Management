"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LayoutGridIcon, ListIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddCommandButton } from "../add-command-button";
import { useSession } from "@/components/session-provider";
import MainHeader from "@/app/(protected)/_components/Header";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { session } = useSession();
  const user = session?.user;

  return (
    <>
      <MainHeader name="My Commands" onSearch={onSearch}></MainHeader>

      <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
        <h3 className="mr-auto font-medium capitalize">Commands</h3>
        {(user?.role === "ADMIN" || user?.role === "SYS_ADMIN") && (
          <AddCommandButton className="gap-2 uppercase">
            <PlusIcon size={16} />
            <span className="hidden md:flex">add new command</span>
          </AddCommandButton>
        )}
      </div>
    </>
  );
};
export default Header;
