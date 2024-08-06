"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import UserButton from "../userButton";
import { ModeToggle } from "../ModeToggle/mode-toggle";
import { getServerSession } from "@/lib/auth";
import { getOrganizationId } from "../../organizations/_utils/action";
import {
  BookTextIcon,
  BuildingIcon,
  DockIcon,
  FolderKanban,
  RadioReceiver,
  SettingsIcon,
  ShoppingBasketIcon,
  UsersIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

interface LinkItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}

const LinkItem: React.FC<LinkItemProps> = ({
  href,
  icon,
  children,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors",
        {
          "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white":
            isActive,
          "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800":
            !isActive,
        },
      )}
    >
      <span className="text-gray-400">{icon}</span>
      <span>{children}</span>
    </button>
  );
};

interface SideBarMobileProps {
  className?: string;
}

const SideBarMobile: React.FC<SideBarMobileProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const isSysAdmin = user?.role === "SYS_ADMIN";
  const router = useRouter();
  const [organizationImage, setOrganizationImage] = useState<string | null>(
    null,
  );
  const [organizationName, setOrganizationName] = useState<string | null>(null);

  useEffect(() => {
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
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 h-12 w-full bg-white shadow-md dark:bg-gray-900",
          className,
        )}
      >
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mr-2 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-1">
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={organizationImage || "/sys-admin.svg"}
                  alt="Logo"
                  fill
                  sizes="24px"
                  className="object-cover"
                  quality={100}
                  priority
                />
              </div>
              <span className="text-xs font-semibold">{organizationName}</span>
            </div>
          </div>
          <ModeToggle />
        </div>
      </nav>

      {/* Sidebar mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative flex h-full w-56 flex-col bg-white pt-12 dark:bg-gray-900">
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <nav className="space-y-1">
              {isSysAdmin ? (
                <>
                  <LinkItem
                    href="/organizations"
                    icon={<BuildingIcon size={14} />}
                    onClick={() => navigateWithOrganization("/organizations")}
                  >
                    Organizations
                  </LinkItem>
                  <LinkItem
                    href="/settings"
                    icon={<SettingsIcon size={14} />}
                    onClick={() => navigateWithOrganization("/settings")}
                  >
                    Settings
                  </LinkItem>
                </>
              ) : (
                <>
                  <LinkItem
                    href="/commands"
                    icon={<FolderKanban size={14} />}
                    onClick={() => navigateWithOrganization("/commands")}
                  >
                    Commands (O F)
                  </LinkItem>
                  <LinkItem
                    href="/projects"
                    icon={<ShoppingBasketIcon size={14} />}
                    onClick={() => navigateWithOrganization("/projects")}
                  >
                    Projects
                  </LinkItem>
                  <LinkItem
                    href="/posts"
                    icon={<DockIcon size={14} />}
                    onClick={() => navigateWithOrganization("/posts")}
                  >
                    Posts
                  </LinkItem>
                  <LinkItem
                    href="/expertise"
                    icon={<BookTextIcon size={14} />}
                    onClick={() => navigateWithOrganization("/expertise")}
                  >
                    Expertises
                  </LinkItem>
                  <LinkItem
                    href="/devices"
                    icon={<RadioReceiver size={14} />}
                    onClick={() => navigateWithOrganization("/devices")}
                  >
                    Devices
                  </LinkItem>
                  {isAdmin && (
                    <LinkItem
                      href="/users"
                      icon={<UsersIcon size={14} />}
                      onClick={() => navigateWithOrganization("/users")}
                    >
                      Users
                    </LinkItem>
                  )}
                  <LinkItem
                    href="/settings"
                    icon={<SettingsIcon size={14} />}
                    onClick={() => navigateWithOrganization("/settings")}
                  >
                    Settings
                  </LinkItem>
                </>
              )}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 p-3 dark:border-gray-700">
            <UserButton />
          </div>
        </div>
        <div className="w-14 flex-shrink-0" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>
    </>
  );
};

export default SideBarMobile;
