"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { PlusIcon, Users } from "lucide-react";
import { AddUserButton } from "../add-user-button";
import { useSession } from "@/components/session-provider";
import MainHeader from "@/app/(protected)/_components/Header";

export default function Header() {
  const { session } = useSession();
  const user = session?.user;

  return (
    <>
      <MainHeader name="My Users"></MainHeader>

      <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
        <h3 className="mr-auto font-medium capitalize">
          <Users></Users>
        </h3>
        {(user?.role === "ADMIN" || user?.role === "SYS_ADMIN") && (
          <AddUserButton className="gap-2 uppercase">
            <PlusIcon size={16} />
            <span className="hidden md:flex">add new user</span>
          </AddUserButton>
        )}
      </div>
    </>
  );
}
