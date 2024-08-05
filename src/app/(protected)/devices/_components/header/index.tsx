"use client";

import React from "react";
import { Bolt, PlusIcon } from "lucide-react";
import { AddDeviceButton } from "../add-device-button";
import { TData } from "../../_utils/schemas";
import { ConfigureDeviceButton } from "../configure-device-button";
import { useSession } from "@/components/session-provider";
import MainHeader from "@/app/(protected)/_components/Header";

interface HeaderProps {
  data: TData;
  onSearch: (searchTerm: string) => void;
}

export default function Header({ data, onSearch }: HeaderProps) {
  const { session } = useSession();
  const user = session?.user;

  return (
    <>
      <MainHeader name="My Devices" onSearch={onSearch} />

      <div className="flex items-center justify-between">
        <h3 className="">Devices</h3>
        {(user?.role === "ADMIN" || user?.role === "SYS_ADMIN") && (
          <div className="flex gap-3">
            <ConfigureDeviceButton devices={data} className="header-button">
              <Bolt size={16} />
              <span className="hidden md:flex">Device configuration</span>
            </ConfigureDeviceButton>
            <AddDeviceButton className="header-button">
              <PlusIcon size={16} />
              <span className="hidden md:flex">Add new Device</span>
            </AddDeviceButton>
          </div>
        )}
      </div>
    </>
  );
}
