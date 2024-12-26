"use client";
import React from "react";
import { PlusIcon, Users } from "lucide-react";
import { useSession } from "@/components/session-provider";
import MainHeader from "@/app/(protected)/_components/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        {(user?.role === "ADMIN" || user?.role === "SYS_ADMIN") && (
          <Link href="/operations/add">
            <Button variant="outline">
              <PlusIcon size={16} className="mr-2" />
              <span className="hidden md:inline">Add New Operation</span>
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
