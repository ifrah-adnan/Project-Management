"use client";
import React, { useState } from "react";
import { PlusIcon, Users } from "lucide-react";
import { AddUserButton } from "../add-user-button";
import { useSession } from "@/components/session-provider";
import MainHeader from "@/app/(protected)/_components/Header";
import { useSearchParams } from "next/navigation";
import ButtonAddOperation from "@/app/(protected)/projects/workflow/[projectId]/_component/buttonAddOperation";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { session } = useSession();
  const user = session?.user;

  return (
    <>
      <MainHeader name="Operations" onSearch={onSearch} />
      <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
        {/* <h3 className="mr-auto font-medium capitalize">
          <Users />
        </h3> */}
        {(user?.role === "ADMIN" || user?.role === "SYS_ADMIN") && (
          <ButtonAddOperation>
            {/* <PlusIcon size={16} />
            <span className="hidden md:flex">add new Operations</span> */}
          </ButtonAddOperation>
        )}
      </div>
    </>
  );
};

export default Header;
