"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookTextIcon,
  BuildingIcon,
  CircleHelpIcon,
  DockIcon,
  FolderClockIcon,
  FolderKanban,
  Monitor,
  RadioReceiver,
  ScrollTextIcon,
  SettingsIcon,
  ShoppingBasketIcon,
  SquareKanbanIcon,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import { useSession } from "@/components/session-provider";
import UserButton from "../userButton";
import { ModeToggle } from "../ModeToggle/mode-toggle";

export function LinkItem({
  href,
  icon,
  className,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cn(
        "relative flex  h-[3.5rem]  items-center   text-foreground transition-colors duration-300",
        className,
        {
          " text-[#FA993A]": isActive,
          " hover:text-[#FA993A]": !isActive,
        },
      )}
    >
      <div
        className={cn("absolute bottom-0 h-1 w-full bg-[#FA993A]", {
          "bg-[#FA993A]": isActive,
          "bg-transparent": !isActive,
        })}
      ></div>
      <span
        className={cn("w-8   opacity-75 [&_svg]:size-5", {
          "opacity-100": isActive,
        })}
      >
        {icon}
      </span>
      {children}
    </Link>
  );
}

export default function SideBar({ className }: { className?: string }) {
  const { session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const [firstName] = (user?.name || "").split(" ");
  console.log(pathname);

  return (
    <div
      className={cn(
        "dark flex h-[3.5rem] w-full items-center justify-between bg-card px-6 text-foreground",
        className,
      )}
    >
      <Link href="/">
        <Image
          priority
          src="/logo.svg"
          alt="Logo"
          className="h-8 w-24"
          width={97}
          height={33}
        />
      </Link>
      {pathname === "/organizations" ? (
        <div className="flex items-center gap-4">
          <Link href="/settings">
            <SettingsIcon size={18} />
          </Link>
          <ModeToggle />
          <UserButton />
        </div>
      ) : (
        <>
          <div className="flex gap-4 lg:gap-6 [&>*]:capitalize">
            <LinkItem href="/projects" icon={<FolderKanban size={18} />}>
              Projects
            </LinkItem>
            <LinkItem href="/commands" icon={<ShoppingBasketIcon size={18} />}>
              Commands
            </LinkItem>
            <LinkItem href="/posts" icon={<DockIcon size={18} />}>
              Posts
            </LinkItem>
            <LinkItem href="/expertise" icon={<DockIcon size={18} />}>
              Expertises
            </LinkItem>
            <LinkItem href="/devices" icon={<RadioReceiver size={18} />}>
              Devices
            </LinkItem>
            <LinkItem
              href="/users"
              icon={<UsersIcon size={18} />}
              className="hidden lg:flex"
            >
              Users
            </LinkItem>
            {/* <LinkItem href="/organizations" icon={<BuildingIcon size={18} />}>
              Organizations
            </LinkItem> */}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/settings">
              <SettingsIcon size={18} />
            </Link>
            <ModeToggle />
            <Link href="/settings">
              <CircleHelpIcon size={18} />
            </Link>
            <UserButton />
          </div>
        </>
      )}
    </div>
  );
}
