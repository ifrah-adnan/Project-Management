import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Monitor,
  FolderKanban,
  ShoppingBasketIcon,
  DockIcon,
  UsersIcon,
  BookTextIcon,
  ScrollTextIcon,
  SettingsIcon,
  CircleHelpIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkItem } from "../sidebar";
import { useSession } from "@/components/session-provider";
import { usePathname } from "next/navigation";
import { useOrganizationNavigation } from "@/hooks/use-organizationNavigation";

const variants = {
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
      staggerDirection: 1,
    },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const Navigation = ({
  className,
  setOpen,
}: {
  className?: string;
  setOpen?: any;
}) => {
  const { session } = useSession();
  const { user } = session;
  const pathname = usePathname();
  const navigateWithOrganization = useOrganizationNavigation();

  React.useEffect(() => {
    if (setOpen) {
      setOpen(false);
    }
  }, [pathname, setOpen]);

  return (
    <motion.div
      variants={variants}
      className={cn(
        "flex flex-col gap-2 [&>*]:text-2xl [&>*]:font-[600]",
        className,
      )}
    >
      <LinkItem
        href="/"
        icon={<Monitor size={18} />}
        onClick={() => navigateWithOrganization("/")}
      >
        Dashboard
      </LinkItem>
      <LinkItem
        href="/projects"
        icon={<FolderKanban size={18} />}
        onClick={() => navigateWithOrganization("/projects")}
      >
        Projects
      </LinkItem>
      <LinkItem
        href="/products"
        icon={<ShoppingBasketIcon size={18} />}
        onClick={() => navigateWithOrganization("/products")}
      >
        Products
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
        href="/operators"
        icon={<UsersIcon size={18} />}
        onClick={() => navigateWithOrganization("/operators")}
      >
        Operators
      </LinkItem>
      <LinkItem
        href="/expertise"
        icon={<BookTextIcon size={18} />}
        onClick={() => navigateWithOrganization("/expertise")}
      >
        Expertise
      </LinkItem>
      <LinkItem
        href="/operations"
        icon={<ScrollTextIcon size={18} />}
        onClick={() => navigateWithOrganization("/operations")}
      >
        Operations History
      </LinkItem>
      <LinkItem
        href="/settings"
        icon={<SettingsIcon size={18} />}
        onClick={() => navigateWithOrganization("/settings")}
        className="mt-auto"
      >
        Settings
      </LinkItem>
      <LinkItem href="/help" icon={<CircleHelpIcon size={18} />}>
        Help Center
      </LinkItem>
      <div className="flex items-center gap-2 px-3 py-2">
        <Avatar className="size-12 border-2 border-[#E6B3BA]">
          <AvatarImage src={user.image || ""} alt="@user" />
          <AvatarFallback className="font-bold">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="max-w-full truncate font-semibold capitalize">
            {user.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
