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
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import UserButton from "../userButton";
import { ModeToggle } from "../ModeToggle/mode-toggle";
import { getServerSession } from "@/lib/auth";
import {
  OrganizationfindMany,
  getOrganizationId,
} from "../../organizations/_utils/action";

export function LinkItem({
  href,
  icon,
  className,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-lg px-6 py-4 text-base font-medium transition-all duration-200 ease-in-out",
        className,
        {
          "bg-primary text-primary-foreground shadow-md": isActive,
          "text-gray-700 hover:bg-gray-100 hover:text-primary dark:text-gray-200 dark:hover:bg-gray-800":
            !isActive,
        },
      )}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <span
        className={cn("transition-opacity [&_svg]:size-6", {
          "opacity-100": isActive,
          "opacity-75 group-hover:opacity-100": !isActive,
        })}
      >
        {icon}
      </span>
      <span className="transition-colors">{children}</span>
    </Link>
  );
}

export default function SideBar({ className }: { className?: string }) {
  const { session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const isSysAdmin = user?.role === "SYS_ADMIN";
  const router = useRouter();
  const [organizationImage, setOrganizationImage] = React.useState<
    string | null
  >(null);
  const [organizationName, setOrganizationName] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    const fetchOrganizationImage = async () => {
      if (isSysAdmin) {
        setOrganizationImage("/sys-admin.svg");
        setOrganizationName("System Admin");
      } else {
        const serverSession = await getServerSession();
        if (serverSession && serverSession.user.organizationId) {
          const organizationData = await getOrganizationId(
            serverSession.user.organizationId,
          );
          setOrganizationName(organizationData.name);
          setOrganizationImage(organizationData.imagePath || "/sys-admin.svg");
        }
      }
    };

    fetchOrganizationImage();
  }, [isSysAdmin]);

  const navigateWithOrganization = (path: string) => {
    const url = new URL(window.location.href);
    const organizationId = url.searchParams.get("organizationId");
    if (organizationId) {
      router.push(`${path}?organizationId=${organizationId}`);
    } else {
      router.push(path);
    }
  };

  return (
    <div
      className={cn(
        "flex h-screen w-72 flex-col bg-white text-gray-800 shadow-xl transition-all duration-300 ease-in-out dark:bg-gray-900 dark:text-gray-200",
        className,
      )}
    >
      <div className="p-8">
        <Link
          href="/"
          className="mb-10 flex items-center gap-4 transition-opacity hover:opacity-80"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-primary ring-offset-4 ring-offset-background">
            <Image
              src={organizationImage || "/sys-admin.svg"}
              alt="Logo"
              fill
              sizes="64px"
              className="object-cover transition-transform duration-200 hover:scale-105"
              quality={100}
              priority
            />
          </div>
          <span className="truncate text-xl font-bold">{organizationName}</span>
        </Link>

        <nav className="space-y-2">
          {isSysAdmin ? (
            <>
              <LinkItem href="/organizations" icon={<BuildingIcon size={24} />}>
                Organizations
              </LinkItem>
              <LinkItem href="/settings" icon={<SettingsIcon size={24} />}>
                Settings
              </LinkItem>
            </>
          ) : (
            <>
              <LinkItem
                href="/projects"
                icon={<FolderKanban size={24} />}
                onClick={() => navigateWithOrganization("/projects")}
              >
                Projects
              </LinkItem>
              <LinkItem
                href="/commands"
                icon={<ShoppingBasketIcon size={24} />}
                onClick={() => navigateWithOrganization("/commands")}
              >
                Commands
              </LinkItem>
              <LinkItem
                href="/posts"
                icon={<DockIcon size={24} />}
                onClick={() => navigateWithOrganization("/posts")}
              >
                Posts
              </LinkItem>
              <LinkItem
                href="/expertise"
                icon={<BookTextIcon size={24} />}
                onClick={() => navigateWithOrganization("/expertise")}
              >
                Expertises
              </LinkItem>
              <LinkItem
                href="/devices"
                icon={<RadioReceiver size={24} />}
                onClick={() => navigateWithOrganization("/devices")}
              >
                Devices
              </LinkItem>
              {isAdmin && (
                <LinkItem
                  href="/users"
                  icon={<UsersIcon size={24} />}
                  onClick={() => navigateWithOrganization("/users")}
                >
                  Users
                </LinkItem>
              )}
              <LinkItem href="/settings" icon={<SettingsIcon size={24} />}>
                Settings
              </LinkItem>
            </>
          )}
        </nav>
      </div>

      <div className="mt-auto border-t border-gray-200 p-8 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
