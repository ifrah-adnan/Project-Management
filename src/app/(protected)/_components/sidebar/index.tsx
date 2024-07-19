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
        "relative flex h-[3.5rem] items-center text-foreground transition-colors duration-300",
        className,
        {
          "text-[#FA993A]": isActive,
          "hover:text-[#FA993A]": !isActive,
        },
      )}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className={cn("absolute bottom-0 h-1 w-full bg-[#FA993A]", {
          "bg-[#FA993A]": isActive,
          "bg-transparent": !isActive,
        })}
      ></div>
      <span
        className={cn("w-8 opacity-75 [&_svg]:size-5", {
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
  const isAdmin = user?.role === "ADMIN" || user?.role === "SYS_ADMIN";
  const isSysAdmin = user?.role === "SYS_ADMIN";
  const pathname = usePathname();
  const router = useRouter();
  const [organizationImage, setOrganizationImage] = React.useState<
    string | null
  >(null);
  const [organizationName, setOrganizationName] = React.useState<string | null>(
    null,
  );
  const [isOrganizationPage, setIsOrganizationPage] = React.useState(false);
  const [showOrganizationName, setShowOrganizationName] = React.useState(true);

  const [firstName] = (user?.name || "").split(" ");

  React.useEffect(() => {
    const fetchOrganizationImage = async () => {
      if (pathname === "/organizations") {
        setOrganizationImage("/sys-admin.svg");
        setIsOrganizationPage(true);
      } else {
        setIsOrganizationPage(false);
        const serverSession = await getServerSession();
        if (serverSession && serverSession.user.organizationId) {
          const organizationData = await getOrganizationId(
            serverSession.user.organizationId,
          );
          setOrganizationName(organizationData.name);
          if (organizationData && organizationData.imagePath) {
            setOrganizationImage(organizationData.imagePath);
          } else {
            setOrganizationImage("/sys-admin.svg");
          }
        }
      }
    };

    fetchOrganizationImage();
  }, [pathname]);

  const navigateWithOrganization = (path: string) => {
    const url = new URL(window.location.href);
    const organizationId = url.searchParams.get("organizationId");
    if (organizationId) {
      router.push(`${path}?organizationId=${organizationId}`);
    } else {
      router.push(path);
    }
  };

  const handleMyOrganizationsClick = () => {
    setShowOrganizationName(false);
    navigateWithOrganization("/organizations");
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!isAdmin) {
      e.preventDefault(); // Empêche la navigation pour les non-admins
    }
  };

  // ... (le reste du code reste inchangé)

  const isAdminOrSysAdmin =
    user?.role === "ADMIN" || user?.role === "SYS_ADMIN";

  return (
    <div
      className={cn(
        "dark flex h-[3.5rem] w-full items-center justify-between bg-card px-6 text-foreground",
        className,
      )}
    >
      {isAdminOrSysAdmin ? (
        <Link
          href="/"
          className="relative flex h-12 w-40 items-center justify-center"
        >
          <div className="relative h-12 w-12">
            <Image
              src={organizationImage || "/sys-admin.svg"}
              alt="Logo"
              fill
              sizes="48px"
              className="object-contain transition-opacity duration-300 ease-in-out"
              quality={100}
              priority
            />
          </div>
          {showOrganizationName && (
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {organizationName}
            </span>
          )}
        </Link>
      ) : (
        <div className="relative flex h-12 w-40 items-center justify-center">
          <div className="relative h-12 w-12">
            <Image
              src={organizationImage || "/sys-admin.svg"}
              alt="Logo"
              fill
              sizes="48px"
              className="object-contain transition-opacity duration-300 ease-in-out"
              quality={100}
              priority
            />
          </div>
          {showOrganizationName && (
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {organizationName}
            </span>
          )}
        </div>
      )}
      {isOrganizationPage ? (
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
            <LinkItem
              href="/projects"
              icon={<FolderKanban size={18} />}
              onClick={() => navigateWithOrganization("/projects")}
            >
              Projects
            </LinkItem>
            <LinkItem
              href="/commands"
              icon={<ShoppingBasketIcon size={18} />}
              onClick={() => navigateWithOrganization("/commands")}
            >
              Commands
            </LinkItem>
            <LinkItem
              href="/posts"
              icon={<DockIcon size={18} />}
              onClick={() => navigateWithOrganization("/posts")}
            >
              Posts
            </LinkItem>
            <LinkItem
              href="/expertise"
              icon={<DockIcon size={18} />}
              onClick={() => navigateWithOrganization("/expertise")}
            >
              Expertises
            </LinkItem>
            <LinkItem
              href="/devices"
              icon={<RadioReceiver size={18} />}
              onClick={() => navigateWithOrganization("/devices")}
            >
              Devices
            </LinkItem>
            {isAdmin && (
              <>
                <LinkItem
                  href="/users"
                  icon={<UsersIcon size={18} />}
                  className="hidden lg:flex"
                  onClick={() => navigateWithOrganization("/users")}
                >
                  Users
                </LinkItem>
                {isSysAdmin && (
                  <LinkItem
                    href="/organizations"
                    icon={<BuildingIcon size={18} />}
                    onClick={handleMyOrganizationsClick}
                  >
                    My Organizations
                  </LinkItem>
                )}
              </>
            )}
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
