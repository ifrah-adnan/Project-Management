"use client";

import React from "react";
import { PlusIcon } from "lucide-react";
import { AddPostButton } from "../add-post-button";

export default function Header() {
  return (
    <div className="font-sm flex h-page-header shrink-0 items-center justify-end gap-2 bg-card px-6 text-sm shadow">
      <h3 className="mr-auto font-medium capitalize">Posts</h3>
      <AddPostButton className="gap-2 uppercase">
        <PlusIcon size={16} />
        <span>add new Post</span>
      </AddPostButton>
    </div>
  );
}
