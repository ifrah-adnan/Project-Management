"use client";

import React, { useState } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { AddOrganizationButton } from "../add-organization-button";

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
    <header className="bg-white p-4 shadow-md">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>

          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative w-full md:w-64 lg:w-80">
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={18}
              />
            </div>

            <AddOrganizationButton className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:w-auto">
              <PlusIcon className="mr-2 inline-block" size={16} />
              Create new Organization
            </AddOrganizationButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
