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
  const isAdmin = user?.role === "ADMIN" || user?.role === "SYS_ADMIN";
  const pathname = usePathname();
  const [organizationImage, setOrganizationImage] = React.useState<
    string | null
  >(null);
  const [isOrganizationPage, setIsOrganizationPage] = React.useState(false);

  const [firstName] = (user?.name || "").split(" ");

  React.useEffect(() => {
    const fetchOrganizationImage = async () => {
      if (pathname === "/organizations") {
        setOrganizationImage("/logo.svg"); // Remplacez par le chemin de votre logo par défaut
        setIsOrganizationPage(true);
      } else {
        setIsOrganizationPage(false);
        const serverSession = await getServerSession();
        if (serverSession && serverSession.user.organizationId) {
          const organizationData = await getOrganizationId(
            serverSession.user.organizationId,
          );
          if (organizationData && organizationData.imagePath) {
            setOrganizationImage(organizationData.imagePath);
          } else {
            setOrganizationImage("/logo.svg"); // Logo par défaut si aucune image n'est trouvée
          }
        }
      }
    };

    fetchOrganizationImage();
  }, [pathname]);

  return (
    <div
      className={cn(
        "dark flex h-[3.5rem] w-full items-center justify-between bg-card px-6 text-foreground",
        className,
      )}
    >
      <Link
        href="/"
        className="relative flex h-12 w-40 items-center justify-center"
      >
        <Image
          src={organizationImage || "/logo.svg"}
          alt="Logo"
          fill
          sizes="(max-width: 160px) 100vw, 160px"
          className="object-contain transition-opacity duration-300 ease-in-out"
          quality={100}
          priority
          style={{
            opacity: 1,
            objectFit: "contain",
            width: "100%",
            height: "100%",
            padding: "4px",
          }}
        />
      </Link>
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
            {isAdmin && (
              <LinkItem
                href="/users"
                icon={<UsersIcon size={18} />}
                className="hidden lg:flex"
              >
                Users
              </LinkItem>
            )}
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
