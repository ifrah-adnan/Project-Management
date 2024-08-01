import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FiPlus } from "react-icons/fi";
import { GoCodespaces, GoProject, GoTriangleDown } from "react-icons/go";
import { VscRepo } from "react-icons/vsc";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import { LuChevronsLeftRight } from "react-icons/lu";
import { BsBuilding } from "react-icons/bs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LinkItem } from "../sidebar";

export default function CreateNew() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger className=" hidden h-full items-center gap-3 rounded-md border p-2 md:flex">
        <FiPlus className="h-5 w-5" />{" "}
        <GoTriangleDown className="h-5 w-5 text-zinc-500" />
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="mt-4 flex flex-col gap-2">
          <LinkItem
            href="/projects"
            icon={<VscRepo className="h-5 w-5 text-zinc-500" />}
            className={cn(
              "flex items-center gap-3  rounded-sm px-2 py-1 transition-colors duration-300",
              "text-base hover:bg-zinc-100",
            )}
          >
            New Project
          </LinkItem>
          <LinkItem
            href="/commands"
            className="text-base hover:bg-zinc-100"
            icon={
              <RiGitRepositoryCommitsLine className="h-5 w-5 text-zinc-500" />
            }
          >
            New Command
          </LinkItem>
          <LinkItem
            href="/posts"
            className="text-base hover:bg-zinc-100"
            icon={<GoCodespaces className="h-5 w-5 text-zinc-500" />}
          >
            New Post
          </LinkItem>
          <LinkItem
            href="/devices"
            className="text-base hover:bg-zinc-100"
            icon={<LuChevronsLeftRight className="h-5 w-5 text-zinc-500" />}
          >
            New Device
          </LinkItem>
          <LinkItem
            href="/users"
            className="text-base hover:bg-zinc-100"
            icon={<BsBuilding className="h-5 w-5 text-zinc-500" />}
          >
            New Users
          </LinkItem>
        </div>
      </PopoverContent>
    </Popover>
  );
}
