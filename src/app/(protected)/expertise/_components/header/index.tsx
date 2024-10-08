"use client";
import React from "react";
import { PlusIcon } from "lucide-react";
import { AddExpertiseButton } from "../add-expertise-button";
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
      <MainHeader name="My Expertises" onSearch={onSearch}></MainHeader>

      <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
        {/* <h3 className="mr-auto font-medium capitalize">Expertises</h3> */}
        {(user?.role === "ADMIN" || user?.role === "SYS_ADMIN") && (
          <AddExpertiseButton className="gap-2 uppercase">
            <PlusIcon size={16} />
            <span className="hidden md:flex">add new expertise</span>
          </AddExpertiseButton>
        )}
      </div>
    </>
  );
};
export default Header;
