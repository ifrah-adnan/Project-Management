"use client";
import React from "react";
import { Bell, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateNew from "@/app/(protected)/_components/CreateNew";
import { ModeToggle } from "@/app/(protected)/_components/ModeToggle/mode-toggle";
import UserButton from "@/app/(protected)/_components/userButton";

interface MainHeaderProps {
  name: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ name }) => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <h1 className="text-xl font-semibold">{name}</h1>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full max-w-xl flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Type / to search..." className="pl-8" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <CreateNew /> */}
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ModeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
