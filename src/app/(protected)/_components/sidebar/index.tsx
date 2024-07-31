"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookTextIcon,
  BuildingIcon,
  DockIcon,
  FolderKanban,
  RadioReceiver,
  SettingsIcon,
  ShoppingBasketIcon,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import UserButton from "../userButton";
import { ModeToggle } from "../ModeToggle/mode-toggle";
import { getServerSession } from "@/lib/auth";
import { getOrganizationId } from "../../organizations/_utils/action";

interface LinkItemProps {
  href: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LinkItem: React.FC<LinkItemProps> = ({
  href,
  icon,
  className,
  children,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-lg px-5 py-3 text-base font-medium transition-all duration-200 ease-in-out",
        className,
        {
          "bg-primary/10 text-primary shadow-md": isActive,
          "text-gray-700 hover:bg-gray-100/50 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800/50":
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
        className={cn("transition-all [&_svg]:size-5", {
          "text-primary": isActive,
          "text-gray-500 group-hover:text-primary dark:text-gray-400":
            !isActive,
        })}
      >
        {icon}
      </span>
      <span className="transition-colors">{children}</span>
    </Link>
  );
};

interface SideBarProps {
  className?: string;
}

const SideBar: React.FC<SideBarProps> = ({ className }) => {
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
        "flex h-screen w-80 flex-col bg-gradient-to-b from-gray-50 to-white text-gray-800 shadow-2xl transition-all duration-300 ease-in-out dark:from-gray-900 dark:to-gray-800 dark:text-gray-200",
        className,
      )}
    >
      <div className="p-8">
        <Link
          href="/"
          className="mb-12 flex items-center gap-4 transition-opacity hover:opacity-90"
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-full shadow-lg ring-4 ring-primary/80 ring-offset-4 ring-offset-background">
            <Image
              src={organizationImage || "/sys-admin.svg"}
              alt="Logo"
              fill
              sizes="80px"
              className="object-cover transition-transform duration-300 hover:scale-110"
              quality={100}
              priority
            />
          </div>
          <span className="truncate text-2xl font-bold tracking-tight">
            {organizationName}
          </span>
        </Link>

        <nav className="space-y-1">
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

      <div className="mt-auto border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <ModeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
