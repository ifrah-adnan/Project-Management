"use client";

import React from "react";
import { PlusIcon } from "lucide-react";
import { AddProjectButton } from "../add-project-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header({ operations }: any) {
  return (
    <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
      <h3 className="mr-auto font-medium capitalize">products</h3>
      <Link href="/products/add" passHref>
        <Button className="gap-2 uppercase">
          <PlusIcon size={16} />
          <span>add new product</span>
        </Button>
      </Link>
    </div>
  );
}
