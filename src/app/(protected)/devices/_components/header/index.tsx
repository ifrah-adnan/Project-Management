"use client";

import React from "react";
import { Bolt, PlusIcon } from "lucide-react";
import { AddDeviceButton } from "../add-device-button";
import { TData } from "../../_utils/schemas";
import { ConfigureDeviceButton } from "../configure-device-button";

export default function Header({ data }: { data: TData }) {
  return (
    <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
      <h3 className="mr-auto font-medium capitalize">Devices</h3>
      <ConfigureDeviceButton devices={data} className="gap-2 uppercase">
        <Bolt size={16} />
        <span>Device configuration</span>
      </ConfigureDeviceButton>
      <AddDeviceButton className="gap-2 uppercase">
        <PlusIcon size={16} />
        <span>add new Device</span>
      </AddDeviceButton>
    </div>
  );
}
