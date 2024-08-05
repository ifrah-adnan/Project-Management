"use client";
import React, { useState } from "react";
import { Bell, Search } from "lucide-react";
import UserButton from "../userButton";
import { ModeToggle } from "../ModeToggle/mode-toggle";
import CreateNew from "../CreateNew";

interface MainHeaderProps {
  name: string;
  onSearch: (searchTerm: string) => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ name, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (typeof onSearch === "function") {
      onSearch(newSearchTerm);
    }
  };

  return (
    <header className="hidden items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900 md:flex">
      <div className="flex items-center">
        <span className="ml-2 hidden text-xl font-semibold sm:inline">
          {name}
        </span>
      </div>

      <div className="mx-4 max-w-2xl flex-grow">
        <div className="relative">
          <input
            type="text"
            placeholder="Type / to search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
            size={18}
          />
        </div>
      </div>

      <div className="flex items-center">
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <CreateNew />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Bell size={20} />
        </button>
        <div className="ml-2">
          <UserButton />
        </div>
        <div className="ml-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
