"use client";
import React, { useState, useEffect } from "react";
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
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  ChevronRightIcon,
  Activity,
  Package,
  PlusIcon,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import { getServerSession } from "@/lib/auth";
import { getOrganizationId } from "../../organizations/_utils/action";

interface LinkItemProps {
  href: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isCollapsed?: boolean;
}

export const LinkItem: React.FC<LinkItemProps> = ({
  href,
  icon,
  className,
  children,
  onClick,
  isCollapsed,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
        className,
        {
          "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white":
            isActive,
          "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800":
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
      <span className="text-gray-400">{icon}</span>
      {!isCollapsed && <span>{children}</span>}
    </Link>
  );
};

interface SideBarProps {
  className?: string;
  onToggle?: (collapsed: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ className, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const isSysAdmin = user?.role === "SYS_ADMIN";
  const isOperator = user?.role === "OPERATOR";
  const router = useRouter();
  const [organizationImage, setOrganizationImage] = useState<string | null>(
    null,
  );
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

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
  };

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const userTypes = ["ADMIN", "USER", "CLIENT", "OPERATOR"];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) {
      onToggle(!isCollapsed);
    }
  };

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-gray-200 bg-gray-50 text-gray-800 transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="relative flex h-12 w-auto items-center justify-center"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={organizationImage || "/sys-admin.svg"}
                  alt="Logo"
                  fill
                  sizes="32px"
                  className="object-cover"
                  quality={100}
                  priority
                />
              </div>
              <span className="text-sm font-semibold">{organizationName}</span>
            </Link>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {isCollapsed ? <MenuIcon size={20} /> : <XIcon size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {isSysAdmin ? (
          <>
            <LinkItem
              href="/organizations"
              icon={<BuildingIcon size={16} />}
              isCollapsed={isCollapsed}
            >
              Organizations
            </LinkItem>
            <LinkItem
              href="/settings"
              icon={<SettingsIcon size={16} />}
              isCollapsed={isCollapsed}
            >
              Settings
            </LinkItem>
          </>
        ) : isOperator ? (
          <LinkItem
            href="/commitement"
            icon={<Briefcase size={16} />}
            onClick={() => navigateWithOrganization("/commitement")}
            isCollapsed={isCollapsed}
          >
            Commitement
          </LinkItem>
        ) : (
          <>
            <LinkItem
              href="/commands"
              icon={<FolderKanban size={16} />}
              onClick={() => navigateWithOrganization("/commands")}
              isCollapsed={isCollapsed}
            >
              Commands (O F)
            </LinkItem>
            <div>
              <button
                onClick={() => toggleMenu("products")}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    <Package size={16} />
                  </span>
                  {!isCollapsed && <span>Products</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-gray-400">
                    {expandedMenus["products"] ? (
                      <ChevronDownIcon size={16} />
                    ) : (
                      <ChevronRightIcon size={16} />
                    )}
                  </span>
                )}
              </button>
              {expandedMenus["products"] && !isCollapsed && (
                <div className="ml-6 mt-1 space-y-1">
                  <LinkItem
                    href="/products"
                    icon={<Package size={14} />}
                    className="py-1 text-sm"
                    onClick={() => navigateWithOrganization("/products")}
                  >
                    All Products
                  </LinkItem>
                  <LinkItem
                    href="/products/add"
                    icon={<PlusIcon size={14} />}
                    className="py-1 text-sm"
                    onClick={() => navigateWithOrganization("/products/add")}
                  >
                    Add Product
                  </LinkItem>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleMenu("projects")}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    <ShoppingBasketIcon size={16} />
                  </span>
                  {!isCollapsed && <span>Projects</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-gray-400">
                    {expandedMenus["projects"] ? (
                      <ChevronDownIcon size={16} />
                    ) : (
                      <ChevronRightIcon size={16} />
                    )}
                  </span>
                )}
              </button>
              {expandedMenus["projects"] && !isCollapsed && (
                <div className="ml-6 mt-1 space-y-1">
                  <LinkItem
                    href="/projects"
                    icon={<ShoppingBasketIcon size={14} />}
                    className="py-1 text-sm"
                    onClick={() => navigateWithOrganization("/projects")}
                  >
                    All Projects
                  </LinkItem>
                  <LinkItem
                    href="/projects/add"
                    icon={<PlusIcon size={14} />}
                    className="py-1 text-sm"
                    onClick={() => navigateWithOrganization("/projects/add")}
                  >
                    Add Project
                  </LinkItem>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleMenu("operations")}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    <Activity size={16} />
                  </span>
                  {!isCollapsed && <span>Operations</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-gray-400">
                    {expandedMenus["operations"] ? (
                      <ChevronDownIcon size={16} />
                    ) : (
                      <ChevronRightIcon size={16} />
                    )}
                  </span>
                )}
              </button>
              {expandedMenus["operations"] && !isCollapsed && (
                <div className="ml-6 mt-1 space-y-1">
                  <LinkItem
                    href="/operations"
                    icon={<Activity size={14} />}
                    className="py-1 text-sm"
                    onClick={() => navigateWithOrganization("/operations")}
                  >
                    All Operations
                  </LinkItem>
                  <LinkItem
                    href="/operations/add"
                    icon={<PlusIcon size={14} />}
                    className="py-1 text-sm"
                    onClick={() => navigateWithOrganization("/operations/add")}
                  >
                    Add Operation
                  </LinkItem>
                </div>
              )}
            </div>

            <LinkItem
              href="/posts"
              icon={<DockIcon size={16} />}
              onClick={() => navigateWithOrganization("/posts")}
              isCollapsed={isCollapsed}
            >
              Posts
            </LinkItem>
            <LinkItem
              href="/expertise"
              icon={<BookTextIcon size={16} />}
              onClick={() => navigateWithOrganization("/expertise")}
              isCollapsed={isCollapsed}
            >
              Expertises
            </LinkItem>
            <LinkItem
              href="/devices"
              icon={<RadioReceiver size={16} />}
              onClick={() => navigateWithOrganization("/devices")}
              isCollapsed={isCollapsed}
            >
              Devices
            </LinkItem>
            {isAdmin && (
              <div>
                <button
                  onClick={toggleUserMenu}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      <UsersIcon size={16} />
                    </span>
                    {!isCollapsed && <span>Users</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="text-gray-400">
                      {isUserMenuOpen ? (
                        <ChevronDownIcon size={16} />
                      ) : (
                        <ChevronRightIcon size={16} />
                      )}
                    </span>
                  )}
                </button>
                {isUserMenuOpen && !isCollapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {userTypes.map((userType) => (
                      <LinkItem
                        key={userType}
                        href={`/users?typeOfuser=${userType}`}
                        icon={<UsersIcon size={14} />}
                        className="py-1 text-sm"
                        onClick={() =>
                          navigateWithOrganization(
                            `/users?typeOfuser=${userType}`,
                          )
                        }
                      >
                        {userType}
                      </LinkItem>
                    ))}
                  </div>
                )}
              </div>
            )}
            <LinkItem
              href="/settings"
              icon={<SettingsIcon size={16} />}
              isCollapsed={isCollapsed}
            >
              Settings
            </LinkItem>
          </>
        )}
      </nav>
    </div>
  );
};

export default SideBar;
