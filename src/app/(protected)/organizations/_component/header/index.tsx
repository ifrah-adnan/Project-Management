"use client";

import React, { useState } from "react";
import { Search, Building2 } from "lucide-react";
import UserButton from "@/app/(protected)/_components/userButton";
import { ModeToggle } from "@/app/(protected)/_components/ModeToggle/mode-toggle";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between">
        <div className="flex items-center">
          <Building2 className="h-6 w-6 text-gray-900 dark:text-white sm:hidden" />
          <h1 className="hidden text-xl font-semibold text-gray-900 dark:text-white sm:block">
            Organizations
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <div className="relative w-full max-w-[200px] sm:max-w-md xl:max-w-lg 2xl:max-w-xl">
            <input
              type="text"
              placeholder="Search organizations"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              size={18}
            />
          </div>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
