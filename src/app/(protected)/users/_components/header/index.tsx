"use client";
import React, { useState } from "react";
import { PlusIcon, Users } from "lucide-react";
import { AddUserButton } from "../add-user-button";
import { useSession } from "@/components/session-provider";
import MainHeader from "@/app/(protected)/_components/Header";
import { useSearchParams } from "next/navigation";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { session } = useSession();
  const user = session?.user;
  const searchParams = useSearchParams();

  const typeOfuser = searchParams.get("typeOfuser");
  const name = `My ${typeOfuser}S`;

  return (
    <>
      <MainHeader name={name} onSearch={onSearch} />
      <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
        <h3 className="mr-auto font-medium capitalize">
          <Users />
        </h3>
        {(user?.role === "ADMIN" || user?.role === "SYS_ADMIN") && (
          <AddUserButton className="gap-2 uppercase">
            <PlusIcon size={16} />
            <span className="hidden md:flex">add new {typeOfuser}</span>
          </AddUserButton>
        )}
      </div>
    </>
  );
};

export default Header;
