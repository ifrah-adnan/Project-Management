"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LayoutGridIcon, ListIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddCommandButton } from "../add-command-button";

export default function Header() {
  return (
    <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
      <h3 className="mr-auto font-medium capitalize">Commands</h3>
      <AddCommandButton className="gap-2 uppercase">
        <PlusIcon size={16} />
        <span>add new command</span>
      </AddCommandButton>
    </div>
  );
}
